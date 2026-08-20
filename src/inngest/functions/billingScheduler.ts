/**
 * Scheduled Invoicing & Grace Period Automation Engine
 *
 * Runs on cron schedule / Inngest event:
 * 1. Generates fresh multi-channel payment requests for upcoming renewals
 * 2. Manages 7-day grace periods with automated email reminder flows
 * 3. Flags/suspends expired sites with recovery payment links
 *
 * @module inngest/functions/billingScheduler
 * @format
 */

import { db } from "@/db";
import { tenants, users, invoices, subscriptions } from "@/db/schema";
import { eq, and, lte, gt, or, inArray } from "drizzle-orm";
import { initializeFlutterwavePayment } from "@/lib/payments/flutterwave";
import { BASE_PRICES_USD, PlanKey } from "@/lib/currency";
import {
	sendPaymentRequestEmail,
	sendGracePeriodReminderEmail,
	sendSiteFlaggedNoticeEmail,
} from "@/lib/email";
import { Logger } from "@/lib/logger";

const PLAN_MAP: Record<string, PlanKey> = {
	LANDING_PAGE: "landing",
	SALES_FUNNEL: "funnel",
	E_COMMERCE: "store",
};

export async function processScheduledBillingJob() {
	Logger.info("Starting scheduled billing & invoice check job");
	const now = new Date();
	const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
	const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kioosk.online";

	const results = {
		invoicesGenerated: 0,
		remindersDispatched: 0,
		sitesFlagged: 0,
	};

	try {
		// =========================================================================
		// 1. GENERATE FRESH RENEWAL INVOICES (3 Days Prior to Due Date)
		// =========================================================================
		const activeTenants = await db.query.tenants.findMany({
			where: and(
				lte(tenants.currentPeriodEnd, threeDaysFromNow),
				gt(tenants.currentPeriodEnd, new Date(0)),
			),
		});

		for (const tenant of activeTenants) {
			if (tenant.plan === "NONE") continue;

			// Check if an invoice is already pending or active for this upcoming period
			const existingInvoice = await db.query.invoices.findFirst({
				where: and(
					eq(invoices.tenantId, tenant.id),
					or(
						eq(invoices.status, "PENDING"),
						eq(invoices.status, "GRACE_PERIOD"),
						gt(invoices.createdAt, new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)),
					),
				),
			});

			if (existingInvoice) continue;

			const owner = await db.query.users.findFirst({
				where: eq(users.id, tenant.ownerId),
			});

			if (!owner || !owner.email) continue;

			// Lookup latest subscription for billing cycle
			const sub = await db.query.subscriptions.findFirst({
				where: eq(subscriptions.tenantId, tenant.id),
			});

			const billingCycle = (sub?.billingCycle || "monthly") as "monthly" | "yearly";
			const planKey = PLAN_MAP[tenant.plan] || "landing";
			const amount = BASE_PRICES_USD[planKey][billingCycle];
			const currency = "USD";

			const invoiceNumber = `INV-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
			const tx_ref = `kiosk_inv_${crypto.randomUUID()}`;
			const dueDate = tenant.currentPeriodEnd || now;
			const gracePeriodEnd = new Date(dueDate.getTime() + 7 * 24 * 60 * 60 * 1000);

			// Generate fresh multi-channel payment link (Card, Bank Transfer, USSD, Mobile Money)
			const paymentResult = await initializeFlutterwavePayment({
				amount,
				currency,
				email: owner.email,
				name: owner.name || "Kiosk Subscriber",
				tx_ref,
				redirect_url: `${appUrl}/dashboard/billing?payment=success&invoice=${invoiceNumber}`,
				payment_options: "card,banktransfer,ussd,mobilemoney",
				title: `Hosting Renewal Invoice #${invoiceNumber}`,
				description: `Renewal hosting & maintenance for Kiosk ${planKey} plan (${billingCycle})`,
				meta: {
					userId: owner.id,
					tenantId: tenant.id,
					invoiceNumber,
					plan: tenant.plan,
					billingCycle,
					type: "RECURRING_HOSTING",
				},
			});

			if (!paymentResult.success || !paymentResult.link) {
				console.error("[SCHEDULED_INVOICE_INIT_FAILED]", paymentResult.error);
				continue;
			}

			// Insert Invoice
			await db.insert(invoices).values({
				invoiceNumber,
				tenantId: tenant.id,
				userId: owner.id,
				plan: tenant.plan,
				billingCycle,
				type: "RECURRING_HOSTING",
				amount,
				currency,
				status: "PENDING",
				paymentLink: paymentResult.link,
				txRef: tx_ref,
				dueDate,
				gracePeriodEnd,
			});

			// Dispatch Invoice Payment Request Email
			await sendPaymentRequestEmail({
				toEmail: owner.email,
				userName: owner.name || "Subscriber",
				invoiceNumber,
				plan: tenant.plan.replace(/_/g, " "),
				amount,
				currency,
				dueDate: dueDate.toLocaleDateString(),
				paymentLink: paymentResult.link,
			});

			results.invoicesGenerated++;
		}

		// =========================================================================
		// 2. CHECK OVERDUE INVOICES -> ENTER GRACE PERIOD & DISPATCH REMINDERS
		// =========================================================================
		const pendingOverdueInvoices = await db.query.invoices.findMany({
			where: and(
				eq(invoices.status, "PENDING"),
				lte(invoices.dueDate, now),
				gt(invoices.gracePeriodEnd, now),
			),
		});

		for (const inv of pendingOverdueInvoices) {
			// Transition to Grace Period
			await db
				.update(invoices)
				.set({ status: "GRACE_PERIOD", updatedAt: now })
				.where(eq(invoices.id, inv.id));

			await db
				.update(tenants)
				.set({ billingStatus: "GRACE_PERIOD", updatedAt: now })
				.where(eq(tenants.id, inv.tenantId));

			const owner = await db.query.users.findFirst({
				where: eq(users.id, inv.userId),
			});

			if (owner?.email && inv.paymentLink) {
				const daysRemaining = Math.max(
					1,
					Math.ceil((new Date(inv.gracePeriodEnd).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
				);

				await sendGracePeriodReminderEmail({
					toEmail: owner.email,
					userName: owner.name || "Subscriber",
					invoiceNumber: inv.invoiceNumber,
					plan: inv.plan.replace(/_/g, " "),
					amount: inv.amount,
					currency: inv.currency,
					daysRemaining,
					paymentLink: inv.paymentLink,
				});

				await db
					.update(invoices)
					.set({ remindersSent: inv.remindersSent + 1, updatedAt: now })
					.where(eq(invoices.id, inv.id));

				results.remindersDispatched++;
			}
		}

		// =========================================================================
		// 3. EXPIRED GRACE PERIOD -> FLAG / SUSPEND SITES
		// =========================================================================
		const expiredInvoices = await db.query.invoices.findMany({
			where: and(
				inArray(invoices.status, ["PENDING", "GRACE_PERIOD"]),
				lte(invoices.gracePeriodEnd, now),
			),
		});

		for (const inv of expiredInvoices) {
			await db
				.update(invoices)
				.set({ status: "PAST_DUE", updatedAt: now })
				.where(eq(invoices.id, inv.id));

			await db
				.update(tenants)
				.set({ billingStatus: "PAST_DUE", updatedAt: now })
				.where(eq(tenants.id, inv.tenantId));

			const owner = await db.query.users.findFirst({
				where: eq(users.id, inv.userId),
			});

			if (owner?.email && inv.paymentLink && inv.remindersSent < 3) {
				await sendSiteFlaggedNoticeEmail({
					toEmail: owner.email,
					userName: owner.name || "Subscriber",
					invoiceNumber: inv.invoiceNumber,
					plan: inv.plan.replace(/_/g, " "),
					amount: inv.amount,
					currency: inv.currency,
					paymentLink: inv.paymentLink,
				});

				await db
					.update(invoices)
					.set({ remindersSent: inv.remindersSent + 1, updatedAt: now })
					.where(eq(invoices.id, inv.id));

				results.sitesFlagged++;
			}
		}

		Logger.info("Scheduled billing job completed successfully", results);
		return { success: true, ...results };
	} catch (err) {
		Logger.error("Failed during scheduled billing job execution", err);
		return { success: false, error: "Scheduled billing job failed" };
	}
}
