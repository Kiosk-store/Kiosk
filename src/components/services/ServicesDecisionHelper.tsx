/** @format */

"use client";

import React, { useState } from "react";
import { ArrowRight, HelpCircle } from "lucide-react";

const DECISION_OPTIONS = [
	{
		id: "presence",
		question: "Just need a simple, professional online presence?",
		recommendation: "Landing Page ($20/mo)",
		href: "/checkout?plan=landing",
	},
	{
		id: "ads",
		question: "Running paid ads & email campaigns to convert leads?",
		recommendation: "Sales Funnel ($30/mo)",
		href: "/checkout?plan=funnel",
	},
	{
		id: "store",
		question: "Selling physical products or digital downloads online?",
		recommendation: "E-commerce Store ($43/mo)",
		href: "/checkout?plan=store",
	},
];

export default function ServicesDecisionHelper() {
	const [activeQuizChoice, setActiveQuizChoice] = useState<string | null>(null);

	return (
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
					{DECISION_OPTIONS.map((q) => (
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
								<span className="flex items-center gap-1">
									<ArrowRight className="w-3.5 h-3.5 text-blue-600" />
									<span>{q.recommendation}</span>
								</span>
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
	);
}
