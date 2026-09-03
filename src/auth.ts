/** @format */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users, accounts, sessions, verificationTokens, tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/auth/password";
import { sendWelcomeEmail } from "@/lib/email";

// Resolve authentication environment variables purely from process.env (.env.local / .env)
const googleClientId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET;
const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

export const { handlers, auth, signIn, signOut } = NextAuth({
	trustHost: true,
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens,
	}),
	session: {
		strategy: "jwt",
		maxAge: 6 * 60 * 60, // 6 hours
	},
	pages: {
		signIn: "/get-started",
		error: "/get-started",
	},
	providers: [
		Google({
			clientId: googleClientId,
			clientSecret: googleClientSecret,
			allowDangerousEmailAccountLinking: true,
		}),
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const email = (credentials.email as string).toLowerCase().trim();
				const password = credentials.password as string;

				try {
					const user = await db.query.users.findFirst({
						where: eq(users.email, email),
					});

					if (!user || !user.passwordHash) {
						return null;
					}

					const isValid = await verifyPassword(password, user.passwordHash);
					if (!isValid) {
						return null;
					}

					return {
						id: user.id,
						name: user.name,
						email: user.email,
						image: user.image,
						role: user.role,
					};
				} catch (dbErr) {
					console.error("[AUTH_CREDENTIALS_DB_ERROR]", dbErr);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = (user as { role?: string }).role || "USER";
			}
			return token;
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id as string;
				(session.user as { role?: string }).role = (token.role as string) || "USER";
			}
			return session;
		},
	},
	events: {
		async createUser({ user }) {
			if (user.email) {
				sendWelcomeEmail(user.email, user.name || "Valued User").catch((err) => {
					console.error("[AUTH_EVENT_WELCOME_EMAIL_ERROR]", err);
				});
			}

			// Auto-provision initial tenant workspace for newly created Google OAuth user
			if (user.id) {
				try {
					const existingTenant = await db.query.tenants.findFirst({
						where: eq(tenants.ownerId, user.id),
					});

					if (!existingTenant) {
						const cleanSlug = `${(user.name || "workspace")
							.toLowerCase()
							.replace(/[^a-z0-9]/g, "")}-${crypto.randomUUID().slice(0, 6)}`;

						await db.insert(tenants).values({
							ownerId: user.id,
							name: `${user.name || "User"}'s Workspace`,
							slug: cleanSlug,
							plan: "NONE",
							billingStatus: "ACTIVE",
						});
					}
				} catch (tenantErr) {
					console.error("[AUTH_EVENT_TENANT_CREATION_ERROR]", tenantErr);
				}
			}
		},
	},
	secret: authSecret,
});
