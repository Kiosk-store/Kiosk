/** @format */

import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { forgotPasswordSchema } from "@/lib/auth/password";
import { buildRateLimitHeaders, checkRateLimit } from "@/lib/ratelimit";
import { sendPasswordResetEmail, getAppUrl } from "@/lib/email";
import { Logger } from "@/lib/logger";
import {
	claimFormTokenNonce,
	getClientIp,
	isHoneypotTripped,
	verifyFormToken,
	verifySameOrigin,
} from "@/lib/security/antispam";
import {
	extractTurnstileToken,
	verifyTurnstileToken,
} from "@/lib/security/turnstile";

export async function POST(request: Request) {
	try {
		const ip = getClientIp(request);

		// 1. Same-Origin Check
		const originCheck = verifySameOrigin(request);
		if (!originCheck.ok) {
			Logger.warn("Blocked forgot-password request with invalid origin", {
				route: "/api/auth/forgot-password",
				ip,
				reason: originCheck.reason,
			});
			return NextResponse.json(
				{ error: "Invalid request origin." },
				{ status: 403 },
			);
		}

		// 2. Strict Rate Limiting Check (3 requests / 15 min per trusted IP)
		const rateLimit = await checkRateLimit(ip, "forgotPassword");
		if (!rateLimit.success) {
			return NextResponse.json(
				{ error: "Too many password reset attempts. Please try again later." },
				{
					status: 429,
					headers: buildRateLimitHeaders(rateLimit),
				},
			);
		}

		// 3. Parse Payload Safely
		const body = await request.json().catch(() => null);
		if (!body || typeof body !== "object" || Array.isArray(body)) {
			return NextResponse.json(
				{ error: "Invalid request payload." },
				{ status: 400 },
			);
		}

		// 4. Honeypot Check
		if (isHoneypotTripped(body)) {
			Logger.warn("Forgot-password honeypot triggered", {
				route: "/api/auth/forgot-password",
				ip,
			});
			return NextResponse.json(
				{ error: "Unable to process your request. Please refresh the page and try again." },
				{ status: 400 },
			);
		}

		// 5. Signed Form-Load Timestamp Verification
		const rawBody = body as Record<string, unknown>;
		const tokenCheck = await verifyFormToken(rawBody.formToken, "forgot-password", {
			minElapsedMs: 1200,
		});
		if (!tokenCheck.ok) {
			Logger.warn("Forgot-password form token rejected", {
				route: "/api/auth/forgot-password",
				ip,
				code: tokenCheck.code,
			});

			if (tokenCheck.code === "misconfigured") {
				return NextResponse.json(
					{ error: "Security configuration error. Please contact support." },
					{ status: 500 },
				);
			}

			if (tokenCheck.code === "too_fast") {
				return NextResponse.json(
					{
						error: "Please wait a moment before requesting a password reset.",
						code: "FORM_SUBMITTED_TOO_FAST",
					},
					{ status: 400 },
				);
			}

			if (tokenCheck.code === "expired" || tokenCheck.code === "replayed") {
				return NextResponse.json(
					{
						error: "Your form session expired. Please try submitting again.",
						code: "FORM_TOKEN_EXPIRED",
					},
					{ status: 400 },
				);
			}

			return NextResponse.json(
				{
					error: "Invalid or missing security token. Please refresh the page and try again.",
					code: "FORM_TOKEN_INVALID",
				},
				{ status: 400 },
			);
		}

		// 6. Validate Payload
		const validation = forgotPasswordSchema.safeParse(body);
		if (!validation.success) {
			const firstIssue = validation.error.issues[0]?.message;
			return NextResponse.json(
				{
					error: firstIssue || "Validation failed",
					details: validation.error.flatten().fieldErrors,
				},
				{ status: 400 },
			);
		}

		// 7. Cloudflare Turnstile Server-Side Verification
		const turnstileToken = extractTurnstileToken(body);
		const turnstileCheck = await verifyTurnstileToken({
			token: turnstileToken,
			ip,
			expectedAction: "forgot-password",
		});
		if (!turnstileCheck.ok) {
			Logger.warn("Forgot-password Turnstile verification failed", {
				route: "/api/auth/forgot-password",
				ip,
				code: turnstileCheck.code,
				errorCodes: turnstileCheck.errorCodes,
			});

			const status =
				turnstileCheck.code === "misconfigured"
					? 500
					: turnstileCheck.code === "network_error"
						? 503
						: 400;
			const responseCode =
				turnstileCheck.code === "missing"
					? "TURNSTILE_REQUIRED"
					: turnstileCheck.code === "expired"
						? "TURNSTILE_EXPIRED"
						: turnstileCheck.code === "misconfigured"
							? "TURNSTILE_MISCONFIGURED"
							: "TURNSTILE_FAILED";

			return NextResponse.json(
				{
					error: turnstileCheck.message || "Security verification failed. Please try again.",
					code: responseCode,
					resetTurnstile: turnstileCheck.code !== "missing",
				},
				{ status },
			);
		}

		// 8. Atomically claim nonce before database lookup & email dispatch
		const nonceClaimed = await claimFormTokenNonce(tokenCheck.nonce);
		if (!nonceClaimed) {
			return NextResponse.json(
				{
					error: "Your form session expired. Please try submitting again.",
					code: "FORM_TOKEN_EXPIRED",
					resetTurnstile: true,
				},
				{ status: 400 },
			);
		}

		const email = validation.data.email.toLowerCase().trim();

		// 8. Secondary per-email throttle (prevents email-bombing a single inbox without leaking existence)
		const emailLimit = await checkRateLimit(`email:${email}`, "forgotPassword");

		if (emailLimit.success) {
			// 9. Lookup user in database
			const user = await db.query.users.findFirst({
				where: eq(users.email, email),
			});

			// If user exists, generate reset token and dispatch email
			if (user) {
				const resetToken = crypto.randomUUID();
				const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

				// Clean up previous tokens for this email
				try {
					await db
						.delete(verificationTokens)
						.where(eq(verificationTokens.identifier, email));
				} catch {
					// Non-blocking
				}

				// Store verification token
				await db.insert(verificationTokens).values({
					identifier: email,
					token: resetToken,
					expires,
				});

				// Build reset URL using canonical app URL (never blindly trusting unvalidated host headers)
				const appUrl = getAppUrl().replace(/\/$/, "");
				const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(
					resetToken,
				)}&email=${encodeURIComponent(email)}`;

				// Await email dispatch to ensure execution completes in serverless environments
				try {
					const emailResult = await sendPasswordResetEmail({
						toEmail: email,
						userName: user.name || "Kioosk User",
						resetUrl,
					});
					if (!emailResult.success) {
						console.error("[PASSWORD_RESET_EMAIL_SEND_FAILED]", emailResult.error);
					}
				} catch (err) {
					console.error("[PASSWORD_RESET_EMAIL_ERROR]", err);
				}
			}
		}

		// Generic safe response to prevent user enumeration attacks
		return NextResponse.json(
			{
				message:
					"If an account exists with this email address, a password reset link has been sent.",
			},
			{
				status: 200,
				headers: buildRateLimitHeaders(rateLimit),
			},
		);
	} catch (error) {
		console.error("[FORGOT_PASSWORD_ERROR]", error);
		return NextResponse.json(
			{ error: "An unexpected error occurred while processing your request." },
			{ status: 500 },
		);
	}
}
