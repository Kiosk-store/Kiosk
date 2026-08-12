/** @format */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import PillButton from "@/components/PillButton";
import { CheckCircle2, Zap } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

const TIERS = [
	{
		id: "landing",
		index: "01",
		title: "Landing Page",
		planKey: "landing" as const,
		checkoutPlan: "landing",
		ctaLabel: "Start Landing Page",
		target: "New businesses, local service providers, freelancers, and consultants who need an immediate, highly polished online presence to build credibility and land inquiries.",
		process: "Intake Form → Template Selection → Branding & Copy Personalisation → Client Review → Live in 3–5 days.",
		deliveryLabel: "3–5 Days",
		features: [
			"1 High-converting responsive page",
			"Hero, About, Services & Reviews",
			"Interactive Google Map & Address",
			"WhatsApp & Lead capture form",
			"Basic SEO meta tags & sitemap",
			"Free Kiosk subdomain hosting",
		],
		panel: {
			label: "LIVE OUTPUT",
			title: "Modern Service Business",
			body: "Clean hero, customer social proof, call-to-action button, and instant WhatsApp chat.",
			stat: "100% Mobile Ready",
		},
	},
	{
		id: "funnel",
		index: "02",
		title: "Sales Funnel",
		planKey: "funnel" as const,
		checkoutPlan: "funnel",
		ctaLabel: "Start Sales Funnel",
		target: "Businesses actively running Google/Meta ads or social traffic campaigns that need a multi-step conversion funnel to turn visitors into leads and customers.",
		process: "Offer Intake → Funnel Flow Mapping → Copy Integration → Analytics & Email Setup → Live in 3–5 days.",
		deliveryLabel: "3–5 Days",
		features: [
			"3–5 Connected sales pages",
			"Opt-in, Offer & Thank-you pages",
			"Lead capture & CRM integration",
			"Mailchimp / Email automation",
			"Meta Pixel & Google Analytics",
			"A/B Ready funnel structure",
		],
		panel: {
			label: "FUNNEL FLOW",
			title: null,
			body: null,
			stat: null,
			steps: [
				{ label: "1. High-Converting Opt-In Page", tag: "Lead Capture" },
				{ label: "2. Core Offer & Video Sales Letter", tag: "Sales Page" },
				{ label: "3. Thank You / Upsell Confirmation", tag: "Conversion" },
			],
		},
	},
	{
		id: "store",
		index: "03",
		title: "E-commerce Store",
		planKey: "store" as const,
		checkoutPlan: "store",
		ctaLabel: "Start E-commerce Store",
		target: "Brands selling physical or digital products online that need an effortless, secure checkout system with payment gateway processing.",
		process: "Product Intake → Storefront Design → Payment Gateway Wiring → Test Purchase Validation → Live in 5–10 days.",
		deliveryLabel: "5–10 Days",
		features: [
			"Complete product catalogue setup",
			"Slide-out cart drawer & checkout",
			"Stripe & Paystack payment integration",
			"Order email notifications",
			"Basic inventory tracking",
			"Product search & category tags",
		],
		panel: {
			label: "STOREFRONT PREVIEW",
			title: null,
			body: null,
			stat: null,
			products: [
				{ name: "Artisan Roast", price: "$24.00" },
				{ name: "Espresso Blend", price: "$28.00" },
			],
		},
	},
];

export default function ServiceTiers() {
	const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
		"monthly",
	);
	const { formatPlanPrice, currency, isLoading } = useCurrency();

	return (
		<section
			id="services-tiers"
			className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 md:space-y-24">

			{/* Billing Toggle */}
			<ScrollReveal direction="up">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs">
					<div>
						<h3 className="text-lg font-bold font-nohemi text-gray-900">
							Transparent Pricing Architecture
						</h3>
						<p className="text-xs text-gray-500 font-medium mt-0.5">
							One-time setup fee + hosting & maintenance, billed monthly or annually with 20% off.
						</p>
					</div>

					<div className="relative inline-flex items-center p-1 rounded-xl bg-gray-100 border border-gray-200 shrink-0">
						<motion.span
							layoutId="billingPill"
							className={`absolute top-1 bottom-1 rounded-lg bg-white shadow-xs transition-all ${
								billingCycle === "monthly" ? "left-1 right-[calc(50%+2px)]" : "left-[calc(50%+2px)] right-1"
							}`}
						/>
						<button
							type="button"
							onClick={() => setBillingCycle("monthly")}
							className={`relative z-10 px-5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
								billingCycle === "monthly" ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
							}`}>
							Monthly
						</button>
						<button
							type="button"
							onClick={() => setBillingCycle("yearly")}
							className={`relative z-10 px-5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
								billingCycle === "yearly" ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
							}`}>
							<span>Yearly</span>
							<span className="text-[10px] px-1.5 py-0.5 rounded-full font-extrabold uppercase bg-blue-50 text-blue-600 border border-blue-100">
								−20%
							</span>
						</button>
					</div>
				</div>
			</ScrollReveal>

			{/* Tier Cards */}
			{TIERS.map((tier, tierIndex) => (
				<ScrollReveal key={tier.id} direction="up" delay={0}>
					<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch relative overflow-hidden">

						{/* Left: Content */}
						<div className="lg:col-span-7 space-y-6">

							{/* Tier Header */}
							<ScrollReveal direction="up" delay={80}>
								<div className="flex items-start gap-4">
									<div>
										<p className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1">
											Tier {tier.index}
										</p>
										<h2 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 leading-tight">
											{tier.title}
										</h2>
									</div>
								</div>
							</ScrollReveal>

							{/* Who it's for */}
							<ScrollReveal direction="up" delay={160}>
								<div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
									<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
										Who it&apos;s for
									</p>
									<p className="text-sm text-gray-600 font-medium leading-relaxed">
										{tier.target}
									</p>
								</div>
							</ScrollReveal>

							{/* Features */}
							<ScrollReveal direction="up" delay={240}>
								<div>
									<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
										What&apos;s included
									</p>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
										{tier.features.map((item, i) => (
											<motion.div
												key={item}
												initial={{ opacity: 0, x: -8 }}
												whileInView={{ opacity: 1, x: 0 }}
												viewport={{ once: true }}
												transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
												className="flex items-center gap-2 text-sm font-medium text-gray-700">
												<CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
												<span>{item}</span>
											</motion.div>
										))}
									</div>
								</div>
							</ScrollReveal>

							{/* Process */}
							<ScrollReveal direction="up" delay={320}>
								<div>
									<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
										The turnkey process
									</p>
									<p className="text-sm text-gray-500 font-medium leading-relaxed">
										{tier.process}
									</p>
								</div>
							</ScrollReveal>

							{/* Price + CTA */}
							<ScrollReveal direction="up" delay={400}>
								<div className="pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
									<div>
										<div className="flex items-baseline gap-1.5">
											<span className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900">
												{isLoading ? (
													<span className="inline-block w-24 h-7 rounded-lg bg-gray-100 animate-pulse" />
												) : (
													formatPlanPrice(tier.planKey, billingCycle)
												)}
											</span>
											<span className="text-xs font-semibold text-gray-400">
												{billingCycle === "yearly" ? "/ year" : "/ month"}
											</span>
										</div>
										<div className="flex items-center gap-2 mt-0.5 flex-wrap">
											<span className="text-[11px] text-gray-400 font-medium">
												{billingCycle === "yearly"
													? `Billed annually (${formatPlanPrice(tier.planKey, "monthly")} eq./mo)`
													: "Cancel or upgrade anytime"}
											</span>
											{!isLoading && currency.code !== "USD" && (
												<span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
													<span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
													{currency.code}
												</span>
											)}
										</div>
									</div>

									<PillButton
										href={`/checkout?plan=${tier.checkoutPlan}&billing=${billingCycle}`}
										baseColor="#004ac6"
										circleColor="#ffffff"
										textColor="#ffffff"
										hoverTextColor="#004ac6"
										useThunderFont={true}
										className="px-6 py-2.5 text-xs font-bold border border-blue-600 shadow-xs">
										{tier.ctaLabel}
									</PillButton>
								</div>
							</ScrollReveal>
						</div>

						{/* Right: Panel — full height flex column */}
						<motion.div
							className="lg:col-span-5"
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
							<div className="bg-[#0f172a] rounded-2xl p-6 text-white flex flex-col h-full min-h-[340px] shadow-xl border border-white/5">
								{/* Panel Header */}
								<div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 shrink-0">
									<div className="flex items-center gap-1.5">
										<span className="w-2 h-2 rounded-full bg-white/20" />
										<span className="w-2 h-2 rounded-full bg-white/20" />
										<span className="w-2 h-2 rounded-full bg-white/20" />
									</div>
									<span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
										{tier.panel.label}
									</span>
								</div>

								{/* Panel Body — grows to fill */}
								<div className="flex-1 flex flex-col justify-center gap-3">

									{/* Funnel Steps */}
									{"steps" in tier.panel && tier.panel.steps && (
										<div className="space-y-2">
											{tier.panel.steps.map((step, i) => (
												<React.Fragment key={step.label}>
													<motion.div
														initial={{ opacity: 0, y: 8 }}
														whileInView={{ opacity: 1, y: 0 }}
														whileHover={{ y: -2, x: 4, borderColor: "rgba(59, 130, 246, 0.4)", backgroundColor: "rgba(255,255,255,0.08)" }}
														viewport={{ once: true }}
														transition={{ delay: 0.2 + i * 0.1, duration: 0.35, ease: "easeOut" }}
														className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-medium cursor-pointer transition-colors">
														<span className="text-white/90">{step.label}</span>
														<span className="text-blue-400 font-mono text-[10px] shrink-0 ml-3 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md font-bold">{step.tag}</span>
													</motion.div>
													{i < tier.panel.steps.length - 1 && (
														<div className="w-px h-4 bg-white/10 mx-auto" />
													)}
												</React.Fragment>
											))}
										</div>
									)}

									{/* Product Grid */}
									{"products" in tier.panel && tier.panel.products && (
										<div className="grid grid-cols-2 gap-3">
											{tier.panel.products.map((p, i) => (
												<motion.div
													key={p.name}
													initial={{ opacity: 0, y: 12 }}
													whileInView={{ opacity: 1, y: 0 }}
													whileHover={{ y: -4, scale: 1.02, borderColor: "rgba(59, 130, 246, 0.4)" }}
													viewport={{ once: true }}
													transition={{ delay: 0.15 + i * 0.1, duration: 0.35, ease: "easeOut" }}
													className="bg-white/5 border border-white/10 rounded-xl p-3 text-center cursor-pointer group/card transition-colors">
													<div className="w-full h-20 bg-white/5 border border-white/10 rounded-lg mb-2.5 flex items-center justify-center group-hover/card:border-blue-500/30 transition-colors">
														<span className="text-[10px] text-white/30 font-mono tracking-wider group-hover/card:text-blue-400 transition-colors">PHOTO</span>
													</div>
													<p className="text-xs font-bold text-white/90 mb-0.5">{p.name}</p>
													<p className="text-[11px] text-blue-400 font-mono font-bold">{p.price}</p>
													<button className="mt-2 w-full bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 rounded-lg py-1 text-[10px] font-bold text-blue-300 transition-colors">
														Add to cart
													</button>
												</motion.div>
											))}
										</div>
									)}

									{/* Simple Card — Landing Page */}
									{"title" in tier.panel && tier.panel.title && (
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											whileInView={{ opacity: 1, y: 0 }}
											viewport={{ once: true }}
											transition={{ delay: 0.2, duration: 0.45, ease: "easeOut" }}
											className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
											{/* Fake browser toolbar */}
											<div className="flex items-center gap-1.5 pb-3 border-b border-white/10">
												<span className="w-2 h-2 rounded-full bg-white/15" />
												<span className="w-2 h-2 rounded-full bg-white/15" />
												<span className="w-2 h-2 rounded-full bg-white/15" />
												<div className="ml-2 flex-1 bg-white/5 border border-white/10 rounded-md px-2 py-0.5">
													<span className="text-[9px] font-mono text-white/20">mybusiness.kiosk.com</span>
												</div>
											</div>
											<p className="text-sm font-bold text-white/90">{tier.panel.title}</p>
											<p className="text-xs text-white/40 leading-relaxed">
												{tier.panel.body}
											</p>
											<div className="pt-1 flex items-center justify-between text-[11px] font-medium">
												<span className="flex items-center gap-1.5 text-white/30">
													<Zap className="w-3 h-3" />
													<span>Delivery: {tier.deliveryLabel}</span>
												</span>
												{tier.panel.stat && (
													<span className="text-blue-400/70 font-semibold text-[10px]">{tier.panel.stat}</span>
												)}
											</div>
										</motion.div>
									)}
								</div>

								{/* Panel Footer */}
								<div className="pt-3 mt-4 border-t border-white/10 flex items-center gap-2 shrink-0">
									<span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
									<span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
										Delivered in {tier.deliveryLabel}
									</span>
								</div>
							</div>
						</motion.div>
					</div>
				</ScrollReveal>
			))}
		</section>
	);
}
