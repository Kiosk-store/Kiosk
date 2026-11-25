/** @format */

import { NextResponse } from "next/server";
import {
	createFormToken,
	getClientIp,
	verifySameOrigin,
	type FormTokenScope,
} from "@/lib/security/antispam";
import { buildRateLimitHeaders, checkRateLimit } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

const ALLOWED_SCOPES = new Set<FormTokenScope>([
	"signup",
	"forgot-password",
	"contact",
]);

/**
 * GET /api/auth/form-token?scope=signup|forgot-password|contact
 * Issues a signed, time-stamped anti-bot token when a public form loads in the browser.
 */
export async function GET(request: Request) {
	try {
		const originCheck = verifySameOrigin(request, { allowMissingOnGet: true });
		if (!originCheck.ok) {
			return NextResponse.json(
				{ error: "Forbidden request origin." },
				{ status: 403 },
			);
		}

		const ip = getClientIp(request);
		const rateLimit = await checkRateLimit(ip, "formToken");
		if (!rateLimit.success) {
			return NextResponse.json(
				{ error: "Too many requests. Please try again shortly." },
				{
					status: 429,
					headers: buildRateLimitHeaders(rateLimit),
				},
			);
		}

		const url = new URL(request.url);
		const rawScope = url.searchParams.get("scope") as FormTokenScope | null;
		const scope: FormTokenScope =
			rawScope && ALLOWED_SCOPES.has(rawScope) ? rawScope : "signup";

		const token = createFormToken(scope);

		return NextResponse.json(
			{ token },
			{
				status: 200,
				headers: {
					"Cache-Control": "no-store, no-cache, must-revalidate, private",
					Pragma: "no-cache",
					...buildRateLimitHeaders(rateLimit),
				},
			},
		);
	} catch (error) {
		console.error("[FORM_TOKEN_ERROR]", error);
		return NextResponse.json(
			{ error: "Unable to initialize form security token." },
			{ status: 500 },
		);
	}
}
