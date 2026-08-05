/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import PillButton from "@/components/PillButton";
import ProjectCard from "@/components/dashboard/ProjectCard";
import type { ProjectCardProps } from "@/components/dashboard/ProjectCard";

const allProjects: ProjectCardProps[] = [
	{
		name: "My Business Page",
		type: "Landing Page",
		status: "In Progress",
		progress: 65,
		lastUpdated: "2 hours ago",
	},
	{
		name: "Summer Launch Funnel",
		type: "Sales Funnel",
		status: "In Review",
		progress: 90,
		lastUpdated: "1 day ago",
	},
	{
		name: "Online Store",
		type: "E-commerce Store",
		status: "Draft",
		progress: 10,
		lastUpdated: "3 days ago",
	},
	{
		name: "Portfolio Showcase",
		type: "Landing Page",
		status: "Live",
		progress: 100,
		lastUpdated: "1 week ago",
	},
];

type FilterStatus = "All" | "In Progress" | "In Review" | "Live" | "Draft";

export default function ProjectsPage() {
	const [activeFilter, setActiveFilter] = useState<FilterStatus>("All");
	const [searchQuery, setSearchQuery] = useState("");

	const filteredProjects = allProjects.filter((project) => {
		const matchesFilter =
			activeFilter === "All" || project.status === activeFilter;
		const matchesSearch =
			project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.type.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesFilter && matchesSearch;
	});

	const filters: FilterStatus[] = [
		"All",
		"In Progress",
		"In Review",
		"Live",
		"Draft",
	];

	return (
		<div className="w-full min-h-screen bg-[#f8fafc]">
			{/* Main Container */}
			<div className="px-4 sm:px-6 lg:px-8 pt-10 pb-16 max-w-[1400px] mx-auto">
				{/* Page Header */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/80 mb-8">
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 tracking-tight mb-1">
							Projects
						</h1>
						<p className="text-gray-500 text-sm font-medium">
							Manage and track all your active website projects.
						</p>
					</div>

					<PillButton
						href="/dashboard/projects/new"
						baseColor="#004ac6"
						circleColor="#ffffff"
						textColor="#ffffff"
						hoverTextColor="#004ac6"
						useThunderFont={true}
						className="px-5 py-2.5 text-xs font-bold border border-blue-600 shadow-md">
						+ New Project
					</PillButton>
				</div>

				{/* Controls Bar: Search & Filter Tabs */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
					{/* Filter Tabs */}
					<div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
						{filters.map((filter) => {
							const count =
								filter === "All"
									? allProjects.length
									: allProjects.filter((p) => p.status === filter).length;

							return (
								<button
									key={filter}
									type="button"
									onClick={() => setActiveFilter(filter)}
									className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-2 ${
										activeFilter === filter
											? "bg-blue-600 text-white shadow-xs"
											: "bg-white text-gray-600 hover:bg-gray-100/80 border border-gray-200/80"
									}`}>
									<span>{filter}</span>
									<span
										className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
											activeFilter === filter
												? "bg-blue-500 text-white"
												: "bg-gray-100 text-gray-500"
										}`}>
										{count}
									</span>
								</button>
							);
						})}
					</div>

					{/* Search Box */}
					<div className="relative w-full md:w-64">
						<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
							search
						</span>
						<input
							type="text"
							placeholder="Search projects..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200/90 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
						/>
					</div>
				</div>

				{/* Projects Grid */}
				{filteredProjects.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
						{filteredProjects.map((project) => (
							<ProjectCard key={project.name} {...project} />
						))}
					</div>
				) : (
					/* Empty State */
					<div className="bg-white border border-gray-200/90 rounded-2xl p-12 text-center max-w-md mx-auto">
						<div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
							<span className="material-symbols-outlined text-2xl">
								folder_off
							</span>
						</div>
						<h3 className="text-base font-bold font-nohemi text-gray-900 mb-1">
							No projects found
						</h3>
						<p className="text-xs text-gray-500 mb-6">
							No projects matched your filter or search criteria.
						</p>
						<button
							type="button"
							onClick={() => {
								setActiveFilter("All");
								setSearchQuery("");
							}}
							className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors">
							Reset Filters
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
