/** @format */

"use client";

import React, { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import PillButton from "@/components/PillButton";
import { Globe, Zap, ShoppingBag, CheckCircle2 } from "lucide-react";

export default function ServiceTiers() {
	const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
		"monthly",
	);

	return (
		<section
			id="services-tiers"
			className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 md:space-y-24">
			{/* Billing Toggle Banner */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs">
				<div>
					<h3 className="text-lg font-bold font-nohemi text-gray-900">
						Transparent Pricing Architecture
					</h3>
					<p className="text-xs text-gray-500 font-medium mt-0.5">
						One-time setup fee + hosting & maintenance (billed monthly or annually with 20% discount).
					</p>
				</div>

				<div className="inline-flex items-center p-1 rounded-xl bg-gray-100 border border-gray-200 shrink-0">
					<button
						type="button"
						onClick={() => setBillingCycle("monthly")}
						className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
							billingCycle === "monthly"
								? "bg-white text-gray-900 shadow-xs"
								: "text-gray-500 hover:text-gray-900"
						}`}>
						Monthly
					</button>
					<button
						type="button"
						onClick={() => setBillingCycle("yearly")}
						className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
							billingCycle === "yearly"
								? "bg-blue-600 text-white shadow-xs"
								: "text-gray-500 hover:text-gray-900"
						}`}>
						<span>Yearly</span>
						<span
							className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold uppercase ${
								billingCycle === "yearly"
									? "bg-white/20 text-white"
									: "bg-emerald-100 text-emerald-700"
							}`}>
							Save 20%
						</span>
					</button>
				</div>
			</div>

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
									<div
										key={item}
										className="flex items-center gap-2 text-xs font-medium text-gray-700">
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
								Intake Form → Template Selection → Branding & Copy Personalization → Client Review → Live in 3-5 Days.
							</p>
						</div>

						<div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
							<div>
								<div className="flex items-baseline gap-1.5">
									<span className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900">
										{billingCycle === "yearly" ? "$192" : "$20"}
									</span>
									<span className="text-xs font-semibold text-gray-500">
										{billingCycle === "yearly" ? "/ year" : "/ month"}
									</span>
								</div>
								<span className="text-[11px] text-gray-400 font-medium">
									{billingCycle === "yearly"
										? "Billed annually ($16/mo equivalent)"
										: "Cancel or upgrade anytime"}
								</span>
							</div>

							<PillButton
								href={`/checkout?plan=landing&billing=${billingCycle}`}
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

					{/* Tier 1 Mockup */}
					<div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 text-white space-y-4 shadow-xl border border-slate-800">
						<div className="flex items-center justify-between border-b border-slate-800 pb-3">
							<div className="flex items-center gap-1.5">
								<div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
								<div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
								<div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
							</div>
							<span className="text-[10px] text-slate-400 font-mono">
								mybusiness.kiosk.com
							</span>
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
								<span className="flex items-center gap-1">
									<Zap className="w-3 h-3 text-amber-400" />
									<span>Delivery: 3-5 Days</span>
								</span>
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
									"3-5 Connected sales pages",
									"Opt-in, Offer & Thank-you pages",
									"Lead capture & CRM integration",
									"Mailchimp / Email automation",
									"Meta Pixel & Google Analytics",
									"A/B Ready funnel structure",
								].map((item) => (
									<div
										key={item}
										className="flex items-center gap-2 text-xs font-medium text-gray-700">
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
								Offer Intake → Funnel Flow Mapping → Copy Integration → Analytics & Email Setup → Live in 3-5 Days.
							</p>
						</div>

						<div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
							<div>
								<div className="flex items-baseline gap-1.5">
									<span className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900">
										{billingCycle === "yearly" ? "$288" : "$30"}
									</span>
									<span className="text-xs font-semibold text-gray-500">
										{billingCycle === "yearly" ? "/ year" : "/ month"}
									</span>
								</div>
								<span className="text-[11px] text-gray-400 font-medium">
									{billingCycle === "yearly"
										? "Billed annually ($24/mo equivalent)"
										: "Cancel or upgrade anytime"}
								</span>
							</div>

							<PillButton
								href={`/checkout?plan=funnel&billing=${billingCycle}`}
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

					{/* Tier 2 Diagram */}
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
									<div
										key={item}
										className="flex items-center gap-2 text-xs font-medium text-gray-700">
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
								Product Intake → Storefront Design → Payment Gateway Wiring → Test Purchase Validation → Live in 5-10 Days.
							</p>
						</div>

						<div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
							<div>
								<div className="flex items-baseline gap-1.5">
									<span className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900">
										{billingCycle === "yearly" ? "$408" : "$43"}
									</span>
									<span className="text-xs font-semibold text-gray-500">
										{billingCycle === "yearly" ? "/ year" : "/ month"}
									</span>
								</div>
								<span className="text-[11px] text-gray-400 font-medium">
									{billingCycle === "yearly"
										? "Billed annually ($34/mo equivalent)"
										: "Cancel or upgrade anytime"}
								</span>
							</div>

							<PillButton
								href={`/checkout?plan=store&billing=${billingCycle}`}
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

					{/* Tier 3 Store Preview */}
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
	);
}
