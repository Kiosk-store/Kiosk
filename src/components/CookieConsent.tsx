/** @format */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "kiosk_cookie_consent_v1";

export default function CookieConsent() {
	const [isVisible, setIsVisible] = useState(false);
	const [showCustomize, setShowCustomize] = useState(false);
	const [analyticsConsent, setAnalyticsConsent] = useState(true);

	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (!saved) {
				const timer = setTimeout(() => setIsVisible(true), 1000);
				return () => clearTimeout(timer);
			}
		} catch (e) {
			setIsVisible(false);
		}
	}, []);

	useEffect(() => {
		const handleOpenEvent = () => {
			setIsVisible(true);
			setShowCustomize(true);
		};
		window.addEventListener("open-cookie-preferences", handleOpenEvent);
		return () => window.removeEventListener("open-cookie-preferences", handleOpenEvent);
	}, []);

	const saveConsent = (analytics: boolean) => {
		try {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					timestamp: new Date().toISOString(),
					preferences: { essential: true, analytics },
				}),
			);
		} catch (e) {
			console.warn("Could not save cookie consent", e);
		}
		setIsVisible(false);
		setShowCustomize(false);
	};

	if (!isVisible) return null;

	return (
		<aside
			role="dialog"
			aria-labelledby="cookie-consent-title"
			aria-describedby="cookie-consent-desc"
			className="fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] left-[max(1rem,env(safe-area-inset-left,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] sm:left-auto sm:right-6 sm:max-w-md z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 sm:p-5 select-none text-slate-900 animate-in fade-in duration-200">
			<div className="space-y-2">
				<h3
					id="cookie-consent-title"
					className="text-sm font-bold font-nohemi text-slate-900">
					Cookie Preferences
				</h3>
				<p
					id="cookie-consent-desc"
					className="text-xs text-slate-600 leading-relaxed">
					We use cookies to maintain secure sessions, remember settings, and analyze
					site traffic. You can learn more in our{" "}
					<Link
						href="/privacy#cookies"
						className="text-blue-600 underline font-medium hover:text-blue-800">
						Privacy Policy
					</Link>
					.
				</p>
			</div>

			{showCustomize && (
				<div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
					<div className="flex items-center justify-between py-1 text-slate-700">
						<div>
							<span className="font-semibold block">Necessary Cookies</span>
							<span className="text-[11px] text-slate-500">
								Required for logins and security.
							</span>
						</div>
						<span className="text-[11px] text-slate-400 font-medium">Always Active</span>
					</div>

					<div className="flex items-center justify-between py-1 text-slate-700">
						<div>
							<span className="font-semibold block">Analytics Cookies</span>
							<span className="text-[11px] text-slate-500">
								Helps us measure site performance.
							</span>
						</div>
						<input
							type="checkbox"
							checked={analyticsConsent}
							onChange={(e) => setAnalyticsConsent(e.target.checked)}
							className="w-4 h-4 rounded-sm text-blue-600 accent-blue-600 cursor-pointer"
						/>
					</div>
				</div>
			)}

			<div className="mt-4 pt-2 flex items-center justify-between gap-2">
				<button
					type="button"
					onClick={() => setShowCustomize(!showCustomize)}
					className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer">
					{showCustomize ? "Simple View" : "Manage"}
				</button>

				<div className="flex items-center gap-2">
					{showCustomize ? (
						<button
							type="button"
							onClick={() => saveConsent(analyticsConsent)}
							className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer">
							Save Choices
						</button>
					) : (
						<>
							<button
								type="button"
								onClick={() => saveConsent(false)}
								className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer">
								Decline
							</button>
							<button
								type="button"
								onClick={() => saveConsent(true)}
								className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer">
								Accept
							</button>
						</>
					)}
				</div>
			</div>
		</aside>
	);
}
