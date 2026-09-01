import { test, expect } from "@playwright/test";
import { ProjectSubject } from "../../src/lib/events/ProjectSubject";
import { CacheService } from "../../src/lib/cache/CacheService";

test.describe("Decoupled Event Bus & Caching Engine", () => {
	test("ProjectSubject - Dispatches events to subscribed observers", async () => {
		let received = false;
		const subject = ProjectSubject.getInstance();

		const testObserver = {
			name: "E2ETestObserver",
			update: () => {
				received = true;
			},
		};

		subject.subscribe(testObserver);
		await subject.notify({
			id: "evt_test_123",
			type: "PROJECT_CREATED",
			timestamp: new Date().toISOString(),
			tenantId: "tenant_sample",
			payload: { name: "Test Store" },
		});

		expect(received).toBe(true);
		subject.unsubscribe("E2ETestObserver");
	});

	test("CacheService - L1 In-Memory and L2 Cache Operations", async () => {
		const key = `test_cache_${Date.now()}`;
		const data = { sample: "data_123" };

		await CacheService.set(key, data, 30);
		const cached = await CacheService.get<typeof data>(key);
		expect(cached?.sample).toBe("data_123");

		await CacheService.invalidate(key);
		const invalidated = await CacheService.get(key);
		expect(invalidated).toBeNull();
	});
});
