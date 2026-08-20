/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PillButton from "@/components/PillButton";
import { UserCheck, Calendar, Clock, CheckCircle2, Award, ArrowRight, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

const CONSULTING_PACKAGES = [
	{
		id: 1,
		name: "Strategy Audit & Diagnostic",
		price: "$490",
		period: "One-time session",
		desc: "Comprehensive 90-minute 1-on-1 audit of your growth funnel, conversion leaks, and tech stack.",
		features: ["90-Minute Live Video Audit", "Written Action Plan PDF", "Recording & Transcript Access"],
	},
	{
		id: 2,
		name: "Growth Advisor Retainer",
		price: "$1,800",
		period: "Per month",
		desc: "Ongoing strategic leadership, weekly advisory calls, and direct Slack access for scaling executives.",
		features: ["Bi-weekly Strategy Calls", "Unlimited Slack Async Support", "Monthly Performance Review"],
		popular: true,
	},
];

export default function ConsultingTemplate() {
	const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
	const [selectedDate, setSelectedDate] = useState<string>("Tomorrow, 2:00 PM EST");

	return (
		<main className="min-h-screen bg-slate-50 flex flex-col font-sans">
			<Navbar />

			{/* Template Banner Notice */}
			<div className="bg-teal-700 text-white text-xs font-bold py-2.5 px-4 text-center sticky top-0 z-50 flex items-center justify-center gap-2">
				<UserCheck className="w-4 h-4" />
				<span>Template Preview: Professional Services & Consulting (src/app/templates/consulting)</span>
				<Link
					href="/checkout?plan=landing&billing=monthly"
					className="ml-3 bg-white text-teal-800 px-3 py-0.5 rounded-full font-extrabold uppercase text-[10px] hover:bg-teal-50 transition-colors">
					Use This Template →
				</Link>
			</div>

			{/* Hero Section */}
			<section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
				<div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
					<div className="lg:col-span-7 space-y-6">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
							<Award className="w-3.5 h-3.5" />
							<span>PROFESSIONAL CONSULTING PRESET</span>
						</div>

						<h1 className="text-3xl sm:text-5xl font-bold font-nohemi text-slate-900 leading-tight">
							Executive Advisory & Growth Strategy For Scaling Leaders
						</h1>

						<p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
							Partner directly with experienced industry advisors to clarify your offer, optimize your acquisition channels, and scale revenue predictably.
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
								Deploy Consulting Template
							</PillButton>

							<a
								href="#booking-widget"
								className="px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors inline-flex items-center gap-2">
								<Calendar className="w-4 h-4 text-teal-600" />
								<span>Book Discovery Session</span>
							</a>
						</div>
					</div>

					{/* Advisor Profile Badge Card */}
					<div className="lg:col-span-5 bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-5 shadow-xl border border-slate-800">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-bold font-mono text-2xl">
								JD
							</div>
							<div>
								<h3 className="text-lg font-bold font-nohemi text-white">Julian Vance</h3>
								<p className="text-xs text-teal-400 font-medium">Principal Growth Advisor</p>
							</div>
						</div>

						<p className="text-xs text-slate-300 leading-relaxed">
							Former VP of Growth with 12+ years scaling SaaS and high-ticket service companies to 8-figure ARR.
						</p>

						<div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
							<div>
								<p className="font-bold text-white text-base">45+ Clients</p>
								<p className="text-[10px] text-slate-400">Scaled Past $1M ARR</p>
							</div>
							<div>
								<p className="font-bold text-teal-400 text-base">★ 4.98 / 5.0</p>
								<p className="text-[10px] text-slate-400">Verified Client Rating</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Service Packages */}
			<section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
				<div className="text-center max-w-2xl mx-auto space-y-3">
					<h2 className="text-2xl sm:text-3xl font-bold font-nohemi text-slate-900">
						Advisory Packages & Retainers
					</h2>
					<p className="text-xs sm:text-sm text-slate-500 font-medium">
						Transparent pricing designed for immediate ROI and sustainable scale.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
					{CONSULTING_PACKAGES.map((pkg) => (
						<div
							key={pkg.id}
							className={`bg-white border rounded-3xl p-8 shadow-sm flex flex-col justify-between space-y-6 ${
								pkg.popular ? "border-teal-500 ring-2 ring-teal-500/20" : "border-slate-200"
							}`}>
							<div className="space-y-4">
								{pkg.popular && (
									<span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
										MOST POPULAR
									</span>
								)}
								<h3 className="text-xl font-bold font-nohemi text-slate-900">{pkg.name}</h3>
								<p className="text-xs text-slate-500 leading-relaxed">{pkg.desc}</p>

								<div className="flex items-baseline gap-1 pt-2">
									<span className="text-3xl font-bold font-nohemi text-slate-900">{pkg.price}</span>
									<span className="text-xs font-semibold text-slate-400">/ {pkg.period}</span>
								</div>

								<div className="pt-4 border-t border-slate-100 space-y-2">
									{pkg.features.map((f) => (
										<div key={f} className="flex items-center gap-2 text-xs font-medium text-slate-700">
											<CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
											<span>{f}</span>
										</div>
									))}
								</div>
							</div>

							<button
								type="button"
								onClick={() => {
									const widget = document.getElementById("booking-widget");
									widget?.scrollIntoView({ behavior: "smooth" });
								}}
								className="w-full py-3 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition-colors cursor-pointer text-center">
								Book Strategy Session
							</button>
						</div>
					))}
				</div>
			</section>

			{/* Booking Widget Modal Simulator */}
			<section id="booking-widget" className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
				<div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-lg space-y-6">
					<div className="flex items-center gap-3">
						<Calendar className="w-6 h-6 text-teal-600" />
						<div>
							<h3 className="text-xl font-bold font-nohemi text-slate-900">Interactive Calendar Booking Widget</h3>
							<p className="text-xs text-slate-500 font-medium mt-0.5">Simulates 1-on-1 scheduling with automatic calendar invite dispatch.</p>
						</div>
					</div>

					{bookingConfirmed ? (
						<div className="p-8 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-3">
							<CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto" />
							<p className="text-base font-bold text-slate-900">Session Scheduled Successfully!</p>
							<p className="text-xs text-slate-600">A calendar invite with Google Meet video link has been dispatched for <strong>{selectedDate}</strong>.</p>
						</div>
					) : (
						<form onSubmit={(e) => { e.preventDefault(); setBookingConfirmed(true); }} className="space-y-4">
							<div>
								<label className="block text-xs font-bold text-slate-700 mb-1">Select Available Time Slot</label>
								<select
									value={selectedDate}
									onChange={(e) => setSelectedDate(e.target.value)}
									className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none">
									<option>Tomorrow, 2:00 PM EST</option>
									<option>Thursday, 10:30 AM EST</option>
									<option>Friday, 4:00 PM EST</option>
								</select>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name & Email</label>
								<input
									type="text"
									required
									placeholder="Alex Rivera (alex@company.com)"
									className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
								/>
							</div>

							<button
								type="submit"
								className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-md cursor-pointer">
								Confirm Calendar Booking →
							</button>
						</form>
					)}
				</div>
			</section>

			<Footer />
		</main>
	);
}
