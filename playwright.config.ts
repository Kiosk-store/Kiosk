import { defineConfig } from "@playwright/test";

/**
 * Playwright E2E & API Test Configuration — Kiosk Platform
 *
 * Configured for headless execution, API test assertions, and local Next.js webserver.
 */
export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [["list"], ["html", { open: "never" }]],
	use: {
		baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",
		trace: "on-first-retry",
		extraHTTPHeaders: {
			Accept: "application/json",
		},
	},
	projects: [
		{
			name: "api-e2e",
			testMatch: /.*\.e2e-spec\.ts/,
		},
	],
	webServer: process.env.START_WEBSERVER
		? {
				command: "npm run dev",
				url: "http://localhost:3000",
				reuseExistingServer: true,
				timeout: 120 * 1000,
		  }
		: undefined,
});
