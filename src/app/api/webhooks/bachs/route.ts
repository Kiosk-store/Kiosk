/** @format */

import { NextResponse } from "next/server";
import { db } from "@/db";
import { tenants, subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redis } from "@/lib/ratelimit";
import { verifyBachsWebhookSignature } from "@/lib/payments/bachs";

/**
 * POST /api/webhooks/bachs
 *
 * Processes asynchronous Bachs.io webhook events safely.
 *
 * Security:
 *  - Reads raw body before JSON parsing (required for HMAC verification)
 *  - Verifies X-Bachs-Signature using HMAC-SHA256 of "{timestamp}.{body}"
 *  - Deduplicates events via Redis using the event `id`
 *
 * Primary event handled: `collection.succeeded`
 */
export async function POST(request: Request) {
	// 1. Read raw body before JSON parsing (critical for sig verification)
	const rawBody = await request.text();

	try {
		// 2. Signature Verification
		const timestamp = request.headers.get("x-bachs-timestamp") ?? "";
		const signature = request.headers.get("x-bachs-signature") ?? "";

		if (!verifyBachsWebhookSignature(rawBody, timestamp, signature)) {
			console.warn("[BACHS_WEBHOOK] Signature verification failed");
			return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
		}

		const body = JSON.parse(rawBody);
		const { id: eventId, type: event, data } = body;

		if (!data) {
			return NextResponse.json(
				{ message: "Ignored invalid webhook payload" },
				{ status: 400 },
			);
		}

		// 3. Webhook Event Deduplication via Upstash Redis
		if (eventId && redis) {
			const eventKey = `@kiosk/webhook:bachs:${eventId}`;
			const isDuplicate = await redis.get(eventKey);
			if (isDuplicate) {
				return NextResponse.json({ message: "Event already processed" }, { status: 200 });
			}
			await redis.set(eventKey, "PROCESSED", { ex: 86400 }); // 24 hours
		}

		// 4. Process Charge Completion
		if (event === "collection.succeeded" && data.status === "SUCCEEDED") {
			const checkoutId: string = data.checkout_id ?? "";
			const userId: string = data.metadata?.userId || data.metadata?.userId;
			const plan: string = data.metadata?.plan || "LANDING_PAGE";

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
						gateway: "bachs",
						customerId: data.customer_id || userId,
						subscriptionId: `bachs_${checkoutId}`,
						planId: plan.toLowerCase().replace(/_/g, "-"),
						billingCycle: "monthly",
						status: "active",
						currentPeriodStart: new Date(),
						currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
					});

					console.log(
						`[BACHS_WEBHOOK_SUCCESS] Upgraded tenant ${tenant.id} to plan: ${plan} via checkout ${checkoutId}`,
					);
				}
			}
		}

		return NextResponse.json({ status: "success" }, { status: 200 });
	} catch (err) {
		console.error("[BACHS_WEBHOOK_ERROR]", err);
		return NextResponse.json(
			{ error: "Internal webhook processing error" },
			{ status: 500 },
		);
	}
}
