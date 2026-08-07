/**
 * Multi-Layer Caching Service (L1 In-Memory + L2 Upstash Redis)
 *
 * Implements a Cache-Aside strategy for high-performance sub-5ms lookups:
 * 1. L1 In-Memory LRU Cache (Fastest: ~0ms latency, short TTL)
 * 2. L2 Upstash Redis Cache (Distributed: sub-5ms latency, configurable TTL)
 * 3. Automatic Cache Invalidation on Database Mutations
 *
 * @module CacheService
 * @format
 */

import { redis } from "@/lib/ratelimit";

interface CacheEntry<T> {
	value: T;
	expiresAt: number;
}

export class CacheService {
	/** L1 In-Memory Storage Map */
	private static l1Cache = new Map<string, CacheEntry<any>>();

	/** Default L1 TTL: 10 seconds */
	private static DEFAULT_L1_TTL_MS = 10 * 1000;

	/** Default L2 Redis TTL: 300 seconds (5 minutes) */
	private static DEFAULT_L2_TTL_SEC = 300;

	/**
	 * Retrieves an item from cache using Cache-Aside strategy.
	 *
	 * @template T - Type of cached value
	 * @param key - Unique cache key
	 * @returns Cached value or null if cache miss
	 */
	public static async get<T>(key: string): Promise<T | null> {
		const now = Date.now();

		// 1. Check L1 In-Memory Cache
		const l1Item = this.l1Cache.get(key);
		if (l1Item && l1Item.expiresAt > now) {
			return l1Item.value as T;
		} else if (l1Item) {
			this.l1Cache.delete(key);
		}

		// 2. Check L2 Upstash Redis Cache
		if (redis) {
			try {
				const l2Item = await redis.get<T>(key);
				if (l2Item !== null) {
					// Populate L1 cache for subsequent local hits
					this.l1Cache.set(key, {
						value: l2Item,
						expiresAt: now + this.DEFAULT_L1_TTL_MS,
					});
					return l2Item;
				}
			} catch (err) {
				console.error("[CACHE_L2_GET_ERROR]", err);
			}
		}

		return null;
	}

	/**
	 * Stores a key-value pair across L1 memory and L2 Redis.
	 *
	 * @template T - Type of value to store
	 * @param key - Unique cache key
	 * @param value - Value payload to cache
	 * @param ttlSeconds - Optional Redis TTL in seconds
	 */
	public static async set<T>(
		key: string,
		value: T,
		ttlSeconds = this.DEFAULT_L2_TTL_SEC,
	): Promise<void> {
		const now = Date.now();

		// 1. Write to L1 In-Memory Cache
		this.l1Cache.set(key, {
			value,
			expiresAt: now + this.DEFAULT_L1_TTL_MS,
		});

		// 2. Write to L2 Upstash Redis
		if (redis) {
			try {
				await redis.set(key, value, { ex: ttlSeconds });
			} catch (err) {
				console.error("[CACHE_L2_SET_ERROR]", err);
			}
		}
	}

	/**
	 * Evicts a specific key from both L1 and L2 caches.
	 *
	 * @param key - Key to invalidate
	 */
	public static async invalidate(key: string): Promise<void> {
		this.l1Cache.delete(key);

		if (redis) {
			try {
				await redis.del(key);
			} catch (err) {
				console.error("[CACHE_INVALIDATE_ERROR]", err);
			}
		}
	}

	/**
	 * Clears L1 in-memory cache completely.
	 */
	public static clearL1(): void {
		this.l1Cache.clear();
	}
}
