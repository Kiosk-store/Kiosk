/** @format */

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { tenants, projects } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/ratelimit";
import { SiteTemplateFactory } from "@/lib/factory/SiteTemplateFactory";
import type { SiteTier } from "@/lib/factory/SiteTemplateFactory";
import { CacheService } from "@/lib/cache/CacheService";
import { ProjectSubject } from "@/lib/events/ProjectSubject";

const createProjectSchema = z.object({
	name: z.string().min(2, "Project name must be at least 2 characters."),
	type: z.enum(["Landing Page", "Sales Funnel", "E-commerce"]),
});

/**
 * Resolves or automatically provisions a default tenant for a user
 */
async function getOrCreateTenantForUser(userId: string, userName: string | null) {
	let tenant = await db.query.tenants.findFirst({
		where: eq(tenants.ownerId, userId),
	});

	if (!tenant) {
		const slug = `${(userName || "workspace").toLowerCase().replace(/[^a-z0-9]/g, "")}-${crypto.randomUUID().slice(0, 6)}`;
		const [newTenant] = await db
			.insert(tenants)
			.values({
				ownerId: userId,
				name: `${userName || "User"}'s Workspace`,
				slug,
			})
			.returning();
		tenant = newTenant;
	}

	return tenant;
}

/**
 * GET /api/projects - Returns list of projects for current user's tenant with Cache-Aside support
 */
export async function GET(request: Request) {
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
		const userName = authSession?.user?.name || customUser?.name || null;

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const tenant = await getOrCreateTenantForUser(userId, userName);
		const cacheKey = `tenant:projects:${tenant.id}`;

		// Check Multi-Layer Cache
		const cachedData = await CacheService.get<{ tenant: any; projects: any[] }>(cacheKey);
		if (cachedData) {
			return NextResponse.json(cachedData, {
				headers: { "X-Cache-Status": "HIT" },
			});
		}

		const tenantProjects = await db.query.projects.findMany({
			where: eq(projects.tenantId, tenant.id),
			orderBy: (p, { desc }) => [desc(p.createdAt)],
		});

		const responsePayload = {
			tenant,
			projects: tenantProjects,
		};

		// Store in Cache (5 min TTL)
		await CacheService.set(cacheKey, responsePayload, 300);

		return NextResponse.json(responsePayload, {
			headers: { "X-Cache-Status": "MISS" },
		});
	} catch (err) {
		console.error("[GET_PROJECTS_ERROR]", err);
		return NextResponse.json(
			{ error: "Failed to fetch projects" },
			{ status: 500 },
		);
	}
}

/**
 * POST /api/projects - Creates a new project and dispatches event to ProjectSubject bus
 */
export async function POST(request: Request) {
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
		const userName = authSession?.user?.name || customUser?.name || null;

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const validation = createProjectSchema.safeParse(body);
		if (!validation.success) {
			return NextResponse.json(
				{ error: "Invalid payload", details: validation.error.flatten() },
				{ status: 400 },
			);
		}

		const { name, type } = validation.data;
		const tenant = await getOrCreateTenantForUser(userId, userName);

		// Use Factory pattern to create template configuration
		const templateConfig = SiteTemplateFactory.createTemplate(type as SiteTier);

		// Generate clean project subdomain slug directly from Project Name (e.g. "Bella Bakery" -> "bella-bakery.kioosk.online")
		const projectSlug = name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
		const projectSubdomain = projectSlug || "project";

		const [newProject] = await db
			.insert(projects)
			.values({
				tenantId: tenant.id,
				name,
				type,
				status: "In Progress",
				progress: templateConfig.progress,
				publishedUrl: `https://${projectSubdomain}.kioosk.online`,
			})
			.returning();

		// Dispatch domain event via Observer pattern
		const eventBus = ProjectSubject.getInstance();
		await eventBus.notify({
			id: crypto.randomUUID(),
			type: "PROJECT_CREATED",
			timestamp: new Date().toISOString(),
			tenantId: tenant.id,
			payload: newProject,
		});

		return NextResponse.json(
			{
				project: newProject,
				templateConfig,
			},
			{ status: 201 },
		);
	} catch (err) {
		console.error("[POST_PROJECTS_ERROR]", err);
		return NextResponse.json(
			{ error: "Failed to create project" },
			{ status: 500 },
		);
	}
}

/**
 * DELETE /api/projects - Deletes a project by projectId
 */
export async function DELETE(request: Request) {
	try {
		const authSession = await auth();
		const customUser = await getAuthenticatedUser();
		const userId = authSession?.user?.id || customUser?.id;

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const projectId = searchParams.get("projectId");

		if (!projectId) {
			return NextResponse.json({ error: "projectId is required" }, { status: 400 });
		}

		const tenant = await db.query.tenants.findFirst({
			where: eq(tenants.ownerId, userId),
		});

		if (!tenant) {
			return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
		}

		// Delete project matching both ID and tenant ownership
		const deleted = await db
			.delete(projects)
			.where(and(eq(projects.id, projectId), eq(projects.tenantId, tenant.id)))
			.returning();

		if (deleted.length === 0) {
			return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 });
		}

		// Invalidate cache
		await CacheService.invalidate(`tenant:projects:${tenant.id}`);
		await CacheService.invalidate(`tenant:content:${tenant.id}:${projectId}`);

		return NextResponse.json({ success: true, message: "Project deleted successfully" });
	} catch (err) {
		console.error("[DELETE_PROJECT_ERROR]", err);
		return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
	}
}

