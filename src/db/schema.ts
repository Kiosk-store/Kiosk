/** @format */

import {
	pgTable,
	text,
	timestamp,
	integer,
	primaryKey,
	boolean,
} from "drizzle-orm/pg-core";

/**
 * 1. User Accounts Table
 */
export const users = pgTable("users", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name"),
	email: text("email").notNull().unique(),
	emailVerified: timestamp("emailVerified", { mode: "date" }),
	passwordHash: text("passwordHash"),
	image: text("image"),
	role: text("role").default("USER").notNull(),
	createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

/**
 * 2. OAuth Provider Accounts Table (Google, GitHub)
 */
export const accounts = pgTable(
	"accounts",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").$type<"oauth" | "oidc" | "email">().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => [
		primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	],
);

/**
 * 3. Active User Sessions Table
 */
export const sessions = pgTable("sessions", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: "date" }).notNull(),
});

/**
 * 4. Email Verification & Password Reset Tokens Table
 */
export const verificationTokens = pgTable(
	"verification_tokens",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { mode: "date" }).notNull(),
	},
	(vt) => [
		primaryKey({
			columns: [vt.identifier, vt.token],
		}),
	],
);

/**
 * 5. Tenants Table (Multi-Tenant Workspaces / Businesses)
 * Each customer account owns a tenant workspace with subdomains and custom domains.
 */
export const tenants = pgTable("tenants", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	ownerId: text("ownerId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(), // e.g. "bella-bakery" -> bella-bakery.kiosk.site
	customDomain: text("customDomain").unique(), // e.g. "bellabakery.com"
	plan: text("plan").default("NONE").notNull(), // NONE | LANDING_PAGE | SALES_FUNNEL | E_COMMERCE
	isCustomDomainVerified: boolean("isCustomDomainVerified").default(false).notNull(),
	createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

/**
 * 6. Projects Table (Websites / Sales Funnels / E-Commerce Stores under a Tenant)
 */
export const projects = pgTable("projects", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	tenantId: text("tenantId")
		.notNull()
		.references(() => tenants.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	type: text("type").notNull(), // "Landing Page" | "Sales Funnel" | "E-commerce"
	status: text("status").default("In Progress").notNull(), // "Draft" | "In Progress" | "Published"
	progress: integer("progress").default(0).notNull(),
	publishedUrl: text("publishedUrl"),
	createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

/**
 * 7. Subscriptions Table (Stripe / Paystack Billing per Tenant)
 */
export const subscriptions = pgTable("subscriptions", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	tenantId: text("tenantId")
		.notNull()
		.references(() => tenants.id, { onDelete: "cascade" }),
	gateway: text("gateway").notNull(), // "stripe" | "paystack"
	customerId: text("customerId").notNull(),
	subscriptionId: text("subscriptionId").notNull().unique(),
	planId: text("planId").notNull(), // "landing-page" | "sales-funnel" | "ecommerce"
	billingCycle: text("billingCycle").notNull(), // "monthly" | "yearly"
	status: text("status").notNull(), // "active" | "canceled" | "past_due"
	currentPeriodStart: timestamp("currentPeriodStart", { mode: "date" }).notNull(),
	currentPeriodEnd: timestamp("currentPeriodEnd", { mode: "date" }).notNull(),
	createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

/**
 * 8. Idempotency Keys Table (Strict Double-Charge Protection)
 */
export const idempotencyKeys = pgTable("idempotency_keys", {
	key: text("key").primaryKey(), // UUID or client idempotency header
	tenantId: text("tenantId")
		.notNull()
		.references(() => tenants.id, { onDelete: "cascade" }),
	responseBody: text("responseBody"),
	statusCode: integer("statusCode"),
	createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
	expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
});
