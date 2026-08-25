/** @format */

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { tenants, projects } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { auth } from "@/auth";
import { CacheService } from "@/lib/cache/CacheService";
import { ProjectSubject } from "@/lib/events/ProjectSubject";
import { Logger } from "@/lib/logger";

const contentPayloadSchema = z.object({
	projectId: z.string().optional(),
	plan: z.string().optional(),
	businessName: z.string().min(2, "Business name is required"),
	tagline: z.string().min(2, "Tagline is required"),
	aboutText: z.string().optional().default(""),
	servicesList: z.string().optional().default(""),
	contactEmail: z.string().optional().default(""),
	contactPhone: z.string().optional().default(""),
	contactAddress: z.string().optional(),
	leadMagnetTitle: z.string().optional(),
	valueStack: z.string().optional(),
	testimonials: z.string().optional(),
	productCatalog: z.string().optional(),
	products: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
				price: z.union([z.number(), z.string()]),
				description: z.string().optional().default(""),
				category: z.string().optional().default("General"),
				imageUrl: z.string().optional().default(""),
				badge: z.string().optional().default(""),
			}),
		)
		.optional(),
	currency: z.string().optional(),
	shippingInfo: z.string().optional(),
	selectedFont: z.string().optional(),
	whatsappLink: z.string().optional().default(""),
	xLink: z.string().optional().default(""),
	instagramLink: z.string().optional().default(""),
	facebookLink: z.string().optional().default(""),
	linkedinLink: z.string().optional().default(""),
	youtubeLink: z.string().optional().default(""),
	tiktokLink: z.string().optional().default(""),
	bookingLink: z.string().optional().default(""),
	customLink: z.string().optional().default(""),
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
 * GET /api/projects/content - Retrieves saved business content and brand assets for a specific project
 */
export async function GET(request: Request) {
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

		const { searchParams } = new URL(request.url);
		const projectId = searchParams.get("projectId");

		const cacheKey = projectId
			? `tenant:content:${tenant.id}:${projectId}`
			: `tenant:content:${tenant.id}`;

		const savedContent = await CacheService.get(cacheKey);

		return NextResponse.json({ content: savedContent || null });
	} catch (err) {
		Logger.error("Failed to retrieve project content", err);
		return NextResponse.json({ error: "Failed to load project content" }, { status: 500 });
	}
}

/**
 * POST /api/projects/content - Saves business content & brand assets for a specific project
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
		const projectId = contentData.projectId;

		const cacheKey = projectId
			? `tenant:content:${tenant.id}:${projectId}`
			: `tenant:content:${tenant.id}`;

		// Store in Cache (Persistent 30 days)
		await CacheService.set(cacheKey, contentData, 2592000);

		// Update specific Project Progress to 85% & Status to "In Review"
		if (projectId) {
			await db
				.update(projects)
				.set({
					progress: 85,
					status: "In Review",
					updatedAt: new Date(),
				})
				.where(and(eq(projects.id, projectId), eq(projects.tenantId, tenant.id)));
		} else {
			const userProjects = await db.query.projects.findMany({
				where: eq(projects.tenantId, tenant.id),
			});
			if (userProjects.length > 0) {
				await db
					.update(projects)
					.set({
						progress: 85,
						status: "In Review",
						updatedAt: new Date(),
					})
					.where(eq(projects.id, userProjects[0].id));
			}
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
