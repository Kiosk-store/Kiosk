/** @format */

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, LayoutDashboard } from "lucide-react";
import PillButton from "@/components/PillButton";

export default function NotFound() {
	return (
		<div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 flex flex-col justify-between overflow-x-hidden relative select-none">
			{/* Architectural Accent Grid Lines */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(37,99,235,0.08)_0%,_rgba(248,250,252,0)_70%)] blur-3xl" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-slate-200/50 rounded-full" />

				{/* Vertical Grid Accent Lines */}
				<div className="absolute top-0 bottom-0 left-[10%] w-px bg-slate-300/40" />
				<div className="absolute top-0 bottom-0 right-[10%] w-px bg-slate-300/40" />

				{/* Horizontal Grid Accent Lines */}
				<div className="absolute top-[20%] left-0 right-0 h-px bg-slate-300/40" />
				<div className="absolute bottom-[20%] left-0 right-0 h-px bg-slate-300/40" />
			</div>

			{/* Top Bar Logo */}
			<header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
				<Link
					href="/"
					className="flex items-center select-none group py-0.5"
					aria-label="Kiosk Home">
					<img
						src="/KIOSK PNG2.png"
						alt="Kiosk"
						className="h-8 sm:h-9 w-auto max-w-[160px] sm:max-w-[190px] object-contain transition-transform duration-200 group-hover:scale-105"
					/>
				</Link>
			</header>

			{/* 404 Hero Content */}
			<main className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12 text-center flex-1 flex flex-col items-center justify-center">
				<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-extrabold uppercase tracking-wider mb-6">
					<span>404 Error</span>
				</div>

				<h1 className="text-7xl sm:text-9xl md:text-[11rem] font-extrabold font-thunder-lc tracking-tight text-slate-900 uppercase leading-none mb-4">
					PAGE NOT FOUND
				</h1>

				<p className="text-sm sm:text-base text-slate-500 font-medium max-w-md mx-auto mb-10 leading-relaxed">
					Sorry, the page you are looking for doesn&apos;t exist, has been removed, or is temporarily unavailable.
				</p>

				<div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
					<PillButton
						href="/"
						baseColor="#004ac6"
						circleColor="#ffffff"
						textColor="#ffffff"
						hoverTextColor="#004ac6"
						useThunderFont={true}
						className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm border-2 border-blue-600 shadow-md">
						<span className="inline-flex items-center gap-2">
							<Home className="w-4 h-4" />
							<span>Return Home</span>
						</span>
					</PillButton>

					<PillButton
						href="/dashboard"
						baseColor="#ffffff"
						circleColor="#004ac6"
						textColor="#004ac6"
						hoverTextColor="#ffffff"
						useThunderFont={true}
						className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm border-2 border-blue-600 shadow-md">
						<span className="inline-flex items-center gap-2">
							<LayoutDashboard className="w-4 h-4" />
							<span>Go to Dashboard</span>
						</span>
					</PillButton>
				</div>
			</main>

			{/* Minimal Footer */}
			<footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs text-slate-400">
				<p>© {new Date().getFullYear()} Kiosk. All rights reserved.</p>
			</footer>
		</div>
	);
}
