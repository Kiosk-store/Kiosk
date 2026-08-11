/**
 * Bachs.io Payment Gateway Integration Engine
 *
 * Provides enterprise payment processing via the Bachs REST API v1:
 * 1. Initialize Checkout Session (`initializeBachsPayment`)
 * 2. Verify Webhook Signature (`verifyBachsWebhookSignature`)
 *
 * Bachs API docs: https://docs.bachs.io
 * - Sandbox base URL: https://sandbox-api.bachs.io
 * - Production base URL: https://api.bachs.io
 * - Auth: Bearer token using BACHS_SECRET_KEY
 * - Webhook event: collection.succeeded
 * - Signature: HMAC-SHA256 of "{X-Bachs-Timestamp}.{raw_body}"
 *
 * @module bachs
 * @format
 */

import crypto from "crypto";

const BACHS_SECRET_KEY = process.env.BACHS_SECRET_KEY || "";
const BACHS_WEBHOOK_SECRET = process.env.BACHS_WEBHOOK_SECRET || "";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const BACHS_BASE_URL = IS_PRODUCTION
	? "https://api.bachs.io"
	: "https://sandbox-api.bachs.io";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface InitializePaymentInput {
	/** Amount in USD (decimal string, e.g. "20.00") */
	amount: number;
	/** ISO 4217 currency code — Bachs auto-converts if USD is used */
	currency: string;
	email: string;
	name: string;
	/** Your own unique reference / tx_ref */
	tx_ref: string;
	/** Where Bachs redirects on success — ?checkout_id= is appended */
	redirect_url: string;
	/** Optional metadata forwarded in webhooks (up to 20 key/value pairs) */
	meta?: Record<string, any>;
}

export interface InitializePaymentResponse {
	success: boolean;
	link?: string;
	checkoutId?: string;
	error?: string;
}

/* ------------------------------------------------------------------ */
/*  Checkout session initialization                                     */
/* ------------------------------------------------------------------ */

/**
 * Initializes a Bachs checkout session and returns the hosted checkout URL.
 * Uses the "raw amount" flow (no catalog product required).
 */
export async function initializeBachsPayment(
	input: InitializePaymentInput,
): Promise<InitializePaymentResponse> {
	// Dev/test mock — no secret key configured
	if (!BACHS_SECRET_KEY) {
		console.log(
			`[BACHS_DEV_MOCK] Payment initialized for ${input.email} | Amount: ${input.currency} ${input.amount}`,
		);
		return {
			success: true,
			checkoutId: `chk_dev_${crypto.randomUUID().slice(0, 10)}`,
			link: `${input.redirect_url}?checkout_id=dev_chk_${crypto.randomUUID().slice(0, 8)}&status=successful`,
		};
	}

	try {
		const response = await fetch(`${BACHS_BASE_URL}/v1/checkout-sessions`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${BACHS_SECRET_KEY}`,
			},
			body: JSON.stringify({
				pricing: {
					currency: input.currency.toUpperCase(),
					amount: input.amount.toFixed(2),
				},
				customer: {
					email: input.email,
					name: input.name,
				},
				success_url: input.redirect_url,
				cancel_url: input.redirect_url.split("?")[0], // fallback to base URL on cancel
				reference: input.tx_ref,
				metadata: input.meta ?? {},
			}),
		});

		const result = await response.json();

		if (!response.ok || !result.checkout_url) {
			console.error("[BACHS_INIT_ERROR]", result);
			return {
				success: false,
				error: result.message || result.error || "Failed to initialize Bachs checkout session",
			};
		}

		return {
			success: true,
			link: result.checkout_url,
			checkoutId: result.checkout_id,
		};
	} catch (err) {
		console.error("[BACHS_INIT_EXCEPTION]", err);
		return {
			success: false,
			error: "Unexpected network error during Bachs payment initialization",
		};
	}
}

/* ------------------------------------------------------------------ */
/*  Webhook signature verification                                      */
/* ------------------------------------------------------------------ */

/**
 * Verifies a Bachs webhook delivery using HMAC-SHA256.
 *
 * Bachs signs each delivery with:
 *   X-Bachs-Timestamp: Unix timestamp (seconds)
 *   X-Bachs-Signature: HMAC-SHA256 hex of "{timestamp}.{raw_body}"
 *
 * @param rawBody     Raw request body as a string (before JSON parsing)
 * @param timestamp   Value of the X-Bachs-Timestamp header
 * @param signature   Value of the X-Bachs-Signature header
 * @param toleranceSecs  Max age in seconds before rejecting stale events (default 300s)
 */
export function verifyBachsWebhookSignature(
	rawBody: string,
	timestamp: string,
	signature: string,
	toleranceSecs = 300,
): boolean {
	if (!BACHS_WEBHOOK_SECRET) {
		// In dev mode without a secret, accept all webhooks (log a warning)
		console.warn("[BACHS_WEBHOOK] No BACHS_WEBHOOK_SECRET set — skipping signature check");
		return true;
	}

	try {
		const ts = parseInt(timestamp, 10);
		if (isNaN(ts)) return false;

		// Reject stale deliveries
		if (Math.abs(Date.now() / 1000 - ts) > toleranceSecs) {
			console.warn("[BACHS_WEBHOOK] Stale webhook delivery rejected");
			return false;
		}

		const message = `${ts}.${rawBody}`;
		const expected = crypto
			.createHmac("sha256", BACHS_WEBHOOK_SECRET)
			.update(message, "utf8")
			.digest("hex");

		return crypto.timingSafeEqual(
			Buffer.from(expected, "hex"),
			Buffer.from(signature, "hex"),
		);
	} catch (err) {
		console.error("[BACHS_WEBHOOK_VERIFY_ERROR]", err);
		return false;
	}
}

/* ------------------------------------------------------------------ */
/*  Legacy alias — keeps any existing imports working                   */
/* ------------------------------------------------------------------ */

/** @deprecated Use initializeBachsPayment instead */
export const initializeFlutterwavePayment = initializeBachsPayment;
