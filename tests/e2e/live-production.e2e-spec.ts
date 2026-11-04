import { test, expect } from "@playwright/test";

const BASE_URL = "https://kioosk.online";

test.describe("Live Production E2E Suite — kioosk.online", () => {
	test("1. Root Homepage is accessible and returns HTTP 200 with Kioosk branding", async ({ request }) => {
		const res = await request.get(`${BASE_URL}/`, {
			headers: { Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
		});
		expect(res.status()).toBe(200);
		const html = await res.text();
		expect(html).toContain("Kioosk | Modern Websites for Small Businesses");
		expect(html).toContain('content="bKNxJT8mp29T-_zzK5wAwGPr0nxdDt4TOU8j_tbvjoo"');
	});

	test("2. Google Search Console HTML verification file is live", async ({ request }) => {
		const res = await request.get(`${BASE_URL}/google6c8530091151f229.html`);
		expect(res.status()).toBe(200);
		const text = await res.text();
		expect(text).toContain("google-site-verification: google6c8530091151f229.html");
	});

	test("3. Dynamic Robots.txt is live and references sitemap.xml", async ({ request }) => {
		const res = await request.get(`${BASE_URL}/robots.txt`);
		expect(res.status()).toBe(200);
		const text = await res.text();
		expect(text).toContain("User-Agent: *");
		expect(text).toContain("Sitemap: https://kioosk.online/sitemap.xml");
		expect(text).toContain("Disallow: /admin/");
		expect(text).toContain("Disallow: /checkout/");
	});

	test("4. Dynamic Sitemap.xml is live, returns application/xml, and lists canonical URLs", async ({ request }) => {
		const res = await request.get(`${BASE_URL}/sitemap.xml`, {
			headers: { Accept: "application/xml,text/xml,*/*" },
		});
		expect(res.status()).toBe(200);
		const contentType = res.headers()["content-type"];
		expect(contentType).toContain("xml");

		const xml = await res.text();
		expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		expect(xml).toContain("<loc>https://kioosk.online</loc>");
		expect(xml).toContain("<loc>https://kioosk.online/services</loc>");
		expect(xml).toContain("<loc>https://kioosk.online/showcase</loc>");
		expect(xml).toContain("<loc>https://kioosk.online/get-started</loc>");
		expect(xml).toContain("<loc>https://kioosk.online/terms</loc>");
		expect(xml).toContain("<loc>https://kioosk.online/privacy</loc>");
	});

	test("5. Public Service and Showcase routes return HTTP 200", async ({ request }) => {
		const pages = ["/services", "/showcase", "/get-started", "/contact", "/templates"];
		for (const path of pages) {
			const res = await request.get(`${BASE_URL}${path}`, {
				headers: { Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
			});
			expect(res.status(), `Failed on route: ${path}`).toBe(200);
		}
	});

	test("6. Legal and Compliance pages display Kioosk brand identity", async ({ request }) => {
		const termsRes = await request.get(`${BASE_URL}/terms`, {
			headers: { Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
		});
		expect(termsRes.status()).toBe(200);
		const termsHtml = await termsRes.text();
		expect(termsHtml).toContain("Kioosk");

		const privacyRes = await request.get(`${BASE_URL}/privacy`, {
			headers: { Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
		});
		expect(privacyRes.status()).toBe(200);
		const privacyHtml = await privacyRes.text();
		expect(privacyHtml).toContain("Kioosk");
	});

	test("7. Security Headers are correctly enforced in production", async ({ request }) => {
		const res = await request.get(`${BASE_URL}/`);
		const headers = res.headers();
		expect(headers["strict-transport-security"]).toBeDefined();
		expect(headers["x-content-type-options"]).toBe("nosniff");
		expect(headers["x-frame-options"]).toBe("DENY");
	});

	test("8. Protected and Admin routes block unauthenticated access", async ({ request }) => {
		const res = await request.get(`${BASE_URL}/admin`, {
			maxRedirects: 0,
			headers: { Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
		});
		// Should either redirect to signin (307/302/308) or 401/404/403
		expect([301, 302, 307, 308, 401, 403, 404]).toContain(res.status());
	});
});
