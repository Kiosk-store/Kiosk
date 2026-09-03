/**
 * Get Started Page (Connected to AuthContext & Real Backend API Endpoints)
 *
 * Smooth sliding dual-panel onboarding interface with rate-limiting error handling & OAuth triggers.
 *
 * @format
 */

"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
	Mail,
	Lock,
	User,
	Eye,
	EyeOff,
	ArrowLeft,
	CheckCircle2,
	Loader2,
	AlertCircle,
	KeyRound,
} from "lucide-react";
import PillButton from "@/components/PillButton";
import LottiePlayer from "@/components/LottiePlayer";
import { useAuth } from "@/context/AuthContext";

function GetStartedContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { login, signup, loginWithGoogle, error, clearError } = useAuth();

	const urlError = searchParams?.get("error");
	const urlTab = searchParams?.get("tab");

	const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	useEffect(() => {
		if (urlTab === "login") {
			setActiveTab("login");
		}
	}, [urlTab]);

	const displayError = useMemo(() => {
		if (error) return error;
		if (urlError === "Configuration") {
			return "Google Sign-In is not configured for this environment. Please sign in with your email and password below.";
		}
		if (urlError === "OAuthSignin" || urlError === "OAuthCallback") {
			return "Could not complete social sign-in. Please use your email and password.";
		}
		if (urlError === "AccessDenied") {
			return "Access denied. Please check your credentials.";
		}
		if (urlError) {
			return "An unexpected error occurred. Please sign in with email and password.";
		}
		return null;
	}, [error, urlError]);

	// Forgot Password state
	const [isForgotPassword, setIsForgotPassword] = useState(false);
	const [forgotEmail, setForgotEmail] = useState("");
	const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
	const [forgotError, setForgotError] = useState<string | null>(null);

	// Sign Up fields
	const [signupName, setSignupName] = useState("");
	const [signupEmail, setSignupEmail] = useState("");
	const [signupPassword, setSignupPassword] = useState("");

	// Login fields
	const [loginEmail, setLoginEmail] = useState("");
	const [loginPassword, setLoginPassword] = useState("");

	const handleSignupSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isSubmitting) return;
		setIsSubmitting(true);
		clearError();

		const success = await signup(signupName, signupEmail, signupPassword);
		if (success) {
			setIsSuccess(true);
		}
		setIsSubmitting(false);
	};

	const handleLoginSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isSubmitting) return;
		setIsSubmitting(true);
		clearError();

		const success = await login(loginEmail, loginPassword);
		if (success) {
			setIsSuccess(true);
		}
		setIsSubmitting(false);
	};

	const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isSubmitting || !forgotEmail) return;
		setIsSubmitting(true);
		setForgotError(null);
		setForgotSuccess(null);

		try {
			const res = await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: forgotEmail }),
			});

			const data = await res.json();

			if (!res.ok) {
				setForgotError(data.error || "Failed to send reset email. Please try again.");
			} else {
				setForgotSuccess(
					data.message ||
						"If an account exists with this email, a password reset link has been sent.",
				);
			}
		} catch (err) {
			console.error("[FORGOT_PASSWORD_ERROR]", err);
			setForgotError("A network error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleGoogleAuth = async () => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		clearError();
		await loginWithGoogle();
		setIsSubmitting(false);
	};

	// Determine if signup state is active to apply swap transforms
	const isSignup = activeTab === "signup";

	return (
		<div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 flex flex-col justify-between overflow-x-hidden relative select-none">
			{/* Responsive Architectural Accent Grid Lines */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(37,99,235,0.06)_0%,_rgba(248,250,252,0)_70%)] blur-3xl" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-slate-200/40 rounded-full" />

				{/* Vertical Grid Accent Lines */}
				<div className="absolute top-0 bottom-0 left-[5%] md:left-[10%] w-px bg-slate-300/50" />
				<div className="absolute top-0 bottom-0 left-[30%] w-px bg-slate-300/20 hidden md:block" />
				<div className="absolute top-0 bottom-0 right-[30%] w-px bg-slate-300/20 hidden md:block" />
				<div className="absolute top-0 bottom-0 right-[5%] md:right-[10%] w-px bg-slate-300/50" />

				{/* Horizontal Grid Accent Lines */}
				<div className="absolute top-[10%] sm:top-[15%] left-0 right-0 h-px bg-slate-300/40" />
				<div className="absolute bottom-[10%] sm:bottom-[15%] left-0 right-0 h-px bg-slate-300/40" />
			</div>

			{/* Main Content Area */}
			<main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 pt-20 sm:pt-32 pb-12 flex-1 flex flex-col justify-center">
				{/* Back link */}
				<div className="mb-4">
					<Link
						href="/"
						className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors group">
						<ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
						<span>Back</span>
					</Link>
				</div>

				{/* Title Section */}
				<div className="text-center max-w-xl mx-auto mb-6 sm:mb-12 flex flex-col items-center">
					<Link href="/" className="mb-3 inline-block group" aria-label="Kiosk Home">
						<div className="w-12 h-12 rounded-2xl bg-[#030712] border border-slate-800 shadow-md p-2 flex items-center justify-center transition-transform group-hover:scale-105">
							<img
								src="/kiosk_logo.svg"
								alt="Kiosk"
								className="w-full h-full object-contain"
							/>
						</div>
					</Link>
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-thunder-lc tracking-tight text-slate-900 uppercase leading-none mb-6">
						GET STARTED
					</h1>
				</div>

				{/* Success State */}
				{isSuccess ? (
					<div className="max-w-md mx-auto w-full p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 text-center shadow-xl shadow-emerald-500/10 animate-in fade-in zoom-in-95 duration-300">
						<CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
						<h2 className="text-xl font-bold text-slate-900 font-nohemi">
							{activeTab === "signup" ? "Account Created" : "Welcome Back"}
						</h2>
						<p className="text-xs text-slate-500 mt-1.5">
							Redirecting to your dashboard...
						</p>
						<div className="mt-6">
							<PillButton
								href="/dashboard"
								baseColor="#059669"
								circleColor="#ffffff"
								textColor="#ffffff"
								hoverTextColor="#059669"
								useThunderFont={true}
								className="w-full py-3 text-sm font-bold border border-emerald-600 shadow-md">
								Continue to Dashboard →
							</PillButton>
						</div>
					</div>
				) : (
					<div className="relative w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
						{/* FORM PANEL */}
						<div
							className={`w-full lg:w-1/2 flex justify-center order-1 lg:order-none transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
								isSignup
									? "lg:translate-x-[calc(100%+3rem)]"
									: "lg:translate-x-0"
							}`}>
							<div className="w-full max-w-md px-1 sm:px-4">
								{/* Error Banner */}
								{displayError && (
									<div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
										<AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
										<span>{displayError}</span>
									</div>
								)}

								{/* Social Auth Providers */}
								<div className="mb-5">
									<button
										type="button"
										onClick={handleGoogleAuth}
										disabled={isSubmitting}
										className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl border border-slate-300/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
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
										<span>Continue with Google</span>
									</button>
								</div>

								{/* Divider */}
								<div className="relative flex items-center justify-center my-5">
									<div className="w-full border-t border-slate-200" />
									<span className="absolute bg-[#f8fafc] px-3 text-[11px] text-slate-400 font-mono uppercase tracking-wider">
										or email
									</span>
								</div>

								{/* FORM: Sign Up */}
								{activeTab === "signup" && (
									<form
										key="form-signup"
										onSubmit={handleSignupSubmit}
										className="space-y-3.5 animate-in fade-in duration-300">
										<div>
											<label
												htmlFor="su-name"
												className="block text-xs font-semibold text-slate-700 mb-1">
												Name
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
													<User className="w-4 h-4" />
												</div>
												<input
													id="su-name"
													type="text"
													required
													placeholder="Your name"
													value={signupName}
													onChange={(e) =>
														setSignupName(e.target.value)
													}
													className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300/80 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400 shadow-xs"
												/>
											</div>
										</div>

										<div>
											<label
												htmlFor="su-email"
												className="block text-xs font-semibold text-slate-700 mb-1">
												Email
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
													<Mail className="w-4 h-4" />
												</div>
												<input
													id="su-email"
													type="email"
													required
													placeholder="you@company.com"
													value={signupEmail}
													onChange={(e) =>
														setSignupEmail(e.target.value)
													}
													className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300/80 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400 shadow-xs"
												/>
											</div>
										</div>

										<div>
											<label
												htmlFor="su-pass"
												className="block text-xs font-semibold text-slate-700 mb-1">
												Password
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
													<Lock className="w-4 h-4" />
												</div>
												<input
													id="su-pass"
													type={showPassword ? "text" : "password"}
													required
													placeholder="••••••••••••"
													value={signupPassword}
													onChange={(e) =>
														setSignupPassword(e.target.value)
													}
													className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300/80 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400 shadow-xs"
												/>
												<button
													type="button"
													onClick={() =>
														setShowPassword(!showPassword)
													}
													className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer">
													{showPassword ? (
														<EyeOff className="w-4 h-4" />
													) : (
														<Eye className="w-4 h-4" />
													)}
												</button>
											</div>
										</div>

										<div className="pt-2">
											<PillButton
												type="submit"
												disabled={isSubmitting}
												baseColor="#004ac6"
												circleColor="#ffffff"
												textColor="#ffffff"
												hoverTextColor="#004ac6"
												useThunderFont={true}
												className="w-full py-3.5 rounded-full font-bold text-sm sm:text-base border-2 border-blue-600 shadow-md cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed">
												{isSubmitting ? (
													<span className="inline-flex items-center justify-center gap-2">
														<Loader2 className="w-4 h-4 animate-spin" />
														<span>Creating Account...</span>
													</span>
												) : (
													"Get Started"
												)}
											</PillButton>
										</div>
									</form>
								)}

								{/* FORM: Sign In / Forgot Password */}
								{activeTab === "login" && !isForgotPassword && (
									<form
										key="form-login"
										onSubmit={handleLoginSubmit}
										className="space-y-3.5 animate-in fade-in duration-300">
										<div>
											<label
												htmlFor="li-email"
												className="block text-xs font-semibold text-slate-700 mb-1">
												Email
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
													<Mail className="w-4 h-4" />
												</div>
												<input
													id="li-email"
													type="email"
													required
													placeholder="you@company.com"
													value={loginEmail}
													onChange={(e) =>
														setLoginEmail(e.target.value)
													}
													className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300/80 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400 shadow-xs"
												/>
											</div>
										</div>

										<div>
											<div className="flex items-center justify-between mb-1">
												<label
													htmlFor="li-pass"
													className="block text-xs font-semibold text-slate-700">
													Password
												</label>
												<button
													type="button"
													onClick={() => {
														clearError();
														setForgotError(null);
														setForgotSuccess(null);
														setForgotEmail(loginEmail);
														setIsForgotPassword(true);
													}}
													className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
													Forgot password?
												</button>
											</div>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
													<Lock className="w-4 h-4" />
												</div>
												<input
													id="li-pass"
													type={showPassword ? "text" : "password"}
													required
													placeholder="••••••••••••"
													value={loginPassword}
													onChange={(e) =>
														setLoginPassword(e.target.value)
													}
													className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300/80 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400 shadow-xs"
												/>
												<button
													type="button"
													onClick={() =>
														setShowPassword(!showPassword)
													}
													className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer">
													{showPassword ? (
														<EyeOff className="w-4 h-4" />
													) : (
														<Eye className="w-4 h-4" />
													)}
												</button>
											</div>
										</div>

										<div className="pt-2">
											<PillButton
												type="submit"
												disabled={isSubmitting}
												baseColor="#ffffff"
												circleColor="#004ac6"
												textColor="#004ac6"
												hoverTextColor="#ffffff"
												useThunderFont={true}
												className="w-full py-3.5 rounded-full font-bold text-sm sm:text-base border-2 border-blue-600 shadow-md cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed">
												{isSubmitting ? (
													<span className="inline-flex items-center justify-center gap-2">
														<Loader2 className="w-4 h-4 animate-spin" />
														<span>Signing In...</span>
													</span>
												) : (
													"Sign In"
												)}
											</PillButton>
										</div>
									</form>
								)}

								{/* FORM: Forgot Password */}
								{activeTab === "login" && isForgotPassword && (
									<form
										key="form-forgot"
										onSubmit={handleForgotPasswordSubmit}
										className="space-y-3.5 animate-in fade-in duration-300">
										<div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl space-y-1">
											<div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
												<KeyRound className="w-3.5 h-3.5" />
												<span>Reset Password</span>
											</div>
											<p className="text-[11px] text-blue-900/80 leading-relaxed">
												Enter your account email and we will send you a secure link to reset your password.
											</p>
										</div>

										{forgotSuccess && (
											<div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
												<CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
												<span>{forgotSuccess}</span>
											</div>
										)}

										{forgotError && (
											<div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
												<AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
												<span>{forgotError}</span>
											</div>
										)}

										<div>
											<label
												htmlFor="fp-email"
												className="block text-xs font-semibold text-slate-700 mb-1">
												Your Registered Email
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
													<Mail className="w-4 h-4" />
												</div>
												<input
													id="fp-email"
													type="email"
													required
													placeholder="you@company.com"
													value={forgotEmail}
													onChange={(e) => setForgotEmail(e.target.value)}
													className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300/80 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400 shadow-xs"
												/>
											</div>
										</div>

										<div className="pt-2 space-y-2">
											<PillButton
												type="submit"
												disabled={isSubmitting || !forgotEmail}
												baseColor="#004ac6"
												circleColor="#ffffff"
												textColor="#ffffff"
												hoverTextColor="#004ac6"
												useThunderFont={true}
												className="w-full py-3.5 rounded-full font-bold text-sm sm:text-base border-2 border-blue-600 shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
												{isSubmitting ? (
													<span className="inline-flex items-center justify-center gap-2">
														<Loader2 className="w-4 h-4 animate-spin" />
														<span>Sending Reset Link...</span>
													</span>
												) : (
													"Send Reset Link"
												)}
											</PillButton>

											<button
												type="button"
												onClick={() => {
													setIsForgotPassword(false);
													setForgotError(null);
													setForgotSuccess(null);
												}}
												className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
												<ArrowLeft className="w-3.5 h-3.5" />
												<span>Back to Sign In</span>
											</button>
										</div>
									</form>
								)}
							</div>
						</div>

						{/* LOTTIE PANEL */}
						<div
							className={`w-full lg:w-1/2 flex flex-col items-center justify-center text-center order-2 lg:order-none mt-8 lg:mt-0 transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
								isSignup
									? "lg:translate-x-[calc(-100%-3rem)]"
									: "lg:translate-x-0"
							}`}>
							<div
								key={activeTab}
								className="w-full max-w-[300px] sm:max-w-[420px] h-[160px] sm:h-[240px] lg:h-[320px] flex items-center justify-center animate-in fade-in zoom-in-95 duration-300">
								<LottiePlayer
									src={
										activeTab === "signup"
											? "/lotties/Sign up.json"
											: "/lotties/Login.json"
									}
									className="w-full h-full object-contain"
									loop={true}
									autoplay={true}
								/>
							</div>
							<p className="text-xs text-slate-500 font-medium mt-1">
								{activeTab === "signup"
									? "Create your Kiosk workspace"
									: "Welcome back to Kiosk"}
							</p>
							<div className="mt-4">
								<button
									type="button"
									onClick={() => {
										clearError();
										setIsForgotPassword(false);
										setActiveTab(activeTab === "signup" ? "login" : "signup");
									}}
									className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer underline hover:no-underline">
									{activeTab === "signup"
										? "Already have an account? Sign In"
										: "Don't have an account? Sign Up"}
								</button>
							</div>
						</div>
					</div>
				)}
			</main>

			{/* Minimal Footer */}
			<footer className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 text-center text-xs text-slate-400">
				<p>© {new Date().getFullYear()} Kiosk</p>
			</footer>
		</div>
	);
}

export default function GetStartedPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
					<Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
				</div>
			}>
			<GetStartedContent />
		</Suspense>
	);
}
