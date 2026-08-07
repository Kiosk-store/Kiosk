/** @format */

"use client";

import React, { useState, useRef } from "react";
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
	Eye,
	X,
	Monitor,
	Smartphone,
	Image as ImageIcon,
	Trash2,
	Globe,
	Phone,
	Mail,
	Check,
} from "lucide-react";
import PillButton from "@/components/PillButton";

interface UploadedImage {
	id: string;
	name: string;
	size: string;
	url: string;
}

export default function ContentSubmissionPage() {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

	// Form fields
	const [businessName, setBusinessName] = useState("Bella Bakery & Cafe");
	const [tagline, setTagline] = useState(
		"Artisanal Pastries & Freshly Brewed Coffee Made Daily",
	);
	const [aboutText, setAboutText] = useState(
		"We are a family-owned bakery dedicated to crafting delicious sourdough bread, custom celebration cakes, and organic espresso for our local community.",
	);
	const [servicesList, setServicesList] = useState(
		"1. Custom Birthday & Event Cakes\n2. Artisanal Sourdough Breads\n3. Espresso Bar & Catering Services",
	);
	const [contactEmail, setContactEmail] = useState("hello@bellabakery.online");
	const [contactPhone, setContactPhone] = useState("+1 (555) 019-2834");
	const [contactAddress, setContactAddress] = useState("123 Main Street, Downtown");

	// Uploaded images state
	const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([
		{
			id: "img-1",
			name: "bakery-hero-banner.jpg",
			size: "1.2 MB",
			url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
		},
		{
			id: "img-2",
			name: "logo-transparent.png",
			size: "450 KB",
			url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80",
		},
	]);

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		Array.from(files).forEach((file) => {
			const objectUrl = URL.createObjectURL(file);
			const newImage: UploadedImage = {
				id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
				name: file.name,
				size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
				url: objectUrl,
			};
			setUploadedImages((prev) => [...prev, newImage]);
		});
	};

	const handleRemoveImage = (id: string) => {
		setUploadedImages((prev) => prev.filter((img) => img.id !== id));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setTimeout(() => {
			setIsSubmitting(false);
			setIsSubmitted(true);
			setTimeout(() => {
				router.push("/dashboard");
			}, 2500);
		}, 1200);
	};

	const heroImage = uploadedImages.length > 0 ? uploadedImages[0].url : null;
	const logoImage = uploadedImages.length > 1 ? uploadedImages[1].url : heroImage;

	return (
		<div className="w-full min-h-screen bg-[#f8fafc]">
			{/* Main Container */}
			<div className="px-4 sm:px-6 lg:px-8 pt-8 pb-16 max-w-[950px] mx-auto">
				{/* Top Navigation Row */}
				<div className="flex items-center justify-between mb-6">
					<Link
						href="/dashboard"
						className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors group">
						<ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
						<span>Back to Dashboard</span>
					</Link>

					<button
						type="button"
						onClick={() => setIsPreviewOpen(true)}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200/80 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-bold shadow-2xs cursor-pointer">
						<Eye className="w-4 h-4" />
						<span>Live Site Preview</span>
					</button>
				</div>

				{/* Header Title */}
				<div className="pb-6 border-b border-gray-200/80 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-extrabold uppercase tracking-wider mb-3">
							<FileText className="w-3.5 h-3.5" />
							<span>Content & Image Submission</span>
						</div>
						<h1 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 tracking-tight mb-1">
							Submit Business Details & Images
						</h1>
						<p className="text-gray-500 text-sm font-medium">
							Provide your business text, logo, photos, and contact info to build your custom website.
						</p>
					</div>

					<button
						type="button"
						onClick={() => setIsPreviewOpen(true)}
						className="px-5 py-2.5 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer self-start sm:self-auto">
						<Monitor className="w-4 h-4 text-blue-400" />
						<span>Preview Live Layout</span>
					</button>
				</div>

				{/* Success State */}
				{isSubmitted ? (
					<div className="bg-white border border-emerald-200 rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto shadow-xl shadow-emerald-500/10 animate-in fade-in zoom-in-95 duration-300">
						<CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
						<h2 className="text-2xl font-bold font-nohemi text-gray-900 mb-2">
							Content Received!
						</h2>
						<p className="text-xs text-gray-500 font-medium mb-6 leading-relaxed">
							Our design team has received your business details and {uploadedImages.length} uploaded images. Redirecting to dashboard...
						</p>
						<div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
							<div className="bg-emerald-600 h-full w-full animate-pulse" />
						</div>
					</div>
				) : (
					/* Submission Form */
					<form
						onSubmit={handleSubmit}
						className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xs">
						
						{/* SECTION 1: BUSINESS LOGO & BRAND IMAGES */}
						<div className="space-y-4">
							<div className="flex items-center justify-between border-b border-gray-100 pb-3">
								<label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
									<ImageIcon className="w-4 h-4 text-blue-600" />
									<span>1. Business Logo & Brand Images ({uploadedImages.length})</span>
								</label>
								<span className="text-[11px] text-gray-400 font-medium">PNG, JPG, SVG up to 25MB</span>
							</div>

							{/* Drag and Drop Zone */}
							<input
								ref={fileInputRef}
								type="file"
								multiple
								accept="image/*,.pdf"
								onChange={handleImageSelect}
								className="hidden"
							/>

							<div
								onClick={() => fileInputRef.current?.click()}
								className="border-2 border-dashed border-blue-200 hover:border-blue-500 rounded-2xl p-8 text-center transition-all cursor-pointer bg-blue-50/20 hover:bg-blue-50/50 group">
								<div className="w-12 h-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center mx-auto mb-3 shadow-2xs group-hover:scale-105 transition-transform">
									<Upload className="w-6 h-6 text-blue-600" />
								</div>
								<p className="text-xs font-bold text-gray-900 mb-1">
									Click to Upload Business Images or Drag & Drop
								</p>
								<p className="text-[11px] text-gray-500 font-medium">
									Upload your company logo, hero background photos, product images, or team pictures.
								</p>
							</div>

							{/* Uploaded Thumbnails Grid */}
							{uploadedImages.length > 0 && (
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
									{uploadedImages.map((img) => (
										<div
											key={img.id}
											className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between gap-3 group relative overflow-hidden">
											<img
												src={img.url}
												alt={img.name}
												className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
											/>
											<div className="flex-1 min-w-0">
												<p className="text-xs font-bold text-gray-900 truncate">
													{img.name}
												</p>
												<p className="text-[10px] text-gray-400 font-medium">
													{img.size}
												</p>
											</div>
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													handleRemoveImage(img.id);
												}}
												className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0">
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						{/* SECTION 2: BUSINESS DETAILS */}
						<div className="space-y-6 pt-4 border-t border-gray-100">
							<div className="border-b border-gray-100 pb-3">
								<label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
									<Globe className="w-4 h-4 text-blue-600" />
									<span>2. Business Information & Copy</span>
								</label>
							</div>

							{/* Field: Business Name */}
							<div>
								<label className="block text-xs font-bold text-gray-700 mb-1.5">
									Business / Company Name *
								</label>
								<input
									type="text"
									required
									value={businessName}
									onChange={(e) => setBusinessName(e.target.value)}
									className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
								/>
							</div>

							{/* Field: Tagline / Headline */}
							<div>
								<label className="block text-xs font-bold text-gray-700 mb-1.5">
									Main Headline / Tagline *
								</label>
								<input
									type="text"
									required
									value={tagline}
									onChange={(e) => setTagline(e.target.value)}
									className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
								/>
							</div>

							{/* Field: About Text */}
							<div>
								<label className="block text-xs font-bold text-gray-700 mb-1.5">
									About Business & Value Proposition *
								</label>
								<textarea
									rows={3}
									required
									value={aboutText}
									onChange={(e) => setAboutText(e.target.value)}
									className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors leading-relaxed"
								/>
							</div>

							{/* Field: Services List */}
							<div>
								<label className="block text-xs font-bold text-gray-700 mb-1.5">
									Primary Services / Key Offers *
								</label>
								<textarea
									rows={3}
									required
									value={servicesList}
									onChange={(e) => setServicesList(e.target.value)}
									className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors leading-relaxed"
								/>
							</div>
						</div>

						{/* SECTION 3: CONTACT INFO */}
						<div className="space-y-4 pt-4 border-t border-gray-100">
							<div className="border-b border-gray-100 pb-3">
								<label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
									<Phone className="w-4 h-4 text-blue-600" />
									<span>3. Contact & Location Information</span>
								</label>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<div>
									<label className="block text-[11px] font-bold text-gray-700 mb-1">
										Business Email *
									</label>
									<input
										type="email"
										required
										value={contactEmail}
										onChange={(e) => setContactEmail(e.target.value)}
										className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600"
									/>
								</div>

								<div>
									<label className="block text-[11px] font-bold text-gray-700 mb-1">
										Phone / WhatsApp *
									</label>
									<input
										type="text"
										required
										value={contactPhone}
										onChange={(e) => setContactPhone(e.target.value)}
										className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600"
									/>
								</div>

								<div>
									<label className="block text-[11px] font-bold text-gray-700 mb-1">
										Office / Store Address
									</label>
									<input
										type="text"
										value={contactAddress}
										onChange={(e) => setContactAddress(e.target.value)}
										className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600"
									/>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
							<button
								type="button"
								onClick={() => setIsPreviewOpen(true)}
								className="w-full sm:w-auto px-6 py-3 rounded-full border border-gray-200/90 text-gray-700 hover:bg-gray-100 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer">
								<Eye className="w-4 h-4 text-blue-600" />
								<span>Preview Your Custom Site</span>
							</button>

							<PillButton
								type="submit"
								disabled={isSubmitting}
								baseColor="#004ac6"
								circleColor="#ffffff"
								textColor="#ffffff"
								hoverTextColor="#004ac6"
								useThunderFont={true}
								className="w-full sm:w-auto px-8 py-3 rounded-full font-bold text-xs border border-blue-600 shadow-md">
								{isSubmitting ? (
									<span className="inline-flex items-center gap-2">
										<Loader2 className="w-4 h-4 animate-spin" />
										<span>Saving Details...</span>
									</span>
								) : (
									<span className="inline-flex items-center gap-2">
										<Sparkles className="w-4 h-4" />
										<span>Submit Business Details</span>
									</span>
								)}
							</PillButton>
						</div>
					</form>
				)}
			</div>

			{/* LIVE INTERACTIVE SITE PREVIEW MODAL */}
			{isPreviewOpen && (
				<div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
					<div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
						{/* Top Control Bar */}
						<div className="px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<div className="w-3 h-3 rounded-full bg-red-500" />
								<div className="w-3 h-3 rounded-full bg-amber-500" />
								<div className="w-3 h-3 rounded-full bg-emerald-500" />
								<span className="text-xs font-mono font-bold text-slate-400 ml-2 truncate max-w-[200px] sm:max-w-xs">
									https://{businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}.kioosk.online
								</span>
							</div>

							{/* Device Switcher */}
							<div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
								<button
									type="button"
									onClick={() => setPreviewDevice("desktop")}
									className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
										previewDevice === "desktop"
											? "bg-blue-600 text-white shadow-xs"
											: "text-slate-400 hover:text-white"
									}`}>
									<Monitor className="w-3.5 h-3.5" />
									<span className="hidden sm:inline">Desktop</span>
								</button>
								<button
									type="button"
									onClick={() => setPreviewDevice("mobile")}
									className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
										previewDevice === "mobile"
											? "bg-blue-600 text-white shadow-xs"
											: "text-slate-400 hover:text-white"
									}`}>
									<Smartphone className="w-3.5 h-3.5" />
									<span className="hidden sm:inline">Mobile</span>
								</button>
							</div>

							<button
								type="button"
								onClick={() => setIsPreviewOpen(false)}
								className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
								<X className="w-5 h-5" />
							</button>
						</div>

						{/* Live Interactive Site Render Window */}
						<div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-8 flex items-center justify-center">
							<div
								className={`transition-all duration-300 bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl ${
									previewDevice === "mobile" ? "w-[375px] min-h-[667px]" : "w-full min-h-[550px]"
								}`}>
								
								{/* RENDER: Site Navbar */}
								<header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
									<div className="flex items-center gap-2.5">
										{logoImage ? (
											<img
												src={logoImage}
												alt="Logo"
												className="w-7 h-7 rounded-lg object-cover border border-gray-200"
											/>
										) : (
											<div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
												{businessName[0] || "B"}
											</div>
										)}
										<span className="font-bold text-sm text-gray-900 font-nohemi">
											{businessName}
										</span>
									</div>

									<div className="hidden sm:flex items-center gap-5 text-xs font-semibold text-gray-600">
										<span>About</span>
										<span>Services</span>
										<span>Contact</span>
									</div>

									<button className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold">
										Contact Us
									</button>
								</header>

								{/* RENDER: Hero Section */}
								<div className="relative bg-slate-900 text-white py-16 px-6 text-center overflow-hidden">
									{heroImage && (
										<div className="absolute inset-0 z-0">
											<img
												src={heroImage}
												alt="Hero Background"
												className="w-full h-full object-cover opacity-30 blur-xs"
											/>
										</div>
									)}

									<div className="relative z-10 max-w-xl mx-auto space-y-4">
										<span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-extrabold uppercase tracking-wider border border-blue-500/30">
											Welcome to {businessName}
										</span>
										<h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-nohemi leading-tight">
											{tagline}
										</h1>
										<p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-md mx-auto">
											{aboutText}
										</p>
										<div className="pt-2 flex items-center justify-center gap-3">
											<button className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md">
												Get Started Today
											</button>
										</div>
									</div>
								</div>

								{/* RENDER: Services Section */}
								<div className="py-12 px-6 bg-slate-50">
									<div className="max-w-md mx-auto text-center mb-8">
										<h2 className="text-lg font-bold font-nohemi text-gray-900 mb-1">
											Our Primary Services
										</h2>
										<p className="text-xs text-gray-500">Quality solutions tailored for you.</p>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
										{servicesList.split("\n").map((svc, i) => (
											<div
												key={i}
												className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
												<div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold mb-2">
													{i + 1}
												</div>
												<p className="text-xs font-bold text-gray-900">{svc}</p>
											</div>
										))}
									</div>
								</div>

								{/* RENDER: Contact Footer */}
								<footer className="py-8 px-6 bg-white border-t border-gray-100 text-center text-xs text-gray-500 space-y-3">
									<p className="font-bold text-gray-900">{businessName}</p>
									<div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-600">
										<span className="flex items-center gap-1">
											<Mail className="w-3.5 h-3.5 text-blue-600" />
											{contactEmail}
										</span>
										<span className="flex items-center gap-1">
											<Phone className="w-3.5 h-3.5 text-blue-600" />
											{contactPhone}
										</span>
									</div>
									<p className="text-[10px] text-gray-400">
										© {new Date().getFullYear()} {businessName}. All rights reserved. Powered by Kiosk.
									</p>
								</footer>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
