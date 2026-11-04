import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl =
		process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
			? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
			: "https://kioosk.online";

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/admin/", "/dashboard/", "/api/", "/checkout/"],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}

