/** @format */

import React from "react";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/auth/admin";
import AdminDock from "@/components/admin/AdminDock";

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
			{/* Main Content Area (Navigation is powered exclusively by floating bottom AdminDock) */}
			<main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32">
				{children}
			</main>

			{/* Floating Bottom Dock Navigation */}
			<AdminDock />
		</div>
	);
}
