/** @format */

import React from "react";
import type { TenantContentData } from "@/components/tenant/TenantLiveSite";

export interface CustomClientTemplateProps {
	tenantSlug: string;
	plan?: string | null;
	content: TenantContentData;
	publishedUrl: string;
}

// ---------------------------------------------------------------------------
// Import custom client-specific template components here
// Example: import VictorJeremiahStore from "./VictorJeremiahStore";
// ---------------------------------------------------------------------------

import VictorJeremiahStore from "./VictorJeremiahStore";

/**
 * Custom Template Registry
 * Map any client subdomain slug to their custom bespoke React component.
 * Slugs should be in lowercase.
 */
export const customTemplateRegistry: Record<
	string,
	React.ComponentType<CustomClientTemplateProps>
> = {
	"victorjeremiah-2e6925": VictorJeremiahStore,
	// Add new custom client sites here:
	// "bella-bakery": BellaBakeryCustom,
	// "tech-solutions": TechSolutionsCustom,
};

/**
 * Helper to check if a tenant has a custom hand-crafted React template
 */
export function getCustomClientTemplate(
	slugOrSubdomain: string,
): React.ComponentType<CustomClientTemplateProps> | null {
	const normalizedSlug = slugOrSubdomain.toLowerCase().trim();
	return customTemplateRegistry[normalizedSlug] || null;
}
