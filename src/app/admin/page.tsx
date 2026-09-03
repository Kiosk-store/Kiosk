/** @format */

"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
	Clock,
	CheckCircle2,
	Users,
	ArrowRight,
	Loader2,
	Search,
	TrendingUp,
	RefreshCw,
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPrice } from "@/lib/currency";

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

export default function AdminDashboardPage() {
	const { currency, isLoading: isCurrencyLoading } = useCurrency();
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
				<p className="text-xs font-bold text-gray-500">Loading admin operations...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-in fade-in duration-200">
			{/* Clean Light Header Bar */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-gray-200/90 rounded-3xl shadow-2xs">
				<div className="flex items-center gap-3.5">
					<div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center font-extrabold text-base shadow-2xs">
						K
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h1 className="font-extrabold font-nohemi text-xl tracking-tight text-gray-900">
								Admin Workspace
							</h1>
							<span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
								OPERATIONAL
							</span>
						</div>
						<p className="text-xs text-gray-500 font-medium mt-0.5">
							Client project submissions, fulfillment pipeline, and tenant directory
						</p>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<button
						type="button"
						onClick={fetchDashboardData}
						disabled={isRefreshing}
						className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs">
						<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
						<span>Refresh Data</span>
					</button>

					<Link
						href="/dashboard"
						className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 text-xs font-bold transition-all shadow-2xs hover:shadow-sm hover:border-gray-300 hover:scale-105 active:scale-95">
						<span>Customer View</span>
						<ArrowRight className="w-3.5 h-3.5 text-gray-400" />
					</Link>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* LIGHT STATS CARDS GRID */}
			{/* ========================================================================= */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
				{/* 1. Submissions In Review */}
				<div className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-2xs flex flex-col justify-between space-y-4 hover:border-amber-300 hover:shadow-md transition-all">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
							In Review
						</span>
						<div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center">
							<Clock className="w-4 h-4" />
						</div>
					</div>

					<div>
						<div className="flex items-baseline gap-2">
							<h3 className="text-3xl font-extrabold font-nohemi text-amber-700">
								{stats?.inReviewCount || 0}
							</h3>
							<span className="text-xs font-bold text-gray-400">pending</span>
						</div>
						<p className="text-xs text-gray-500 font-medium mt-1">
							Submissions awaiting fulfillment
						</p>
					</div>

					<Link
						href="/admin/projects"
						className="inline-flex items-center justify-between px-5 py-2.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-all hover:scale-102 active:scale-98">
						<span>Open Queue</span>
						<ArrowRight className="w-3.5 h-3.5 text-amber-700" />
					</Link>
				</div>

				{/* 2. Total Revenue */}
				<div className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-2xs flex flex-col justify-between space-y-4 hover:border-purple-300 hover:shadow-md transition-all">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
							Total Revenue
						</span>
						<div className="w-9 h-9 rounded-2xl bg-purple-50 border border-purple-200/60 text-purple-700 flex items-center justify-center">
							<TrendingUp className="w-4 h-4" />
						</div>
					</div>

					<div>
						<div className="flex items-baseline gap-2 flex-wrap">
							<h3 className="text-3xl font-extrabold font-nohemi text-purple-700">
								{isCurrencyLoading
									? "…"
									: formatPrice(stats?.totalRevenue || 0, currency)}
							</h3>
							{!isCurrencyLoading && (
								<span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-full border border-purple-200 uppercase">
									{currency.code}
								</span>
							)}
						</div>
						<p className="text-xs text-gray-500 font-medium mt-1">
							{stats?.paidInvoicesCount || 0} paid • {stats?.pendingInvoicesCount || 0} pending
						</p>
					</div>

					<Link
						href="/admin/billing"
						className="inline-flex items-center justify-between px-5 py-2.5 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold transition-all hover:scale-102 active:scale-98">
						<span>Billing Ledger</span>
						<ArrowRight className="w-3.5 h-3.5 text-purple-700" />
					</Link>
				</div>

				{/* 3. Live Websites */}
				<div className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-2xs flex flex-col justify-between space-y-4 hover:border-emerald-300 hover:shadow-md transition-all">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
							Live Websites
						</span>
						<div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center">
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
							Published on subdomains
						</p>
					</div>

					<Link
						href="/admin/projects"
						className="inline-flex items-center justify-between px-5 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold transition-all hover:scale-102 active:scale-98">
						<span>Inspect Sites</span>
						<ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
					</Link>
				</div>

				{/* 4. Registered Users & Workspaces */}
				<div className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-2xs flex flex-col justify-between space-y-4 hover:border-blue-300 hover:shadow-md transition-all">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
							Tenants & Users
						</span>
						<div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200/60 text-blue-700 flex items-center justify-center">
							<Users className="w-4 h-4" />
						</div>
					</div>

					<div>
						<div className="flex items-baseline gap-2">
							<h3 className="text-3xl font-extrabold font-nohemi text-blue-700">
								{stats?.totalTenants || 0}
							</h3>
							<span className="text-xs font-bold text-gray-400">({stats?.totalUsers || 0} users)</span>
						</div>
						<p className="text-xs text-gray-500 font-medium mt-1">
							Active tenant workspaces
						</p>
					</div>

					<Link
						href="/admin/users"
						className="inline-flex items-center justify-between px-5 py-2.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold transition-all hover:scale-102 active:scale-98">
						<span>Directory</span>
						<ArrowRight className="w-3.5 h-3.5 text-blue-700" />
					</Link>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* REAL-TIME SUBMISSIONS STREAM TABLE */}
			{/* ========================================================================= */}
			<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
					<div>
						<h3 className="text-lg font-bold font-nohemi text-gray-900">
							Recent Client Submissions
						</h3>
						<p className="text-xs text-gray-500 font-medium mt-0.5">
							Live intake forms submitted by customers for website creation
						</p>
					</div>

					{/* Search Bar & Full Queue Pill */}
					<div className="flex items-center gap-3">
						<div className="relative w-full sm:w-72">
							<Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
							<input
								type="text"
								placeholder="Search by business, email, slug..."
								value={searchFilter}
								onChange={(e) => setSearchFilter(e.target.value)}
								className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 bg-gray-50/60 shadow-2xs"
							/>
						</div>

						<Link
							href="/admin/projects"
							className="px-5 py-2.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-2xs">
							Full Queue
						</Link>
					</div>
				</div>

				{filteredProjects.length === 0 ? (
					<div className="p-16 text-center space-y-2 bg-gray-50/40 rounded-3xl border border-dashed border-gray-200">
						<CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
						<h4 className="text-sm font-bold text-gray-900">No submissions found</h4>
						<p className="text-xs text-gray-500">
							Customer intake forms will appear here in real-time.
						</p>
					</div>
				) : (
					<>
						{/* MOBILE CARDS: Visible on phone screens */}
						<div className="block md:hidden space-y-3">
							{filteredProjects.map((p) => {
								const isReview = p.status === "In Review";
								const isLive = p.status === "Live" || p.status === "Published";

								return (
									<div
										key={p.id}
										className="p-4 rounded-2xl bg-gray-50/70 border border-gray-150 space-y-3">
										<div className="flex items-start justify-between gap-2">
											<div className="flex items-center gap-2.5 min-w-0">
												{p.logoUrl ? (
													<img
														src={p.logoUrl}
														alt={p.name}
														className="w-10 h-10 rounded-xl object-contain border border-gray-200 bg-white p-1 shrink-0 shadow-2xs"
													/>
												) : (
													<div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center shrink-0 text-sm">
														{p.name.charAt(0).toUpperCase()}
													</div>
												)}
												<div className="min-w-0">
													<p className="font-bold text-xs text-gray-900 truncate">
														{p.businessName || p.name}
													</p>
													<p className="text-[10px] text-gray-500 truncate">
														{p.tenant?.slug ? `${p.tenant.slug}.kioosk.online` : "Workspace"}
													</p>
												</div>
											</div>

											<span
												className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
													isReview
														? "bg-amber-100 text-amber-800 border border-amber-200"
														: isLive
														? "bg-emerald-100 text-emerald-800 border border-emerald-200"
														: "bg-blue-100 text-blue-800 border border-blue-200"
												}`}>
												{p.status}
											</span>
										</div>

										<div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-gray-200/60">
											<div>
												<span className="text-[10px] text-gray-400 font-bold block uppercase">Customer</span>
												<span className="text-gray-800 font-medium truncate block">{p.owner?.name || "Customer"}</span>
												<span className="text-[10px] text-gray-500 truncate block">{p.owner?.email}</span>
											</div>
											<div>
												<span className="text-[10px] text-gray-400 font-bold block uppercase">Plan & Progress</span>
												<span className="text-blue-700 font-bold block">{p.type}</span>
												<div className="flex items-center gap-1.5 mt-1">
													<div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
														<div
															className={`h-full rounded-full ${
																isLive ? "bg-emerald-500" : "bg-blue-600"
															}`}
															style={{ width: `${p.progress}%` }}
														/>
													</div>
													<span className="text-[10px] font-bold text-gray-600">{p.progress}%</span>
												</div>
											</div>
										</div>

										<div className="pt-2 border-t border-gray-200/60 flex items-center justify-end">
											<Link
												href={`/admin/projects/${p.id}`}
												className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs">
												<span>Review Studio</span>
												<ArrowRight className="w-3 h-3" />
											</Link>
										</div>
									</div>
								);
							})}
						</div>

						{/* DESKTOP TABLE: Visible on medium+ screens */}
						<div className="hidden md:block overflow-x-auto">
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
											<tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
												<td className="py-4 pr-4">
													<div className="flex items-center gap-3">
														{p.logoUrl ? (
															<img
																src={p.logoUrl}
																alt={p.name}
																className="w-10 h-10 rounded-2xl object-contain border border-gray-200 bg-white p-1 shrink-0 shadow-2xs"
															/>
														) : (
															<div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 font-extrabold flex items-center justify-center shrink-0">
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
													<span className="px-3 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800 border border-gray-200">
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
														className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
															isReview
																? "bg-amber-50 text-amber-800 border border-amber-200"
																: isLive
																? "bg-emerald-50 text-emerald-800 border border-emerald-200"
																: "bg-blue-50 text-blue-800 border border-blue-200"
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
														className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95">
														<span>Review Studio</span>
														<ArrowRight className="w-3 h-3 ml-0.5" />
													</Link>
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
