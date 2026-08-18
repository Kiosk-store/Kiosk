/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PillButton from "@/components/PillButton";
import { Globe, CheckCircle2, Star, Send, ShieldCheck, PhoneCall, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default function LandingPageTemplate() {
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitted(true);
	};

	return (
		<main className="min-h-screen bg-slate-50 flex flex-col font-sans">
			<Navbar />

			{/* Template Banner Notice */}
			<div className="bg-blue-600 text-white text-xs font-bold py-2.5 px-4 text-center sticky top-0 z-50 flex items-center justify-center gap-2">
				<Globe className="w-4 h-4" />
				<span>Template Preview: Landing Page Tier 01 (src/app/templates/landing-page)</span>
				<Link
					href="/checkout?plan=landing&billing=monthly"
					className="ml-3 bg-white text-blue-600 px-3 py-0.5 rounded-full font-extrabold uppercase text-[10px] hover:bg-blue-50 transition-colors">
					Use This Template →
				</Link>
			</div>

			{/* Hero Section */}
			<section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
				<div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
					<div className="lg:col-span-7 space-y-6">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
							<Star className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
							<span>High-Converting Landing Page Code</span>
						</div>

						<h1 className="text-3xl sm:text-5xl font-bold font-nohemi text-slate-900 leading-tight">
							Build Instant Credibility & Capture Qualified Leads
						</h1>

						<p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
							Engineered for modern service providers, consultants, local businesses, and startups requiring a fast, polished, conversion-focused online presence.
						</p>

						<div className="flex flex-wrap items-center gap-4 pt-2">
							<PillButton
								href="/checkout?plan=landing&billing=monthly"
								baseColor="#004ac6"
								circleColor="#ffffff"
								textColor="#ffffff"
								hoverTextColor="#004ac6"
								useThunderFont={true}
								className="px-8 py-3.5 text-xs font-bold border border-blue-600 shadow-md">
								Deploy Landing Page Now
							</PillButton>

							<a
								href="#inquiry-form"
								className="px-6 py-3.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
								View Demo Form
							</a>
						</div>

						<div className="pt-4 flex items-center gap-6 text-xs text-slate-500 font-semibold border-t border-slate-100">
							<span className="flex items-center gap-1.5">
								<Clock className="w-4 h-4 text-blue-600" />
								<span>3-5 Day Delivery</span>
							</span>
							<span className="flex items-center gap-1.5">
								<ShieldCheck className="w-4 h-4 text-emerald-600" />
								<span>100% Mobile Optimized</span>
							</span>
						</div>
					</div>

					{/* Demo Hero Graphic */}
					<div className="lg:col-span-5 bg-slate-900 rounded-2xl p-5 sm:p-6 text-white space-y-4 shadow-xl border border-slate-800">
						<div className="flex items-center justify-between border-b border-slate-800 pb-3">
							<div className="flex items-center gap-1.5">
								<div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
								<div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
								<div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
							</div>
							<span className="text-[10px] text-slate-400 font-mono">mybusiness.kiosk.site</span>
						</div>

						<div className="bg-slate-800/80 rounded-xl p-5 space-y-3">
							<span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold">
								DEMO STOREFRONT
							</span>
							<h4 className="text-lg font-bold font-nohemi text-white">
								Apex Advisory Partners
							</h4>
							<p className="text-xs text-slate-400 leading-relaxed">
								Strategic growth consulting for scaling enterprises and modern brand teams.
							</p>
							<div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs font-bold text-emerald-400">
								<span>Consultation Booking Active</span>
								<span>★ 4.9 (120+ Reviews)</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features & Intake Form */}
			<section id="inquiry-form" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
				<div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs space-y-6">
					<h3 className="text-xl font-bold font-nohemi text-slate-900">
						Core Included Template Features
					</h3>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{[
							"Custom Hero & Brand Header",
							"Services Overview Grid",
							"About & Mission Section",
							"Interactive Google Map Setup",
							"WhatsApp & Contact Form",
							"Basic Meta SEO & Sitemap",
						].map((item) => (
							<div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700">
								<CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
								<span>{item}</span>
							</div>
						))}
					</div>
				</div>

				<div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs space-y-4">
					<h3 className="text-xl font-bold font-nohemi text-slate-900">
						Demo Lead Capture Form
					</h3>

					{submitted ? (
						<div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
							<CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
							<p className="text-sm font-bold text-emerald-900">Inquiry Received!</p>
							<p className="text-xs text-emerald-700">This demo form captures lead details directly into your dashboard.</p>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
								<input
									type="text"
									required
									placeholder="John Doe"
									className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
								/>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
								<input
									type="email"
									required
									placeholder="john@example.com"
									className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
								/>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-700 mb-1">Project Details</label>
								<textarea
									rows={3}
									required
									placeholder="Describe your service needs..."
									className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
								/>
							</div>

							<button
								type="submit"
								className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2">
								<Send className="w-4 h-4" />
								<span>Submit Inquiry</span>
							</button>
						</form>
					)}
				</div>
			</section>

			<Footer />
		</main>
	);
}
