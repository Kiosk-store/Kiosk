/** @format */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
	Cookie,
	ShieldCheck,
	Check,
	X,
	SlidersHorizontal,
	ChevronDown,
	ChevronUp,
	Lock,
} from "lucide-react";

interface CookiePreferences {
	essential: boolean;
	analytics: boolean;
	preferences: boolean;
}

const STORAGE_KEY = "kiosk_cookie_consent_v1";

export default function CookieConsent() {
	const [isVisible, setIsVisible] = useState(false);
	const [showCustomize, setShowCustomize] = useState(false);
	const [prefs, setPrefs] = useState<CookiePreferences>({
		essential: true, // Always true and locked
		analytics: true,
		preferences: true,
	});

	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (!saved) {
				// Small delay for smooth entry animation
				const timer = setTimeout(() => setIsVisible(true), 1200);
				return () => clearTimeout(timer);
			}
		} catch (e) {
			// localStorage disabled or private browsing
			setIsVisible(false);
		}
	}, []);

	// Allow opening cookie preferences from anywhere via custom window event
	useEffect(() => {
		const handleOpenEvent = () => {
			setIsVisible(true);
			setShowCustomize(true);
		};
		window.addEventListener("open-cookie-preferences", handleOpenEvent);
		return () => window.removeEventListener("open-cookie-preferences", handleOpenEvent);
	}, []);

	const saveConsent = (preferences: CookiePreferences) => {
		try {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					timestamp: new Date().toISOString(),
					preferences,
				}),
			);
		} catch (e) {
			console.warn("Could not save cookie consent", e);
		}
		setIsVisible(false);
	};

	const handleAcceptAll = () => {
		const allAccepted: CookiePreferences = {
			essential: true,
			analytics: true,
			preferences: true,
		};
		setPrefs(allAccepted);
		saveConsent(allAccepted);
	};

	const handleEssentialOnly = () => {
		const essentialOnly: CookiePreferences = {
			essential: true,
			analytics: false,
			preferences: false,
		};
		setPrefs(essentialOnly);
		saveConsent(essentialOnly);
	};

	const handleSaveCustom = () => {
		saveConsent(prefs);
	};

	if (!isVisible) return null;

	return (
		<aside
			role="dialog"
			aria-labelledby="cookie-consent-title"
			aria-describedby="cookie-consent-desc"
			className="fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] left-[max(1rem,env(safe-area-inset-left,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] sm:left-auto sm:right-6 sm:max-w-md md:max-w-lg z-50 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl shadow-2xl shadow-slate-950/20 p-5 sm:p-6 animate-in fade-in slide-in-from-bottom-6 duration-300 select-none text-slate-900">
			{/* Header */}
			<div className="flex items-start justify-between gap-3 mb-3">
				<div className="flex items-center gap-2.5">
					<div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center shrink-0">
						<Cookie className="w-5 h-5" />
					</div>
					<div>
						<h3
							id="cookie-consent-title"
							className="text-sm sm:text-base font-bold font-nohemi text-slate-900 leading-tight">
							Cookie & Privacy Preferences
						</h3>
						<span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
							<ShieldCheck className="w-3.5 h-3.5" />
							<span>Zero third-party advertising trackers</span>
						</span>
					</div>
				</div>

				<button
					type="button"
					onClick={handleEssentialOnly}
					aria-label="Close cookie banner with essential only"
					className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
					<X className="w-4 h-4" />
				</button>
			</div>

			{/* Description */}
			<p
				id="cookie-consent-desc"
				className="text-xs text-slate-600 leading-relaxed mb-4">
				We use essential cookies to maintain your authenticated workspace and
				secure session data. Optional cookies remember your currency preference and
				help us improve platform latency.{" "}
				<Link
					href="/privacy#cookies"
					className="text-blue-600 font-bold hover:underline inline-flex items-center gap-0.5">
					Read our Cookie Policy &rarr;
				</Link>
			</p>

			{/* Customization Accordion */}
			{showCustomize && (
				<div className="space-y-2.5 py-3 border-y border-slate-100 mb-4 animate-in fade-in duration-200">
					{/* Essential */}
					<div className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
						<div className="space-y-0.5">
							<div className="flex items-center gap-1.5">
								<Lock className="w-3.5 h-3.5 text-slate-500" />
								<span className="text-xs font-bold text-slate-900">
									Strictly Essential Cookies
								</span>
								<span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded-sm">
									Always Active
								</span>
							</div>
							<p className="text-[11px] text-slate-500 leading-snug">
								Required for secure account logins, session persistence, and CSRF protection.
							</p>
						</div>
						<input
							type="checkbox"
							checked={true}
							disabled
							aria-label="Essential cookies cannot be disabled"
							className="mt-1 w-4 h-4 text-blue-600 rounded-sm cursor-not-allowed opacity-80"
						/>
					</div>

					{/* Preferences */}
					<div className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
						<div className="space-y-0.5">
							<span className="text-xs font-bold text-slate-900">
								Preferences & Regional Settings
							</span>
							<p className="text-[11px] text-slate-500 leading-snug">
								Remembers your preferred pricing currency (USD / NGN) and custom dashboard layouts.
							</p>
						</div>
						<input
							type="checkbox"
							id="chk-pref"
							checked={prefs.preferences}
							onChange={(e) => setPrefs({ ...prefs, preferences: e.target.checked })}
							className="mt-1 w-4 h-4 text-blue-600 rounded-sm cursor-pointer accent-blue-600"
						/>
					</div>

					{/* Performance & Analytics */}
					<div className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
						<div className="space-y-0.5">
							<span className="text-xs font-bold text-slate-900">
								Performance & Edge Telemetry
							</span>
							<p className="text-[11px] text-slate-500 leading-snug">
								Aggregated, privacy-preserving performance metrics to diagnose hosting speed.
							</p>
						</div>
						<input
							type="checkbox"
							id="chk-analytics"
							checked={prefs.analytics}
							onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
							className="mt-1 w-4 h-4 text-blue-600 rounded-sm cursor-pointer accent-blue-600"
						/>
					</div>
				</div>
			)}

			{/* Actions Button Group */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
				<button
					type="button"
					onClick={() => setShowCustomize(!showCustomize)}
					className="text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center justify-center gap-1 py-2 px-3 rounded-full hover:bg-slate-100 transition-colors">
					<SlidersHorizontal className="w-3.5 h-3.5" />
					<span>{showCustomize ? "Hide Details" : "Customize"}</span>
					{showCustomize ? (
						<ChevronUp className="w-3.5 h-3.5" />
					) : (
						<ChevronDown className="w-3.5 h-3.5" />
					)}
				</button>

				<div className="flex items-center gap-2">
					{showCustomize ? (
						<button
							type="button"
							onClick={handleSaveCustom}
							className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all text-center cursor-pointer">
							Save Preferences
						</button>
					) : (
						<>
							<button
								type="button"
								onClick={handleEssentialOnly}
								className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors text-center cursor-pointer">
								Essential Only
							</button>
							<button
								type="button"
								onClick={handleAcceptAll}
								className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all text-center cursor-pointer">
								Accept All
							</button>
						</>
					)}
				</div>
			</div>
		</aside>
	);
}
