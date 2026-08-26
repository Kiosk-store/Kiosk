/** @format */

"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
	Layers,
	Clock,
	CheckCircle2,
	Users,
	Receipt,
	ArrowRight,
	Loader2,
	Search,
	Globe,
	TrendingUp,
	Database,
	Server,
	RefreshCw,
} from "lucide-react";

interface AdminStats {
	totalProjects: number;
	inReviewCount: number;
	inProgressCount: number;
	liveCount: number;
	draftCount: number;
	totalUsers: number;
	totalTenants: number;
	totalRevenue: number;
	paidInvoicesCount: number;
	pendingInvoicesCount: number;
}

interface ProjectSummary {
	id: string;
	name: string;
	type: string;
	status: string;
	progress: number;
	publishedUrl?: string;
	businessName?: string;
	tagline?: string;
	logoUrl?: string;
	imagesCount: number;
	tenant?: {
		name: string;
		slug: string;
		plan: string;
	};
	owner?: {
		name: string;
		email: string;
		phone: string;
	};
	createdAt: string;
	updatedAt: string;
}

export default function AdminBentoDashboardPage() {
	const [stats, setStats] = useState<AdminStats | null>(null);
	const [projects, setProjects] = useState<ProjectSummary[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [searchFilter, setSearchFilter] = useState("");

	const fetchDashboardData = async () => {
		try {
			setIsRefreshing(true);
			const [statsRes, projectsRes] = await Promise.all([
				fetch("/api/admin/stats"),
				fetch("/api/admin/projects"),
			]);

			if (statsRes.ok) {
				const statsData = await statsRes.json();
				setStats(statsData.stats);
			}

			if (projectsRes.ok) {
				const projData = await projectsRes.json();
				setProjects(projData.projects || []);
			}
		} catch (error) {
			console.error("[FETCH_ADMIN_DATA_ERROR]", error);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	};

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const filteredProjects = useMemo(() => {
		if (!searchFilter.trim()) return projects.slice(0, 10);
		const q = searchFilter.toLowerCase().trim();
		return projects.filter(
			(p) =>
				p.name?.toLowerCase().includes(q) ||
				p.businessName?.toLowerCase().includes(q) ||
				p.owner?.email?.toLowerCase().includes(q) ||
				p.tenant?.slug?.toLowerCase().includes(q),
		);
	}, [projects, searchFilter]);

	if (isLoading) {
		return (
			<div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
				<Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
				<p className="text-xs font-bold text-gray-500">Connecting to database...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-in fade-in duration-200">
			{/* Top Bar */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-gray-200 rounded-3xl shadow-2xs">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-extrabold text-white">
						K
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h1 className="font-extrabold font-nohemi text-lg tracking-tight text-gray-900">
								Admin Dashboard
							</h1>
							<span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
								LIVE
							</span>
						</div>
						<p className="text-xs text-gray-500 font-medium">
							Multi-tenant operations and submissions management
						</p>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					{/* Database Indicator */}
					<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
						<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
						<Database className="w-3.5 h-3.5" />
						<span>PostgreSQL Connected</span>
					</div>

					<button
						type="button"
						onClick={fetchDashboardData}
						disabled={isRefreshing}
						className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
						title="Refresh Real-time Data">
						<RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
					</button>

					<Link
						href="/dashboard"
						className="px-4 py-2 rounded-full bg-gray-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors">
						<span>Customer View</span>
						<ArrowRight className="w-3.5 h-3.5 inline ml-1.5" />
					</Link>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* BENTO GRID */}
			{/* ========================================================================= */}
			<div className="grid grid-cols-1 md:grid-cols-12 gap-5">
				
				{/* 1. Submissions In Review */}
				<div className="md:col-span-4 p-6 rounded-3xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
							In Review Queue
						</span>
						<div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
							<Clock className="w-4 h-4" />
						</div>
					</div>

					<div>
						<div className="flex items-baseline gap-2">
							<h3 className="text-3xl font-extrabold font-nohemi text-amber-700">
								{stats?.inReviewCount || 0}
							</h3>
							<span className="text-xs font-bold text-gray-400">pending action</span>
						</div>
						<p className="text-xs text-gray-500 font-medium mt-1">
							Client submissions awaiting review and launch
						</p>
					</div>

					<Link
						href="/admin/projects"
						className="inline-flex items-center justify-between p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors">
						<span>View Queue ({stats?.inReviewCount || 0})</span>
						<ArrowRight className="w-4 h-4" />
					</Link>
				</div>

				{/* 2. Total Revenue */}
				<div className="md:col-span-4 p-6 rounded-3xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
							Revenue Collected
						</span>
						<div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
							<TrendingUp className="w-4 h-4" />
						</div>
					</div>

					<div>
						<div className="flex items-baseline gap-2">
							<h3 className="text-3xl font-extrabold font-nohemi text-purple-700">
								${(stats?.totalRevenue || 0).toLocaleString()}
							</h3>
							<span className="text-xs font-bold text-gray-400">USD</span>
						</div>
						<p className="text-xs text-gray-500 font-medium mt-1">
							{stats?.paidInvoicesCount || 0} paid • {stats?.pendingInvoicesCount || 0} pending
						</p>
					</div>

					<Link
						href="/admin/billing"
						className="inline-flex items-center justify-between p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-colors">
						<span>Open Billing Ledger</span>
						<ArrowRight className="w-4 h-4" />
					</Link>
				</div>

				{/* 3. Live Websites */}
				<div className="md:col-span-4 p-6 rounded-3xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
							Live Websites
						</span>
						<div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
							<CheckCircle2 className="w-4 h-4" />
						</div>
					</div>

					<div>
						<div className="flex items-baseline gap-2">
							<h3 className="text-3xl font-extrabold font-nohemi text-emerald-700">
								{stats?.liveCount || 0}
							</h3>
							<span className="text-xs font-bold text-gray-400">sites active</span>
						</div>
						<p className="text-xs text-gray-500 font-medium mt-1">
							Published and serving traffic on .kioosk.online
						</p>
					</div>

					<Link
						href="/admin/projects"
						className="inline-flex items-center justify-between p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-colors">
						<span>Inspect Live Sites</span>
						<ArrowRight className="w-4 h-4" />
					</Link>
				</div>

				{/* 4. Registered Users & Workspaces */}
				<div className="md:col-span-6 p-6 rounded-3xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
							Registered Customers & Workspaces
						</span>
						<div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
							<Users className="w-4 h-4" />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<h4 className="text-2xl font-extrabold font-nohemi text-gray-900">
								{stats?.totalUsers || 0}
							</h4>
							<p className="text-xs text-gray-500 font-medium">Customer Accounts</p>
						</div>
						<div>
							<h4 className="text-2xl font-extrabold font-nohemi text-gray-900">
								{stats?.totalTenants || 0}
							</h4>
							<p className="text-xs text-gray-500 font-medium">Tenant Workspaces</p>
						</div>
					</div>

					<Link
						href="/admin/users"
						className="inline-flex items-center justify-between p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold transition-colors">
						<span>Manage Users & Roles</span>
						<ArrowRight className="w-4 h-4" />
					</Link>
				</div>

				{/* 5. Infrastructure Status */}
				<div className="md:col-span-6 p-6 rounded-3xl bg-white border border-gray-200 shadow-2xs space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
							System Infrastructure
						</span>
						<div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
							<Server className="w-4 h-4" />
						</div>
					</div>

					<div className="space-y-2.5 text-xs">
						<div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
							<span className="text-gray-700 font-medium">PostgreSQL Database (Neon)</span>
							<span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
								Connected
							</span>
						</div>
						<div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
							<span className="text-gray-700 font-medium">Media Storage (Cloudinary)</span>
							<span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
								Active
							</span>
						</div>
						<div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
							<span className="text-gray-700 font-medium">Transactional Email (Resend)</span>
							<span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
								Active
							</span>
						</div>
					</div>
				</div>

				{/* 6. Real-time Submissions Stream Table (12 COLS) */}
				<div className="md:col-span-12 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
						<div>
							<h3 className="text-lg font-bold font-nohemi text-gray-900">
								Customer Submissions
							</h3>
							<p className="text-xs text-gray-500 font-medium mt-0.5">
								Live database query of client intake forms
							</p>
						</div>

						{/* Search Bar */}
						<div className="flex items-center gap-3">
							<div className="relative w-full sm:w-64">
								<Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
								<input
									type="text"
									placeholder="Search submissions..."
									value={searchFilter}
									onChange={(e) => setSearchFilter(e.target.value)}
									className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 bg-gray-50"
								/>
							</div>

							<Link
								href="/admin/projects"
								className="px-4 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors whitespace-nowrap">
								Full Queue
							</Link>
						</div>
					</div>

					{filteredProjects.length === 0 ? (
						<div className="p-12 text-center space-y-2">
							<CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
							<h4 className="text-sm font-bold text-gray-900">No submissions found</h4>
							<p className="text-xs text-gray-500">
								Customer intake forms will appear here in real-time.
							</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-left text-xs">
								<thead>
									<tr className="border-b border-gray-100 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
										<th className="pb-3">Business & Assets</th>
										<th className="pb-3">Plan</th>
										<th className="pb-3">Customer Account</th>
										<th className="pb-3">Status</th>
										<th className="pb-3">Progress</th>
										<th className="pb-3 text-right">Action</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-50 font-medium">
									{filteredProjects.map((p) => {
										const isReview = p.status === "In Review";
										const isLive = p.status === "Live" || p.status === "Published";

										return (
											<tr key={p.id} className="hover:bg-gray-50 transition-colors">
												<td className="py-4 pr-4">
													<div className="flex items-center gap-3">
														{p.logoUrl ? (
															<img
																src={p.logoUrl}
																alt={p.name}
																className="w-10 h-10 rounded-xl object-contain border border-gray-200 bg-white p-1 shrink-0 shadow-2xs"
															/>
														) : (
															<div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center shrink-0">
																{p.name.charAt(0).toUpperCase()}
															</div>
														)}
														<div>
															<p className="font-bold text-gray-900">
																{p.businessName || p.name}
															</p>
															<p className="text-[10px] text-gray-400">
																{p.tenant?.slug ? `${p.tenant.slug}.kioosk.online` : "Workspace"}
															</p>
														</div>
													</div>
												</td>

												<td className="py-4 pr-4">
													<span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800">
														{p.type}
													</span>
												</td>

												<td className="py-4 pr-4">
													<div>
														<p className="font-bold text-gray-900">{p.owner?.name || "Customer"}</p>
														<p className="text-[10px] text-gray-400">{p.owner?.email}</p>
													</div>
												</td>

												<td className="py-4 pr-4">
													<span
														className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
															isReview
																? "bg-amber-100 text-amber-800 border border-amber-200"
																: isLive
																? "bg-emerald-100 text-emerald-800 border border-emerald-200"
																: "bg-blue-100 text-blue-800 border border-blue-200"
														}`}>
														{p.status}
													</span>
												</td>

												<td className="py-4 pr-4">
													<div className="flex items-center gap-2">
														<div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
															<div
																className={`h-full rounded-full ${
																	isLive ? "bg-emerald-500" : "bg-blue-600"
																}`}
																style={{ width: `${p.progress}%` }}
															/>
														</div>
														<span className="text-[11px] font-bold text-gray-600">
															{p.progress}%
														</span>
													</div>
												</td>

												<td className="py-4 text-right">
													<Link
														href={`/admin/projects/${p.id}`}
														className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-all shadow-xs">
														<span>Review Studio</span>
														<ArrowRight className="w-3 h-3 ml-1" />
													</Link>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
