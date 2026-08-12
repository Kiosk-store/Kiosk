/** @format */

"use client";

import React, { useState } from "react";
import { ArrowRight, HelpCircle } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import ScrollReveal from "@/components/ScrollReveal";

const DECISION_OPTIONS = [
	{
		id: "presence",
		planKey: "landing" as const,
		question: "Just need a simple, professional online presence?",
		href: "/checkout?plan=landing",
	},
	{
		id: "ads",
		planKey: "funnel" as const,
		question: "Running paid ads & email campaigns to convert leads?",
		href: "/checkout?plan=funnel",
	},
	{
		id: "store",
		planKey: "store" as const,
		question: "Selling physical products or digital downloads online?",
		href: "/checkout?plan=store",
	},
];

const PLAN_LABELS: Record<string, string> = {
	landing: "Landing Page",
	funnel: "Sales Funnel",
	store: "E-commerce Store",
};

export default function ServicesDecisionHelper() {
	const [activeQuizChoice, setActiveQuizChoice] = useState<string | null>(null);
	const { formatPlanPrice, isLoading } = useCurrency();

	return (
		<section className="py-14 md:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
			<ScrollReveal direction="up" delay={0}>
				<div className="bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 text-center shadow-2xs">
					<span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
						Decision Helper
					</span>
					<h2 className="text-xl sm:text-3xl font-bold font-nohemi text-gray-900 mt-3 mb-2">
						Not Sure Which Tier Fits Your Business?
					</h2>
					<p className="text-xs sm:text-sm text-gray-500 font-medium max-w-xl mx-auto mb-6 sm:mb-8">
						Select your primary business goal below to see our instant tier recommendation:
					</p>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mb-6 sm:mb-8 text-left">
						{DECISION_OPTIONS.map((q, index) => (
							<ScrollReveal key={q.id} direction="up" delay={100 + index * 90}>
								<button
									type="button"
									onClick={() => setActiveQuizChoice(q.id)}
									className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer ${
										activeQuizChoice === q.id
											? "border-blue-600 bg-blue-50/70 shadow-xs"
											: "border-gray-200/90 bg-white hover:bg-gray-50"
									}`}>
									<p className="text-xs sm:text-sm font-semibold text-gray-800 mb-3">
										{q.question}
									</p>
									<div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-blue-600 pt-2.5 sm:pt-3 border-t border-gray-100">
										<span className="flex items-center gap-1.5">
											<ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
											<span>
												{PLAN_LABELS[q.planKey]} ({isLoading ? "…" : formatPlanPrice(q.planKey, "monthly")}/mo)
											</span>
										</span>
									</div>
								</button>
							</ScrollReveal>
						))}
					</div>

					<div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-medium text-gray-500">
						<HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
						<span>Still undecided? Talk directly with our team before committing.</span>
					</div>
				</div>
			</ScrollReveal>
		</section>
	);
}

