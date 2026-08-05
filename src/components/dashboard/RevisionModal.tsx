/** @format */

"use client";

import React, { useState } from "react";
import { X, CheckCircle2, MessageSquare, Loader2, Send } from "lucide-react";
import PillButton from "@/components/PillButton";

interface RevisionModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectName?: string;
}

export default function RevisionModal({
	isOpen,
	onClose,
	projectName = "My Business Page",
}: RevisionModalProps) {
	const [category, setCategory] = useState("Hero & Headlines");
	const [notes, setNotes] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!notes.trim()) return;
		setIsSubmitting(true);
		setTimeout(() => {
			setIsSubmitting(false);
			setIsSubmitted(true);
			setTimeout(() => {
				setIsSubmitted(false);
				setNotes("");
				onClose();
			}, 2000);
		}, 1000);
	};

	const categories = [
		"Hero & Headlines",
		"Color Scheme",
		"Images & Media",
		"Layout & Spacing",
		"Mobile Optimization",
		"Other Revisions",
	];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
			<div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
					<X className="w-5 h-5" />
				</button>

				{/* Header */}
				<div className="flex items-center gap-3 pb-5 border-b border-gray-100 mb-6">
					<div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
						<MessageSquare className="w-5 h-5" />
					</div>
					<div>
						<h3 className="text-lg font-bold font-nohemi text-gray-900">
							Request a Revision
						</h3>
						<p className="text-xs text-gray-400 font-medium mt-0.5">
							Project: {projectName}
						</p>
					</div>
				</div>

				{isSubmitted ? (
					<div className="py-8 text-center animate-in fade-in duration-200">
						<CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
						<h4 className="text-lg font-bold font-nohemi text-gray-900 mb-1">
							Revision Request Sent!
						</h4>
						<p className="text-xs text-gray-500 font-medium">
							Our design team has received your notes and will apply updates within 24 hours.
						</p>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Category selector */}
						<div>
							<label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
								Select Revision Area
							</label>
							<div className="grid grid-cols-2 gap-2">
								{categories.map((cat) => (
									<button
										key={cat}
										type="button"
										onClick={() => setCategory(cat)}
										className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-colors cursor-pointer ${
											category === cat
												? "border-blue-600 bg-blue-50/60 text-blue-700 font-bold"
												: "border-gray-200/90 bg-white text-gray-700 hover:bg-gray-50"
										}`}>
										{cat}
									</button>
								))}
							</div>
						</div>

						{/* Notes Area */}
						<div>
							<label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
								Detailed Feedback / Notes *
							</label>
							<textarea
								rows={4}
								required
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="Describe the exact changes you'd like us to make (e.g. Change hero headline text, update button color to dark navy)..."
								className="w-full px-4 py-3 rounded-2xl border border-gray-200/90 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 transition-colors leading-relaxed"
							/>
						</div>

						{/* Modal Footer */}
						<div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2.5 rounded-full border border-gray-200/90 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer">
								Cancel
							</button>

							<PillButton
								type="submit"
								disabled={isSubmitting || !notes.trim()}
								baseColor="#004ac6"
								circleColor="#ffffff"
								textColor="#ffffff"
								hoverTextColor="#004ac6"
								useThunderFont={true}
								className="px-6 py-2.5 rounded-full font-bold text-xs border border-blue-600 shadow-md">
								{isSubmitting ? (
									<span className="inline-flex items-center gap-2">
										<Loader2 className="w-3.5 h-3.5 animate-spin" />
										<span>Sending...</span>
									</span>
								) : (
									<span className="inline-flex items-center gap-2">
										<Send className="w-3.5 h-3.5" />
										<span>Submit Request</span>
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
