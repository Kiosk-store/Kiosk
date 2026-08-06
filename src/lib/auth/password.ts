/** @format */

import bcrypt from "bcryptjs";
import { z } from "zod";

const SALT_ROUNDS = 12;

/**
 * Hashes a plain text password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifies a plain text password against a bcrypt hash
 */
export async function verifyPassword(
	password: string,
	hash: string,
): Promise<boolean> {
	return await bcrypt.compare(password, hash);
}

/**
 * Zod Schema for User Registration Input
 */
export const registerInputSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(64, "Name must be less than 64 characters"),
	email: z.string().email("Invalid email address"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/[A-Za-z]/, "Password must contain at least one letter")
		.regex(/[0-9]/, "Password must contain at least one number"),
});

/**
 * Zod Schema for User Login Input
 */
export const loginInputSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});
