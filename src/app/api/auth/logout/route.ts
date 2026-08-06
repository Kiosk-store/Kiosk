/** @format */

import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

export async function POST() {
	try {
		await destroySession();

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
