/** @format */

"use client";

import React from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

interface AddOn {
	id: string;
	title: string;
	price: string;
	desc: string;
	badge: string;
	renderVisual: () => React.ReactNode;
}

const ADDONS: AddOn[] = [
	{
		id: "pages",
		title: "Extra Pages",
		price: "$49 / page",
		desc: "Add extra custom subpages (e.g. Portfolio, Terms, Gallery) beyond tier limits.",
		badge: "ADDITIONAL PAGE",
		renderVisual: () => (
			<div className="relative w-full h-20 rounded-xl bg-slate-900 border border-slate-800 p-3 flex flex-col justify-between overflow-hidden shadow-inner group-hover:border-blue-500/40 transition-colors">
				<div className="flex items-center justify-between z-10">
					<span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-md">
						+1 CUSTOM PAGE
					</span>
					<span className="text-[9px] font-mono text-slate-400">UNLIMITED SUBPAGES</span>
				</div>
				<div className="z-10 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 flex items-center justify-between">
					<div className="w-1/2 h-1.5 bg-blue-400/60 rounded-full" />
					<span className="text-[9px] font-mono text-emerald-400 font-bold">READY</span>
				</div>
			</div>
		),
	},
	{
		id: "domain",
		title: "Custom Domain Setup",
		price: "$29 one-off",
		desc: "We register your custom domain (.com) and configure DNS records for you.",
		badge: "DOMAINS & DNS",
		renderVisual: () => (
			<div className="relative w-full h-20 rounded-xl bg-slate-900 border border-slate-800 p-3 flex flex-col justify-between overflow-hidden shadow-inner group-hover:border-blue-500/40 transition-colors">
				<div className="flex items-center justify-between z-10">
					<span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
						.COM REGISTRATION
					</span>
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
				</div>
				<div className="z-10 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 flex items-center justify-between text-[10px] font-mono text-slate-300">
					<span>A-Record + CNAME</span>
					<span className="text-emerald-400 font-bold">CONFIGURED</span>
				</div>
			</div>
		),
	},
	{
		id: "copywriting",
		title: "Copywriting Support",
		price: "$149 one-off",
		desc: "Our copywriters draft high-converting headlines and sales copy for your offer.",
		badge: "SALES COPYWRITING",
		renderVisual: () => (
			<div className="relative w-full h-20 rounded-xl bg-slate-900 border border-slate-800 p-3 flex flex-col justify-between overflow-hidden shadow-inner group-hover:border-blue-500/40 transition-colors">
				<div className="flex items-center justify-between z-10">
					<span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-md">
						HEADLINES & COPY
					</span>
					<span className="text-[9px] font-mono text-slate-400">HIGH CONVERTING</span>
				</div>
				<div className="z-10 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 flex items-center justify-between">
					<div className="w-2/3 h-1.5 bg-slate-400 rounded-full" />
					<span className="text-[9px] font-mono text-blue-400 font-bold">DRAFTED</span>
				</div>
			</div>
		),
	},
	{
		id: "updates",
		title: "Managed Updates",
		price: "$35 / month",
		desc: "Post-launch content edits, text changes, and image updates handled by our team.",
		badge: "MANAGED SERVICE",
		renderVisual: () => (
			<div className="relative w-full h-20 rounded-xl bg-slate-900 border border-slate-800 p-3 flex flex-col justify-between overflow-hidden shadow-inner group-hover:border-blue-500/40 transition-colors">
				<div className="flex items-center justify-between z-10">
					<span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
						POST-LAUNCH EDITS
					</span>
					<span className="text-[9px] font-mono text-slate-400">MONTHLY</span>
				</div>
				<div className="z-10 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 flex items-center justify-between text-[10px] font-mono text-slate-300">
					<span>Text & Image Edits</span>
					<span className="text-emerald-400 font-bold">ACTIVE</span>
				</div>
			</div>
		),
	},
	{
		id: "rush",
		title: "Rush 48-Hour Delivery",
		badge: "EXPRESS BUILD",
		price: "$199 one-off",
		desc: "Fast-track your project into our top priority 48-hour build queue.",
		renderVisual: () => (
			<div className="relative w-full h-20 rounded-xl bg-slate-900 border border-slate-800 p-3 flex flex-col justify-between overflow-hidden shadow-inner group-hover:border-blue-500/40 transition-colors">
				<div className="flex items-center justify-between z-10">
					<span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-md">
						PRIORITY QUEUE
					</span>
					<span className="text-[9px] font-mono text-blue-300 font-bold">48 HOURS</span>
				</div>
				<div className="z-10 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 flex items-center justify-between">
					<div className="w-full h-1.5 bg-blue-500/40 rounded-full overflow-hidden relative">
						<div className="w-3/4 h-full bg-blue-500 rounded-full" />
					</div>
				</div>
			</div>
		),
	},
];

export default function ServiceAddOns() {
	return (
		<section className="py-20 md:py-28 bg-white border-t border-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<ScrollReveal direction="up" delay={0}>
						<span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
							Optional Bolt-Ons
						</span>
					</ScrollReveal>

					<ScrollReveal direction="up" delay={100}>
						<h2 className="text-3xl sm:text-4xl font-bold font-nohemi text-gray-900 mt-3 mb-3">
							Service Add-Ons
						</h2>
					</ScrollReveal>

					<ScrollReveal direction="up" delay={200}>
						<p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed max-w-xl mx-auto">
							Need extra pages, copywriting help, or fast delivery? Bolt these on to any tier.
						</p>
					</ScrollReveal>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{ADDONS.map((addon, index) => (
						<ScrollReveal key={addon.id} direction="up" delay={index * 90}>
							<motion.div
								whileHover={{ y: -6, scale: 1.015 }}
								transition={{ type: "spring", stiffness: 300, damping: 20 }}
								className="h-full p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between group">
								<div className="space-y-3.5">
									<div className="flex items-center justify-between">
										<span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200/60">
											{addon.badge}
										</span>
										<span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
											{addon.price}
										</span>
									</div>

									{/* Custom Micro-UI Visual Illustration */}
									<div className="pt-1">
										{addon.renderVisual()}
									</div>

									<div className="space-y-1 pt-1">
										<h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
											{addon.title}
										</h3>
										<p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
											{addon.desc}
										</p>
									</div>
								</div>

								<div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
									<span className="text-blue-600 font-semibold text-[11px]">Available on all tiers</span>
									<span className="font-mono text-[10px] uppercase">BOLT-ON</span>
								</div>
							</motion.div>
						</ScrollReveal>
					))}
				</div>
			</div>
		</section>
	);
}


