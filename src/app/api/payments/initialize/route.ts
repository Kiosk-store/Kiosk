/** @format */

import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { auth } from "@/auth";
import { checkRateLimit, redis } from "@/lib/ratelimit";
import { initializeFlutterwavePayment } from "@/lib/flutterwave";

const initializeSchema = z.object({
	plan: z.enum(["LANDING_PAGE", "SALES_FUNNEL", "E_COMMERCE"]),
	currency: z.enum(["USD", "NGN", "GHS", "KES"]).default("USD"),
});

const PLAN_PRICES: Record<string, number> = {
	LANDING_PAGE: 20,
	SALES_FUNNEL: 30,
	E_COMMERCE: 43,
};

/**
 * POST /api/payments/initialize - Initializes a Flutterwave payment with Idempotency Double-Charge Protection
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

		const { plan, currency } = validation.data;
		const amount = PLAN_PRICES[plan];
		const tx_ref = `kiosk_tx_${crypto.randomUUID()}`;
		const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

		const paymentResult = await initializeFlutterwavePayment({
			amount,
			currency,
			email: userEmail,
			name: userName,
			tx_ref,
			redirect_url: `${appUrl}/dashboard/content?payment=complete&plan=${plan}`,
			title: `Kiosk ${plan.replace("_", " ")} Subscription`,
			description: `Monthly subscription fee for Kiosk ${plan} tier`,
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
		console.error("[INITIALIZE_PAYMENT_ERROR]", err);
		return NextResponse.json(
			{ error: "Failed to initialize payment process" },
			{ status: 500 },
		);
	}
}
