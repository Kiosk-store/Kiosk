/** @format */

"use client";

import React from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { PlusCircle } from "lucide-react";

const ADDONS = [
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
];

export default function ServiceAddOns() {
	return (
		<section className="py-20 md:py-28 bg-white border-t border-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<ScrollReveal direction="up" delay={0}>
						<span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
							Optional Bolt-Ons
						</span>
					</ScrollReveal>

					<ScrollReveal direction="up" delay={100}>
						<h2 className="text-3xl sm:text-4xl font-bold font-nohemi text-gray-900 mt-3 mb-3">
							Service Add-Ons
						</h2>
					</ScrollReveal>

					<ScrollReveal direction="up" delay={200}>
						<p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed max-w-xl mx-auto">
							Need extra pages, copywriting help, or fast delivery? Bolt these on to any tier.
						</p>
					</ScrollReveal>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{ADDONS.map((addon, index) => (
						<ScrollReveal key={addon.title} direction="up" delay={index * 90}>
							<div className="h-full p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between group">
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
											{addon.title}
										</h3>
										<span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
											{addon.price}
										</span>
									</div>
									<p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
										{addon.desc}
									</p>
								</div>
								<div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-400 font-medium">
									<PlusCircle className="w-3.5 h-3.5 text-blue-600" />
									<span>Available on all tiers</span>
								</div>
							</div>
						</ScrollReveal>
					))}
				</div>
			</div>
		</section>
	);
}

