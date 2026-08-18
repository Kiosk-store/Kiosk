/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PillButton from "@/components/PillButton";
import { Briefcase, ArrowRight, CheckCircle2, Sparkles, Filter, Calculator, Send } from "lucide-react";

export const dynamic = "force-dynamic";

const PORTFOLIO_ITEMS = [
	{
		id: 1,
		title: "NeuraHealth Web Platform",
		category: "Web Design",
		metric: "+140% Conversions",
		imageBg: "from-blue-600 to-indigo-900",
		desc: "Full brand transformation and Next.js digital experience for AI healthcare provider.",
	},
	{
		id: 2,
		title: "Velox FinTech Brand System",
		category: "Branding",
		metric: "$12M Series A Raised",
		imageBg: "from-purple-600 to-slate-900",
		desc: "Visual identity, design tokens, and investor pitch deck for global payments startup.",
	},
	{
		id: 3,
		title: "Luminary E-Commerce Store",
		category: "E-Commerce",
		metric: "2.4x ROAS Boost",
		imageBg: "from-emerald-600 to-teal-950",
		desc: "Custom Shopify & Next.js storefront for luxury skincare brand.",
	},
	{
		id: 4,
		title: "Aura Mobile Companion App",
		category: "Mobile",
		metric: "450k Active Users",
		imageBg: "from-amber-600 to-rose-950",
		desc: "Cross-platform mobile interface and design system for fitness tracker.",
	},
];

export default function CreativeAgencyTemplate() {
	const [activeCategory, setActiveCategory] = useState<string>("All");
	const [estimateScope, setEstimateScope] = useState<number>(2); // 1 = Small, 2 = Medium, 3 = Enterprise
	const [intakeSubmitted, setIntakeSubmitted] = useState<boolean>(false);

	const filteredItems =
		activeCategory === "All"
			? PORTFOLIO_ITEMS
			: PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

	const estimatedCost = estimateScope === 1 ? "$1,500" : estimateScope === 2 ? "$3,200" : "$6,500";

	return (
		<main className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
			<Navbar />

			{/* Template Banner Notice */}
			<div className="bg-indigo-600 text-white text-xs font-bold py-2.5 px-4 text-center sticky top-0 z-50 flex items-center justify-center gap-2">
				<Briefcase className="w-4 h-4" />
				<span>Template Preview: Creative Agency Showcase (src/app/templates/agency)</span>
				<Link
					href="/checkout?plan=landing&billing=monthly"
					className="ml-3 bg-white text-indigo-700 px-3 py-0.5 rounded-full font-extrabold uppercase text-[10px] hover:bg-indigo-50 transition-colors">
					Use This Template →
				</Link>
			</div>

			{/* Hero Section */}
			<section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
				<div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-14 shadow-2xl space-y-8 relative overflow-hidden">
					<div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
						<Sparkles className="w-3.5 h-3.5" />
						<span>CREATIVE AGENCY SHOWCASE PRESET</span>
					</div>

					<div className="max-w-3xl space-y-4">
						<h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-nohemi text-white tracking-tight leading-tight">
							We Design Digital Products That Drive Explosive Growth
						</h1>
						<p className="text-slate-400 text-sm sm:text-lg font-medium leading-relaxed">
							Award-winning design studio specializing in brand identity, high-conversion web development, and digital marketing systems for ambitious brands.
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-4 pt-2">
						<PillButton
							href="/checkout?plan=landing&billing=monthly"
							baseColor="#004ac6"
							circleColor="#ffffff"
							textColor="#ffffff"
							hoverTextColor="#004ac6"
							useThunderFont={true}
							className="px-8 py-3.5 text-xs font-bold border border-blue-600 shadow-lg">
							Get Started With Agency Template
						</PillButton>

						<a
							href="#case-studies"
							className="px-6 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-2 border border-slate-700">
							<span>Explore Case Studies</span>
							<ArrowRight className="w-4 h-4 text-slate-400" />
						</a>
					</div>
				</div>
			</section>

			{/* Filterable Portfolio Grid */}
			<section id="case-studies" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
					<div>
						<h2 className="text-2xl sm:text-3xl font-bold font-nohemi text-white">
							Featured Case Studies
						</h2>
						<p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
							Selected works showcasing strategy, branding, and digital architecture.
						</p>
					</div>

					{/* Category Filter Pills */}
					<div className="flex items-center gap-2 overflow-x-auto scrollbar-none max-w-full p-1 bg-slate-900 border border-slate-800 rounded-2xl">
						{["All", "Web Design", "Branding", "E-Commerce", "Mobile"].map((cat) => (
							<button
								key={cat}
								type="button"
								onClick={() => setActiveCategory(cat)}
								className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
									activeCategory === cat
										? "bg-indigo-600 text-white shadow-md"
										: "text-slate-400 hover:text-white"
								}`}>
								{cat}
							</button>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{filteredItems.map((item) => (
						<div
							key={item.id}
							className="group bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-300">
							<div className="space-y-4">
								<div className={`w-full h-48 rounded-2xl bg-gradient-to-br ${item.imageBg} p-6 flex flex-col justify-between relative overflow-hidden group-hover:scale-[1.01] transition-transform`}>
									<div className="flex items-center justify-between z-10">
										<span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-950/70 text-indigo-300 backdrop-blur-md border border-white/10">
											{item.category}
										</span>
										<span className="text-xs font-bold text-emerald-300 bg-emerald-950/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-emerald-500/30">
											{item.metric}
										</span>
									</div>
									<h3 className="text-xl font-bold font-nohemi text-white z-10">{item.title}</h3>
								</div>

								<p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
									{item.desc}
								</p>
							</div>

							<div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
								<span className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
									<span>View Full Case Study</span>
									<ArrowRight className="w-3.5 h-3.5" />
								</span>
								<span className="text-[10px] font-mono text-slate-500 uppercase">AGENCY WORK</span>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Interactive Scope Calculator & Intake */}
			<section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
				<div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
					<div className="flex items-center gap-2 text-indigo-400">
						<Calculator className="w-5 h-5" />
						<h3 className="text-xl font-bold font-nohemi text-white">Instant Project Estimator</h3>
					</div>

					<p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
						Select your estimated project scope to preview your customized project quote:
					</p>

					<div className="space-y-4">
						<div className="grid grid-cols-3 gap-2">
							{[
								{ level: 1, label: "Sprint (Single Page)" },
								{ level: 2, label: "Growth (Full Site)" },
								{ level: 3, label: "Enterprise (App System)" },
							].map((item) => (
								<button
									key={item.level}
									type="button"
									onClick={() => setEstimateScope(item.level)}
									className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
										estimateScope === item.level
											? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
											: "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
									}`}>
									{item.label}
								</button>
							))}
						</div>

						<div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
							<div>
								<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Investment</p>
								<p className="text-3xl font-bold font-nohemi text-indigo-400 mt-1">{estimatedCost}</p>
							</div>
							<div className="text-right text-xs text-slate-400">
								<p className="font-bold text-white">Includes Design & Code</p>
								<p>Turnaround: 5-7 Days</p>
							</div>
						</div>
					</div>
				</div>

				{/* Client Intake Form */}
				<div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-4">
					<h3 className="text-xl font-bold font-nohemi text-white">Client Project Intake</h3>

					{intakeSubmitted ? (
						<div className="p-8 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-center space-y-3">
							<CheckCircle2 className="w-10 h-10 text-indigo-400 mx-auto" />
							<p className="text-base font-bold text-white">Intake Received!</p>
							<p className="text-xs text-slate-400">Our agency team will review your scope and send a calendar invite within 2 hours.</p>
						</div>
					) : (
						<form onSubmit={(e) => { e.preventDefault(); setIntakeSubmitted(true); }} className="space-y-4">
							<div>
								<label className="block text-xs font-bold text-slate-400 mb-1">Company / Brand Name</label>
								<input
									type="text"
									required
									placeholder="Acme Studio"
									className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
								/>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-400 mb-1">Work Email</label>
								<input
									type="email"
									required
									placeholder="hello@acme.com"
									className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
								/>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-400 mb-1">Project Goals</label>
								<textarea
									rows={3}
									required
									placeholder="Describe your brand goals, target timeline, or budget..."
									className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
								/>
							</div>

							<button
								type="submit"
								className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer">
								<Send className="w-4 h-4" />
								<span>Submit Project Brief</span>
							</button>
						</form>
					)}
				</div>
			</section>

			<Footer />
		</main>
	);
}
