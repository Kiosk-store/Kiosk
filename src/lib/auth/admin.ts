/** @format */

import { auth } from "@/auth";
import { getAuthenticatedUser, SessionUser } from "@/lib/auth/session";

/**
 * Checks whether a given user object or email has Admin privileges.
 */
export function isAdmin(user?: { role?: string | null; email?: string | null } | null): boolean {
	if (!user || !user.email) return false;

	const configuredAdminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
	const configuredNotificationEmail = (process.env.NOTIFICATION_EMAIL || "").toLowerCase().trim();
	const userEmail = user.email.toLowerCase().trim();

	if (
		user.role === "ADMIN" ||
		user.role === "SUPERADMIN" ||
		(configuredAdminEmail && userEmail === configuredAdminEmail) ||
		(configuredNotificationEmail && userEmail === configuredNotificationEmail)
	) {
		return true;
	}

	return false;
}

/**
 * Resolves the currently authenticated user from either custom session or OAuth session
 * and verifies that they hold Admin authorization privileges.
 */
export async function getAuthenticatedAdmin(): Promise<SessionUser | null> {
	// 1. Check custom session token
	const customUser = await getAuthenticatedUser();
	if (customUser && isAdmin(customUser)) {
		return customUser;
	}

	// 2. Check NextAuth OAuth session fallback
	const oauthSession = await auth();
	if (oauthSession?.user?.email) {
		const oauthUserObj: SessionUser = {
			id: (oauthSession.user as any).id || "oauth-user",
			name: oauthSession.user.name || null,
			email: oauthSession.user.email,
			image: oauthSession.user.image || null,
			role: (oauthSession.user as any).role || "USER",
		};

		if (isAdmin(oauthUserObj)) {
			return oauthUserObj;
		}
	}

	return null;
}
