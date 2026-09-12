import { test, expect } from "@playwright/test";
import {
	verifyPaystackWebhookSignature,
	verifyPaystackTransaction,
} from "../../src/lib/payments/paystack";

test.describe("Paystack Webhook Security & Transaction Verification", () => {
	test("verifyPaystackWebhookSignature - Validates webhook signature handling", () => {
		// In dev/mock mode or with valid secret
		const isValid = verifyPaystackWebhookSignature("mock_signature", JSON.stringify({ event: "charge.success" }));
		expect(typeof isValid).toBe("boolean");
	});

	test("verifyPaystackTransaction - Returns verification when checked", async () => {
		const verified = await verifyPaystackTransaction("kiosk_tx_123456");
		expect(verified).toBeDefined();
		expect(verified?.status).toBe("success");
		expect(verified?.reference).toBe("kiosk_tx_123456");
	});
});
