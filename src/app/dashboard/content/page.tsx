/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Upload,
	FileText,
	CheckCircle2,
	Sparkles,
	Loader2,
	HelpCircle,
} from "lucide-react";
import PillButton from "@/components/PillButton";

export default function ContentSubmissionPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	// Form fields
	const [businessName, setBusinessName] = useState("My Business Page");
	const [tagline, setTagline] = useState(
		"High-converting services for modern professionals",
	);
	const [aboutText, setAboutText] = useState(
		"We help scaling businesses automate their growth and land more clients effortlessly.",
	);
	const [servicesList, setServicesList] = useState(
		"1. Strategic Consulting\n2. Turnkey Implementation\n3. Dedicated Support",
	);
	const [contactDetails, setContactDetails] = useState(
		"Email: contact@mybusiness.com\nPhone: +1 (555) 019-2834\nWhatsApp: +1 (555) 019-2834",
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setTimeout(() => {
			setIsSubmitting(false);
			setIsSubmitted(true);
			setTimeout(() => {
				router.push("/dashboard");
			}, 2000);
		}, 1200);
	};

	return (
		<div className="w-full min-h-screen bg-[#f8fafc]">
			{/* Main Container */}
			<div className="px-4 sm:px-6 lg:px-8 pt-8 pb-16 max-w-[900px] mx-auto">
				{/* Top Back Link */}
				<div className="mb-6">
					<Link
						href="/dashboard"
						className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors group">
						<ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
						<span>Back to Dashboard</span>
					</Link>
				</div>

				{/* Header Title */}
				<div className="pb-6 border-b border-gray-200/80 mb-8">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-extrabold uppercase tracking-wider mb-3">
						<FileText className="w-3.5 h-3.5" />
						<span>Content Submission</span>
					</div>
					<h1 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 tracking-tight mb-1">
						Submit Your Site Content
					</h1>
					<p className="text-gray-500 text-sm font-medium">
						Provide your business copy, text details, and assets so our team can build your custom site.
					</p>
				</div>

				{/* Success State */}
				{isSubmitted ? (
					<div className="bg-white border border-emerald-200 rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto shadow-xl shadow-emerald-500/10 animate-in fade-in zoom-in-95 duration-300">
						<CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
						<h2 className="text-2xl font-bold font-nohemi text-gray-900 mb-2">
							Content Received!
						</h2>
						<p className="text-xs text-gray-500 font-medium mb-6 leading-relaxed">
							Our design team has received your content submission. We will integrate your text and update your site draft. Redirecting to dashboard...
						</p>
						<div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
							<div className="bg-emerald-600 h-full w-full animate-pulse" />
						</div>
					</div>
				) : (
					/* Submission Form */
					<form
						onSubmit={handleSubmit}
						className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
						{/* Field 1: Business / Site Name */}
						<div>
							<label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
								1. Business / Site Name *
							</label>
							<input
								type="text"
								required
								value={businessName}
								onChange={(e) => setBusinessName(e.target.value)}
								className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
							/>
						</div>

						{/* Field 2: Main Tagline / Headline */}
						<div>
							<label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
								2. Main Headline / Tagline *
							</label>
							<input
								type="text"
								required
								value={tagline}
								onChange={(e) => setTagline(e.target.value)}
								className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
							/>
						</div>

						{/* Field 3: About / Value Proposition */}
						<div>
							<label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
								3. About Business & Value Proposition *
							</label>
							<textarea
								rows={4}
								required
								value={aboutText}
								onChange={(e) => setAboutText(e.target.value)}
								className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors leading-relaxed"
							/>
						</div>

						{/* Field 4: Key Services / Offers */}
						<div>
							<label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
								4. Primary Services / Key Features *
							</label>
							<textarea
								rows={4}
								required
								value={servicesList}
								onChange={(e) => setServicesList(e.target.value)}
								className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors leading-relaxed"
							/>
						</div>

						{/* Field 5: Contact Info */}
						<div>
							<label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
								5. Contact Details & Social Links *
							</label>
							<textarea
								rows={3}
								required
								value={contactDetails}
								onChange={(e) => setContactDetails(e.target.value)}
								className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors leading-relaxed"
							/>
						</div>

						{/* Field 6: Brand Assets Upload */}
						<div>
							<label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
								6. Upload Brand Assets (Logos, Photos, PDFs)
							</label>
							<div className="border-2 border-dashed border-gray-200/90 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer bg-gray-50/50">
								<Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
								<p className="text-xs font-semibold text-gray-700">
									Click to upload files or drag & drop
								</p>
								<p className="text-[10px] text-gray-400 font-medium mt-1">
									PNG, JPG, SVG, PDF up to 25MB
								</p>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="pt-6 border-t border-gray-100 flex items-center justify-between">
							<div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
								<HelpCircle className="w-4 h-4" />
								<span>Need help? Contact support anytime</span>
							</div>

							<PillButton
								type="submit"
								disabled={isSubmitting}
								baseColor="#004ac6"
								circleColor="#ffffff"
								textColor="#ffffff"
								hoverTextColor="#004ac6"
								useThunderFont={true}
								className="px-7 py-3 rounded-full font-bold text-xs border border-blue-600 shadow-md">
								{isSubmitting ? (
									<span className="inline-flex items-center gap-2">
										<Loader2 className="w-4 h-4 animate-spin" />
										<span>Submitting Content...</span>
									</span>
								) : (
									<span className="inline-flex items-center gap-2">
										<Sparkles className="w-4 h-4" />
										<span>Submit Content Now</span>
									</span>
								)}
							</PillButton>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
