/** @format */

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { tenants, projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { auth } from "@/auth";
import { CacheService } from "@/lib/cache/CacheService";
import { ProjectSubject } from "@/lib/events/ProjectSubject";
import { Logger } from "@/lib/logger";

const contentPayloadSchema = z.object({
	projectId: z.string().optional(),
	businessName: z.string().min(2, "Business name is required"),
	tagline: z.string().min(2, "Tagline is required"),
	aboutText: z.string().min(5, "About text is required"),
	servicesList: z.string().min(5, "Services list is required"),
	contactEmail: z.string().email("Valid email is required"),
	contactPhone: z.string().min(3, "Phone is required"),
	contactAddress: z.string().optional(),
	uploadedImages: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
				size: z.string(),
				url: z.string(),
			}),
		)
		.optional(),
});

/**
 * GET /api/projects/content - Retrieves saved business content and brand assets
 */
export async function GET() {
	try {
		const authSession = await auth();
		const customUser = await getAuthenticatedUser();
		const userId = authSession?.user?.id || customUser?.id;

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const tenant = await db.query.tenants.findFirst({
			where: eq(tenants.ownerId, userId),
		});

		if (!tenant) {
			return NextResponse.json({ content: null });
		}

		const cacheKey = `tenant:content:${tenant.id}`;
		const savedContent = await CacheService.get(cacheKey);

		return NextResponse.json({ content: savedContent || null });
	} catch (err) {
		Logger.error("Failed to retrieve project content", err);
		return NextResponse.json({ error: "Failed to load project content" }, { status: 500 });
	}
}

/**
 * POST /api/projects/content - Saves business content & brand assets and updates build progress
 */
export async function POST(request: Request) {
	try {
		const authSession = await auth();
		const customUser = await getAuthenticatedUser();
		const userId = authSession?.user?.id || customUser?.id;

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const tenant = await db.query.tenants.findFirst({
			where: eq(tenants.ownerId, userId),
		});

		if (!tenant) {
			return NextResponse.json({ error: "Tenant workspace not found" }, { status: 404 });
		}

		const body = await request.json();
		const validation = contentPayloadSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{ error: "Invalid payload", details: validation.error.flatten() },
				{ status: 400 },
			);
		}

		const contentData = validation.data;
		const cacheKey = `tenant:content:${tenant.id}`;

		// Store in Cache (Persistent 30 days)
		await CacheService.set(cacheKey, contentData, 2592000);

		// Update Project Progress to 85% & Status to "In Review"
		const userProjects = await db.query.projects.findMany({
			where: eq(projects.tenantId, tenant.id),
		});

		if (userProjects.length > 0) {
			const activeProject = userProjects[0];
			await db
				.update(projects)
				.set({
					progress: 85,
					status: "In Review",
					updatedAt: new Date(),
				})
				.where(eq(projects.id, activeProject.id));
		}

		// Invalidate projects list cache
		await CacheService.invalidate(`tenant:projects:${tenant.id}`);

		// Dispatch domain event via Observer pattern
		const eventBus = ProjectSubject.getInstance();
		await eventBus.notify({
			id: crypto.randomUUID(),
			type: "PROJECT_UPDATED",
			timestamp: new Date().toISOString(),
			tenantId: tenant.id,
			payload: {
				businessName: contentData.businessName,
				imagesCount: contentData.uploadedImages?.length || 0,
			},
		});

		Logger.info("Saved project content & brand assets", {
			tenantId: tenant.id,
			businessName: contentData.businessName,
		});

		return NextResponse.json({ success: true, content: contentData });
	} catch (err) {
		Logger.error("Failed to save project content", err);
		return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
	}
}
