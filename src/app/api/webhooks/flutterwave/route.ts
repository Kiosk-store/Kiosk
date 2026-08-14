/** @format */

import { NextResponse } from "next/server";
import { db } from "@/db";
import { tenants, subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redis } from "@/lib/ratelimit";
import {
	verifyFlutterwaveWebhookHash,
	verifyFlutterwaveTransaction,
} from "@/lib/payments/flutterwave";

/**
 * POST /api/webhooks/flutterwave
 *
 * Processes asynchronous Flutterwave webhook events safely.
 *
 * Security:
 *  - Verifies verif-hash header against FLUTTERWAVE_SECRET_HASH
 *  - Deduplicates events via Redis using transaction ID / tx_ref
 *  - Double checks transaction status via Flutterwave Verification API
 *
 * Primary event handled: `charge.completed`
 */
export async function POST(request: Request) {
	try {
		// 1. Signature / Hash Verification
		const verifHash = request.headers.get("verif-hash") ?? "";

		if (!verifyFlutterwaveWebhookHash(verifHash)) {
			console.warn("[FLUTTERWAVE_WEBHOOK] Hash verification failed");
			return NextResponse.json({ error: "Invalid webhook hash signature" }, { status: 401 });
		}

		const body = await request.json();
		const { event, data } = body;

		if (!data) {
			return NextResponse.json(
				{ message: "Ignored invalid webhook payload" },
				{ status: 400 },
			);
		}

		const transactionId = data.id || data.tx_ref;

		// 2. Webhook Event Deduplication via Upstash Redis
		if (transactionId && redis) {
			const eventKey = `@kiosk/webhook:flutterwave:${transactionId}`;
			const isDuplicate = await redis.get(eventKey);
			if (isDuplicate) {
				return NextResponse.json({ message: "Event already processed" }, { status: 200 });
			}
			await redis.set(eventKey, "PROCESSED", { ex: 86400 }); // 24 hours
		}

		// 3. Process Successful Charge
		if (event === "charge.completed" && data.status === "successful") {
			// Direct Server Verification with Flutterwave API
			const verifiedTx = await verifyFlutterwaveTransaction(String(data.id));

			if (!verifiedTx || (verifiedTx.status !== "successful" && verifiedTx.status !== "success")) {
				console.error("[FLUTTERWAVE_WEBHOOK] Transaction verification failed with Flutterwave API", data.id);
				return NextResponse.json({ error: "Transaction verification failed" }, { status: 400 });
			}

			const userId: string = data.meta?.userId || verifiedTx.meta?.userId;
			const plan: string = data.meta?.plan || verifiedTx.meta?.plan || "LANDING_PAGE";
			const billingCycle: string = data.meta?.billingCycle || verifiedTx.meta?.billingCycle || "monthly";

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

					const days = billingCycle === "yearly" ? 365 : 30;

					// Record Subscription
					await db.insert(subscriptions).values({
						tenantId: tenant.id,
						gateway: "flutterwave",
						customerId: String(data.customer?.id || userId),
						subscriptionId: `flw_${data.id || data.tx_ref}`,
						planId: plan.toLowerCase().replace(/_/g, "-"),
						billingCycle,
						status: "active",
						currentPeriodStart: new Date(),
						currentPeriodEnd: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
					});

					console.log(
						`[FLUTTERWAVE_WEBHOOK_SUCCESS] Upgraded tenant ${tenant.id} to plan: ${plan} via tx ${data.id}`,
					);
				}
			}
		}

		// 4. Process Failed Charges
		if (event === "charge.completed" && data.status === "failed") {
			console.warn(`[FLUTTERWAVE_WEBHOOK_FAILED] Charge failed for tx ${data.id} (${data.customer?.email})`);
			return NextResponse.json({ message: "Failed charge event recorded" }, { status: 200 });
		}

		// 5. Process Refunds
		if (event === "refund.completed" || event === "charge.refunded") {
			const subId = `flw_${data.id || data.tx_ref}`;
			await db
				.update(subscriptions)
				.set({ status: "canceled", updatedAt: new Date() })
				.where(eq(subscriptions.subscriptionId, subId));

			console.log(`[FLUTTERWAVE_WEBHOOK_REFUND] Subscription ${subId} marked as refunded/canceled`);
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
