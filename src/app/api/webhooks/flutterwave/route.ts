/** @format */

import { NextResponse } from "next/server";
import { db } from "@/db";
import { tenants, subscriptions, invoices, users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { redis } from "@/lib/ratelimit";
import {
	verifyFlutterwaveWebhookHash,
	verifyFlutterwaveTransaction,
} from "@/lib/payments/flutterwave";
import { processPdfInvoiceJob } from "@/inngest/functions/pdfInvoice";

/**
 * POST /api/webhooks/flutterwave
 *
 * Processes asynchronous Flutterwave webhook events safely.
 * Reconciles multi-channel invoice payments (Card, Bank Transfer, USSD, Mobile Money).
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

		// 3. Process Successful Multi-Channel Charge (Card, Transfer, USSD, Mobile Money)
		if (event === "charge.completed" && data.status === "successful") {
			// Direct Server Verification with Flutterwave API
			const verifiedTx = await verifyFlutterwaveTransaction(String(data.id));

			if (!verifiedTx || (verifiedTx.status !== "successful" && verifiedTx.status !== "success")) {
				console.error("[FLUTTERWAVE_WEBHOOK] Transaction verification failed with Flutterwave API", data.id);
				return NextResponse.json({ error: "Transaction verification failed" }, { status: 400 });
			}

			const txRef: string = data.tx_ref || verifiedTx.tx_ref;
			const userId: string = data.meta?.userId || verifiedTx.meta?.userId;
			const plan: string = data.meta?.plan || verifiedTx.meta?.plan || "LANDING_PAGE";
			const billingCycle: string = data.meta?.billingCycle || verifiedTx.meta?.billingCycle || "monthly";
			const invoiceNumber: string | undefined = data.meta?.invoiceNumber || verifiedTx.meta?.invoiceNumber;
			const paymentMethod: string = (data.payment_type || verifiedTx.payment_type || "card").toLowerCase();

			// 1. Reconcile matching invoice in database
			let matchedInvoice = null;
			if (txRef) {
				matchedInvoice = await db.query.invoices.findFirst({
					where: eq(invoices.txRef, txRef),
				});
			}

			if (!matchedInvoice && invoiceNumber) {
				matchedInvoice = await db.query.invoices.findFirst({
					where: eq(invoices.invoiceNumber, invoiceNumber),
				});
			}

			const now = new Date();
			const days = billingCycle === "yearly" ? 365 : 30;
			const newPeriodEnd = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
			const newGraceEnd = new Date(newPeriodEnd.getTime() + 7 * 24 * 60 * 60 * 1000);

			if (matchedInvoice) {
				await db
					.update(invoices)
					.set({
						status: "PAID",
						paidAt: now,
						paymentMethod,
						updatedAt: now,
					})
					.where(eq(invoices.id, matchedInvoice.id));
			}

			// 2. Locate tenant and update billing status
			const tenantId = matchedInvoice?.tenantId || data.meta?.tenantId || verifiedTx.meta?.tenantId;
			let tenant = null;

			if (tenantId) {
				tenant = await db.query.tenants.findFirst({
					where: eq(tenants.id, tenantId),
				});
			} else if (userId) {
				tenant = await db.query.tenants.findFirst({
					where: eq(tenants.ownerId, userId),
				});
			}

			if (tenant) {
				await db
					.update(tenants)
					.set({
						plan,
						billingStatus: "ACTIVE",
						currentPeriodEnd: newPeriodEnd,
						gracePeriodEnd: newGraceEnd,
						updatedAt: now,
					})
					.where(eq(tenants.id, tenant.id));

				// Record Subscription history
				await db.insert(subscriptions).values({
					tenantId: tenant.id,
					gateway: "flutterwave",
					customerId: String(data.customer?.id || userId || tenant.ownerId),
					subscriptionId: `flw_${data.id || txRef}`,
					planId: plan.toLowerCase().replace(/_/g, "-"),
					billingCycle,
					status: "active",
					currentPeriodStart: now,
					currentPeriodEnd: newPeriodEnd,
				});

				console.log(
					`[FLUTTERWAVE_WEBHOOK_SUCCESS] Reconciled invoice payment for tenant ${tenant.id} (${plan}, ${paymentMethod}) via tx ${data.id}`,
				);

				// 3. Dispatch Async PDF Receipt Email Job
				const recipientEmail = data.customer?.email || verifiedTx.customer?.email;
				const recipientName = data.customer?.name || verifiedTx.customer?.name || "Kiosk Subscriber";

				if (recipientEmail) {
					processPdfInvoiceJob({
						transactionId: String(data.id),
						tenantId: tenant.id,
						userEmail: recipientEmail,
						userName: recipientName,
						amount: data.amount || verifiedTx.amount || 0,
						currency: data.currency || verifiedTx.currency || "USD",
						plan,
					}).catch((err) => {
						console.error("[RECEIPT_JOB_ERROR]", err);
					});
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
