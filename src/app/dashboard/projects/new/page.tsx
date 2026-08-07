/** @format */

"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PillButton from "@/components/PillButton";
import {
	Globe,
	Sparkles,
	ArrowLeft,
	CheckCircle2,
	Loader2,
	Layers,
	ShoppingBag,
	Zap,
} from "lucide-react";

export default function NewProjectPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const templateParam = searchParams.get("template") || "";

	const [name, setName] = useState("");
	const [type, setType] = useState<"Landing Page" | "Sales Funnel" | "E-commerce">(
		"Landing Page",
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			setError("Please enter a project name.");
			return;
		}

		try {
			setIsLoading(true);
			setError(null);

			const res = await fetch("/api/projects", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, type }),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Failed to create project.");
				setIsLoading(false);
				return;
			}

			router.push("/dashboard");
		} catch (err) {
			console.error("[CREATE_PROJECT_ERROR]", err);
			setError("An unexpected network error occurred.");
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full min-h-screen bg-[#f8fafc]">
			<div className="px-4 sm:px-6 lg:px-8 pt-10 pb-20 max-w-[800px] mx-auto">
				{/* Back link */}
				<div className="mb-6">
					<Link
						href="/dashboard"
						className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors group">
						<ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
						<span>Back to Dashboard</span>
					</Link>
				</div>

				{/* Header */}
				<div className="pb-6 border-b border-gray-200/80 mb-8">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-extrabold uppercase tracking-wider mb-3">
						<Sparkles className="w-3.5 h-3.5" />
						<span>Site Provisioning Engine</span>
					</div>
					<h1 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 tracking-tight mb-1">
						Create New Project
					</h1>
					<p className="text-gray-500 text-sm font-medium">
						Configure your website tier and site template blueprint.
					</p>
				</div>

				{error && (
					<div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold animate-in fade-in duration-200">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-8">
					{/* Step 1: Project Name */}
					<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 space-y-4">
						<label className="block text-sm font-bold text-gray-900">
							1. Enter Project Name
						</label>
						<input
							type="text"
							required
							placeholder="e.g. Acme Business Website"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
						/>
					</div>

					{/* Step 2: Select Tier */}
					<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 space-y-4">
						<label className="block text-sm font-bold text-gray-900">
							2. Select Website Build Tier
						</label>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							{[
								{
									id: "Landing Page",
									title: "Landing Page",
									price: "$20/mo",
									desc: "Single page lead generation & hero presentation.",
									icon: Globe,
								},
								{
									id: "Sales Funnel",
									title: "Sales Funnel",
									price: "$30/mo",
									desc: "5-step conversion pipeline & lead capture.",
									icon: Zap,
								},
								{
									id: "E-commerce",
									title: "E-commerce Store",
									price: "$43/mo",
									desc: "Full product catalog & payment gateway integration.",
									icon: ShoppingBag,
								},
							].map((item) => {
								const Icon = item.icon;
								const isSelected = type === item.id;
								return (
									<button
										key={item.id}
										type="button"
										onClick={() => setType(item.id as any)}
										className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
											isSelected
												? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20"
												: "border-gray-200/80 bg-white hover:border-gray-300"
										}`}>
										<div>
											<div className="flex items-center justify-between mb-3">
												<div
													className={`w-9 h-9 rounded-xl flex items-center justify-center ${
														isSelected
															? "bg-blue-600 text-white"
															: "bg-gray-100 text-gray-600"
													}`}>
													<Icon className="w-4 h-4" />
												</div>
												{isSelected && (
													<CheckCircle2 className="w-5 h-5 text-blue-600" />
												)}
											</div>
											<h3 className="text-sm font-bold text-gray-900 mb-1">
												{item.title}
											</h3>
											<p className="text-xs font-extrabold text-blue-600 mb-2">
												{item.price}
											</p>
											<p className="text-[11px] text-gray-500 leading-relaxed font-medium">
												{item.desc}
											</p>
										</div>
									</button>
								);
							})}
						</div>
					</div>

					{/* Action Submit Button */}
					<div className="flex items-center justify-end gap-4 pt-4">
						<Link
							href="/dashboard"
							className="px-6 py-3 rounded-full border border-gray-200/90 text-gray-600 hover:bg-gray-100 text-xs font-bold transition-colors">
							Cancel
						</Link>

						<PillButton
							type="submit"
							disabled={isLoading}
							baseColor="#004ac6"
							circleColor="#ffffff"
							textColor="#ffffff"
							hoverTextColor="#004ac6"
							useThunderFont={true}
							className="px-8 py-3 rounded-full font-bold text-xs border border-blue-600 shadow-md">
							{isLoading ? (
								<span className="inline-flex items-center gap-2">
									<Loader2 className="w-4 h-4 animate-spin" />
									<span>Provisioning...</span>
								</span>
							) : (
								<span>Provision Site Project</span>
							)}
						</PillButton>
					</div>
				</form>
			</div>
		</div>
	);
}
