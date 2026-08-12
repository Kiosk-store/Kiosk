/** @format */

"use client";

import React, { useState, useEffect } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import PillButton from "@/components/PillButton";
import LottiePlayer from "@/components/LottiePlayer";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ShieldCheck, Smartphone, CheckCircle2, ArrowRight } from "lucide-react";

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

// Heading broken into two lines — each word is its own span
const LINE_ONE = ["Professional", "websites,"];
const LINE_TWO = ["built", "for", "you."];

export default function ServicesHero() {
	const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
	const [isHovered, setIsHovered] = useState<boolean>(false);

	// Auto-slide every 3.2 seconds unless user hovers over showcase
	useEffect(() => {
		if (isHovered) return;

		const timer = setInterval(() => {
			setActiveTabIndex((prevIndex) => (prevIndex + 1) % HERO_LOTTIE_TABS.length);
		}, 3200);

		return () => clearInterval(timer);
	}, [isHovered]);

	const currentTab = HERO_LOTTIE_TABS[activeTabIndex];

	return (
		<section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden bg-white">
			{/* Architectural Grid Lines */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80 pointer-events-none" />

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
				{/* Left Column: Text & CTAs */}
				<div className="lg:col-span-7 space-y-6 text-left">
					<ScrollReveal direction="up" delay={0}>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-mono tracking-wider font-semibold shadow-2xs">
							<span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
							<span className="font-bold text-blue-600">[ 01 ]</span>
							<span className="text-blue-200">|</span>
							<span>TURNKEY WEBSITE PACKAGES</span>
						</div>
					</ScrollReveal>

					{/* Headline word-by-word stagger animation */}
					<motion.h1
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						variants={{
							hidden: { opacity: 0 },
							visible: {
								opacity: 1,
								transition: {
									staggerChildren: 0.1,
									delayChildren: 0.05,
								},
							},
						}}
						className="text-3xl sm:text-5xl md:text-6xl font-bold font-nohemi tracking-tight text-gray-900 leading-[1.12]">
						{/* Line one — dark words */}
						<span className="block">
							{LINE_ONE.map((word) => (
								<motion.span
									key={word}
									variants={{
										hidden: { opacity: 0, y: 24 },
										visible: {
											opacity: 1,
											y: 0,
											transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
										},
									}}
									className="inline-block mr-[0.25em]">
									{word}
								</motion.span>
							))}
						</span>
						{/* Line two — blue accent */}
						<span className="block text-blue-600">
							{LINE_TWO.map((word) => (
								<motion.span
									key={word}
									variants={{
										hidden: { opacity: 0, y: 24 },
										visible: {
											opacity: 1,
											y: 0,
											transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
										},
									}}
									className="inline-block mr-[0.2em]">
									{word}
								</motion.span>
							))}
						</span>
					</motion.h1>

					<ScrollReveal direction="up" delay={200}>
						<p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl">
							Kiosk doesn&apos;t hand you a complicated editor and wish you luck.
							We take your business details, pick the right pre-built design,
							personalize it with your content and branding, and hand you a live site,{" "}
							<strong className="text-gray-900 font-bold">ready to take customers in days.</strong>
						</p>
					</ScrollReveal>

					<ScrollReveal direction="up" delay={300}>
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
										className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200/80 text-[11px] sm:text-xs font-semibold text-gray-700 shadow-2xs">
										<Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
										<span>{item.text}</span>
									</div>
								);
							})}
						</div>
					</ScrollReveal>

					<ScrollReveal direction="up" delay={400}>
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 max-w-md sm:max-w-none">
							<PillButton
								href="/checkout?plan=landing"
								baseColor="#004ac6"
								circleColor="#ffffff"
								textColor="#ffffff"
								hoverTextColor="#004ac6"
								useThunderFont={true}
								className="w-full sm:w-auto px-7 py-3.5 text-xs font-bold border border-blue-600 shadow-sm text-center">
								Start Your Project Now
							</PillButton>

							<a
								href="#services-tiers"
								className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200/90 text-xs font-semibold text-gray-700 transition-colors text-center inline-flex items-center justify-center gap-1.5">
								<span>Explore Service Tiers</span>
								<ArrowRight className="w-3.5 h-3.5 text-gray-400" />
							</a>
						</div>
					</ScrollReveal>
				</div>

				{/* Right Column: Clean Interactive Showcase */}
				<div className="lg:col-span-5 relative">
					<ScrollReveal direction="up" delay={200}>
						<div
							onMouseEnter={() => setIsHovered(true)}
							onMouseLeave={() => setIsHovered(false)}
							className="bg-white border border-gray-200/90 rounded-3xl p-5 sm:p-7 text-gray-900 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[360px] sm:min-h-[440px]">
							{/* Lottie Tabs */}
							<div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3.5 mb-3.5">
								<div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-2xl border border-gray-200/60 max-w-[80vw] sm:max-w-none">
									{HERO_LOTTIE_TABS.map((tab, index) => (
										<button
											key={tab.id}
											type="button"
											onClick={() => setActiveTabIndex(index)}
											className={`relative px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
												activeTabIndex === index
													? "text-white"
													: "text-gray-600 hover:text-gray-900"
											}`}>
											{activeTabIndex === index && (
												<motion.span
													layoutId="activeHeroTab"
													className="absolute inset-0 bg-blue-600 rounded-xl -z-0 shadow-2xs"
													transition={{ type: "spring", stiffness: 400, damping: 30 }}
												/>
											)}
											<span className="relative z-10">{tab.label}</span>
										</button>
									))}
								</div>

								<div className="flex items-center gap-1 shrink-0 font-mono text-[10px] text-gray-400">
									<span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
									<span>AUTO</span>
								</div>
							</div>

							{/* Lottie Canvas Container with Slide Transition */}
							<div className="relative flex-1 flex items-center justify-center py-4 bg-gray-50/60 border border-gray-100 rounded-2xl overflow-hidden min-h-[240px]">
								<AnimatePresence mode="wait">
									<motion.div
										key={currentTab.src}
										initial={{ opacity: 0, x: 30, scale: 0.96 }}
										animate={{ opacity: 1, x: 0, scale: 1 }}
										exit={{ opacity: 0, x: -30, scale: 0.96 }}
										transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
										className="w-full h-full flex items-center justify-center">
										<LottiePlayer
											src={currentTab.src}
											className="w-full h-56 sm:h-64 object-contain"
											loop={true}
											autoplay={true}
										/>
									</motion.div>
								</AnimatePresence>

								<div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-xs z-10">
									<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
									<span className="text-[11px] font-bold text-gray-700">
										{currentTab.label} Build
									</span>
								</div>
							</div>

							{/* Footer status bar */}
							<div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
								<div className="flex items-center gap-1.5 text-blue-600">
									<CheckCircle2 className="w-4 h-4 text-blue-600" />
									<span className="font-bold text-gray-900 text-[11px]">Verified Build Service</span>
								</div>
								<span className="text-[11px] font-mono text-gray-400 uppercase">AUTO-SLIDE LIVE</span>
							</div>
						</div>
					</ScrollReveal>
				</div>
			</div>
		</section>
	);
}

