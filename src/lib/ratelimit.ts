/** @format */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis instance safely
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const isUpstashConfigured = Boolean(redisUrl && redisToken);

const redis = isUpstashConfigured
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
			limiter: Ratelimit.slidingWindow(5, "1 m"),
			analytics: true,
			prefix: "@kiosk/ratelimit/auth",
	  })
	: null;

/**
 * Sliding Window Rate Limiter for General API Routes (100 requests / 1 min)
 */
export const apiRatelimit = redis
	? new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(100, "1 m"),
			analytics: true,
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
			analytics: true,
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
 * Helper to check rate limits with automatic development fallback
 */
export async function checkRateLimit(
	identifier: string,
	type: "auth" | "api" | "checkout" = "api",
): Promise<RateLimitResult> {
	let limiter = apiRatelimit;
	if (type === "auth") limiter = authRatelimit;
	if (type === "checkout") limiter = checkoutRatelimit;

	// In local dev without Upstash configured, bypass rate limiting safely
	if (!limiter) {
		return {
			success: true,
			limit: 100,
			remaining: 99,
			reset: Date.now() + 60000,
		};
	}

	const result = await limiter.limit(identifier);
	return {
		success: result.success,
		limit: result.limit,
		remaining: result.remaining,
		reset: result.reset,
	};
}
