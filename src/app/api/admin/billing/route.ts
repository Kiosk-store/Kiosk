/** @format */

import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth/admin";
import { db } from "@/db";
import { invoices, tenants, users, subscriptions } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/billing - Returns master billing transactions, invoices, and subscriptions
 */
export async function GET() {
	try {
		const adminUser = await getAuthenticatedAdmin();
		if (!adminUser) {
			return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
		}

		const allInvoices = await db.query.invoices.findMany({
			orderBy: [desc(invoices.createdAt)],
		});

		const allSubscriptions = await db.query.subscriptions.findMany({
			orderBy: [desc(subscriptions.createdAt)],
		});

		const allTenants = await db.query.tenants.findMany();
		const allUsers = await db.query.users.findMany();

		const tenantMap = new Map(allTenants.map((t) => [t.id, t]));
		const userMap = new Map(allUsers.map((u) => [u.id, u]));

		const enrichedInvoices = allInvoices.map((inv) => {
			const tenant = tenantMap.get(inv.tenantId);
			const user = userMap.get(inv.userId);
			return {
				...inv,
				tenantName: tenant?.name || "Unknown Workspace",
				tenantSlug: tenant?.slug || "",
				userName: user?.name || "Customer",
				userEmail: user?.email || "",
			};
		});

		return NextResponse.json({
			invoices: enrichedInvoices,
			subscriptions: allSubscriptions,
		});
	} catch (error) {
		Logger.error("Failed to fetch admin billing data", error);
		return NextResponse.json({ error: "Failed to fetch billing data" }, { status: 500 });
	}
}
