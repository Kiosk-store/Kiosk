/** @format */

"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
	Layers,
	Search,
	Filter,
	Clock,
	CheckCircle2,
	Globe,
	Loader2,
	Sparkles,
	ExternalLink,
	Phone,
	Mail,
	ArrowLeft,
} from "lucide-react";

interface ProjectItem {
	id: string;
	name: string;
	type: string;
	status: string;
	progress: number;
	publishedUrl?: string;
	adminNotes?: string;
	businessName?: string;
	tagline?: string;
	logoUrl?: string;
	imagesCount: number;
	hasSubmittedContent: boolean;
	tenant?: {
		id: string;
		name: string;
		slug: string;
		plan: string;
		customDomain?: string;
	};
	owner?: {
		id: string;
		name: string;
		email: string;
		phone: string;
	};
	createdAt: string;
	updatedAt: string;
}

export default function AdminProjectsQueuePage() {
	const [projects, setProjects] = useState<ProjectItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState<"ALL" | "IN_REVIEW" | "IN_PROGRESS" | "LIVE" | "DRAFT">("ALL");

	useEffect(() => {
		async function fetchProjects() {
			try {
				setIsLoading(true);
				const res = await fetch("/api/admin/projects");
				if (res.ok) {
					const data = await res.json();
					setProjects(data.projects || []);
				}
			} catch (err) {
				console.error("[FETCH_ADMIN_PROJECTS_ERROR]", err);
			} finally {
				setIsLoading(false);
			}
		}

		fetchProjects();
	}, []);

	const filteredProjects = useMemo(() => {
		return projects.filter((p) => {
			// Tab filtering
			if (activeTab === "IN_REVIEW" && p.status !== "In Review") return false;
			if (activeTab === "IN_PROGRESS" && p.status !== "In Progress") return false;
			if (activeTab === "LIVE" && p.status !== "Live" && p.status !== "Published") return false;
			if (activeTab === "DRAFT" && p.status !== "Draft") return false;

			// Search filtering
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase().trim();
				const matchName = p.name?.toLowerCase().includes(q);
				const matchBusiness = p.businessName?.toLowerCase().includes(q);
				const matchEmail = p.owner?.email?.toLowerCase().includes(q);
				const matchClientName = p.owner?.name?.toLowerCase().includes(q);
				const matchSlug = p.tenant?.slug?.toLowerCase().includes(q);
				return matchName || matchBusiness || matchEmail || matchClientName || matchSlug;
			}

			return true;
		});
	}, [projects, activeTab, searchQuery]);

	const counts = useMemo(() => {
		return {
			all: projects.length,
			inReview: projects.filter((p) => p.status === "In Review").length,
			inProgress: projects.filter((p) => p.status === "In Progress").length,
			live: projects.filter((p) => p.status === "Live" || p.status === "Published").length,
			draft: projects.filter((p) => p.status === "Draft").length,
		};
	}, [projects]);

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
						<span className="text-xs font-bold text-blue-600">Fulfillment Queue</span>
					</div>
					<h1 className="text-2xl font-bold font-nohemi text-gray-900 mt-1">
						Client Website Fulfillment Queue
					</h1>
					<p className="text-xs text-gray-500 font-medium">
						Review submitted customer assets, assign published domains, and mark projects live.
					</p>
				</div>
			</div>

			{/* Search & Filter Tabs Bar */}
			<div className="p-4 bg-white border border-gray-200/90 rounded-3xl shadow-2xs space-y-4">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-3">
					{/* Status Tabs */}
					<div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-2xl overflow-x-auto w-full sm:w-auto">
						{[
							{ id: "ALL", label: `All (${counts.all})` },
							{ id: "IN_REVIEW", label: `In Review (${counts.inReview})` },
							{ id: "IN_PROGRESS", label: `In Progress (${counts.inProgress})` },
							{ id: "LIVE", label: `Live (${counts.live})` },
							{ id: "DRAFT", label: `Draft (${counts.draft})` },
						].map((tab) => (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id as any)}
								className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
									activeTab === tab.id
										? "bg-white text-blue-600 shadow-xs"
										: "text-gray-600 hover:text-gray-900"
								}`}>
								{tab.label}
							</button>
						))}
					</div>

					{/* Search Bar */}
					<div className="relative w-full sm:w-72">
						<Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
						<input
							type="text"
							placeholder="Search by business, email, slug..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 bg-gray-50/50"
						/>
					</div>
				</div>
			</div>

			{/* Submissions Table */}
			<div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
				{isLoading ? (
					<div className="p-16 flex flex-col items-center justify-center gap-3">
						<Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
						<p className="text-xs font-bold text-gray-500">Loading...</p>
					</div>
				) : filteredProjects.length === 0 ? (
					<div className="p-16 text-center space-y-2">
						<CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
						<h4 className="text-sm font-bold text-gray-900">No submissions found</h4>
						<p className="text-xs text-gray-500">
							{searchQuery
								? "Try adjusting your search keywords."
								: "No client submissions currently in this filter."}
						</p>
					</div>
				) : (
					<>
						{/* MOBILE CARD VIEW: Visible only on mobile/phone screens */}
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
														{p.tenant?.slug ? `${p.tenant.slug}` : "workspace"} • {p.imagesCount} files
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
												<span className="text-[10px] text-gray-400 font-bold block uppercase">Client</span>
												<span className="text-gray-800 font-medium truncate block">{p.owner?.name || "Client"}</span>
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

										<div className="pt-2 border-t border-gray-200/60 flex items-center justify-between gap-2">
											{p.publishedUrl ? (
												<a
													href={p.publishedUrl}
													target="_blank"
													rel="noreferrer"
													className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline truncate max-w-[140px]">
													<Globe className="w-3 h-3 shrink-0" />
													<span className="truncate">{p.publishedUrl.replace(/^https?:\/\//, "")}</span>
												</a>
											) : (
												<span className="text-[10px] text-gray-400 italic">Not published</span>
											)}

											<Link
												href={`/admin/projects/${p.id}`}
												className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-all shadow-xs shrink-0">
												<Sparkles className="w-3 h-3" />
												<span>Review Studio</span>
											</Link>
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
										<th className="pb-3">Business & Assets</th>
										<th className="pb-3">Plan / Category</th>
										<th className="pb-3">Client Contact</th>
										<th className="pb-3">Status</th>
										<th className="pb-3">Progress</th>
										<th className="pb-3">Live Domain</th>
										<th className="pb-3 text-right">Review Action</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-50 font-medium">
									{filteredProjects.map((p) => {
										const isReview = p.status === "In Review";
										const isLive = p.status === "Live" || p.status === "Published";

										return (
											<tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
												{/* Business & Assets */}
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
															<div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
																<span>{p.imagesCount} brand files</span>
																<span>•</span>
																<span>{p.tenant?.slug ? `${p.tenant.slug}` : "workspace"}</span>
															</div>
														</div>
													</div>
												</td>

												{/* Plan */}
												<td className="py-4 pr-4">
													<span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
														{p.type}
													</span>
												</td>

												{/* Client Contact */}
												<td className="py-4 pr-4">
													<div>
														<p className="font-bold text-gray-900">{p.owner?.name || "Client"}</p>
														<div className="flex flex-col gap-0.5 text-[10px] text-gray-400 mt-0.5">
															<span className="truncate max-w-[160px]">{p.owner?.email}</span>
															{p.owner?.phone && <span>{p.owner.phone}</span>}
														</div>
													</div>
												</td>

												{/* Status */}
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

												{/* Progress */}
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

												{/* Live Domain */}
												<td className="py-4 pr-4">
													{p.publishedUrl ? (
														<a
															href={p.publishedUrl}
															target="_blank"
															rel="noreferrer"
															className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline max-w-[160px] truncate">
															<Globe className="w-3 h-3 shrink-0" />
															<span className="truncate">{p.publishedUrl.replace(/^https?:\/\//, "")}</span>
														</a>
													) : (
														<span className="text-[10px] text-gray-400 font-medium italic">
															Not published yet
														</span>
													)}
												</td>

												{/* Action */}
												<td className="py-4 text-right">
													<Link
														href={`/admin/projects/${p.id}`}
														className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-all shadow-xs">
														<Sparkles className="w-3.5 h-3.5" />
														<span>Review Studio →</span>
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
