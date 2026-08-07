/** @format */

import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, registerInputSchema } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/ratelimit";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: Request) {
	try {
		const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

		// 1. Rate Limiting Check (5 requests / 1 min for auth)
		const rateLimit = await checkRateLimit(ip, "auth");
		if (!rateLimit.success) {
			return NextResponse.json(
				{ error: "Too many registration attempts. Please try again later." },
				{
					status: 429,
					headers: {
						"X-RateLimit-Limit": rateLimit.limit.toString(),
						"X-RateLimit-Remaining": rateLimit.remaining.toString(),
						"X-RateLimit-Reset": rateLimit.reset.toString(),
					},
				},
			);
		}

		// 2. Parse & Validate Payload
		const body = await request.json();
		const validation = registerInputSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: validation.error.flatten().fieldErrors,
				},
				{ status: 400 },
			);
		}

		const { name, email, password } = validation.data;

		// 3. Check for existing user
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, email.toLowerCase()),
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "An account with this email address already exists." },
				{ status: 409 },
			);
		}

		// 4. Hash password & insert user record
		const passwordHash = await hashPassword(password);
		const [newUser] = await db
			.insert(users)
			.values({
				name,
				email: email.toLowerCase(),
				passwordHash,
				role: "USER",
			})
			.returning();

		// 5. Create Session & Set HTTP-Only Cookie
		await createSession(newUser.id);

		// 6. Dispatch Welcome Email asynchronously
		sendWelcomeEmail(newUser.email, newUser.name || "Valued User").catch((err) => {
			console.error("[REGISTER_WELCOME_EMAIL_ERROR]", err);
		});

		return NextResponse.json(
			{
				message: "Account created successfully",
				user: {
					id: newUser.id,
					name: newUser.name,
					email: newUser.email,
					role: newUser.role,
				},
			},
			{
				status: 201,
				headers: {
					"X-RateLimit-Limit": rateLimit.limit.toString(),
					"X-RateLimit-Remaining": rateLimit.remaining.toString(),
					"X-RateLimit-Reset": rateLimit.reset.toString(),
				},
			},
		);
	} catch (error) {
		console.error("[REGISTER_ERROR]", error);
		return NextResponse.json(
			{ error: "An unexpected error occurred during registration." },
			{ status: 500 },
		);
	}
}
