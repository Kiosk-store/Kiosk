/** @format */

"use client";

export const dynamic = "force-dynamic";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
	Zap,
	ShoppingBag,
	CreditCard,
	Tag,
	FileCheck,
	Shuffle,
	Truck,
} from "lucide-react";
import PillButton from "@/components/PillButton";

interface UploadedImage {
	id: string;
	name: string;
	size: string;
	url: string;
}

type PlanType = "LANDING_PAGE" | "SALES_FUNNEL" | "E_COMMERCE";

const GOOGLE_FONTS_CATALOG = [
	{ name: "Outfit", category: "Modern Sans-Serif" },
	{ name: "Inter", category: "Clean & Universal" },
	{ name: "Plus Jakarta Sans", category: "Corporate & Tech" },
	{ name: "Poppins", category: "Geometric Sans" },
	{ name: "Playfair Display", category: "Luxury Serif" },
	{ name: "Montserrat", category: "Bold Branding" },
	{ name: "Lora", category: "Editorial Serif" },
	{ name: "Space Grotesk", category: "Futuristic Sans" },
	{ name: "Syne", category: "Artistic & Creative" },
	{ name: "DM Sans", category: "Minimalist Sans" },
	{ name: "Cinzel", category: "High Fashion Serif" },
	{ name: "Roboto", category: "Classic Sans" },
];

function ContentForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Plan & Payment Status Detection
	const planQuery = (searchParams.get("plan") || "").toUpperCase();
	const statusParam = (searchParams.get("status") || "").toLowerCase();
	const isCancelled =
		statusParam === "cancelled" ||
		statusParam === "failed" ||
		searchParams.get("cancelled") === "true";
	const isPaymentSuccess =
		(statusParam === "successful" ||
			statusParam === "success" ||
			searchParams.get("payment") === "complete") &&
		!isCancelled;

	const [activePlan, setActivePlan] = useState<PlanType>(
		planQuery.includes("FUNNEL")
			? "SALES_FUNNEL"
			: planQuery.includes("COMMERCE") || planQuery.includes("STORE")
			? "E_COMMERCE"
			: "LANDING_PAGE",
	);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

	// Google Fonts State
	const [selectedFont, setSelectedFont] = useState("Outfit");

	const handleRandomizeFont = () => {
		const randomIndex = Math.floor(Math.random() * GOOGLE_FONTS_CATALOG.length);
		setSelectedFont(GOOGLE_FONTS_CATALOG[randomIndex].name);
	};

	// ZERO DEMO DATA - Start completely empty for clean user entry
	const [businessName, setBusinessName] = useState("");
	const [tagline, setTagline] = useState("");
	const [aboutText, setAboutText] = useState("");
	const [servicesList, setServicesList] = useState("");
	const [contactEmail, setContactEmail] = useState("");
	const [contactPhone, setContactPhone] = useState("");
	const [contactAddress, setContactAddress] = useState("");

	// Sales Funnel Specific Fields
	const [leadMagnetTitle, setLeadMagnetTitle] = useState("");
	const [valueStack, setValueStack] = useState("");
	const [testimonials, setTestimonials] = useState("");

	// E-Commerce Specific Fields
	const [productCatalog, setProductCatalog] = useState("");
	const [currency, setCurrency] = useState("USD");
	const [shippingInfo, setShippingInfo] = useState("");

	// Uploaded images state - Starts completely empty
	const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

	const projectId = searchParams.get("projectId") || "default";
	const draftKey = `kiosk_draft_content_${projectId}`;
	const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

	// Load existing user submitted content from backend + localStorage cache
	useEffect(() => {
		async function loadSavedContent() {
			try {
				// Reset state to empty defaults for new/switched project
				setBusinessName("");
				setTagline("");
				setAboutText("");
				setServicesList("");
				setContactEmail("");
				setContactPhone("");
				setContactAddress("");
				setLeadMagnetTitle("");
				setValueStack("");
				setTestimonials("");
				setProductCatalog("");
				setCurrency("USD");
				setShippingInfo("");
				setSelectedFont("Outfit");
				setUploadedImages([]);
				setHasLoadedDraft(false);

				let backendContent: any = {};
				const res = await fetch(`/api/projects/content?projectId=${projectId}`);
				if (res.ok) {
					const data = await res.json();
					if (data.content) {
						backendContent = data.content;
					}
				}

				// Check for local unsubmitted draft in localStorage
				let draftContent: any = {};
				try {
					const localDraft = localStorage.getItem(draftKey);
					if (localDraft) {
						draftContent = JSON.parse(localDraft);
					}
				} catch (e) {
					console.error("[LOCALSTORAGE_READ_ERROR]", e);
				}

				// Merge backend content with local draft (local draft takes precedence for unsaved edits)
				const merged = { ...backendContent, ...draftContent };

				if (merged.businessName) setBusinessName(merged.businessName);
				if (merged.tagline) setTagline(merged.tagline);
				if (merged.aboutText) setAboutText(merged.aboutText);
				if (merged.servicesList) setServicesList(merged.servicesList);
				if (merged.contactEmail) setContactEmail(merged.contactEmail);
				if (merged.contactPhone) setContactPhone(merged.contactPhone);
				if (merged.contactAddress) setContactAddress(merged.contactAddress);

				// Sales Funnel Fields
				if (merged.leadMagnetTitle) setLeadMagnetTitle(merged.leadMagnetTitle);
				if (merged.valueStack) setValueStack(merged.valueStack);
				if (merged.testimonials) setTestimonials(merged.testimonials);

				// E-commerce Fields
				if (merged.productCatalog) setProductCatalog(merged.productCatalog);
				if (merged.currency) setCurrency(merged.currency);
				if (merged.shippingInfo) setShippingInfo(merged.shippingInfo);

				if (merged.selectedFont) setSelectedFont(merged.selectedFont);

				if (Array.isArray(merged.uploadedImages)) {
					setUploadedImages(merged.uploadedImages);
				}
			} catch (err) {
				console.error("[LOAD_CONTENT_ERROR]", err);
			} finally {
				setHasLoadedDraft(true);
			}
		}
		loadSavedContent();
	}, [projectId, draftKey]);

	// Auto-save form progress to localStorage cache on any input change
	useEffect(() => {
		if (!hasLoadedDraft) return;
		try {
			const draftPayload = {
				businessName,
				tagline,
				aboutText,
				servicesList,
				contactEmail,
				contactPhone,
				contactAddress,
				leadMagnetTitle,
				valueStack,
				testimonials,
				productCatalog,
				currency,
				shippingInfo,
				selectedFont,
				uploadedImages,
				updatedAt: new Date().toISOString(),
			};
			localStorage.setItem(draftKey, JSON.stringify(draftPayload));
		} catch (e) {
			console.error("[LOCALSTORAGE_SAVE_ERROR]", e);
		}
	}, [
		hasLoadedDraft,
		draftKey,
		businessName,
		tagline,
		aboutText,
		servicesList,
		contactEmail,
		contactPhone,
		contactAddress,
		leadMagnetTitle,
		valueStack,
		testimonials,
		productCatalog,
		currency,
		shippingInfo,
		selectedFont,
		uploadedImages,
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!businessName.trim() || !tagline.trim()) {
			alert("Please fill in your Business Name and Tagline.");
			return;
		}

		try {
			setIsSubmitting(true);
			const payload = {
				projectId,
				plan: activePlan,
				businessName,
				tagline,
				aboutText,
				servicesList,
				contactEmail,
				contactPhone,
				contactAddress,
				leadMagnetTitle,
				valueStack,
				testimonials,
				productCatalog,
				currency,
				shippingInfo,
				selectedFont,
				uploadedImages,
			};

			const res = await fetch("/api/projects/content", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const data = await res.json();
			if (!res.ok) {
				alert(data.error || "Failed to submit custom content.");
				return;
			}

			// Clear local draft from localStorage after successful submission
			try {
				localStorage.removeItem(draftKey);
			} catch (e) {
				console.error("[LOCALSTORAGE_CLEAR_ERROR]", e);
			}

			setIsSubmitted(true);
			setTimeout(() => {
				router.push("/dashboard");
			}, 1500);
		} catch (err) {
			console.error("[SUBMIT_CONTENT_ERROR]", err);
			alert("An error occurred while saving your details.");
		} finally {
			setIsSubmitting(false);
		}
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

					<div className="flex items-center gap-3">
						<Link
							href="/templates"
							target="_blank"
							className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold border border-blue-200 transition-colors">
							<Globe className="w-3.5 h-3.5" />
							<span>Browse Templates</span>
						</Link>

						{/* Icon-Only Preview Button with Tooltip on Hover */}
						<div className="relative group/preview">
							<PillButton
								type="button"
								onClick={() => setIsPreviewOpen((prev) => !prev)}
								baseColor="#eff6ff"
								circleColor="#004ac6"
								textColor="#004ac6"
								hoverTextColor="#004ac6"
								aria-label="Preview Custom Site"
								className="p-2.5 rounded-full border border-blue-200 shadow-2xs">
								<Eye className="w-4 h-4 text-blue-600" />
							</PillButton>

							{/* Tooltip Badge on Hover */}
							<div className="absolute right-0 top-11 opacity-0 group-hover/preview:opacity-100 transition-opacity pointer-events-none z-30">
								<span className="px-2.5 py-1 rounded-lg bg-gray-900 text-white text-[10px] font-bold shadow-md whitespace-nowrap">
									Live Preview
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Payment Status Banners */}
				{isPaymentSuccess && (
					<div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in duration-300">
						<div className="flex items-center gap-2.5">
							<CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
							<span>
								Payment Confirmed! Welcome to your Kiosk workspace. Fill in your business details below to generate your site.
							</span>
						</div>
					</div>
				)}

				{isCancelled && (
					<div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in duration-300">
						<div className="flex items-center gap-2.5">
							<AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
							<span>
								Payment was cancelled or was not completed. You can retry your invoice payment or choose another payment method anytime.
							</span>
						</div>
						<Link
							href="/dashboard/billing"
							className="shrink-0 px-3 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shadow-2xs transition-colors">
							View Invoices →
						</Link>
					</div>
				)}

				{/* Header Title & Plan Selector */}
				<div className="pb-6 border-b border-gray-200/80 mb-8 space-y-4">
					<div className="flex items-center justify-between gap-4">
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 tracking-tight mb-1">
								Submit Your Business Copy & Images
							</h1>
							<p className="text-gray-500 text-sm font-medium">
								Tailored form fields generated for your active plan:{" "}
								<span className="font-bold text-blue-600">
									{activePlan === "LANDING_PAGE"
										? "Landing Page ($15/mo)"
										: activePlan === "SALES_FUNNEL"
										? "Sales Funnel ($30/mo)"
										: "E-commerce Store ($50/mo)"}
								</span>
							</p>
						</div>
					</div>

					{/* Interactive Plan Selector Switcher */}
					<div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/80">
						{[
							{ id: "LANDING_PAGE", label: "Landing Page", icon: Globe },
							{ id: "SALES_FUNNEL", label: "Sales Funnel", icon: Zap },
							{ id: "E_COMMERCE", label: "E-Commerce Store", icon: ShoppingBag },
						].map((tab) => {
							const Icon = tab.icon;
							const isActive = activePlan === tab.id;
							return (
								<button
									key={tab.id}
									type="button"
									onClick={() => setActivePlan(tab.id as PlanType)}
									className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
										isActive
											? "bg-white text-blue-600 shadow-xs border border-gray-200/80"
											: "text-gray-500 hover:text-gray-900"
									}`}>
									<Icon className="w-3.5 h-3.5" />
									<span className="hidden sm:inline">{tab.label}</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Success State */}
				{isSubmitted ? (
					<div className="bg-white border border-emerald-200 rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto shadow-xl shadow-emerald-500/10 animate-in fade-in zoom-in-95 duration-300">
						<CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
						<h2 className="text-2xl font-bold font-nohemi text-gray-900 mb-2">
							Details Received!
						</h2>
						<p className="text-xs text-gray-500 font-medium mb-6 leading-relaxed">
							Our design team has received your business details and {uploadedImages.length} brand images. Updating your custom website layout...
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
						
						{/* SECTION 1: BUSINESS LOGO & BRAND ASSETS */}
						<div className="space-y-4">
							<div className="flex items-center justify-between border-b border-gray-100 pb-3">
								<label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
									<ImageIcon className="w-4 h-4 text-blue-600" />
									<span>1. Upload Logo & Brand Photos ({uploadedImages.length})</span>
								</label>
								<span className="text-[11px] text-gray-400 font-medium">PNG, JPG, SVG up to 25MB</span>
							</div>

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
									Upload your business logo, hero background photos, product shots, or brand assets.
								</p>
							</div>

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

						{/* SECTION 2: CORE BUSINESS INFORMATION */}
						<div className="space-y-6 pt-4 border-t border-gray-100">
							<div className="border-b border-gray-100 pb-3">
								<label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
									<Globe className="w-4 h-4 text-blue-600" />
									<span>2. Core Business Information & Typography</span>
								</label>
							</div>

							{/* Google Fonts Picker & Randomizer */}
							<div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
								<div className="flex items-center justify-between gap-2">
									<div>
										<label className="text-xs font-bold text-gray-900 block">
											Select Site Google Font Typography
										</label>
										<p className="text-[11px] text-gray-500 font-medium">
											Choose a Google Font or click Randomize to test different typography styles.
										</p>
									</div>

									<button
										type="button"
										onClick={handleRandomizeFont}
										className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer">
										<Shuffle className="w-3.5 h-3.5" />
										<span>Randomize Font</span>
									</button>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
									<select
										value={selectedFont}
										onChange={(e) => setSelectedFont(e.target.value)}
										className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-blue-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-600 cursor-pointer">
										{GOOGLE_FONTS_CATALOG.map((font) => (
											<option key={font.name} value={font.name}>
												{font.name} ({font.category})
											</option>
										))}
									</select>

									<div className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 flex items-center justify-between text-xs font-bold text-gray-900 truncate">
										<span className="text-[11px] text-gray-400 font-normal">Active Typography:</span>
										<span style={{ fontFamily: selectedFont }}>{selectedFont}</span>
									</div>
								</div>
							</div>

							<div>
								<label className="block text-xs font-bold text-gray-700 mb-1.5">
									Business / Brand Name *
								</label>
								<input
									type="text"
									required
									placeholder="e.g. Acme Business Solutions"
									value={businessName}
									onChange={(e) => setBusinessName(e.target.value)}
									className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
								/>
							</div>

							<div>
								<label className="block text-xs font-bold text-gray-700 mb-1.5">
									Main Headline / Hero Tagline *
								</label>
								<input
									type="text"
									required
									placeholder="e.g. Premium Artisanal Goods Delivered To Your Doorstep"
									value={tagline}
									onChange={(e) => setTagline(e.target.value)}
									className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
								/>
							</div>

							<div>
								<label className="block text-xs font-bold text-gray-700 mb-1.5">
									About Business & Core Value Proposition
								</label>
								<textarea
									rows={3}
									placeholder="Describe your story, mission, and why customers choose your business..."
									value={aboutText}
									onChange={(e) => setAboutText(e.target.value)}
									className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors leading-relaxed"
								/>
							</div>
						</div>

						{/* SECTION 3: PLAN-SPECIFIC DYNAMIC FIELDS */}
						{activePlan === "LANDING_PAGE" && (
							<div className="space-y-6 pt-4 border-t border-gray-100">
								<div className="border-b border-gray-100 pb-3">
									<label className="text-xs font-extrabold text-blue-600 uppercase tracking-wider flex items-center gap-2">
										<Globe className="w-4 h-4 text-blue-600" />
										<span>3. Landing Page Services & Offers</span>
									</label>
								</div>

								<div>
									<label className="block text-xs font-bold text-gray-700 mb-1.5">
										List Your Core Services / Key Offerings
									</label>
									<textarea
										rows={4}
										placeholder="1. Strategy Consulting&#10;2. Professional Installation&#10;3. 24/7 Dedicated Support"
										value={servicesList}
										onChange={(e) => setServicesList(e.target.value)}
										className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors leading-relaxed"
									/>
								</div>
							</div>
						)}

						{activePlan === "SALES_FUNNEL" && (
							<div className="space-y-6 pt-4 border-t border-gray-100">
								<div className="border-b border-gray-100 pb-3">
									<label className="text-xs font-extrabold text-purple-600 uppercase tracking-wider flex items-center gap-2">
										<Zap className="w-4 h-4 text-purple-600" />
										<span>3. Sales Funnel Lead Magnet & Conversion Stack</span>
									</label>
								</div>

								<div>
									<label className="block text-xs font-bold text-gray-700 mb-1.5">
										Lead Magnet / Freebie Hook Title
									</label>
									<input
										type="text"
										placeholder="e.g. Free 5-Step Guide to Scaling Your Revenue in 2026"
										value={leadMagnetTitle}
										onChange={(e) => setLeadMagnetTitle(e.target.value)}
										className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-purple-600 transition-colors"
									/>
								</div>

								<div>
									<label className="block text-xs font-bold text-gray-700 mb-1.5">
										Offer Value Stack & Core Deliverables
									</label>
									<textarea
										rows={3}
										placeholder="• Complete Video Training ($299 Value)&#10;• 1-on-1 Strategy Call ($150 Value)&#10;• Bonus Templates Package ($99 Value)"
										value={valueStack}
										onChange={(e) => setValueStack(e.target.value)}
										className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-purple-600 transition-colors leading-relaxed"
									/>
								</div>

								<div>
									<label className="block text-xs font-bold text-gray-700 mb-1.5">
										Customer Testimonials / Reviews
									</label>
									<textarea
										rows={3}
										placeholder='"This funnel doubled our leads in 14 days!" — Sarah M., CEO'
										value={testimonials}
										onChange={(e) => setTestimonials(e.target.value)}
										className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-purple-600 transition-colors leading-relaxed"
									/>
								</div>
							</div>
						)}

						{activePlan === "E_COMMERCE" && (
							<div className="space-y-6 pt-4 border-t border-gray-100">
								<div className="border-b border-gray-100 pb-3">
									<label className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
										<ShoppingBag className="w-4 h-4 text-emerald-600" />
										<span>3. E-Commerce Product Catalog & Payment Settings</span>
									</label>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-xs font-bold text-gray-700 mb-1.5">
											Store Currency
										</label>
										<select
											value={currency}
											onChange={(e) => setCurrency(e.target.value)}
											className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
											<option value="USD">USD ($)</option>
											<option value="NGN">NGN (₦)</option>
											<option value="GHS">GHS (GH₵)</option>
											<option value="KES">KES (KSh)</option>
										</select>
									</div>

									<div>
										<label className="block text-xs font-bold text-gray-700 mb-1.5">
											Shipping & Delivery Regions
										</label>
										<input
											type="text"
											placeholder="e.g. Nationwide Shipping / 24-Hour Express Delivery"
											value={shippingInfo}
											onChange={(e) => setShippingInfo(e.target.value)}
											className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-emerald-600"
										/>
									</div>
								</div>

								<div>
									<label className="block text-xs font-bold text-gray-700 mb-1.5">
										Initial Product List (Product Name, Price, Description)
									</label>
									<textarea
										rows={4}
										placeholder="1. Custom Leather Wallet - $45.00 (Genuine handcrafted leather)&#10;2. Canvas Messenger Bag - $79.00 (Water-resistant travel bag)"
										value={productCatalog}
										onChange={(e) => setProductCatalog(e.target.value)}
										className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-emerald-600 transition-colors leading-relaxed"
									/>
								</div>
							</div>
						)}

						{/* SECTION 4: CONTACT INFO */}
						<div className="space-y-4 pt-4 border-t border-gray-100">
							<div className="border-b border-gray-100 pb-3">
								<label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
									<Phone className="w-4 h-4 text-blue-600" />
									<span>4. Contact & Business Location</span>
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
										placeholder="contact@mybusiness.com"
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
										placeholder="+1 (555) 019-2834"
										value={contactPhone}
										onChange={(e) => setContactPhone(e.target.value)}
										className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600"
									/>
								</div>

								<div>
									<label className="block text-[11px] font-bold text-gray-700 mb-1">
										Address / Location
									</label>
									<input
										type="text"
										placeholder="Downtown Business Center"
										value={contactAddress}
										onChange={(e) => setContactAddress(e.target.value)}
										className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600"
									/>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
							<div className="pt-6 border-t border-gray-100 flex items-center justify-end">
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
										<span>Saving Business Details...</span>
									</span>
								) : (
									<span className="inline-flex items-center gap-2">
										<Sparkles className="w-4 h-4" />
										<span>Submit Custom Content</span>
									</span>
								)}
							</PillButton>
						</div>
					</form>
				)}
			</div>

			{/* LIVE INTERACTIVE SITE PREVIEW MODAL */}
			{isPreviewOpen && (
				<div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
					<div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
						{/* Top Control Bar */}
						<div className="px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<div className="w-3 h-3 rounded-full bg-red-500" />
								<div className="w-3 h-3 rounded-full bg-amber-500" />
								<div className="w-3 h-3 rounded-full bg-emerald-500" />
								<span className="text-xs font-mono font-bold text-slate-400 ml-2 truncate max-w-[200px] sm:max-w-xs">
									https://{businessName ? businessName.toLowerCase().replace(/[^a-z0-9]/g, "") : "site"}.kioosk.online
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
							{/* Dynamically Load Selected Google Font */}
							<link
								rel="stylesheet"
								href={`https://fonts.googleapis.com/css2?family=${selectedFont.replace(/\s+/g, "+")}:wght@400;600;700;800&display=swap`}
							/>

							<div
								style={{ fontFamily: `'${selectedFont}', sans-serif` }}
								className={`transition-all duration-300 bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl ${
									previewDevice === "mobile" ? "w-[375px] max-w-full min-h-[667px]" : "w-full min-h-[550px]"
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
												{businessName ? businessName[0].toUpperCase() : "K"}
											</div>
										)}
										<span className="font-bold text-sm text-gray-900 font-nohemi">
											{businessName || "Your Business Name"}
										</span>
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
											{activePlan.replace("_", " ")}
										</span>
										<h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-nohemi leading-tight">
											{tagline || "Your Custom Business Tagline & Headline"}
										</h1>
										<p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-md mx-auto">
											{aboutText || "Enter your value proposition and business summary above."}
										</p>
									</div>
								</div>

								{/* RENDER: Plan Specific Section */}
								{activePlan === "LANDING_PAGE" && (
									<div className="py-12 px-6 bg-slate-50">
										<div className="max-w-md mx-auto text-center mb-8">
											<h2 className="text-lg font-bold font-nohemi text-gray-900 mb-1">
												Our Key Offers & Services
											</h2>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
											{(servicesList || "Service 1\nService 2\nService 3")
												.split("\n")
												.filter((s) => s.trim())
												.map((svc, i) => (
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
								)}

								{activePlan === "SALES_FUNNEL" && (
									<div className="py-12 px-6 bg-purple-50/50">
										<div className="max-w-md mx-auto text-center mb-6">
											<span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase">
												Exclusive Offer
											</span>
											<h2 className="text-xl font-bold font-nohemi text-gray-900 mt-2">
												{leadMagnetTitle || "Special Lead Magnet Offer"}
											</h2>
										</div>

										{valueStack && (
											<div className="max-w-md mx-auto bg-white p-5 rounded-2xl border border-purple-100 text-xs font-medium text-gray-700 leading-relaxed whitespace-pre-line mb-6">
												{valueStack}
											</div>
										)}
									</div>
								)}

								{activePlan === "E_COMMERCE" && (
									<div className="py-12 px-6 bg-emerald-50/50">
										<div className="max-w-md mx-auto text-center mb-6">
											<h2 className="text-xl font-bold font-nohemi text-gray-900">
												Featured Product Catalog ({currency})
											</h2>
											{shippingInfo && (
												<p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center justify-center gap-1">
													<Truck className="w-3.5 h-3.5" />
													<span>{shippingInfo}</span>
												</p>
											)}
										</div>

										{productCatalog && (
											<div className="max-w-md mx-auto bg-white p-5 rounded-2xl border border-emerald-100 text-xs font-medium text-gray-700 leading-relaxed whitespace-pre-line">
												{productCatalog}
											</div>
										)}
									</div>
								)}

								{/* RENDER: Contact Footer */}
								<footer className="py-8 px-6 bg-white border-t border-gray-100 text-center text-xs text-gray-500 space-y-2">
									<p className="font-bold text-gray-900">
										{businessName || "Your Business Name"}
									</p>
									<p className="text-[11px] text-gray-600">
										Email: {contactEmail || "contact@kioosk.online"} | Phone: {contactPhone || "+1 (555) 019-2834"}
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

export default function ContentSubmissionPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc]">
					<Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
				</div>
			}>
			<ContentForm />
		</Suspense>
	);
}
