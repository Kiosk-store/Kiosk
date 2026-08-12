/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PillButton from "@/components/PillButton";
import {
	Globe,
	Filter,
	ShoppingBag,
	Eye,
	CheckCircle2,
	X,
	Sparkles,
	Search,
	ArrowRight,
	Layers,
	Zap,
} from "lucide-react";

interface Template {
	id: string;
	name: string;
	category: "Landing Page" | "Sales Funnel" | "E-commerce Store";
	style: "Minimalist" | "Luxury" | "Bold" | "Corporate" | "Vibrant";
	price: string;
	delivery: string;
	description: string;
	accentBg: string;
	accentText: string;
	badgeBg: string;
	badgeText: string;
	features: string[];
	industry: string;
	previewImageBg: string;
}

const templates: Template[] = [
	{
		id: "neo-saas",
		name: "Neo-SaaS Minimalist",
		category: "Landing Page",
		style: "Minimalist",
		price: "$20",
		delivery: "3-5 Days",
		description:
			"Engineered for modern software tools, featuring crisp hero sections and feature grids.",
		accentBg: "bg-blue-50",
		accentText: "text-blue-600",
		badgeBg: "bg-blue-100/70",
		badgeText: "text-blue-700",
		industry: "SaaS & Tech",
		previewImageBg: "bg-slate-900 text-white",
		features: [
			"High-converting Hero section",
			"Interactive feature comparison grid",
			"Customer logo marquee strip",
			"WhatsApp & email lead capture",
		],
	},
	{
		id: "luxury-estate",
		name: "Luxury Estate Showcase",
		category: "Sales Funnel",
		style: "Luxury",
		price: "$30",
		delivery: "5-7 Days",
		description:
			"Architectural elegance designed for high-end real estate listings and luxury agencies.",
		accentBg: "bg-emerald-50",
		accentText: "text-emerald-600",
		badgeBg: "bg-emerald-100/70",
		badgeText: "text-emerald-700",
		industry: "Real Estate & Architecture",
		previewImageBg: "bg-emerald-950 text-emerald-100",
		features: [
			"Full-screen property photo showcase",
			"Schedule private tour booking form",
			"Virtual 3D tour section",
			"Agent bio & client testimonials",
		],
	},
	{
		id: "cyberpunk-gear",
		name: "Cyberpunk Apparel & Gear",
		category: "E-commerce Store",
		style: "Bold",
		price: "$43",
		delivery: "7-10 Days",
		description:
			"High-contrast dark aesthetic tailored for streetwear brands and gaming merchandise.",
		accentBg: "bg-purple-50",
		accentText: "text-purple-600",
		badgeBg: "bg-purple-100/70",
		badgeText: "text-purple-700",
		industry: "E-commerce & Apparel",
		previewImageBg: "bg-indigo-950 text-purple-200",
		features: [
			"Instant product variant selector",
			"Stripe & PayPal integrated checkout",
			"Inventory counter & size guide",
			"Customer reviews & photo ratings",
		],
	},
	{
		id: "artisan-coffee",
		name: "Artisan Roastery & Bakery",
		category: "Landing Page",
		style: "Minimalist",
		price: "$20",
		delivery: "3-5 Days",
		description:
			"Warm organic tones showcasing craft coffee, daily menus, and store locator.",
		accentBg: "bg-amber-50",
		accentText: "text-amber-600",
		badgeBg: "bg-amber-100/70",
		badgeText: "text-amber-800",
		industry: "Food & Beverage",
		previewImageBg: "bg-stone-900 text-amber-100",
		features: [
			"Interactive menu & pricing accordion",
			"Direct order & table reservation",
			"Google Maps & opening hours",
			"Instagram social feed gallery",
		],
	},
	{
		id: "hyperpulse-fitness",
		name: "HyperPulse Fitness Club",
		category: "Sales Funnel",
		style: "Bold",
		price: "$30",
		delivery: "5-7 Days",
		description:
			"High-energy dynamic design for gym memberships, personal trainers, and fitness programs.",
		accentBg: "bg-rose-50",
		accentText: "text-rose-600",
		badgeBg: "bg-rose-100/70",
		badgeText: "text-rose-700",
		industry: "Health & Fitness",
		previewImageBg: "bg-slate-950 text-rose-300",
		features: [
			"Membership tier breakdown",
			"Class schedule & trainer booking",
			"Transformation before/after slider",
			"Free trial pass lead capture",
		],
	},
	{
		id: "apex-capital",
		name: "Apex Venture Capital",
		category: "Landing Page",
		style: "Corporate",
		price: "$20",
		delivery: "3-5 Days",
		description:
			"Trustworthy corporate layout tailored for financial advisors, funds, and consultants.",
		accentBg: "bg-blue-50",
		accentText: "text-blue-700",
		badgeBg: "bg-blue-100/70",
		badgeText: "text-blue-800",
		industry: "Finance & Consulting",
		previewImageBg: "bg-slate-900 text-blue-200",
		features: [
			"Portfolio track record grid",
			"Investment thesis & partner bios",
			"Investor relations pitch form",
			"Compliance & disclosure footer",
		],
	},
	{
		id: "creator-academy",
		name: "Creator Academy Course",
		category: "Sales Funnel",
		style: "Vibrant",
		price: "$30",
		delivery: "5-7 Days",
		description:
			"Vibrant course funnel optimized for info-products, webinars, and online coaches.",
		accentBg: "bg-orange-50",
		accentText: "text-orange-600",
		badgeBg: "bg-orange-100/70",
		badgeText: "text-orange-700",
		industry: "Education & Coaching",
		previewImageBg: "bg-stone-900 text-orange-200",
		features: [
			"Curriculum module breakdown",
			"Student video testimonials",
			"Countdown timer urgency bar",
			"Teachable / Skool integration",
		],
	},
	{
		id: "studio-architecture",
		name: "Minimalist Design Studio",
		category: "Landing Page",
		style: "Minimalist",
		price: "$20",
		delivery: "3-5 Days",
		description:
			"Editorial grid layout for creative agencies, interior designers, and architects.",
		accentBg: "bg-gray-100",
		accentText: "text-gray-900",
		badgeBg: "bg-gray-200",
		badgeText: "text-gray-800",
		industry: "Design & Agencies",
		previewImageBg: "bg-slate-900 text-slate-100",
		features: [
			"Full-width case study grid",
			"Interactive project filtering",
			"Client inquiry questionnaire",
			"Press & award badges",
		],
	},
	{
		id: "velvet-cosmetics",
		name: "Velvet Beauty & Skincare",
		category: "E-commerce Store",
		style: "Luxury",
		price: "$43",
		delivery: "7-10 Days",
		description:
			"Soft pastel elegance designed for skincare products, cosmetics, and wellness stores.",
		accentBg: "bg-pink-50",
		accentText: "text-pink-600",
		badgeBg: "bg-pink-100/70",
		badgeText: "text-pink-700",
		industry: "Beauty & Wellness",
		previewImageBg: "bg-pink-950 text-pink-200",
		features: [
			"Routine quiz & product finder",
			"Subscription & save checkout",
			"Ingredient transparency list",
			"User reviews with photo uploads",
		],
	},
	{
		id: "synth-copilot",
		name: "SynthAI Copilot Launch",
		category: "Sales Funnel",
		style: "Vibrant",
		price: "$30",
		delivery: "5-7 Days",
		description:
			"Futuristic tech funnel with live demo preview tiles and developer API documentation.",
		accentBg: "bg-cyan-50",
		accentText: "text-cyan-600",
		badgeBg: "bg-cyan-100/70",
		badgeText: "text-cyan-700",
		industry: "AI & Developer Tools",
		previewImageBg: "bg-slate-950 text-cyan-200",
		features: [
			"Interactive code snippet preview",
			"API pricing calculator",
			"Developer docs quick link",
			"Early access waitlist capture",
		],
	},
];

export default function TemplatesPage() {
	const router = useRouter();
	const [activeCategory, setActiveCategory] = useState<string>("All");
	const [activeStyle, setActiveStyle] = useState<string>("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
		null,
	);

	const categories = ["All", "Landing Page", "Sales Funnel", "E-commerce Store"];
	const styles = ["All", "Minimalist", "Luxury", "Bold", "Corporate", "Vibrant"];

	const filteredTemplates = templates.filter((tpl) => {
		const matchesCategory =
			activeCategory === "All" || tpl.category === activeCategory;
		const matchesStyle =
			activeStyle === "All" || tpl.style === activeStyle;
		const matchesSearch =
			tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			tpl.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
			tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesCategory && matchesStyle && matchesSearch;
	});

	return (
		<div className="w-full min-h-screen bg-[#f8fafc]">
			{/* Main Container */}
			<div className="px-4 sm:px-6 lg:px-8 pt-10 pb-20 max-w-[1400px] mx-auto">
				{/* Page Header */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/80 mb-8">
					<div>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-extrabold uppercase tracking-wider mb-3">
							<Sparkles className="w-3.5 h-3.5" />
							<span>10 Premium Designs</span>
						</div>
						<h1 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 tracking-tight mb-1">
							Design Templates Showcase
						</h1>
						<p className="text-gray-500 text-sm font-medium">
							Explore our curated library of proven, high-converting website designs.
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
						+ Start New Build
					</PillButton>
				</div>

				{/* Filter Controls Bar */}
				<div className="space-y-4 mb-8">
					{/* Category Tabs */}
					<div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
						<span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 shrink-0">
							Category:
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

					{/* Style Tabs & Search */}
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
						<div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
							<span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 shrink-0">
								Style:
							</span>
							{styles.map((st) => (
								<button
									key={st}
									type="button"
									onClick={() => setActiveStyle(st)}
									className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
										activeStyle === st
											? "bg-gray-900 text-white"
											: "bg-white text-gray-500 hover:text-gray-900 border border-gray-200/80"
									}`}>
									{st}
								</button>
							))}
						</div>

						{/* Search Input */}
						<div className="relative w-full md:w-64">
							<Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
							<input
								type="text"
								placeholder="Search templates..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200/90 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
							/>
						</div>
					</div>
				</div>

				{/* Templates Grid (10 Designs) */}
				{filteredTemplates.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
						{filteredTemplates.map((tpl) => (
							<div
								key={tpl.id}
								className="bg-white border border-gray-200/90 rounded-3xl overflow-hidden hover:border-blue-500/40 hover:shadow-xs transition-all duration-200 flex flex-col justify-between group">
								{/* Top Mockup Header */}
								<div>
									<div
										className={`p-6 ${tpl.previewImageBg} min-h-[160px] flex flex-col justify-between relative`}>
										<div className="flex items-center justify-between">
											<span
												className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${tpl.badgeBg} ${tpl.badgeText}`}>
												{tpl.style}
											</span>
											<span className="text-xs font-bold font-nohemi bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white">
												{tpl.price}
											</span>
										</div>

										<div>
											<span className="text-[10px] uppercase font-bold tracking-widest text-white/60 block mb-1">
												{tpl.industry}
											</span>
											<h3 className="text-lg font-bold font-nohemi leading-snug">
												{tpl.name}
											</h3>
										</div>
									</div>

									{/* Body Info */}
									<div className="p-6">
										<div className="flex items-center gap-2 mb-3">
											<span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
												{tpl.category}
											</span>
											<span className="text-[11px] font-medium text-gray-400">
												Delivery in {tpl.delivery}
											</span>
										</div>

										<p className="text-xs text-gray-500 font-medium mb-5 leading-relaxed">
											{tpl.description}
										</p>

										{/* Key Features Pill List */}
										<div className="space-y-1.5 mb-2">
											{tpl.features.slice(0, 2).map((feat) => (
												<div
													key={feat}
													className="flex items-center gap-2 text-[11px] text-gray-700 font-medium">
													<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
													<span className="truncate">{feat}</span>
												</div>
											))}
										</div>
									</div>
								</div>

								{/* Bottom Action Footer */}
								<div className="p-6 pt-0 flex items-center gap-2 border-t border-gray-100/80 pt-4 mt-2">
									<Link
										href={
											tpl.category === "Landing Page"
												? "/templates/landing-page"
												: tpl.category === "Sales Funnel"
												? "/templates/sales-funnel"
												: "/templates/ecommerce"
										}
										className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 text-center">
										<Eye className="w-3.5 h-3.5 text-gray-500" />
										<span>Live Code Preview</span>
									</Link>

									<button
										type="button"
										onClick={() => router.push("/dashboard/projects/new")}
										className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs">
										<span>Use Design</span>
										<ArrowRight className="w-3.5 h-3.5" />
									</button>
								</div>
							</div>
						))}
					</div>
				) : (
					/* Empty Search State */
					<div className="bg-white border border-gray-200/90 rounded-3xl p-12 text-center max-w-md mx-auto">
						<div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
							<Search className="w-6 h-6" />
						</div>
						<h3 className="text-base font-bold font-nohemi text-gray-900 mb-1">
							No templates found
						</h3>
						<p className="text-xs text-gray-500 mb-6">
							No design templates matched your selected filters or search query.
						</p>
						<button
							type="button"
							onClick={() => {
								setActiveCategory("All");
								setActiveStyle("All");
								setSearchQuery("");
							}}
							className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer">
							Reset All Filters
						</button>
					</div>
				)}
			</div>

			{/* TEMPLATE PREVIEW MODAL */}
			{selectedTemplate && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
					<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
						<button
							type="button"
							onClick={() => setSelectedTemplate(null)}
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
							<X className="w-5 h-5" />
						</button>

						{/* Modal Header */}
						<div className="flex items-start gap-4 pb-6 border-b border-gray-100 mb-6">
							<div
								className={`w-14 h-14 rounded-2xl ${selectedTemplate.accentBg} ${selectedTemplate.accentText} flex items-center justify-center shrink-0`}>
								<Layers className="w-7 h-7" />
							</div>
							<div>
								<div className="flex items-center gap-2 mb-1">
									<span
										className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${selectedTemplate.badgeBg} ${selectedTemplate.badgeText}`}>
										{selectedTemplate.style}
									</span>
									<span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
										{selectedTemplate.category}
									</span>
								</div>
								<h2 className="text-xl sm:text-2xl font-bold font-nohemi text-gray-900">
									{selectedTemplate.name}
								</h2>
								<p className="text-xs text-gray-400 font-medium mt-0.5">
									Industry: {selectedTemplate.industry}
								</p>
							</div>
						</div>

						{/* Modal Content */}
						<div className="space-y-6 mb-8">
							<div>
								<h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
									About This Design
								</h4>
								<p className="text-xs text-gray-600 leading-relaxed font-medium">
									{selectedTemplate.description}
								</p>
							</div>

							<div>
								<h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
									Included Core Features
								</h4>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									{selectedTemplate.features.map((feat) => (
										<div
											key={feat}
											className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2.5 text-xs text-gray-800 font-medium">
											<CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
											<span>{feat}</span>
										</div>
									))}
								</div>
							</div>

							<div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
								<div>
									<p className="text-xs font-bold text-blue-900">
										Investment: {selectedTemplate.price}
									</p>
									<p className="text-[11px] text-blue-700 font-medium">
										Turnaround: Ready in {selectedTemplate.delivery}
									</p>
								</div>
								<Zap className="w-5 h-5 text-blue-600" />
							</div>
						</div>

						{/* Modal Actions */}
						<div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
							<button
								type="button"
								onClick={() => setSelectedTemplate(null)}
								className="px-5 py-2.5 rounded-full border border-gray-200/90 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer">
								Close Preview
							</button>

							<button
								type="button"
								onClick={() => {
									setSelectedTemplate(null);
									router.push("/dashboard/projects/new");
								}}
								className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md">
								Use This Template
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
