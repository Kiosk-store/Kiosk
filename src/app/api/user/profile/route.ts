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
	name: z.string().min(1, "Name cannot be empty.").optional(),
	phone: z.string().nullable().optional(),
	company: z.string().optional(),
	image: z.string().nullable().optional(),
	emailNotifications: z.boolean().optional(),
	projectUpdates: z.boolean().optional(),
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
				phone: userRecord?.phone || "",
				image: userRecord?.image || null,
				role: userRecord?.role || "USER",
				emailNotifications: userRecord?.emailNotifications ?? true,
				projectUpdates: userRecord?.projectUpdates ?? true,
			},
			tenant: {
				id: tenantRecord?.id,
				name: tenantRecord?.name || "",
				company: tenantRecord?.name || "",
				plan: tenantRecord?.plan || "NONE",
				slug: tenantRecord?.slug || "",
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

		const { name, phone, company, image, emailNotifications, projectUpdates } = validation.data;

		// 1. Update user fields in PostgreSQL database
		const userUpdates: Partial<typeof users.$inferInsert> = {
			updatedAt: new Date(),
		};

		if (name !== undefined) userUpdates.name = name;
		if (phone !== undefined) userUpdates.phone = phone;
		if (image !== undefined) userUpdates.image = image;
		if (emailNotifications !== undefined) userUpdates.emailNotifications = emailNotifications;
		if (projectUpdates !== undefined) userUpdates.projectUpdates = projectUpdates;

		if (Object.keys(userUpdates).length > 1) {
			await db
				.update(users)
				.set(userUpdates)
				.where(eq(users.id, userId));
		}

		// 2. Update or create tenant company name in PostgreSQL database
		if (company !== undefined && company.trim() !== "") {
			const tenant = await db.query.tenants.findFirst({
				where: eq(tenants.ownerId, userId),
			});

			if (tenant) {
				await db
					.update(tenants)
					.set({
						name: company.trim(),
						updatedAt: new Date(),
					})
					.where(eq(tenants.id, tenant.id));
			} else {
				const baseSlug = company
					.toLowerCase()
					.replace(/[^a-z0-9]/g, "-")
					.replace(/-+/g, "-")
					.slice(0, 30);
				const randomSuffix = Math.random().toString(36).substring(2, 7);
				const slug = `${baseSlug || "workspace"}-${randomSuffix}`;

				await db.insert(tenants).values({
					ownerId: userId,
					name: company.trim(),
					slug,
					plan: "NONE",
				});
			}
		}

		const updatedUser = await db.query.users.findFirst({
			where: eq(users.id, userId),
		});

		const updatedTenant = await db.query.tenants.findFirst({
			where: eq(tenants.ownerId, userId),
		});

		return NextResponse.json(
			{
				message: "Settings updated successfully in database",
				user: {
					id: updatedUser?.id,
					name: updatedUser?.name,
					email: updatedUser?.email,
					phone: updatedUser?.phone,
					image: updatedUser?.image,
					role: updatedUser?.role,
					emailNotifications: updatedUser?.emailNotifications,
					projectUpdates: updatedUser?.projectUpdates,
				},
				tenant: {
					name: updatedTenant?.name || "",
					company: updatedTenant?.name || "",
					plan: updatedTenant?.plan || "NONE",
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
