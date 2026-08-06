/** @format */

import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { auth } from "@/auth";

export async function GET() {
	try {
		// 1. Check custom database session
		const customUser = await getAuthenticatedUser();
		if (customUser) {
			return NextResponse.json(
				{
					authenticated: true,
					user: customUser,
				},
				{ status: 200 },
			);
		}

		// 2. Fallback to Auth.js session (Google OAuth)
		const authSession = await auth();
		if (authSession?.user) {
			return NextResponse.json(
				{
					authenticated: true,
					user: {
						id: authSession.user.id || "",
						name: authSession.user.name || null,
						email: authSession.user.email || "",
						image: authSession.user.image || null,
						role: (authSession.user as any).role || "USER",
					},
				},
				{ status: 200 },
			);
		}

		return NextResponse.json(
			{ authenticated: false, user: null },
			{ status: 401 },
		);
	} catch (error) {
		console.error("[ME_ERROR]", error);
		return NextResponse.json(
			{ error: "An unexpected error occurred." },
			{ status: 500 },
		);
	}
}
