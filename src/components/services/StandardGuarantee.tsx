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
	gradient: string;
	borderGlow: string;
	badgeBg: string;
	badgeTextColors: string;
	renderVisual: () => React.ReactNode;
}

const GUARANTEE_FEATURES: GuaranteeFeature[] = [
	{
		id: "subdomain",
		number: "01",
		title: "Free Kiosk Subdomain",
		badgeText: "SUBDOMAIN",
		desc: "Launch immediately on your own custom subdomain (yourname.kiosk.com) with zero setup friction.",
		gradient: "from-blue-600 to-indigo-600",
		borderGlow: "hover:border-blue-500/40 hover:shadow-blue-500/10",
		badgeBg: "bg-blue-50 border-blue-200/80",
		badgeTextColors: "text-blue-600",
		renderVisual: () => (
			<div className="relative w-full h-24 rounded-2xl bg-gradient-to-br from-blue-900/90 via-slate-900 to-indigo-950 p-3.5 flex flex-col justify-between overflow-hidden border border-blue-500/20 shadow-inner group-hover:border-blue-400/40 transition-colors">
				{/* Ambient Glow */}
				<div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />
				{/* Top Browser Bar */}
				<div className="flex items-center justify-between z-10">
					<div className="flex items-center gap-1.5">
						<span className="w-2 h-2 rounded-full bg-rose-500/80" />
						<span className="w-2 h-2 rounded-full bg-amber-500/80" />
						<span className="w-2 h-2 rounded-full bg-emerald-500/80" />
					</div>
					<div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
						<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
						<span className="text-[9px] font-mono font-bold text-emerald-300">LIVE SSL</span>
					</div>
				</div>
				{/* Domain Bar Illustration */}
				<div className="z-10 bg-slate-800/90 border border-blue-400/30 rounded-xl px-3 py-1.5 flex items-center justify-between shadow-md">
					<div className="flex items-center gap-2 text-xs font-mono text-blue-200 truncate">
						<span className="text-blue-400 font-bold">https://</span>
						<span className="text-white font-bold tracking-tight">yourname</span>
						<span className="text-blue-400 font-bold">.kiosk.com</span>
					</div>
					<svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
					</svg>
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
		gradient: "from-emerald-500 to-teal-600",
		borderGlow: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
		badgeBg: "bg-emerald-50 border-emerald-200/80",
		badgeTextColors: "text-emerald-700",
		renderVisual: () => (
			<div className="relative w-full h-24 rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-3.5 flex items-center justify-between overflow-hidden border border-emerald-500/20 shadow-inner group-hover:border-emerald-400/40 transition-colors">
				{/* Ambient Glow */}
				<div className="absolute -bottom-6 -left-6 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
				{/* Security Shield Icon Visual */}
				<div className="flex items-center gap-3 z-10">
					<div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-950/50">
						<div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
							<svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
						</div>
					</div>
					<div>
						<div className="text-[11px] font-mono font-bold text-emerald-300 tracking-wide uppercase">256-Bit SSL</div>
						<div className="text-[10px] text-slate-400 font-medium">99.99% Uptime SLA</div>
					</div>
				</div>
				{/* Status Chip */}
				<div className="z-10 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold text-emerald-300 flex items-center gap-1.5 shadow-sm">
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
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
		gradient: "from-purple-600 to-violet-600",
		borderGlow: "hover:border-purple-500/40 hover:shadow-purple-500/10",
		badgeBg: "bg-purple-50 border-purple-200/80",
		badgeTextColors: "text-purple-700",
		renderVisual: () => (
			<div className="relative w-full h-24 rounded-2xl bg-gradient-to-br from-purple-950 via-slate-900 to-violet-950 p-3.5 flex items-center justify-around overflow-hidden border border-purple-500/20 shadow-inner group-hover:border-purple-400/40 transition-colors">
				{/* Ambient Glow */}
				<div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/15 rounded-full blur-xl pointer-events-none" />
				{/* Desktop Mockup */}
				<div className="z-10 w-24 h-15 rounded-lg border border-purple-400/30 bg-slate-800/90 p-1.5 flex flex-col justify-between shadow-md group-hover:scale-105 transition-transform duration-300">
					<div className="w-full h-1 bg-purple-500/50 rounded-full" />
					<div className="space-y-1">
						<div className="w-3/4 h-1 bg-slate-600 rounded" />
						<div className="w-1/2 h-1 bg-purple-400/60 rounded" />
					</div>
					<div className="w-full flex justify-end">
						<div className="w-3 h-1.5 bg-purple-500 rounded-xs" />
					</div>
				</div>
				{/* Connection Indicator */}
				<div className="z-10 text-purple-400 font-mono text-xs font-bold">⇄</div>
				{/* Mobile Mockup */}
				<div className="z-10 w-9 h-16 rounded-lg border border-purple-400/40 bg-slate-800/90 p-1 flex flex-col justify-between shadow-md group-hover:scale-105 transition-transform duration-300">
					<div className="w-3 h-0.5 bg-slate-600 mx-auto rounded-full" />
					<div className="space-y-1">
						<div className="w-full h-1 bg-purple-400/70 rounded" />
						<div className="w-2/3 h-1 bg-slate-600 rounded" />
					</div>
					<div className="w-1.5 h-1.5 rounded-full bg-purple-500 mx-auto" />
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
		gradient: "from-amber-500 to-orange-600",
		borderGlow: "hover:border-amber-500/40 hover:shadow-amber-500/10",
		badgeBg: "bg-amber-50 border-amber-200/80",
		badgeTextColors: "text-amber-700",
		renderVisual: () => (
			<div className="relative w-full h-24 rounded-2xl bg-gradient-to-br from-amber-950 via-slate-900 to-orange-950 p-3.5 flex flex-col justify-between overflow-hidden border border-amber-500/20 shadow-inner group-hover:border-amber-400/40 transition-colors">
				{/* Ambient Glow */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
				{/* SEO Tag Pills */}
				<div className="flex items-center justify-between z-10">
					<span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
						&lt;meta name=&quot;og:title&quot;&gt;
					</span>
					<span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded-md">
						INDEXED
					</span>
				</div>
				{/* Search Result Snippet */}
				<div className="z-10 bg-slate-800/90 border border-amber-400/30 rounded-xl px-3 py-1.5 flex items-center justify-between shadow-md">
					<div className="space-y-0.5">
						<div className="text-[11px] font-bold text-amber-300 truncate">Your Business Name | Kiosk</div>
						<div className="text-[9px] font-mono text-slate-400">sitemap.xml • Google Verified</div>
					</div>
					<svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
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
		gradient: "from-cyan-500 to-blue-600",
		borderGlow: "hover:border-cyan-500/40 hover:shadow-cyan-500/10",
		badgeBg: "bg-cyan-50 border-cyan-200/80",
		badgeTextColors: "text-cyan-700",
		renderVisual: () => (
			<div className="relative w-full h-24 rounded-2xl bg-gradient-to-br from-cyan-950 via-slate-900 to-blue-950 p-3.5 flex items-center justify-between overflow-hidden border border-cyan-500/20 shadow-inner group-hover:border-cyan-400/40 transition-colors">
				{/* Ambient Glow */}
				<div className="absolute -bottom-4 right-0 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl pointer-events-none" />
				{/* Sync Icon Circle */}
				<div className="flex items-center gap-3 z-10">
					<div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 p-0.5 shadow-lg shadow-cyan-950/50">
						<div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
							<svg className="w-6 h-6 text-cyan-400 group-hover:rotate-180 transition-transform duration-700 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
						</div>
					</div>
					<div>
						<div className="text-[11px] font-mono font-bold text-cyan-300 tracking-wide uppercase">Draft & Tweaks</div>
						<div className="text-[10px] text-slate-400 font-medium">100% Satisfaction Sync</div>
					</div>
				</div>
				{/* Status Chip */}
				<div className="z-10 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold text-cyan-300">
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
		gradient: "from-rose-500 to-pink-600",
		borderGlow: "hover:border-rose-500/40 hover:shadow-rose-500/10",
		badgeBg: "bg-rose-50 border-rose-200/80",
		badgeTextColors: "text-rose-700",
		renderVisual: () => (
			<div className="relative w-full h-24 rounded-2xl bg-gradient-to-br from-rose-950 via-slate-900 to-pink-950 p-3.5 flex flex-col justify-between overflow-hidden border border-rose-500/20 shadow-inner group-hover:border-rose-400/40 transition-colors">
				{/* Ambient Glow */}
				<div className="absolute top-0 left-0 w-24 h-24 bg-rose-500/15 rounded-full blur-xl pointer-events-none" />
				{/* Top Status */}
				<div className="flex items-center justify-between z-10">
					<span className="text-[10px] font-mono font-bold text-rose-300 uppercase tracking-wider">DNS ROUTING</span>
					<span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">CONNECTED</span>
				</div>
				{/* Domain Connection Mapping */}
				<div className="z-10 bg-slate-800/90 border border-rose-400/30 rounded-xl px-3 py-1.5 flex items-center justify-between shadow-md">
					<span className="text-xs font-mono font-bold text-white truncate">yourdomain.com</span>
					<div className="flex items-center gap-1 text-rose-400 font-mono text-xs">
						<span>➔</span>
						<span className="text-emerald-400">✓</span>
					</div>
				</div>
			</div>
		),
	},
];

export default function StandardGuarantee() {
	return (
		<section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
			{/* Ambient Architectural Background Grid & Glows */}
			<div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
			<div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
			<div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

			{/* Section Header */}
			<div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
				<ScrollReveal direction="up">
					<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-mono tracking-wider font-bold shadow-2xs mb-4">
						<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
						<span>STANDARD GUARANTEE</span>
						<span className="text-emerald-300">|</span>
						<span>100% INCLUDED</span>
					</div>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={100}>
					<h2 className="text-3xl sm:text-5xl font-bold font-nohemi text-slate-900 tracking-tight mt-1 mb-4 leading-tight">
						Included in Every Single Kiosk Tier
					</h2>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={200}>
					<p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
						No hidden hosting fees or technical surprises. Everything you need to launch safely, securely, and professionally is built in from day one.
					</p>
				</ScrollReveal>
			</div>

			{/* Animated Interactive Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
				{GUARANTEE_FEATURES.map((feat, index) => (
					<ScrollReveal key={feat.id} direction="up" delay={index * 80}>
						<motion.div
							whileHover={{ y: -8, scale: 1.015 }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
							className={`group relative p-6 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${feat.borderGlow}`}>
							{/* Card Background Glow effect on hover */}
							<div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-50/50 to-white pointer-events-none -z-10" />

							{/* Header Row of Card */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${feat.badgeBg} ${feat.badgeTextColors}`}>
										{feat.badgeText}
									</span>
									<span className="font-mono text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
										[ {feat.number} ]
									</span>
								</div>

								{/* Custom Micro Visual Component */}
								<div className="pt-1">
									{feat.renderVisual()}
								</div>

								{/* Title & Description */}
								<div className="space-y-2 pt-2">
									<h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
										{feat.title}
									</h3>
									<p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
										{feat.desc}
									</p>
								</div>
							</div>

							{/* Bottom Guarantee Indicator */}
							<div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400">
								<div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
									<svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
									</svg>
									<span>Zero Extra Cost</span>
								</div>
								<span className="font-mono text-[10px] text-slate-400">STANDARD</span>
							</div>
						</motion.div>
					</ScrollReveal>
				))}
			</div>

			{/* Bottom Trust Banner */}
			<ScrollReveal direction="up" delay={500}>
				<div className="mt-16 max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-4 sm:p-6 border border-slate-800 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
							<span className="text-blue-400 font-mono text-lg font-bold">⚡</span>
						</div>
						<div>
							<h4 className="text-sm font-bold text-white">All features included in basic, standard & premium tiers</h4>
							<p className="text-xs text-slate-400 font-medium">No surprise setup add-ons or hidden recurring platform costs.</p>
						</div>
					</div>
					<div className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono px-4 py-2 rounded-xl transition-colors cursor-default shadow-xs">
						100% INCLUDED
					</div>
				</div>
			</ScrollReveal>
		</section>
	);
}

