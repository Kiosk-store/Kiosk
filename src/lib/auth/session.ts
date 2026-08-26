/** @format */

import { cookies } from "next/headers";
import { db } from "@/db";
import { users, sessions, invoices, tenants } from "@/db/schema";
import { eq, and, lt, gt } from "drizzle-orm";
import { auth } from "@/auth";

export const SESSION_COOKIE_NAME = "kiosk_session";

// Session lifetime: 6 hours (21,600 seconds)
export const SESSION_MAX_AGE_SECONDS = 6 * 60 * 60;
export const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_SECONDS * 1000;

// Sliding session refresh threshold: if less than 3 hours remaining, extend session back to 6 hours
export const SESSION_REFRESH_THRESHOLD_MS = 3 * 60 * 60 * 1000;

export interface SessionUser {
	id: string;
	name: string | null;
	email: string;
	image: string | null;
	phone?: string | null;
	role: string;
	emailNotifications?: boolean;
	projectUpdates?: boolean;
}

/**
 * Creates a new active session and sets the HTTP-Only cookie with a 6-hour lifetime
 */
export async function createSession(userId: string): Promise<string> {
	const sessionToken = crypto.randomUUID();
	const expires = new Date(Date.now() + SESSION_MAX_AGE_MS);

	// Clean up any stale expired sessions for this user
	try {
		await db
			.delete(sessions)
			.where(and(eq(sessions.userId, userId), lt(sessions.expires, new Date())));
	} catch (e) {
		// Non-blocking cleanup
	}

	// Insert session into DB
	await db.insert(sessions).values({
		sessionToken,
		userId,
		expires,
	});

	// Set HTTP-Only Cookie
	const cookieStore = await cookies();
	cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: SESSION_MAX_AGE_SECONDS,
		expires,
	});

	return sessionToken;
}

/**
 * Destroys current session and clears the session cookie
 */
export async function destroySession(): Promise<void> {
	const cookieStore = await cookies();
	const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

	if (sessionToken) {
		await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
	}

	cookieStore.set(SESSION_COOKIE_NAME, "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 0,
		expires: new Date(0),
	});
}

/**
 * Validates the session cookie, automatically purges expired tokens (logging user out),
 * except if the user is currently in the process of making a payment.
 */
export async function getAuthenticatedUser(): Promise<SessionUser | null> {
	try {
		const cookieStore = await cookies();
		const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

		if (!sessionToken) return null;

		const sessionRecord = await db.query.sessions.findFirst({
			where: eq(sessions.sessionToken, sessionToken),
		});

		// If session doesn't exist or is expired
		if (!sessionRecord || new Date(sessionRecord.expires).getTime() < Date.now()) {
			if (sessionRecord) {
				try {
					const activePendingInvoice = await db.query.invoices.findFirst({
						where: and(
							eq(invoices.userId, sessionRecord.userId),
							eq(invoices.status, "PENDING"),
							gt(invoices.createdAt, new Date(Date.now() - 60 * 60 * 1000)),
						),
					});

					if (activePendingInvoice) {
						const graceExpires = new Date(Date.now() + 60 * 60 * 1000);
						await db
							.update(sessions)
							.set({ expires: graceExpires })
							.where(eq(sessions.sessionToken, sessionToken));

						const userRecord = await db.query.users.findFirst({
							where: eq(users.id, sessionRecord.userId),
						});

						if (userRecord) {
							return {
								id: userRecord.id,
								name: userRecord.name,
								email: userRecord.email,
								image: userRecord.image,
								phone: userRecord.phone,
								role: userRecord.role,
								emailNotifications: userRecord.emailNotifications,
								projectUpdates: userRecord.projectUpdates,
							};
						}
					}
				} catch (err) {}

				try {
					await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
				} catch (e) {}
			}

			return null;
		}

		const userRecord = await db.query.users.findFirst({
			where: eq(users.id, sessionRecord.userId),
		});

		if (!userRecord) return null;

		return {
			id: userRecord.id,
			name: userRecord.name,
			email: userRecord.email,
			image: userRecord.image,
			phone: userRecord.phone,
			role: userRecord.role,
			emailNotifications: userRecord.emailNotifications,
			projectUpdates: userRecord.projectUpdates,
		};
	} catch (e) {
		console.error("[GET_AUTH_USER_ERROR]", e);
		return null;
	}
}

/**
 * Unified helper resolving the active database user and their tenant workspace,
 * supporting both custom session cookies and NextAuth / Google OAuth sessions.
 */
export async function getAuthenticatedTenantContext() {
	try {
		// 1. Try custom session cookie
		const customUser = await getAuthenticatedUser();
		let dbUser: any = null;

		if (customUser) {
			dbUser = await db.query.users.findFirst({
				where: eq(users.id, customUser.id),
			});
		}

		// 2. Fallback to NextAuth Google OAuth
		if (!dbUser) {
			try {
				const authSession = await auth();
				if (authSession?.user) {
					const email = authSession.user.email?.toLowerCase().trim();
					if (email) {
						dbUser = await db.query.users.findFirst({
							where: eq(users.email, email),
						});
					}
					if (!dbUser && authSession.user.id) {
						dbUser = await db.query.users.findFirst({
							where: eq(users.id, authSession.user.id),
						});
					}
				}
			} catch (oauthErr) {
				console.error("[OAUTH_AUTH_CHECK_ERROR]", oauthErr);
			}
		}

		if (!dbUser) {
			return { user: null, tenant: null };
		}

		// 3. Find or auto-provision tenant for this user
		let tenant = await db.query.tenants.findFirst({
			where: eq(tenants.ownerId, dbUser.id),
		});

		if (!tenant) {
			const cleanSlug = `${(dbUser.name || "workspace").toLowerCase().replace(/[^a-z0-9]/g, "")}-${crypto.randomUUID().slice(0, 6)}`;
			const [newTenant] = await db
				.insert(tenants)
				.values({
					ownerId: dbUser.id,
					name: `${dbUser.name || "User"}'s Workspace`,
					slug: cleanSlug,
					plan: "NONE",
					billingStatus: "ACTIVE",
				})
				.returning();
			tenant = newTenant;
		}

		return { user: dbUser, tenant };
	} catch (err) {
		console.error("[GET_AUTH_TENANT_CONTEXT_ERROR]", err);
		return { user: null, tenant: null };
	}
}
