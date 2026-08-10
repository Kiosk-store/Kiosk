/** @format */

"use client";

import React, { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import PillButton from "@/components/PillButton";
import LottiePlayer from "@/components/LottiePlayer";
import { Clock, ShieldCheck, Smartphone, Star } from "lucide-react";

interface Tab {
	id: string;
	label: string;
	src: string;
}

const HERO_LOTTIE_TABS: Tab[] = [
	{ id: "funnel", label: "Sales Funnel", src: "/lotties/funnel.json" },
	{ id: "landing", label: "Landing Page", src: "/lotties/A small shop.json" },
	{ id: "store", label: "E-commerce", src: "/lotties/shopping Ecommerce.json" },
];

export default function ServicesHero() {
	const [activeHeroLottie, setActiveHeroLottie] = useState<string>(
		"/lotties/funnel.json",
	);

	return (
		<section className="relative pt-32 pb-20 md:pt-44 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
			{/* Background Architectural Grid Lines */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

			{/* Corner Technical Accents */}
			<div className="absolute top-36 left-4 sm:left-8 hidden md:flex items-center gap-2 font-mono text-[10px] text-gray-400 select-none pointer-events-none">
				<span>+</span>
				<span className="w-12 h-px bg-gray-200" />
				<span>SYS_REF // 01</span>
			</div>

			<div className="absolute top-36 right-4 sm:right-8 hidden md:flex items-center gap-2 font-mono text-[10px] text-gray-400 select-none pointer-events-none">
				<span>SPEC_BUILD</span>
				<span className="w-12 h-px bg-gray-200" />
				<span>+</span>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
				{/* Left Column: Text & CTAs */}
				<div className="lg:col-span-7 space-y-6 text-left">
					<ScrollReveal>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200/90 text-gray-700 text-[11px] font-mono tracking-wider shadow-2xs">
							<span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
							<span className="font-bold text-blue-600">[ 01 ]</span>
							<span className="text-gray-400">|</span>
							<span>TURNKEY WEBSITE PACKAGES</span>
						</div>
					</ScrollReveal>

					<ScrollReveal delay={0.1}>
						<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-nohemi tracking-tight text-gray-900 leading-[1.12]">
							Professional websites,
							<br className="hidden sm:inline" />{" "}
							<span className="text-blue-600">built for you.</span>
						</h1>
					</ScrollReveal>

					<ScrollReveal delay={0.2}>
						<p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl">
							Kiosk doesn&apos;t hand you a complicated editor and wish you luck.
							We take your business details, pick the right pre-built design,
							personalize it with your content and branding, and hand you a live site,{" "}
							<strong className="text-gray-900 font-bold">ready to take customers in days.</strong>
						</p>
					</ScrollReveal>

					<ScrollReveal delay={0.25}>
						<div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
							{[
								{ icon: Clock, text: "3–5 Days Turnaround" },
								{ icon: ShieldCheck, text: "SSL & Hosting Included" },
								{ icon: Smartphone, text: "100% Mobile Ready" },
							].map((item) => {
								const Icon = item.icon;
								return (
									<div
										key={item.text}
										className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-white border border-gray-200/90 text-[11px] sm:text-xs font-semibold text-gray-700 shadow-2xs">
										<div className="w-1.5 h-1.5 rounded-full bg-blue-600/70 shrink-0" />
										<Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
										<span>{item.text}</span>
									</div>
								);
							})}
						</div>
					</ScrollReveal>

					<ScrollReveal delay={0.3}>
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 max-w-md sm:max-w-none">
							<PillButton
								href="/checkout?plan=landing"
								baseColor="#004ac6"
								circleColor="#ffffff"
								textColor="#ffffff"
								hoverTextColor="#004ac6"
								useThunderFont={true}
								className="w-full sm:w-auto px-7 py-3.5 text-xs font-bold border border-blue-600 shadow-md text-center">
								Start Your Project Now
							</PillButton>

							<a
								href="#services-tiers"
								className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200/90 text-xs font-semibold text-gray-700 transition-colors text-center">
								Explore Service Tiers ↓
							</a>
						</div>
					</ScrollReveal>
				</div>

				{/* Right Column: Interactive Lottie Showcase */}
				<div className="lg:col-span-5 relative">
					<div className="absolute -inset-2 rounded-[32px] border border-blue-200/50 pointer-events-none -z-10 hidden sm:block" />

					<ScrollReveal delay={0.2} direction="up">
						<div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 md:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[360px] sm:min-h-[440px]">
							{/* Lottie Tabs */}
							<div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3 sm:pb-4 sm:mb-4">
								<div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-[80vw] sm:max-w-none">
									{HERO_LOTTIE_TABS.map((tab) => (
										<button
											key={tab.id}
											type="button"
											onClick={() => setActiveHeroLottie(tab.src)}
											className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
												activeHeroLottie === tab.src
													? "bg-blue-600 text-white shadow-xs"
													: "bg-slate-800 text-slate-400 hover:text-white"
											}`}>
											{tab.label}
										</button>
									))}
								</div>

								<div className="flex items-center gap-1 shrink-0 font-mono text-[10px] text-slate-500">
									<span>+</span>
								</div>
							</div>

							{/* Lottie Canvas */}
							<div className="relative flex-1 flex items-center justify-center py-4">
								<LottiePlayer
									src={activeHeroLottie}
									className="w-full h-56 sm:h-64 object-contain"
									loop={true}
									autoplay={true}
								/>

								<div className="absolute bottom-2 left-2 bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-2xl px-3.5 py-2 flex items-center gap-2 shadow-lg">
									<div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
									<span className="text-[11px] font-bold text-slate-200">
										Done-For-You Build
									</span>
								</div>
							</div>

							{/* Footer status */}
							<div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
								<div className="flex items-center gap-1 text-amber-400">
									<Star className="w-3.5 h-3.5 fill-current" />
									<span className="font-bold text-white text-[11px]">5.0 Rated Build Service</span>
								</div>
								<span className="text-[11px] font-mono text-blue-400">LIVE PREVIEW</span>
							</div>
						</div>
					</ScrollReveal>
				</div>
			</div>
		</section>
	);
}
