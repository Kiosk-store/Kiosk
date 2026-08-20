/** @format */

import { NextResponse } from "next/server";
import { db } from "@/db";
import { tenants, invoices } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { auth } from "@/auth";

/**
 * GET /api/billing/invoices - Fetches tenant billing status, pending invoices, and invoice history
 */
export async function GET() {
	try {
		const authSession = await auth();
		const customUser = await getAuthenticatedUser();
		const userId = authSession?.user?.id || customUser?.id;

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const tenant = await db.query.tenants.findFirst({
			where: eq(tenants.ownerId, userId),
		});

		if (!tenant) {
			return NextResponse.json({
				tenant: null,
				pendingInvoice: null,
				invoices: [],
			});
		}

		// Fetch all invoices for tenant ordered by creation date
		const tenantInvoices = await db.query.invoices.findMany({
			where: eq(invoices.tenantId, tenant.id),
			orderBy: [desc(invoices.createdAt)],
		});

		// Identify pending or grace period invoice
		const pendingInvoice = tenantInvoices.find(
			(inv) => inv.status === "PENDING" || inv.status === "GRACE_PERIOD" || inv.status === "PAST_DUE",
		) || null;

		return NextResponse.json({
			tenant: {
				id: tenant.id,
				name: tenant.name,
				plan: tenant.plan,
				billingStatus: tenant.billingStatus || "ACTIVE",
				currentPeriodEnd: tenant.currentPeriodEnd,
				gracePeriodEnd: tenant.gracePeriodEnd,
			},
			pendingInvoice,
			invoices: tenantInvoices,
		});
	} catch (err) {
		console.error("[GET_INVOICES_ERROR]", err);
		return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
	}
}
