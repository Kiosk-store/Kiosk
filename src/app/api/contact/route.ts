/** @format */

import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { buildRateLimitHeaders, checkRateLimit } from "@/lib/ratelimit";
import { sendSupportTicketEmail } from "@/lib/email";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { Logger } from "@/lib/logger";
import {
	claimFormTokenNonce,
	containsUrlOrDomain,
	getClientIp,
	hasUnsafeUrlScheme,
	isDisposableEmail,
	isHoneypotTripped,
	validateHumanName,
	verifyFormToken,
	verifySameOrigin,
} from "@/lib/security/antispam";
import {
	extractTurnstileToken,
	verifyTurnstileToken,
} from "@/lib/security/turnstile";

export const dynamic = "force-dynamic";

const baseContactSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters.")
		.max(64, "Name must be 64 characters or fewer."),
	email: z
		.string()
		.trim()
		.toLowerCase()
		.max(254, "Email address is too long.")
		.email("Please provide a valid email address.")
		.refine((val) => !/[\r\n]/.test(val), "Please provide a valid email address."),
	phone: z.string().trim().max(32, "Phone number is too long.").optional().or(z.literal("")),
	category: z.string().trim().max(80).default("Technical Support & Site Edits"),
	priority: z.enum(["normal", "high", "urgent"]).default("normal"),
	subject: z
		.string()
		.trim()
		.min(3, "Subject must be at least 3 characters.")
		.max(140, "Subject must be 140 characters or fewer.")
		.refine((val) => !/[\r\n]/.test(val), "Subject cannot contain line breaks."),
	message: z
		.string()
		.trim()
		.min(10, "Message must be at least 10 characters.")
		.max(4000, "Message must be 4000 characters or fewer."),
	websiteUrl: z
		.string()
		.trim()
		.max(200, "Website URL is too long.")
		.optional()
		.or(z.literal(""))
		.refine((val) => !val || !hasUnsafeUrlScheme(val), "Invalid website URL."),
});

/**
 * POST /api/contact (also re-exported by /api/support)
 * Handles inbound customer support requests, website edit tickets, and sales inquiries.
 */
export async function POST(request: Request) {
	try {
		const ip = getClientIp(request);

		// 1. Same-Origin Check
		const originCheck = verifySameOrigin(request);
		if (!originCheck.ok) {
			Logger.warn("Blocked contact submission with invalid origin", {
				route: "/api/contact",
				ip,
				reason: originCheck.reason,
			});
			return NextResponse.json(
				{ error: "Invalid request origin." },
				{ status: 403 },
			);
		}

		// 2. Strict Contact Rate Limiting (5 requests / 15 min per trusted IP)
		const rateLimit = await checkRateLimit(ip, "contact");
		if (!rateLimit.success) {
			return NextResponse.json(
				{ error: "Too many support requests. Please wait a few minutes before submitting again." },
				{
					status: 429,
					headers: buildRateLimitHeaders(rateLimit),
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

		// 4. Honeypot Check
		if (isHoneypotTripped(body)) {
			Logger.warn("Contact form honeypot triggered", {
				route: "/api/contact",
				ip,
			});
			return NextResponse.json(
				{ error: "Unable to process your inquiry. Please refresh the page and try again." },
				{ status: 400 },
			);
		}

		// 5. Determine whether request comes from an authenticated session or public /contact form
		const authenticatedUser = await getAuthenticatedUser();
		const rawBody = body as Record<string, unknown>;
		const providedFormToken =
			typeof rawBody.formToken === "string" ? rawBody.formToken.trim() : "";

		let nonceToClaim: string | undefined;

		if (!authenticatedUser || providedFormToken.length > 0) {
			const tokenCheck = await verifyFormToken(providedFormToken, "contact", {
				minElapsedMs: 2500,
			});

			if (!tokenCheck.ok) {
				Logger.warn("Contact form token rejected", {
					route: "/api/contact",
					ip,
					code: tokenCheck.code,
					authenticated: Boolean(authenticatedUser),
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
							error: "Please take a moment to review your message before submitting.",
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

			nonceToClaim = tokenCheck.nonce;
		}

		// 6. Field Validation
		// For authenticated users submitting without a public formToken (e.g. Dashboard Support Drawer),
		// bind email to their verified session email and safely fallback display name.
		const isDashboardAuthSubmit = Boolean(authenticatedUser && !providedFormToken);
		const rawAuthName = (authenticatedUser?.name || "").trim().slice(0, 64);
		const safeAuthName = rawAuthName.length >= 2 ? rawAuthName : "Client User";
		const candidatePayload = isDashboardAuthSubmit
			? {
					...rawBody,
					name: safeAuthName,
					email: authenticatedUser!.email,
			  }
			: rawBody;

		const parseResult = baseContactSchema.safeParse(candidatePayload);
		if (!parseResult.success) {
			const issues = parseResult.error.issues || [];
			const errorMsg =
				issues.length > 0
					? issues.map((i: { message: string }) => i.message).join(" ")
					: "Please check all required fields and provide valid information.";
			return NextResponse.json(
				{ error: errorMsg, details: parseResult.error.flatten() },
				{ status: 400 },
			);
		}

		const { name, email, phone, category, priority, subject, message, websiteUrl } =
			parseResult.data;

		// Enforce strict anti-spam name, subject-link, and disposable-email rules on public submissions
		if (!isDashboardAuthSubmit) {
			const nameCheck = validateHumanName(name);
			if (!nameCheck.valid) {
				return NextResponse.json(
					{ error: nameCheck.reason || "Please enter a valid name." },
					{ status: 400 },
				);
			}

			if (containsUrlOrDomain(subject)) {
				return NextResponse.json(
					{ error: "Subject cannot contain links or website addresses." },
					{ status: 400 },
				);
			}

			if (!authenticatedUser || email !== authenticatedUser.email.toLowerCase()) {
				if (isDisposableEmail(email)) {
					return NextResponse.json(
						{
							error: "Disposable or temporary email addresses are not allowed. Please use a permanent email address so we can reply.",
						},
						{ status: 400 },
					);
				}
			}
		}

		// 7. Cloudflare Turnstile Server-Side Verification for unauthenticated public submissions
		if (!authenticatedUser) {
			const turnstileToken = extractTurnstileToken(body);
			const turnstileCheck = await verifyTurnstileToken({
				token: turnstileToken,
				ip,
				expectedAction: "contact",
			});
			if (!turnstileCheck.ok) {
				Logger.warn("Contact Turnstile verification failed", {
					route: "/api/contact",
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
		}

		// 8. Atomically claim form token nonce BEFORE sending emails
		if (nonceToClaim) {
			const claimed = await claimFormTokenNonce(nonceToClaim);
			if (!claimed) {
				return NextResponse.json(
					{
						error: "Your form session expired. Please try submitting again.",
						code: "FORM_TOKEN_EXPIRED",
						resetTurnstile: true,
					},
					{ status: 400 },
				);
			}
		}

		// Generate structured ticket ID: e.g. KSK-849201
		const randomSuffix = crypto.randomInt(100000, 1000000);
		const ticketId = `KSK-${randomSuffix}`;

		// Dispatch notifications via email system
		await sendSupportTicketEmail({
			ticketId,
			name,
			email,
			phone,
			category,
			priority,
			subject,
			message,
			websiteUrl,
		}).catch((err) => {
			console.error("[CONTACT_EMAIL_DISPATCH_ERROR]", err);
		});

		return NextResponse.json(
			{
				success: true,
				ticketId,
				message:
					"Your support inquiry has been received. A confirmation has been sent to your email.",
			},
			{
				status: 200,
				headers: buildRateLimitHeaders(rateLimit),
			},
		);
	} catch (error) {
		console.error("[CONTACT_ROUTE_EXCEPTION]", error);
		return NextResponse.json(
			{ error: "An unexpected server error occurred while processing your request." },
			{ status: 500 },
		);
	}
}
