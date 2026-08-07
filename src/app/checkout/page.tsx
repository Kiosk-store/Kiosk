/** @format */

"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PillButton from "@/components/PillButton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
	ShieldCheck,
	Lock,
	CheckCircle2,
	Zap,
	Globe,
	ShoppingBag,
	ArrowLeft,
	Loader2,
	AlertCircle,
	Sparkles,
	CreditCard,
	Building2,
	Smartphone,
} from "lucide-react";

interface PlanDetails {
	id: string;
	dbPlan: "LANDING_PAGE" | "SALES_FUNNEL" | "E_COMMERCE";
	name: string;
	subtitle: string;
	monthlyPrice: number;
	yearlyPrice: number;
	features: string[];
	deliveryTime: string;
	icon: React.ElementType;
	badgeColor: string;
}

const PLAN_CATALOG: Record<string, PlanDetails> = {
	landing: {
		id: "landing",
		dbPlan: "LANDING_PAGE",
		name: "Landing Page",
		subtitle: "High-Converting Single Page Website",
		monthlyPrice: 20,
		yearlyPrice: 192,
		deliveryTime: "3–5 Days",
		icon: Globe,
		badgeColor: "bg-blue-50 text-blue-600 border-blue-200",
		features: [
			"1 High-converting responsive page",
			"Custom typography & color branding",
			"Interactive lead form & WhatsApp chat",
			"Basic SEO meta tags & XML sitemap",
			"Free Kiosk subdomain + custom domain wiring",
			"SSL certificate & cloud hosting included",
		],
	},
	"landing-page": {
		id: "landing-page",
		dbPlan: "LANDING_PAGE",
		name: "Landing Page",
		subtitle: "High-Converting Single Page Website",
		monthlyPrice: 20,
		yearlyPrice: 192,
		deliveryTime: "3–5 Days",
		icon: Globe,
		badgeColor: "bg-blue-50 text-blue-600 border-blue-200",
		features: [
			"1 High-converting responsive page",
			"Custom typography & color branding",
			"Interactive lead form & WhatsApp chat",
			"Basic SEO meta tags & XML sitemap",
			"Free Kiosk subdomain + custom domain wiring",
			"SSL certificate & cloud hosting included",
		],
	},
	funnel: {
		id: "funnel",
		dbPlan: "SALES_FUNNEL",
		name: "Sales Funnel",
		subtitle: "Multi-Step Lead & Conversion Engine",
		monthlyPrice: 30,
		yearlyPrice: 288,
		deliveryTime: "3–5 Days",
		icon: Zap,
		badgeColor: "bg-purple-50 text-purple-600 border-purple-200",
		features: [
			"3–5 Connected sales & opt-in pages",
			"Opt-in, Core Offer & Thank-you flows",
			"Automated CRM & email marketing integration",
			"Meta Pixel & Google Analytics conversion tracking",
			"A/B Ready structure & high-impact copy alignment",
			"SSL certificate & cloud hosting included",
		],
	},
	"sales-funnel": {
		id: "sales-funnel",
		dbPlan: "SALES_FUNNEL",
		name: "Sales Funnel",
		subtitle: "Multi-Step Lead & Conversion Engine",
		monthlyPrice: 30,
		yearlyPrice: 288,
		deliveryTime: "3–5 Days",
		icon: Zap,
		badgeColor: "bg-purple-50 text-purple-600 border-purple-200",
		features: [
			"3–5 Connected sales & opt-in pages",
			"Opt-in, Core Offer & Thank-you flows",
			"Automated CRM & email marketing integration",
			"Meta Pixel & Google Analytics conversion tracking",
			"A/B Ready structure & high-impact copy alignment",
			"SSL certificate & cloud hosting included",
		],
	},
	store: {
		id: "store",
		dbPlan: "E_COMMERCE",
		name: "E-commerce Store",
		subtitle: "Full-Featured Digital & Product Shop",
		monthlyPrice: 43,
		yearlyPrice: 408,
		deliveryTime: "5–10 Days",
		icon: ShoppingBag,
		badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
		features: [
			"Complete product catalog setup & variations",
			"Slide-out cart drawer & instant checkout flow",
			"Flutterwave, Stripe & Paystack payment processing",
			"Automated customer order emails & inventory tracking",
			"Product search & dynamic category filtering",
			"SSL certificate & cloud hosting included",
		],
	},
	"ecommerce-store": {
		id: "ecommerce-store",
		dbPlan: "E_COMMERCE",
		name: "E-commerce Store",
		subtitle: "Full-Featured Digital & Product Shop",
		monthlyPrice: 43,
		yearlyPrice: 408,
		deliveryTime: "5–10 Days",
		icon: ShoppingBag,
		badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
		features: [
			"Complete product catalog setup & variations",
			"Slide-out cart drawer & instant checkout flow",
			"Flutterwave, Stripe & Paystack payment processing",
			"Automated customer order emails & inventory tracking",
			"Product search & dynamic category filtering",
			"SSL certificate & cloud hosting included",
		],
	},
};

function CheckoutContent() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const planParam = searchParams.get("plan") || "landing";
	const billingParam = searchParams.get("billing") || "monthly";

	const [selectedPlanId] = useState<string>(planParam);
	const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
		billingParam === "yearly" ? "yearly" : "monthly",
	);

	// Currency selector
	const [currency, setCurrency] = useState<"USD" | "NGN" | "GHS" | "KES">("USD");

	// Submission state
	const [isProcessing, setIsProcessing] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const activePlan = PLAN_CATALOG[selectedPlanId] || PLAN_CATALOG.landing;
	const PlanIcon = activePlan.icon;

	const total =
		billingCycle === "yearly" ? activePlan.yearlyPrice : activePlan.monthlyPrice;

	// Redirects directly to Flutterwave Hosted Checkout Page
	const handleFlutterwaveCheckout = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isProcessing) return;

		try {
			setIsProcessing(true);
			setErrorMessage(null);

			const idempotencyKey = crypto.randomUUID();

			const res = await fetch("/api/payments/initialize", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Idempotency-Key": idempotencyKey,
				},
				body: JSON.stringify({
					plan: activePlan.dbPlan,
					currency,
				}),
			});

			const data = await res.json();

			if (!res.ok || !data.link) {
				if (res.status === 401) {
					router.push("/get-started?tab=login&redirect=/checkout");
					return;
				}
				setErrorMessage(data.error || "Failed to initialize Flutterwave payment session.");
				setIsProcessing(false);
				return;
			}

			// Direct Redirect to Flutterwave Secure Hosted Checkout
			window.location.href = data.link;
		} catch (err) {
			console.error("[CHECKOUT_ERROR]", err);
			setErrorMessage("An unexpected network error occurred.");
			setIsProcessing(false);
		}
	};

	return (
		<main className="min-h-screen bg-[#f8fafc] w-full overflow-x-hidden text-gray-900 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* Top Navigation */}
				<div className="flex items-center justify-between gap-4 mb-8">
					<Link
						href="/services"
						className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">
						<ArrowLeft className="w-4 h-4" />
						<span>Back to Services</span>
					</Link>

					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
						<Lock className="w-3.5 h-3.5 text-emerald-600" />
						<span>256-Bit Encrypted Flutterwave Checkout</span>
					</div>
				</div>

				{errorMessage && (
					<div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
						<AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
						<span>{errorMessage}</span>
					</div>
				)}

				<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
					{/* Header Banner */}
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
						<div className="flex items-center gap-4">
							<div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold border ${activePlan.badgeColor}`}>
								<PlanIcon className="w-7 h-7" />
							</div>
							<div>
								<div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-extrabold uppercase tracking-wider mb-1">
									<Sparkles className="w-3 h-3" />
									<span>Selected Plan</span>
								</div>
								<h1 className="text-2xl font-bold font-nohemi text-gray-900">
									{activePlan.name}
								</h1>
								<p className="text-xs text-gray-500 font-medium">
									{activePlan.subtitle}
								</p>
							</div>
						</div>

						<div className="text-left sm:text-right">
							<span className="text-xs font-semibold text-gray-400 block">Total Due</span>
							<span className="text-3xl font-bold font-nohemi text-blue-600">
								${total}.00
							</span>
						</div>
					</div>

					{/* Options Bar: Billing Cycle & Currency */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
						{/* Billing Switcher */}
						<div className="space-y-1.5">
							<label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
								Billing Cycle
							</label>
							<div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-xl border border-gray-200">
								<button
									type="button"
									onClick={() => setBillingCycle("monthly")}
									className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
										billingCycle === "monthly"
											? "bg-blue-600 text-white shadow-xs"
											: "text-gray-600 hover:text-gray-900"
									}`}>
									Monthly (${activePlan.monthlyPrice}/mo)
								</button>
								<button
									type="button"
									onClick={() => setBillingCycle("yearly")}
									className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
										billingCycle === "yearly"
											? "bg-blue-600 text-white shadow-xs"
											: "text-gray-600 hover:text-gray-900"
									}`}>
									<span>Yearly</span>
									<span className="text-[9px] px-1 py-0.2 rounded-full font-extrabold bg-emerald-100 text-emerald-700">
										-20%
									</span>
								</button>
							</div>
						</div>

						{/* Currency Selector */}
						<div className="space-y-1.5">
							<label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
								Payment Currency
							</label>
							<select
								value={currency}
								onChange={(e) => setCurrency(e.target.value as any)}
								className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-600 cursor-pointer">
								<option value="USD">USD ($ - US Dollar)</option>
								<option value="NGN">NGN (₦ - Nigerian Naira)</option>
								<option value="GHS">GHS (GH₵ - Ghanaian Cedi)</option>
								<option value="KES">KES (KSh - Kenyan Shilling)</option>
							</select>
						</div>
					</div>

					{/* Plan Deliverables */}
					<div className="space-y-3">
						<h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
							Included in this build:
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{activePlan.features.map((feat) => (
								<div key={feat} className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center gap-2.5 text-xs text-gray-700 font-medium">
									<CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
									<span>{feat}</span>
								</div>
							))}
						</div>
					</div>

					{/* Flutterwave Express Action Box */}
					<div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-6">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
							<div>
								<div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-1">
									<Zap className="w-4 h-4 fill-current text-blue-400" />
									<span>Flutterwave Secure Checkout</span>
								</div>
								<h3 className="text-lg font-bold font-nohemi">
									Complete Payment via Flutterwave
								</h3>
								<p className="text-xs text-slate-400 font-medium mt-0.5">
									You will be redirected to Flutterwave&apos;s encrypted payment gateway.
								</p>
							</div>

							{/* Supported Logos Pill */}
							<div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700/80 shrink-0">
								<CreditCard className="w-3.5 h-3.5 text-blue-400" />
								<span>Card</span>
								<span>•</span>
								<Building2 className="w-3.5 h-3.5 text-emerald-400" />
								<span>Bank</span>
								<span>•</span>
								<Smartphone className="w-3.5 h-3.5 text-amber-400" />
								<span>USSD</span>
							</div>
						</div>

						{/* Action Button */}
						<form onSubmit={handleFlutterwaveCheckout}>
							<PillButton
								type="submit"
								disabled={isProcessing}
								baseColor="#004ac6"
								circleColor="#ffffff"
								textColor="#ffffff"
								hoverTextColor="#004ac6"
								useThunderFont={true}
								className="w-full py-4 rounded-full font-bold text-sm shadow-xl cursor-pointer text-center">
								{isProcessing ? (
									<span className="inline-flex items-center gap-2">
										<Loader2 className="w-4 h-4 animate-spin" />
										<span>Redirecting to Flutterwave...</span>
									</span>
								) : (
									<span>Proceed to Flutterwave Checkout (${total}.00) →</span>
								)}
							</PillButton>
						</form>

						<div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium pt-2">
							<ShieldCheck className="w-4 h-4 text-emerald-400" />
							<span>Protected by 14-Day Money-Back Guarantee & SSL Encryption</span>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

export default function CheckoutPage() {
	return (
		<main className="min-h-screen bg-[#f8fafc] w-full overflow-x-hidden text-gray-900">
			<Navbar />
			<Suspense
				fallback={
					<div className="min-h-screen flex items-center justify-center text-xs font-bold text-gray-500">
						Loading checkout...
					</div>
				}>
				<CheckoutContent />
			</Suspense>
			<Footer />
		</main>
	);
}
