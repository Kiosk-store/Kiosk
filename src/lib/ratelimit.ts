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

export type RateLimitType =
	| "auth"
	| "api"
	| "checkout"
	| "register"
	| "registerGlobal"
	| "forgotPassword"
	| "contact"
	| "formToken";

interface RateLimitPolicy {
	limit: number;
	windowMs: number;
	upstashWindow: `${number} ${"s" | "m" | "h" | "d"}`;
	prefix: string;
}

const RATE_LIMIT_POLICIES: Record<RateLimitType, RateLimitPolicy> = {
	auth: {
		limit: 10,
		windowMs: 60 * 1000,
		upstashWindow: "1 m",
		prefix: "@kiosk/ratelimit/auth",
	},
	api: {
		limit: 120,
		windowMs: 60 * 1000,
		upstashWindow: "1 m",
		prefix: "@kiosk/ratelimit/api",
	},
	checkout: {
		limit: 30,
		windowMs: 60 * 1000,
		upstashWindow: "1 m",
		prefix: "@kiosk/ratelimit/checkout",
	},
	register: {
		limit: 4,
		windowMs: 60 * 60 * 1000, // 4 signups per hour per trusted IP
		upstashWindow: "1 h",
		prefix: "@kiosk/ratelimit/register",
	},
	registerGlobal: {
		limit: 25,
		windowMs: 10 * 60 * 1000, // 25 signups per 10 minutes globally across all IPs
		upstashWindow: "10 m",
		prefix: "@kiosk/ratelimit/register-global",
	},
	forgotPassword: {
		limit: 3,
		windowMs: 15 * 60 * 1000, // 3 reset requests per 15 minutes
		upstashWindow: "15 m",
		prefix: "@kiosk/ratelimit/forgot-password",
	},
	contact: {
		limit: 5,
		windowMs: 15 * 60 * 1000, // 5 support submissions per 15 minutes
		upstashWindow: "15 m",
		prefix: "@kiosk/ratelimit/contact",
	},
	formToken: {
		limit: 30,
		windowMs: 60 * 1000, // 30 form tokens per minute per IP
		upstashWindow: "1 m",
		prefix: "@kiosk/ratelimit/form-token",
	},
};

function createUpstashLimiter(type: RateLimitType): Ratelimit | null {
	if (!redis) return null;
	const policy = RATE_LIMIT_POLICIES[type];
	return new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(policy.limit, policy.upstashWindow),
		analytics: false,
		prefix: policy.prefix,
	});
}

/**
 * Sliding Window Rate Limiter for Auth Routes (10 requests / 1 min)
 */
export const authRatelimit = createUpstashLimiter("auth");

/**
 * Sliding Window Rate Limiter for General API Routes (120 requests / 1 min)
 */
export const apiRatelimit = createUpstashLimiter("api");

/**
 * Sliding Window Rate Limiter for Checkout & Financial Routes (30 requests / 1 min)
 */
export const checkoutRatelimit = createUpstashLimiter("checkout");

/**
 * Strict Sliding Window Rate Limiters for Abuse-Prone Public Endpoints
 */
export const registerRatelimit = createUpstashLimiter("register");
export const registerGlobalRatelimit = createUpstashLimiter("registerGlobal");
export const forgotPasswordRatelimit = createUpstashLimiter("forgotPassword");
export const contactRatelimit = createUpstashLimiter("contact");
export const formTokenRatelimit = createUpstashLimiter("formToken");

const LIMITERS: Record<RateLimitType, Ratelimit | null> = {
	auth: authRatelimit,
	api: apiRatelimit,
	checkout: checkoutRatelimit,
	register: registerRatelimit,
	registerGlobal: registerGlobalRatelimit,
	forgotPassword: forgotPasswordRatelimit,
	contact: contactRatelimit,
	formToken: formTokenRatelimit,
};

export interface RateLimitResult {
	success: boolean;
	limit: number;
	remaining: number;
	reset: number;
	fallback?: boolean;
}

// Bounded in-memory sliding window store used whenever Upstash Redis is unavailable
const MAX_MEMORY_STORE_KEYS = 5000;

declare global {
	var __kioskRateLimitStore: Map<string, number[]> | undefined;
}

function getMemoryStore(): Map<string, number[]> {
	if (!globalThis.__kioskRateLimitStore) {
		globalThis.__kioskRateLimitStore = new Map<string, number[]>();
	}
	return globalThis.__kioskRateLimitStore;
}

const PROTECTED_MEMORY_KEYS = new Set<string>(["registerGlobal:global"]);

function pruneMemoryStore(store: Map<string, number[]>, now: number): void {
	if (store.size <= MAX_MEMORY_STORE_KEYS) return;

	// Remove entries whose latest timestamp is older than 1 hour first
	const maxWindowMs = 60 * 60 * 1000;
	for (const [key, timestamps] of store.entries()) {
		if (PROTECTED_MEMORY_KEYS.has(key)) continue;
		const latest = timestamps[timestamps.length - 1] ?? 0;
		if (now - latest > maxWindowMs) {
			store.delete(key);
		}
	}

	// If still above cap, evict oldest non-protected keys
	for (const key of store.keys()) {
		if (store.size <= MAX_MEMORY_STORE_KEYS) break;
		if (PROTECTED_MEMORY_KEYS.has(key)) continue;
		store.delete(key);
	}
}

/**
 * In-memory sliding window fallback so rate limits stay enforced if Redis is down or unconfigured.
 */
function checkInMemoryRateLimit(identifier: string, type: RateLimitType): RateLimitResult {
	const policy = RATE_LIMIT_POLICIES[type];
	const store = getMemoryStore();
	const now = Date.now();
	const windowStart = now - policy.windowMs;
	const bucketKey = `${type}:${identifier}`;

	const existing = store.get(bucketKey) ?? [];
	const activeTimestamps = existing.filter((ts) => ts > windowStart);

	if (activeTimestamps.length >= policy.limit) {
		// Refresh LRU position so hot keys are not evicted first
		store.delete(bucketKey);
		store.set(bucketKey, activeTimestamps);
		const oldestActive = activeTimestamps[0] ?? now;
		return {
			success: false,
			limit: policy.limit,
			remaining: 0,
			reset: oldestActive + policy.windowMs,
			fallback: true,
		};
	}

	activeTimestamps.push(now);
	// Refresh LRU position so active buckets stay at the tail
	store.delete(bucketKey);
	store.set(bucketKey, activeTimestamps);
	pruneMemoryStore(store, now);

	const oldestActive = activeTimestamps[0] ?? now;
	return {
		success: true,
		limit: policy.limit,
		remaining: Math.max(0, policy.limit - activeTimestamps.length),
		reset: oldestActive + policy.windowMs,
		fallback: true,
	};
}

/**
 * Helper to check rate limits with Upstash Redis and automatic in-memory fallback if Redis is down.
 */
export async function checkRateLimit(
	identifier: string,
	type: RateLimitType = "api",
): Promise<RateLimitResult> {
	const normalizedId = (identifier || "unknown").trim().slice(0, 128) || "unknown";
	const limiter = LIMITERS[type];

	if (!limiter) {
		return checkInMemoryRateLimit(normalizedId, type);
	}

	try {
		const result = await limiter.limit(normalizedId);
		return {
			success: result.success,
			limit: result.limit,
			remaining: result.remaining,
			reset: result.reset,
		};
	} catch (err) {
		console.warn(`[RATELIMIT_REDIS_ERROR_MEMORY_FALLBACK] type=${type}`, err);
		return checkInMemoryRateLimit(normalizedId, type);
	}
}

/**
 * Enforces both per-IP registration limit (4/hour) and global registration burst cap (25/10min).
 */
export async function checkRegistrationRateLimit(ip: string): Promise<{
	success: boolean;
	scope: "ip" | "global";
	result: RateLimitResult;
}> {
	const ipResult = await checkRateLimit(ip, "register");
	if (!ipResult.success) {
		return { success: false, scope: "ip", result: ipResult };
	}

	const globalResult = await checkRateLimit("global", "registerGlobal");
	if (!globalResult.success) {
		return { success: false, scope: "global", result: globalResult };
	}

	return { success: true, scope: "ip", result: ipResult };
}

/**
 * Formats standard rate-limit HTTP headers (including Retry-After when throttled).
 */
export function buildRateLimitHeaders(rateLimit: RateLimitResult): Record<string, string> {
	const headers: Record<string, string> = {
		"X-RateLimit-Limit": rateLimit.limit.toString(),
		"X-RateLimit-Remaining": rateLimit.remaining.toString(),
		"X-RateLimit-Reset": rateLimit.reset.toString(),
	};

	if (!rateLimit.success) {
		const retryAfterSeconds = Math.max(1, Math.ceil((rateLimit.reset - Date.now()) / 1000));
		headers["Retry-After"] = retryAfterSeconds.toString();
	}

	return headers;
}
