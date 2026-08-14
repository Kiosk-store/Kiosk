/** @format */

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, ArrowLeft, Lock, Mail } from "lucide-react";

export const metadata = {
	title: "Privacy Policy | Kiosk",
	description:
		"Learn how Kiosk collects, uses, protects, and handles your personal and business information.",
};

export default function PrivacyPolicyPage() {
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
							<ShieldCheck className="w-5 h-5" />
						</div>
						<h1 className="text-3xl sm:text-5xl font-bold font-nohemi text-slate-900 tracking-tight">
							Privacy Policy
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
						<Lock className="w-5 h-5 text-blue-600 shrink-0" />
						<span>1. Introduction & Overview</span>
					</h2>
					<p>
						Welcome to Kiosk (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), accessible via{" "}
						<a
							href="https://kioosk.online"
							className="text-blue-600 hover:underline font-semibold">
							kioosk.online
						</a>
						. We provide turnkey website development, hosting, custom domain configuration, and ongoing online store management services for small businesses and creators.
					</p>
					<p>
						This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you register for an account, subscribe to our turnkey website packages, or interact with our services.
					</p>
				</div>

				{/* Information Collected */}
				<div className="space-y-4">
					<h2 className="text-xl font-bold text-slate-900 font-nohemi">
						2. Information We Collect
					</h2>
					<p>
						We collect information that you voluntarily provide to us when creating an account or building your turnkey website, as well as automatic analytics data:
					</p>
					<ul className="list-disc pl-6 space-y-2.5 text-slate-700">
						<li>
							<strong className="text-slate-900">Account & Contact Information:</strong> Your name, email address, phone number, business name, and password credentials.
						</li>
						<li>
							<strong className="text-slate-900">Business Assets & Content:</strong> Business logos, product catalogues, WhatsApp contact numbers, images, copy, and custom domain names submitted for website construction.
						</li>
						<li>
							<strong className="text-slate-900">Payment & Billing Data:</strong> Payment card details and transaction history processed through secure PCI-compliant third-party gateways (Stripe and Paystack). Kiosk does not store raw credit card numbers on our servers.
						</li>
						<li>
							<strong className="text-slate-900">Technical & Usage Logs:</strong> IP address, browser type, device descriptors, operating system, and page usage telemetry collected automatically via essential cookies and analytics tools.
						</li>
					</ul>
				</div>

				{/* How We Use Info */}
				<div className="space-y-4">
					<h2 className="text-xl font-bold text-slate-900 font-nohemi">
						3. How We Use Your Information
					</h2>
					<p>We use the collected information for essential business purposes, including:</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
						<div className="bg-slate-50 border border-gray-200 p-4 rounded-xl space-y-1">
							<h4 className="font-bold text-blue-600 text-xs uppercase tracking-wider">
								Service Provision
							</h4>
							<p className="text-xs text-slate-600">
								Building, publishing, and hosting your custom landing pages, sales funnels, and online storefronts.
							</p>
						</div>
						<div className="bg-slate-50 border border-gray-200 p-4 rounded-xl space-y-1">
							<h4 className="font-bold text-blue-600 text-xs uppercase tracking-wider">
								Domain & SSL Setup
							</h4>
							<p className="text-xs text-slate-600">
								Provisioning SSL certificates and connecting subdomains or custom domain names.
							</p>
						</div>
						<div className="bg-slate-50 border border-gray-200 p-4 rounded-xl space-y-1">
							<h4 className="font-bold text-blue-600 text-xs uppercase tracking-wider">
								Communication & Alerts
							</h4>
							<p className="text-xs text-slate-600">
								Sending build progress updates, invoice receipts, support responses, and account notifications via Resend.
							</p>
						</div>
						<div className="bg-slate-50 border border-gray-200 p-4 rounded-xl space-y-1">
							<h4 className="font-bold text-blue-600 text-xs uppercase tracking-wider">
								Security & Performance
							</h4>
							<p className="text-xs text-slate-600">
								Detecting fraud, enforcing rate limiting, and ensuring uninterrupted platform uptime.
							</p>
						</div>
					</div>
				</div>

				{/* Data Sharing */}
				<div className="space-y-4">
					<h2 className="text-xl font-bold text-slate-900 font-nohemi">
						4. Data Sharing & Third-Party Sub-processors
					</h2>
					<p>
						We do not sell, rent, or trade your personal data to third parties. We only share necessary data with trusted infrastructure providers required to operate our service:
					</p>
					<ul className="list-disc pl-6 space-y-2 text-slate-700">
						<li>
							<strong className="text-slate-900">Cloud Infrastructure & Hosting:</strong> Vercel Inc. and Neon PostgreSQL Database for serverless hosting and data storage.
						</li>
						<li>
							<strong className="text-slate-900">Payment Processing:</strong> Stripe and Paystack for processing recurring subscription billing.
						</li>
						<li>
							<strong className="text-slate-900">Transactional Email Delivery:</strong> Resend for automated transactional system emails.
						</li>
					</ul>
				</div>

				{/* Data Security & Retention */}
				<div className="space-y-4">
					<h2 className="text-xl font-bold text-slate-900 font-nohemi">
						5. Data Security & Retention
					</h2>
					<p>
						We employ industry-standard security safeguards, including TLS 1.3 encryption in transit, bcrypt password hashing, and restricted database access control. We retain personal data for as long as your account remains active or as required by applicable tax and legal obligations.
					</p>
				</div>

				{/* User Rights */}
				<div className="space-y-4">
					<h2 className="text-xl font-bold text-slate-900 font-nohemi">
						6. Your Data Rights & Choices
					</h2>
					<p>Depending on your jurisdiction, you possess the right to:</p>
					<ul className="list-disc pl-6 space-y-2 text-slate-700">
						<li>Access, inspect, or request a copy of your personal data stored with Kiosk.</li>
						<li>Request correction of inaccurate profile or company details.</li>
						<li>Request full account deletion and site un-publishing.</li>
					</ul>
					<p className="pt-2">
						To exercise any of these rights, please email our support team at{" "}
						<a
							href="mailto:support@kioosk.online"
							className="text-blue-600 font-bold hover:underline">
							support@kioosk.online
						</a>
						.
					</p>
				</div>

				{/* Contact Us Box */}
				<div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
					<div className="space-y-1 text-center sm:text-left">
						<h3 className="text-base font-bold text-slate-900 font-nohemi flex items-center justify-center sm:justify-start gap-2">
							<Mail className="w-4 h-4 text-blue-600" />
							<span>Questions about our Privacy Policy?</span>
						</h3>
						<p className="text-xs text-slate-600">
							Contact our privacy team directly for assistance with your account data.
						</p>
					</div>
					<a
						href="mailto:hello@kioosk.online"
						className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shrink-0 shadow-md">
						Contact Privacy Team
					</a>
				</div>
			</section>

			<Footer />
		</main>
	);
}
