/** @format */

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { auth } from "@/auth";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { checkRateLimit } from "@/lib/ratelimit";

const updatePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required."),
		newPassword: z
			.string()
			.min(8, "New password must be at least 8 characters.")
			.regex(/[A-Za-z]/, "New password must contain at least one letter.")
			.regex(/[0-9]/, "New password must contain at least one number."),
		confirmPassword: z.string().min(1, "Confirm password is required."),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "New password and confirmation do not match.",
		path: ["confirmPassword"],
	});

/**
 * PATCH /api/user/password - Updates user password in Neon PostgreSQL database
 */
export async function PATCH(request: Request) {
	try {
		const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
		const rateLimit = await checkRateLimit(ip, "auth");
		if (!rateLimit.success) {
			return NextResponse.json(
				{ error: "Too many attempts. Please try again later." },
				{ status: 429 },
			);
		}

		const authSession = await auth();
		const customUser = await getAuthenticatedUser();
		const userId = authSession?.user?.id || customUser?.id;

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const validation = updatePasswordSchema.safeParse(body);

		if (!validation.success) {
			const errorMsg =
				validation.error.issues[0]?.message || "Invalid password update payload";
			return NextResponse.json({ error: errorMsg }, { status: 400 });
		}

		const { currentPassword, newPassword } = validation.data;

		// Fetch user from DB
		const user = await db.query.users.findFirst({
			where: eq(users.id, userId),
		});

		if (!user || !user.passwordHash) {
			return NextResponse.json(
				{ error: "Account password record not found." },
				{ status: 400 },
			);
		}

		// Verify current password
		const isPasswordValid = await verifyPassword(currentPassword, user.passwordHash);
		if (!isPasswordValid) {
			return NextResponse.json(
				{ error: "Incorrect current password." },
				{ status: 400 },
			);
		}

		// Hash new password and update in database
		const newPasswordHash = await hashPassword(newPassword);
		await db
			.update(users)
			.set({
				passwordHash: newPasswordHash,
				updatedAt: new Date(),
			})
			.where(eq(users.id, userId));

		return NextResponse.json(
			{ message: "Updated" },
			{ status: 200 },
		);
	} catch (err) {
		console.error("[PATCH_PASSWORD_ERROR]", err);
		return NextResponse.json(
			{ error: "An unexpected error occurred while updating password." },
			{ status: 500 },
		);
	}
}
