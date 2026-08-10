/** @format */

"use client";

import React from "react";

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
					{ADDONS.map((addon) => (
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
	);
}
