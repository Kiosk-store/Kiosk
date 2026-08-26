/** @format */

import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/auth/admin";
import {
	LayoutDashboard,
	Layers,
	Users,
	Receipt,
	ArrowLeft,
	ShieldCheck,
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

	if (!adminUser) {
		redirect("/dashboard");
	}

	return (
		<div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
			{/* Top Admin Command Header */}
			<header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<div className="flex items-center gap-6">
						<Link href="/admin" className="flex items-center gap-2.5 group">
							<div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
								K
							</div>
							<div>
								<div className="flex items-center gap-2">
									<span className="font-extrabold font-nohemi text-base tracking-tight text-white">
										KIOSK
									</span>
									<span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
										ADMIN
									</span>
								</div>
								<p className="text-[10px] text-slate-400 font-medium">
									Operations & Fulfillment Hub
								</p>
							</div>
						</Link>

						{/* Desktop Admin Nav Links */}
						<nav className="hidden md:flex items-center gap-1 pl-6 border-l border-slate-800 text-xs font-bold">
							<Link
								href="/admin"
								className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2">
								<LayoutDashboard className="w-3.5 h-3.5" />
								<span>Dashboard</span>
							</Link>
							<Link
								href="/admin/projects"
								className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2">
								<Layers className="w-3.5 h-3.5 text-blue-400" />
								<span>Fulfillment Queue</span>
							</Link>
							<Link
								href="/admin/users"
								className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2">
								<Users className="w-3.5 h-3.5" />
								<span>Users & Tenants</span>
							</Link>
							<Link
								href="/admin/billing"
								className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2">
								<Receipt className="w-3.5 h-3.5" />
								<span>Billing & Invoices</span>
							</Link>
						</nav>
					</div>

					<div className="flex items-center gap-3">
						<Link
							href="/dashboard"
							className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors">
							<ArrowLeft className="w-3.5 h-3.5" />
							<span>Customer Dashboard</span>
						</Link>

						<div className="flex items-center gap-2 pl-3 border-l border-slate-800">
							<div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
								{adminUser.name ? adminUser.name.charAt(0).toUpperCase() : "A"}
							</div>
							<div className="hidden lg:block text-left">
								<p className="text-xs font-bold text-slate-200 leading-tight">
									{adminUser.name || "Administrator"}
								</p>
								<p className="text-[10px] text-slate-400 leading-tight">
									{adminUser.email}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Mobile Navigation Sub-Bar */}
				<div className="md:hidden flex items-center justify-around border-t border-slate-800 py-2 px-2 text-[11px] font-bold overflow-x-auto">
					<Link
						href="/admin"
						className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white flex items-center gap-1">
						<LayoutDashboard className="w-3 h-3" />
						<span>Overview</span>
					</Link>
					<Link
						href="/admin/projects"
						className="px-2.5 py-1 rounded-lg text-blue-400 font-extrabold flex items-center gap-1">
						<Layers className="w-3 h-3" />
						<span>Queue</span>
					</Link>
					<Link
						href="/admin/users"
						className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white flex items-center gap-1">
						<Users className="w-3 h-3" />
						<span>Users</span>
					</Link>
					<Link
						href="/admin/billing"
						className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white flex items-center gap-1">
						<Receipt className="w-3 h-3" />
						<span>Billing</span>
					</Link>
				</div>
			</header>

			{/* Main Admin Content Container */}
			<main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{children}
			</main>
		</div>
	);
}
