/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PillButton from "@/components/PillButton";
import {
	Globe,
	Zap,
	ShoppingBag,
	Briefcase,
	Utensils,
	UserCheck,
	Eye,
	CheckCircle2,
	X,
	Sparkles,
	Search,
	ArrowRight,
	Layers,
	ExternalLink,
} from "lucide-react";

export interface MasterTemplate {
	id: string;
	title: string;
	folderName: string;
	tier: "Landing Page" | "Sales Funnel" | "E-commerce Store" | "Agency" | "Restaurant" | "Consulting";
	tag: string;
	icon: React.ElementType;
	description: string;
	href: string;
	delivery: string;
	plan: "LANDING_PAGE" | "SALES_FUNNEL" | "E_COMMERCE";
	badgeColor: string;
	previewBg: string;
	previewTextColor: string;
	features: string[];
	industry: string;
}

export const MASTER_TEMPLATES: MasterTemplate[] = [
	{
		id: "landing-page",
		title: "Landing Page Template",
		folderName: "landing-page",
		tier: "Landing Page",
		tag: "Tier 01",
		icon: Globe,
		description:
			"High-converting single-page website template built for rapid lead capture, local business handles, and service showcases.",
		href: "/templates/landing-page",
		delivery: "3-5 Days",
		plan: "LANDING_PAGE",
		badgeColor: "bg-blue-50 text-blue-600 border-blue-200",
		previewBg: "bg-blue-950",
		previewTextColor: "text-blue-200",
		industry: "Lead Generation & Services",
		features: [
			"Hero banner with direct call-to-action",
			"Interactive services & about showcase",
			"Customer reviews & social proof rating",
			"WhatsApp & instant lead capture form",
		],
	},
	{
		id: "sales-funnel",
		title: "Sales Funnel Template",
		folderName: "sales-funnel",
		tier: "Sales Funnel",
		tag: "Tier 02",
		icon: Zap,
		description:
			"Multi-step conversion funnel engineered for marketing campaigns, lead magnet opt-ins, VSL presentations, and offer upsells.",
		href: "/templates/sales-funnel",
		delivery: "3-5 Days",
		plan: "SALES_FUNNEL",
		badgeColor: "bg-purple-50 text-purple-600 border-purple-200",
		previewBg: "bg-purple-950",
		previewTextColor: "text-purple-200",
		industry: "Digital Offers & Conversions",
		features: [
			"Opt-in lead magnet gate & video sales letter",
			"Order bump & urgency timer badges",
			"Thank you & onboarding next steps flow",
			"Meta Pixel & Google Analytics integration",
		],
	},
	{
		id: "ecommerce",
		title: "E-Commerce Storefront Template",
		folderName: "ecommerce",
		tier: "E-commerce Store",
		tag: "Tier 03",
		icon: ShoppingBag,
		description:
			"Complete digital storefront with product catalog grid, category filter tabs, slide-out shopping cart drawer, and multi-channel checkout.",
		href: "/templates/ecommerce",
		delivery: "5-10 Days",
		plan: "E_COMMERCE",
		badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
		previewBg: "bg-emerald-950",
		previewTextColor: "text-emerald-200",
		industry: "E-commerce & Retail",
		features: [
			"Interactive product catalog & category filters",
			"Slide-out dynamic cart drawer widget",
			"Card, Transfer, USSD & Mobile Money gateways",
			"Order receipt & instant confirmation emails",
		],
	},
	{
		id: "agency",
		title: "Creative Agency Showcase",
		folderName: "agency",
		tier: "Agency",
		tag: "Preset 04",
		icon: Briefcase,
		description:
			"Visual portfolio showcase for creative agencies and branding studios with filterable case studies, scope calculator, and client intake brief.",
		href: "/templates/agency",
		delivery: "3-5 Days",
		plan: "LANDING_PAGE",
		badgeColor: "bg-indigo-50 text-indigo-600 border-indigo-200",
		previewBg: "bg-slate-900",
		previewTextColor: "text-indigo-200",
		industry: "Design & Creative Agencies",
		features: [
			"Filterable portfolio case study grid",
			"Interactive scope & cost estimator",
			"Client project intake brief form",
			"Authority badges & services stack",
		],
	},
	{
		id: "restaurant",
		title: "Local Restaurant & Bistro",
		folderName: "restaurant",
		tier: "Restaurant",
		tag: "Preset 05",
		icon: Utensils,
		description:
			"Culinary dining template with categorized food & drink menu tab switcher, table reservation modal, operating hours card, and WhatsApp ordering.",
		href: "/templates/restaurant",
		delivery: "3-5 Days",
		plan: "LANDING_PAGE",
		badgeColor: "bg-amber-50 text-amber-600 border-amber-200",
		previewBg: "bg-stone-900",
		previewTextColor: "text-amber-200",
		industry: "Food, Cafe & Hospitality",
		features: [
			"Categorized food & drink menu tabs",
			"Table reservation modal widget",
			"Instant WhatsApp direct order trigger",
			"Interactive Google Maps & hours card",
		],
	},
	{
		id: "consulting",
		title: "Professional Services & Consulting",
		folderName: "consulting",
		tier: "Consulting",
		tag: "Preset 06",
		icon: UserCheck,
		description:
			"Executive advisory profile with transparent service retainer packages, interactive calendar scheduling simulator, and verified proof stack.",
		href: "/templates/consulting",
		delivery: "3-5 Days",
		plan: "LANDING_PAGE",
		badgeColor: "bg-teal-50 text-teal-600 border-teal-200",
		previewBg: "bg-teal-950",
		previewTextColor: "text-teal-200",
		industry: "Finance, Legal & Consulting",
		features: [
			"Consultant authority profile & biography",
			"Transparent monthly retainer packages",
			"Interactive booking calendar simulator",
			"Verified client ratings & proof stack",
		],
	},
];

export default function TemplatesPage() {
	const router = useRouter();
	const [activeCategory, setActiveCategory] = useState<string>("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTemplate, setSelectedTemplate] = useState<MasterTemplate | null>(null);

	const categories = [
		"All",
		"Landing Page",
		"Sales Funnel",
		"E-commerce Store",
		"Agency",
		"Restaurant",
		"Consulting",
	];

	const filteredTemplates = MASTER_TEMPLATES.filter((tpl) => {
		const matchesCategory =
			activeCategory === "All" || tpl.tier === activeCategory;
		const matchesSearch =
			tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			tpl.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
			tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			tpl.folderName.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	return (
		<div className="w-full min-h-screen bg-[#f8fafc]">
			{/* Main Container */}
			<div className="px-4 sm:px-6 lg:px-8 pt-10 pb-28 max-w-[1400px] mx-auto">
				{/* Page Header */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/80 mb-8">
					<div>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-extrabold uppercase tracking-wider mb-3">
							<Sparkles className="w-3.5 h-3.5" />
							<span>Templates Folder Repository</span>
						</div>
						<h1 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 tracking-tight mb-1">
							Production Website Templates
						</h1>
						<p className="text-gray-500 text-sm font-medium">
							Explore the 6 production-ready website templates in your <code className="text-blue-600 font-mono bg-blue-50 px-1.5 py-0.5 rounded text-xs">src/app/templates</code> directory.
						</p>
					</div>

					<div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
						<Link
							href="/templates"
							className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors shadow-xs">
							<Layers className="w-3.5 h-3.5" />
							<span>Master Library View</span>
						</Link>

						<PillButton
							href="/dashboard/projects/new"
							baseColor="#004ac6"
							circleColor="#ffffff"
							textColor="#ffffff"
							hoverTextColor="#004ac6"
							useThunderFont={true}
							className="px-6 py-2.5 text-xs font-bold border border-blue-600 shadow-sm">
							+ Start New Build
						</PillButton>
					</div>
				</div>

				{/* Filter & Search Bar */}
				<div className="space-y-4 mb-8">
					{/* Category Tabs */}
					<div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
						<span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 shrink-0">
							Template:
						</span>
						{categories.map((cat) => (
							<button
								key={cat}
								type="button"
								onClick={() => setActiveCategory(cat)}
								className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
									activeCategory === cat
										? "bg-blue-600 text-white shadow-xs"
										: "bg-white text-gray-600 hover:bg-gray-100/80 border border-gray-200/80"
								}`}>
								{cat}
							</button>
						))}
					</div>

					{/* Search Bar */}
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="text-xs text-gray-500 font-medium">
							Showing <strong>{filteredTemplates.length}</strong> of <strong>6</strong> templates from <code className="text-gray-700 font-mono">templates/</code>
						</div>

						<div className="relative w-full sm:w-72">
							<Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
							<input
								type="text"
								placeholder="Search templates, features..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200/90 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 transition-colors shadow-2xs"
							/>
						</div>
					</div>
				</div>

				{/* Templates Cards Grid (6 Templates from templates folder) */}
				{filteredTemplates.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
						{filteredTemplates.map((tpl) => {
							const Icon = tpl.icon;

							return (
								<div
									key={tpl.id}
									className="bg-white border border-gray-200/90 rounded-3xl overflow-hidden hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
									{/* Card Top Preview Banner */}
									<div>
										<Link
											href={tpl.href}
											className={`p-6 ${tpl.previewBg} min-h-[170px] flex flex-col justify-between relative block cursor-pointer group/header`}>
											<div className="flex items-center justify-between">
												<div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border ${tpl.badgeColor}`}>
													<Icon className="w-5 h-5" />
												</div>
												<span
													className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border ${tpl.badgeColor}`}>
													{tpl.tag}
												</span>
											</div>

											<div>
												<span className="text-[10px] uppercase font-bold tracking-widest text-white/60 block mb-1">
													Folder: templates/{tpl.folderName}
												</span>
												<h3 className="text-lg font-bold font-nohemi text-white leading-snug group-hover/header:text-blue-300 transition-colors flex items-center justify-between">
													<span>{tpl.title}</span>
													<ArrowRight className="w-4 h-4 opacity-0 group-hover/header:opacity-100 transition-opacity" />
												</h3>
											</div>
										</Link>

										{/* Body Information */}
										<div className="p-6">
											<div className="flex items-center gap-2 mb-3">
												<span className="text-[11px] font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full">
													{tpl.industry}
												</span>
												<span className="text-[11px] font-medium text-gray-400">
													Ready in {tpl.delivery}
												</span>
											</div>

											<p className="text-xs text-gray-500 font-medium mb-5 leading-relaxed">
												{tpl.description}
											</p>

											{/* Key Features Modules */}
											<div className="space-y-2 pt-3 border-t border-gray-100">
												<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
													Included Pages & Modules
												</p>
												{tpl.features.map((feat) => (
													<div
														key={feat}
														className="flex items-center gap-2 text-xs text-gray-700 font-medium">
														<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
														<span className="truncate">{feat}</span>
													</div>
												))}
											</div>
										</div>
									</div>

									{/* Action Footer */}
									<div className="p-6 pt-0 flex items-center gap-2 border-t border-gray-100/80 pt-4 mt-2">
										<Link
											href={tpl.href}
											className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 text-center shadow-2xs">
											<Eye className="w-3.5 h-3.5 text-gray-500" />
											<span>Live Page Demo</span>
										</Link>

										<button
											type="button"
											onClick={() => router.push(`/checkout?plan=${tpl.plan.toLowerCase().replace(/_/g, "-")}&billing=monthly`)}
											className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs">
											<span>Order Site</span>
											<ArrowRight className="w-3.5 h-3.5" />
										</button>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					/* Empty State */
					<div className="bg-white border border-gray-200/90 rounded-3xl p-12 text-center max-w-md mx-auto">
						<div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
							<Search className="w-6 h-6" />
						</div>
						<h3 className="text-base font-bold font-nohemi text-gray-900 mb-1">
							No templates found
						</h3>
						<p className="text-xs text-gray-500 mb-6">
							No templates in <code className="font-mono text-gray-700">templates/</code> matched your search query.
						</p>
						<button
							type="button"
							onClick={() => {
								setActiveCategory("All");
								setSearchQuery("");
							}}
							className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer">
							Reset Filters
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
