/** @format */

"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
	Users,
	Search,
	Loader2,
	ArrowLeft,
	Trash2,
	AlertTriangle,
	CheckCircle2,
	X,
	ShieldAlert,
} from "lucide-react";

interface UserItem {
	id: string;
	name: string | null;
	email: string;
	image?: string | null;
	phone?: string | null;
	role: string;
	createdAt: string;
	projectsCount?: number;
	hasPaidActivity?: boolean;
	canDelete?: boolean;
	protectionReason?: string | null;
	tenants: Array<{
		id: string;
		name: string;
		slug: string;
		plan: string;
		billingStatus: string;
	}>;
}

type FilterMode = "all" | "free" | "paid" | "admins";

function UserAvatar({
	name,
	image,
}: {
	name?: string | null;
	image?: string | null;
}) {
	const [imgError, setImgError] = useState(false);
	const initial = name?.trim() ? name.trim().charAt(0).toUpperCase() : "U";

	return (
		<div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 font-extrabold flex items-center justify-center text-xs shrink-0 overflow-hidden">
			{image && !imgError ? (
				<img
					src={image}
					alt={name || "User"}
					onError={() => setImgError(true)}
					className="w-full h-full object-cover"
				/>
			) : (
				initial
			)}
		</div>
	);
}

export default function AdminUsersPage() {
	const [usersList, setUsersList] = useState<UserItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterMode, setFilterMode] = useState<FilterMode>("all");
	const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [confirmTargets, setConfirmTargets] = useState<UserItem[] | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [feedback, setFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	const fetchUsers = useCallback(async (showSpinner = false) => {
		try {
			if (showSpinner) {
				setIsLoading(true);
			}
			const res = await fetch("/api/admin/users", { cache: "no-store" });
			if (res.ok) {
				const data = (await res.json()) as { users?: UserItem[] };
				setUsersList(data.users || []);
			} else {
				const data = (await res.json().catch(() => ({}))) as { error?: string };
				setFeedback({
					type: "error",
					message: data.error || "Failed to load user accounts.",
				});
			}
		} catch (err) {
			console.error("[FETCH_ADMIN_USERS_ERROR]", err);
			setFeedback({
				type: "error",
				message: "Network error while loading user accounts.",
			});
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void fetchUsers(false);
	}, [fetchUsers]);

	const handleRoleChange = async (userId: string, newRole: string) => {
		try {
			setUpdatingUserId(userId);
			setFeedback(null);
			const res = await fetch("/api/admin/users", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId, role: newRole }),
			});

			const data = (await res.json().catch(() => ({}))) as {
				error?: string;
				message?: string;
			};

			if (res.ok) {
				setSelectedIds((prev) => prev.filter((id) => id !== userId));
				setFeedback({
					type: "success",
					message: data.message || `User role updated to ${newRole}.`,
				});
				await fetchUsers(false);
			} else {
				setFeedback({
					type: "error",
					message: data.error || "Failed to update user role.",
				});
			}
		} catch (err) {
			console.error("[UPDATE_USER_ROLE_ERROR]", err);
			setFeedback({
				type: "error",
				message: "Network error while updating user role.",
			});
		} finally {
			setUpdatingUserId(null);
		}
	};

	const handleConfirmDelete = async () => {
		if (!confirmTargets || confirmTargets.length === 0 || isDeleting) return;

		const targetIds = confirmTargets.map((u) => u.id);
		try {
			setIsDeleting(true);
			setFeedback(null);

			const res = await fetch("/api/admin/users", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(
					targetIds.length === 1
						? { userId: targetIds[0] }
						: { userIds: targetIds },
				),
			});

			const data = (await res.json().catch(() => ({}))) as {
				error?: string;
				message?: string;
				deletedIds?: string[];
				skipped?: Array<{ id: string; email: string; reason: string }>;
			};

			if (!res.ok) {
				setFeedback({
					type: "error",
					message: data.error || "Failed to delete user account(s).",
				});
				setConfirmTargets(null);
				return;
			}

			const deletedSet = new Set(data.deletedIds || []);
			setUsersList((prev) => prev.filter((u) => !deletedSet.has(u.id)));
			setSelectedIds((prev) => prev.filter((id) => !deletedSet.has(id)));

			const skippedCount = data.skipped?.length ?? 0;
			const baseMessage =
				data.message ||
				(deletedSet.size === 1
					? "User account deleted."
					: `${deletedSet.size} user accounts deleted.`);

			setFeedback({
				type: "success",
				message:
					skippedCount > 0
						? `${baseMessage} (${skippedCount} protected account${skippedCount === 1 ? "" : "s"} skipped.)`
						: baseMessage,
			});
			setConfirmTargets(null);
		} catch (err) {
			console.error("[DELETE_ADMIN_USERS_ERROR]", err);
			setFeedback({
				type: "error",
				message: "Network error while deleting user account(s).",
			});
			setConfirmTargets(null);
		} finally {
			setIsDeleting(false);
		}
	};

	const formatPlanName = (rawPlan?: string) => {
		if (!rawPlan) return "No Plan";
		const p = rawPlan.toUpperCase();
		if (p.includes("COMMERCE") || p.includes("STORE")) return "E-Commerce Store";
		if (p.includes("FUNNEL")) return "Sales Funnel";
		if (p.includes("LANDING")) return "Landing Page";
		return "Free / None";
	};

	const getPlanBadgeStyle = (rawPlan?: string) => {
		if (!rawPlan) return "bg-gray-100 text-gray-600 border-gray-200";
		const p = rawPlan.toUpperCase();
		if (p.includes("COMMERCE") || p.includes("STORE")) {
			return "bg-purple-100 text-purple-800 border-purple-200";
		}
		if (p.includes("FUNNEL")) {
			return "bg-indigo-100 text-indigo-800 border-indigo-200";
		}
		if (p.includes("LANDING")) {
			return "bg-blue-100 text-blue-800 border-blue-200";
		}
		return "bg-gray-100 text-gray-600 border-gray-200";
	};

	const filteredUsers = useMemo(() => {
		return usersList.filter((u) => {
			const isAdminRole = u.role === "ADMIN" || u.role === "SUPERADMIN";
			const isPaid = Boolean(u.hasPaidActivity);

			if (filterMode === "admins" && !isAdminRole) return false;
			if (filterMode === "paid" && !isPaid) return false;
			if (filterMode === "free" && (isPaid || isAdminRole)) return false;

			if (!searchQuery.trim()) return true;
			const q = searchQuery.toLowerCase().trim();
			return (
				u.name?.toLowerCase().includes(q) ||
				u.email?.toLowerCase().includes(q) ||
				u.tenants?.some(
					(t) =>
						t.slug?.toLowerCase().includes(q) ||
						t.name?.toLowerCase().includes(q) ||
						t.plan?.toLowerCase().includes(q),
				)
			);
		});
	}, [usersList, filterMode, searchQuery]);

	const deletableVisibleUsers = useMemo(
		() => filteredUsers.filter((u) => u.canDelete),
		[filteredUsers],
	);

	const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

	const selectedVisibleDeletableCount = useMemo(
		() => deletableVisibleUsers.filter((u) => selectedSet.has(u.id)).length,
		[deletableVisibleUsers, selectedSet],
	);

	const allDeletableVisibleSelected =
		deletableVisibleUsers.length > 0 &&
		(selectedVisibleDeletableCount === deletableVisibleUsers.length ||
			selectedVisibleDeletableCount >= 100);

	const selectedUsers = useMemo(
		() => usersList.filter((u) => selectedSet.has(u.id) && u.canDelete),
		[usersList, selectedSet],
	);

	const toggleSelectOne = (userId: string) => {
		setSelectedIds((prev) => {
			if (prev.includes(userId)) {
				return prev.filter((id) => id !== userId);
			}
			if (prev.length >= 100) {
				setFeedback({
					type: "error",
					message: "You can select up to 100 accounts per bulk delete.",
				});
				return prev;
			}
			return [...prev, userId];
		});
	};

	const toggleSelectAllVisible = () => {
		if (allDeletableVisibleSelected) {
			const visibleIds = new Set(deletableVisibleUsers.map((u) => u.id));
			setSelectedIds((prev) => prev.filter((id) => !visibleIds.has(id)));
		} else {
			const merged = new Set(selectedIds);
			for (const u of deletableVisibleUsers) {
				if (merged.size >= 100) break;
				merged.add(u.id);
			}
			setSelectedIds(Array.from(merged));
		}
	};

	return (
		<div className="space-y-6 animate-in fade-in duration-200">
			{/* Header Navigation */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<div className="flex items-center gap-2">
						<Link
							href="/admin"
							className="text-xs font-bold text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
							<ArrowLeft className="w-3.5 h-3.5" />
							<span>Admin Dashboard</span>
						</Link>
						<span className="text-gray-300">/</span>
						<span className="text-xs font-bold text-blue-600">
							Users & Workspaces
						</span>
					</div>
					<h1 className="text-2xl font-bold font-nohemi text-gray-900 mt-1">
						Customer Accounts & Tenant Directory
					</h1>
					<p className="text-xs text-gray-500 font-medium">
						Manage platform accounts, grant admin privileges, inspect plans, and remove spam or inactive accounts.
					</p>
				</div>
			</div>

			{/* Feedback Banner */}
			{feedback && (
				<div
					className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 ${
						feedback.type === "success"
							? "bg-emerald-50 border-emerald-200 text-emerald-800"
							: "bg-rose-50 border-rose-200 text-rose-800"
					}`}>
					<div className="flex items-center gap-2">
						{feedback.type === "success" ? (
							<CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
						) : (
							<ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
						)}
						<span>{feedback.message}</span>
					</div>
					<button
						type="button"
						onClick={() => setFeedback(null)}
						className="p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
						aria-label="Dismiss notification">
						<X className="w-3.5 h-3.5" />
					</button>
				</div>
			)}

			{/* Search & Filter Bar */}
			<div className="p-4 bg-white border border-gray-200/90 rounded-3xl shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
				<div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
					<div className="relative w-full sm:w-80">
						<Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
						<input
							type="text"
							placeholder="Search by customer name, email, plan, or slug..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 bg-gray-50/50"
						/>
					</div>

					{/* Quick Filter Pills */}
					<div className="flex flex-wrap items-center gap-1.5">
						{(
							[
								{ key: "all", label: "All" },
								{ key: "free", label: "Free / No Plan" },
								{ key: "paid", label: "Paid" },
								{ key: "admins", label: "Admins" },
							] as const
						).map((tab) => (
							<button
								key={tab.key}
								type="button"
								onClick={() => setFilterMode(tab.key)}
								className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
									filterMode === tab.key
										? "bg-blue-600 text-white shadow-2xs"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}>
								{tab.label}
							</button>
						))}
					</div>
				</div>

				<div className="flex items-center justify-between lg:justify-end gap-3">
					<span className="text-xs font-bold text-gray-500">
						{filteredUsers.length} {filteredUsers.length === 1 ? "User" : "Users"}
					</span>

					{selectedUsers.length > 0 && (
						<div className="flex items-center gap-2 pl-3 border-l border-gray-200">
							<button
								type="button"
								onClick={() => setSelectedIds([])}
								className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer">
								Clear ({selectedUsers.length})
							</button>
							<button
								type="button"
								onClick={() => setConfirmTargets(selectedUsers)}
								className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer">
								<Trash2 className="w-3.5 h-3.5" />
								<span>Delete Selected ({selectedUsers.length})</span>
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Users Table */}
			<div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-2xs">
				{isLoading ? (
					<div className="p-16 flex flex-col items-center justify-center gap-3">
						<Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
						<p className="text-xs font-bold text-gray-500">Loading...</p>
					</div>
				) : filteredUsers.length === 0 ? (
					<div className="p-16 text-center space-y-2">
						<Users className="w-10 h-10 text-gray-400 mx-auto" />
						<h4 className="text-sm font-bold text-gray-900">No users found</h4>
					</div>
				) : (
					<>
						{/* MOBILE CARD VIEW: Visible only on mobile/phone screens */}
						<div className="block md:hidden space-y-3">
							{deletableVisibleUsers.length > 0 && (
								<div className="flex items-center justify-between px-1 pb-1">
									<label className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer">
										<input
											type="checkbox"
											checked={allDeletableVisibleSelected}
											onChange={toggleSelectAllVisible}
											className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
										/>
										<span>
											Select all deletable ({deletableVisibleUsers.length})
										</span>
									</label>
								</div>
							)}

							{filteredUsers.map((u) => {
								const isAdminRole = u.role === "ADMIN" || u.role === "SUPERADMIN";
								const primaryTenant = u.tenants.length > 0 ? u.tenants[0] : null;
								const planName = formatPlanName(primaryTenant?.plan);
								const planStyle = getPlanBadgeStyle(primaryTenant?.plan);
								const canDelete = Boolean(u.canDelete);
								const isSelected = selectedSet.has(u.id);

								return (
									<div
										key={u.id}
										className={`p-4 rounded-2xl border space-y-3 transition-colors ${
											isSelected
												? "bg-rose-50/40 border-rose-200"
												: "bg-gray-50/70 border-gray-150"
										}`}>
										<div className="flex items-start justify-between gap-2">
											<div className="flex items-center gap-2.5 min-w-0">
												{canDelete && (
													<input
														type="checkbox"
														checked={isSelected}
														onChange={() => toggleSelectOne(u.id)}
														aria-label={`Select ${u.email}`}
														className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer shrink-0"
													/>
												)}
												<UserAvatar name={u.name} image={u.image} />
												<div className="min-w-0">
													<p className="font-bold text-xs text-gray-900 truncate">
														{u.name || "Client"}
													</p>
													<p className="text-[10px] text-gray-500 truncate">
														{u.email}
													</p>
												</div>
											</div>

											<span
												className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
													isAdminRole
														? "bg-blue-100 text-blue-800 border border-blue-200"
														: "bg-gray-100 text-gray-700"
												}`}>
												{u.role}
											</span>
										</div>

										<div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-gray-200/60">
											<div>
												<span className="text-[10px] text-gray-400 font-bold block uppercase">
													Subscription
												</span>
												<span
													className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${planStyle}`}>
													{planName}
												</span>
											</div>
											<div>
												<span className="text-[10px] text-gray-400 font-bold block uppercase">
													Registered
												</span>
												<span className="text-gray-700 text-[11px] font-medium block mt-0.5">
													{new Date(u.createdAt).toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric",
													})}
												</span>
											</div>
										</div>

										<div className="pt-2 border-t border-gray-200/60 flex items-center justify-between gap-2">
											<div className="flex-1 min-w-0">
												{u.tenants.length > 0 ? (
													<span className="text-[10px] font-mono text-gray-600 truncate block">
														{u.tenants[0].slug}.kioosk.online
													</span>
												) : (
													<span className="text-[10px] text-gray-400 italic">
														No workspace
													</span>
												)}
											</div>

											<div className="flex items-center gap-2 shrink-0">
												<select
													disabled={updatingUserId === u.id}
													value={u.role}
													onChange={(e) => handleRoleChange(u.id, e.target.value)}
													className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-bold text-gray-800 bg-white focus:outline-none focus:border-blue-600 cursor-pointer">
													<option value="USER">USER</option>
													<option value="ADMIN">ADMIN</option>
													<option value="SUPERADMIN">SUPERADMIN</option>
												</select>

												<button
													type="button"
													disabled={!canDelete || isDeleting}
													onClick={() => setConfirmTargets([u])}
													title={u.protectionReason || "Delete user account"}
													aria-label={`Delete ${u.email}`}
													className={`p-1.5 rounded-lg border transition-colors ${
														canDelete
															? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
															: "border-gray-200 bg-gray-100 text-gray-300 cursor-not-allowed"
													}`}>
													<Trash2 className="w-3.5 h-3.5" />
												</button>
											</div>
										</div>
									</div>
								);
							})}
						</div>

						{/* DESKTOP TABLE VIEW: Visible on medium+ screens */}
						<div className="hidden md:block overflow-x-auto">
							<table className="w-full text-left text-xs">
								<thead>
									<tr className="border-b border-gray-100 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
										<th className="pb-3 pr-3 w-8">
											{deletableVisibleUsers.length > 0 && (
												<input
													type="checkbox"
													checked={allDeletableVisibleSelected}
													onChange={toggleSelectAllVisible}
													title="Select all deletable users (up to 100)"
													aria-label="Select all deletable users"
													className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
												/>
											)}
										</th>
										<th className="pb-3">Customer User</th>
										<th className="pb-3">Subscription Plan</th>
										<th className="pb-3">Workspaces</th>
										<th className="pb-3">Access Role</th>
										<th className="pb-3">Registered On</th>
										<th className="pb-3 text-right">Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-50 font-medium">
									{filteredUsers.map((u) => {
										const isAdminRole = u.role === "ADMIN" || u.role === "SUPERADMIN";
										const primaryTenant = u.tenants.length > 0 ? u.tenants[0] : null;
										const planName = formatPlanName(primaryTenant?.plan);
										const planStyle = getPlanBadgeStyle(primaryTenant?.plan);
										const canDelete = Boolean(u.canDelete);
										const isSelected = selectedSet.has(u.id);

										return (
											<tr
												key={u.id}
												className={`transition-colors ${
													isSelected
														? "bg-rose-50/40 hover:bg-rose-50/70"
														: "hover:bg-gray-50/80"
												}`}>
												{/* Selection Checkbox */}
												<td className="py-4 pr-3">
													<input
														type="checkbox"
														disabled={!canDelete}
														checked={isSelected}
														onChange={() => toggleSelectOne(u.id)}
														title={
															canDelete
																? `Select ${u.email}`
																: u.protectionReason || "Protected account"
														}
														aria-label={`Select ${u.email}`}
														className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
													/>
												</td>

												{/* User Column */}
												<td className="py-4 pr-4">
													<div className="flex items-center gap-3">
														<UserAvatar name={u.name} image={u.image} />
														<div>
															<p className="font-bold text-gray-900">
																{u.name || "Client"}
															</p>
															<p className="text-[10px] text-gray-400">
																{u.email}
															</p>
														</div>
													</div>
												</td>

												{/* Subscription Plan Column */}
												<td className="py-4 pr-4">
													<div className="flex flex-col items-start gap-1">
														<span
															className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${planStyle}`}>
															{planName}
														</span>
														{primaryTenant?.billingStatus && (
															<span className="text-[9px] text-gray-400 font-semibold uppercase">
																Status: {primaryTenant.billingStatus}
															</span>
														)}
													</div>
												</td>

												{/* Workspaces Column */}
												<td className="py-4 pr-4">
													<div className="flex flex-col items-start gap-1">
														<div className="flex flex-wrap gap-1.5">
															{u.tenants.length > 0 ? (
																u.tenants.map((t) => (
																	<span
																		key={t.id}
																		className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-800 text-[10px] font-bold border border-gray-200">
																		{t.slug}.kioosk.online
																	</span>
																))
															) : (
																<span className="text-[10px] text-gray-400 italic">
																	No workspace
																</span>
															)}
														</div>
														{typeof u.projectsCount === "number" && (
															<span className="text-[9px] text-gray-400 font-semibold">
																{u.projectsCount}{" "}
																{u.projectsCount === 1 ? "project" : "projects"}
															</span>
														)}
													</div>
												</td>

												{/* Access Role */}
												<td className="py-4 pr-4">
													<span
														className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
															isAdminRole
																? "bg-blue-100 text-blue-800 border border-blue-200"
																: "bg-gray-100 text-gray-700"
														}`}>
														{u.role}
													</span>
												</td>

												{/* Registered On */}
												<td className="py-4 pr-4 text-gray-500 text-[11px]">
													{new Date(u.createdAt).toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric",
													})}
												</td>

												{/* Actions (Role Selector + Delete Button) */}
												<td className="py-4 text-right">
													<div className="inline-flex items-center justify-end gap-2">
														<select
															disabled={updatingUserId === u.id}
															value={u.role}
															onChange={(e) =>
																handleRoleChange(u.id, e.target.value)
															}
															className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-bold text-gray-800 bg-white focus:outline-none focus:border-blue-600 cursor-pointer">
															<option value="USER">USER (Customer)</option>
															<option value="ADMIN">ADMIN (Fulfillment)</option>
															<option value="SUPERADMIN">SUPERADMIN</option>
														</select>

														<button
															type="button"
															disabled={!canDelete || isDeleting}
															onClick={() => setConfirmTargets([u])}
															title={u.protectionReason || "Delete user account"}
															aria-label={`Delete ${u.email}`}
															className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition-colors ${
																canDelete
																	? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"
																	: "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
															}`}>
															<Trash2 className="w-3.5 h-3.5" />
															<span>Delete</span>
														</button>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</>
				)}
			</div>

			{/* Delete Confirmation Modal */}
			{confirmTargets && confirmTargets.length > 0 && (
				<div
					onClick={() => {
						if (!isDeleting) setConfirmTargets(null);
					}}
					className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
					<div
						onClick={(e) => e.stopPropagation()}
						className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
						<div className="flex items-start justify-between gap-3">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
									<AlertTriangle className="w-5 h-5" />
								</div>
								<div>
									<h3 className="text-base font-bold font-nohemi text-gray-900">
										{confirmTargets.length === 1
											? "Delete User Account?"
											: `Delete ${confirmTargets.length} User Accounts?`}
									</h3>
									<p className="text-xs text-gray-500">
										This action cannot be undone.
									</p>
								</div>
							</div>
							<button
								type="button"
								disabled={isDeleting}
								onClick={() => setConfirmTargets(null)}
								className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
								aria-label="Close modal">
								<X className="w-4 h-4" />
							</button>
						</div>

						<p className="text-xs text-gray-600 leading-relaxed">
							Permanently deleting{" "}
							{confirmTargets.length === 1
								? "this account"
								: `these ${confirmTargets.length} accounts`}{" "}
							will also remove all associated sessions, workspaces, draft projects, and analytics records.
						</p>

						<div className="max-h-40 overflow-y-auto rounded-2xl bg-gray-50 border border-gray-200 divide-y divide-gray-200/70">
							{confirmTargets.slice(0, 10).map((target) => (
								<div
									key={target.id}
									className="px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs">
									<div className="min-w-0">
										<p className="font-bold text-gray-900 truncate">
											{target.name || "Client"}
										</p>
										<p className="text-[11px] text-gray-500 truncate">
											{target.email}
										</p>
									</div>
									{target.tenants[0]?.slug && (
										<span className="text-[10px] font-mono text-gray-500 shrink-0">
											{target.tenants[0].slug}
										</span>
									)}
								</div>
							))}
							{confirmTargets.length > 10 && (
								<div className="px-3.5 py-2 text-[11px] font-semibold text-gray-500 text-center">
									+ {confirmTargets.length - 10} more accounts
								</div>
							)}
						</div>

						<div className="flex items-center justify-end gap-2.5 pt-2">
							<button
								type="button"
								disabled={isDeleting}
								onClick={() => setConfirmTargets(null)}
								className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50">
								Cancel
							</button>
							<button
								type="button"
								disabled={isDeleting}
								onClick={handleConfirmDelete}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer disabled:opacity-70">
								{isDeleting ? (
									<>
										<Loader2 className="w-3.5 h-3.5 animate-spin" />
										<span>Deleting...</span>
									</>
								) : (
									<>
										<Trash2 className="w-3.5 h-3.5" />
										<span>
											{confirmTargets.length === 1
												? "Delete Account"
												: `Delete ${confirmTargets.length} Accounts`}
										</span>
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
