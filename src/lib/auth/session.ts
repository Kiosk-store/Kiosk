/** @format */

import { cookies } from "next/headers";
import { db } from "@/db";
import { users, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const SESSION_COOKIE_NAME = "kiosk_session";

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
 * Creates a new active session and sets the HTTP-Only cookie
 */
export async function createSession(userId: string): Promise<string> {
	const sessionToken = crypto.randomUUID();
	const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

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
		expires: new Date(0),
	});
}

/**
 * Validates the session cookie and returns the authenticated user object
 */
export async function getAuthenticatedUser(): Promise<SessionUser | null> {
	const cookieStore = await cookies();
	const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

	if (!sessionToken) return null;

	const sessionRecord = await db.query.sessions.findFirst({
		where: eq(sessions.sessionToken, sessionToken),
	});

	if (!sessionRecord || new Date(sessionRecord.expires) < new Date()) {
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
}
