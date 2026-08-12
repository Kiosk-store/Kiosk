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
			<div className="relative w-full h-24 rounded-xl bg-gray-50 border border-gray-200 p-3 flex flex-col justify-between overflow-hidden group-hover:border-blue-200 transition-colors">
				{/* Top Window Bar */}
				<div className="flex items-center justify-between z-10">
					<div className="flex items-center gap-1.5">
						<span className="w-2 h-2 rounded-full bg-gray-300" />
						<span className="w-2 h-2 rounded-full bg-gray-300" />
						<span className="w-2 h-2 rounded-full bg-gray-300" />
					</div>
					<div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
						<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
						<span className="text-[9px] font-mono font-bold text-emerald-700">SSL ACTIVE</span>
					</div>
				</div>
				{/* Domain Bar */}
				<div className="z-10 bg-white border border-blue-200 rounded-lg px-3 py-1.5 flex items-center justify-between shadow-sm">
					<div className="flex items-center gap-1 text-xs font-mono truncate">
						<span className="text-blue-500 font-bold">https://</span>
						<span className="text-gray-900 font-bold">yourname</span>
						<span className="text-blue-500 font-bold">.kiosk.com</span>
					</div>
					<span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
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
			<div className="relative w-full h-24 rounded-xl bg-gray-50 border border-gray-200 p-3.5 flex items-center justify-between overflow-hidden group-hover:border-blue-200 transition-colors">
				<div className="flex items-center gap-3 z-10">
					<div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
						<svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
						</svg>
					</div>
					<div>
						<div className="text-[11px] font-mono font-bold text-gray-900 tracking-wide uppercase">256-Bit SSL</div>
						<div className="text-[10px] text-gray-500 font-mono">99.99% Uptime SLA</div>
					</div>
				</div>
				<div className="z-10 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg text-[9px] font-mono font-bold text-emerald-700 flex items-center gap-1">
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
			<div className="relative w-full h-24 rounded-xl bg-gray-50 border border-gray-200 p-3.5 flex items-center justify-around overflow-hidden group-hover:border-blue-200 transition-colors">
				{/* Desktop Frame */}
				<div className="z-10 w-24 rounded-lg border border-gray-300 bg-white p-1.5 flex flex-col gap-1 shadow-sm group-hover:border-blue-300 transition-colors">
					<div className="w-full h-1 bg-blue-500/60 rounded-full" />
					<div className="space-y-1">
						<div className="w-3/4 h-1 bg-gray-200 rounded" />
						<div className="w-1/2 h-1 bg-blue-300/60 rounded" />
					</div>
					<div className="w-full flex justify-end">
						<div className="w-2.5 h-1 bg-blue-500 rounded" />
					</div>
				</div>
				<div className="z-10 text-gray-400 font-mono text-xs font-bold">::</div>
				{/* Mobile Frame */}
				<div className="z-10 w-9 h-16 rounded-lg border border-gray-300 bg-white p-1 flex flex-col justify-between shadow-sm group-hover:border-blue-300 transition-colors">
					<div className="w-3 h-0.5 bg-gray-300 mx-auto rounded-full" />
					<div className="space-y-1">
						<div className="w-full h-1 bg-blue-400/60 rounded" />
						<div className="w-2/3 h-1 bg-gray-200 rounded" />
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
			<div className="relative w-full h-24 rounded-xl bg-gray-50 border border-gray-200 p-3 flex flex-col justify-between overflow-hidden group-hover:border-blue-200 transition-colors">
				<div className="flex items-center justify-between z-10">
					<span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
						&lt;meta name=&quot;og:title&quot;&gt;
					</span>
					<span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
						INDEXED
					</span>
				</div>
				<div className="z-10 bg-white border border-gray-200 rounded-lg px-3 py-1.5 flex items-center justify-between shadow-sm">
					<div className="space-y-0.5">
						<div className="text-[11px] font-bold text-gray-900 truncate">Your Business | Kiosk</div>
						<div className="text-[9px] font-mono text-gray-400">sitemap.xml · Google Verified</div>
					</div>
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
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
			<div className="relative w-full h-24 rounded-xl bg-gray-50 border border-gray-200 p-3.5 flex items-center justify-between overflow-hidden group-hover:border-blue-200 transition-colors">
				<div className="flex items-center gap-3 z-10">
					<div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
						<svg className="w-5 h-5 text-blue-600 group-hover:rotate-180 transition-transform duration-700 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
					</div>
					<div>
						<div className="text-[11px] font-mono font-bold text-gray-900 tracking-wide uppercase">Draft & Tweaks</div>
						<div className="text-[10px] text-gray-500 font-mono">100% Sync Guarantee</div>
					</div>
				</div>
				<div className="z-10 bg-blue-50 border border-blue-200 px-2 py-1 rounded-lg text-[9px] font-mono font-bold text-blue-700">
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
			<div className="relative w-full h-24 rounded-xl bg-gray-50 border border-gray-200 p-3 flex flex-col justify-between overflow-hidden group-hover:border-blue-200 transition-colors">
				<div className="flex items-center justify-between z-10">
					<span className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-wider">DNS ROUTING</span>
					<span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">CONNECTED</span>
				</div>
				<div className="z-10 bg-white border border-gray-200 rounded-lg px-3 py-1.5 flex items-center justify-between shadow-sm">
					<span className="text-xs font-mono font-bold text-gray-900 truncate">yourdomain.com</span>
					<div className="flex items-center gap-1 font-mono text-xs text-gray-400">
						<span>→</span>
						<span className="text-emerald-600 font-bold">✓</span>
					</div>
				</div>
			</div>
		),
	},
];

export default function StandardGuarantee() {
	return (
		<section className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
			{/* Section Header */}
			<div className="max-w-2xl mb-14">
				<ScrollReveal direction="up">
					<p className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-3">
						Standard Guarantee · 100% Included
					</p>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={80}>
					<h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold font-nohemi text-gray-900 tracking-tight leading-tight mb-4">
						Included in every<br className="hidden sm:inline" /> Kiosk tier
					</h2>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={160}>
					<p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed">
						No hidden hosting fees or technical surprises. Everything you need to launch safely, securely, and professionally is built in from day one.
					</p>
				</ScrollReveal>
			</div>

			{/* Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
				{GUARANTEE_FEATURES.map((feat, index) => (
					<ScrollReveal key={feat.id} direction="up" delay={index * 80}>
						<motion.div
							whileHover={{ y: -6, scale: 1.012 }}
							transition={{ type: "spring", stiffness: 320, damping: 22 }}
							className="group h-full p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex flex-col justify-between">
							<div className="space-y-3.5 sm:space-y-4">
								{/* Header */}
								<div className="flex items-center justify-between">
									<span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-gray-100 text-gray-500 border border-gray-200/60">
										{feat.badgeText}
									</span>
									<span className="font-mono text-xs font-bold text-gray-300 group-hover:text-blue-500 transition-colors">
										{feat.number}
									</span>
								</div>

								{/* Micro-UI Visual */}
								<div>
									{feat.renderVisual()}
								</div>

								{/* Text */}
								<div className="space-y-1">
									<h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
										{feat.title}
									</h3>
									<p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
										{feat.desc}
									</p>
								</div>
							</div>

							{/* Footer */}
							<div className="pt-3.5 sm:pt-4 mt-4 sm:mt-5 border-t border-gray-100 flex items-center justify-between">
								<div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[10px] sm:text-[11px]">
									<span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
									<span>Zero extra cost</span>
								</div>
								<span className="font-mono text-[9px] sm:text-[10px] text-gray-300 uppercase">STANDARD</span>
							</div>
						</motion.div>
					</ScrollReveal>
				))}
			</div>

			{/* Bottom Banner */}
			<ScrollReveal direction="up" delay={400}>
				<div className="mt-10 sm:mt-12 rounded-2xl bg-white border border-gray-200/90 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm text-center sm:text-left">
					<div className="flex flex-col sm:flex-row items-center gap-3.5">
						<div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold font-mono text-sm">
							100%
						</div>
						<div>
							<h4 className="text-xs sm:text-sm font-bold text-gray-900">All features included across every tier</h4>
							<p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">No surprise platform add-ons or hidden recurring fees.</p>
						</div>
					</div>
					<div className="shrink-0 w-full sm:w-auto bg-gray-900 text-white text-xs font-bold font-mono px-4 py-2.5 rounded-xl tracking-wider text-center">
						INCLUDED · ALWAYS
					</div>
				</div>
			</ScrollReveal>
		</section>
	);
}
