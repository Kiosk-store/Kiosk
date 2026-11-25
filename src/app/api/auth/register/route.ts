/** @format */

import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, registerInputSchema } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { buildRateLimitHeaders, checkRateLimit } from "@/lib/ratelimit";
import { sendWelcomeEmail } from "@/lib/email";
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

		// 1. Same-Origin / Cross-Site Request Check
		const originCheck = verifySameOrigin(request);
		if (!originCheck.ok) {
			Logger.warn("Blocked registration with invalid origin", {
				route: "/api/auth/register",
				ip,
				reason: originCheck.reason,
			});
			return NextResponse.json(
				{ error: "Invalid request origin. Please sign up directly from the website." },
				{ status: 403 },
			);
		}

		// 2. Per-IP Registration Rate Limit (4/hour per trusted IP, with in-memory fallback)
		const ipRateLimit = await checkRateLimit(ip, "register");
		if (!ipRateLimit.success) {
			Logger.warn("Registration IP rate limit exceeded", {
				route: "/api/auth/register",
				ip,
				fallback: ipRateLimit.fallback ?? false,
			});
			return NextResponse.json(
				{ error: "Too many registration attempts from your network. Please try again later." },
				{
					status: 429,
					headers: buildRateLimitHeaders(ipRateLimit),
				},
			);
		}

		// 3. Parse JSON Payload Safely
		const body = await request.json().catch(() => null);
		if (!body || typeof body !== "object" || Array.isArray(body)) {
			return NextResponse.json(
				{ error: "Invalid request payload." },
				{ status: 400 },
			);
		}

		// 4. Honeypot Check (rejects bots populating hidden fields)
		if (isHoneypotTripped(body)) {
			Logger.warn("Registration honeypot triggered", {
				route: "/api/auth/register",
				ip,
			});
			return NextResponse.json(
				{ error: "Unable to process registration. Please refresh the page and try again." },
				{ status: 400 },
			);
		}

		// 5. Signed Form-Load Timestamp Verification (rejects API-only, instant, & replayed submits)
		const rawBody = body as Record<string, unknown>;
		const tokenCheck = await verifyFormToken(rawBody.formToken, "signup", {
			minElapsedMs: 2500,
		});
		if (!tokenCheck.ok) {
			Logger.warn("Registration form token rejected", {
				route: "/api/auth/register",
				ip,
				code: tokenCheck.code,
				elapsedMs: tokenCheck.elapsedMs,
			});

			if (tokenCheck.code === "misconfigured") {
				return NextResponse.json(
					{ error: "Registration security is temporarily misconfigured. Please contact support." },
					{ status: 500 },
				);
			}

			if (tokenCheck.code === "too_fast") {
				return NextResponse.json(
					{
						error: "Please take a moment to review the form before submitting.",
						code: "FORM_SUBMITTED_TOO_FAST",
					},
					{ status: 400 },
				);
			}

			if (tokenCheck.code === "expired" || tokenCheck.code === "replayed") {
				return NextResponse.json(
					{
						error: "Your signup form session expired. Please try submitting again.",
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

		// 6. Strict Field Validation (name blocks URLs/HTML, email blocks disposable domains)
		const validation = registerInputSchema.safeParse(body);
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

		const { name, email, password } = validation.data;
		const normalizedEmail = email.toLowerCase().trim();

		// 7. Cloudflare Turnstile Server-Side Verification (single-use token + action + hostname)
		const turnstileToken = extractTurnstileToken(body);
		const turnstileCheck = await verifyTurnstileToken({
			token: turnstileToken,
			ip,
			expectedAction: "signup",
		});
		if (!turnstileCheck.ok) {
			Logger.warn("Registration Turnstile verification failed", {
				route: "/api/auth/register",
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

		// 8. Global Registration Burst Cap (25/10min across all IPs) — enforced AFTER
		// honeypot, form token, validation, and Turnstile so invalid traffic cannot DoS real users.
		const globalRateLimit = await checkRateLimit("global", "registerGlobal");
		if (!globalRateLimit.success) {
			Logger.warn("Global registration burst cap exceeded", {
				route: "/api/auth/register",
				ip,
				fallback: globalRateLimit.fallback ?? false,
			});
			return NextResponse.json(
				{
					error: "Registration is temporarily busy. Please try again in a few minutes.",
					resetTurnstile: true,
				},
				{
					status: 429,
					headers: buildRateLimitHeaders(globalRateLimit),
				},
			);
		}

		// 9. Check for existing user
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, normalizedEmail),
		});

		if (existingUser) {
			return NextResponse.json(
				{
					error: "An account with this email address already exists.",
					resetTurnstile: true,
				},
				{ status: 409 },
			);
		}

		// 10. Atomically claim form token nonce BEFORE hashing/inserting to prevent concurrent replay
		const nonceClaimed = await claimFormTokenNonce(tokenCheck.nonce);
		if (!nonceClaimed) {
			return NextResponse.json(
				{
					error: "Your signup form session expired. Please try submitting again.",
					code: "FORM_TOKEN_EXPIRED",
					resetTurnstile: true,
				},
				{ status: 400 },
			);
		}

		// 10. Hash password & insert user record
		const passwordHash = await hashPassword(password);
		const [newUser] = await db
			.insert(users)
			.values({
				name,
				email: normalizedEmail,
				passwordHash,
				role: "USER",
			})
			.returning();

		// 11. Create Session & Set HTTP-Only Cookie
		await createSession(newUser.id);

		// 12. Dispatch Welcome Email (awaited inside non-blocking try/catch for serverless reliability)
		try {
			await sendWelcomeEmail(newUser.email, newUser.name || "Valued User");
		} catch (err) {
			console.error("[REGISTER_WELCOME_EMAIL_ERROR]", err);
		}

		return NextResponse.json(
			{
				message: "Account created successfully",
				user: {
					id: newUser.id,
					name: newUser.name,
					email: newUser.email,
					role: newUser.role,
				},
			},
			{
				status: 201,
				headers: buildRateLimitHeaders(ipRateLimit),
			},
		);
	} catch (error) {
		console.error("[REGISTER_ERROR]", error);
		return NextResponse.json(
			{ error: "An unexpected error occurred during registration." },
			{ status: 500 },
		);
	}
}
