/** @format */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProjectCard from "@/components/dashboard/ProjectCard";
import type { ProjectCardProps } from "@/components/dashboard/ProjectCard";

/* Mock data for demonstration */
const mockProjects: ProjectCardProps[] = [
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
];

interface StatCard {
	label: string;
	value: string;
	icon: string;
	change?: string;
	changeType?: "up" | "down" | "neutral";
	iconBg: string;
	iconColor: string;
}

const stats: StatCard[] = [
	{
		label: "Active Projects",
		value: "2",
		icon: "folder_open",
		change: "+1 this month",
		changeType: "up",
		iconBg: "bg-blue-50",
		iconColor: "text-blue-600",
	},
	{
		label: "Sites Live",
		value: "0",
		icon: "public",
		change: "Launch soon",
		changeType: "neutral",
		iconBg: "bg-emerald-50",
		iconColor: "text-emerald-600",
	},
	{
		label: "Current Plan",
		value: "Free",
		icon: "workspace_premium",
		change: "Upgrade available",
		changeType: "neutral",
		iconBg: "bg-purple-50",
		iconColor: "text-purple-600",
	},
	{
		label: "Support Tickets",
		value: "0",
		icon: "support_agent",
		change: "All resolved",
		changeType: "neutral",
		iconBg: "bg-amber-50",
		iconColor: "text-amber-600",
	},
];

interface QuickAction {
	label: string;
	description: string;
	icon: string;
	href: string;
	iconColor: string;
	bgColor: string;
}

const quickActions: QuickAction[] = [
	{
		label: "Start New Project",
		description: "Create a new site from scratch",
		icon: "add_circle",
		href: "/get-started",
		iconColor: "text-blue-600",
		bgColor: "bg-blue-50 group-hover:bg-blue-100",
	},
	{
		label: "Submit Content",
		description: "Fill out your questionnaire",
		icon: "edit_note",
		href: "/dashboard",
		iconColor: "text-emerald-600",
		bgColor: "bg-emerald-50 group-hover:bg-emerald-100",
	},
	{
		label: "View Templates",
		description: "Browse available designs",
		icon: "palette",
		href: "/dashboard",
		iconColor: "text-purple-600",
		bgColor: "bg-purple-50 group-hover:bg-purple-100",
	},
	{
		label: "Contact Support",
		description: "Get help from our team",
		icon: "chat",
		href: "/dashboard",
		iconColor: "text-amber-600",
		bgColor: "bg-amber-50 group-hover:bg-amber-100",
	},
];

export default function DashboardPage() {
	const router = useRouter();
	const [greeting, setGreeting] = useState("Good morning");
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	useEffect(() => {
		const hour = new Date().getHours();
		if (hour < 12) {
			setGreeting("Good morning");
		} else if (hour < 17) {
			setGreeting("Good afternoon");
		} else {
			setGreeting("Good evening");
		}
	}, []);

	const handleLogout = () => {
		setIsProfileOpen(false);
		router.push("/get-started");
	};

	return (
		<div className="w-full min-h-screen bg-[#f8fafc]">
			{/* Header with Logo and Profile Dropdown */}
			<header className="sticky top-0 z-30 bg-[#f8fafc]/90 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
				{/* Logo */}
				<Link
					href="/"
					className="flex items-center gap-2.5 text-gray-900 font-nohemi font-bold text-xl tracking-tight hover:opacity-85 transition-opacity">
					<div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-xs">
						K
					</div>
					<span>Kiosk</span>
				</Link>

				{/* Right Controls */}
				<div className="flex items-center gap-2">
					{/* Notifications Button */}
					<button
						type="button"
						aria-label="Notifications"
						className="relative p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 transition-colors duration-200 cursor-pointer">
						<span className="material-symbols-outlined text-[22px]">
							notifications
						</span>
						<div className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full" />
					</button>

					{/* Vertical Separator */}
					<div className="h-5 w-px bg-gray-200 mx-1" />

					{/* User Profile Pill & Dropdown */}
					<div className="relative">
						<button
							type="button"
							onClick={() => setIsProfileOpen(!isProfileOpen)}
							aria-expanded={isProfileOpen}
							className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-gray-800 hover:bg-gray-200/50 transition-colors duration-200 cursor-pointer select-none">
							<div className="w-7 h-7 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
								JV
							</div>
							<span className="text-sm font-semibold text-gray-900">
								Jeremiah
							</span>
							<span
								className={`material-symbols-outlined text-gray-400 text-[18px] transition-transform duration-200 ${
									isProfileOpen ? "rotate-180" : ""
								}`}>
								expand_more
							</span>
						</button>

						{/* Dropdown Menu */}
						{isProfileOpen && (
							<>
								{/* Backdrop to close on outside click */}
								<div
									className="fixed inset-0 z-40"
									onClick={() => setIsProfileOpen(false)}
								/>

								<div className="absolute right-0 top-full mt-2 w-60 bg-white border border-gray-200/90 rounded-2xl shadow-xl z-50 p-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
									{/* User Info Header */}
									<div className="px-3.5 py-3 border-b border-gray-100 mb-1">
										<p className="text-sm font-bold text-gray-900 leading-snug">
											Jeremiah Victor
										</p>
										<p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
											jeremiah@kiosk.com
										</p>
									</div>

									{/* Quick Links */}
									<div className="space-y-0.5">
										<button
											type="button"
											onClick={() => {
												setIsProfileOpen(false);
												router.push("/dashboard/settings");
											}}
											className="group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all duration-150 cursor-pointer">
											<span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-blue-600 group-hover:scale-110 transition-all">
												settings
											</span>
											<span>Account Settings</span>
										</button>

										<button
											type="button"
											onClick={() => {
												setIsProfileOpen(false);
												router.push("/dashboard/billing");
											}}
											className="group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all duration-150 cursor-pointer">
											<span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-blue-600 group-hover:scale-110 transition-all">
												receipt_long
											</span>
											<span>Billing & Plan</span>
										</button>
									</div>

									{/* Log Out Button */}
									<div className="border-t border-gray-100 mt-1 pt-1">
										<button
											type="button"
											onClick={handleLogout}
											className="group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-150 cursor-pointer">
											<span className="material-symbols-outlined text-[18px] text-red-500 group-hover:scale-110 transition-transform">
												logout
											</span>
											<span>Log Out</span>
										</button>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-16 max-w-[1400px] mx-auto">
				{/* Welcome Header */}
				<div className="pb-6 sm:pb-8 border-b border-gray-200/80 mb-8 sm:mb-10">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-nohemi text-gray-900 tracking-tight mb-1.5">
						{greeting}, Jeremiah
					</h1>
					<p className="text-gray-500 text-sm sm:text-base font-medium">
						Here&apos;s what&apos;s happening with your projects today.
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
					{stats.map((stat) => (
						<div
							key={stat.label}
							className="bg-white border border-gray-200/90 rounded-2xl p-5 hover:border-blue-500/40 hover:shadow-xs transition-all duration-200 group">
							<div className="flex items-center justify-between mb-3">
								<div
									className={`w-9 h-9 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center transition-colors duration-200`}>
									<span className="material-symbols-outlined text-[18px]">
										{stat.icon}
									</span>
								</div>
							</div>
							<p className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 mb-0.5">
								{stat.value}
							</p>
							<p className="text-[11px] sm:text-xs text-gray-500 font-medium">
								{stat.label}
							</p>
							{stat.change && (
								<p
									className={`text-[10px] sm:text-[11px] mt-1.5 font-bold ${
										stat.changeType === "up"
											? "text-emerald-600"
											: stat.changeType === "down"
												? "text-red-500"
												: "text-gray-400"
									}`}>
									{stat.change}
								</p>
							)}
						</div>
					))}
				</div>

				{/* Projects Section */}
				<div className="mb-8 sm:mb-10">
					<div className="flex items-center justify-between mb-5">
						<h2 className="text-lg sm:text-xl font-bold font-nohemi text-gray-900">
							Your Projects
						</h2>
						<Link
							href="/get-started"
							className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 transition-colors duration-200">
							<span className="material-symbols-outlined text-[16px]">
								add
							</span>
							New Project
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
						{mockProjects.map((project) => (
							<ProjectCard key={project.name} {...project} />
						))}
					</div>
				</div>

				{/* Quick Actions */}
				<div className="mb-8 sm:mb-10">
					<h2 className="text-lg sm:text-xl font-bold font-nohemi text-gray-900 mb-5">
						Quick Actions
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
						{quickActions.map((action) => (
							<Link
								key={action.label}
								href={action.href}
								className="group bg-white border border-gray-200/90 rounded-2xl p-5 hover:border-blue-500/40 hover:shadow-xs transition-all duration-200 flex items-start gap-3.5">
								<div
									className={`w-10 h-10 rounded-xl ${action.bgColor} ${action.iconColor} flex items-center justify-center shrink-0 transition-colors duration-200`}>
									<span className="material-symbols-outlined text-[20px]">
										{action.icon}
									</span>
								</div>
								<div>
									<p className="text-sm font-bold text-gray-900 mb-0.5 group-hover:text-blue-600 transition-colors duration-200">
										{action.label}
									</p>
									<p className="text-[11px] text-gray-500 font-medium leading-relaxed">
										{action.description}
									</p>
								</div>
							</Link>
						))}
					</div>
				</div>

				{/* Recent Activity */}
				<div className="mb-8">
					<h2 className="text-lg sm:text-xl font-bold font-nohemi text-gray-900 mb-5">
						Recent Activity
					</h2>
					<div className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden">
						{[
							{
								icon: "check_circle",
								iconColor: "text-emerald-600",
								iconBg: "bg-emerald-50",
								message:
									"Content questionnaire submitted for My Business Page",
								time: "2 hours ago",
							},
							{
								icon: "palette",
								iconColor: "text-blue-600",
								iconBg: "bg-blue-50",
								message:
									"Design draft uploaded for Summer Launch Funnel",
								time: "1 day ago",
							},
							{
								icon: "person_add",
								iconColor: "text-purple-600",
								iconBg: "bg-purple-50",
								message: "Welcome! Your account was created",
								time: "3 days ago",
							},
						].map((activity, idx) => (
							<div
								key={idx}
								className={`flex items-center gap-4 px-5 py-4 ${
									idx !== 2
										? "border-b border-gray-100"
										: ""
								} hover:bg-gray-50/60 transition-colors duration-150`}>
								<div
									className={`w-8 h-8 rounded-lg ${activity.iconBg} ${activity.iconColor} flex items-center justify-center shrink-0`}>
									<span className="material-symbols-outlined text-[18px]">
										{activity.icon}
									</span>
								</div>
								<p className="text-sm font-medium text-gray-800 flex-1">
									{activity.message}
								</p>
								<span className="text-[11px] text-gray-400 font-medium shrink-0">
									{activity.time}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
