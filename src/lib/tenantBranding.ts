/** @format */

import { db } from "@/db";
import { tenants, projects } from "@/db/schema";
import { eq, ilike, or } from "drizzle-orm";
import { CacheService } from "@/lib/cache/CacheService";

export interface TenantBrandingResult {
	isClientSite: boolean;
	logoUrl?: string | null;
	businessName?: string | null;
	slug?: string | null;
}

const ROOT_HOSTS = [
	"localhost",
	"127.0.0.1",
	"0.0.0.0",
	"kioosk.online",
	"www.kioosk.online",
	"kiosk.site",
	"www.kiosk.site",
];

/**
 * Resolves a tenant's branding (logo and business name) based on the incoming hostname.
 * Cached via CacheService for instant sub-millisecond retrieval.
 */
export async function resolveTenantBranding(rawHost: string): Promise<TenantBrandingResult> {
	if (!rawHost) {
		return { isClientSite: false };
	}

	const host = rawHost.toLowerCase().trim().replace(/:\d+$/, "");

	// Check if this is a root marketing host
	if (ROOT_HOSTS.includes(host)) {
		return { isClientSite: false };
	}

	// 1. Determine if subdomain or custom domain
	let subdomain: string | null = null;
	let customDomain: string | null = null;

	if (host.endsWith(".kioosk.online")) {
		subdomain = host.replace(".kioosk.online", "");
	} else if (host.endsWith(".kiosk.site")) {
		subdomain = host.replace(".kiosk.site", "");
	} else if (host.endsWith(".localhost")) {
		subdomain = host.replace(".localhost", "");
	} else {
		// Custom Domain
		customDomain = host;
	}

	if (subdomain === "www" || subdomain === "admin" || subdomain === "api") {
		return { isClientSite: false };
	}

	const cacheKey = `tenant:branding:${subdomain || customDomain}`;

	try {
		const cached = await CacheService.get<TenantBrandingResult>(cacheKey);
		if (cached) {
			return cached;
		}
	} catch (e) {
		// Fallback to direct DB query if cache errors
	}

	try {
		let tenantRecord: typeof tenants.$inferSelect | undefined;
		let projectRecord: typeof projects.$inferSelect | undefined;

		if (subdomain) {
			const cleanSlug = subdomain.toLowerCase().trim();

			// Find tenant by slug
			tenantRecord = await db.query.tenants.findFirst({
				where: eq(tenants.slug, cleanSlug),
			});

			if (tenantRecord) {
				projectRecord = await db.query.projects.findFirst({
					where: eq(projects.tenantId, tenantRecord.id),
					orderBy: (p, { desc }) => [desc(p.updatedAt)],
				});
			} else {
				// Match project by publishedUrl pattern
				projectRecord = await db.query.projects.findFirst({
					where: or(
						ilike(projects.publishedUrl, `%://${cleanSlug}.%`),
						ilike(projects.publishedUrl, `%/${cleanSlug}`),
					),
					orderBy: (p, { desc }) => [desc(p.updatedAt)],
				});

				if (projectRecord) {
					tenantRecord = await db.query.tenants.findFirst({
						where: eq(tenants.id, projectRecord.tenantId),
					});
				}
			}
		} else if (customDomain) {
			tenantRecord = await db.query.tenants.findFirst({
				where: eq(tenants.customDomain, customDomain),
			});

			if (tenantRecord) {
				projectRecord = await db.query.projects.findFirst({
					where: eq(projects.tenantId, tenantRecord.id),
					orderBy: (p, { desc }) => [desc(p.updatedAt)],
				});
			}
		}

		if (!tenantRecord && !projectRecord) {
			// Subdomain not found in DB
			const emptyResult: TenantBrandingResult = {
				isClientSite: true,
				logoUrl: null,
				businessName: subdomain || customDomain || "Client Website",
				slug: subdomain || undefined,
			};
			await CacheService.set(cacheKey, emptyResult, 60);
			return emptyResult;
		}

		let parsedContent: any = null;
		if (projectRecord?.content) {
			try {
				parsedContent = JSON.parse(projectRecord.content);
			} catch (err) {}
		}

		const logoUrl = parsedContent?.logoImage?.url || null;
		const businessName = parsedContent?.businessName || tenantRecord?.name || subdomain || "Client Website";

		const result: TenantBrandingResult = {
			isClientSite: true,
			logoUrl,
			businessName,
			slug: tenantRecord?.slug || subdomain || undefined,
		};

		// Cache for 5 minutes (300 seconds)
		await CacheService.set(cacheKey, result, 300);
		return result;
	} catch (dbErr) {
		console.error("[RESOLVE_TENANT_BRANDING_ERROR]", dbErr);
		return {
			isClientSite: true,
			logoUrl: null,
			businessName: subdomain || customDomain || "Client Website",
		};
	}
}
