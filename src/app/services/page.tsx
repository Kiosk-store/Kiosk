/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import PillButton from "@/components/PillButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/HowItWorks";
import LottiePlayer from "@/components/LottiePlayer";
import CTA from "@/components/CTA";
import {
	Globe,
	Zap,
	ShoppingBag,
	CheckCircle2,
	ArrowRight,
	Sparkles,
	Clock,
	Layers,
	ShieldCheck,
	Plus,
	HelpCircle,
	MessageSquare,
	PhoneCall,
	FileText,
	Lock,
	Smartphone,
	Search,
	RefreshCw,
	TrendingUp,
	ExternalLink,
	Star,
} from "lucide-react";

export default function ServicesPage() {
	const [activeQuizChoice, setActiveQuizChoice] = useState<string | null>(null);
	const [activeHeroLottie, setActiveHeroLottie] = useState<string>(
		"/lotties/funnel.json",
	);

	const heroLottieTabs = [
		{ id: "funnel", label: "Sales Funnel", src: "/lotties/funnel.json" },
		{ id: "landing", label: "Landing Page", src: "/lotties/A small shop.json" },
		{ id: "store", label: "E-commerce", src: "/lotties/shopping Ecommerce.json" },
	];

	return (
		<main className="min-h-screen bg-[#f8fafc] w-full overflow-x-hidden text-gray-900">
			<Navbar />

			{/* ==========================================
          SECTION 1: HERO INTRO & HIGH-LEVEL FRAME (CREATIVE MINIMAL LINES & OBJECTS)
      ========================================== */}
			<section className="relative pt-32 pb-20 md:pt-44 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
				{/* Background Architectural Grid Lines */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

				{/* Corner Technical Crosshair Accent Lines */}
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
							<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-nohemi tracking-tight text-gray-900 leading-[1.08]">
								Professional websites,
								<br />
								<span className="text-blue-600">built for you.</span>
							</h1>
						</ScrollReveal>

						{/* High-level framing statement */}
						<ScrollReveal delay={0.2}>
							<p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl">
								Kiosk doesn&apos;t hand you a complicated editor and wish you luck.
								We take your business details, pick the right pre-built design,
								personalize it with your content and branding, and hand you a live site,{" "}
								<strong className="text-gray-900 font-bold">ready to take customers in days.</strong>
							</p>
						</ScrollReveal>

						{/* Value Guarantee Pills with Minimal Nodes */}
						<ScrollReveal delay={0.25}>
							<div className="flex flex-wrap items-center gap-3 pt-1">
								{[
									{ icon: Clock, text: "3–5 Days Turnaround" },
									{ icon: ShieldCheck, text: "SSL & Hosting Included" },
									{ icon: Smartphone, text: "100% Mobile Ready" },
								].map((item) => {
									const Icon = item.icon;
									return (
										<div
											key={item.text}
											className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-gray-200/90 text-xs font-semibold text-gray-700 shadow-2xs">
											<div className="w-1.5 h-1.5 rounded-full bg-blue-600/70" />
											<Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
											<span>{item.text}</span>
										</div>
									);
								})}
							</div>
						</ScrollReveal>

						<ScrollReveal delay={0.3}>
							<div className="flex flex-wrap items-center gap-4 pt-4">
								<PillButton
									href="/get-started"
									baseColor="#004ac6"
									circleColor="#ffffff"
									textColor="#ffffff"
									hoverTextColor="#004ac6"
									useThunderFont={true}
									className="px-8 py-3.5 text-xs font-bold border border-blue-600 shadow-md">
									Start Your Project Now
								</PillButton>

								<a
									href="#services-tiers"
									className="px-6 py-3.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200/90 text-xs font-semibold text-gray-700 transition-colors">
									Explore Service Tiers ↓
								</a>
							</div>
						</ScrollReveal>
					</div>

					{/* Right Column: Lottie Interactive Showcase Container with Architectural Frame */}
					<div className="lg:col-span-5 relative">
						{/* Background Offset Framing Lines */}
						<div className="absolute -inset-2 rounded-[32px] border border-blue-200/50 pointer-events-none -z-10" />

						<ScrollReveal delay={0.2} direction="up">
							<div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[440px]">
								{/* Top Lottie Selector Tabs */}
								<div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-4">
									<div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
										{heroLottieTabs.map((tab) => (
											<button
												key={tab.id}
												type="button"
												onClick={() => setActiveHeroLottie(tab.src)}
												className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
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

								{/* Interactive Lottie Animation Canvas */}
								<div className="relative flex-1 flex items-center justify-center py-4">
									<LottiePlayer
										src={activeHeroLottie}
										className="w-full h-56 sm:h-64 object-contain"
										loop={true}
										autoplay={true}
									/>

									{/* Minimal Node Badge */}
									<div className="absolute bottom-2 left-2 bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-2xl px-3.5 py-2 flex items-center gap-2 shadow-lg">
										<div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
										<span className="text-[11px] font-bold text-slate-200">
											Done-For-You Build
										</span>
									</div>
								</div>

								{/* Bottom Status Strip */}
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

			{/* ==========================================
          SECTION 2: THE THREE SERVICE TIERS (FULL DEEP DIVE SECTIONS)
      ========================================== */}
			<section id="services-tiers" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 md:space-y-24">
				
				{/* TIER 1: LANDING PAGE */}
				<ScrollReveal direction="up">
					<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative overflow-hidden">
						<div className="lg:col-span-7 space-y-6">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
									<Globe className="w-6 h-6" />
								</div>
								<div>
									<span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
										Tier 01
									</span>
									<h2 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 mt-0.5">
										Landing Page
									</h2>
								</div>
							</div>

							<div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
								<p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
									Who it&apos;s for:
								</p>
								<p className="text-xs text-gray-600 font-medium leading-relaxed">
									New businesses, local service providers, freelancers, and consultants who need an immediate, highly polished online presence to build credibility and land inquiries.
								</p>
							</div>

							<div>
								<p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
									What&apos;s included in this tier:
								</p>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
									{[
										"1 High-converting responsive page",
										"Hero, About, Services & Reviews",
										"Interactive Google Map & Address",
										"WhatsApp & Lead capture form",
										"Basic SEO meta tags & sitemap",
										"Free Kiosk subdomain hosting",
									].map((item) => (
										<div key={item} className="flex items-center gap-2 text-xs font-medium text-gray-700">
											<CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
											<span>{item}</span>
										</div>
									))}
								</div>
							</div>

							<div>
								<p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
									The Turnkey Process:
								</p>
								<p className="text-xs text-gray-500 font-medium leading-relaxed">
									Intake Form → Template Selection → Branding & Copy Personalization → Client Review → Live in 3–5 Days.
								</p>
							</div>

							<div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
								<div>
									<span className="text-2xl font-bold font-nohemi text-gray-900">$499</span>
									<span className="text-xs text-gray-400 font-medium ml-1">Setup + $20/mo hosting</span>
								</div>

								<PillButton
									href="/get-started?tier=landing"
									baseColor="#004ac6"
									circleColor="#ffffff"
									textColor="#ffffff"
									hoverTextColor="#004ac6"
									useThunderFont={true}
									className="px-6 py-2.5 text-xs font-bold border border-blue-600 shadow-xs">
									Start Landing Page
								</PillButton>
							</div>
						</div>

						{/* Tier 1 Visual Output Mockup */}
						<div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 text-white space-y-4 shadow-xl border border-slate-800">
							<div className="flex items-center justify-between border-b border-slate-800 pb-3">
								<div className="flex items-center gap-1.5">
									<div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
									<div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
									<div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
								</div>
								<span className="text-[10px] text-slate-400 font-mono">mybusiness.kiosk.com</span>
							</div>

							<div className="bg-slate-800/80 rounded-xl p-4 space-y-3">
								<span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold">
									LIVE LANDING PAGE OUTPUT
								</span>
								<h4 className="text-base font-bold font-nohemi text-white">
									Modern Service Business
								</h4>
								<p className="text-xs text-slate-400 leading-relaxed">
									Clean hero section, customer social proof, call-to-action button, and instant WhatsApp chat.
								</p>
								<div className="pt-2 flex items-center justify-between text-[11px] text-slate-300 font-medium">
									<span>⚡ Delivery: 3-5 Days</span>
									<span className="text-emerald-400 font-bold">100% Mobile Ready</span>
								</div>
							</div>
						</div>
					</div>
				</ScrollReveal>

				{/* TIER 2: SALES FUNNEL */}
				<ScrollReveal direction="up">
					<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative overflow-hidden">
						<div className="lg:col-span-7 space-y-6">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
									<Zap className="w-6 h-6" />
								</div>
								<div>
									<span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
										Tier 02
									</span>
									<h2 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 mt-0.5">
										Sales Funnel
									</h2>
								</div>
							</div>

							<div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
								<p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
									Who it&apos;s for:
								</p>
								<p className="text-xs text-gray-600 font-medium leading-relaxed">
									Businesses actively running Google/Meta ads or social traffic campaigns that need a multi-step conversion funnel to turn visitors into leads and customers.
								</p>
							</div>

							<div>
								<p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
									What&apos;s included in this tier:
								</p>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
									{[
										"3–5 Connected sales pages",
										"Opt-in, Offer & Thank-you pages",
										"Lead capture & CRM integration",
										"Mailchimp / Email automation",
										"Meta Pixel & Google Analytics",
										"A/B Ready funnel structure",
									].map((item) => (
										<div key={item} className="flex items-center gap-2 text-xs font-medium text-gray-700">
											<CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
											<span>{item}</span>
										</div>
									))}
								</div>
							</div>

							<div>
								<p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
									The Turnkey Process:
								</p>
								<p className="text-xs text-gray-500 font-medium leading-relaxed">
									Offer Intake → Funnel Flow Mapping → Copy Integration → Analytics & Email Setup → Live in 3–5 Days.
								</p>
							</div>

							<div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
								<div>
									<span className="text-2xl font-bold font-nohemi text-gray-900">$799</span>
									<span className="text-xs text-gray-400 font-medium ml-1">Setup + $35/mo hosting</span>
								</div>

								<PillButton
									href="/get-started?tier=funnel"
									baseColor="#004ac6"
									circleColor="#ffffff"
									textColor="#ffffff"
									hoverTextColor="#004ac6"
									useThunderFont={true}
									className="px-6 py-2.5 text-xs font-bold border border-blue-600 shadow-xs">
									Start Sales Funnel
								</PillButton>
							</div>
						</div>

						{/* Tier 2 Visual Diagram Flow */}
						<div className="lg:col-span-5 bg-purple-950 rounded-2xl p-6 text-white space-y-4 shadow-xl border border-purple-900">
							<span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
								MULTI-STEP FUNNEL FLOW DIAGRAM
							</span>

							<div className="space-y-3 pt-2">
								<div className="p-3 rounded-xl bg-purple-900/60 border border-purple-800 flex items-center justify-between text-xs font-bold">
									<span>1. High-Converting Opt-In Page</span>
									<span className="text-purple-300 font-mono">Lead Capture</span>
								</div>
								<div className="w-0.5 h-4 bg-purple-500/40 mx-auto" />
								<div className="p-3 rounded-xl bg-purple-900/60 border border-purple-800 flex items-center justify-between text-xs font-bold">
									<span>2. Core Offer & Video Sales Letter</span>
									<span className="text-purple-300 font-mono">Sales Page</span>
								</div>
								<div className="w-0.5 h-4 bg-purple-500/40 mx-auto" />
								<div className="p-3 rounded-xl bg-purple-900/60 border border-purple-800 flex items-center justify-between text-xs font-bold">
									<span>3. Thank You / Upsell Confirmation</span>
									<span className="text-emerald-400 font-mono">Conversion</span>
								</div>
							</div>
						</div>
					</div>
				</ScrollReveal>

				{/* TIER 3: E-COMMERCE STORE */}
				<ScrollReveal direction="up">
					<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative overflow-hidden">
						<div className="lg:col-span-7 space-y-6">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
									<ShoppingBag className="w-6 h-6" />
								</div>
								<div>
									<span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
										Tier 03
									</span>
									<h2 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 mt-0.5">
										E-commerce Store
									</h2>
								</div>
							</div>

							<div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
								<p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
									Who it&apos;s for:
								</p>
								<p className="text-xs text-gray-600 font-medium leading-relaxed">
									Brands selling physical or digital products online that need an effortless, secure checkout system with payment gateway processing.
								</p>
							</div>

							<div>
								<p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
									What&apos;s included in this tier:
								</p>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
									{[
										"Complete product catalog setup",
										"Slide-out cart drawer & checkout",
										"Stripe & Paystack payment integration",
										"Order email notifications",
										"Basic inventory tracking",
										"Product search & category tags",
									].map((item) => (
										<div key={item} className="flex items-center gap-2 text-xs font-medium text-gray-700">
											<CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
											<span>{item}</span>
										</div>
									))}
								</div>
							</div>

							<div>
								<p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
									The Turnkey Process:
								</p>
								<p className="text-xs text-gray-500 font-medium leading-relaxed">
									Product Intake → Storefront Design → Payment Gateway Wiring → Test Purchase Validation → Live in 5–10 Days.
								</p>
							</div>

							<div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
								<div>
									<span className="text-2xl font-bold font-nohemi text-gray-900">$1,199</span>
									<span className="text-xs text-gray-400 font-medium ml-1">Setup + $43/mo hosting</span>
								</div>

								<PillButton
									href="/get-started?tier=store"
									baseColor="#004ac6"
									circleColor="#ffffff"
									textColor="#ffffff"
									hoverTextColor="#004ac6"
									useThunderFont={true}
									className="px-6 py-2.5 text-xs font-bold border border-blue-600 shadow-xs">
									Start E-commerce Store
								</PillButton>
							</div>
						</div>

						{/* Tier 3 Visual Store Output */}
						<div className="lg:col-span-5 bg-emerald-950 rounded-2xl p-6 text-white space-y-4 shadow-xl border border-emerald-900">
							<span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
								E-COMMERCE STOREFRONT PREVIEW
							</span>

							<div className="grid grid-cols-2 gap-3 pt-2">
								<div className="bg-emerald-900/60 border border-emerald-800 rounded-xl p-3 text-center">
									<div className="w-full h-16 bg-emerald-800/80 rounded-lg mb-2 flex items-center justify-center font-bold text-xs">
										Product Photo
									</div>
									<p className="text-xs font-bold">Artisan Roast</p>
									<p className="text-[11px] text-emerald-300 font-mono">$24.00</p>
								</div>

								<div className="bg-emerald-900/60 border border-emerald-800 rounded-xl p-3 text-center">
									<div className="w-full h-16 bg-emerald-800/80 rounded-lg mb-2 flex items-center justify-center font-bold text-xs">
										Product Photo
									</div>
									<p className="text-xs font-bold">Espresso Blend</p>
									<p className="text-[11px] text-emerald-300 font-mono">$28.00</p>
								</div>
							</div>
						</div>
					</div>
				</ScrollReveal>
			</section>

			{/* ==========================================
          SECTION 3: HOW IT WORKS (ANIMATED SCROLL STACK)
      ========================================== */}
			<HowItWorks />

			{/* ==========================================
          SECTION 4: WHAT'S INCLUDED IN EVERY TIER (BASELINE GUARANTEE)
      ========================================== */}
			<section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
				<div className="text-center max-w-3xl mx-auto mb-14">
					<span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
						Standard Guarantee
					</span>
					<h2 className="text-3xl font-bold font-nohemi text-gray-900 mt-3 mb-2">
						Included in Every Single Kiosk Tier
					</h2>
					<p className="text-sm text-gray-500 font-medium">
						No hidden hosting fees or technical surprises. Everything you need to launch safely is built in.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{[
						{
							icon: Globe,
							title: "Free Kiosk Subdomain",
							desc: "Launch immediately on your own custom subdomain (yourname.kiosk.com).",
						},
						{
							icon: Lock,
							title: "SSL & Cloud Hosting Included",
							desc: "Enterprise SSL security certificate & ultra-fast cloud hosting included.",
						},
						{
							icon: Smartphone,
							title: "Mobile & Desktop Responsive",
							desc: "Looks stunning and functions flawlessly on every phone, tablet, and laptop.",
						},
						{
							icon: Search,
							title: "Basic SEO Setup",
							desc: "Meta title tags, Open Graph preview tags, and XML sitemap generated.",
						},
						{
							icon: RefreshCw,
							title: "Revision Rounds Included",
							desc: "Review your draft and request tweaks before your site officially goes live.",
						},
						{
							icon: ExternalLink,
							title: "Custom Domain Connection",
							desc: "Connect your own domain name (yourname.com) anytime with ease.",
						},
					].map((feat) => {
						const Icon = feat.icon;
						return (
							<div
								key={feat.title}
								className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-3">
								<div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
									<Icon className="w-5 h-5" />
								</div>
								<h3 className="text-base font-bold text-gray-900">{feat.title}</h3>
								<p className="text-xs text-gray-500 font-medium leading-relaxed">
									{feat.desc}
								</p>
							</div>
						);
					})}
				</div>
			</section>

			{/* ==========================================
          SECTION 5: ADD-ONS LIST
      ========================================== */}
			<section className="py-16 md:py-24 bg-slate-900 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center max-w-3xl mx-auto mb-14">
						<span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950 px-3 py-1 rounded-full border border-purple-800">
							Optional Bolt-Ons
						</span>
						<h2 className="text-3xl font-bold font-nohemi text-white mt-3 mb-2">
							Service Add-Ons
						</h2>
						<p className="text-sm text-slate-400 font-medium">
							Need extra pages, copywriting help, or fast delivery? Bolt these on to any tier.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{[
							{
								title: "Extra Pages",
								price: "$49 / page",
								desc: "Add extra custom subpages (e.g. Portfolio, Terms, Gallery) beyond tier limits.",
							},
							{
								title: "Custom Domain Setup",
								price: "$29 one-off",
								desc: "We register your custom domain (.com) and configure DNS records for you.",
							},
							{
								title: "Copywriting Support",
								price: "$149 one-off",
								desc: "Our copywriters draft high-converting headlines and sales copy for your offer.",
							},
							{
								title: "Managed Updates",
								price: "$35 / month",
								desc: "Post-launch content edits, text changes, and image updates handled by our team.",
							},
							{
								title: "Rush 48-Hour Delivery",
								price: "$199 one-off",
								desc: "Fast-track your project into our top priority 48-hour build queue.",
							},
						].map((addon) => (
							<div
								key={addon.title}
								className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
								<div>
									<div className="flex items-center justify-between mb-2">
										<h3 className="text-base font-bold text-white">{addon.title}</h3>
										<span className="text-xs font-bold font-nohemi text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-800">
											{addon.price}
										</span>
									</div>
									<p className="text-xs text-slate-400 font-medium leading-relaxed">
										{addon.desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ==========================================
          SECTION 6: NOT SURE WHICH TIER FITS? (DECISION HELPER)
      ========================================== */}
			<section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
				<div className="bg-white border border-gray-200/90 rounded-3xl p-8 sm:p-12 text-center shadow-xs">
					<span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
						Decision Helper
					</span>
					<h2 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 mt-3 mb-2">
						Not Sure Which Tier Fits Your Business?
					</h2>
					<p className="text-xs sm:text-sm text-gray-500 font-medium max-w-xl mx-auto mb-8">
						Select your primary business goal below to see our instant tier recommendation:
					</p>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
						{[
							{
								id: "presence",
								question: "Just need a simple, professional online presence?",
								recommendation: "Landing Page ($499)",
								href: "/get-started?tier=landing",
							},
							{
								id: "ads",
								question: "Running paid ads & email campaigns to convert leads?",
								recommendation: "Sales Funnel ($799)",
								href: "/get-started?tier=funnel",
							},
							{
								id: "store",
								question: "Selling physical products or digital downloads online?",
								recommendation: "E-commerce Store ($1,199)",
								href: "/get-started?tier=store",
							},
						].map((q) => (
							<button
								key={q.id}
								type="button"
								onClick={() => setActiveQuizChoice(q.id)}
								className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
									activeQuizChoice === q.id
										? "border-blue-600 bg-blue-50/70 shadow-xs"
										: "border-gray-200/90 bg-white hover:bg-gray-50"
								}`}>
								<p className="text-xs font-semibold text-gray-800 mb-3">
									{q.question}
								</p>
								<div className="flex items-center justify-between text-xs font-bold text-blue-600 pt-2 border-t border-gray-100">
									<span>➔ {q.recommendation}</span>
								</div>
							</button>
						))}
					</div>

					<div className="inline-flex items-center gap-2 text-xs font-medium text-gray-500">
						<HelpCircle className="w-4 h-4 text-blue-600" />
						<span>Still undecided? Talk directly with our team before committing.</span>
					</div>
				</div>
			</section>

			{/* ==========================================
          SECTION 7: FINAL CTA
      ========================================== */}
			<CTA />

			<Footer />
		</main>
	);
}
