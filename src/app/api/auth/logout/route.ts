/** @format */

import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";
import { cookies } from "next/headers";

export async function POST() {
	try {
		// 1. Destroy custom database session & clear session cookie
		await destroySession();

		// 2. Explicitly clear all Auth.js / NextAuth session cookies
		const cookieStore = await cookies();
		const authCookies = [
			"authjs.session-token",
			"__Secure-authjs.session-token",
			"next-auth.session-token",
			"__Secure-next-auth.session-token",
			"authjs.callback-url",
			"authjs.csrf-token",
			"next-auth.callback-url",
			"next-auth.csrf-token",
		];

		for (const cookieName of authCookies) {
			cookieStore.set(cookieName, "", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
				expires: new Date(0),
			});
		}

		return NextResponse.json(
			{ message: "Logged out successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("[LOGOUT_ERROR]", error);
		return NextResponse.json(
			{ error: "An unexpected error occurred during logout." },
			{ status: 500 },
		);
	}
}
