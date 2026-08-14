/** @format */

"use client";

import Image from "next/image";
import PillButton from "./PillButton";
import { Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Hero() {
	return (
		<section className="relative pt-32 pb-20 md:pt-44 md:pb-28 lg:pt-48 lg:pb-32 bg-white overflow-hidden">
			{/* Decorative elements */}
			<div className="absolute top-0 right-0 w-[500px] h-[500px] border-2 border-blue-100 rotate-12 pointer-events-none" />
			<div className="absolute bottom-0 left-0 w-[400px] h-[400px] border-2 border-blue-50 -rotate-6 pointer-events-none" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-50 rounded-full pointer-events-none" />

			{/* Background effects */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-0">
				<div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,_rgba(82,39,255,0.18)_0%,_rgba(82,39,255,0)_45%)] blur-2xl opacity-90" />
				<div className="absolute -right-12 top-24 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,_rgba(181,151,207,0.14)_0%,_rgba(181,151,207,0)_50%)] blur-xl opacity-88" />

				<svg
					className="absolute inset-0 w-full h-full overflow-visible"
					viewBox="0 0 1200 800"
					preserveAspectRatio="xMidYMid slice"
					xmlns="http://www.w3.org/2000/svg">
					<defs>
						<linearGradient
							id="g1"
							x1="0%"
							x2="100%"
							y1="0%"
							y2="100%">
							<stop
								offset="0%"
								stopColor="var(--color-primary, #5227FF)"
								stopOpacity="0.12"
							/>
							<stop
								offset="100%"
								stopColor="var(--color-primary, #5227FF)"
								stopOpacity="0.04"
							/>
						</linearGradient>
					</defs>
					<path
						d="M0 600 C300 520 600 720 900 640 C1150 560 1250 480 1400 420"
						fill="none"
						stroke="url(#g1)"
						strokeWidth="140"
						strokeLinecap="round"
					/>
					<circle
						cx="980"
						cy="140"
						r="56"
						fill="var(--color-primary, #5227FF)"
						opacity="0.12"
					/>
					<circle
						cx="160"
						cy="200"
						r="36"
						fill="var(--color-primary, #5227FF)"
						opacity="0.08"
					/>
					<circle
						cx="420"
						cy="520"
						r="24"
						fill="var(--color-primary, #5227FF)"
						opacity="0.06"
					/>
				</svg>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
				{/* Left Column */}
				<div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
					<h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-gray-900">
						KIOSK: Simple websites for small businesses
					</h1>

					<p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
						Landing pages or online stores - we build and host them.
					</p>

					{/* CTAs */}
					<div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
						{/* Primary Button */}
						<PillButton
							href="/get-started"
							baseColor="#004ac6"
							circleColor="#ffffff"
							textColor="#ffffff"
							hoverTextColor="#004ac6"
							className="min-w-[180px] border-2 border-primary shadow-lg shadow-primary/20">
							Get Started
						</PillButton>

						{/* Secondary Button */}
						<PillButton
							href="#how-it-works"
							baseColor="#ffffff"
							circleColor="#004ac6"
							textColor="#0f172a"
							hoverTextColor="#ffffff"
							className="min-w-[180px] border-2 border-slate-300 hover:border-primary">
							How It Works →
						</PillButton>
					</div>

					{/* Metrics */}
					<div className="pt-8 border-t-2 border-gray-200 flex flex-wrap justify-center lg:justify-start items-center gap-6 sm:gap-8 text-gray-600">
						<div className="flex items-center gap-3">
							<div
								className="w-10 h-10 border-2 border-blue-600 bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0 rounded-full shadow-xs">
								<Clock className="w-5 h-5" />
							</div>
							<div className="text-left">
								<p className="text-sm font-bold text-gray-900">3-5 Days</p>
								<p className="text-xs text-gray-500 font-medium">
									Fast Launch Time
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div
								className="w-10 h-10 border-2 border-blue-600 bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0 rounded-full shadow-xs">
								<ShieldCheck className="w-5 h-5" />
							</div>
							<div className="text-left">
								<p className="text-sm font-bold text-gray-900">100% Yours</p>
								<p className="text-xs text-gray-500 font-medium">
									Your Brand & Content
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Right Column - Preview Card */}
				<div className="lg:col-span-5 relative mt-8 lg:mt-0">
					<div className="absolute -top-4 -right-4 w-20 sm:w-24 h-20 sm:h-24 border-2 border-blue-200 bg-blue-50 rounded-full" />
					<div className="absolute -bottom-4 -left-4 w-14 sm:w-16 h-14 sm:h-16 border-2 border-blue-100 bg-white rounded-full" />

					<div className="relative border-2 border-gray-200 bg-white rounded-2xl overflow-hidden shadow-xl">
						<div className="bg-gray-50 px-3 sm:px-4 py-3 flex items-center justify-between border-b-2 border-gray-200 gap-2">
							<div className="flex items-center gap-1.5 shrink-0">
								<div className="w-2.5 h-2.5 border border-red-400 bg-red-400 rounded-full" />
								<div className="w-2.5 h-2.5 border border-yellow-400 bg-yellow-400 rounded-full" />
								<div className="w-2.5 h-2.5 border border-green-400 bg-green-400 rounded-full" />
							</div>
							<div className="bg-white px-2.5 sm:px-3.5 py-1 border border-gray-300 text-[10px] sm:text-[11px] text-gray-600 font-mono flex items-center gap-1.5 rounded-full truncate max-w-[200px] sm:max-w-none">
								<span className="w-2 h-2 border border-emerald-500 bg-emerald-500 rounded-full shrink-0" />
								<span className="truncate">mybusiness.kioosk.online</span>
							</div>
							<span className="text-xs text-gray-400 hidden sm:inline">Secure</span>
						</div>

						<div className="aspect-[4/3] relative bg-gray-100">
							<Image
								src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8aQk-KbKq9uq35WVpvTGYdN49vv_82NRAiRkb7WhCYwvPU1ULvlJ2Z20SYODhiByYVtUOZpH4KiT-NHZf8R_BGqRAw9s9nU8WXx6e_tTImQxFc2JpJ5ks6nQOkXWnremwqd3HVKKVtvtHwL4qkIrRQFroX_cd3cpvT6gL9PG7bhjjyIWP2DGKgoGK1A5cgeGCa7SET1iJSmL34Kfa0m38BMJQkhFqwdDGzMEuDXUO_ABi5UfR8kJB"
								alt="Bakery custom website preview created by Kiosk"
								fill
								sizes="(max-width: 1024px) 100vw, 42vw"
								className="object-cover"
								priority
							/>
						</div>

						<div className="absolute bottom-3 left-3 sm:-bottom-5 sm:-left-5 bg-white/95 backdrop-blur-xs p-3 sm:p-4 border-2 border-gray-200 flex items-center gap-3 rounded-2xl shadow-lg max-w-[calc(100%-1.5rem)]">
							<div
								className="w-8 sm:w-10 h-8 sm:h-10 border-2 border-emerald-500 bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 rounded-full">
								<CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5" />
							</div>
							<div>
								<p className="text-xs text-gray-500 font-medium">
									Status: <span className="font-bold text-gray-900">Live & Published</span>
								</p>
								<p className="text-[10px] sm:text-xs font-bold text-blue-600">
									Turnkey Website Ready
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
