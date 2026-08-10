/** @format */

"use client";

import React from "react";
import {
	Globe,
	Lock,
	Smartphone,
	Search,
	RefreshCw,
	ExternalLink,
} from "lucide-react";

const GUARANTEE_FEATURES = [
	{
		icon: Globe,
		title: "Free Kiosk Subdomain",
		desc: "Launch immediately on your own custom subdomain (yourname.kiosk.com).",
	},
	{
		icon: Lock,
		title: "SSL & Cloud Hosting Included",
		desc: "Enterprise SSL security certificate & ultra-fast cloud hosting included.",
	},
	{
		icon: Smartphone,
		title: "Mobile & Desktop Responsive",
		desc: "Looks stunning and functions flawlessly on every phone, tablet, and laptop.",
	},
	{
		icon: Search,
		title: "Basic SEO Setup",
		desc: "Meta title tags, Open Graph preview tags, and XML sitemap generated.",
	},
	{
		icon: RefreshCw,
		title: "Revision Rounds Included",
		desc: "Review your draft and request tweaks before your site officially goes live.",
	},
	{
		icon: ExternalLink,
		title: "Custom Domain Connection",
		desc: "Connect your own domain name (yourname.com) anytime with ease.",
	},
];

export default function StandardGuarantee() {
	return (
		<section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
			<div className="text-center max-w-3xl mx-auto mb-14">
				<span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
					Standard Guarantee
				</span>
				<h2 className="text-3xl font-bold font-nohemi text-gray-900 mt-3 mb-2">
					Included in Every Single Kiosk Tier
				</h2>
				<p className="text-sm text-gray-500 font-medium">
					No hidden hosting fees or technical surprises. Everything you need to launch safely is built in.
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{GUARANTEE_FEATURES.map((feat) => {
					const Icon = feat.icon;
					return (
						<div
							key={feat.title}
							className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-3">
							<div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
								<Icon className="w-5 h-5" />
							</div>
							<h3 className="text-base font-bold text-gray-900">{feat.title}</h3>
							<p className="text-xs text-gray-500 font-medium leading-relaxed">
								{feat.desc}
							</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
