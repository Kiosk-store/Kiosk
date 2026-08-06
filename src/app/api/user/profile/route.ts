/** @format */

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/ratelimit";

const updateProfileSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters."),
});

/**
 * PATCH /api/user/profile - Updates authenticated user's profile details in Neon PostgreSQL
 */
export async function PATCH(request: Request) {
	try {
		const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
		const rateLimit = await checkRateLimit(ip, "api");
		if (!rateLimit.success) {
			return NextResponse.json(
				{ error: "Too many requests. Please try again later." },
				{ status: 429 },
			);
		}

		// Authenticate User
		const authSession = await auth();
		const customUser = await getAuthenticatedUser();
		const userId = authSession?.user?.id || customUser?.id;

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const validation = updateProfileSchema.safeParse(body);
		if (!validation.success) {
			return NextResponse.json(
				{ error: "Invalid payload", details: validation.error.flatten() },
				{ status: 400 },
			);
		}

		const { name } = validation.data;

		// Update user in PostgreSQL database
		const [updatedUser] = await db
			.update(users)
			.set({
				name,
				updatedAt: new Date(),
			})
			.where(eq(users.id, userId))
			.returning({
				id: users.id,
				name: users.name,
				email: users.email,
				image: users.image,
				role: users.role,
			});

		return NextResponse.json(
			{
				message: "Profile updated successfully",
				user: updatedUser,
			},
			{ status: 200 },
		);
	} catch (err) {
		console.error("[PATCH_PROFILE_ERROR]", err);
		return NextResponse.json(
			{ error: "Failed to update profile details" },
			{ status: 500 },
		);
	}
}
