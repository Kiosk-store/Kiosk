/** @format */

"use client";

import React from "react";

export interface ProjectCardProps {
	name: string;
	type: "Landing Page" | "Sales Funnel" | "E-commerce Store" | "E-commerce" | string;
	status: "In Progress" | "In Review" | "Live" | "Draft" | string;
	progress: number;
	lastUpdated: string;
	publishedUrl?: string;
}

const statusConfig: Record<
	string,
	{ color: string; bg: string; dot: string }
> = {
	"In Progress": {
		color: "text-amber-700",
		bg: "bg-amber-50 border border-amber-200/60",
		dot: "bg-amber-500",
	},
	"In Review": {
		color: "text-blue-700",
		bg: "bg-blue-50 border border-blue-200/60",
		dot: "bg-blue-500",
	},
	Live: {
		color: "text-emerald-700",
		bg: "bg-emerald-50 border border-emerald-200/60",
		dot: "bg-emerald-500",
	},
	Draft: {
		color: "text-gray-600",
		bg: "bg-gray-100 border border-gray-200/60",
		dot: "bg-gray-400",
	},
};

const typeIcon: Record<string, string> = {
	"Landing Page": "web",
	"Sales Funnel": "filter_alt",
	"E-commerce Store": "shopping_bag",
	"E-commerce": "shopping_bag",
};

const typeAccent: Record<string, { bg: string; icon: string }> = {
	"Landing Page": { bg: "bg-blue-50", icon: "text-blue-600" },
	"Sales Funnel": { bg: "bg-indigo-50", icon: "text-indigo-600" },
	"E-commerce Store": { bg: "bg-purple-50", icon: "text-purple-600" },
	"E-commerce": { bg: "bg-purple-50", icon: "text-purple-600" },
};

export default function ProjectCard({
	name,
	type,
	status,
	progress,
	lastUpdated,
	publishedUrl,
}: ProjectCardProps) {
	const sConf = statusConfig[status] || statusConfig["Draft"];
	const tAccent = typeAccent[type] || { bg: "bg-gray-50", icon: "text-gray-600" };
	const iconName = typeIcon[type] || "web";

	return (
		<div className="group relative bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:border-blue-500/40 hover:shadow-xs flex flex-col justify-between">
			<div>
				{/* Top Row: Icon + Name */}
				<div className="flex items-start justify-between gap-3 mb-5">
					<div className="flex items-center gap-3">
						<div
							className={`w-10 h-10 rounded-xl ${tAccent.bg} flex items-center justify-center shrink-0`}>
							<span className={`material-symbols-outlined ${tAccent.icon} text-[20px]`}>
								{iconName}
							</span>
						</div>
						<div>
							<h3 className="text-gray-900 font-nohemi font-bold text-base leading-tight">
								{name}
							</h3>
							<p className="text-gray-500 text-xs mt-0.5 font-medium">{type}</p>
						</div>
					</div>

					<div className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${sConf.bg} ${sConf.color} flex items-center gap-1.5`}>
						<span className={`w-1.5 h-1.5 rounded-full ${sConf.dot}`} />
						<span>{status}</span>
					</div>
				</div>

				{/* Progress Bar */}
				<div className="mb-4">
					<div className="flex items-center justify-between mb-1.5">
						<span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
							Progress
						</span>
						<span className="text-[11px] text-gray-700 font-bold">
							{progress}%
						</span>
					</div>
					<div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
						<div
							className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-out"
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>
			</div>

			{/* Bottom Row */}
			<div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
				<span className="text-[11px] text-gray-400 font-medium">
					Updated {lastUpdated}
				</span>
				{publishedUrl ? (
					<a
						href={publishedUrl}
						target="_blank"
						rel="noreferrer"
						className="text-[11px] text-blue-600 font-bold hover:text-blue-700 transition-colors duration-200 flex items-center gap-1 cursor-pointer">
						Visit Site
						<span className="material-symbols-outlined text-[14px]">
							open_in_new
						</span>
					</a>
				) : (
					<button className="text-[11px] text-blue-600 font-bold hover:text-blue-700 transition-colors duration-200 flex items-center gap-1 cursor-pointer">
						Details
						<span className="material-symbols-outlined text-[14px]">
							arrow_forward
						</span>
					</button>
				)}
			</div>
		</div>
	);
}
