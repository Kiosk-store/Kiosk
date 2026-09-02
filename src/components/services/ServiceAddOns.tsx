/** @format */

"use client";

import React from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPrice } from "@/lib/currency";

interface AddOn {
	id: string;
	title: string;
	usdPrice: number;
	suffix: string;
	desc: string;
	badge: string;
	renderVisual: () => React.ReactNode;
}

const ADDONS: AddOn[] = [
	{
		id: "pages",
		title: "Extra Pages",
		usdPrice: 49,
		suffix: "/ page",
		desc: "Add extra custom subpages (e.g. Portfolio, Terms, Gallery) beyond tier limits.",
		badge: "ADDITIONAL PAGE",
		renderVisual: () => (
			<div className="relative w-full h-20 rounded-xl bg-blue-50/70 border border-blue-100 p-3 flex flex-col justify-between overflow-hidden shadow-2xs group-hover:border-blue-300 transition-colors">
				<div className="flex items-center justify-between z-10">
					<span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-md">
						+1 CUSTOM PAGE
					</span>
					<span className="text-[9px] font-mono text-gray-500 font-medium">UNLIMITED SUBPAGES</span>
				</div>
				<div className="z-10 bg-white border border-blue-100 rounded-lg px-2.5 py-1 flex items-center justify-between shadow-2xs">
					<div className="w-1/2 h-1.5 bg-blue-500/60 rounded-full" />
					<span className="text-[9px] font-mono text-emerald-600 font-bold">READY</span>
				</div>
			</div>
		),
	},
	{
		id: "domain",
		title: "Custom Domain Setup",
		usdPrice: 29,
		suffix: "one-off",
		desc: "We register your custom domain (.com) and configure DNS records for you.",
		badge: "DOMAINS & DNS",
		renderVisual: () => (
			<div className="relative w-full h-20 rounded-xl bg-emerald-50/70 border border-emerald-100 p-3 flex flex-col justify-between overflow-hidden shadow-2xs group-hover:border-emerald-300 transition-colors">
				<div className="flex items-center justify-between z-10">
					<span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md">
						.COM REGISTRATION
					</span>
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
				</div>
				<div className="z-10 bg-white border border-emerald-100 rounded-lg px-2.5 py-1 flex items-center justify-between text-[10px] font-mono text-gray-700 shadow-2xs">
					<span>A-Record + CNAME</span>
					<span className="text-emerald-600 font-bold">CONFIGURED</span>
				</div>
			</div>
		),
	},
	{
		id: "copywriting",
		title: "Copywriting Support",
		usdPrice: 149,
		suffix: "one-off",
		desc: "Our copywriters draft high-converting headlines and sales copy for your offer.",
		badge: "SALES COPYWRITING",
		renderVisual: () => (
			<div className="relative w-full h-20 rounded-xl bg-purple-50/70 border border-purple-100 p-3 flex flex-col justify-between overflow-hidden shadow-2xs group-hover:border-purple-300 transition-colors">
				<div className="flex items-center justify-between z-10">
					<span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-md">
						HEADLINES & COPY
					</span>
					<span className="text-[9px] font-mono text-gray-500 font-medium">HIGH CONVERTING</span>
				</div>
				<div className="z-10 bg-white border border-purple-100 rounded-lg px-2.5 py-1 flex items-center justify-between shadow-2xs">
					<div className="w-2/3 h-1.5 bg-purple-400 rounded-full" />
					<span className="text-[9px] font-mono text-purple-600 font-bold">DRAFTED</span>
				</div>
			</div>
		),
	},
	{
		id: "updates",
		title: "Managed Updates",
		usdPrice: 35,
		suffix: "/ month",
		desc: "Post-launch content edits, text changes, and image updates handled by our team.",
		badge: "MANAGED SERVICE",
		renderVisual: () => (
			<div className="relative w-full h-20 rounded-xl bg-indigo-50/70 border border-indigo-100 p-3 flex flex-col justify-between overflow-hidden shadow-2xs group-hover:border-indigo-300 transition-colors">
				<div className="flex items-center justify-between z-10">
					<span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md">
						POST-LAUNCH EDITS
					</span>
					<span className="text-[9px] font-mono text-gray-500 font-medium">MONTHLY</span>
				</div>
				<div className="z-10 bg-white border border-indigo-100 rounded-lg px-2.5 py-1 flex items-center justify-between text-[10px] font-mono text-gray-700 shadow-2xs">
					<span>Text & Image Edits</span>
					<span className="text-emerald-600 font-bold">ACTIVE</span>
				</div>
			</div>
		),
	},
	{
		id: "rush",
		title: "Rush 48-Hour Delivery",
		badge: "EXPRESS BUILD",
		usdPrice: 199,
		suffix: "one-off",
		desc: "Fast-track your project into our top priority 48-hour build queue.",
		renderVisual: () => (
			<div className="relative w-full h-20 rounded-xl bg-amber-50/70 border border-amber-100 p-3 flex flex-col justify-between overflow-hidden shadow-2xs group-hover:border-amber-300 transition-colors">
				<div className="flex items-center justify-between z-10">
					<span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md">
						PRIORITY QUEUE
					</span>
					<span className="text-[9px] font-mono text-amber-700 font-bold">48 HOURS</span>
				</div>
				<div className="z-10 bg-white border border-amber-100 rounded-lg px-2.5 py-1 flex items-center justify-between shadow-2xs">
					<div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden relative">
						<div className="w-3/4 h-full bg-amber-500 rounded-full" />
					</div>
				</div>
			</div>
		),
	},
];

export default function ServiceAddOns() {
	const { currency, isLoading } = useCurrency();

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

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{ADDONS.map((addon, index) => {
						const formattedPrice = isLoading
							? "…"
							: `${formatPrice(addon.usdPrice, currency)} ${addon.suffix}`;

						return (
							<ScrollReveal key={addon.id} direction="up" delay={index * 90}>
								<motion.div
									whileHover={{ y: -6, scale: 1.015 }}
									transition={{ type: "spring", stiffness: 300, damping: 20 }}
									className="h-full p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between group">
									<div className="space-y-3 sm:space-y-3.5">
										<div className="flex items-center justify-between">
											<span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200/60">
												{addon.badge}
											</span>
											<span className="text-[11px] sm:text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-blue-100">
												{formattedPrice}
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

									<div className="pt-3.5 sm:pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
										<span className="text-blue-600 font-semibold text-[10px] sm:text-[11px]">Available on all tiers</span>
										<span className="font-mono text-[9px] sm:text-[10px] uppercase">BOLT-ON</span>
									</div>
								</motion.div>
							</ScrollReveal>
						);
					})}
				</div>
			</div>
		</section>
	);
}


