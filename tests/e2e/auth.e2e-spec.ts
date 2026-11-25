import { test, expect } from "@playwright/test";
import { hashPassword, verifyPassword, registerInputSchema } from "../../src/lib/auth/password";
import { extractTurnstileToken, verifyTurnstileToken } from "../../src/lib/security/turnstile";

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

	test("registerInputSchema - Rejects disposable email domains and subdomains", () => {
		for (const email of ["bot@mailinator.com", "spam@sub.yopmail.com", "tmp@guerrillamail.com"]) {
			const result = registerInputSchema.safeParse({
				name: "Real Name",
				email,
				password: "ValidPassword123!",
			});
			expect(result.success).toBe(false);
		}
	});

	test("registerInputSchema - Blocks URLs and HTML in names while allowing international names", () => {
		for (const badName of [
			"Visit https://spam.example",
			"Check www.promo.site",
			"<b>Promo</b>",
			"Free money promo.xyz",
			"Click bit.ly/abc",
		]) {
			const res = registerInputSchema.safeParse({
				name: badName,
				email: "legit@gmail.com",
				password: "ValidPassword123!",
			});
			expect(res.success).toBe(false);
		}

		for (const goodName of [
			"Chukwuemeka O'Connor-Adeyemi",
			"Dr. A. Bello",
			"María José",
			"Studio 24 & Co.",
		]) {
			const res = registerInputSchema.safeParse({
				name: goodName,
				email: "legit@gmail.com",
				password: "ValidPassword123!",
			});
			expect(res.success).toBe(true);
		}
	});

	test("Turnstile helper - extracts canonical tokens and rejects missing/oversized tokens", async () => {
		expect(extractTurnstileToken({ turnstileToken: " tok_123 " })).toBe("tok_123");
		expect(extractTurnstileToken({ "cf-turnstile-response": "cf_tok_456" })).toBe("cf_tok_456");
		expect(extractTurnstileToken({})).toBe("");

		const prevSecret = process.env.TURNSTILE_SECRET_KEY;
		process.env.TURNSTILE_SECRET_KEY = "1x0000000000000000000000000000000AA";
		try {
			const emptyResult = await verifyTurnstileToken({
				token: "",
				expectedAction: "signup",
			});
			expect(emptyResult.ok).toBe(false);
			expect(emptyResult.code).toBe("missing");

			const oversizedResult = await verifyTurnstileToken({
				token: "a".repeat(2049),
				expectedAction: "signup",
			});
			expect(oversizedResult.ok).toBe(false);
			expect(oversizedResult.code).toBe("missing");
		} finally {
			if (prevSecret === undefined) {
				delete process.env.TURNSTILE_SECRET_KEY;
			} else {
				process.env.TURNSTILE_SECRET_KEY = prevSecret;
			}
		}
	});
});
