import { test, expect } from "@playwright/test";
import {
	sendWelcomeEmail,
	sendWebsiteReviewNotificationToAdmin,
	sendWebsiteReviewConfirmationToClient,
	sendWebsiteLiveEmail,
	sendProjectStatusEmail,
	sendPaymentRequestEmail,
	sendGracePeriodReminderEmail,
	sendSiteFlaggedNoticeEmail,
	sendPasswordResetEmail,
	escapeHtml,
	sanitizeEmailHeader,
	sanitizeEmailUrl,
} from "../../src/lib/email";

test.describe("Phase 4 Transactional Email Notification System (`src/lib/email.ts`)", () => {
	const testEmail = "test_subscriber@example.com";
	const testName = "Jane Doe";

	test("1. sendWelcomeEmail - Dispatches onboarding email safely", async () => {
		const result = await sendWelcomeEmail(testEmail, testName);
		expect(result).toBeDefined();
		expect(result.success).toBe(true);
		expect(result.id).toBeDefined();
	});

	test("2. sendWebsiteReviewNotificationToAdmin - Dispatches intake notification to fulfillment team", async () => {
		const result = await sendWebsiteReviewNotificationToAdmin({
			clientName: testName,
			clientEmail: testEmail,
			businessName: "Lagos Artisan Bakery",
			tagline: "Fresh artisanal sourdough pastries daily",
			plan: "E_COMMERCE",
			imagesCount: 5,
			productsCount: 12,
			projectId: "proj_test_123",
			themeMode: "Midnight",
		});

		expect(result.success).toBe(true);
		expect(result.id).toBeDefined();
	});

	test("3. sendWebsiteReviewConfirmationToClient - Dispatches receipt acknowledgement to client", async () => {
		const result = await sendWebsiteReviewConfirmationToClient(
			testEmail,
			testName,
			"Lagos Artisan Bakery",
			"E_COMMERCE",
		);

		expect(result.success).toBe(true);
		expect(result.id).toBeDefined();
	});

	test("4. sendWebsiteLiveEmail - Dispatches celebration email with published site URL", async () => {
		const result = await sendWebsiteLiveEmail({
			toEmail: testEmail,
			clientName: testName,
			businessName: "Lagos Artisan Bakery",
			publishedUrl: "https://lagosbakery.kioosk.online",
			plan: "E_COMMERCE",
		});

		expect(result.success).toBe(true);
		expect(result.id).toBeDefined();
	});

	test("5. sendProjectStatusEmail - Dispatches status transition notification", async () => {
		const result = await sendProjectStatusEmail(
			testEmail,
			testName,
			"Lagos Artisan Bakery",
			"In Review",
			"https://lagosbakery.kioosk.online",
		);

		expect(result.success).toBe(true);
		expect(result.id).toBeDefined();
	});

	test("6. sendPaymentRequestEmail - Dispatches renewal invoice payment request", async () => {
		const result = await sendPaymentRequestEmail({
			toEmail: testEmail,
			userName: testName,
			invoiceNumber: "INV-2026-98765",
			plan: "E-Commerce Store",
			amount: 50,
			currency: "USD",
			dueDate: "2026-10-01",
			paymentLink: "https://kioosk.online/dashboard/billing?inv=INV-2026-98765",
		});

		expect(result.success).toBe(true);
		expect(result.id).toBeDefined();
	});

	test("7. sendGracePeriodReminderEmail - Dispatches grace period countdown reminder", async () => {
		const result = await sendGracePeriodReminderEmail({
			toEmail: testEmail,
			userName: testName,
			invoiceNumber: "INV-2026-98765",
			plan: "E-Commerce Store",
			amount: 50,
			currency: "USD",
			daysRemaining: 4,
			paymentLink: "https://kioosk.online/dashboard/billing?inv=INV-2026-98765",
		});

		expect(result.success).toBe(true);
		expect(result.id).toBeDefined();
	});

	test("8. sendSiteFlaggedNoticeEmail - Dispatches suspension notice with recovery link", async () => {
		const result = await sendSiteFlaggedNoticeEmail({
			toEmail: testEmail,
			userName: testName,
			invoiceNumber: "INV-2026-98765",
			plan: "E-Commerce Store",
			amount: 50,
			currency: "USD",
			paymentLink: "https://kioosk.online/dashboard/billing?inv=INV-2026-98765",
		});

		expect(result.success).toBe(true);
		expect(result.id).toBeDefined();
	});

	test("9. sendPasswordResetEmail - Dispatches secure password reset token link", async () => {
		const result = await sendPasswordResetEmail({
			toEmail: testEmail,
			userName: testName,
			resetUrl: "https://kioosk.online/reset-password?token=secure_mock_token_123",
		});

		expect(result.success).toBe(true);
		expect(result.id).toBeDefined();
	});

	test("10. Email sanitizers escape HTML, strip CR/LF headers, and block unsafe URLs", () => {
		expect(escapeHtml(`<a href="https://evil.test">Win & 'Now'</a>`)).toBe(
			"&lt;a href=&quot;https://evil.test&quot;&gt;Win &amp; &#39;Now&#39;&lt;/a&gt;",
		);
		expect(sanitizeEmailHeader("Hello\r\nBcc: victim@example.com")).toBe(
			"Hello Bcc: victim@example.com",
		);
		expect(sanitizeEmailUrl("javascript:alert(1)")).toBe("");
		expect(sanitizeEmailUrl("data:text/html,<script>alert(1)</script>")).toBe("");
		expect(sanitizeEmailUrl("mailto:victim@example.com")).toBe("");
		expect(sanitizeEmailUrl("https://kioosk.online/dashboard")).toBe(
			"https://kioosk.online/dashboard",
		);
	});
});
