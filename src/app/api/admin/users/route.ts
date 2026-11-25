/** @format */

import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedAdmin, isAdmin } from "@/lib/auth/admin";
import { db } from "@/db";
import {
	users,
	tenants,
	projects,
	subscriptions,
	invoices,
	verificationTokens,
} from "@/db/schema";
import { desc, eq, inArray, or } from "drizzle-orm";
import { Logger } from "@/lib/logger";
import { verifySameOrigin } from "@/lib/security/antispam";

export const dynamic = "force-dynamic";

const ALLOWED_ROLES = ["USER", "ADMIN", "SUPERADMIN"] as const;

const patchUserRoleSchema = z.object({
	userId: z.string().trim().min(1, "userId is required"),
	role: z.enum(ALLOWED_ROLES),
});

const deleteUsersSchema = z
	.object({
		userId: z.string().trim().min(1).optional(),
		userIds: z.array(z.string().trim().min(1)).max(100).optional(),
	})
	.refine(
		(data) => Boolean(data.userId || (data.userIds && data.userIds.length > 0)),
		"Provide userId or a non-empty userIds array.",
	);

function isPaidPlan(plan?: string | null): boolean {
	if (!plan) return false;
	const normalized = plan.trim().toUpperCase();
	return normalized !== "" && normalized !== "NONE" && normalized !== "FREE";
}

/**
 * GET /api/admin/users - Returns all user accounts, workspaces, project counts, and deletion eligibility
 */
export async function GET() {
	try {
		const adminUser = await getAuthenticatedAdmin();
		if (!adminUser) {
			return NextResponse.json(
				{ error: "Unauthorized. Admin privileges required." },
				{ status: 403 },
			);
		}

		const [allUsers, allTenants, allProjects, allSubscriptions, allInvoices] =
			await Promise.all([
				db.query.users.findMany({
					orderBy: [desc(users.createdAt)],
				}),
				db.query.tenants.findMany(),
				db.select({ id: projects.id, tenantId: projects.tenantId }).from(projects),
				db
					.select({
						tenantId: subscriptions.tenantId,
						status: subscriptions.status,
					})
					.from(subscriptions),
				db
					.select({
						userId: invoices.userId,
						tenantId: invoices.tenantId,
						status: invoices.status,
					})
					.from(invoices),
			]);

		const projectsByTenant = new Map<string, number>();
		for (const p of allProjects) {
			projectsByTenant.set(p.tenantId, (projectsByTenant.get(p.tenantId) ?? 0) + 1);
		}

		const activeSubTenants = new Set<string>();
		for (const s of allSubscriptions) {
			const status = (s.status || "").toLowerCase();
			if (status === "active" || status === "grace_period" || status === "past_due") {
				activeSubTenants.add(s.tenantId);
			}
		}

		const paidUsers = new Set<string>();
		const paidTenants = new Set<string>();
		for (const inv of allInvoices) {
			if ((inv.status || "").toUpperCase() === "PAID") {
				paidUsers.add(inv.userId);
				paidTenants.add(inv.tenantId);
			}
		}

		const adminEmailLower = adminUser.email.toLowerCase().trim();

		const usersWithTenants = allUsers.map((u) => {
			const userTenants = allTenants.filter((t) => t.ownerId === u.id);
			const projectsCount = userTenants.reduce(
				(sum, t) => sum + (projectsByTenant.get(t.id) ?? 0),
				0,
			);
			const isSelf =
				u.id === adminUser.id || u.email.toLowerCase().trim() === adminEmailLower;
			const isAdminAccount = isAdmin(u);
			const hasPaidActivity =
				paidUsers.has(u.id) ||
				userTenants.some(
					(t) =>
						isPaidPlan(t.plan) ||
						activeSubTenants.has(t.id) ||
						paidTenants.has(t.id),
				);

			let protectionReason: string | null = null;
			if (isSelf) {
				protectionReason = "You cannot delete your own account.";
			} else if (isAdminAccount) {
				protectionReason = "Admin accounts must be demoted to USER before deletion.";
			} else if (hasPaidActivity) {
				protectionReason = "Accounts with an active plan or paid invoice history are protected.";
			}

			return {
				id: u.id,
				name: u.name,
				email: u.email,
				image: u.image,
				phone: u.phone,
				role: u.role,
				createdAt: u.createdAt,
				projectsCount,
				hasPaidActivity,
				canDelete: protectionReason === null,
				protectionReason,
				tenants: userTenants.map((t) => ({
					id: t.id,
					name: t.name,
					slug: t.slug,
					plan: t.plan,
					billingStatus: t.billingStatus,
				})),
			};
		});

		return NextResponse.json({
			users: usersWithTenants,
			currentAdminId: adminUser.id,
		});
	} catch (error) {
		Logger.error("Failed to fetch users directory", error);
		return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
	}
}

/**
 * PATCH /api/admin/users - Update user role
 */
export async function PATCH(request: Request) {
	try {
		const originCheck = verifySameOrigin(request);
		if (!originCheck.ok) {
			return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
		}

		const adminUser = await getAuthenticatedAdmin();
		if (!adminUser) {
			return NextResponse.json(
				{ error: "Unauthorized. Admin privileges required." },
				{ status: 403 },
			);
		}

		const body = await request.json().catch(() => null);
		const parsed = patchUserRoleSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Valid userId and role (USER, ADMIN, SUPERADMIN) are required." },
				{ status: 400 },
			);
		}

		const { userId, role } = parsed.data;

		const targetUser = await db.query.users.findFirst({
			where: eq(users.id, userId),
		});

		if (!targetUser) {
			return NextResponse.json({ error: "User not found." }, { status: 404 });
		}

		const isSelf =
			targetUser.id === adminUser.id ||
			targetUser.email.toLowerCase().trim() === adminUser.email.toLowerCase().trim();

		if (isSelf && role === "USER") {
			return NextResponse.json(
				{ error: "You cannot demote your own admin account." },
				{ status: 400 },
			);
		}

		await db
			.update(users)
			.set({ role, updatedAt: new Date() })
			.where(eq(users.id, userId));

		return NextResponse.json({
			success: true,
			message: `User role updated to ${role}`,
		});
	} catch (error) {
		Logger.error("Failed to update user role", error);
		return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
	}
}

/**
 * DELETE /api/admin/users - Delete single or multiple non-admin, non-paying user accounts
 */
export async function DELETE(request: Request) {
	try {
		const originCheck = verifySameOrigin(request);
		if (!originCheck.ok) {
			return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
		}

		const adminUser = await getAuthenticatedAdmin();
		if (!adminUser) {
			return NextResponse.json(
				{ error: "Unauthorized. Admin privileges required." },
				{ status: 403 },
			);
		}

		const body = await request.json().catch(() => null);
		const parsed = deleteUsersSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Provide a valid userId or up to 100 userIds to delete." },
				{ status: 400 },
			);
		}

		const requestedIds = Array.from(
			new Set([
				...(parsed.data.userId ? [parsed.data.userId] : []),
				...(parsed.data.userIds ?? []),
			]),
		);

		if (requestedIds.length === 0 || requestedIds.length > 100) {
			return NextResponse.json(
				{ error: "You can delete between 1 and 100 users per request." },
				{ status: 400 },
			);
		}

		const targetUsers = await db.query.users.findMany({
			where: inArray(users.id, requestedIds),
		});

		if (targetUsers.length === 0) {
			return NextResponse.json(
				{ error: "No matching user accounts were found." },
				{ status: 404 },
			);
		}

		const targetIds = targetUsers.map((u) => u.id);
		const targetTenants = await db
			.select({
				id: tenants.id,
				ownerId: tenants.ownerId,
				plan: tenants.plan,
			})
			.from(tenants)
			.where(inArray(tenants.ownerId, targetIds));

		const targetTenantIds = targetTenants.map((t) => t.id);

		const [targetSubs, targetPaidInvoices] = await Promise.all([
			targetTenantIds.length > 0
				? db
						.select({
							tenantId: subscriptions.tenantId,
							status: subscriptions.status,
						})
						.from(subscriptions)
						.where(inArray(subscriptions.tenantId, targetTenantIds))
				: Promise.resolve([] as Array<{ tenantId: string; status: string }>),
			db
				.select({
					userId: invoices.userId,
					tenantId: invoices.tenantId,
					status: invoices.status,
				})
				.from(invoices)
				.where(
					targetTenantIds.length > 0
						? or(
								inArray(invoices.userId, targetIds),
								inArray(invoices.tenantId, targetTenantIds),
							)
						: inArray(invoices.userId, targetIds),
				),
		]);

		const activeSubTenants = new Set<string>();
		for (const s of targetSubs) {
			const status = (s.status || "").toLowerCase();
			if (status === "active" || status === "grace_period" || status === "past_due") {
				activeSubTenants.add(s.tenantId);
			}
		}

		const paidUserIds = new Set<string>();
		const paidTenantIds = new Set<string>();
		for (const inv of targetPaidInvoices) {
			if ((inv.status || "").toUpperCase() === "PAID") {
				paidUserIds.add(inv.userId);
				paidTenantIds.add(inv.tenantId);
			}
		}

		const adminEmailLower = adminUser.email.toLowerCase().trim();
		const deletableUsers: typeof targetUsers = [];
		const skipped: Array<{ id: string; email: string; reason: string }> = [];

		for (const u of targetUsers) {
			const userTenants = targetTenants.filter((t) => t.ownerId === u.id);
			const isSelf =
				u.id === adminUser.id || u.email.toLowerCase().trim() === adminEmailLower;
			const isAdminAccount = isAdmin(u);
			const hasPaidActivity =
				paidUserIds.has(u.id) ||
				userTenants.some(
					(t) =>
						isPaidPlan(t.plan) ||
						activeSubTenants.has(t.id) ||
						paidTenantIds.has(t.id),
				);

			if (isSelf) {
				skipped.push({
					id: u.id,
					email: u.email,
					reason: "You cannot delete your own account.",
				});
			} else if (isAdminAccount) {
				skipped.push({
					id: u.id,
					email: u.email,
					reason: "Admin accounts must be demoted to USER before deletion.",
				});
			} else if (hasPaidActivity) {
				skipped.push({
					id: u.id,
					email: u.email,
					reason: "Cannot delete user with an active plan or paid invoice history.",
				});
			} else {
				deletableUsers.push(u);
			}
		}

		if (deletableUsers.length === 0) {
			return NextResponse.json(
				{
					error: skipped[0]?.reason || "Selected user(s) are protected and cannot be deleted.",
					skipped,
				},
				{ status: 409 },
			);
		}

		const deletableIds = deletableUsers.map((u) => u.id);
		const deletableEmails = deletableUsers.map((u) => u.email.toLowerCase().trim());

		// Single atomic DELETE statement (PostgreSQL cascades to sessions, accounts, tenants, projects, etc.)
		const deletedRows = await db
			.delete(users)
			.where(inArray(users.id, deletableIds))
			.returning({ id: users.id, email: users.email });

		// Clean up orphaned password reset / verification tokens for deleted email addresses
		if (deletableEmails.length > 0) {
			try {
				await db
					.delete(verificationTokens)
					.where(inArray(verificationTokens.identifier, deletableEmails));
			} catch {
				// Non-blocking cleanup
			}
		}

		const deletedIds = deletedRows.map((r) => r.id);

		Logger.info("Admin deleted user account(s)", {
			route: "/api/admin/users",
			adminId: adminUser.id,
			deletedCount: deletedIds.length,
			skippedCount: skipped.length,
		});

		return NextResponse.json({
			success: true,
			deletedIds,
			deletedCount: deletedIds.length,
			skipped,
			message:
				deletedIds.length === 1
					? "User account permanently deleted."
					: `${deletedIds.length} user accounts permanently deleted.`,
		});
	} catch (error) {
		Logger.error("Failed to delete user account(s)", error);
		return NextResponse.json(
			{ error: "Failed to delete user account(s)." },
			{ status: 500 },
		);
	}
}
