/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Check,
	Sparkles,
	Globe,
	Filter,
	ShoppingBag,
	Upload,
	Loader2,
	CheckCircle2,
} from "lucide-react";
import PillButton from "@/components/PillButton";

type ProjectType = "Landing Page" | "Sales Funnel" | "E-commerce Store";

interface ProjectOption {
	type: ProjectType;
	icon: React.ElementType;
	price: string;
	delivery: string;
	description: string;
	bg: string;
	text: string;
}

const projectOptions: ProjectOption[] = [
	{
		type: "Landing Page",
		icon: Globe,
		price: "$20",
		delivery: "3-5 Days",
		description:
			"A high-converting single-page website engineered for rapid lead generation.",
		bg: "bg-blue-50",
		text: "text-blue-600",
	},
	{
		type: "Sales Funnel",
		icon: Filter,
		price: "$30",
		delivery: "5-7 Days",
		description:
			"Strategic multi-step funnel designed to guide prospects to purchase.",
		bg: "bg-indigo-50",
		text: "text-indigo-600",
	},
	{
		type: "E-commerce Store",
		icon: ShoppingBag,
		price: "$43",
		delivery: "7-10 Days",
		description:
			"Complete online storefront with payment processing and product management.",
		bg: "bg-purple-50",
		text: "text-purple-600",
	},
];

export default function NewProjectPage() {
	const router = useRouter();
	const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isComplete, setIsComplete] = useState(false);

	// Form State
	const [selectedType, setSelectedType] =
		useState<ProjectType>("Landing Page");
	const [projectName, setProjectName] = useState("");
	const [industry, setIndustry] = useState("");
	const [brandStyle, setBrandStyle] = useState("Modern & Sleek");
	const [headline, setHeadline] = useState("");
	const [contactInfo, setContactInfo] = useState("");

	const handleNextStep = (e: React.FormEvent) => {
		e.preventDefault();
		if (step < 4) {
			setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
		}
	};

	const handleSubmitProject = () => {
		setIsSubmitting(true);
		setTimeout(() => {
			setIsSubmitting(false);
			setIsComplete(true);
			setTimeout(() => {
				router.push("/dashboard/projects");
			}, 1200);
		}, 1000);
	};

	return (
		<div className="w-full min-h-screen bg-[#f8fafc]">
			{/* Main Container */}
			<div className="px-4 sm:px-6 lg:px-8 pt-8 pb-16 max-w-[1000px] mx-auto">
				{/* Top Back Link */}
				<div className="mb-6">
					<Link
						href="/dashboard/projects"
						className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors group">
						<ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
						<span>Back to Projects</span>
					</Link>
				</div>

				{/* Header Title */}
				<div className="pb-6 border-b border-gray-200/80 mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 tracking-tight mb-1">
						Start a New Project
					</h1>
					<p className="text-gray-500 text-sm font-medium">
						Follow the guided wizard to configure your new website project.
					</p>
				</div>

				{/* Step Progress Indicator */}
				<div className="grid grid-cols-4 gap-2 mb-10">
					{[
						{ num: 1, label: "Project Type" },
						{ num: 2, label: "Project Details" },
						{ num: 3, label: "Content & Goals" },
						{ num: 4, label: "Review & Launch" },
					].map((s) => {
						const isCurrent = step === s.num;
						const isPassed = step > s.num;

						return (
							<div key={s.num} className="flex flex-col gap-1.5">
								<div
									className={`h-1.5 rounded-full transition-all duration-300 ${
										isPassed || isCurrent ? "bg-blue-600" : "bg-gray-200"
									}`}
								/>
								<div className="hidden sm:flex items-center justify-between">
									<span
										className={`text-[11px] font-semibold ${
											isCurrent
												? "text-blue-600 font-bold"
												: isPassed
													? "text-gray-900"
													: "text-gray-400"
										}`}>
										{s.num}. {s.label}
									</span>
									{isPassed && (
										<Check className="w-3 h-3 text-blue-600 stroke-[3]" />
									)}
								</div>
							</div>
						);
					})}
				</div>

				{/* Success Completion View */}
				{isComplete ? (
					<div className="bg-white border border-emerald-200 rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto shadow-xl shadow-emerald-500/10 animate-in fade-in zoom-in-95 duration-300">
						<CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
						<h2 className="text-2xl font-bold font-nohemi text-gray-900 mb-2">
							Project Created!
						</h2>
						<p className="text-xs text-gray-500 font-medium mb-6">
							Your new project &quot;{projectName || selectedType}&quot; has been initialized. Redirecting to your projects workspace...
						</p>
						<div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
							<div className="bg-emerald-600 h-full w-full animate-pulse" />
						</div>
					</div>
				) : (
					/* Step Content Form */
					<div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8">
						{/* STEP 1: Select Project Type */}
						{step === 1 && (
							<div className="space-y-6">
								<div>
									<h2 className="text-lg font-bold font-nohemi text-gray-900 mb-1">
										Step 1: Choose Your Project Type
									</h2>
									<p className="text-xs text-gray-500 font-medium">
										Select the type of site you would like our team to build for you.
									</p>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{projectOptions.map((opt) => {
										const Icon = opt.icon;
										const isSelected = selectedType === opt.type;

										return (
											<button
												key={opt.type}
												type="button"
												onClick={() => setSelectedType(opt.type)}
												className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
													isSelected
														? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600/30"
														: "border-gray-200/90 hover:border-gray-300 bg-white"
												}`}>
												<div>
													<div className="flex items-center justify-between mb-3">
														<div
															className={`w-10 h-10 rounded-xl ${opt.bg} ${opt.text} flex items-center justify-center`}>
															<Icon className="w-5 h-5" />
														</div>
														{isSelected && (
															<span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
																<Check className="w-3.5 h-3.5 stroke-[3]" />
															</span>
														)}
													</div>

													<h3 className="text-base font-bold font-nohemi text-gray-900 mb-1">
														{opt.type}
													</h3>
													<p className="text-xs text-gray-500 font-medium mb-4 leading-relaxed">
														{opt.description}
													</p>
												</div>

												<div className="pt-3 border-t border-gray-100 flex items-center justify-between">
													<span className="text-lg font-bold font-nohemi text-gray-900">
														{opt.price}
													</span>
													<span className="text-[11px] text-gray-400 font-medium">
														{opt.delivery}
													</span>
												</div>
											</button>
										);
									})}
								</div>

								<div className="pt-4 flex justify-end">
									<PillButton
										type="button"
										onClick={() => setStep(2)}
										baseColor="#004ac6"
										circleColor="#ffffff"
										textColor="#ffffff"
										hoverTextColor="#004ac6"
										useThunderFont={true}
										className="px-6 py-2.5 rounded-full font-bold text-xs border border-blue-600 shadow-md">
										Continue to Details →
									</PillButton>
								</div>
							</div>
						)}

						{/* STEP 2: Project Details */}
						{step === 2 && (
							<form onSubmit={handleNextStep} className="space-y-6">
								<div>
									<h2 className="text-lg font-bold font-nohemi text-gray-900 mb-1">
										Step 2: Project Details
									</h2>
									<p className="text-xs text-gray-500 font-medium">
										Tell us about your project name and design preferences.
									</p>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
									<div className="sm:col-span-2">
										<label className="block text-xs font-semibold text-gray-700 mb-1.5">
											Project Name *
										</label>
										<input
											type="text"
											required
											placeholder="e.g., Summer Launch Funnel"
											value={projectName}
											onChange={(e) => setProjectName(e.target.value)}
											className="w-full px-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
										/>
									</div>

									<div>
										<label className="block text-xs font-semibold text-gray-700 mb-1.5">
											Industry / Niche
										</label>
										<input
											type="text"
											placeholder="e.g., Real Estate, SaaS, Fitness"
											value={industry}
											onChange={(e) => setIndustry(e.target.value)}
											className="w-full px-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
										/>
									</div>

									<div>
										<label className="block text-xs font-semibold text-gray-700 mb-1.5">
											Brand Aesthetic Style
										</label>
										<select
											value={brandStyle}
											onChange={(e) => setBrandStyle(e.target.value)}
											className="w-full px-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors bg-white">
											<option>Modern & Sleek</option>
											<option>Clean & Minimalist</option>
											<option>Vibrant & Energetic</option>
											<option>Corporate & Professional</option>
										</select>
									</div>
								</div>

								<div className="pt-4 flex items-center justify-between">
									<button
										type="button"
										onClick={() => setStep(1)}
										className="px-4 py-2 rounded-full border border-gray-200/90 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer">
										← Back
									</button>

									<PillButton
										type="submit"
										baseColor="#004ac6"
										circleColor="#ffffff"
										textColor="#ffffff"
										hoverTextColor="#004ac6"
										useThunderFont={true}
										className="px-6 py-2.5 rounded-full font-bold text-xs border border-blue-600 shadow-md">
										Continue to Content →
									</PillButton>
								</div>
							</form>
						)}

						{/* STEP 3: Content & Goals */}
						{step === 3 && (
							<form onSubmit={handleNextStep} className="space-y-6">
								<div>
									<h2 className="text-lg font-bold font-nohemi text-gray-900 mb-1">
										Step 3: Content & Goals
									</h2>
									<p className="text-xs text-gray-500 font-medium">
										Provide your main headline, copy, and contact information.
									</p>
								</div>

								<div className="space-y-5">
									<div>
										<label className="block text-xs font-semibold text-gray-700 mb-1.5">
											Main Headline / Value Proposition
										</label>
										<textarea
											rows={3}
											placeholder="e.g., We help scaling businesses automate their customer acquisition."
											value={headline}
											onChange={(e) => setHeadline(e.target.value)}
											className="w-full px-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
										/>
									</div>

									<div>
										<label className="block text-xs font-semibold text-gray-700 mb-1.5">
											Contact Phone / WhatsApp Number
										</label>
										<input
											type="text"
											placeholder="e.g., +1 (555) 019-2834"
											value={contactInfo}
											onChange={(e) => setContactInfo(e.target.value)}
											className="w-full px-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
										/>
									</div>

									{/* File Upload Placeholder */}
									<div>
										<label className="block text-xs font-semibold text-gray-700 mb-1.5">
											Upload Brand Assets (Logo, Images, Brief)
										</label>
										<div className="border-2 border-dashed border-gray-200/90 rounded-2xl p-6 text-center hover:border-blue-500/50 transition-colors cursor-pointer bg-gray-50/50">
											<Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
											<p className="text-xs font-semibold text-gray-700">
												Click to upload files or drag & drop
											</p>
											<p className="text-[10px] text-gray-400 font-medium mt-1">
												PNG, JPG, PDF up to 10MB
											</p>
										</div>
									</div>
								</div>

								<div className="pt-4 flex items-center justify-between">
									<button
										type="button"
										onClick={() => setStep(2)}
										className="px-4 py-2 rounded-full border border-gray-200/90 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer">
										← Back
									</button>

									<PillButton
										type="submit"
										baseColor="#004ac6"
										circleColor="#ffffff"
										textColor="#ffffff"
										hoverTextColor="#004ac6"
										useThunderFont={true}
										className="px-6 py-2.5 rounded-full font-bold text-xs border border-blue-600 shadow-md">
										Review Project →
									</PillButton>
								</div>
							</form>
						)}

						{/* STEP 4: Review & Submit */}
						{step === 4 && (
							<div className="space-y-6">
								<div>
									<h2 className="text-lg font-bold font-nohemi text-gray-900 mb-1">
										Step 4: Review & Launch
									</h2>
									<p className="text-xs text-gray-500 font-medium">
										Review your project setup details before creating your project.
									</p>
								</div>

								<div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-6 space-y-4 text-xs">
									<div className="flex justify-between items-center pb-3 border-b border-gray-200/60">
										<span className="text-gray-500 font-medium">
											Project Type:
										</span>
										<span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-200/80">
											{selectedType}
										</span>
									</div>

									<div className="flex justify-between items-center pb-3 border-b border-gray-200/60">
										<span className="text-gray-500 font-medium">
											Project Name:
										</span>
										<span className="font-bold text-gray-900">
											{projectName || "Untitled Project"}
										</span>
									</div>

									<div className="flex justify-between items-center pb-3 border-b border-gray-200/60">
										<span className="text-gray-500 font-medium">
											Industry:
										</span>
										<span className="font-bold text-gray-900">
											{industry || "General"}
										</span>
									</div>

									<div className="flex justify-between items-center pb-3 border-b border-gray-200/60">
										<span className="text-gray-500 font-medium">
											Brand Style:
										</span>
										<span className="font-bold text-gray-900">
											{brandStyle}
										</span>
									</div>

									<div className="flex justify-between items-center">
										<span className="text-gray-500 font-medium">
											Total One-time Investment:
										</span>
										<span className="text-xl font-bold font-nohemi text-blue-600">
											{
												projectOptions.find((o) => o.type === selectedType)
													?.price
											}
										</span>
									</div>
								</div>

								<div className="pt-4 flex items-center justify-between">
									<button
										type="button"
										onClick={() => setStep(3)}
										className="px-4 py-2 rounded-full border border-gray-200/90 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer">
										← Back
									</button>

									<PillButton
										type="button"
										disabled={isSubmitting}
										onClick={handleSubmitProject}
										baseColor="#004ac6"
										circleColor="#ffffff"
										textColor="#ffffff"
										hoverTextColor="#004ac6"
										useThunderFont={true}
										className="px-6 py-2.5 rounded-full font-bold text-xs border border-blue-600 shadow-md">
										{isSubmitting ? (
											<span className="inline-flex items-center gap-2">
												<Loader2 className="w-4 h-4 animate-spin" />
												<span>Creating Project...</span>
											</span>
										) : (
											<span className="inline-flex items-center gap-2">
												<Sparkles className="w-4 h-4" />
												<span>Create Project Now</span>
											</span>
										)}
									</PillButton>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
