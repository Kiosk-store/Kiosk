/**
 * Unit & Integration Test Suite — Kiosk Platform
 *
 * Automated tests covering core system architecture:
 * 1. Password Hashing & Verification Security
 * 2. SiteTemplateFactory Pattern Blueprint Generation
 * 3. Multi-Layer CacheService (L1 / L2 Operations)
 * 4. ProjectSubject Observer Pattern Event Dispatching
 *
 * @format
 */

import { hashPassword, verifyPassword } from "../lib/auth/password";
import { SiteTemplateFactory } from "../lib/factory/SiteTemplateFactory";
import { CacheService } from "../lib/cache/CacheService";
import { ProjectSubject } from "../lib/events/ProjectSubject";

async function runTestSuite() {
	console.log("==========================================");
	console.log("[RUNNING] KIOSK AUTOMATED TEST SUITE");
	console.log("==========================================");

	let passedTests = 0;
	let totalTests = 0;

	const assert = (condition: boolean, testName: string) => {
		totalTests++;
		if (condition) {
			console.log(`[PASS] ${testName}`);
			passedTests++;
		} else {
			console.error(`[FAIL] ${testName}`);
		}
	};

	// 1. Password Hashing Tests
	try {
		const rawPassword = "SecurePassword2026!";
		const hash = await hashPassword(rawPassword);
		assert(hash.startsWith("$2"), "Password Hashing: Produces valid bcrypt salt hash");

		const isValid = await verifyPassword(rawPassword, hash);
		assert(isValid, "Password Verification: Matches valid raw password");

		const isInvalid = await verifyPassword("WrongPassword", hash);
		assert(!isInvalid, "Password Verification: Rejects incorrect password");
	} catch (err) {
		assert(false, `Password Module Failure: ${err}`);
	}

	// 2. SiteTemplateFactory Tests
	try {
		const landingTemplate = SiteTemplateFactory.createTemplate("Landing Page");
		assert(
			landingTemplate.tier === "Landing Page" && landingTemplate.defaultPages.length === 1,
			"SiteTemplateFactory: Generates 1-page Landing Page blueprint",
		);

		const funnelTemplate = SiteTemplateFactory.createTemplate("Sales Funnel");
		assert(
			funnelTemplate.tier === "Sales Funnel" && funnelTemplate.defaultPages.length > 1,
			"SiteTemplateFactory: Generates multi-page Sales Funnel blueprint",
		);

		const storeTemplate = SiteTemplateFactory.createTemplate("E-commerce");
		assert(
			storeTemplate.tier === "E-commerce" && storeTemplate.defaultPages.length > 1,
			"SiteTemplateFactory: Generates multi-page E-commerce store blueprint",
		);
	} catch (err) {
		assert(false, `SiteTemplateFactory Failure: ${err}`);
	}

	// 3. CacheService Tests
	try {
		const testKey = `test_key_${Date.now()}`;
		const testPayload = { tenantId: "tenant_123", status: "active" };

		await CacheService.set(testKey, testPayload, 60);
		const cached = await CacheService.get<typeof testPayload>(testKey);
		assert(
			cached?.tenantId === "tenant_123",
			"CacheService: Writes and reads L1/L2 cache entry",
		);

		await CacheService.invalidate(testKey);
		const evicted = await CacheService.get(testKey);
		assert(evicted === null, "CacheService: Evicts cache key upon invalidation");
	} catch (err) {
		assert(false, `CacheService Failure: ${err}`);
	}

	// 4. ProjectSubject Observer Pattern Tests
	try {
		let eventReceived = false;

		const mockObserver = {
			name: "TestObserver",
			update: () => {
				eventReceived = true;
			},
		};

		const subject = ProjectSubject.getInstance();
		subject.subscribe(mockObserver);

		await subject.notify({
			id: "test_event_1",
			type: "PROJECT_CREATED",
			timestamp: new Date().toISOString(),
			tenantId: "tenant_test",
			payload: { name: "Test Project" },
		});

		assert(eventReceived, "ProjectSubject: Dispatches domain events to observers");
	} catch (err) {
		assert(false, `ProjectSubject Failure: ${err}`);
	}

	console.log("==========================================");
	console.log(`[TEST SUMMARY] ${passedTests} / ${totalTests} PASSED`);
	console.log("==========================================");
}

runTestSuite().catch(console.error);
