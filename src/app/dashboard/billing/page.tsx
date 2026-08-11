/** @format */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PillButton from "@/components/PillButton";

interface Plan {
	id: string;
	name: string;
	description: string;
	monthlyPrice: string;
	yearlyPrice: string;
	features: string[];
	popular?: boolean;
}

const plans: Plan[] = [
	{
		id: "landing-page",
		name: "Landing Page",
		description: "Custom single-page website engineered for rapid lead generation.",
		monthlyPrice: "$20",
		yearlyPrice: "$192",
		features: [
			"Single page custom website",
			"Delivered in 3-5 days",
			"Mobile responsive & fast",
			"WhatsApp & contact form setup",
		],
	},
	{
		id: "sales-funnel",
		name: "Sales Funnel",
		description: "Strategic multi-step funnel engineered to convert prospects.",
		monthlyPrice: "$30",
		yearlyPrice: "$288",
		popular: true,
		features: [
			"Up to 5 custom conversion pages",
			"Delivered in 5-7 days",
			"CRM & lead capture integration",
			"Priority support & analytics",
		],
	},
	{
		id: "ecommerce-store",
		name: "E-commerce Store",
		description: "Complete online storefront with checkout & inventory management.",
		monthlyPrice: "$43",
		yearlyPrice: "$408",
		features: [
			"Full product catalog setup",
			"Delivered in 7-10 days",
			"Stripe & PayPal payment gateway",
			"Dedicated onboarding walkthrough",
		],
	},
];

interface Invoice {
	id: string;
	date: string;
	amount: string;
	status: "Paid" | "Pending";
	plan: string;
}

const PLAN_INFO_MAP: Record<string, { title: string; price: string; desc: string }> = {
	NONE: {
		title: "No Active Subscription",
		price: "$0",
		desc: "You do not have an active paid subscription. Select a plan below to activate your workspace and order your site.",
	},
	LANDING_PAGE: {
		title: "Landing Page Plan",
		price: "$20/mo",
		desc: "You are currently on the Landing Page subscription ($20/mo). Add a Sales Funnel or E-commerce Store to your account anytime.",
	},
	SALES_FUNNEL: {
		title: "Sales Funnel Plan",
		price: "$30/mo",
		desc: "You are currently on the Sales Funnel subscription ($30/mo). Expand your brand with additional pages anytime.",
	},
	E_COMMERCE: {
		title: "E-commerce Store Plan",
		price: "$43/mo",
		desc: "You are currently on the E-commerce Store subscription ($43/mo). Enjoy full online store and product catalog features.",
	},
};

export default function BillingPage() {
	const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
	const [tenantPlan, setTenantPlan] = useState<string>("NONE");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchBillingInfo() {
			try {
				const res = await fetch("/api/projects");
				if (res.ok) {
					const data = await res.json();
					if (data.tenant?.plan) {
						setTenantPlan(data.tenant.plan);
					}
				}
			} catch (err) {
				console.error("[FETCH_BILLING_ERROR]", err);
			} finally {
				setIsLoading(false);
			}
		}
		fetchBillingInfo();
	}, []);

	const currentPlanInfo = PLAN_INFO_MAP[tenantPlan] || PLAN_INFO_MAP.NONE;
	const isPaid = tenantPlan !== "NONE";

	return (
		<div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-20">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
				{/* Page Header */}
				<div className="pb-6 border-b border-gray-200/80 mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 tracking-tight mb-1">
						Billing & Subscription
					</h1>
					<p className="text-gray-500 text-sm font-medium">
						Manage your subscription plan, payment methods, and invoice history.
					</p>
				</div>

				{/* Active Plan Card */}
				<div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
					<div>
						<div className="flex items-center gap-2.5 mb-2">
							<span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
								Current Plan
							</span>
							<span
								className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
									isPaid
										? "text-emerald-600 bg-emerald-50"
										: "text-gray-500 bg-gray-100"
								}`}>
								{isPaid ? "Active" : "No Plan"}
							</span>
						</div>
						<h2 className="text-2xl font-bold font-nohemi text-gray-900 mb-1">
							{isLoading ? "Loading plan..." : currentPlanInfo.title}
						</h2>
						<p className="text-xs text-gray-500 max-w-lg">
							{currentPlanInfo.desc}
						</p>
					</div>

					{/* Billing Cycle Switcher */}
					<div className="flex items-center p-1 rounded-xl bg-gray-100 border border-gray-200/80 shrink-0 self-start md:self-auto">
						<button
							type="button"
							onClick={() => setBillingCycle("monthly")}
							className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
								billingCycle === "monthly"
									? "bg-white text-gray-900 shadow-xs"
									: "text-gray-500 hover:text-gray-900"
							}`}>
							Monthly
						</button>
						<button
							type="button"
							onClick={() => setBillingCycle("yearly")}
							className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
								billingCycle === "yearly"
									? "bg-white text-gray-900 shadow-xs"
									: "text-gray-500 hover:text-gray-900"
							}`}>
							<span>Yearly</span>
							<span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-600 text-white font-bold uppercase">
								-20%
							</span>
						</button>
					</div>
				</div>

				{/* Available Upgrade Plans Grid */}
				<div className="mb-12">
					<h2 className="text-xl font-bold font-nohemi text-gray-900 mb-6">
						Available Plans
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{plans.map((plan) => {
							const price =
								billingCycle === "yearly"
									? plan.yearlyPrice
									: plan.monthlyPrice;
							const period =
								billingCycle === "yearly" ? "/ year" : "/ month";

							return (
								<div
									key={plan.id}
									className={`bg-white rounded-2xl p-6 border flex flex-col justify-between transition-all duration-200 ${
										plan.popular
											? "border-blue-600 shadow-xs ring-1 ring-blue-600/20"
											: "border-gray-200/90 hover:border-gray-300"
									}`}>
									<div>
										<div className="flex items-center justify-between mb-2">
											<h3 className="text-lg font-bold font-nohemi text-gray-900">
												{plan.name}
											</h3>
											{plan.popular && (
												<span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-600 text-white">
													Popular
												</span>
											)}
										</div>

										<p className="text-xs text-gray-500 mb-4 leading-relaxed">
											{plan.description}
										</p>

										<div className="mb-6 flex items-baseline gap-1.5">
											<span className="text-3xl font-bold font-nohemi text-gray-900">
												{price}
											</span>
											<span className="text-xs text-gray-400 font-medium">
												{period}
											</span>
										</div>

										<ul className="space-y-2.5 mb-6">
											{plan.features.map((feat) => (
												<li
													key={feat}
													className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
													<span className="material-symbols-outlined text-emerald-600 text-[18px]">
														check_circle
													</span>
													<span>{feat}</span>
												</li>
											))}
										</ul>
									</div>

									<PillButton
										href={`/checkout?plan=${plan.id}&billing=${billingCycle}`}
										baseColor={plan.popular ? "#004ac6" : "#ffffff"}
										circleColor={plan.popular ? "#ffffff" : "#004ac6"}
										textColor={plan.popular ? "#ffffff" : "#004ac6"}
										hoverTextColor={plan.popular ? "#004ac6" : "#ffffff"}
										useThunderFont={true}
										className={`w-full py-3 rounded-full font-bold text-sm border-2 ${
											plan.popular
												? "border-blue-600 shadow-md"
												: "border-blue-600"
										}`}>
										Choose {plan.name}
									</PillButton>
								</div>
							);
						})}
					</div>
				</div>

				{/* Invoice History Table */}
				<div>
					<h2 className="text-xl font-bold font-nohemi text-gray-900 mb-6">
						Billing History
					</h2>

					<div className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
										<th className="py-3.5 px-5">Invoice ID</th>
										<th className="py-3.5 px-5">Date</th>
										<th className="py-3.5 px-5">Plan</th>
										<th className="py-3.5 px-5">Amount</th>
										<th className="py-3.5 px-5">Status</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100 text-xs">
									{mockInvoices.map((inv) => (
										<tr
											key={inv.id}
											className="hover:bg-gray-50/50 transition-colors">
											<td className="py-4 px-5 font-mono font-semibold text-gray-900">
												{inv.id}
											</td>
											<td className="py-4 px-5 text-gray-600 font-medium">
												{inv.date}
											</td>
											<td className="py-4 px-5 text-gray-800 font-semibold">
												{inv.plan}
											</td>
											<td className="py-4 px-5 text-gray-900 font-bold">
												{inv.amount}
											</td>
											<td className="py-4 px-5">
												<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
													<span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
													{inv.status}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
