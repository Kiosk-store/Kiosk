/** @format */

"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import {
	Mail,
	MessageSquare,
	Clock,
	CheckCircle2,
	Headset,
	ArrowRight,
	Send,
	Copy,
	Check,
	Globe,
	HelpCircle,
	ShieldCheck,
	Sparkles,
	AlertCircle,
	ArrowLeft,
	FileQuestion,
	CreditCard,
	Code2,
} from "lucide-react";

interface FormState {
	name: string;
	email: string;
	phone: string;
	category: string;
	priority: "normal" | "high" | "urgent";
	subject: string;
	message: string;
	websiteUrl: string;
}

const CATEGORIES = [
	{
		id: "Technical Support & Site Edits",
		label: "Technical Support & Edits",
		description: "Content updates, layout revisions, or bug fixes",
		icon: Code2,
	},
	{
		id: "Billing & Subscriptions",
		label: "Billing & Subscriptions",
		description: "Invoices, payment channels, plan upgrades",
		icon: CreditCard,
	},
	{
		id: "Custom Domain & DNS",
		label: "Domain & DNS Setup",
		description: "Connecting custom domains or SSL questions",
		icon: Globe,
	},
	{
		id: "Sales & Custom Features",
		label: "Custom Features & Growth",
		description: "New integrations, funnels, or bespoke scopes",
		icon: Sparkles,
	},
	{
		id: "General Inquiry",
		label: "General Inquiry",
		description: "Questions about Kiosk packages and onboarding",
		icon: FileQuestion,
	},
];

const FAQS = [
	{
		q: "How fast does Kiosk respond to support tickets?",
		a: "Our typical response time is under 2 hours during normal business hours (8am - 8pm GMT+1). Urgent production blockers receive immediate engineering triage.",
	},
	{
		q: "How do I request edits to my active website?",
		a: "You can submit an edit request directly using the form on this page or through your client dashboard. Include your site URL and the exact text or asset changes you need.",
	},
	{
		q: "Can you help me connect my domain from GoDaddy or Namecheap?",
		a: "Yes! Our team manages the complete DNS mapping and SSL provisioning for your custom domain at no extra charge. Simply provide your domain name when requesting support.",
	},
	{
		q: "What payment channels do you accept for billing?",
		a: "We support instant Card payments (Visa, Mastercard, Verve), Bank Transfers, USSD, and Mobile Money powered by Paystack.",
	},
];

function ContactContent() {
	const searchParams = useSearchParams();
	const initialCat = searchParams.get("category");

	const getResolvedCategory = (param: string | null) => {
		if (!param) return "Technical Support & Site Edits";
		const p = param.toLowerCase();
		if (p.includes("bill")) return "Billing & Subscriptions";
		if (p.includes("domain") || p.includes("dns")) return "Custom Domain & DNS";
		if (p.includes("sales") || p.includes("service")) return "Sales & Custom Features";
		if (p.includes("term") || p.includes("privacy") || p.includes("legal")) return "General Inquiry";
		return "Technical Support & Site Edits";
	};

	const [formData, setFormData] = useState<FormState>({
		name: "",
		email: "",
		phone: "",
		category: getResolvedCategory(initialCat),
		priority: "normal",
		subject: "",
		message: "",
		websiteUrl: "",
	});

	useEffect(() => {
		if (initialCat) {
			setFormData((prev) => ({
				...prev,
				category: getResolvedCategory(initialCat),
			}));
		}
	}, [initialCat]);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [ticketResult, setTicketResult] = useState<{
		ticketId: string;
		message: string;
	} | null>(null);
	const [copiedEmail, setCopiedEmail] = useState(false);
	const [copiedTicket, setCopiedTicket] = useState(false);
	const [openFaq, setOpenFaq] = useState<number | null>(0);

	const handleCopyEmail = () => {
		navigator.clipboard.writeText("support@kioosk.online");
		setCopiedEmail(true);
		setTimeout(() => setCopiedEmail(false), 2000);
	};

	const handleCopyTicket = (id: string) => {
		navigator.clipboard.writeText(id);
		setCopiedTicket(true);
		setTimeout(() => setCopiedTicket(false), 2000);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitError(null);
		setIsSubmitting(true);

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to submit your support inquiry.");
			}

			setTicketResult({
				ticketId: data.ticketId,
				message: data.message,
			});
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
			setSubmitError(msg);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
			{/* Hero Header */}
			<section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-[#03152c] to-[#06244f] text-white overflow-hidden">
				{/* Background decorative glow */}
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full bg-[radial-gradient(circle_at_top,_rgba(0,74,198,0.35)_0%,_transparent_70%)] pointer-events-none" />

				<div className="max-w-5xl mx-auto relative z-10 space-y-6 text-center sm:text-left">
					<div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
						<Link
							href="/"
							className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white transition-colors bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-full">
							<ArrowLeft className="w-3.5 h-3.5" />
							<span>Home</span>
						</Link>
						<div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 px-3 py-1.5 rounded-full text-emerald-300 text-xs font-semibold">
							<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
							<span>Support Desk Active • ~2h Response Time</span>
						</div>
					</div>

					<div className="space-y-4">
						<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-nohemi tracking-tight text-white leading-[1.1]">
							We’re here to support your growth.
						</h1>
						<p className="text-base sm:text-lg text-white/80 max-w-2xl font-medium leading-relaxed">
							Have questions about your website, need rapid content revisions, or want
							to connect a custom domain? Send us a message and our engineering team will get on it.
						</p>
					</div>

					{/* Quick Contact Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
						{/* Email */}
						<div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between transition-transform hover:-translate-y-0.5">
							<div className="flex items-center justify-between mb-3">
								<div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
									<Mail className="w-5 h-5" />
								</div>
								<button
									onClick={handleCopyEmail}
									type="button"
									className="text-[11px] font-semibold text-white/60 hover:text-white flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md transition-colors"
									title="Copy email address">
									{copiedEmail ? (
										<>
											<Check className="w-3 h-3 text-emerald-400" />
											<span className="text-emerald-300">Copied!</span>
										</>
									) : (
										<>
											<Copy className="w-3 h-3" />
											<span>Copy</span>
										</>
									)}
								</button>
							</div>
							<div>
								<span className="text-xs font-medium text-white/60 uppercase tracking-wider">
									Email Directly
								</span>
								<a
									href="mailto:support@kioosk.online"
									className="block text-sm font-bold text-white hover:text-blue-300 transition-colors mt-0.5">
									support@kioosk.online
								</a>
							</div>
						</div>

						{/* WhatsApp Support */}
						<div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between transition-transform hover:-translate-y-0.5">
							<div className="flex items-center justify-between mb-3">
								<div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
									<MessageSquare className="w-5 h-5" />
								</div>
								<span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
									Instant Chat
								</span>
							</div>
							<div>
								<span className="text-xs font-medium text-white/60 uppercase tracking-wider">
									WhatsApp Desk
								</span>
								<a
									href="https://wa.me/2348000000000?text=Hi%20Kiosk%20Support%2C%20I%20need%20assistance%20with%20my%20website"
									target="_blank"
									rel="noopener noreferrer"
									className="block text-sm font-bold text-white hover:text-emerald-300 transition-colors mt-0.5">
									Chat on WhatsApp &rarr;
								</a>
							</div>
						</div>

						{/* In-App Support */}
						<div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between transition-transform hover:-translate-y-0.5">
							<div className="flex items-center justify-between mb-3">
								<div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
									<Headset className="w-5 h-5" />
								</div>
								<span className="text-[11px] font-semibold text-purple-200 bg-purple-500/20 px-2 py-0.5 rounded-full">
									Client Portal
								</span>
							</div>
							<div>
								<span className="text-xs font-medium text-white/60 uppercase tracking-wider">
									Existing Client?
								</span>
								<Link
									href="/dashboard"
									className="block text-sm font-bold text-white hover:text-purple-300 transition-colors mt-0.5">
									Open Dashboard Drawer &rarr;
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Main Form & FAQ Section */}
			<section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full -mt-8 sm:-mt-10 relative z-20">
				<div className="bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-200/90 overflow-hidden">
					{ticketResult ? (
						/* Success confirmation screen */
						<div className="p-8 sm:p-14 text-center space-y-6">
							<div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
								<CheckCircle2 className="w-8 h-8" />
							</div>

							<div className="max-w-md mx-auto space-y-2">
								<h2 className="text-2xl sm:text-3xl font-bold font-nohemi text-slate-900">
									Support Ticket Submitted!
								</h2>
								<p className="text-sm text-slate-600 leading-relaxed">
									{ticketResult.message}
								</p>
							</div>

							<div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-left">
								<div>
									<p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
										Reference Ticket ID
									</p>
									<p className="text-base font-mono font-bold text-[#004ac6]">
										#{ticketResult.ticketId}
									</p>
								</div>
								<button
									type="button"
									onClick={() => handleCopyTicket(ticketResult.ticketId)}
									className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
									title="Copy Ticket ID">
									{copiedTicket ? (
										<Check className="w-4 h-4 text-emerald-600" />
									) : (
										<Copy className="w-4 h-4" />
									)}
								</button>
							</div>

							<div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
								<button
									type="button"
									onClick={() => {
										setTicketResult(null);
										setFormData({
											name: "",
											email: "",
											phone: "",
											category: "Technical Support & Site Edits",
											priority: "normal",
											subject: "",
											message: "",
											websiteUrl: "",
										});
									}}
									className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors">
									Submit Another Request
								</button>
								<Link
									href="/dashboard"
									className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#004ac6] hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-md text-center">
									Go to Workspace Dashboard
								</Link>
							</div>
						</div>
					) : (
						/* Support Ticket Form */
						<form onSubmit={handleSubmit} className="p-6 sm:p-10 md:p-12 space-y-8">
							<div className="border-b border-slate-100 pb-6">
								<h2 className="text-xl sm:text-2xl font-bold font-nohemi text-slate-900">
									Submit a Support Request
								</h2>
								<p className="text-xs sm:text-sm text-slate-500 mt-1">
									Fill in the details below and our team will be notified immediately.
								</p>
							</div>

							{submitError && (
								<div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-red-700 text-xs sm:text-sm">
									<AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
									<div>
										<p className="font-bold">Unable to send request</p>
										<p className="mt-0.5 text-red-600">{submitError}</p>
									</div>
								</div>
							)}

							{/* Category Selection */}
							<div className="space-y-3">
								<label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
									1. Select Request Category
								</label>
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
									{CATEGORIES.map((cat) => {
										const Icon = cat.icon;
										const isSelected = formData.category === cat.id;
										return (
											<button
												key={cat.id}
												type="button"
												onClick={() => setFormData({ ...formData, category: cat.id })}
												className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
													isSelected
														? "border-[#004ac6] bg-blue-50/70 ring-2 ring-blue-600/20 shadow-xs"
														: "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
												}`}>
												<div className="flex items-center justify-between">
													<Icon
														className={`w-5 h-5 ${
															isSelected ? "text-[#004ac6]" : "text-slate-500"
														}`}
													/>
													{isSelected && (
														<span className="w-2 h-2 rounded-full bg-[#004ac6]" />
													)}
												</div>
												<div>
													<p
														className={`text-xs font-bold leading-tight ${
															isSelected ? "text-[#004ac6]" : "text-slate-900"
														}`}>
														{cat.label}
													</p>
													<p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
														{cat.description}
													</p>
												</div>
											</button>
										);
									})}
								</div>
							</div>

							{/* Contact & Site Details */}
							<div className="space-y-4">
								<label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
									2. Your Information & Website
								</label>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="name"
											className="block text-xs font-semibold text-slate-700 mb-1.5">
											Full Name <span className="text-red-500">*</span>
										</label>
										<input
											id="name"
											type="text"
											required
											value={formData.name}
											onChange={(e) => setFormData({ ...formData, name: e.target.value })}
											placeholder="Jane Doe"
											className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:border-transparent transition-all placeholder:text-slate-400"
										/>
									</div>

									<div>
										<label
											htmlFor="email"
											className="block text-xs font-semibold text-slate-700 mb-1.5">
											Email Address <span className="text-red-500">*</span>
										</label>
										<input
											id="email"
											type="email"
											required
											value={formData.email}
											onChange={(e) => setFormData({ ...formData, email: e.target.value })}
											placeholder="jane@mybusiness.com"
											className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:border-transparent transition-all placeholder:text-slate-400"
										/>
									</div>

									<div>
										<label
											htmlFor="phone"
											className="block text-xs font-semibold text-slate-700 mb-1.5">
											WhatsApp / Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
										</label>
										<input
											id="phone"
											type="tel"
											value={formData.phone}
											onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
											placeholder="+234 800 000 0000"
											className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:border-transparent transition-all placeholder:text-slate-400"
										/>
									</div>

									<div>
										<label
											htmlFor="websiteUrl"
											className="block text-xs font-semibold text-slate-700 mb-1.5">
											Website or Domain URL <span className="text-slate-400 font-normal">(Optional)</span>
										</label>
										<input
											id="websiteUrl"
											type="text"
											value={formData.websiteUrl}
											onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
											placeholder="e.g. yoursite.kioosk.online or customdomain.com"
											className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:border-transparent transition-all placeholder:text-slate-400"
										/>
									</div>
								</div>
							</div>

							{/* Priority & Subject */}
							<div className="space-y-4">
								<label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
									3. Request Details
								</label>

								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
									<div className="sm:col-span-2">
										<label
											htmlFor="subject"
											className="block text-xs font-semibold text-slate-700 mb-1.5">
											Subject <span className="text-red-500">*</span>
										</label>
										<input
											id="subject"
											type="text"
											required
											value={formData.subject}
											onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
											placeholder="e.g. Update pricing table on home page"
											className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:border-transparent transition-all placeholder:text-slate-400"
										/>
									</div>

									<div>
										<label
											htmlFor="priority"
											className="block text-xs font-semibold text-slate-700 mb-1.5">
											Priority
										</label>
										<select
											id="priority"
											value={formData.priority}
											onChange={(e) =>
												setFormData({
													...formData,
													priority: e.target.value as FormState["priority"],
												})
											}
											className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:border-transparent transition-all bg-white text-slate-800">
											<option value="normal">Normal (Standard)</option>
											<option value="high">High (Urgent Edits)</option>
											<option value="urgent">Critical (Site Blocker)</option>
										</select>
									</div>
								</div>

								<div>
									<label
										htmlFor="message"
										className="block text-xs font-semibold text-slate-700 mb-1.5">
										Message / Specification <span className="text-red-500">*</span>
									</label>
									<textarea
										id="message"
										rows={5}
										required
										value={formData.message}
										onChange={(e) => setFormData({ ...formData, message: e.target.value })}
										placeholder="Please describe your request in detail. For content updates, paste the exact new text. For image changes, let us know where to look or mention your uploaded asset..."
										className="w-full p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:border-transparent transition-all placeholder:text-slate-400 leading-relaxed"
									/>
								</div>
							</div>

							{/* Submit Button */}
							<div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
								<div className="flex items-center gap-2 text-xs text-slate-500">
									<ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
									<span>Encrypted submission • Automated email receipt dispatched</span>
								</div>

								<button
									type="submit"
									disabled={isSubmitting}
									className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#004ac6] hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer">
									{isSubmitting ? (
										<>
											<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
											<span>Sending Request...</span>
										</>
									) : (
										<>
											<span>Send Support Request</span>
											<Send className="w-4 h-4" />
										</>
									)}
								</button>
							</div>
						</form>
					)}
				</div>

				{/* Quick FAQ Grid */}
				<div className="mt-16 space-y-6">
					<div className="text-center space-y-1">
						<h3 className="text-xl sm:text-2xl font-bold font-nohemi text-slate-900">
							Frequently Asked Questions
						</h3>
						<p className="text-xs sm:text-sm text-slate-500">
							Need instant answers? Review our most common support topics.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{FAQS.map((faq, idx) => {
							const isOpen = openFaq === idx;
							return (
								<div
									key={idx}
									className="bg-white border border-slate-200/90 rounded-2xl p-5 text-left transition-all hover:border-slate-300">
									<button
										type="button"
										onClick={() => setOpenFaq(isOpen ? null : idx)}
										className="w-full flex items-start justify-between gap-4 text-left">
										<span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
											{faq.q}
										</span>
										<HelpCircle className="w-4 h-4 text-[#004ac6] shrink-0 mt-0.5" />
									</button>
									<p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
										{faq.a}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
}

export default function ContactPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center bg-[#03152c] text-white">
					<div className="flex items-center gap-3">
						<div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
						<span className="text-xs font-semibold">Loading Kiosk Support...</span>
					</div>
				</div>
			}>
			<ContactContent />
		</Suspense>
	);
}
