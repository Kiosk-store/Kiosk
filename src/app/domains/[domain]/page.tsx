/** @format */

import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/db";
import { tenants, projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import TenantLiveSite from "@/components/tenant/TenantLiveSite";
import type { TenantContentData } from "@/components/tenant/TenantLiveSite";
import Link from "next/link";
import { Globe, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{
		domain: string;
	}>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { domain } = await params;
	const cleanDomain = domain.toLowerCase().trim();

	const tenant = await db.query.tenants.findFirst({
		where: eq(tenants.customDomain, cleanDomain),
	});

	if (!tenant) {
		return { title: "Domain Not Configured | Kiosk" };
	}

	const project = await db.query.projects.findFirst({
		where: eq(projects.tenantId, tenant.id),
	});

	let parsed: TenantContentData = {};
	if (project?.content) {
		try {
			parsed = JSON.parse(project.content);
		} catch (e) {}
	}

	const businessName = parsed.businessName || tenant.name || "Business Website";
	const tagline = parsed.tagline || "Official Online Store & Services";

	return {
		title: `${businessName} | ${tagline}`,
		description: parsed.aboutText || tagline,
		openGraph: {
			title: businessName,
			description: tagline,
			images: parsed.logoImage?.url ? [parsed.logoImage.url] : [],
		},
	};
}

export default async function CustomDomainPage({ params }: PageProps) {
	const { domain } = await params;
	const cleanDomain = domain.toLowerCase().trim();

	// 1. Fetch Tenant matching customDomain
	const tenant = await db.query.tenants.findFirst({
		where: eq(tenants.customDomain, cleanDomain),
	});

	if (!tenant) {
		return (
			<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
				<div className="max-w-md w-full bg-white border border-gray-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
					<div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
						<Globe className="w-6 h-6" />
					</div>
					<h2 className="text-xl font-bold text-gray-900">Domain Not Connected</h2>
					<p className="text-xs text-gray-500">
						The domain <code className="font-bold text-gray-700">{cleanDomain}</code> is not connected to an active Kiosk website.
					</p>
					<Link
						href="https://kioosk.online"
						className="inline-block px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors">
						Connect Domain on Kiosk
					</Link>
				</div>
			</div>
		);
	}

	// 2. Fetch Project & Content
	const project = await db.query.projects.findFirst({
		where: eq(projects.tenantId, tenant.id),
	});

	let parsedContent: TenantContentData = {};
	if (project?.content) {
		try {
			parsedContent = JSON.parse(project.content);
		} catch (e) {}
	}

	const isLive = project?.status === "Live" || project?.status === "Published";

	if (!isLive) {
		const businessName = parsedContent.businessName || tenant.name;
		return (
			<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
				<div className="max-w-lg w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl">
					<div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
						<Sparkles className="w-7 h-7" />
					</div>

					<div className="space-y-2">
						<span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
							Under Construction
						</span>
						<h1 className="text-2xl sm:text-3xl font-extrabold font-nohemi tracking-tight">
							{businessName}
						</h1>
						<p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
							We are currently preparing our official website and offerings. Check back very soon!
						</p>
					</div>

					<div className="pt-4 border-t border-slate-700 text-[11px] text-slate-500">
						<span>Powered by </span>
						<a href="https://kioosk.online" className="text-blue-400 hover:underline">
							Kiosk
						</a>
					</div>
				</div>
			</div>
		);
	}

	return (
		<TenantLiveSite
			tenantSlug={tenant.slug}
			plan={tenant.plan}
			content={parsedContent}
			publishedUrl={`https://${cleanDomain}`}
		/>
	);
}
