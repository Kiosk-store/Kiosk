/** @format */

"use client";

import React, { useState, useEffect } from "react";
import PillButton from "@/components/PillButton";
import { Cookie, Shield, Check, X } from "lucide-react";

export default function CookieConsent() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Check if user has already made a choice
		const consent = localStorage.getItem("kiosk_cookie_consent");
		if (!consent) {
			// Show banner after short delay for smooth appearance
			const timer = setTimeout(() => {
				setIsVisible(true);
			}, 800);
			return () => clearTimeout(timer);
		}
	}, []);

	const handleAcceptAll = () => {
		localStorage.setItem("kiosk_cookie_consent", "accepted");
		document.cookie = "kiosk_consent=accepted; path=/; max-age=31536000; SameSite=Lax; Secure";
		setIsVisible(false);
	};

	const handleEssentialOnly = () => {
		localStorage.setItem("kiosk_cookie_consent", "essential");
		document.cookie = "kiosk_consent=essential; path=/; max-age=31536000; SameSite=Lax; Secure";
		setIsVisible(false);
	};

	if (!isVisible) return null;

	return (
		<div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
			<div className="bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-gray-900">
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-center gap-2.5">
						<div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
							<Cookie className="w-5 h-5" />
						</div>
						<div>
							<span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
								Privacy & Cache
							</span>
							<h4 className="text-sm font-bold font-nohemi text-gray-900 mt-0.5">
								We Value Your Privacy & Speed
							</h4>
						</div>
					</div>

					<button
						type="button"
						onClick={handleEssentialOnly}
						aria-label="Close cookie banner"
						className="text-gray-400 hover:text-gray-700 p-1 rounded-lg transition-colors cursor-pointer">
						<X className="w-4 h-4" />
					</button>
				</div>

				<p className="text-xs text-gray-600 font-medium leading-relaxed">
					We use essential cookies and edge caching to keep your session secure, preserve checkout state, and deliver sub-second page performance.
				</p>

				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
					<button
						type="button"
						onClick={handleAcceptAll}
						className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition-colors cursor-pointer text-center shadow-xs flex items-center justify-center gap-1.5">
						<Check className="w-3.5 h-3.5 stroke-[3]" />
						<span>Accept All & Cache</span>
					</button>

					<button
						type="button"
						onClick={handleEssentialOnly}
						className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-full transition-colors cursor-pointer text-center">
						Essential Only
					</button>
				</div>
			</div>
		</div>
	);
}
