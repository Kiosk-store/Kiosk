/**
 * Canonical Cloudflare Turnstile Server-Side Verification (`siteverify`)
 *
 * Implements Cloudflare's recommended server-side checks:
 * - POST https://challenges.cloudflare.com/turnstile/v0/siteverify
 * - Secret key read strictly from server env (`TURNSTILE_SECRET_KEY` or `TURNSTILE_SECRET`)
 * - Sends `remoteip` and UUID `idempotency_key`
 * - Enforces token length <= 2048, single-use rejection (`timeout-or-duplicate`),
 *   canonical `hostname` validation, and `expectedAction` validation
 * - Fails CLOSED in production if secret key is missing or Cloudflare is unreachable
 *
 * @module security/turnstile
 * @format
 */

import crypto from "crypto";

const TURNSTILE_SITEVERIFY_URL =
	"https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TIMEOUT_MS = 8000;
const MAX_TURNSTILE_TOKEN_LENGTH = 2048;

// Official Cloudflare dummy test secrets (used only in local dev / automated testing)
const CLOUDFLARE_TEST_SECRETS = new Set<string>([
	"1x0000000000000000000000000000000AA",
	"2x0000000000000000000000000000000AA",
	"3x0000000000000000000000000000000AA",
]);

export type TurnstileAction = "signup" | "forgot-password" | "contact";

export type TurnstileErrorCode =
	| "missing"
	| "misconfigured"
	| "expired"
	| "failed"
	| "hostname_mismatch"
	| "action_mismatch"
	| "network_error";

export interface TurnstileVerificationResult {
	ok: boolean;
	code?: TurnstileErrorCode;
	message?: string;
	hostname?: string;
	action?: string;
	errorCodes?: string[];
	skippedInDev?: boolean;
}

interface SiteverifyApiResponse {
	success: boolean;
	challenge_ts?: string;
	hostname?: string;
	action?: string;
	cdata?: string;
	"error-codes"?: string[];
}

function getTurnstileSecret(): string {
	return (
		process.env.TURNSTILE_SECRET_KEY ||
		process.env.TURNSTILE_SECRET ||
		""
	).trim();
}

function addHostnameFromEnv(set: Set<string>, rawUrl?: string): void {
	if (!rawUrl) return;
	const trimmed = rawUrl.trim();
	if (!trimmed) return;
	try {
		const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
		const parsed = new URL(withProto);
		if (parsed.hostname) {
			set.add(parsed.hostname.toLowerCase());
		}
	} catch {
		// Ignore malformed env values
	}
}

function getAllowedTurnstileHostnames(isTestSecret: boolean): Set<string> {
	const allowed = new Set<string>(["kioosk.online", "www.kioosk.online"]);
	addHostnameFromEnv(allowed, process.env.NEXT_PUBLIC_APP_URL);
	addHostnameFromEnv(allowed, process.env.AUTH_URL);
	addHostnameFromEnv(allowed, process.env.NEXTAUTH_URL);
	addHostnameFromEnv(allowed, process.env.VERCEL_URL);
	addHostnameFromEnv(allowed, process.env.VERCEL_BRANCH_URL);
	addHostnameFromEnv(allowed, process.env.VERCEL_PROJECT_PRODUCTION_URL);

	if (process.env.NODE_ENV !== "production") {
		allowed.add("localhost");
		allowed.add("127.0.0.1");
	}

	// Cloudflare's dummy test keys return hostname "example.com"
	if (isTestSecret) {
		allowed.add("example.com");
	}

	return allowed;
}

/**
 * Extracts a Turnstile token from either `turnstileToken` or Cloudflare's
 * standard `cf-turnstile-response` payload key.
 */
export function extractTurnstileToken(body: unknown): string {
	if (!body || typeof body !== "object" || Array.isArray(body)) {
		return "";
	}
	const record = body as Record<string, unknown>;
	const raw = record.turnstileToken ?? record["cf-turnstile-response"];
	return typeof raw === "string" ? raw.trim() : "";
}

/**
 * Verifies a Turnstile client token against Cloudflare's `siteverify` API.
 */
export async function verifyTurnstileToken({
	token,
	ip,
	expectedAction,
}: {
	token: string;
	ip?: string;
	expectedAction?: TurnstileAction;
}): Promise<TurnstileVerificationResult> {
	const secret = getTurnstileSecret();

	if (!secret) {
		if (process.env.NODE_ENV === "production") {
			console.error(
				"[TURNSTILE_MISCONFIGURED] TURNSTILE_SECRET_KEY (or TURNSTILE_SECRET) is missing in production.",
			);
			return {
				ok: false,
				code: "misconfigured",
				message: "Security verification is temporarily unavailable. Please contact support.",
			};
		}

		console.warn(
			"[TURNSTILE_DEV_SKIP] TURNSTILE_SECRET_KEY is not set; skipping Turnstile server verification in development.",
		);
		return { ok: true, skippedInDev: true };
	}

	const trimmedToken = token.trim();
	if (!trimmedToken || trimmedToken.length > MAX_TURNSTILE_TOKEN_LENGTH) {
		return {
			ok: false,
			code: "missing",
			message: "Please complete the security verification check before submitting.",
		};
	}

	const isTestSecret = CLOUDFLARE_TEST_SECRETS.has(secret);
	if (process.env.NODE_ENV === "production" && isTestSecret) {
		console.error(
			"[TURNSTILE_MISCONFIGURED] Cloudflare dummy test secret key cannot be used in production.",
		);
		return {
			ok: false,
			code: "misconfigured",
			message: "Security verification is misconfigured. Please contact support.",
		};
	}
	const payload: Record<string, string> = {
		secret,
		response: trimmedToken,
		idempotency_key: crypto.randomUUID(),
	};

	if (ip && ip !== "unknown") {
		payload.remoteip = ip;
	}

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), TURNSTILE_TIMEOUT_MS);

	try {
		const res = await fetch(TURNSTILE_SITEVERIFY_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			cache: "no-store",
			signal: controller.signal,
		});

		if (!res.ok) {
			return {
				ok: false,
				code: "network_error",
				message: "Could not reach security verification service. Please try again.",
			};
		}

		const data = (await res.json()) as SiteverifyApiResponse;
		const errorCodes = Array.isArray(data["error-codes"]) ? data["error-codes"] : [];

		if (!data.success) {
			const isExpiredOrDuplicate = errorCodes.includes("timeout-or-duplicate");
			return {
				ok: false,
				code: isExpiredOrDuplicate ? "expired" : "failed",
				errorCodes,
				message: isExpiredOrDuplicate
					? "Security check expired. Please complete it again."
					: "Security verification failed. Please try again.",
			};
		}

		// Verify hostname returned by Cloudflare is present and matches our canonical allowed domains
		const allowedHostnames = getAllowedTurnstileHostnames(isTestSecret);
		const returnedHostname = typeof data.hostname === "string" ? data.hostname.trim().toLowerCase() : "";
		if (!returnedHostname || !allowedHostnames.has(returnedHostname)) {
			return {
				ok: false,
				code: "hostname_mismatch",
				hostname: data.hostname,
				message: "Security verification failed for this domain.",
			};
		}

		// Verify widget action matches the endpoint to prevent cross-form token reuse
		if (expectedAction && !isTestSecret) {
			if (!data.action || data.action !== expectedAction) {
				return {
					ok: false,
					code: "action_mismatch",
					action: data.action,
					message: "Security verification mismatch. Please refresh and try again.",
				};
			}
		}

		return {
			ok: true,
			hostname: data.hostname,
			action: data.action,
		};
	} catch (err) {
		console.error("[TURNSTILE_SITEVERIFY_EXCEPTION]", err);
		return {
			ok: false,
			code: "network_error",
			message: "Could not reach security verification service. Please try again.",
		};
	} finally {
		clearTimeout(timeoutId);
	}
}
