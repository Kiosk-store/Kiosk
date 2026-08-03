/**
 * Get Started Page (Corrected Slide Swap Animation & Mobile Responsiveness)
 *
 * Smooth sliding dual-panel onboarding interface:
 * - Top Switcher: Centered "Sign Up" / "Sign In" pill toggle below the header.
 * - Desktop Layout:
 *   - Sign Up (activeTab === 'signup'): Lottie on the Left, Form on the Right.
 *   - Sign In (activeTab === 'login'): Form on the Left, Lottie on the Right.
 * - Swapping Animation Math (Form starts left in JSX, Lottie starts right):
 *   - signup (default): Form translates RIGHT [calc(100%+3rem)], Lottie translates LEFT [calc(-100%-3rem)].
 *   - login: Both translate to 0 (Form is left, Lottie is right).
 * - Mobile Optimized: Form stacked on top (order-1), Lottie stacked below (order-2), with translations disabled.
 *
 * @format
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
	Mail,
	Lock,
	User,
	Eye,
	EyeOff,
	ArrowLeft,
	CheckCircle2,
} from "lucide-react";
import PillButton from "@/components/PillButton";
import LottiePlayer from "@/components/LottiePlayer";

export default function GetStartedPage() {
	const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	// Sign Up fields
	const [signupName, setSignupName] = useState("");
	const [signupEmail, setSignupEmail] = useState("");
	const [signupPassword, setSignupPassword] = useState("");

	// Login fields
	const [loginEmail, setLoginEmail] = useState("");
	const [loginPassword, setLoginPassword] = useState("");

	const handleSignupSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			setIsSuccess(true);
		}, 800);
	};

	const handleLoginSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			setIsSuccess(true);
		}, 800);
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

				{/* Title & Top Switcher Section */}
				<div className="text-center max-w-xl mx-auto mb-6 sm:mb-12 flex flex-col items-center">
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
							Redirecting to dashboard...
						</p>
						<div className="mt-6">
							<PillButton
								href="/"
								baseColor="#059669"
								circleColor="#ffffff"
								textColor="#ffffff"
								hoverTextColor="#059669"
								useThunderFont={true}
								className="w-full py-3 text-sm font-bold border border-emerald-600 shadow-md">
								Continue →
							</PillButton>
						</div>
					</div>
				) : (
					<div className="relative w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
						{/* 
						  FORM PANEL
						  - Sits on the left side on desktop in standard JSX ordering.
						  - On mobile, this stacked layout comes first (order-1).
						  - When in "signup" mode, it translates RIGHT to swap places with Lottie.
						*/}
						<div
							className={`w-full lg:w-1/2 flex justify-center order-1 lg:order-none transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
								isSignup
									? "lg:translate-x-[calc(100%+3rem)]"
									: "lg:translate-x-0"
							}`}>
							<div className="w-full max-w-md px-1 sm:px-4">
								{/* Social Auth Providers */}
								<div className="grid grid-cols-2 gap-3 mb-5">
									<button
										type="button"
										onClick={() => {
											setIsLoading(true);
											setTimeout(() => {
												setIsLoading(false);
												setIsSuccess(true);
											}, 600);
										}}
										className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-300/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-xs cursor-pointer">
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

									<button
										type="button"
										onClick={() => {
											setIsLoading(true);
											setTimeout(() => {
												setIsLoading(false);
												setIsSuccess(true);
											}, 600);
										}}
										className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-300/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-xs cursor-pointer">
										<svg
											className="w-4 h-4 fill-current text-slate-900"
											viewBox="0 0 24 24">
											<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.88c.64-.78 1.08-1.86.96-2.94-1 .04-2.14.64-2.79 1.42-.58.67-1.08 1.77-.94 2.82 1.11.09 2.14-.52 2.77-1.3z" />
										</svg>
										<span>Apple</span>
									</button>
								</div>

								{/* Divider */}
								<div className="relative flex items-center justify-center my-5">
									<div className="w-full border-t border-slate-200" />
									<span className="absolute bg-[#f8fafc] px-3 text-[11px] text-slate-400 font-mono uppercase tracking-wider">
										or
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
												baseColor="#004ac6"
												circleColor="#ffffff"
												textColor="#ffffff"
												hoverTextColor="#004ac6"
												useThunderFont={true}
												className="w-full py-3.5 rounded-full font-bold text-sm sm:text-base border-2 border-blue-600 shadow-md cursor-pointer">
												{isLoading ? "Creating Account..." : "Get Started"}
											</PillButton>
										</div>
									</form>
								)}

								{/* FORM: Sign In */}
								{activeTab === "login" && (
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
													onClick={() =>
														alert("Password reset instructions sent.")
													}
													className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
													Forgot?
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
												baseColor="#ffffff"
												circleColor="#004ac6"
												textColor="#004ac6"
												hoverTextColor="#ffffff"
												useThunderFont={true}
												className="w-full py-3.5 rounded-full font-bold text-sm sm:text-base border-2 border-blue-600 shadow-md cursor-pointer">
												{isLoading ? "Signing In..." : "Sign In"}
											</PillButton>
										</div>
									</form>
								)}
							</div>
						</div>

						{/* 
						  LOTTIE PANEL
						  - Sits on the right side on desktop in standard JSX ordering.
						  - On mobile, this stacked layout fits below the form (order-2).
						  - When in "signup" mode, it translates LEFT to swap places with Form.
						*/}
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
									onClick={() => setActiveTab(activeTab === "signup" ? "login" : "signup")}
									className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer underline hover:no-underline">
									{activeTab === "signup" ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
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
