/** @format */

import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { auth } from "@/auth";
import { checkRateLimit, redis } from "@/lib/ratelimit";
import { initializeBachsPayment } from "@/lib/payments/bachs";
import { BASE_PRICES_USD, CURRENCIES, PlanKey } from "@/lib/currency";

const initializeSchema = z.object({
	plan: z.enum(["LANDING_PAGE", "SALES_FUNNEL", "E_COMMERCE"]),
	billingCycle: z.enum(["monthly", "yearly"]).default("monthly"),
	currency: z.string().default("USD"),
});

const PLAN_MAP: Record<string, PlanKey> = {
	LANDING_PAGE: "landing",
	SALES_FUNNEL: "funnel",
	E_COMMERCE: "store",
};

/**
 * POST /api/payments/initialize - Initializes a Bachs.io checkout session with Idempotency Double-Charge Protection
 */
export async function POST(request: Request) {
	try {
		const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
		const rateLimit = await checkRateLimit(ip, "checkout");
		if (!rateLimit.success) {
			return NextResponse.json(
				{ error: "Too many payment requests. Please try again later." },
				{ status: 429 },
			);
		}

		// 1. Authenticate User
		const authSession = await auth();
		const customUser = await getAuthenticatedUser();
		const userId = authSession?.user?.id || customUser?.id;
		const userEmail = authSession?.user?.email || customUser?.email;
		const userName = authSession?.user?.name || customUser?.name || "Kiosk Subscriber";

		if (!userId || !userEmail) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// 2. Strict Idempotency Lock Check (Prevents Double Charging)
		const idempotencyKey = request.headers.get("Idempotency-Key");
		if (idempotencyKey && redis) {
			const lockKey = `@kiosk/idempotency:${idempotencyKey}`;
			const isLocked = await redis.set(lockKey, "LOCKED", { nx: true, ex: 300 });
			if (!isLocked) {
				return NextResponse.json(
					{ error: "A payment request with this Idempotency-Key is already processing." },
					{ status: 409 },
				);
			}
		}

		const body = await request.json();
		const validation = initializeSchema.safeParse(body);
		if (!validation.success) {
			return NextResponse.json(
				{ error: "Invalid payload", details: validation.error.flatten() },
				{ status: 400 },
			);
		}

		const { plan, billingCycle, currency } = validation.data;
		const planKey = PLAN_MAP[plan] || "landing";
		const baseUsdAmount = BASE_PRICES_USD[planKey][billingCycle];

		const currencyCode = currency.toUpperCase();
		const targetCurrency = CURRENCIES[currencyCode] || CURRENCIES.USD;

		// Convert USD base price to user's currency
		const amount = baseUsdAmount * targetCurrency.rateFromUSD;
		const tx_ref = `kiosk_tx_${crypto.randomUUID()}`;
		const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

		const paymentResult = await initializeBachsPayment({
			amount,
			usdAmount: baseUsdAmount,
			currency: targetCurrency.code,
			email: userEmail,
			name: userName,
			tx_ref,
			redirect_url: `${appUrl}/dashboard/content?payment=complete&plan=${plan}`,
			meta: {
				userId,
				plan,
			},
		});

		if (!paymentResult.success || !paymentResult.link) {
			return NextResponse.json(
				{ error: paymentResult.error || "Failed to initialize payment" },
				{ status: 500 },
			);
		}

		return NextResponse.json({
			status: "success",
			link: paymentResult.link,
			tx_ref,
		});
	} catch (err) {
		console.error("[INITIALIZE_BACHS_PAYMENT_ERROR]", err);
		return NextResponse.json(
			{ error: "Failed to initialize payment process" },
			{ status: 500 },
		);
	}
}
