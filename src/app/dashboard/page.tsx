/** @format */

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PillButton from "@/components/PillButton";
import ProjectCard from "@/components/dashboard/ProjectCard";
import type { ProjectCardProps } from "@/components/dashboard/ProjectCard";
import {
	FolderOpen,
	Globe,
	Crown,
	Headset,
	PlusCircle,
	FileEdit,
	Palette,
	MessageSquare,
	X,
	Send,
	CheckCircle2,
	Clock,
	Sparkles,
} from "lucide-react";

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

export default function DashboardPage() {
	const router = useRouter();
	const [greeting, setGreeting] = useState("Good morning");
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isNotifOpen, setIsNotifOpen] = useState(false);
	const [isSupportOpen, setIsSupportOpen] = useState(false);
	const [supportMessage, setSupportMessage] = useState("");
	const [supportSent, setSupportSent] = useState(false);

	const notifRef = useRef<HTMLDivElement>(null);
	const profileRef = useRef<HTMLDivElement>(null);

	const [notifications, setNotifications] = useState([
		{
			id: "1",
			title: "Design Draft Ready",
			message: "A new design draft was uploaded for Summer Launch Funnel",
			time: "10 mins ago",
			type: "design",
			unread: true,
		},
		{
			id: "2",
			title: "Questionnaire Confirmed",
			message: "Content questionnaire confirmed for My Business Page",
			time: "2 hours ago",
			type: "content",
			unread: true,
		},
		{
			id: "3",
			title: "Welcome to Kiosk!",
			message: "Your account setup has been completed successfully",
			time: "2 days ago",
			type: "system",
			unread: false,
		},
	]);

	const unreadCount = notifications.filter((n) => n.unread).length;

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

	// Click outside listener for dropdowns
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				notifRef.current &&
				!notifRef.current.contains(event.target as Node)
			) {
				setIsNotifOpen(false);
			}
			if (
				profileRef.current &&
				!profileRef.current.contains(event.target as Node)
			) {
				setIsProfileOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleLogout = () => {
		setIsProfileOpen(false);
		router.push("/get-started");
	};

	const handleSendSupport = (e: React.FormEvent) => {
		e.preventDefault();
		if (!supportMessage.trim()) return;
		setSupportSent(true);
		setTimeout(() => {
			setSupportSent(false);
			setSupportMessage("");
			setIsSupportOpen(false);
		}, 2000);
	};

	return (
		<div className="w-full min-h-screen bg-[#f8fafc] relative pb-24">
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

				{/* Header Actions: Notifications & User Profile */}
				<div className="flex items-center gap-3">
					{/* Notifications Dropdown Container */}
					<div ref={notifRef} className="relative">
						<button
							type="button"
							aria-label="Notifications"
							onClick={() => {
								setIsNotifOpen(!isNotifOpen);
								setIsProfileOpen(false);
							}}
							className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 transition-colors duration-150 cursor-pointer">
							<span className="material-symbols-outlined text-[22px]">
								notifications
							</span>
							{unreadCount > 0 && (
								<span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-[#f8fafc]" />
							)}
						</button>

						{/* Notifications Dropdown Menu */}
						{isNotifOpen && (
							<div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-gray-200/90 rounded-2xl shadow-xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
								{/* Dropdown Header */}
								<div className="px-3.5 py-2.5 border-b border-gray-100 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<h3 className="text-xs font-bold text-gray-900 font-nohemi">
											Notifications
										</h3>
										{unreadCount > 0 && (
											<span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-extrabold">
												{unreadCount} New
											</span>
										)}
									</div>

									{unreadCount > 0 && (
										<button
											type="button"
											onClick={() => {
												setNotifications((prev) =>
													prev.map((n) => ({ ...n, unread: false })),
												);
											}}
											className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
											Mark all as read
										</button>
									)}
								</div>

								{/* Notification Items List */}
								<div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
									{notifications.map((n) => (
										<button
											key={n.id}
											type="button"
											onClick={() => {
												setNotifications((prev) =>
													prev.map((item) =>
														item.id === n.id
															? { ...item, unread: false }
															: item,
													),
												);
												setIsNotifOpen(false);
											}}
											className={`w-full text-left p-3.5 transition-colors duration-150 cursor-pointer ${
												n.unread
													? "bg-blue-50/40 hover:bg-blue-50/70"
													: "hover:bg-gray-50/70"
											}`}>
											<div className="flex items-center justify-between gap-2 mb-1">
												<p className="text-xs font-bold text-gray-900 truncate">
													{n.title}
												</p>
												<span className="text-[10px] text-gray-400 font-medium shrink-0">
													{n.time}
												</span>
											</div>
											<p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
												{n.message}
											</p>
										</button>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Profile Dropdown Container */}
					<div ref={profileRef} className="relative">
						<button
							type="button"
							onClick={() => {
								setIsProfileOpen(!isProfileOpen);
								setIsNotifOpen(false);
							}}
							className="flex items-center gap-2.5 p-1 sm:px-2 py-1 rounded-xl text-gray-800 hover:bg-gray-100/70 transition-colors duration-150 cursor-pointer">
							<div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-xs shrink-0">
								JV
							</div>
							<span className="hidden sm:inline text-xs font-bold text-gray-800">
								Jeremiah
							</span>
							<span className="material-symbols-outlined text-gray-400 text-[18px]">
								expand_more
							</span>
						</button>

						{/* Dropdown Menu */}
						{isProfileOpen && (
							<div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200/90 rounded-2xl shadow-lg z-50 p-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
									{/* User Info Header */}
									<div className="px-3 py-2.5 border-b border-gray-100 mb-1">
										<p className="text-xs font-bold text-gray-900 leading-snug">
											Jeremiah Victor
										</p>
										<p className="text-[11px] text-gray-400 truncate mt-0.5 font-medium">
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
											className="w-full flex items-center px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 transition-colors duration-150 cursor-pointer">
											<span>Account Settings</span>
										</button>

										<button
											type="button"
											onClick={() => {
												setIsProfileOpen(false);
												router.push("/dashboard/billing");
											}}
											className="w-full flex items-center px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 transition-colors duration-150 cursor-pointer">
											<span>Billing & Plan</span>
										</button>
									</div>

									{/* Log Out Button */}
									<div className="border-t border-gray-100 mt-1 pt-1">
										<button
											type="button"
											onClick={handleLogout}
											className="w-full flex items-center px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer">
											<span>Log Out</span>
										</button>
									</div>
								</div>
						)}
					</div>
				</div>
			</header>

			{/* Main Dashboard Container */}
			<div className="px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 max-w-[1400px] mx-auto">
				{/* Top Greeting Header */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 tracking-tight">
							{greeting}, Jeremiah
						</h1>
						<p className="text-gray-500 text-sm font-medium mt-1">
							Here&apos;s what&apos;s happening with your website projects today.
						</p>
					</div>

					<PillButton
						href="/dashboard/projects/new"
						baseColor="#004ac6"
						circleColor="#ffffff"
						textColor="#ffffff"
						hoverTextColor="#004ac6"
						useThunderFont={true}
						className="px-6 py-2.5 text-xs font-bold border border-blue-600 shadow-sm self-start sm:self-auto">
						+ New Project
					</PillButton>
				</div>

				{/* BENTO STYLE GRID LAYOUT */}
				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
					{/* BENTO TILE 1: Welcome & Active Project Summary Banner (Span 2 cols on MD/LG) */}
					<div className="md:col-span-2 lg:col-span-2 bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-blue-500/40 transition-all duration-200 shadow-2xs">
						<div>
							<div className="inline-flex items-center gap-2 text-blue-600 text-[11px] font-extrabold uppercase tracking-wider mb-4">
								<span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
								<span>Active Workspace</span>
							</div>

							<h2 className="text-xl sm:text-2xl font-bold font-nohemi text-gray-900 mb-2">
								My Business Page
							</h2>
							<p className="text-xs text-gray-500 font-medium mb-6 max-w-md leading-relaxed">
								Your landing page project is currently 65% complete. Our team is personalizing your content and layout.
							</p>

							{/* Progress Bar */}
							<div className="space-y-1.5 mb-6">
								<div className="flex justify-between text-xs font-bold text-gray-700">
									<span>Build Progress</span>
									<span>65%</span>
								</div>
								<div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
									<div className="h-full bg-blue-600 rounded-full w-[65%]" />
								</div>
							</div>
						</div>

						<div className="pt-4 border-t border-gray-100 flex items-center justify-between">
							<span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
								<Clock className="w-3.5 h-3.5" />
								Updated 2 hours ago
							</span>
							<Link
								href="/dashboard/projects"
								className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
								View Details →
							</Link>
						</div>
					</div>

					{/* BENTO TILE 2: Quick Metrics Grid (Span 1 col) */}
					<div className="grid grid-cols-2 md:grid-cols-1 gap-4">
						{/* Metric 1 */}
						<div className="bg-white border border-gray-200/90 rounded-3xl p-5 flex flex-col justify-between hover:border-blue-500/40 transition-all duration-200 shadow-2xs">
							<div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
								<FolderOpen className="w-4 h-4" />
							</div>
							<div>
								<p className="text-2xl font-bold font-nohemi text-gray-900">
									2
								</p>
								<p className="text-xs text-gray-500 font-medium">
									Active Projects
								</p>
							</div>
						</div>

						{/* Metric 2 */}
						<div className="bg-white border border-gray-200/90 rounded-3xl p-5 flex flex-col justify-between hover:border-blue-500/40 transition-all duration-200 shadow-2xs">
							<div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
								<Globe className="w-4 h-4" />
							</div>
							<div>
								<p className="text-2xl font-bold font-nohemi text-gray-900">
									1
								</p>
								<p className="text-xs text-gray-500 font-medium">
									Live Website
								</p>
							</div>
						</div>
					</div>

					{/* BENTO TILE 3: Current Plan & Upgrade Tile (Span 1 col) */}
					<div className="bg-white border border-gray-200/90 rounded-3xl p-6 flex flex-col justify-between hover:border-blue-500/40 transition-all duration-200 shadow-2xs">
						<div>
							<div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
								<Crown className="w-4 h-4" />
							</div>
							<h3 className="text-base font-bold font-nohemi text-gray-900 mb-1">
								Free Plan
							</h3>
							<p className="text-xs text-gray-500 font-medium mb-4">
								Upgrade to launch custom sales funnels & e-commerce stores.
							</p>
						</div>

						<PillButton
							href="/dashboard/billing"
							baseColor="#ffffff"
							circleColor="#004ac6"
							textColor="#004ac6"
							hoverTextColor="#ffffff"
							useThunderFont={true}
							className="w-full py-2.5 text-xs font-bold border border-blue-600">
							Upgrade Plan
						</PillButton>
					</div>

					{/* BENTO TILE 4: Active Projects Grid (Span 2 cols on LG) */}
					<div className="lg:col-span-2 bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 hover:border-blue-500/40 transition-all duration-200 shadow-2xs">
						<div className="flex items-center justify-between mb-5">
							<h3 className="text-lg font-bold font-nohemi text-gray-900">
								Your Projects
							</h3>
							<Link
								href="/dashboard/projects"
								className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
								View All ({mockProjects.length}) →
							</Link>
						</div>

						<div className="space-y-3">
							{mockProjects.slice(0, 2).map((project) => (
								<div
									key={project.name}
									className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/70 flex items-center justify-between gap-4">
									<div>
										<h4 className="text-sm font-bold text-gray-900">
											{project.name}
										</h4>
										<p className="text-[11px] text-gray-500 font-medium">
											{project.type} • Updated {project.lastUpdated}
										</p>
									</div>
									<span className="text-xs font-bold text-blue-600 bg-white px-3 py-1 rounded-full border border-gray-200/80">
										{project.progress}%
									</span>
								</div>
							))}
						</div>
					</div>

					{/* BENTO TILE 5: Quick Actions & Shortcut Tools (Span 2 cols on LG) */}
					<div className="lg:col-span-2 bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 hover:border-blue-500/40 transition-all duration-200 shadow-2xs">
						<h3 className="text-lg font-bold font-nohemi text-gray-900 mb-5">
							Quick Actions
						</h3>

						<div className="grid grid-cols-2 gap-3">
							<Link
								href="/dashboard/projects/new"
								className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 hover:bg-blue-50 transition-colors flex items-center gap-3 group">
								<PlusCircle className="w-5 h-5 text-blue-600 shrink-0" />
								<div>
									<p className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
										New Project
									</p>
									<p className="text-[10px] text-gray-500 font-medium">
										Start a new build
									</p>
								</div>
							</Link>

							<Link
								href="/dashboard/settings"
								className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:bg-emerald-50 transition-colors flex items-center gap-3 group">
								<FileEdit className="w-5 h-5 text-emerald-600 shrink-0" />
								<div>
									<p className="text-xs font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
										Submit Copy
									</p>
									<p className="text-[10px] text-gray-500 font-medium">
										Upload content
									</p>
								</div>
							</Link>

							<Link
								href="/dashboard/projects"
								className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 hover:bg-purple-50 transition-colors flex items-center gap-3 group">
								<Palette className="w-5 h-5 text-purple-600 shrink-0" />
								<div>
									<p className="text-xs font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
										Templates
									</p>
									<p className="text-[10px] text-gray-500 font-medium">
										Browse designs
									</p>
								</div>
							</Link>

							<button
								type="button"
								onClick={() => setIsSupportOpen(true)}
								className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 hover:bg-amber-50 transition-colors flex items-center gap-3 text-left group cursor-pointer">
								<MessageSquare className="w-5 h-5 text-amber-600 shrink-0" />
								<div>
									<p className="text-xs font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
										Get Support
									</p>
									<p className="text-[10px] text-gray-500 font-medium">
										Chat with team
									</p>
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* FLOATING CONTACT SUPPORT BUTTON (Fixed Bottom Right - Icon Only PillButton) */}
			<div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40">
				<PillButton
					type="button"
					onClick={() => setIsSupportOpen(!isSupportOpen)}
					aria-label="Contact Support"
					baseColor="#004ac6"
					circleColor="#ffffff"
					textColor="#ffffff"
					hoverTextColor="#004ac6"
					useThunderFont={true}
					className="w-13 h-13 rounded-full flex items-center justify-center border border-blue-600 shadow-xl p-0">
					<Headset className="w-5 h-5 shrink-0" />
				</PillButton>
			</div>

			{/* CONTACT SUPPORT MODAL POPUP */}
			{isSupportOpen && (
				<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
					<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
						<button
							type="button"
							onClick={() => setIsSupportOpen(false)}
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
							<X className="w-5 h-5" />
						</button>

						<div className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
								<Headset className="w-5 h-5" />
							</div>
							<div>
								<h3 className="text-base font-bold font-nohemi text-gray-900">
									Contact Support
								</h3>
								<p className="text-xs text-gray-500 font-medium">
									We usually respond in under 15 minutes.
								</p>
							</div>
						</div>

						{supportSent ? (
							<div className="py-8 text-center space-y-3">
								<CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-in zoom-in-75 duration-200" />
								<h4 className="text-sm font-bold text-gray-900">
									Message Sent!
								</h4>
								<p className="text-xs text-gray-500 font-medium">
									Our dedicated support team has received your message and will reply shortly.
								</p>
							</div>
						) : (
							<form onSubmit={handleSendSupport} className="space-y-4">
								<div>
									<label className="block text-xs font-semibold text-gray-700 mb-1.5">
										How can we help you today?
									</label>
									<textarea
										rows={4}
										required
										placeholder="Describe your question or website issue..."
										value={supportMessage}
										onChange={(e) => setSupportMessage(e.target.value)}
										className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
									/>
								</div>

								<div className="flex items-center justify-end gap-2 pt-2">
									<button
										type="button"
										onClick={() => setIsSupportOpen(false)}
										className="px-4 py-2.5 rounded-full border border-gray-200/90 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer">
										Cancel
									</button>

									<button
										type="submit"
										className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-xs">
										<Send className="w-3.5 h-3.5" />
										<span>Send Message</span>
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
