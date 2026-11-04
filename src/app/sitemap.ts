import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl =
		process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
			? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
			: "https://kioosk.online";

	const now = new Date();

	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: `${baseUrl}`,
			lastModified: now,
			changeFrequency: "daily",
			priority: 1.0,
		},
		{
			url: `${baseUrl}/services`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/showcase`,
			lastModified: now,
			changeFrequency: "daily",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/get-started`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/templates`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/templates/agency`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/templates/ecommerce`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/templates/restaurant`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/templates/consulting`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/templates/landing-page`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/templates/sales-funnel`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/privacy`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.4,
		},
		{
			url: `${baseUrl}/terms`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.4,
		},
	];

	return staticRoutes;
}

