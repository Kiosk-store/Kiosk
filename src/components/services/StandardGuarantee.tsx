/** @format */

"use client";

import React from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

interface GuaranteeFeature {
	id: string;
	number: string;
	title: string;
	badgeText: string;
	desc: string;
	renderVisual: () => React.ReactNode;
}

const GUARANTEE_FEATURES: GuaranteeFeature[] = [
	{
		id: "subdomain",
		number: "01",
		title: "Free Kiosk Subdomain",
		badgeText: "SUBDOMAIN",
		desc: "Launch immediately on your custom subdomain (yourname.kiosk.com) with zero setup friction.",
		renderVisual: () => (
			<div className="relative w-full h-24 rounded-2xl bg-slate-900 border border-slate-800 p-3 flex flex-col justify-between overflow-hidden shadow-inner group-hover:border-blue-500/40 transition-colors">
				{/* Top Window Bar */}
				<div className="flex items-center justify-between z-10">
					<div className="flex items-center gap-1.5">
						<span className="w-2 h-2 rounded-full bg-slate-700" />
						<span className="w-2 h-2 rounded-full bg-slate-700" />
						<span className="w-2 h-2 rounded-full bg-slate-700" />
					</div>
					<div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
						<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
						<span className="text-[9px] font-mono font-bold text-emerald-300">SSL ACTIVE</span>
					</div>
				</div>
				{/* Domain Bar Illustration */}
				<div className="z-10 bg-slate-800/90 border border-blue-500/30 rounded-xl px-3 py-1.5 flex items-center justify-between shadow-md">
					<div className="flex items-center gap-1.5 text-xs font-mono truncate">
						<span className="text-blue-400 font-bold">https://</span>
						<span className="text-white font-bold tracking-tight">yourname</span>
						<span className="text-blue-400 font-bold">.kiosk.com</span>
					</div>
					<div className="w-2 h-2 rounded-full bg-blue-400 animate-ping shrink-0" />
				</div>
			</div>
		),
	},
	{
		id: "ssl-hosting",
		number: "02",
		title: "SSL & Cloud Hosting Included",
		badgeText: "ENTERPRISE SECURITY",
		desc: "Enterprise 256-bit SSL security certificate & ultra-fast edge cloud hosting built right in.",
		renderVisual: () => (
			<div className="relative w-full h-24 rounded-2xl bg-slate-900 border border-slate-800 p-3.5 flex items-center justify-between overflow-hidden shadow-inner group-hover:border-blue-500/40 transition-colors">
				{/* Shield Visual Badge */}
				<div className="flex items-center gap-3 z-10">
					<div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 p-0.5 shadow-md flex items-center justify-center">
						<svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
						</svg>
					</div>
					<div>
						<div className="text-[11px] font-mono font-bold text-white tracking-wide uppercase">256-Bit SSL</div>
						<div className="text-[10px] text-slate-400 font-mono">99.99% Uptime SLA</div>
					</div>
				</div>
				{/* Security Chip */}
				<div className="z-10 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-lg text-[9px] font-mono font-bold text-emerald-300 flex items-center gap-1">
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
					<span>PROTECTED</span>
				</div>
			</div>
		),
	},
	{
		id: "responsive",
		number: "03",
		title: "Mobile & Desktop Responsive",
		badgeText: "AUTO-ADAPTIVE",
		desc: "Looks stunning and functions flawlessly across all smartphones, tablets, and laptops.",
		renderVisual: () => (
			<div className="relative w-full h-24 rounded-2xl bg-slate-900 border border-slate-800 p-3.5 flex items-center justify-around overflow-hidden shadow-inner group-hover:border-blue-500/40 transition-colors">
				{/* Desktop Frame */}
				<div className="z-10 w-24 h-15 rounded-lg border border-slate-700 bg-slate-800 p-1.5 flex flex-col justify-between shadow-md group-hover:border-blue-500/50 transition-colors">
					<div className="w-full h-1 bg-blue-500/60 rounded-full" />
					<div className="space-y-1">
						<div className="w-3/4 h-1 bg-slate-600 rounded" />
						<div className="w-1/2 h-1 bg-blue-400/50 rounded" />
					</div>
					<div className="w-full flex justify-end">
						<div className="w-2.5 h-1 bg-blue-500 rounded-xs" />
					</div>
				</div>
				{/* Sync Node Indicator */}
				<div className="z-10 text-blue-400 font-mono text-xs font-bold">::</div>
				{/* Mobile Frame */}
				<div className="z-10 w-9 h-16 rounded-lg border border-slate-700 bg-slate-800 p-1 flex flex-col justify-between shadow-md group-hover:border-blue-500/50 transition-colors">
					<div className="w-3 h-0.5 bg-slate-600 mx-auto rounded-full" />
					<div className="space-y-1">
						<div className="w-full h-1 bg-blue-400/70 rounded" />
						<div className="w-2/3 h-1 bg-slate-600 rounded" />
					</div>
					<div className="w-1 h-1 rounded-full bg-blue-500 mx-auto" />
				</div>
			</div>
		),
	},
	{
		id: "seo",
		number: "04",
		title: "Basic SEO Setup",
		badgeText: "SEARCH READY",
		desc: "Meta titles, Open Graph social share tags, and XML sitemaps automatically generated.",
		renderVisual: () => (
			<div className="relative w-full h-24 rounded-2xl bg-slate-900 border border-slate-800 p-3 flex flex-col justify-between overflow-hidden shadow-inner group-hover:border-blue-500/40 transition-colors">
				{/* Meta Pill Header */}
				<div className="flex items-center justify-between z-10">
					<span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-md">
						&lt;meta name=&quot;og:title&quot;&gt;
					</span>
					<span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded-md">
						INDEXED
					</span>
				</div>
				{/* Search Result Visual */}
				<div className="z-10 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 flex items-center justify-between shadow-md">
					<div className="space-y-0.5">
						<div className="text-[11px] font-bold text-white truncate">Your Business | Kiosk</div>
						<div className="text-[9px] font-mono text-slate-400">sitemap.xml • Google Verified</div>
					</div>
					<div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
				</div>
			</div>
		),
	},
	{
		id: "revisions",
		number: "05",
		title: "Revision Rounds Included",
		badgeText: "REVISION GUARANTEE",
		desc: "Review your draft, request adjustments, and refine details before your site officially goes live.",
		renderVisual: () => (
			<div className="relative w-full h-24 rounded-2xl bg-slate-900 border border-slate-800 p-3.5 flex items-center justify-between overflow-hidden shadow-inner group-hover:border-blue-500/40 transition-colors">
				{/* Sync Icon Badge */}
				<div className="flex items-center gap-3 z-10">
					<div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 p-0.5 shadow-md flex items-center justify-center">
						<svg className="w-6 h-6 text-blue-400 group-hover:rotate-180 transition-transform duration-700 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
					</div>
					<div>
						<div className="text-[11px] font-mono font-bold text-white tracking-wide uppercase">Draft & Tweaks</div>
						<div className="text-[10px] text-slate-400 font-mono">100% Sync Guarantee</div>
					</div>
				</div>
				{/* Approved Chip */}
				<div className="z-10 bg-blue-500/10 border border-blue-500/30 px-2 py-1 rounded-lg text-[9px] font-mono font-bold text-blue-300">
					APPROVED
				</div>
			</div>
		),
	},
	{
		id: "custom-domain",
		number: "06",
		title: "Custom Domain Connection",
		badgeText: "CUSTOM DOMAIN",
		desc: "Connect your own primary domain name (yourname.com) anytime with easy 1-click DNS routing.",
		renderVisual: () => (
			<div className="relative w-full h-24 rounded-2xl bg-slate-900 border border-slate-800 p-3 flex flex-col justify-between overflow-hidden shadow-inner group-hover:border-blue-500/40 transition-colors">
				{/* Routing Header */}
				<div className="flex items-center justify-between z-10">
					<span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider">DNS ROUTING</span>
					<span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">CONNECTED</span>
				</div>
				{/* Domain Connection Mapping */}
				<div className="z-10 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 flex items-center justify-between shadow-md">
					<span className="text-xs font-mono font-bold text-white truncate">yourdomain.com</span>
					<div className="flex items-center gap-1 text-blue-400 font-mono text-xs">
						<span>--&gt;</span>
						<span className="text-emerald-400 font-bold">✓</span>
					</div>
				</div>
			</div>
		),
	},
];

export default function StandardGuarantee() {
	return (
		<section className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
			{/* Section Header */}
			<div className="text-center max-w-3xl mx-auto mb-16">
				<ScrollReveal direction="up">
					<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-mono tracking-wider font-bold shadow-2xs mb-3">
						<span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
						<span>STANDARD GUARANTEE</span>
						<span className="text-emerald-300">|</span>
						<span>100% INCLUDED</span>
					</div>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={100}>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-nohemi text-gray-900 tracking-tight mt-1 mb-4 leading-tight">
						Included in Every Single Kiosk Tier
					</h2>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={200}>
					<p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
						No hidden hosting fees or technical surprises. Everything you need to launch safely, securely, and professionally is built in.
					</p>
				</ScrollReveal>
			</div>

			{/* Staggered Scroll Reveal Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{GUARANTEE_FEATURES.map((feat, index) => (
					<ScrollReveal key={feat.id} direction="up" delay={index * 90}>
						<motion.div
							whileHover={{ y: -8, scale: 1.015 }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
							className="group h-full p-6 sm:p-7 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between">
							<div className="space-y-4">
								{/* Header Row */}
								<div className="flex items-center justify-between">
									<span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 border border-gray-200/60">
										{feat.badgeText}
									</span>
									<span className="font-mono text-xs font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
										[ {feat.number} ]
									</span>
								</div>

								{/* Custom Brand Micro-UI Illustration */}
								<div className="pt-1">
									{feat.renderVisual()}
								</div>

								{/* Title & Description */}
								<div className="space-y-1.5 pt-1">
									<h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
										{feat.title}
									</h3>
									<p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
										{feat.desc}
									</p>
								</div>
							</div>

							{/* Footer Item Indicator */}
							<div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
								<div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px]">
									<span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
									<span>Zero Extra Cost</span>
								</div>
								<span className="font-mono text-[10px] text-gray-400 uppercase">STANDARD</span>
							</div>
						</motion.div>
					</ScrollReveal>
				))}
			</div>

			{/* Bottom Trust Card */}
			<ScrollReveal direction="up" delay={450}>
				<div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-white border border-gray-200/90 p-5 sm:p-6 text-gray-900 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
					<div className="flex items-center gap-3.5">
						<div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold font-mono text-sm">
							100%
						</div>
						<div>
							<h4 className="text-sm font-bold text-gray-900">All features included across all service tiers</h4>
							<p className="text-xs text-gray-500 font-medium">No surprise setup add-ons or hidden recurring platform costs.</p>
						</div>
					</div>
					<div className="shrink-0 bg-blue-600 text-white text-xs font-bold font-mono px-4 py-2 rounded-xl">
						100% INCLUDED
					</div>
				</div>
			</ScrollReveal>
		</section>
	);
}



