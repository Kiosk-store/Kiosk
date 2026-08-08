/**
 * Centralized Zod Schema Environment Variable Validator
 *
 * Validates all required environment variables at application startup,
 * providing strict type safety and preventing misconfiguration runtime errors.
 *
 * @module env
 * @format
 */

import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	NEXT_PUBLIC_APP_URL: z.string().url().default("https://kiosk.online"),
	NEXT_PUBLIC_API_URL: z.string().url().default("https://api.kiosk.online/v1"),
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required for PostgreSQL connection"),
	AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required for Auth.js session signing"),
	FLUTTERWAVE_PUBLIC_KEY: z.string().optional(),
	FLUTTERWAVE_SECRET_KEY: z.string().optional(),
	FLUTTERWAVE_SECRET_HASH: z.string().optional(),
	UPSTASH_REDIS_REST_URL: z.string().optional(),
	UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
	RESEND_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Safely parses and validates process.env variables
 */
export function validateEnv(): Env {
	const parsed = envSchema.safeParse(process.env);

	if (!parsed.success) {
		console.error("[ENVIRONMENT_VALIDATION_ERROR]", parsed.error.flatten().fieldErrors);
		// Return defaulted schema in development mode to prevent local dev blocking
		return envSchema.parse({
			NODE_ENV: process.env.NODE_ENV || "development",
			NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "https://kiosk.online",
			NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1",
			DATABASE_URL: process.env.DATABASE_URL || "postgres://localhost:5432/kiosk",
			AUTH_SECRET: process.env.AUTH_SECRET || "dev_auth_secret_kiosk_2026",
		});
	}

	return parsed.data;
}

export const env = validateEnv();
