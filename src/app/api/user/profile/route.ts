/** @format */

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users, tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/ratelimit";

const updateProfileSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters.").optional(),
	phone: z.string().optional(),
	company: z.string().optional(),
});

/**
 * GET /api/user/profile - Returns full user profile & tenant settings from DB
 */
export async function GET() {
	try {
		const authSession = await auth();
		const customUser = await getAuthenticatedUser();
		const userId = authSession?.user?.id || customUser?.id;

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userRecord = await db.query.users.findFirst({
			where: eq(users.id, userId),
		});

		const tenantRecord = await db.query.tenants.findFirst({
			where: eq(tenants.ownerId, userId),
		});

		return NextResponse.json({
			user: {
				id: userRecord?.id,
				name: userRecord?.name || "",
				email: userRecord?.email || "",
				image: userRecord?.image || null,
				role: userRecord?.role || "USER",
			},
			tenant: {
				name: tenantRecord?.name || "",
				company: tenantRecord?.name || "",
				plan: tenantRecord?.plan || "NONE",
			},
		});
	} catch (err) {
		console.error("[GET_PROFILE_ERROR]", err);
		return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
	}
}

/**
 * PATCH /api/user/profile - Updates authenticated user's profile and company details in Neon PostgreSQL
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

		const { name, company } = validation.data;

		// 1. Update user in PostgreSQL database
		if (name) {
			await db
				.update(users)
				.set({
					name,
					updatedAt: new Date(),
				})
				.where(eq(users.id, userId));
		}

		// 2. Update tenant company name in PostgreSQL database
		if (company) {
			const tenant = await db.query.tenants.findFirst({
				where: eq(tenants.ownerId, userId),
			});

			if (tenant) {
				await db
					.update(tenants)
					.set({
						name: company,
					})
					.where(eq(tenants.id, tenant.id));
			}
		}

		const updatedUser = await db.query.users.findFirst({
			where: eq(users.id, userId),
		});

		return NextResponse.json(
			{
				message: "Profile updated successfully in database",
				user: {
					id: updatedUser?.id,
					name: updatedUser?.name,
					email: updatedUser?.email,
					image: updatedUser?.image,
				},
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
