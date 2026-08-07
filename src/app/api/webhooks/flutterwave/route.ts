/** @format */

import { NextResponse } from "next/server";
import { db } from "@/db";
import { tenants, subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redis } from "@/lib/ratelimit";
import { verifyFlutterwaveTransaction } from "@/lib/flutterwave";

const FLUTTERWAVE_SECRET_HASH = process.env.FLUTTERWAVE_SECRET_HASH || "";

/**
 * POST /api/webhooks/flutterwave - Processes asynchronous Flutterwave webhook events safely
 */
export async function POST(request: Request) {
	try {
		// 1. Signature Verification
		const signature = request.headers.get("verif-hash");
		if (FLUTTERWAVE_SECRET_HASH && signature !== FLUTTERWAVE_SECRET_HASH) {
			return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
		}

		const body = await request.json();
		const { event, data } = body;

		if (!data || !data.id) {
			return NextResponse.json({ message: "Ignored invalid webhook payload" }, { status: 400 });
		}

		// 2. Webhook Event Deduplication via Upstash Redis
		const eventKey = `@kiosk/webhook:flw:${data.id}`;
		if (redis) {
			const isDuplicate = await redis.get(eventKey);
			if (isDuplicate) {
				return NextResponse.json({ message: "Event already processed" }, { status: 200 });
			}
			await redis.set(eventKey, "PROCESSED", { ex: 86400 }); // 24 hours
		}

		// 3. Process Charge Completion
		if (event === "charge.completed" && data.status === "successful") {
			// Double check verification with Flutterwave API
			const txData = await verifyFlutterwaveTransaction(data.id.toString());
			if (txData && txData.status === "successful") {
				const userId = txData.meta?.userId || data.meta?.userId;
				const plan = txData.meta?.plan || data.meta?.plan || "LANDING_PAGE";

				if (userId) {
					// Find user's tenant
					const tenant = await db.query.tenants.findFirst({
						where: eq(tenants.ownerId, userId),
					});

					if (tenant) {
						// Update tenant active plan in Neon PostgreSQL
						await db
							.update(tenants)
							.set({ plan, updatedAt: new Date() })
							.where(eq(tenants.id, tenant.id));

						// Record Subscription
						await db.insert(subscriptions).values({
							tenantId: tenant.id,
							gateway: "flutterwave",
							customerId: data.customer?.id?.toString() || userId,
							subscriptionId: `flw_sub_${data.id}`,
							planId: plan.toLowerCase().replace(/_/g, "-"),
							billingCycle: "monthly",
							status: "active",
							currentPeriodStart: new Date(),
							currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
						});

						console.log(`[FLUTTERWAVE_WEBHOOK_SUCCESS] Upgraded tenant ${tenant.id} to plan: ${plan}`);
					}
				}
			}
		}

		return NextResponse.json({ status: "success" }, { status: 200 });
	} catch (err) {
		console.error("[FLUTTERWAVE_WEBHOOK_ERROR]", err);
		return NextResponse.json(
			{ error: "Internal webhook processing error" },
			{ status: 500 },
		);
	}
}
