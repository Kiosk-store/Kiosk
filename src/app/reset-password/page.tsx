/**
 * Password Reset Page — Kiosk Platform
 *
 * Allows users to set a new password using a secure 1-hour verification token.
 *
 * @format
 */

"use client";

export const dynamic = "force-dynamic";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
	Lock,
	KeyRound,
	Eye,
	EyeOff,
	ArrowLeft,
	CheckCircle2,
	AlertCircle,
	Loader2,
	ShieldCheck,
} from "lucide-react";
import PillButton from "@/components/PillButton";

function ResetPasswordForm() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const token = searchParams.get("token") || "";
	const email = searchParams.get("email") || "";

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const hasMinLength = password.length >= 8;
	const hasLetter = /[A-Za-z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const passwordsMatch = password.length > 0 && password === confirmPassword;

	const isFormValid =
		hasMinLength && hasLetter && hasNumber && passwordsMatch && Boolean(token && email);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isFormValid || isSubmitting) return;

		try {
			setIsSubmitting(true);
			setErrorMessage(null);

			const res = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					token,
					email,
					password,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				setErrorMessage(
					data.error || "Failed to reset password. Please request a new link.",
				);
				setIsSubmitting(false);
				return;
			}

			setIsSuccess(true);
			setIsSubmitting(false);
		} catch (err) {
			console.error("[RESET_PASSWORD_SUBMIT_ERROR]", err);
			setErrorMessage("A network error occurred. Please try again.");
			setIsSubmitting(false);
		}
	};

	if (!token || !email) {
		return (
			<div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl max-w-md w-full text-center space-y-6">
				<div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 mx-auto">
					<AlertCircle className="w-7 h-7" />
				</div>
				<div>
					<h2 className="text-xl font-bold text-slate-900 mb-2">
						Invalid Reset Link
					</h2>
					<p className="text-xs text-slate-500 leading-relaxed">
						This password reset link is missing required verification tokens or has
						already expired.
					</p>
				</div>
				<Link
					href="/get-started?tab=login"
					className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md">
					<ArrowLeft className="w-4 h-4" />
					<span>Back to Sign In</span>
				</Link>
			</div>
		);
	}

	if (isSuccess) {
		return (
			<div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
				<div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
					<CheckCircle2 className="w-8 h-8" />
				</div>
				<div>
					<h2 className="text-xl font-bold text-slate-900 mb-2">
						Password Reset Successfully!
					</h2>
					<p className="text-xs text-slate-500 leading-relaxed">
						Your account password has been securely updated. You can now log in with your
						new credentials.
					</p>
				</div>
				<Link
					href="/get-started?tab=login"
					className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-md">
					<span>Sign In to Your Workspace →</span>
				</Link>
			</div>
		);
	}

	return (
		<div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl max-w-md w-full space-y-6">
			{/* Header */}
			<div className="space-y-1">
				<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold mb-2">
					<KeyRound className="w-3.5 h-3.5 text-blue-600" />
					<span>Secure Verification</span>
				</div>
				<h1 className="text-2xl font-bold text-slate-900 tracking-tight">
					Set New Password
				</h1>
				<p className="text-xs text-slate-500">
					Create a new strong password for <strong className="text-slate-700">{email}</strong>
				</p>
			</div>

			{/* Error Alert */}
			{errorMessage && (
				<div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
					<AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
					<span>{errorMessage}</span>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* New Password */}
				<div>
					<label
						htmlFor="rp-password"
						className="block text-xs font-semibold text-slate-700 mb-1">
						New Password
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
							<Lock className="w-4 h-4" />
						</div>
						<input
							id="rp-password"
							type={showPassword ? "text" : "password"}
							required
							placeholder="••••••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300/80 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400 shadow-xs"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer">
							{showPassword ? (
								<EyeOff className="w-4 h-4" />
							) : (
								<Eye className="w-4 h-4" />
							)}
						</button>
					</div>
				</div>

				{/* Confirm Password */}
				<div>
					<label
						htmlFor="rp-confirm"
						className="block text-xs font-semibold text-slate-700 mb-1">
						Confirm New Password
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
							<ShieldCheck className="w-4 h-4" />
						</div>
						<input
							id="rp-confirm"
							type={showPassword ? "text" : "password"}
							required
							placeholder="••••••••••••"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300/80 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400 shadow-xs"
						/>
					</div>
				</div>

				{/* Validation Checklist */}
				<div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1.5 text-[11px]">
					<div
						className={`flex items-center gap-2 ${
							hasMinLength ? "text-emerald-700 font-semibold" : "text-slate-400"
						}`}>
						<div
							className={`w-1.5 h-1.5 rounded-full ${
								hasMinLength ? "bg-emerald-500" : "bg-slate-300"
							}`}
						/>
						<span>At least 8 characters long</span>
					</div>
					<div
						className={`flex items-center gap-2 ${
							hasLetter && hasNumber
								? "text-emerald-700 font-semibold"
								: "text-slate-400"
						}`}>
						<div
							className={`w-1.5 h-1.5 rounded-full ${
								hasLetter && hasNumber ? "bg-emerald-500" : "bg-slate-300"
							}`}
						/>
						<span>Contains both letters and numbers</span>
					</div>
					<div
						className={`flex items-center gap-2 ${
							passwordsMatch ? "text-emerald-700 font-semibold" : "text-slate-400"
						}`}>
						<div
							className={`w-1.5 h-1.5 rounded-full ${
								passwordsMatch ? "bg-emerald-500" : "bg-slate-300"
							}`}
						/>
						<span>Passwords match</span>
					</div>
				</div>

				<div className="pt-2">
					<PillButton
						type="submit"
						disabled={!isFormValid || isSubmitting}
						baseColor="#ffffff"
						circleColor="#004ac6"
						textColor="#004ac6"
						hoverTextColor="#ffffff"
						useThunderFont={true}
						className="w-full py-3.5 rounded-full font-bold text-sm sm:text-base border-2 border-blue-600 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
						{isSubmitting ? (
							<span className="inline-flex items-center justify-center gap-2">
								<Loader2 className="w-4 h-4 animate-spin" />
								<span>Updating Password...</span>
							</span>
						) : (
							"Save New Password"
						)}
					</PillButton>
				</div>
			</form>

			<div className="text-center pt-2">
				<Link
					href="/get-started?tab=login"
					className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
					<ArrowLeft className="w-3.5 h-3.5" />
					<span>Cancel and Return to Sign In</span>
				</Link>
			</div>
		</div>
	);
}

export default function ResetPasswordPage() {
	return (
		<div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 flex flex-col justify-between items-center p-4 sm:p-6 relative overflow-hidden">
			{/* Architectural Accents */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(37,99,235,0.08)_0%,_rgba(248,250,252,0)_70%)] blur-3xl" />
				<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(37,99,235,0.05)_0%,_rgba(248,250,252,0)_70%)] blur-3xl" />
			</div>

			{/* Top Bar */}
			<div className="w-full max-w-6xl mx-auto flex items-center justify-between z-10 py-2">
				<Link href="/" className="inline-flex items-center gap-2">
					<div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-sm">
						K
					</div>
					<span className="font-extrabold tracking-tight text-slate-900 text-lg">
						KIOSK
					</span>
				</Link>

				<Link
					href="/get-started?tab=login"
					className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
					Sign In
				</Link>
			</div>

			{/* Content Form Box */}
			<div className="w-full flex items-center justify-center z-10 my-auto py-8">
				<Suspense
					fallback={
						<div className="p-8 text-center text-slate-400">
							<Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
							<span className="text-xs font-medium">Loading verification...</span>
						</div>
					}>
					<ResetPasswordForm />
				</Suspense>
			</div>

			{/* Footer Notice */}
			<div className="w-full text-center z-10 py-4 text-[11px] text-slate-400">
				<span>Protected by Kiosk 256-bit encryption.</span>
			</div>
		</div>
	);
}
