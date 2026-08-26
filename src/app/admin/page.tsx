/** @format */

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
	Layers,
	Clock,
	CheckCircle2,
	Users,
	Receipt,
	ArrowUpRight,
	Loader2,
	Search,
	Sparkles,
	Globe,
	TrendingUp,
	ShieldCheck,
	AlertCircle,
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

export default function AdminDashboardPage() {
	const [stats, setStats] = useState<AdminStats | null>(null);
	const [recentProjects, setRecentProjects] = useState<ProjectSummary[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchAdminData() {
			try {
				setIsLoading(true);
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
					setRecentProjects(projData.projects?.slice(0, 6) || []);
				}
			} catch (error) {
				console.error("[FETCH_ADMIN_DATA_ERROR]", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchAdminData();
	}, []);

	if (isLoading) {
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
				<Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
				<p className="text-xs font-bold text-gray-500">Loading operations center...</p>
			</div>
		);
	}

	return (
		<div className="space-y-8 animate-in fade-in duration-200">
			{/* Welcome Banner */}
			<div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
				<div className="space-y-2">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
						<Sparkles className="w-3.5 h-3.5" />
						<span>Kiosk Fulfillment Operations</span>
					</div>
					<h1 className="text-2xl sm:text-3xl font-extrabold font-nohemi tracking-tight">
						Master Operations & Review Hub
					</h1>
					<p className="text-slate-300 text-xs sm:text-sm font-medium max-w-xl">
						Review submitted customer business info, manage QA pipelines, publish client subdomains, and monitor live website instances.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<Link
						href="/admin/projects"
						className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2">
						<Layers className="w-4 h-4" />
						<span>Open Fulfillment Queue ({stats?.inReviewCount || 0})</span>
					</Link>
				</div>
			</div>

			{/* KPI Metrics Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* In Review / Pending Action */}
				<div className="p-5 rounded-2xl bg-white border border-amber-200/90 shadow-2xs space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
							In Review (Action Needed)
						</span>
						<div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
							<Clock className="w-4 h-4" />
						</div>
					</div>
					<div className="flex items-baseline gap-2">
						<h3 className="text-3xl font-extrabold font-nohemi text-amber-700">
							{stats?.inReviewCount || 0}
						</h3>
						<span className="text-[11px] font-bold text-gray-400">submissions</span>
					</div>
					<p className="text-[11px] text-gray-500 font-medium">
						Client content awaiting QA & customization
					</p>
				</div>

				{/* In Progress */}
				<div className="p-5 rounded-2xl bg-white border border-blue-200/90 shadow-2xs space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
							In Progress
						</span>
						<div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
							<Layers className="w-4 h-4" />
						</div>
					</div>
					<div className="flex items-baseline gap-2">
						<h3 className="text-3xl font-extrabold font-nohemi text-blue-700">
							{stats?.inProgressCount || 0}
						</h3>
						<span className="text-[11px] font-bold text-gray-400">sites building</span>
					</div>
					<p className="text-[11px] text-gray-500 font-medium">
						Currently in design & template staging
					</p>
				</div>

				{/* Live & Published */}
				<div className="p-5 rounded-2xl bg-white border border-emerald-200/90 shadow-2xs space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
							Live Websites
						</span>
						<div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
							<CheckCircle2 className="w-4 h-4" />
						</div>
					</div>
					<div className="flex items-baseline gap-2">
						<h3 className="text-3xl font-extrabold font-nohemi text-emerald-700">
							{stats?.liveCount || 0}
						</h3>
						<span className="text-[11px] font-bold text-gray-400">published live</span>
					</div>
					<p className="text-[11px] text-gray-500 font-medium">
						Serving active client traffic
					</p>
				</div>

				{/* Total Revenue */}
				<div className="p-5 rounded-2xl bg-white border border-purple-200/90 shadow-2xs space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
							Revenue Collected
						</span>
						<div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
							<TrendingUp className="w-4 h-4" />
						</div>
					</div>
					<div className="flex items-baseline gap-2">
						<h3 className="text-3xl font-extrabold font-nohemi text-purple-700">
							${(stats?.totalRevenue || 0).toLocaleString()}
						</h3>
						<span className="text-[11px] font-bold text-gray-400">USD</span>
					</div>
					<p className="text-[11px] text-gray-500 font-medium">
						{stats?.paidInvoicesCount || 0} paid invoices processed
					</p>
				</div>
			</div>

			{/* Recent Submissions Queue */}
			<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
					<div>
						<h2 className="text-lg font-bold font-nohemi text-gray-900">
							Recent Client Submissions
						</h2>
						<p className="text-xs text-gray-500 font-medium mt-0.5">
							Latest customer intake forms submitted for fulfillment and publication.
						</p>
					</div>

					<Link
						href="/admin/projects"
						className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
						<span>View All Submissions ({stats?.totalProjects || 0})</span>
						<ArrowUpRight className="w-4 h-4" />
					</Link>
				</div>

				{recentProjects.length === 0 ? (
					<div className="p-12 text-center space-y-2">
						<CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
						<h4 className="text-sm font-bold text-gray-900">Queue is clear!</h4>
						<p className="text-xs text-gray-500">
							No pending submissions currently waiting for review.
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-left text-xs">
							<thead>
								<tr className="border-b border-gray-100 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
									<th className="pb-3">Business / Project</th>
									<th className="pb-3">Plan</th>
									<th className="pb-3">Client Owner</th>
									<th className="pb-3">Status</th>
									<th className="pb-3">Progress</th>
									<th className="pb-3 text-right">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-50 font-medium">
								{recentProjects.map((p) => {
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
															className="w-9 h-9 rounded-xl object-contain border border-gray-200 bg-white p-1 shrink-0"
														/>
													) : (
														<div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center shrink-0">
															{p.name.charAt(0).toUpperCase()}
														</div>
													)}
													<div>
														<p className="font-bold text-gray-900">{p.businessName || p.name}</p>
														<p className="text-[10px] text-gray-400">
															{p.tenant?.slug ? `${p.tenant.slug}.kioosk.online` : "Tenant Workspace"}
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
													<p className="font-bold text-gray-900">{p.owner?.name || "Client"}</p>
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
													className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors shadow-2xs">
													<span>Review & Launch →</span>
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
	);
}
