/** @format */

"use client";

import React from "react";
import { Mail, Code2, Palette, Sparkles, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import PillButton from "@/components/PillButton";

const CUSTOM_FEATURES = [
	{
		icon: Code2,
		title: "Custom Development",
		description: "Fully bespoke websites, web apps, and digital products built from scratch.",
		badge: "FULL-STACK",
	},
	{
		icon: Palette,
		title: "Unique Design",
		description: "One-of-a-kind designs tailored to your brand identity and vision.",
		badge: "BESPOKE UI",
	},
	{
		icon: Sparkles,
		title: "Advanced Features",
		description: "Complex integrations, custom dashboards, APIs, and scalable architecture.",
		badge: "INTEGRATIONS",
	},
];

export default function CustomServicesCTA() {
	return (
		<section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
			<ScrollReveal direction="up" delay={0}>
				<div className="relative bg-gradient-to-br from-violet-50/90 via-white to-indigo-50/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 text-center overflow-hidden shadow-xl border border-violet-200/80">
					{/* Background decorative gradient orbs */}
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(124,58,237,0.08)_0%,_transparent_70%)] pointer-events-none" />
					<div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
					<div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />

					<div className="relative z-10">
						<span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-100/80 px-3.5 py-1 rounded-full border border-purple-200 mb-4 shadow-2xs">
							<Mail className="w-3.5 h-3.5 text-purple-600" />
							Custom Projects & Bespoke Builds
						</span>

						<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-nohemi text-gray-900 mt-2 mb-3 tracking-tight leading-[1.15]">
							Need Something More Tailored?
						</h2>
						<p className="text-sm sm:text-base text-gray-600 font-medium max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
							Our standard packages cover most businesses, but if you need a fully custom-built website, 
							web app, or digital product — we&apos;ve got you covered. Reach out and let&apos;s discuss your project.
						</p>

						{/* Feature cards */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mb-8 sm:mb-10">
							{CUSTOM_FEATURES.map((feature, index) => (
								<ScrollReveal key={feature.title} direction="up" delay={100 + index * 90}>
									<div className="bg-white/90 backdrop-blur-sm border border-purple-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-left hover:border-purple-300 hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between group">
										<div>
											<div className="flex items-center justify-between mb-3">
												<div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
													<feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
												</div>
												<span className="text-[9px] font-mono font-bold text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md">
													{feature.badge}
												</span>
											</div>
											<h3 className="text-sm font-bold text-gray-900 mb-1.5 group-hover:text-purple-700 transition-colors">
												{feature.title}
											</h3>
											<p className="text-xs text-gray-500 leading-relaxed font-medium">
												{feature.description}
											</p>
										</div>
									</div>
								</ScrollReveal>
							))}
						</div>

						{/* CTA buttons */}
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
							<PillButton
								href="mailto:support@kiosk.site"
								baseColor="#7c3aed"
								circleColor="#ffffff"
								textColor="#ffffff"
								hoverTextColor="#7c3aed"
								useThunderFont={true}
								className="w-full sm:w-auto px-8 py-3.5 sm:px-9 sm:py-4 rounded-full font-bold text-sm sm:text-base shadow-lg shadow-purple-500/20 cursor-pointer text-center">
								Get in Touch
							</PillButton>
							<a
								href="mailto:support@kiosk.site"
								className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-purple-50 border border-purple-200 text-xs sm:text-sm font-bold text-purple-700 transition-all text-center inline-flex items-center justify-center gap-2 shadow-xs cursor-pointer">
								<span>support@kiosk.site</span>
								<ArrowRight className="w-3.5 h-3.5 text-purple-500" />
							</a>
						</div>

						<p className="text-[11px] text-gray-500 mt-5 sm:mt-6 font-medium">
							We typically respond within 24 hours with a scope & estimate.
						</p>
					</div>
				</div>
			</ScrollReveal>
		</section>
	);
}
