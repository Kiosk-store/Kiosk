/** @format */

"use client";

import React from "react";
import ScrollReveal from "@/components/ScrollReveal";
import {
	Globe,
	Lock,
	Smartphone,
	Search,
	RefreshCw,
	ExternalLink,
	CheckCircle2,
} from "lucide-react";

interface GuaranteeFeature {
	id: string;
	number: string;
	title: string;
	badgeText: string;
	desc: string;
	icon: React.ElementType;
}

const GUARANTEE_FEATURES: GuaranteeFeature[] = [
	{
		id: "subdomain",
		number: "01",
		title: "Free Kiosk Subdomain",
		badgeText: "SUBDOMAIN",
		desc: "Launch immediately on your custom subdomain (yourname.kiosk.com) with zero setup friction.",
		icon: Globe,
	},
	{
		id: "ssl-hosting",
		number: "02",
		title: "SSL & Cloud Hosting Included",
		badgeText: "ENTERPRISE SECURITY",
		desc: "Enterprise 256-bit SSL security certificate & ultra-fast edge cloud hosting built right in.",
		icon: Lock,
	},
	{
		id: "responsive",
		number: "03",
		title: "Mobile & Desktop Responsive",
		badgeText: "AUTO-ADAPTIVE",
		desc: "Looks stunning and functions flawlessly across all smartphones, tablets, and laptops.",
		icon: Smartphone,
	},
	{
		id: "seo",
		number: "04",
		title: "Basic SEO Setup",
		badgeText: "SEARCH READY",
		desc: "Meta titles, Open Graph social share tags, and XML sitemaps automatically generated.",
		icon: Search,
	},
	{
		id: "revisions",
		number: "05",
		title: "Revision Rounds Included",
		badgeText: "REVISION GUARANTEE",
		desc: "Review your draft, request adjustments, and refine details before your site officially goes live.",
		icon: RefreshCw,
	},
	{
		id: "custom-domain",
		number: "06",
		title: "Custom Domain Connection",
		badgeText: "CUSTOM DOMAIN",
		desc: "Connect your own primary domain name (yourname.com) anytime with easy 1-click DNS routing.",
		icon: ExternalLink,
	},
];

export default function StandardGuarantee() {
	return (
		<section className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
			{/* Section Header */}
			<div className="text-center max-w-3xl mx-auto mb-16">
				<ScrollReveal direction="up">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-mono tracking-wider font-bold shadow-2xs mb-3">
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
				{GUARANTEE_FEATURES.map((feat, index) => {
					const Icon = feat.icon;
					return (
						<ScrollReveal key={feat.id} direction="up" delay={index * 90}>
							<div className="group h-full p-6 sm:p-7 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between">
								<div className="space-y-4">
									{/* Top Header Row */}
									<div className="flex items-center justify-between">
										<div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold transition-transform duration-300 group-hover:scale-105">
											<Icon className="w-5 h-5" />
										</div>
										<span className="font-mono text-xs font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
											[ {feat.number} ]
										</span>
									</div>

									{/* Badge & Title */}
									<div className="space-y-1.5 pt-1">
										<span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200/60 inline-block">
											{feat.badgeText}
										</span>
										<h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors pt-1">
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
										<CheckCircle2 className="w-3.5 h-3.5" />
										<span>Zero Extra Cost</span>
									</div>
									<span className="font-mono text-[10px] text-gray-400 uppercase">STANDARD</span>
								</div>
							</div>
						</ScrollReveal>
					);
				})}
			</div>

			{/* Bottom Trust Card */}
			<ScrollReveal direction="up" delay={450}>
				<div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-white border border-gray-200/90 p-5 sm:p-6 text-gray-900 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
					<div className="flex items-center gap-3.5">
						<div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
							<CheckCircle2 className="w-5 h-5" />
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


