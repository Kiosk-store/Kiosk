/** @format */

"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Globe,
	CheckCircle2,
	Clock,
	Sparkles,
	Upload,
	ExternalLink,
	Download,
	Copy,
	Check,
	Save,
	Send,
	AlertCircle,
	Loader2,
	ShoppingBag,
	Zap,
	Layers,
	Phone,
	Mail,
	Share2,
	Sun,
	Moon,
	Trash2,
	MessageSquare,
	ShieldCheck,
	Image as ImageIcon,
} from "lucide-react";

interface ProjectDetail {
	id: string;
	name: string;
	type: string;
	status: string;
	progress: number;
	publishedUrl?: string;
	adminNotes?: string;
	createdAt: string;
	updatedAt: string;
	tenant?: {
		id: string;
		name: string;
		slug: string;
		plan: string;
		customDomain?: string;
		billingStatus?: string;
	};
	owner?: {
		id: string;
		name: string;
		email: string;
		phone?: string;
		role: string;
	};
	content?: {
		businessName?: string;
		tagline?: string;
		aboutText?: string;
		themeMode?: "light" | "dark";
		contactEmail?: string;
		contactPhone?: string;
		contactAddress?: string;
		whatsappLink?: string;
		xLink?: string;
		instagramLink?: string;
		facebookLink?: string;
		linkedinLink?: string;
		youtubeLink?: string;
		tiktokLink?: string;
		bookingLink?: string;
		customLink?: string;
		logoImage?: {
			id: string;
			name: string;
			size: string;
			url: string;
		};
		uploadedImages?: Array<{
			id: string;
			name: string;
			size: string;
			url: string;
		}>;
		services?: Array<{
			id: string;
			title: string;
			description: string;
			price?: string;
		}>;
		testimonialsList?: Array<{
			id: string;
			name: string;
			role?: string;
			review: string;
			rating: number;
		}>;
		faqs?: Array<{
			id: string;
			question: string;
			answer: string;
		}>;
		stats?: Array<{
			id: string;
			label: string;
			value: string;
		}>;
		ctaText?: string;
		leadMagnetTitle?: string;
		videoUrl?: string;
		countdownMinutes?: number;
		valueStackItems?: Array<{
			id: string;
			title: string;
			value: string;
			description?: string;
			isBonus?: boolean;
		}>;
		regularPrice?: number;
		discountPrice?: number;
		orderBumpTitle?: string;
		orderBumpPrice?: number;
		orderBumpDescription?: string;
		guaranteeText?: string;
		products?: Array<{
			id: string;
			name: string;
			price: number;
			category?: string;
			imageUrl?: string;
			badge?: string;
			description?: string;
		}>;
		currency?: string;
		shippingInfo?: string;
	};
}

export default function AdminProjectReviewPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const router = useRouter();
	const { id: projectId } = use(params);

	const [project, setProject] = useState<ProjectDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

	// Editable fulfillment states
	const [status, setStatus] = useState<string>("In Review");
	const [progress, setProgress] = useState<number>(85);
	const [publishedUrl, setPublishedUrl] = useState<string>("");
	const [adminNotes, setAdminNotes] = useState<string>("");

	// Copy feedback state
	const [copiedField, setCopiedField] = useState<string | null>(null);

	useEffect(() => {
		async function fetchProjectDetail() {
			try {
				setIsLoading(true);
				const res = await fetch(`/api/admin/projects/${projectId}`);
				if (res.ok) {
					const data = await res.json();
					const proj = data.project;
					setProject(proj);
					setStatus(proj.status || "In Review");
					setProgress(proj.progress || 85);
					setPublishedUrl(
						proj.publishedUrl ||
							(proj.tenant?.slug ? `https://${proj.tenant.slug}.kioosk.online` : "")
					);
					setAdminNotes(proj.adminNotes || "");
				}
			} catch (err) {
				console.error("[FETCH_ADMIN_PROJECT_ERROR]", err);
			} finally {
				setIsLoading(false);
			}
		}

		fetchProjectDetail();
	}, [projectId]);

	const handleCopy = (text: string, fieldId: string) => {
		navigator.clipboard.writeText(text);
		setCopiedField(fieldId);
		setTimeout(() => setCopiedField(null), 2000);
	};

	const handleSaveProject = async (notifyClient: boolean = false) => {
		try {
			setIsSaving(true);
			setSaveSuccessMessage(null);

			const payload = {
				status: notifyClient ? "Live" : status,
				progress: notifyClient ? 100 : progress,
				publishedUrl,
				adminNotes,
				notifyClient,
			};

			const res = await fetch(`/api/admin/projects/${projectId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (res.ok) {
				const data = await res.json();
				if (notifyClient) {
					setStatus("Live");
					setProgress(100);
					setSaveSuccessMessage("🎉 Website published LIVE and launch email sent to client!");
				} else {
					setSaveSuccessMessage("✅ Project fulfillment updates saved successfully.");
				}
				setTimeout(() => setSaveSuccessMessage(null), 5000);
			} else {
				alert("Failed to save project updates.");
			}
		} catch (err) {
			console.error("[SAVE_ADMIN_PROJECT_ERROR]", err);
			alert("An error occurred while saving.");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
				<Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
				<p className="text-xs font-bold text-gray-500">Loading project review studio...</p>
			</div>
		);
	}

	if (!project) {
		return (
			<div className="p-12 text-center space-y-3 bg-white rounded-3xl border border-gray-200">
				<AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
				<h3 className="text-lg font-bold text-gray-900">Project Not Found</h3>
				<p className="text-xs text-gray-500">Could not locate submission details for this ID.</p>
				<Link
					href="/admin/projects"
					className="inline-flex px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">
					Back to Queue
				</Link>
			</div>
		);
	}

	const content = project.content || {};

	return (
		<div className="space-y-8 animate-in fade-in duration-200">
			{/* Top Nav Row */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<div className="flex items-center gap-2">
						<Link
							href="/admin/projects"
							className="text-xs font-bold text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
							<ArrowLeft className="w-3.5 h-3.5" />
							<span>Back to Fulfillment Queue</span>
						</Link>
						<span className="text-gray-300">/</span>
						<span className="text-xs font-bold text-blue-600">Review Studio</span>
					</div>
					<div className="flex items-center gap-3 mt-1">
						<h1 className="text-2xl font-bold font-nohemi text-gray-900">
							{content.businessName || project.name}
						</h1>
						<span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800">
							{project.type}
						</span>
					</div>
				</div>

				<div className="flex items-center gap-2">
					{publishedUrl && (
						<a
							href={publishedUrl}
							target="_blank"
							rel="noreferrer"
							className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-1.5 transition-colors">
							<ExternalLink className="w-3.5 h-3.5" />
							<span>Visit Live Site</span>
						</a>
					)}
				</div>
			</div>

			{/* Success Alert Banner */}
			{saveSuccessMessage && (
				<div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in">
					<div className="flex items-center gap-2">
						<CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
						<span>{saveSuccessMessage}</span>
					</div>
				</div>
			)}

			{/* ACTION COMMAND CENTER: STATUS & PUBLISH CONTROLS */}
			<div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold shadow-md">
							<Sparkles className="w-5 h-5 text-white" />
						</div>
						<div>
							<h3 className="font-extrabold font-nohemi text-lg tracking-tight">
								Fulfillment & Launch Control Center
							</h3>
							<p className="text-xs text-slate-400 font-medium">
								Update deployment status, assign published URL, or trigger automated client launch email.
							</p>
						</div>
					</div>

					{/* Launch Button */}
					<button
						type="button"
						disabled={isSaving}
						onClick={() => handleSaveProject(true)}
						className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer group">
						<Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
						<span>🚀 Publish Website & Email Client Launch Notification</span>
					</button>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
					{/* Status Selector */}
					<div className="space-y-1.5">
						<label className="text-xs font-bold text-slate-300">Project Status</label>
						<select
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer">
							<option value="In Review">In Review (Awaiting QA)</option>
							<option value="In Progress">In Progress (Design & Template)</option>
							<option value="Live">Live (Published to Internet)</option>
							<option value="Draft">Draft</option>
						</select>
					</div>

					{/* Progress Slider */}
					<div className="space-y-1.5">
						<div className="flex items-center justify-between text-xs font-bold text-slate-300">
							<span>Progress Percentage</span>
							<span className="text-blue-400">{progress}%</span>
						</div>
						<input
							type="range"
							min="0"
							max="100"
							step="5"
							value={progress}
							onChange={(e) => setProgress(Number(e.target.value))}
							className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
						/>
					</div>

					{/* Published URL */}
					<div className="space-y-1.5">
						<label className="text-xs font-bold text-slate-300">Published Live Domain URL</label>
						<input
							type="text"
							placeholder="https://brand.kioosk.online"
							value={publishedUrl}
							onChange={(e) => setPublishedUrl(e.target.value)}
							className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
						/>
					</div>
				</div>

				{/* Admin Internal Notes */}
				<div className="space-y-2 pt-2 border-t border-slate-800/80">
					<div className="flex items-center justify-between">
						<label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
							<MessageSquare className="w-3.5 h-3.5 text-blue-400" />
							<span>Internal Fulfillment Team Notes</span>
						</label>
						<button
							type="button"
							disabled={isSaving}
							onClick={() => handleSaveProject(false)}
							className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer">
							{isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
							<span>Save Progress</span>
						</button>
					</div>
					<textarea
						rows={2}
						placeholder="Add internal notes for team QA, domain DNS status, custom requests..."
						value={adminNotes}
						onChange={(e) => setAdminNotes(e.target.value)}
						className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500 placeholder:text-slate-500 leading-relaxed"
					/>
				</div>
			</div>

			{/* GRID LAYOUT: CLIENT SUBMISSION DATA */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				
				{/* LEFT COLUMN: BRAND ASSETS & COPY (8 COLS) */}
				<div className="lg:col-span-8 space-y-6">
					
					{/* 1. BRAND LOGO & MEDIA ASSETS */}
					<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xs">
						<div className="flex items-center justify-between pb-3 border-b border-gray-100">
							<h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
								<ImageIcon className="w-4 h-4 text-blue-600" />
								<span>1. Primary Logo & Media Assets</span>
							</h3>
							<span className="text-[11px] font-bold text-gray-400">
								{content.uploadedImages?.length || 0} Files Uploaded
							</span>
						</div>

						{/* Primary Logo */}
						<div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-3">
							<span className="text-xs font-bold text-gray-900 block">Primary Brand Logo</span>
							{content.logoImage?.url ? (
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
									<div className="flex items-center gap-3">
										<div className="w-16 h-16 rounded-xl border border-gray-200 bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#ffffff_0%_50%)] bg-[length:12px_12px] flex items-center justify-center p-1 shrink-0 overflow-hidden">
											<img
												src={content.logoImage.url}
												alt="Brand Logo"
												className="max-h-full max-w-full object-contain"
											/>
										</div>
										<div>
											<p className="text-xs font-bold text-gray-900 truncate max-w-xs">
												{content.logoImage.name}
											</p>
											<p className="text-[10px] text-gray-400">{content.logoImage.size}</p>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<button
											type="button"
											onClick={() => handleCopy(content.logoImage!.url, "logo")}
											className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-[11px] font-bold transition-colors flex items-center gap-1.5">
											{copiedField === "logo" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
											<span>Copy URL</span>
										</button>
										<a
											href={content.logoImage.url}
											target="_blank"
											rel="noreferrer"
											className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors flex items-center gap-1.5">
											<ExternalLink className="w-3.5 h-3.5" />
											<span>View Full</span>
										</a>
									</div>
								</div>
							) : (
								<p className="text-xs text-gray-400 italic">No primary logo uploaded.</p>
							)}
						</div>

						{/* Brand Media Assets */}
						<div className="space-y-3">
							<span className="text-xs font-bold text-gray-900 block">Brand Media Assets & Photos</span>
							{content.uploadedImages && content.uploadedImages.length > 0 ? (
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
									{content.uploadedImages.map((img, idx) => (
										<div
											key={img.id || idx}
											className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between gap-2 group">
											<img
												src={img.url}
												alt={img.name}
												className="w-full h-24 rounded-lg object-cover border border-gray-200"
											/>
											<div className="flex items-center justify-between gap-1">
												<p className="text-[10px] font-bold text-gray-800 truncate flex-1">
													{img.name}
												</p>
												<a
													href={img.url}
													target="_blank"
													rel="noreferrer"
													className="p-1 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-white transition-colors">
													<ExternalLink className="w-3.5 h-3.5" />
												</a>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-xs text-gray-400 italic">No additional brand assets uploaded.</p>
							)}
						</div>
					</div>

					{/* 2. CORE BUSINESS COPY & VALUE PROPOSITION */}
					<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xs">
						<div className="flex items-center justify-between pb-3 border-b border-gray-100">
							<h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
								<Globe className="w-4 h-4 text-blue-600" />
								<span>2. Core Business Copy & Theme</span>
							</h3>
							{content.themeMode && (
								<span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-100 text-gray-800 flex items-center gap-1">
									{content.themeMode === "dark" ? <Moon className="w-3 h-3 text-purple-600" /> : <Sun className="w-3 h-3 text-amber-600" />}
									<span className="capitalize">{content.themeMode} Theme</span>
								</span>
							)}
						</div>

						<div className="space-y-4 text-xs">
							<div>
								<span className="font-bold text-gray-400 uppercase text-[10px] block mb-1">
									Business Name
								</span>
								<p className="text-sm font-bold text-gray-900">
									{content.businessName || project.name}
								</p>
							</div>

							<div>
								<span className="font-bold text-gray-400 uppercase text-[10px] block mb-1">
									Headline / Tagline
								</span>
								<p className="text-xs font-medium text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200/70">
									{content.tagline || "N/A"}
								</p>
							</div>

							<div>
								<span className="font-bold text-gray-400 uppercase text-[10px] block mb-1">
									About Business & Core Value Proposition
								</span>
								<p className="text-xs font-medium text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-200/70 leading-relaxed whitespace-pre-wrap">
									{content.aboutText || "N/A"}
								</p>
							</div>
						</div>
					</div>

					{/* 3. DYNAMIC PLAN OFFERINGS (SERVICES / FUNNEL / CATALOG) */}
					{project.type.toLowerCase().includes("landing") && content.services && (
						<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xs">
							<h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
								<Layers className="w-4 h-4 text-blue-600" />
								<span>Landing Page Services ({content.services.length})</span>
							</h3>

							<div className="space-y-3">
								{content.services.map((srv, idx) => (
									<div key={srv.id || idx} className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-1">
										<div className="flex items-center justify-between">
											<h4 className="text-xs font-bold text-gray-900">{srv.title}</h4>
											{srv.price && <span className="text-[11px] font-bold text-blue-600">{srv.price}</span>}
										</div>
										<p className="text-[11px] text-gray-600">{srv.description}</p>
									</div>
								))}
							</div>
						</div>
					)}

					{project.type.toLowerCase().includes("funnel") && (
						<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xs">
							<h3 className="text-xs font-extrabold text-purple-700 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
								<Zap className="w-4 h-4 text-purple-600" />
								<span>Sales Funnel Offer Stack</span>
							</h3>

							<div className="grid grid-cols-2 gap-3 text-xs">
								<div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
									<span className="text-[10px] text-purple-600 font-bold uppercase">Retail Price</span>
									<p className="text-base font-extrabold text-purple-950">${content.regularPrice || 0}</p>
								</div>
								<div className="p-3 rounded-xl bg-purple-100 border border-purple-200">
									<span className="text-[10px] text-purple-700 font-bold uppercase">Special Funnel Price</span>
									<p className="text-base font-extrabold text-purple-900">${content.discountPrice || 0}</p>
								</div>
							</div>

							{content.valueStackItems && content.valueStackItems.length > 0 && (
								<div className="space-y-2 pt-2">
									<span className="text-xs font-bold text-gray-900">Value Stack Deliverables</span>
									{content.valueStackItems.map((item, i) => (
										<div key={item.id || i} className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
											<div>
												<p className="text-xs font-bold text-gray-900">{item.title}</p>
												<p className="text-[10px] text-gray-500">{item.description}</p>
											</div>
											<span className="text-xs font-extrabold text-purple-600">{item.value}</span>
										</div>
									))}
								</div>
							)}
						</div>
					)}

					{project.type.toLowerCase().includes("commerce") && content.products && (
						<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xs">
							<h3 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
								<ShoppingBag className="w-4 h-4 text-emerald-600" />
								<span>E-Commerce Products ({content.products.length})</span>
							</h3>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{content.products.map((prod, i) => (
									<div key={prod.id || i} className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex gap-3">
										{prod.imageUrl ? (
											<img src={prod.imageUrl} alt={prod.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
										) : (
											<div className="w-14 h-14 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
												Item
											</div>
										)}
										<div className="min-w-0 flex-1">
											<p className="text-xs font-bold text-gray-900 truncate">{prod.name}</p>
											<p className="text-[11px] font-extrabold text-emerald-600">${prod.price}</p>
											{prod.badge && (
												<span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">
													{prod.badge}
												</span>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* RIGHT COLUMN: CLIENT & CONTACT INFO (4 COLS) */}
				<div className="lg:col-span-4 space-y-6">
					
					{/* Account & Owner Profile */}
					<div className="bg-white border border-gray-200/90 rounded-3xl p-6 space-y-4 shadow-2xs">
						<h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100">
							Client Account Profile
						</h3>

						<div className="space-y-3 text-xs">
							<div>
								<span className="text-[10px] font-bold text-gray-400 uppercase block">Client Name</span>
								<p className="font-bold text-gray-900">{project.owner?.name || "Client"}</p>
							</div>

							<div>
								<span className="text-[10px] font-bold text-gray-400 uppercase block">Account Email</span>
								<div className="flex items-center justify-between">
									<a href={`mailto:${project.owner?.email}`} className="font-medium text-blue-600 hover:underline truncate">
										{project.owner?.email}
									</a>
									<button
										type="button"
										onClick={() => handleCopy(project.owner?.email || "", "email")}
										className="text-gray-400 hover:text-gray-900">
										{copiedField === "email" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
									</button>
								</div>
							</div>

							{project.owner?.phone && (
								<div>
									<span className="text-[10px] font-bold text-gray-400 uppercase block">Phone</span>
									<p className="font-medium text-gray-800">{project.owner.phone}</p>
								</div>
							)}

							<div>
								<span className="text-[10px] font-bold text-gray-400 uppercase block">Tenant Slug</span>
								<p className="font-mono text-xs font-bold text-gray-700">{project.tenant?.slug || "N/A"}</p>
							</div>
						</div>
					</div>

					{/* Contact Details & Social Links */}
					<div className="bg-white border border-gray-200/90 rounded-3xl p-6 space-y-4 shadow-2xs">
						<h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
							<Phone className="w-4 h-4 text-blue-600" />
							<span>Contact & Social Links</span>
						</h3>

						<div className="space-y-3 text-xs">
							{content.whatsappLink && (
								<div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
									<span className="font-bold text-emerald-900">WhatsApp</span>
									<a href={content.whatsappLink} target="_blank" rel="noreferrer" className="text-emerald-700 font-bold hover:underline">
										Test Chat →
									</a>
								</div>
							)}

							{content.contactPhone && (
								<div>
									<span className="text-[10px] font-bold text-gray-400 uppercase block">Phone</span>
									<p className="font-medium text-gray-900">{content.contactPhone}</p>
								</div>
							)}

							{content.contactEmail && (
								<div>
									<span className="text-[10px] font-bold text-gray-400 uppercase block">Business Email</span>
									<p className="font-medium text-gray-900">{content.contactEmail}</p>
								</div>
							)}

							{content.contactAddress && (
								<div>
									<span className="text-[10px] font-bold text-gray-400 uppercase block">Physical Location</span>
									<p className="font-medium text-gray-700">{content.contactAddress}</p>
								</div>
							)}

							{/* Social Handles */}
							<div className="pt-2 border-t border-gray-100 space-y-1.5">
								<span className="text-[10px] font-bold text-gray-400 uppercase block">Social Channels</span>
								{content.instagramLink && (
									<a href={content.instagramLink} target="_blank" rel="noreferrer" className="text-pink-600 hover:underline block text-[11px] truncate">
										Instagram: {content.instagramLink}
									</a>
								)}
								{content.xLink && (
									<a href={content.xLink} target="_blank" rel="noreferrer" className="text-gray-900 hover:underline block text-[11px] truncate">
										X (Twitter): {content.xLink}
									</a>
								)}
								{content.facebookLink && (
									<a href={content.facebookLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline block text-[11px] truncate">
										Facebook: {content.facebookLink}
									</a>
								)}
								{content.bookingLink && (
									<a href={content.bookingLink} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline block text-[11px] truncate">
										Calendly / Booking: {content.bookingLink}
									</a>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
