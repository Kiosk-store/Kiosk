/** @format */

import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { redis } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

export async function GET() {
	const startTime = performance.now();
	let isDbHealthy = false;
	let dbLatency = 0;
	let isRedisHealthy = false;

	// 1. Check PostgreSQL Database Health
	try {
		const dbStart = performance.now();
		await db.execute(sql`SELECT 1`);
		dbLatency = Math.round(performance.now() - dbStart);
		isDbHealthy = true;
	} catch (err) {
		console.error("[HEALTHCHECK_DB_ERROR]", err);
		isDbHealthy = false;
	}

	// 2. Check Redis Health
	try {
		if (process.env.UPSTASH_REDIS_REST_URL && redis) {
			await redis.ping();
			isRedisHealthy = true;
		} else {
			// Fallback local mode active
			isRedisHealthy = true;
		}
	} catch (err) {
		console.error("[HEALTHCHECK_REDIS_ERROR]", err);
		isRedisHealthy = false;
	}

	const totalLatencyMs = Math.round(performance.now() - startTime);
	const isHealthy = isDbHealthy && isRedisHealthy;

	return NextResponse.json(
		{
			status: isHealthy ? "healthy" : "degraded",
			timestamp: new Date().toISOString(),
			environment: process.env.NODE_ENV || "development",
			totalLatencyMs,
			checks: {
				database: {
					status: isDbHealthy ? "up" : "down",
					latencyMs: dbLatency,
				},
				redis: {
					status: isRedisHealthy ? "up" : "down",
					mode: process.env.UPSTASH_REDIS_REST_URL ? "upstash" : "local_fallback",
				},
			},
		},
		{
			status: isHealthy ? 200 : 503,
			headers: {
				"Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
			},
		},
	);
}
