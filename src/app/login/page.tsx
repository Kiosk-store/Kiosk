/**
 * Login & Sign Up Page
 *
 * Professional unified authentication interface for Kiosk:
 * - Seamless toggle between Sign In and Create Account.
 * - Split showcase layout with dark architectural branding panel & clean form card.
 * - Social login providers (Google, Apple, GitHub).
 * - Interactive validation, password visibility toggles, and PillButton submit actions.
 * - Lottie animation and trust metrics.
 *
 * @format
 */

"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
	Mail,
	Lock,
	User,
	Briefcase,
	Eye,
	EyeOff,
	ArrowLeft,
	CheckCircle2,
	ShieldCheck,
	Sparkles,
	ArrowRight,
} from "lucide-react";
import PillButton from "@/components/PillButton";
import LottiePlayer from "@/components/LottiePlayer";

function AuthForm() {
	const searchParams = useSearchParams();
	const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";

	const [mode, setMode] = useState<"login" | "signup">(initialMode);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	// Form fields
	const [name, setName] = useState("");
	const [businessName, setBusinessName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [agreeTerms, setAgreeTerms] = useState(false);
	const [rememberMe, setRememberMe] = useState(true);

	useEffect(() => {
		const paramMode = searchParams.get("mode");
		if (paramMode === "signup" || paramMode === "login") {
			setMode(paramMode);
		}
	}, [searchParams]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate authentication flow
		setTimeout(() => {
			setIsLoading(false);
			setIsSuccess(true);
		}, 1200);
	};

	return (
		<div className="min-h-screen w-full bg-[#f8fafc] text-[#0f172a] flex flex-col lg:flex-row overflow-x-hidden">
			{/* Left Column: Showcase & Brand Presentation (Dark Minimal Architectural) */}
			<div className="lg:w-5/12 xl:w-1/2 bg-[#0a0c10] text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden shrink-0">
				{/* Background Glow & Minimal Concentric Wireframe */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
					<div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_rgba(37,99,235,0.18)_0%,_rgba(10,12,16,0)_70%)] blur-3xl" />
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] border border-blue-500/10 rounded-full" />
					<div className="absolute -top-16 -left-16 w-72 h-72 border border-white/[0.04] rotate-12 rounded-3xl" />
				</div>

				{/* Top: Logo & Back Link */}
				<div className="relative z-10 flex items-center justify-between">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors group">
						<ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
						<span>Back to Kiosk</span>
					</Link>

					<Link
						href="/"
						className="text-xl sm:text-2xl font-bold font-nohemi tracking-tight text-white flex items-center gap-1.5">
						<span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
						<span>KIOSK</span>
					</Link>
				</div>

				{/* Center: Lottie Showcase & Pitch */}
				<div className="relative z-10 my-8 lg:my-auto flex flex-col items-center text-center">
					<div className="w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] h-[200px] sm:h-[260px] lg:h-[300px] mb-4 flex items-center justify-center">
						<LottiePlayer
							src="/lotties/A small shop.json"
							className="w-full h-full object-contain"
							loop={true}
							autoplay={true}
						/>
					</div>

					<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-nohemi text-white tracking-tight leading-tight max-w-md">
						Your high-converting business website, simplified.
					</h2>
					<p className="text-slate-400 text-xs sm:text-sm mt-3 max-w-sm leading-relaxed">
						Join hundreds of small business owners growing their revenue with custom-built, hosted landing pages and online stores.
					</p>

					{/* Metric Pills */}
					<div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-6">
						<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono">
							<ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
							<span>7-10 Day Delivery</span>
						</div>
						<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono">
							<Sparkles className="w-3.5 h-3.5 text-emerald-400" />
							<span>100% Code Ownership</span>
						</div>
					</div>
				</div>

				{/* Bottom: Client Testimonial */}
				<div className="relative z-10 pt-6 border-t border-white/10 hidden sm:block">
					<p className="text-xs text-slate-300 italic leading-relaxed">
						&ldquo;Kiosk delivered our complete e-commerce store in just 7 days. Our online sales grew by 140% within the first month.&rdquo;
					</p>
					<p className="text-[11px] font-semibold text-slate-400 mt-2">
						— Marcus Vance, Founder of Apex Retail
					</p>
				</div>
			</div>

			{/* Right Column: Authentication Form Panel */}
			<div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16 relative">
				<div className="w-full max-w-md">
					{/* Mode Switcher Toggle */}
					<div className="flex items-center justify-between mb-8">
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold font-nohemi text-[#0a0a0a] tracking-tight">
								{mode === "login" ? "Welcome back" : "Create your account"}
							</h1>
							<p className="text-xs sm:text-sm text-slate-500 mt-1">
								{mode === "login"
									? "Enter your credentials to access your client portal."
									: "Start your high-performance business website today."}
							</p>
						</div>
					</div>

					{/* Tab Switcher */}
					<div className="grid grid-cols-2 p-1 bg-slate-200/70 rounded-xl mb-6">
						<button
							type="button"
							onClick={() => {
								setMode("login");
								setIsSuccess(false);
							}}
							className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
								mode === "login"
									? "bg-white text-[#0a0a0a] shadow-sm"
									: "text-slate-600 hover:text-[#0a0a0a]"
							}`}>
							Sign In
						</button>
						<button
							type="button"
							onClick={() => {
								setMode("signup");
								setIsSuccess(false);
							}}
							className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
								mode === "signup"
									? "bg-white text-[#0a0a0a] shadow-sm"
									: "text-slate-600 hover:text-[#0a0a0a]"
							}`}>
							Create Account
						</button>
					</div>

					{/* Success State Notification */}
					{isSuccess ? (
						<div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in fade-in zoom-in-95 duration-300">
							<CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
							<h3 className="text-lg font-bold text-emerald-900 font-nohemi">
								{mode === "login" ? "Signed in successfully!" : "Account created!"}
							</h3>
							<p className="text-xs text-emerald-700 mt-1.5 leading-relaxed">
								Redirecting to your dashboard overview...
							</p>
							<div className="mt-5">
								<PillButton
									href="/"
									baseColor="#059669"
									circleColor="#ffffff"
									textColor="#ffffff"
									hoverTextColor="#059669"
									className="w-full py-3 text-sm font-bold border border-emerald-600">
									Go to Dashboard →
								</PillButton>
							</div>
						</div>
					) : (
						<>
							{/* Social Auth Options */}
							<div className="grid grid-cols-2 gap-3 mb-6">
								{/* Google */}
								<button
									type="button"
									onClick={() => {
										setIsLoading(true);
										setTimeout(() => {
											setIsLoading(false);
											setIsSuccess(true);
										}, 800);
									}}
									className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer">
									<svg className="w-4 h-4" viewBox="0 0 24 24">
										<path
											fill="#EA4335"
											d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
										/>
										<path
											fill="#4285F4"
											d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
										/>
										<path
											fill="#FBBC05"
											d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8 0-1.3.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12c0 1.2.7 3.3 1.9 5.7l3.7-2.9z"
										/>
										<path
											fill="#34A853"
											d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
										/>
									</svg>
									<span>Google</span>
								</button>

								{/* Apple */}
								<button
									type="button"
									onClick={() => {
										setIsLoading(true);
										setTimeout(() => {
											setIsLoading(false);
											setIsSuccess(true);
										}, 800);
									}}
									className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer">
									<svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
										<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.88c.64-.78 1.08-1.86.96-2.94-1 .04-2.14.64-2.79 1.42-.58.67-1.08 1.77-.94 2.82 1.11.09 2.14-.52 2.77-1.3z" />
									</svg>
									<span>Apple</span>
								</button>
							</div>

							{/* Divider */}
							<div className="relative flex items-center justify-center my-6">
								<div className="w-full border-t border-slate-200" />
								<span className="absolute bg-[#f8fafc] px-3 text-xs text-slate-400 font-medium uppercase tracking-wider">
									or continue with email
								</span>
							</div>

							{/* Form */}
							<form onSubmit={handleSubmit} className="space-y-4">
								{mode === "signup" && (
									<>
										{/* Full Name */}
										<div>
											<label
												htmlFor="name"
												className="block text-xs font-semibold text-slate-700 mb-1.5">
												Full Name
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
													<User className="w-4 h-4" />
												</div>
												<input
													id="name"
													type="text"
													required
													placeholder="Alex Morgan"
													value={name}
													onChange={(e) => setName(e.target.value)}
													className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xs placeholder:text-slate-400"
												/>
											</div>
										</div>

										{/* Business Name (Optional) */}
										<div>
											<label
												htmlFor="business"
												className="block text-xs font-semibold text-slate-700 mb-1.5">
												Business Name{" "}
												<span className="text-slate-400 font-normal">
													(Optional)
												</span>
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
													<Briefcase className="w-4 h-4" />
												</div>
												<input
													id="business"
													type="text"
													placeholder="Morgan Bakery & Cafe"
													value={businessName}
													onChange={(e) =>
														setBusinessName(e.target.value)
													}
													className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xs placeholder:text-slate-400"
												/>
											</div>
										</div>
									</>
								)}

								{/* Email Address */}
								<div>
									<label
										htmlFor="email"
										className="block text-xs font-semibold text-slate-700 mb-1.5">
										Email Address
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
											<Mail className="w-4 h-4" />
										</div>
										<input
											id="email"
											type="email"
											required
											placeholder="you@company.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xs placeholder:text-slate-400"
										/>
									</div>
								</div>

								{/* Password */}
								<div>
									<div className="flex items-center justify-between mb-1.5">
										<label
											htmlFor="password"
											className="block text-xs font-semibold text-slate-700">
											Password
										</label>
										{mode === "login" && (
											<button
												type="button"
												onClick={() =>
													alert("Password reset instructions sent to your email.")
												}
												className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
												Forgot password?
											</button>
										)}
									</div>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
											<Lock className="w-4 h-4" />
										</div>
										<input
											id="password"
											type={showPassword ? "text" : "password"}
											required
											placeholder="••••••••••••"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xs placeholder:text-slate-400"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer">
											{showPassword ? (
												<EyeOff className="w-4 h-4" />
											) : (
												<Eye className="w-4 h-4" />
											)}
										</button>
									</div>
								</div>

								{/* Checkboxes: Remember me or Agree to terms */}
								{mode === "login" ? (
									<div className="flex items-center gap-2 pt-1">
										<input
											id="remember"
											type="checkbox"
											checked={rememberMe}
											onChange={(e) => setRememberMe(e.target.checked)}
											className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
										/>
										<label
											htmlFor="remember"
											className="text-xs text-slate-600 cursor-pointer select-none">
											Remember this device for 30 days
										</label>
									</div>
								) : (
									<div className="flex items-start gap-2 pt-1">
										<input
											id="terms"
											type="checkbox"
											required
											checked={agreeTerms}
											onChange={(e) => setAgreeTerms(e.target.checked)}
											className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
										/>
										<label
											htmlFor="terms"
											className="text-xs text-slate-600 cursor-pointer select-none leading-relaxed">
											I agree to Kiosk&apos;s{" "}
											<Link
												href="/terms"
												className="text-blue-600 hover:underline">
												Terms of Service
											</Link>{" "}
											and{" "}
											<Link
												href="/privacy"
												className="text-blue-600 hover:underline">
												Privacy Policy
											</Link>
											.
										</label>
									</div>
								)}

								{/* Submit Button */}
								<div className="pt-2">
									<PillButton
										type="submit"
										baseColor="#004ac6"
										circleColor="#ffffff"
										textColor="#ffffff"
										hoverTextColor="#004ac6"
										useThunderFont={true}
										className="w-full py-3.5 rounded-full font-bold text-sm sm:text-base border-2 border-blue-600 shadow-lg shadow-blue-600/20 cursor-pointer">
										{isLoading ? (
											<span className="flex items-center justify-center gap-2">
												<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
												<span>Processing...</span>
											</span>
										) : mode === "login" ? (
											"Sign In to Account"
										) : (
											"Create Kiosk Account"
										)}
									</PillButton>
								</div>
							</form>

							{/* Footer Toggle Link */}
							<div className="text-center mt-6 text-xs text-slate-500">
								{mode === "login" ? (
									<p>
										Don&apos;t have an account yet?{" "}
										<button
											type="button"
											onClick={() => setMode("signup")}
											className="font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer">
											Sign up for free
										</button>
									</p>
								) : (
									<p>
										Already have an account?{" "}
										<button
											type="button"
											onClick={() => setMode("login")}
											className="font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer">
											Sign in
										</button>
									</p>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc]">
					<div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
				</div>
			}>
			<AuthForm />
		</Suspense>
	);
}
