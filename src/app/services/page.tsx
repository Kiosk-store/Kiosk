"use client";

import React from "react";
import ScrollReveal from "@/components/ScrollReveal";
import PillButton from "@/components/PillButton";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ServicesPage() {
	return (
		<main className="min-h-screen bg-surface w-full overflow-hidden">
			{/* Services Hero Section */}
			<section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
				<ScrollReveal>
					<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-8">
						<span className="material-symbols-outlined text-[16px]">
							workspace_premium
						</span>
						<span>Done-For-You Services</span>
					</div>
				</ScrollReveal>

				<ScrollReveal delay={0.1}>
					<h1 className="font-display-hero text-text-primary max-w-4xl mx-auto mb-6">
						Professional websites,
						<br />
						<span className="text-primary italic">built for you.</span>
					</h1>
				</ScrollReveal>

				<ScrollReveal delay={0.2}>
					<p className="text-body-lead text-text-secondary max-w-2xl mx-auto mb-10">
						Stop struggling with complicated website builders. Choose a package,
						tell us about your business, and our expert team will personalize a
						proven, high-converting template just for you.
					</p>
				</ScrollReveal>

				<ScrollReveal delay={0.3}>
					<PillButton
						href="/get-started"
						baseColor="#004ac6"
						circleColor="#ffffff"
						textColor="#ffffff"
						hoverTextColor="#004ac6"
						className="px-8 py-4 font-bold shadow-xl">
						Start Your Project
					</PillButton>
				</ScrollReveal>
			</section>

			{/* Service Offerings Section */}
			<section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Landing Page */}
					<ScrollReveal delay={0.1} direction="up" className="h-full">
						<div className="h-full bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col relative group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
							<div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
								<span className="material-symbols-outlined text-3xl">web</span>
							</div>
							<h3 className="text-2xl font-bold font-nohemi text-gray-900 mb-4">
								Landing Page
							</h3>
							<p className="text-gray-500 font-medium mb-8 leading-relaxed flex-grow">
								A single, high-converting page perfect for establishing your
								first professional digital footprint. Showcase your services,
								collect leads, and link your WhatsApp.
							</p>
							<div className="space-y-3 mb-8">
								<div className="flex items-center gap-3 text-sm font-medium text-gray-700">
									<span className="material-symbols-outlined text-emerald-500 text-[18px]">
										check_circle
									</span>
									Delivered in 3-5 days
								</div>
								<div className="flex items-center gap-3 text-sm font-medium text-gray-700">
									<span className="material-symbols-outlined text-emerald-500 text-[18px]">
										check_circle
									</span>
									Mobile-optimized design
								</div>
								<div className="flex items-center gap-3 text-sm font-medium text-gray-700">
									<span className="material-symbols-outlined text-emerald-500 text-[18px]">
										check_circle
									</span>
									Contact form integration
								</div>
							</div>
							<Link
								href="/#pricing"
								className="text-blue-600 font-bold inline-flex items-center gap-2 group/link">
								View Pricing
								<span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-1">
									arrow_forward
								</span>
							</Link>
						</div>
					</ScrollReveal>

					{/* Sales Funnel */}
					<ScrollReveal delay={0.2} direction="up" className="h-full">
						<div className="h-full bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-100 flex flex-col relative group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] ring-2 ring-blue-600/5 hover:ring-blue-600/20">
							<div className="absolute -top-4 left-8 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
								Most Popular
							</div>
							<div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
								<span className="material-symbols-outlined text-3xl">
									filter_alt
								</span>
							</div>
							<h3 className="text-2xl font-bold font-nohemi text-gray-900 mb-4">
								Sales Funnel
							</h3>
							<p className="text-gray-500 font-medium mb-8 leading-relaxed flex-grow">
								Multiple connected pages designed specifically to capture leads,
								nurture prospects, and drive direct conversions for your core
								offer.
							</p>
							<div className="space-y-3 mb-8">
								<div className="flex items-center gap-3 text-sm font-medium text-gray-700">
									<span className="material-symbols-outlined text-emerald-500 text-[18px]">
										check_circle
									</span>
									Delivered in 5-7 days
								</div>
								<div className="flex items-center gap-3 text-sm font-medium text-gray-700">
									<span className="material-symbols-outlined text-emerald-500 text-[18px]">
										check_circle
									</span>
									Lead magnet integration
								</div>
								<div className="flex items-center gap-3 text-sm font-medium text-gray-700">
									<span className="material-symbols-outlined text-emerald-500 text-[18px]">
										check_circle
									</span>
									Automated email sequences
								</div>
							</div>
							<Link
								href="/#pricing"
								className="text-blue-600 font-bold inline-flex items-center gap-2 group/link">
								View Pricing
								<span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-1">
									arrow_forward
								</span>
							</Link>
						</div>
					</ScrollReveal>

					{/* E-commerce Store */}
					<ScrollReveal delay={0.3} direction="up" className="h-full">
						<div className="h-full bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col relative group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
							<div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
								<span className="material-symbols-outlined text-3xl">
									shopping_bag
								</span>
							</div>
							<h3 className="text-2xl font-bold font-nohemi text-gray-900 mb-4">
								E-commerce Store
							</h3>
							<p className="text-gray-500 font-medium mb-8 leading-relaxed flex-grow">
								A full digital storefront. Complete with a product catalog,
								shopping cart, secure checkout, and inventory management backend.
							</p>
							<div className="space-y-3 mb-8">
								<div className="flex items-center gap-3 text-sm font-medium text-gray-700">
									<span className="material-symbols-outlined text-emerald-500 text-[18px]">
										check_circle
									</span>
									Delivered in 7-10 days
								</div>
								<div className="flex items-center gap-3 text-sm font-medium text-gray-700">
									<span className="material-symbols-outlined text-emerald-500 text-[18px]">
										check_circle
									</span>
									Up to 50 products uploaded
								</div>
								<div className="flex items-center gap-3 text-sm font-medium text-gray-700">
									<span className="material-symbols-outlined text-emerald-500 text-[18px]">
										check_circle
									</span>
									Secure payment gateway
								</div>
							</div>
							<Link
								href="/#pricing"
								className="text-blue-600 font-bold inline-flex items-center gap-2 group/link">
								View Pricing
								<span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-1">
									arrow_forward
								</span>
							</Link>
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* Process Reiteration */}
			<section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 border-y border-gray-200/50">
				<div className="max-w-5xl mx-auto">
					<ScrollReveal>
						<h2 className="font-section-heading text-center mb-16">
							How the process works
						</h2>
					</ScrollReveal>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
						{/* Connecting Line (Desktop) */}
						<div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-0.5 bg-gray-200 z-0"></div>

						{/* Step 1 */}
						<ScrollReveal delay={0.1} className="relative z-10 text-center">
							<div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-6 text-xl shadow-lg ring-4 ring-gray-50">
								1
							</div>
							<h4 className="text-xl font-bold font-nohemi text-gray-900 mb-3">
								Tell us your vision
							</h4>
							<p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto font-medium">
								Select your package and fill out a simple questionnaire about
								your business, brand colors, and goals.
							</p>
						</ScrollReveal>

						{/* Step 2 */}
						<ScrollReveal delay={0.2} className="relative z-10 text-center">
							<div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-6 text-xl shadow-lg ring-4 ring-gray-50">
								2
							</div>
							<h4 className="text-xl font-bold font-nohemi text-gray-900 mb-3">
								We build the site
							</h4>
							<p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto font-medium">
								Our team takes your input and personalizes a proven, professional
								template. No drag-and-drop required on your end.
							</p>
						</ScrollReveal>

						{/* Step 3 */}
						<ScrollReveal delay={0.3} className="relative z-10 text-center">
							<div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-6 text-xl shadow-lg ring-4 ring-gray-50">
								3
							</div>
							<h4 className="text-xl font-bold font-nohemi text-gray-900 mb-3">
								Review & Launch
							</h4>
							<p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto font-medium">
								We send you a preview link. You get two rounds of revisions, and
								then we push your beautiful new site live to the world.
							</p>
						</ScrollReveal>
					</div>
				</div>
			</section>

			<div className="pb-20 pt-10">
				<CTA />
			</div>

			<Footer />
		</main>
	);
}
