/** @format */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import PillButton from "@/components/PillButton";
import { CheckCircle2, Zap, Globe, ShoppingBag } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

const TIERS = [
	{
		id: "landing",
		index: "01",
		title: "Landing Page",
		icon: Globe,
		planKey: "landing" as const,
		checkoutPlan: "landing",
		ctaLabel: "Start Landing Page",
		target: "New businesses, local service providers, freelancers, and consultants who need an immediate, highly polished online presence to build credibility and land inquiries.",
		process: "Intake Form → Template Selection → Branding & Copy Personalisation → Client Review → Live in 3–5 days.",
		deliveryLabel: "3–5 Days",
		badgeColor: "bg-blue-50 text-blue-600 border-blue-100",
		checkColor: "text-blue-600",
		features: [
			"1 High-converting responsive page",
			"Hero, About, Services & Reviews",
			"Interactive Google Map & Address",
			"WhatsApp & Lead capture form",
			"Basic SEO meta tags & sitemap",
			"Free Kiosk subdomain hosting",
		],
		panel: {
			bg: "bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-100 border-blue-200",
			accent: "text-blue-600",
			orb: "bg-blue-400/20",
			label: "LIVE OUTPUT PREVIEW",
			title: "Modern Service Business",
			body: "Clean hero section, customer social proof, call-to-action button, and instant WhatsApp chat integration.",
			stat: "100% Mobile Ready",
		},
	},
	{
		id: "funnel",
		index: "02",
		title: "Sales Funnel",
		icon: Zap,
		planKey: "funnel" as const,
		checkoutPlan: "funnel",
		ctaLabel: "Start Sales Funnel",
		target: "Businesses actively running Google/Meta ads or social traffic campaigns that need a multi-step conversion funnel to turn visitors into leads and customers.",
		process: "Offer Intake → Funnel Flow Mapping → Copy Integration → Analytics & Email Setup → Live in 3–5 days.",
		deliveryLabel: "3–5 Days",
		badgeColor: "bg-purple-50 text-purple-600 border-purple-100",
		checkColor: "text-purple-600",
		features: [
			"3–5 Connected sales pages",
			"Opt-in, Offer & Thank-you pages",
			"Lead capture & CRM integration",
			"Mailchimp / Email automation",
			"Meta Pixel & Google Analytics",
			"A/B Ready funnel structure",
		],
		panel: {
			bg: "bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-100 border-purple-200",
			accent: "text-purple-600",
			orb: "bg-purple-400/20",
			label: "MULTI-STEP FUNNEL FLOW",
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
		icon: ShoppingBag,
		planKey: "store" as const,
		checkoutPlan: "store",
		ctaLabel: "Start E-commerce Store",
		target: "Brands selling physical or digital products online that need an effortless, secure checkout system with payment gateway processing.",
		process: "Product Intake → Storefront Design → Payment Gateway Wiring → Test Purchase Validation → Live in 5–10 days.",
		deliveryLabel: "5–10 Days",
		badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
		checkColor: "text-emerald-600",
		features: [
			"Complete product catalogue setup",
			"Slide-out cart drawer & checkout",
			"Card, bank transfer & mobile money integration",
			"Order email notifications",
			"Basic inventory tracking",
			"Product search & category tags",
		],
		panel: {
			bg: "bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 border-emerald-200",
			accent: "text-emerald-600",
			orb: "bg-emerald-400/20",
			label: "E-COMMERCE STOREFRONT",
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
	const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
	const { formatPlanPrice, currency, isLoading } = useCurrency();

	return (
		<section
			id="services-tiers"
			className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 md:space-y-16 overflow-hidden">
			
			{/* Top Control Banner: Billing Switcher */}
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

					{/* Billing Switcher */}
					<div className="relative inline-flex items-center p-1 rounded-xl bg-gray-100 border border-gray-200 shrink-0">
						<motion.span
							layoutId="billingPill"
							className={`absolute top-1 bottom-1 rounded-lg bg-white shadow-xs transition-all ${
								billingCycle === "monthly"
									? "left-1 right-[calc(50%+2px)]"
									: "left-[calc(50%+2px)] right-1"
							}`}
						/>
						<button
							type="button"
							onClick={() => setBillingCycle("monthly")}
							className={`relative z-10 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
								billingCycle === "monthly"
									? "text-gray-900"
									: "text-gray-500 hover:text-gray-900"
							}`}>
							Monthly
						</button>
						<button
							type="button"
							onClick={() => setBillingCycle("yearly")}
							className={`relative z-10 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
								billingCycle === "yearly"
									? "text-gray-900"
									: "text-gray-500 hover:text-gray-900"
							}`}>
							<span>Yearly</span>
							<span className="text-[10px] px-1.5 py-0.5 rounded-full font-extrabold uppercase bg-emerald-100 text-emerald-700">
								Save 20%
							</span>
						</button>
					</div>
				</div>
			</ScrollReveal>

			{/* 3 Separate Tier Cards with Horizontal Scroll Reveal */}
			{TIERS.map((tier, index) => {
				const Icon = tier.icon;
				const isEven = index % 2 === 0;

				return (
					<motion.div
						key={tier.id}
						initial={{ opacity: 0, x: isEven ? -80 : 80 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, amount: 0.15 }}
						transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
						className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch relative overflow-hidden group">
						
						{/* Left Column: Details & Features */}
						<motion.div
							initial={{ opacity: 0, x: isEven ? -40 : 40 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
							className="lg:col-span-7 flex flex-col justify-between space-y-6">
							<div>
								{/* Tier Title Header */}
								<div className="flex items-center gap-3 mb-4">
									<div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border shadow-2xs shrink-0 ${tier.badgeColor}`}>
										<Icon className="w-6 h-6" />
									</div>
									<div>
										<span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${tier.badgeColor}`}>
											Tier {tier.index} • Delivery: {tier.deliveryLabel}
										</span>
										<h2 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 mt-1">
											{tier.title}
										</h2>
									</div>
								</div>

								{/* Who it's for */}
								<div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 mb-5">
									<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
										Who it&apos;s for
									</p>
									<p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
										{tier.target}
									</p>
								</div>

								{/* Included Features */}
								<div className="mb-5">
									<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
										What&apos;s included in this tier
									</p>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
										{tier.features.map((item, featureIdx) => (
											<motion.div
												key={item}
												initial={{ opacity: 0, x: -15 }}
												whileInView={{ opacity: 1, x: 0 }}
												viewport={{ once: true }}
												transition={{ delay: 0.2 + featureIdx * 0.05, duration: 0.4 }}
												className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-gray-700">
												<CheckCircle2 className={`w-4 h-4 shrink-0 ${tier.checkColor}`} />
												<span>{item}</span>
											</motion.div>
										))}
									</div>
								</div>

								{/* Process */}
								<div>
									<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
										The turnkey process
									</p>
									<p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
										{tier.process}
									</p>
								</div>
							</div>

							{/* Price + CTA Button */}
							<div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
								<div>
									<div className="flex items-baseline gap-1.5">
										<span className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900">
											{isLoading ? (
												<span className="inline-block w-28 h-8 rounded-lg bg-gray-100 animate-pulse" />
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
									className="w-full sm:w-auto px-7 py-3 text-xs font-bold border border-blue-600 shadow-md text-center">
									{tier.ctaLabel}
								</PillButton>
							</div>
						</motion.div>

						{/* Right Column: Dark Preview Panel */}
						<motion.div
							initial={{ opacity: 0, x: isEven ? 40 : -40 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
							className="lg:col-span-5 flex flex-col">
							<div className={`relative rounded-2xl p-6 sm:p-7 flex flex-col h-full min-h-[320px] shadow-md border-2 justify-between transition-all duration-300 group-hover:scale-[1.01] group-hover:shadow-lg overflow-hidden ${tier.panel.bg}`}>
								{/* Decorative background orb */}
								<div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-2xl pointer-events-none ${tier.panel.orb}`} />
								{/* Panel Header */}
								<div className="relative z-10 flex items-center justify-between border-b border-black/8 pb-3.5 mb-4 shrink-0">
									<div className="flex items-center gap-1.5">
										<span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-sm" />
										<span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
										<span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
									</div>
									<span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${tier.panel.accent}`}>
										{tier.panel.label}
									</span>
								</div>

								{/* Panel Body */}
								<div className="relative z-10 flex-1 flex flex-col justify-center gap-3">
									{/* Funnel Steps */}
									{"steps" in tier.panel && tier.panel.steps && (
										<div className="space-y-2.5">
											{tier.panel.steps?.map((step, i) => (
												<React.Fragment key={step.label}>
													<motion.div
														initial={{ opacity: 0, x: 20 }}
														whileInView={{ opacity: 1, x: 0 }}
														viewport={{ once: true }}
														transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
														className="p-3.5 rounded-xl bg-white/80 border border-white shadow-sm flex items-center justify-between text-xs font-medium backdrop-blur-sm">
														<span className="text-gray-700 font-semibold">{step.label}</span>
														<span className="text-purple-600 font-mono text-[10px] shrink-0 ml-3 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-md font-bold shadow-sm">
															{step.tag}
														</span>
													</motion.div>
													{tier.panel.steps && i < tier.panel.steps.length - 1 && (
														<div className="w-px h-3 bg-purple-200 mx-auto" />
													)}
												</React.Fragment>
											))}
										</div>
									)}

									{/* Product Grid */}
									{"products" in tier.panel && tier.panel.products && (
										<div className="grid grid-cols-2 gap-3">
											{tier.panel.products?.map((p, i) => (
												<motion.div
													key={p.name}
													initial={{ opacity: 0, y: 15 }}
													whileInView={{ opacity: 1, y: 0 }}
													viewport={{ once: true }}
													transition={{ delay: 0.25 + i * 0.08, duration: 0.4 }}
													className="bg-white/80 border border-white shadow-sm rounded-xl p-3.5 text-center backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200">
													<div className="w-full h-20 bg-gradient-to-br from-gray-50 to-gray-100 border border-emerald-100 rounded-lg mb-2.5 flex items-center justify-center">
														<span className="text-[10px] text-gray-300 font-mono tracking-wider font-bold">
															PHOTO
														</span>
													</div>
													<p className="text-xs font-bold text-gray-800 mb-0.5">{p.name}</p>
													<p className="text-[11px] text-emerald-600 font-mono font-bold">{p.price}</p>
													<button type="button" className="mt-2 w-full text-[10px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-md py-1 transition-colors cursor-pointer">Add to Cart</button>
												</motion.div>
											))}
										</div>
									)}

									{/* Simple Card — Landing Page */}
									{"title" in tier.panel && tier.panel.title && (
										<motion.div
											initial={{ opacity: 0, scale: 0.95 }}
											whileInView={{ opacity: 1, scale: 1 }}
											viewport={{ once: true }}
											transition={{ delay: 0.25, duration: 0.45 }}
											className="bg-white/80 border border-white shadow-sm rounded-xl p-5 space-y-3 backdrop-blur-sm">
											<div className="flex items-center gap-1.5 pb-2.5 border-b border-blue-100">
												<span className="w-2 h-2 rounded-full bg-rose-400" />
												<span className="w-2 h-2 rounded-full bg-amber-400" />
												<span className="w-2 h-2 rounded-full bg-emerald-400" />
												<div className="ml-2 flex-1 bg-white border border-blue-100 rounded-md px-2.5 py-0.5">
													<span className="text-[9px] font-mono text-gray-400">mybusiness.kioosk.online</span>
												</div>
											</div>
											<p className="text-sm font-bold text-gray-800">{tier.panel.title}</p>
											<p className="text-xs text-gray-500 leading-relaxed">{tier.panel.body}</p>
											<div className="pt-1 flex items-center justify-between text-[11px] font-medium">
												<span className="flex items-center gap-1.5 text-gray-500">
													<Zap className="w-3.5 h-3.5 text-amber-500" />
													<span>Delivery: {tier.deliveryLabel}</span>
												</span>
												{tier.panel.stat && (
													<span className="text-blue-600 font-bold text-[10px] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
														{tier.panel.stat}
													</span>
												)}
											</div>
										</motion.div>
									)}
								</div>

								{/* Panel Footer */}
								<div className="relative z-10 pt-3 mt-4 border-t border-black/8 flex items-center justify-between text-[10px] font-mono text-gray-400 uppercase tracking-wider shrink-0">
									<span className="flex items-center gap-2">
										<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-400" />
										<span className={`font-bold ${tier.panel.accent}`}>Ready for Onboarding</span>
									</span>
									<span className="text-gray-400">Turnkey Delivery</span>
								</div>
							</div>
						</motion.div>
					</motion.div>
				);
			})}
		</section>
	);
}
