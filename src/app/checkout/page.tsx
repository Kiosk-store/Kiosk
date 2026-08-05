/** @format */

"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PillButton from "@/components/PillButton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import {
	ShieldCheck,
	Lock,
	CheckCircle2,
	CreditCard,
	Zap,
	Globe,
	ShoppingBag,
	Sparkles,
	ArrowLeft,
	HelpCircle,
	AlertCircle,
	Check,
} from "lucide-react";

interface PlanDetails {
	id: string;
	name: string;
	subtitle: string;
	setupPrice: number;
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
		name: "Landing Page",
		subtitle: "High-Converting Single Page Website",
		setupPrice: 499,
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
		name: "Landing Page",
		subtitle: "High-Converting Single Page Website",
		setupPrice: 499,
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
		name: "Sales Funnel",
		subtitle: "Multi-Step Lead & Conversion Engine",
		setupPrice: 799,
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
		name: "Sales Funnel",
		subtitle: "Multi-Step Lead & Conversion Engine",
		setupPrice: 799,
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
		name: "E-commerce Store",
		subtitle: "Full-Featured Digital & Product Shop",
		setupPrice: 1199,
		monthlyPrice: 43,
		yearlyPrice: 408,
		deliveryTime: "5–10 Days",
		icon: ShoppingBag,
		badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
		features: [
			"Complete product catalog setup & variations",
			"Slide-out cart drawer & instant checkout flow",
			"Stripe, Paystack & PayPal payment processing",
			"Automated customer order emails & inventory tracking",
			"Product search & dynamic category filtering",
			"SSL certificate & cloud hosting included",
		],
	},
	"ecommerce-store": {
		id: "ecommerce-store",
		name: "E-commerce Store",
		subtitle: "Full-Featured Digital & Product Shop",
		setupPrice: 1199,
		monthlyPrice: 43,
		yearlyPrice: 408,
		deliveryTime: "5–10 Days",
		icon: ShoppingBag,
		badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
		features: [
			"Complete product catalog setup & variations",
			"Slide-out cart drawer & instant checkout flow",
			"Stripe, Paystack & PayPal payment processing",
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

	const [selectedPlanId, setSelectedPlanId] = useState<string>(planParam);
	const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
		billingParam === "yearly" ? "yearly" : "monthly",
	);

	// Form State
	const [paymentMethod, setPaymentMethod] = useState<"card" | "apple" | "bank">(
		"card",
	);
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [businessName, setBusinessName] = useState("");
	const [cardNumber, setCardNumber] = useState("");
	const [cardExpiry, setCardExpiry] = useState("");
	const [cardCvc, setCardCvc] = useState("");
	const [promoCode, setPromoCode] = useState("");
	const [discount, setDiscount] = useState<number>(0);
	const [promoApplied, setPromoApplied] = useState<boolean>(false);
	const [promoError, setPromoError] = useState<string>("");

	// Submission state
	const [isProcessing, setIsProcessing] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const activePlan = PLAN_CATALOG[selectedPlanId] || PLAN_CATALOG.landing;
	const PlanIcon = activePlan.icon;

	const subtotal =
		billingCycle === "yearly" ? activePlan.yearlyPrice : activePlan.monthlyPrice;
	const total = Math.max(0, subtotal - discount);

	// Handle Promo Code
	const handleApplyPromo = (e: React.FormEvent) => {
		e.preventDefault();
		if (promoCode.trim().toUpperCase() === "KIOSK20" || promoCode.trim().toUpperCase() === "LAUNCH50") {
			setDiscount(50);
			setPromoApplied(true);
			setPromoError("");
		} else {
			setPromoError("Invalid promo code. Try 'KIOSK20' for $50 OFF.");
		}
	};

	// Form Submission Handler
	const handleSubmitPayment = (e: React.FormEvent) => {
		e.preventDefault();
		setIsProcessing(true);

		// Simulate payment processing
		setTimeout(() => {
			setIsProcessing(false);
			setIsSuccess(true);

			// Redirect after 3.5 seconds
			setTimeout(() => {
				router.push("/dashboard/projects");
			}, 3500);
		}, 1800);
	};

	// Format Card Number (adds spaces every 4 digits)
	const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
		const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
		setCardNumber(formatted);
	};

	// Format Expiry MM/YY
	const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
		if (raw.length >= 2) {
			setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
		} else {
			setCardExpiry(raw);
		}
	};

	return (
		<main className="min-h-screen bg-[#f8fafc] w-full overflow-x-hidden text-gray-900 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Top Bar Header */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-gray-200/80">
					<div>
						<Link
							href="/services"
							className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-2">
							<ArrowLeft className="w-3.5 h-3.5" />
							<span>Back to Services</span>
						</Link>
						<h1 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 tracking-tight">
							Checkout & Order Confirmation
						</h1>
					</div>

					<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shrink-0">
						<Lock className="w-3.5 h-3.5 text-emerald-600" />
						<span>256-Bit SSL Encrypted Checkout</span>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
					{/* Left Column: Order Summary & Package Breakdown */}
					<div className="lg:col-span-5 space-y-6">
						<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
							{/* Package Banner */}
							<div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-5">
								<div className="flex items-center gap-3">
									<div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border ${activePlan.badgeColor}`}>
										<PlanIcon className="w-6 h-6" />
									</div>
									<div>
										<span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
											Selected Service
										</span>
										<h2 className="text-xl font-bold font-nohemi text-gray-900 mt-0.5">
											{activePlan.name}
										</h2>
									</div>
								</div>

								<span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
									{activePlan.deliveryTime}
								</span>
							</div>

							{/* Billing Cycle Switcher */}
							<div className="space-y-2">
								<label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
									Select Hosting Billing Cycle
								</label>
								<div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl border border-gray-200/80">
									<button
										type="button"
										onClick={() => setBillingCycle("monthly")}
										className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
											billingCycle === "monthly"
												? "bg-white text-gray-900 shadow-xs"
												: "text-gray-500 hover:text-gray-900"
										}`}>
										Monthly (${activePlan.monthlyPrice}/mo)
									</button>
									<button
										type="button"
										onClick={() => setBillingCycle("yearly")}
										className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
											billingCycle === "yearly"
												? "bg-blue-600 text-white shadow-xs"
												: "text-gray-500 hover:text-gray-900"
										}`}>
										<span>Yearly</span>
										<span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
											billingCycle === "yearly" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
										}`}>
											-20%
										</span>
									</button>
								</div>
							</div>

							{/* Deliverables Checklist */}
							<div className="space-y-3 pt-2 border-t border-gray-100">
								<p className="text-xs font-bold text-gray-900 uppercase tracking-wider">
									Included in your package:
								</p>
								<ul className="space-y-2">
									{activePlan.features.map((feat) => (
										<li key={feat} className="flex items-start gap-2 text-xs font-medium text-gray-700">
											<CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
											<span>{feat}</span>
										</li>
									))}
								</ul>
							</div>

							{/* Promo Code Form */}
							<div className="pt-4 border-t border-gray-100">
								{!promoApplied ? (
									<form onSubmit={handleApplyPromo} className="space-y-2">
										<label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
											Promo Code
										</label>
										<div className="flex gap-2">
											<input
												type="text"
												value={promoCode}
												onChange={(e) => setPromoCode(e.target.value)}
												placeholder="Enter KIOSK20"
												className="flex-1 px-3.5 py-2 text-xs font-semibold uppercase bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
											<button
												type="submit"
												className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors cursor-pointer">
												Apply
											</button>
										</div>
										{promoError && (
											<p className="text-[11px] text-rose-500 font-medium">{promoError}</p>
										)}
									</form>
								) : (
									<div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
										<span>Promo Applied (KIOSK20)</span>
										<span>-$50.00</span>
									</div>
								)}
							</div>

							{/* Financial Breakdown */}
							<div className="space-y-2.5 pt-4 border-t border-gray-100 text-xs font-medium">
								<div className="flex justify-between text-gray-600">
									<span>Subscription Plan ({activePlan.name})</span>
									<span className="font-bold text-gray-900">
										{billingCycle === "yearly"
											? `$${activePlan.yearlyPrice}.00 / yr`
											: `$${activePlan.monthlyPrice}.00 / mo`}
									</span>
								</div>

								<div className="flex justify-between text-[11px] text-gray-400">
									<span>Billing Frequency</span>
									<span>
										{billingCycle === "yearly"
											? "Billed annually ($16/mo equivalent)"
											: "Billed monthly (Cancel anytime)"}
									</span>
								</div>

								{discount > 0 && (
									<div className="flex justify-between text-emerald-600 font-semibold">
										<span>Discount Applied</span>
										<span>-${discount}.00</span>
									</div>
								)}

								<div className="pt-3 border-t border-gray-200 flex justify-between items-baseline text-base font-bold text-gray-900 font-nohemi">
									<span>Total Due Today</span>
									<span className="text-2xl text-blue-600">${total}.00</span>
								</div>
							</div>

							{/* Money-back guarantee badge */}
							<div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
								<ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
								<div>
									<h4 className="text-xs font-bold text-gray-900">14-Day Satisfaction Guarantee</h4>
									<p className="text-[11px] text-gray-500 font-medium">
										Full refund if you aren&apos;t thrilled with your site draft. Zero risk.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column: Customer Details & Payment Form */}
					<div className="lg:col-span-7">
						<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-8">
							<form onSubmit={handleSubmitPayment} className="space-y-6">
								{/* Step 1: Account Information */}
								<div className="space-y-4">
									<h3 className="text-base font-bold font-nohemi text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
										<span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
											1
										</span>
										<span>Account & Project Details</span>
									</h3>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div>
											<label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
												Full Name *
											</label>
											<input
												type="text"
												required
												value={fullName}
												onChange={(e) => setFullName(e.target.value)}
												placeholder="Jane Doe"
												className="w-full px-4 py-3 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>

										<div>
											<label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
												Email Address *
											</label>
											<input
												type="email"
												required
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												placeholder="jane@example.com"
												className="w-full px-4 py-3 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>
									</div>

									<div>
										<label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
											Business / Website Name *
										</label>
										<input
											type="text"
											required
											value={businessName}
											onChange={(e) => setBusinessName(e.target.value)}
											placeholder="e.g. Acme Coffee Roasters"
											className="w-full px-4 py-3 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</div>

								{/* Step 2: Payment Method Selection */}
								<div className="space-y-4 pt-4">
									<h3 className="text-base font-bold font-nohemi text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
										<span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
											2
										</span>
										<span>Payment Method</span>
									</h3>

									<div className="grid grid-cols-3 gap-3">
										{[
											{ id: "card", label: "Credit Card", icon: CreditCard },
											{ id: "apple", label: "Apple / Google", icon: Zap },
											{ id: "bank", label: "Direct Transfer", icon: Globe },
										].map((method) => {
											const Icon = method.icon;
											const isSelected = paymentMethod === method.id;
											return (
												<button
													key={method.id}
													type="button"
													onClick={() => setPaymentMethod(method.id as any)}
													className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
														isSelected
															? "bg-blue-50/70 border-blue-600 text-blue-700 shadow-2xs"
															: "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
													}`}>
													<Icon className="w-4 h-4 shrink-0" />
													<span className="text-[11px] font-bold">{method.label}</span>
												</button>
											);
										})}
									</div>

									{paymentMethod === "card" && (
										<div className="space-y-4 pt-2">
											<div>
												<label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
													Card Number *
												</label>
												<input
													type="text"
													required
													value={cardNumber}
													onChange={handleCardNumberChange}
													placeholder="4532 •••• •••• 8892"
													maxLength={19}
													className="w-full px-4 py-3 text-xs font-mono font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
												/>
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div>
													<label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
														Expiry Date *
													</label>
													<input
														type="text"
														required
														value={cardExpiry}
														onChange={handleExpiryChange}
														placeholder="MM/YY"
														maxLength={5}
														className="w-full px-4 py-3 text-xs font-mono font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
													/>
												</div>

												<div>
													<label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
														CVC / CVV *
													</label>
													<input
														type="text"
														required
														value={cardCvc}
														onChange={(e) =>
															setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
														}
														placeholder="123"
														maxLength={4}
														className="w-full px-4 py-3 text-xs font-mono font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
													/>
												</div>
											</div>
										</div>
									)}

									{paymentMethod === "apple" && (
										<div className="p-6 rounded-2xl bg-gray-900 text-white text-center space-y-3">
											<p className="text-xs font-medium text-gray-300">
												One-touch express authorization via Apple Pay or Google Pay.
											</p>
											<div className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
												<Zap className="w-4 h-4 fill-current text-blue-600" />
												<span>Pay with Apple Pay</span>
											</div>
										</div>
									)}

									{paymentMethod === "bank" && (
										<div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-2">
											<p className="text-xs font-bold">Direct Bank & Wire Instructions</p>
											<p className="text-[11px] leading-relaxed text-blue-700 font-medium">
												After placing your order, unique account details will be dispatched to your email for transfer verification.
											</p>
										</div>
									)}
								</div>

								{/* Action CTA */}
								<div className="pt-4">
									<PillButton
										type="submit"
										disabled={isProcessing || isSuccess}
										baseColor="#004ac6"
										circleColor="#ffffff"
										textColor="#ffffff"
										hoverTextColor="#004ac6"
										useThunderFont={true}
										className="w-full py-4 rounded-full font-bold text-sm shadow-xl cursor-pointer text-center">
										{isProcessing
											? "Processing Payment..."
											: `Pay $${total}.00 & Launch Project`}
									</PillButton>

									<p className="text-[11px] text-gray-400 font-medium text-center mt-3">
										By completing your order, you agree to Kiosk&apos;s Terms of Service & Privacy Policy.
									</p>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>

			{/* Success Confirmation Modal */}
			{isSuccess && (
				<div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
					<div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full text-center space-y-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-300">
						<div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
							<Check className="w-8 h-8 stroke-[3]" />
						</div>

						<div>
							<span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
								Payment Confirmed
							</span>
							<h3 className="text-2xl font-bold font-nohemi text-gray-900 mt-3">
								Welcome to Kiosk!
							</h3>
							<p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">
								Your payment of <strong className="text-gray-900">${total}.00</strong> for{" "}
								<strong className="text-gray-900">{activePlan.name}</strong> was successful.
								Your project workspace is initialized.
							</p>
						</div>

						<div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 text-left text-xs space-y-1.5 font-mono">
							<div className="flex justify-between text-gray-500">
								<span>Order Ref:</span>
								<span className="font-bold text-gray-900">ORD-849204</span>
							</div>
							<div className="flex justify-between text-gray-500">
								<span>Delivery ETA:</span>
								<span className="font-bold text-gray-900">{activePlan.deliveryTime}</span>
							</div>
						</div>

						<PillButton
							href="/dashboard/projects"
							baseColor="#004ac6"
							circleColor="#ffffff"
							textColor="#ffffff"
							hoverTextColor="#004ac6"
							useThunderFont={true}
							className="w-full py-3.5 rounded-full font-bold text-xs shadow-md text-center">
							Go to My Project Dashboard →
						</PillButton>
					</div>
				</div>
			)}
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
