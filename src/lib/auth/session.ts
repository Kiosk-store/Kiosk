/** @format */

import { cookies } from "next/headers";
import { db } from "@/db";
import { users, sessions } from "@/db/schema";
import { eq, and, lt } from "drizzle-orm";

export const SESSION_COOKIE_NAME = "kiosk_session";

// Session lifetime: 24 hours (86,400 seconds)
export const SESSION_MAX_AGE_SECONDS = 24 * 60 * 60;
export const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_SECONDS * 1000;

// Sliding session refresh threshold: if less than 12 hours remaining, extend session back to 24 hours
export const SESSION_REFRESH_THRESHOLD_MS = 12 * 60 * 60 * 1000;

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
 * Creates a new active session and sets the HTTP-Only cookie with a 24-hour lifetime
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
 * Validates the session cookie, automatically purges expired tokens,
 * and refreshes active sessions using a sliding window.
 */
export async function getAuthenticatedUser(): Promise<SessionUser | null> {
	const cookieStore = await cookies();
	const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

	if (!sessionToken) return null;

	const sessionRecord = await db.query.sessions.findFirst({
		where: eq(sessions.sessionToken, sessionToken),
	});

	// If session doesn't exist or is expired
	if (!sessionRecord || new Date(sessionRecord.expires).getTime() < Date.now()) {
		// Purge expired session from DB if found
		if (sessionRecord) {
			try {
				await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
			} catch (e) {
				// Non-blocking
			}
		}

		// Clear stale cookie
		try {
			cookieStore.set(SESSION_COOKIE_NAME, "", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
				maxAge: 0,
				expires: new Date(0),
			});
		} catch (e) {
			// In Server Components cookies may be read-only
		}

		return null;
	}

	// Sliding Session Refresh:
	// If the active session is more than halfway through its lifespan, extend it
	const timeRemaining = new Date(sessionRecord.expires).getTime() - Date.now();
	if (timeRemaining < SESSION_REFRESH_THRESHOLD_MS) {
		const newExpires = new Date(Date.now() + SESSION_MAX_AGE_MS);
		try {
			await db
				.update(sessions)
				.set({ expires: newExpires })
				.where(eq(sessions.sessionToken, sessionToken));

			cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
				maxAge: SESSION_MAX_AGE_SECONDS,
				expires: newExpires,
			});
		} catch (e) {
			// In read-only RSC contexts, cookie update will occur on next API route
		}
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
}
