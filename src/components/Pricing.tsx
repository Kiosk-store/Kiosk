/**
 * Pricing
 *
 * Fullscreen Scroll-Driven Pricing Showcase:
 * - One prominent large Lottie animation + One prominent pricing card displayed at a time.
 * - Zero card background on Lottie for seamless integration.
 * - On vertical scroll, pins and smoothly moves to the next pair:
 *   1. Landing Page + /lotties/A small shop.json
 *   2. Sales Funnel + /lotties/funnel.json
 *   3. E-commerce Store + /lotties/shopping Ecommerce.json
 * - Clean solid dark styling with zero gradients and PillButton CTAs.
 *
 * @format
 */

"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import PillButton from "./PillButton";
import LottiePlayer from "./LottiePlayer";

export interface PricingTier {
	id: string;
	name: string;
	subtitle: string;
	priceOneTime: string;
	priceMonthly: string;
	description: string;
	features: string[];
	cta: string;
	featured: boolean;
	lottieSrc: string;
}

const tiers: PricingTier[] = [
	{
		id: "landing-page",
		name: "Landing Page",
		subtitle: "High-Converting Single Page",
		priceOneTime: "$499",
		priceMonthly: "$49",
		description: "Custom single-page website engineered for rapid lead generation and immediate launch.",
		features: [
			"Custom responsive single page design",
			"Ultra-fast loading & mobile optimization",
			"Direct contact form & WhatsApp integration",
			"Domain connection & secure hosting setup",
		],
		cta: "Choose Landing Page",
		featured: false,
		lottieSrc: "/lotties/A small shop.json",
	},
	{
		id: "sales-funnel",
		name: "Sales Funnel",
		subtitle: "Multi-Step Conversion Engine",
		priceOneTime: "$999",
		priceMonthly: "$89",
		description: "Strategic multi-page funnel engineered to qualify prospects and convert them into clients.",
		features: [
			"Up to 5 custom high-impact conversion pages",
			"Automated CRM & lead capture workflows",
			"Advanced SEO & analytics tracking setup",
			"Priority revisions & 14-day dedicated support",
		],
		cta: "Choose Sales Funnel",
		featured: true,
		lottieSrc: "/lotties/funnel.json",
	},
	{
		id: "ecommerce-store",
		name: "E-commerce Store",
		subtitle: "Full-Featured Digital Shop",
		priceOneTime: "$1,499",
		priceMonthly: "$129",
		description: "Complete online storefront with seamless checkout, payment processing, and inventory management.",
		features: [
			"Full product catalog & variation management",
			"Stripe, Apple Pay & PayPal payment gateways",
			"Automated customer order confirmation emails",
			"Dedicated store launch & owner onboarding",
		],
		cta: "Choose E-commerce",
		featured: false,
		lottieSrc: "/lotties/shopping Ecommerce.json",
	},
];

export default function Pricing() {
	const [billingCycle, setBillingCycle] = useState<"one-time" | "monthly">(
		"one-time",
	);
	const [activeIndex, setActiveIndex] = useState(0);

	const sectionRef = useRef<HTMLElement | null>(null);
	const pinContainerRef = useRef<HTMLDivElement | null>(null);

	// Setup GSAP Pinning & Scroll-to-next slide
	useEffect(() => {
		if (typeof window === "undefined") return;
		gsap.registerPlugin(ScrollTrigger);

		const section = sectionRef.current;
		if (!section) return;

		const ctx = gsap.context(() => {
			ScrollTrigger.create({
				trigger: section,
				pin: true,
				start: "top top",
				end: () => `+=${Math.max(window.innerHeight * 2.2, 1800)}`,
				scrub: 0.8,
				invalidateOnRefresh: true,
				onUpdate: (self) => {
					const progress = self.progress;
					const total = tiers.length;
					// Divide scroll range evenly between slides
					const newIndex = Math.min(
						total - 1,
						Math.floor(progress * total),
					);
					setActiveIndex(newIndex);
				},
			});
		}, section);

		return () => {
			ctx.revert();
		};
	}, []);

	return (
		<section
			id="pricing"
			ref={sectionRef}
			tabIndex={0}
			aria-label="Pricing Packages"
			className="relative w-full bg-[#0a0c10] text-white overflow-hidden select-none">
			{/* Pinned Fullscreen Stage */}
			<div
				ref={pinContainerRef}
				className="w-full min-h-screen flex flex-col justify-between py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
				{/* Top Header & Toggle */}
				<div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-white/10 pb-5 shrink-0 relative z-20">
					<div>
						<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-nohemi">
							Simple pricing.{" "}
							<span className="text-blue-400">Zero surprises.</span>
						</h2>
					</div>

					{/* Right: Billing Cycle Toggle */}
					<div className="inline-flex items-center p-1 rounded-full bg-[#161922] border border-white/15 self-start md:self-auto">
						<button
							type="button"
							onClick={() => setBillingCycle("one-time")}
							className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
								billingCycle === "one-time"
									? "bg-white text-[#0a0a0a] shadow-sm"
									: "text-slate-400 hover:text-white"
							}`}>
							One-Time
						</button>

						<button
							type="button"
							onClick={() => setBillingCycle("monthly")}
							className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
								billingCycle === "monthly"
									? "bg-white text-[#0a0a0a] shadow-sm"
									: "text-slate-400 hover:text-white"
							}`}>
							<span>Monthly</span>
							<span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold uppercase">
								-20%
							</span>
						</button>
					</div>
				</div>

				{/* Main Stage: 1 Lottie Showcase + 1 Pricing Card */}
				<div className="w-full flex-1 relative flex items-center justify-center my-4 sm:my-6 min-h-[520px]">
					{tiers.map((tier, idx) => {
						const isVisible = idx === activeIndex;
						const price =
							billingCycle === "one-time"
								? tier.priceOneTime
								: tier.priceMonthly;
						const period =
							billingCycle === "one-time" ? "one-time investment" : "/ month";

						return (
							<div
								key={tier.id}
								aria-hidden={!isVisible}
								style={{
									opacity: isVisible ? 1 : 0,
									transform: isVisible
										? "translateY(0) scale(1)"
										: idx < activeIndex
										? "translateY(-30px) scale(0.96)"
										: "translateY(30px) scale(0.96)",
									pointerEvents: isVisible ? "auto" : "none",
									transition:
										"opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
								}}
								className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-6 sm:gap-10 lg:gap-16 ${
									idx === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
								}`}>
								{/* Left: Large Borderless Lottie Animation Showcase */}
								<div className="w-full lg:w-1/2 flex items-center justify-center">
									<div className="w-full max-w-[480px] sm:max-w-[540px] md:max-w-[580px] h-[340px] sm:h-[420px] md:h-[480px] flex items-center justify-center p-2">
										<LottiePlayer
											src={tier.lottieSrc}
											className="w-full h-full object-contain"
											loop={true}
											autoplay={true}
										/>
									</div>
								</div>

								{/* Right: Prominent Pricing Card */}
								<div className="w-full lg:w-1/2 flex items-center justify-center">
									<div
										className={`w-full max-w-[460px] sm:max-w-[500px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
											tier.featured
												? "bg-[#141824] border-2 border-blue-600 shadow-2xl shadow-blue-600/10"
												: "bg-[#11131a] border border-white/15 shadow-2xl shadow-black/60"
										}`}>
										<div>
											{/* Plan Name & Tag */}
											<div className="flex items-center justify-between mb-2">
												<h3 className="text-2xl sm:text-3xl font-bold text-white font-nohemi">
													{tier.name}
												</h3>
												{tier.featured && (
													<span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-blue-600 text-white">
														Featured
													</span>
												)}
											</div>

											<p className="text-slate-300 text-sm mb-6 leading-relaxed">
												{tier.description}
											</p>

											{/* Price Display */}
											<div className="mb-6 flex items-baseline gap-2.5">
												<span className="text-3xl sm:text-4xl font-medium text-white tracking-tight font-nohemi">
													{price}
												</span>
												<span className="text-xs text-slate-400 font-normal uppercase tracking-wider">
													{period}
												</span>
											</div>

											{/* Feature Checklist */}
											<ul className="space-y-3 mb-8">
												{tier.features.map((feat) => (
													<li
														key={feat}
														className="flex items-center gap-3 text-sm text-slate-200">
														<div className="w-4 h-4 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
															<Check className="w-3 h-3 stroke-[3]" />
														</div>
														<span>{feat}</span>
													</li>
												))}
											</ul>
										</div>

										{/* Call To Action Button */}
										<div>
											<PillButton
												href="#contact"
												baseColor={tier.featured ? "#004ac6" : "#ffffff"}
												circleColor={tier.featured ? "#ffffff" : "#004ac6"}
												textColor={tier.featured ? "#ffffff" : "#0a0a0a"}
												hoverTextColor={tier.featured ? "#0a0a0a" : "#ffffff"}
												useThunderFont={true}
												className={`w-full py-4 rounded-full font-bold text-base shadow-xl cursor-pointer ${
													tier.featured
														? "border-2 border-blue-600"
														: "border-2 border-white hover:border-blue-600"
												}`}>
												{tier.cta}
											</PillButton>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
