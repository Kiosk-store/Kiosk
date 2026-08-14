/** @format */

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, ArrowLeft, CheckCircle2, Scale, HelpCircle } from "lucide-react";

export const metadata = {
	title: "Terms of Service | Kiosk",
	description:
		"Read the terms, conditions, guarantees, and service rules governing your use of Kiosk turnkey website packages.",
};

export default function TermsOfServicePage() {
	const lastUpdated = "August 14, 2026";

	return (
		<main className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
			<Navbar />

			{/* Page Header */}
			<section className="pt-32 pb-12 sm:pt-40 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200/80 bg-slate-50/70">
				<div className="max-w-4xl mx-auto space-y-4 text-center sm:text-left">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors mb-2">
						<ArrowLeft className="w-4 h-4" />
						<span>Back to Home</span>
					</Link>
					<div className="flex items-center justify-center sm:justify-start gap-3">
						<div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
							<FileText className="w-5 h-5" />
						</div>
						<h1 className="text-3xl sm:text-5xl font-bold font-nohemi text-slate-900 tracking-tight">
							Terms of Service
						</h1>
					</div>
					<p className="text-slate-500 text-xs sm:text-sm font-mono">
						Last Updated: {lastUpdated} • Kiosk Technologies (kioosk.online)
					</p>
				</div>
			</section>

			{/* Content Container */}
			<section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex-1 space-y-10 text-slate-700 text-sm leading-relaxed">
				{/* Overview */}
				<div className="bg-slate-50 border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
					<h2 className="text-xl font-bold text-slate-900 font-nohemi flex items-center gap-2">
						<Scale className="w-5 h-5 text-blue-600 shrink-0" />
						<span>1. Agreement & Acceptance</span>
					</h2>
					<p>
						These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;Customer,&quot; &quot;User,&quot; or &quot;Subscriber&quot;) and Kiosk Technologies (&quot;Kiosk,&quot; &quot;we,&quot; or &quot;us&quot;), governing your access to and use of our platform at{" "}
						<a
							href="https://kioosk.online"
							className="text-blue-600 hover:underline font-semibold">
							kioosk.online
						</a>{" "}
						and related website building, hosting, and management services.
					</p>
					<p>
						By creating an account, selecting a plan, or placing an order, you agree to comply with and be bound by these Terms.
					</p>
				</div>

				{/* Turnkey Services & Delivery */}
				<div className="space-y-4">
					<h2 className="text-xl font-bold text-slate-900 font-nohemi">
						2. Turnkey Services & 3-5 Day Delivery Guarantee
					</h2>
					<p>
						Kiosk provides end-to-end turnkey website creation and hosting. Upon submitting your business information, photos, pricing, and contact details via our onboarding wizard, our team commits to delivering your initial live site preview within 3 to 5 business days.
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
						<div className="bg-slate-50 border border-gray-200 p-4 rounded-xl space-y-1 text-center">
							<span className="text-blue-600 font-bold font-nohemi text-lg block">Tier 01</span>
							<h4 className="font-bold text-slate-900 text-xs">Landing Page</h4>
							<p className="text-[11px] text-slate-500">$15 / month</p>
						</div>
						<div className="bg-slate-50 border border-gray-200 p-4 rounded-xl space-y-1 text-center">
							<span className="text-blue-600 font-bold font-nohemi text-lg block">Tier 02</span>
							<h4 className="font-bold text-slate-900 text-xs">Sales Funnel</h4>
							<p className="text-[11px] text-slate-500">$30 / month</p>
						</div>
						<div className="bg-slate-50 border border-gray-200 p-4 rounded-xl space-y-1 text-center">
							<span className="text-blue-600 font-bold font-nohemi text-lg block">Tier 03</span>
							<h4 className="font-bold text-slate-900 text-xs">E-Commerce Store</h4>
							<p className="text-[11px] text-slate-500">$50 / month</p>
						</div>
					</div>
				</div>

				{/* Subscriptions & Cancellation */}
				<div className="space-y-4">
					<h2 className="text-xl font-bold text-slate-900 font-nohemi">
						3. Subscription Billing, Upgrades & Cancellations
					</h2>
					<ul className="list-disc pl-6 space-y-2 text-slate-700">
						<li>
							<strong className="text-slate-900">Recurring Billing:</strong> Subscriptions are billed automatically on a monthly or annual recurring basis via our payment processors (Stripe / Paystack).
						</li>
						<li>
							<strong className="text-slate-900">30-Day Money-Back Guarantee:</strong> If you are dissatisfied with your site build during the first 30 days of subscription, you may request a 100% full refund with no cancellation fees.
						</li>
						<li>
							<strong className="text-slate-900">Cancellation:</strong> You may cancel your subscription at any time via your Account Dashboard or by contacting customer support. Upon cancellation, your site remains active until the end of the current paid billing period.
						</li>
					</ul>
				</div>

				{/* Ownership & IP Rights */}
				<div className="space-y-4">
					<h2 className="text-xl font-bold text-slate-900 font-nohemi">
						4. Intellectual Property & Brand Ownership
					</h2>
					<div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
						<CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
						<p className="text-xs text-slate-700">
							<strong className="text-slate-900">100% Customer Ownership:</strong> You retain complete ownership of all trademarks, business logos, copy, product images, and domain names provided to Kiosk. Kiosk retains ownership of core platform templates, proprietary code engines, and serverless hosting scripts.
						</p>
					</div>
				</div>

				{/* Prohibited Content */}
				<div className="space-y-4">
					<h2 className="text-xl font-bold text-slate-900 font-nohemi">
						5. Acceptable Use & Prohibited Content
					</h2>
					<p>You agree not to use Kiosk services to publish or distribute content that:</p>
					<ul className="list-disc pl-6 space-y-2 text-slate-700">
						<li>Is fraudulent, illegal, defamatory, or deceptive.</li>
						<li>Infringes on third-party trademarks, copyrights, or privacy rights.</li>
						<li>Contains malicious code, phishing forms, malware, or spam scripts.</li>
					</ul>
					<p>
						Violation of our Acceptable Use Policy may result in immediate suspension or termination of your hosted website.
					</p>
				</div>

				{/* Limitation of Liability */}
				<div className="space-y-4">
					<h2 className="text-xl font-bold text-slate-900 font-nohemi">
						6. Limitation of Liability & Service Availability
					</h2>
					<p>
						While Kiosk maintains 99.9% target hosting uptime powered by global edge servers, we do not warrant that services will be uninterrupted or completely error-free. To the maximum extent permitted by law, Kiosk shall not be liable for any indirect, incidental, or consequential damages resulting from business disruption or domain registrar delays outside our control.
					</p>
				</div>

				{/* Contact Support */}
				<div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
					<div className="space-y-1 text-center sm:text-left">
						<h3 className="text-base font-bold text-slate-900 font-nohemi flex items-center justify-center sm:justify-start gap-2">
							<HelpCircle className="w-4 h-4 text-blue-600" />
							<span>Questions about our Terms of Service?</span>
						</h3>
						<p className="text-xs text-slate-600">
							Our support team is available to assist you with billing or legal inquiries.
						</p>
					</div>
					<a
						href="mailto:support@kioosk.online"
						className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shrink-0 shadow-md">
						Contact Support
					</a>
				</div>
			</section>

			<Footer />
		</main>
	);
}
