/** @format */

import bcrypt from "bcryptjs";
import { z } from "zod";
import { isDisposableEmail, validateHumanName } from "../security/validation";

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
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(64, "Name must be less than 64 characters")
		.superRefine((val, ctx) => {
			if (val.length < 2 || val.length > 64) return;
			const check = validateHumanName(val);
			if (!check.valid) {
				ctx.addIssue({
					code: "custom",
					message: check.reason || "Please enter a valid name.",
				});
			}
		}),
	email: z
		.string()
		.trim()
		.toLowerCase()
		.max(254, "Email address is too long")
		.email("Invalid email address")
		.refine((val) => !/[\r\n]/.test(val), "Invalid email address")
		.refine(
			(val) => !isDisposableEmail(val),
			"Disposable or temporary email addresses are not allowed. Please use a permanent email address.",
		),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(128, "Password must be less than 128 characters")
		.regex(/[A-Za-z]/, "Password must contain at least one letter")
		.regex(/[0-9]/, "Password must contain at least one number"),
});

/**
 * Zod Schema for User Login Input
 */
export const loginInputSchema = z.object({
	email: z
		.string()
		.trim()
		.toLowerCase()
		.max(254, "Email address is too long")
		.email("Invalid email address"),
	password: z
		.string()
		.min(1, "Password is required")
		.max(128, "Password must be less than 128 characters"),
});

/**
 * Zod Schema for Forgot Password Request
 */
export const forgotPasswordSchema = z.object({
	email: z
		.string()
		.trim()
		.toLowerCase()
		.max(254, "Email address is too long")
		.email("Invalid email address")
		.refine((val) => !/[\r\n]/.test(val), "Invalid email address"),
});

/**
 * Zod Schema for Password Reset Confirmation
 */
export const resetPasswordSchema = z.object({
	token: z.string().min(1, "Reset token is required").max(256, "Invalid reset token"),
	email: z
		.string()
		.trim()
		.toLowerCase()
		.max(254, "Email address is too long")
		.email("Invalid email address"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(128, "Password must be less than 128 characters")
		.regex(/[A-Za-z]/, "Password must contain at least one letter")
		.regex(/[0-9]/, "Password must contain at least one number"),
});
