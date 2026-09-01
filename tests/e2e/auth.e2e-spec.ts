import { test, expect } from "@playwright/test";
import { hashPassword, verifyPassword, registerInputSchema } from "../../src/lib/auth/password";

test.describe("Authentication Logic & Security Validation", () => {
	const validPassword = "SecurePassword2026!";

	test("Password Security - Hashes and verifies password with bcrypt salt", async () => {
		const hash = await hashPassword(validPassword);
		expect(hash.startsWith("$2")).toBe(true);

		const isMatch = await verifyPassword(validPassword, hash);
		expect(isMatch).toBe(true);

		const isMismatch = await verifyPassword("WrongPassword123!", hash);
		expect(isMismatch).toBe(false);
	});

	test("registerInputSchema - Successfully validates valid registration payload", () => {
		const validData = {
			name: "Jane Doe",
			email: "jane@example.com",
			password: "ValidPassword123!",
		};
		const result = registerInputSchema.safeParse(validData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.email).toBe("jane@example.com");
		}
	});

	test("registerInputSchema - Rejects malformed payload and short passwords", () => {
		const invalidData = {
			name: "",
			email: "invalid-email-format",
			password: "short",
		};
		const result = registerInputSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			expect(errors.email).toBeDefined();
			expect(errors.password).toBeDefined();
		}
	});
});
