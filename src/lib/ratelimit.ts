/** @format */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis instance safely
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const isUpstashConfigured = Boolean(redisUrl && redisToken && redisUrl.startsWith("http"));

export const redis = isUpstashConfigured
	? new Redis({
			url: redisUrl!,
			token: redisToken!,
	  })
	: null;

/**
 * Sliding Window Rate Limiter for Auth Routes (5 requests / 1 min)
 */
export const authRatelimit = redis
	? new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(10, "1 m"),
			analytics: false,
			prefix: "@kiosk/ratelimit/auth",
	  })
	: null;

/**
 * Sliding Window Rate Limiter for General API Routes (120 requests / 1 min)
 */
export const apiRatelimit = redis
	? new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(120, "1 m"),
			analytics: false,
			prefix: "@kiosk/ratelimit/api",
	  })
	: null;

/**
 * Sliding Window Rate Limiter for Checkout & Financial Routes (30 requests / 1 min)
 */
export const checkoutRatelimit = redis
	? new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(30, "1 m"),
			analytics: false,
			prefix: "@kiosk/ratelimit/checkout",
	  })
	: null;

export interface RateLimitResult {
	success: boolean;
	limit: number;
	remaining: number;
	reset: number;
}

/**
 * Helper to check rate limits with automatic development and error fallback (fail-open)
 */
export async function checkRateLimit(
	identifier: string,
	type: "auth" | "api" | "checkout" = "api",
): Promise<RateLimitResult> {
	let limiter = apiRatelimit;
	if (type === "auth") limiter = authRatelimit;
	if (type === "checkout") limiter = checkoutRatelimit;

	// In environments without Upstash configured, allow requests safely
	if (!limiter) {
		return {
			success: true,
			limit: 120,
			remaining: 119,
			reset: Date.now() + 60000,
		};
	}

	try {
		const result = await limiter.limit(identifier);
		return {
			success: result.success,
			limit: result.limit,
			remaining: result.remaining,
			reset: result.reset,
		};
	} catch (err) {
		console.warn("[RATELIMIT_FAIL_OPEN_FALLBACK]", err);
		return {
			success: true,
			limit: 120,
			remaining: 119,
			reset: Date.now() + 60000,
		};
	}
}
