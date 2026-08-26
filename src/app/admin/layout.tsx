/** @format */

import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/auth/admin";
import AdminDock from "@/components/admin/AdminDock";
import {
	LayoutDashboard,
	Layers,
	Users,
	Receipt,
	ArrowLeft,
	ShieldAlert,
	Sparkles,
	Globe,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const adminUser = await getAuthenticatedAdmin();

	// Strict Auth Guard: If not an admin, redirect to customer dashboard
	if (!adminUser) {
		redirect("/dashboard");
	}

	return (
		<div className="relative min-h-screen bg-[#f1f5f9] text-slate-900 flex flex-col">
			{/* Top Kiosk Admin Header */}
			<header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-2xs">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<div className="flex items-center gap-6">
						<Link href="/admin" className="flex items-center gap-2.5 group">
							<div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
								K
							</div>
							<div>
								<div className="flex items-center gap-2">
									<span className="font-extrabold font-nohemi text-base tracking-tight text-gray-900">
										KIOSK
									</span>
									<span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
										ADMIN
									</span>
								</div>
								<p className="text-[10px] text-gray-400 font-medium">
									Operations & Fulfillment Center
								</p>
							</div>
						</Link>

						{/* Desktop Admin Header Pill Nav Links */}
						<nav className="hidden md:flex items-center gap-1.5 pl-6 border-l border-gray-200 text-xs font-bold">
							<Link
								href="/admin"
								className="px-3.5 py-1.5 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1.5">
								<LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
								<span>Hub</span>
							</Link>
							<Link
								href="/admin/projects"
								className="px-3.5 py-1.5 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1.5">
								<Layers className="w-3.5 h-3.5 text-indigo-600" />
								<span>Queue</span>
							</Link>
							<Link
								href="/admin/users"
								className="px-3.5 py-1.5 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1.5">
								<Users className="w-3.5 h-3.5 text-emerald-600" />
								<span>Users</span>
							</Link>
							<Link
								href="/admin/billing"
								className="px-3.5 py-1.5 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1.5">
								<Receipt className="w-3.5 h-3.5 text-purple-600" />
								<span>Billing</span>
							</Link>
						</nav>
					</div>

					<div className="flex items-center gap-3">
						<Link
							href="/dashboard"
							className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold border border-gray-200/80 transition-colors">
							<ArrowLeft className="w-3.5 h-3.5" />
							<span className="hidden sm:inline">Customer Dashboard</span>
							<span className="sm:hidden">App</span>
						</Link>

						<div className="flex items-center gap-2 pl-3 border-l border-gray-200">
							<div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
								{adminUser.name ? adminUser.name.charAt(0).toUpperCase() : "A"}
							</div>
							<div className="hidden lg:block text-left">
								<p className="text-xs font-bold text-gray-900 leading-tight">
									{adminUser.name || "Administrator"}
								</p>
								<p className="text-[10px] text-gray-400 leading-tight">
									{adminUser.email}
								</p>
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content Area (with pb-28 for floating dock) */}
			<main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28">
				{children}
			</main>

			{/* Floating Dock Navigation */}
			<AdminDock />
		</div>
	);
}
