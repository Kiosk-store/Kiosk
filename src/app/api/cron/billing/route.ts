/** @format */

import { NextResponse } from "next/server";
import { processScheduledBillingJob } from "@/inngest/functions/billingScheduler";

/**
 * GET /api/cron/billing - Periodic cron endpoint to process scheduled invoicing and grace period checks
 * Can be triggered daily via Vercel Cron, Inngest, or QStash.
 */
export async function GET(request: Request) {
	try {
		// Optional Bearer CRON_SECRET authorization check
		const authHeader = request.headers.get("authorization");
		const cronSecret = process.env.CRON_SECRET;

		if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
			return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
		}

		const result = await processScheduledBillingJob();
		return NextResponse.json(result, { status: 200 });
	} catch (err) {
		console.error("[CRON_BILLING_ERROR]", err);
		return NextResponse.json({ error: "Cron execution failed" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	return GET(request);
}
