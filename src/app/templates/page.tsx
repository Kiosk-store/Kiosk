/** @format */

"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Globe, Zap, ShoppingBag, Briefcase, Utensils, UserCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

const TEMPLATE_CATEGORIES = [
	{
		id: "landing-page",
		title: "Landing Page Template",
		folderName: "landing-page",
		icon: Globe,
		tag: "Tier 01",
		desc: "High-converting single-page website template built for rapid lead capture, local business handles, and service showcases.",
		href: "/templates/landing-page",
		features: [
			"Hero Banner with direct CTA",
			"Interactive Services & About Grid",
			"Customer Social Proof & Reviews",
			"WhatsApp & Lead Intake Form",
		],
		badgeColor: "bg-blue-50 text-blue-600 border-blue-100",
	},
	{
		id: "sales-funnel",
		title: "Sales Funnel Template",
		folderName: "sales-funnel",
		icon: Zap,
		tag: "Tier 02",
		desc: "Multi-step conversion funnel engineered for ad campaigns, lead magnet opt-ins, VSL presentations, and offer upsells.",
		href: "/templates/sales-funnel",
		features: [
			"Opt-in Lead Magnet Gate",
			"Video Sales Letter (VSL) Section",
			"Order Bump & Urgency Timers",
			"Thank You & Next Steps Page",
		],
		badgeColor: "bg-purple-50 text-purple-600 border-purple-100",
	},
	{
		id: "ecommerce",
		title: "E-Commerce Storefront Template",
		folderName: "ecommerce",
		icon: ShoppingBag,
		tag: "Tier 03",
		desc: "Complete digital storefront with product catalog grid, slide-out shopping cart drawer, and payment checkout integration.",
		href: "/templates/ecommerce",
		features: [
			"Product Catalog & Category Filters",
			"Interactive Slide-Out Cart Drawer",
			"Instant Gateway Checkout Flow",
			"Order Receipt & Status Confirmation",
		],
		badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
	},
	{
		id: "agency",
		title: "Creative Agency Showcase",
		folderName: "agency",
		icon: Briefcase,
		tag: "Preset 04",
		desc: "Visual portfolio showcase with case study filters, interactive scope calculator, and client intake brief form.",
		href: "/templates/agency",
		features: [
			"Filterable Portfolio Case Studies",
			"Interactive Scope & Cost Estimator",
			"Client Intake Brief Form",
			"Services & Authority Badges",
		],
		badgeColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
	},
	{
		id: "restaurant",
		title: "Local Restaurant & Bistro",
		folderName: "restaurant",
		icon: Utensils,
		tag: "Preset 05",
		desc: "Culinary dining template with categorized food menu tab switcher, table reservation modal, and WhatsApp ordering.",
		href: "/templates/restaurant",
		features: [
			"Categorized Food Menu Tabs",
			"Table Reservation Widget",
			"Direct WhatsApp Order Trigger",
			"Operating Hours & Location Card",
		],
		badgeColor: "bg-amber-50 text-amber-600 border-amber-100",
	},
	{
		id: "consulting",
		title: "Professional Services & Consulting",
		folderName: "consulting",
		icon: UserCheck,
		tag: "Preset 06",
		desc: "Executive advisory profile with transparent service retainer packages, calendar scheduling simulator, and proof stack.",
		href: "/templates/consulting",
		features: [
			"Consultant Authority Profile",
			"Transparent Retainer Packages",
			"Interactive Booking Calendar",
			"Verified Client Rating Stack",
		],
		badgeColor: "bg-teal-50 text-teal-600 border-teal-100",
	},
];

export default function TemplatesDirectoryPage() {
	return (
		<main className="min-h-screen bg-slate-50 flex flex-col font-sans">
			<Navbar />

			<div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1 space-y-12">
				{/* Header */}
				<div className="text-center max-w-3xl mx-auto space-y-4">
					<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
						<span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
						<span>Template Repository</span>
					</div>
					<h1 className="text-3xl sm:text-5xl font-bold font-nohemi text-slate-900 tracking-tight">
						Master Template Library
					</h1>
					<p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
						Explore our 6 production website templates stored inside <code className="text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded">src/app/templates</code>.
					</p>
				</div>

				{/* Template Cards Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{TEMPLATE_CATEGORIES.map((cat) => {
						const Icon = cat.icon;

						return (
							<div
								key={cat.id}
								className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
								<div className="space-y-5">
									<div className="flex items-center justify-between">
										<div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border ${cat.badgeColor}`}>
											<Icon className="w-6 h-6" />
										</div>
										<span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${cat.badgeColor}`}>
											{cat.tag}
										</span>
									</div>

									<div>
										<h2 className="text-xl font-bold font-nohemi text-slate-900 group-hover:text-blue-600 transition-colors">
											{cat.title}
										</h2>
										<p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">
											{cat.desc}
										</p>
									</div>

									<div className="pt-4 border-t border-slate-100 space-y-2">
										<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
											Template Modules
										</p>
										{cat.features.map((f) => (
											<div key={f} className="flex items-center gap-2 text-xs font-medium text-slate-700">
												<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
												<span>{f}</span>
											</div>
										))}
									</div>
								</div>

								<div className="pt-6 mt-6 border-t border-slate-100">
									<Link
										href={cat.href}
										className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs">
										<span>Preview {cat.title}</span>
										<ArrowRight className="w-4 h-4" />
									</Link>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<Footer />
		</main>
	);
}
