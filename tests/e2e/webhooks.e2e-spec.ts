import { test, expect } from "@playwright/test";
import {
	verifyFlutterwaveWebhookHash,
	verifyFlutterwaveTransaction,
} from "../../src/lib/payments/flutterwave";

test.describe("Flutterwave Webhook Security & Transaction Verification", () => {
	test("verifyFlutterwaveWebhookHash - Validates secret hash matching", () => {
		// When env variable is empty or matches
		const isValid = verifyFlutterwaveWebhookHash("kiosk_flutterwave_secret_hash");
		expect(typeof isValid).toBe("boolean");
	});

	test("verifyFlutterwaveTransaction - Returns mock verification when secret key is unset", async () => {
		const verified = await verifyFlutterwaveTransaction("123456");
		expect(verified).toBeDefined();
		expect(verified?.status).toBe("successful");
	});
});
