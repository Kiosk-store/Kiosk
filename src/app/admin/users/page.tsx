/** @format */

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
	Users,
	Search,
	ShieldCheck,
	CheckCircle2,
	Loader2,
	ArrowLeft,
	Globe,
	UserCheck,
	CreditCard,
	ShoppingBag,
	Sparkles,
} from "lucide-react";

interface UserItem {
	id: string;
	name: string;
	email: string;
	phone?: string;
	role: string;
	createdAt: string;
	tenants: Array<{
		id: string;
		name: string;
		slug: string;
		plan: string;
		billingStatus: string;
	}>;
}

export default function AdminUsersPage() {
	const [usersList, setUsersList] = useState<UserItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

	useEffect(() => {
		async function fetchUsers() {
			try {
				setIsLoading(true);
				const res = await fetch("/api/admin/users");
				if (res.ok) {
					const data = await res.json();
					setUsersList(data.users || []);
				}
			} catch (err) {
				console.error("[FETCH_ADMIN_USERS_ERROR]", err);
			} finally {
				setIsLoading(false);
			}
		}

		fetchUsers();
	}, []);

	const handleRoleChange = async (userId: string, newRole: string) => {
		try {
			setUpdatingUserId(userId);
			const res = await fetch("/api/admin/users", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId, role: newRole }),
			});

			if (res.ok) {
				setUsersList((prev) =>
					prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
				);
			} else {
				alert("Failed to update user role");
			}
		} catch (err) {
			console.error("[UPDATE_USER_ROLE_ERROR]", err);
			alert("Error updating role");
		} finally {
			setUpdatingUserId(null);
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

	const filteredUsers = usersList.filter((u) => {
		if (!searchQuery.trim()) return true;
		const q = searchQuery.toLowerCase().trim();
		return (
			u.name?.toLowerCase().includes(q) ||
			u.email?.toLowerCase().includes(q) ||
			u.tenants?.some((t) => 
				t.slug?.toLowerCase().includes(q) || 
				t.name?.toLowerCase().includes(q) ||
				t.plan?.toLowerCase().includes(q)
			)
		);
	});

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
						<span className="text-xs font-bold text-blue-600">Users & Workspaces</span>
					</div>
					<h1 className="text-2xl font-bold font-nohemi text-gray-900 mt-1">
						Customer Accounts & Tenant Directory
					</h1>
					<p className="text-xs text-gray-500 font-medium">
						Manage platform accounts, grant admin privileges, and inspect workspace subscription plans.
					</p>
				</div>
			</div>

			{/* Search Bar */}
			<div className="p-4 bg-white border border-gray-200/90 rounded-3xl shadow-2xs flex items-center justify-between gap-4">
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

				<span className="text-xs font-bold text-gray-500 hidden sm:inline">
					{filteredUsers.length} Users Registered
				</span>
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
							{filteredUsers.map((u) => {
								const isAdminRole = u.role === "ADMIN" || u.role === "SUPERADMIN";
								const primaryTenant = u.tenants.length > 0 ? u.tenants[0] : null;
								const planName = formatPlanName(primaryTenant?.plan);
								const planStyle = getPlanBadgeStyle(primaryTenant?.plan);

								return (
									<div
										key={u.id}
										className="p-4 rounded-2xl bg-gray-50/70 border border-gray-150 space-y-3">
										<div className="flex items-start justify-between gap-2">
											<div className="flex items-center gap-2.5 min-w-0">
												<div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 font-extrabold flex items-center justify-center text-xs shrink-0">
													{u.name ? u.name.charAt(0).toUpperCase() : "U"}
												</div>
												<div className="min-w-0">
													<p className="font-bold text-xs text-gray-900 truncate">{u.name || "Client"}</p>
													<p className="text-[10px] text-gray-500 truncate">{u.email}</p>
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
												<span className="text-[10px] text-gray-400 font-bold block uppercase">Subscription</span>
												<span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${planStyle}`}>
													{planName}
												</span>
											</div>
											<div>
												<span className="text-[10px] text-gray-400 font-bold block uppercase">Registered</span>
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
													<span className="text-[10px] text-gray-400 italic">No workspace</span>
												)}
											</div>

											<select
												disabled={updatingUserId === u.id}
												value={u.role}
												onChange={(e) => handleRoleChange(u.id, e.target.value)}
												className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-bold text-gray-800 bg-white focus:outline-none focus:border-blue-600 cursor-pointer shrink-0">
												<option value="USER">USER</option>
												<option value="ADMIN">ADMIN</option>
												<option value="SUPERADMIN">SUPERADMIN</option>
											</select>
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
										<th className="pb-3">Customer User</th>
										<th className="pb-3">Subscription Plan</th>
										<th className="pb-3">Workspaces</th>
										<th className="pb-3">Access Role</th>
										<th className="pb-3">Registered On</th>
										<th className="pb-3 text-right">Role Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-50 font-medium">
									{filteredUsers.map((u) => {
										const isAdminRole = u.role === "ADMIN" || u.role === "SUPERADMIN";
										const primaryTenant = u.tenants.length > 0 ? u.tenants[0] : null;
										const planName = formatPlanName(primaryTenant?.plan);
										const planStyle = getPlanBadgeStyle(primaryTenant?.plan);

										return (
											<tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
												{/* User Column */}
												<td className="py-4 pr-4">
													<div className="flex items-center gap-3">
														<div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 font-extrabold flex items-center justify-center text-xs shrink-0">
															{u.name ? u.name.charAt(0).toUpperCase() : "U"}
														</div>
														<div>
															<p className="font-bold text-gray-900">{u.name || "Client"}</p>
															<p className="text-[10px] text-gray-400">{u.email}</p>
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
															<span className="text-[10px] text-gray-400 italic">No workspace</span>
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

												{/* Role Actions */}
												<td className="py-4 text-right">
													<select
														disabled={updatingUserId === u.id}
														value={u.role}
														onChange={(e) => handleRoleChange(u.id, e.target.value)}
														className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-bold text-gray-800 bg-white focus:outline-none focus:border-blue-600 cursor-pointer">
														<option value="USER">USER (Customer)</option>
														<option value="ADMIN">ADMIN (Fulfillment)</option>
														<option value="SUPERADMIN">SUPERADMIN</option>
													</select>
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
		</div>
	);
}
