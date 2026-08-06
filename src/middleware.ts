/** @format */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/checkout"];
const AUTH_ROUTES = ["/get-started"];

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

	// 1. Extract session tokens (Custom session or Auth.js session cookie)
	const customSession = request.cookies.get("kiosk_session")?.value;
	const authJsSession =
		request.cookies.get("authjs.session-token")?.value ||
		request.cookies.get("__Secure-authjs.session-token")?.value ||
		request.cookies.get("next-auth.session-token")?.value ||
		request.cookies.get("__Secure-next-auth.session-token")?.value;

	const isAuthenticated = Boolean(customSession || authJsSession);

	// 2. Guard Protected Routes (/dashboard, /checkout)
	const isProtectedRoute = PROTECTED_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);

	if (isProtectedRoute && !isAuthenticated) {
		const loginUrl = new URL("/get-started", request.url);
		loginUrl.searchParams.set("tab", "login");
		loginUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(loginUrl);
	}

	// 3. Redirect Authenticated Users Away From Auth Page (/get-started)
	const isAuthRoute = AUTH_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);

	if (isAuthRoute && isAuthenticated) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// 4. Inject Edge Rate Limit Headers for API Routes
	const response = NextResponse.next();
	response.headers.set("X-Client-IP", ip);

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder assets (.png, .jpg, .svg, .woff2)
		 */
		"/((?!_next/static|_next/image|favicon.ico|fonts/|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2)$).*)",
	],
};
