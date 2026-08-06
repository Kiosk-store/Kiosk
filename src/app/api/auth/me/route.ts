/** @format */

import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";

export async function GET() {
	try {
		const user = await getAuthenticatedUser();

		if (!user) {
			return NextResponse.json(
				{ authenticated: false, user: null },
				{ status: 401 },
			);
		}

		return NextResponse.json(
			{
				authenticated: true,
				user,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("[ME_ERROR]", error);
		return NextResponse.json(
			{ error: "An unexpected error occurred." },
			{ status: 500 },
		);
	}
}
