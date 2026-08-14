/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PillButton from "@/components/PillButton";
import { Zap, CheckCircle2, Play, ArrowRight, ShieldCheck, Lock, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default function SalesFunnelTemplate() {
	const [step, setStep] = useState<"optin" | "vsl" | "checkout">("optin");

	return (
		<main className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
			<Navbar />

			{/* Template Banner Notice */}
			<div className="bg-purple-600 text-white text-xs font-bold py-2.5 px-4 text-center sticky top-0 z-50 flex items-center justify-center gap-2">
				<Zap className="w-4 h-4" />
				<span>Template Preview: Sales Funnel Tier 02 (src/app/templates/sales-funnel)</span>
				<Link
					href="/checkout?plan=funnel&billing=monthly"
					className="ml-3 bg-white text-purple-700 px-3 py-0.5 rounded-full font-extrabold uppercase text-[10px] hover:bg-purple-50 transition-colors">
					Use This Template →
				</Link>
			</div>

			{/* Funnel Flow Header Steps */}
			<div className="pt-24 pb-6 px-4 max-w-4xl mx-auto w-full">
				<div className="grid grid-cols-3 gap-2 bg-slate-800/80 border border-slate-700 p-2 rounded-2xl text-center text-xs font-bold">
					<button
						type="button"
						onClick={() => setStep("optin")}
						className={`py-2 rounded-xl transition-all ${
							step === "optin" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
						}`}>
						Step 1: Lead Magnet
					</button>
					<button
						type="button"
						onClick={() => setStep("vsl")}
						className={`py-2 rounded-xl transition-all ${
							step === "vsl" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
						}`}>
						Step 2: VSL Offer
					</button>
					<button
						type="button"
						onClick={() => setStep("checkout")}
						className={`py-2 rounded-xl transition-all ${
							step === "checkout" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
						}`}>
						Step 3: Conversion
					</button>
				</div>
			</div>

			{/* Funnel Step Content */}
			<div className="pb-20 px-4 max-w-5xl mx-auto w-full flex-1">
				{step === "optin" && (
					<div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-8 sm:p-12 space-y-8 text-center animate-in fade-in zoom-in-95 duration-300">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
							<Sparkles className="w-3.5 h-3.5" />
							<span>FREE BLUEPRINT DOWNLOAD</span>
						</div>

						<h1 className="text-3xl sm:text-5xl font-bold font-nohemi text-white max-w-3xl mx-auto leading-tight">
							The 5-Step Customer Acquisition System For Modern Brands
						</h1>

						<p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
							Enter your email below to instantly receive the PDF guide and unlock exclusive video training.
						</p>

						<div className="max-w-md mx-auto space-y-3">
							<input
								type="email"
								placeholder="Enter your primary email address..."
								className="w-full px-5 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
							/>
							<button
								type="button"
								onClick={() => setStep("vsl")}
								className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg">
								<span>Access Blueprint & Watch Video →</span>
							</button>
						</div>
					</div>7
				)}

				{step === "vsl" && (
					<div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-8 sm:p-12 space-y-8 animate-in fade-in zoom-in-95 duration-300">
						<div className="text-center space-y-3">
							<h2 className="text-2xl sm:text-4xl font-bold font-nohemi text-white">
								Watch How We Scale Revenue in 30 Days
							</h2>
							<p className="text-xs text-slate-400 font-mono">
								HIGH-CONVERTING VSL PRESENTATION MODULE
							</p>
						</div>

						{/* Mock Video Player */}
						<div className="w-full aspect-video bg-slate-950 rounded-2xl border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer" onClick={() => setStep("checkout")}>
							<div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
								<Play className="w-8 h-8 fill-white translate-x-0.5" />
							</div>
							<p className="text-xs font-bold text-slate-300 mt-4">Click To Play Masterclass Video (14:20)</p>
						</div>

						<div className="text-center pt-4">
							<button
								type="button"
								onClick={() => setStep("checkout")}
								className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors inline-flex items-center gap-2 shadow-lg">
								<span>Unlock Core Offer & Claim Guarantee →</span>
							</button>
						</div>
					</div>
				)}

				{step === "checkout" && (
					<div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-8 sm:p-12 space-y-8 animate-in fade-in zoom-in-95 duration-300">
						<div className="text-center space-y-3">
							<h2 className="text-2xl sm:text-4xl font-bold font-nohemi text-white">
								Sales Funnel Turnkey Delivery
							</h2>
							<p className="text-xs text-purple-300 font-mono">
								COMPLETE MULTI-STEP CONVERSION SYSTEM
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-700">
								<h4 className="text-sm font-bold text-purple-300">What You Get</h4>
								{[
									"3-5 Connected sales & thank-you pages",
									"Mailchimp / CRM automation setup",
									"Meta Pixel & Google Analytics wired",
									"Turnkey delivery in 3-5 days",
								].map((item) => (
									<div key={item} className="flex items-center gap-2 text-xs text-slate-300">
										<CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
										<span>{item}</span>
									</div>
								))}
							</div>

							<div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-700 flex flex-col justify-between">
								<div>
									<h4 className="text-sm font-bold text-white">Turnkey Price</h4>
									<p className="text-3xl font-bold text-purple-400 font-nohemi mt-1">$30 / mo</p>
									<p className="text-xs text-slate-400 mt-1">One-time setup + maintenance included.</p>
								</div>

								<PillButton
									href="/checkout?plan=funnel&billing=monthly"
									baseColor="#004ac6"
									circleColor="#ffffff"
									textColor="#ffffff"
									hoverTextColor="#004ac6"
									useThunderFont={true}
									className="w-full py-3 text-xs font-bold border border-blue-600 shadow-md text-center">
									Start Sales Funnel Now
								</PillButton>
							</div>
						</div>
					</div>
				)}
			</div>

			<Footer />
		</main>
	);
}
