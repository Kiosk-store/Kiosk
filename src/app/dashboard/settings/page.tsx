/** @format */

"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Lock, Bell, CheckCircle2, Loader2 } from "lucide-react";
import PillButton from "@/components/PillButton";

type SettingsTab = "profile" | "security" | "notifications";

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
	const [isLoading, setIsLoading] = useState(false);
	const [isSaved, setIsSaved] = useState(false);

	// Profile Form
	const [name, setName] = useState("Jeremiah Victor");
	const [email, setEmail] = useState("jeremiah@kiosk.com");
	const [phone, setPhone] = useState("+1 (555) 234-5678");
	const [company, setCompany] = useState("Kiosk Tech Inc.");

	// Security Form
	const [currentPass, setCurrentPass] = useState("");
	const [newPass, setNewPass] = useState("");
	const [confirmPass, setConfirmPass] = useState("");
	const [twoFactor, setTwoFactor] = useState(false);

	// Notification Toggles
	const [emailNotifs, setEmailNotifs] = useState(true);
	const [projectUpdates, setProjectUpdates] = useState(true);
	const [marketingEmails, setMarketingEmails] = useState(false);

	const handleSave = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			setIsSaved(true);
			setTimeout(() => {
				setIsSaved(false);
			}, 3000);
		}, 1000);
	};

	return (
		<div className="w-full min-h-screen bg-[#f8fafc]">
			{/* Main Container */}
			<div className="px-4 sm:px-6 lg:px-8 pt-10 pb-16 max-w-[1000px] mx-auto">
				{/* Page Header */}
				<div className="pb-6 border-b border-gray-200/80 mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 tracking-tight mb-1">
						Account Settings
					</h1>
					<p className="text-gray-500 text-sm font-medium">
						Manage your personal profile, security preferences, and email notifications.
					</p>
				</div>

				{/* Settings Tabs */}
				<div className="flex items-center gap-2 border-b border-gray-200/80 mb-8">
					{[
						{ id: "profile", label: "Profile Info", icon: User },
						{ id: "security", label: "Security", icon: Lock },
						{ id: "notifications", label: "Notifications", icon: Bell },
					].map((tab) => {
						const Icon = tab.icon;
						const isActive = activeTab === tab.id;
						return (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id as SettingsTab)}
								className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
									isActive
										? "border-blue-600 text-blue-600"
										: "border-transparent text-gray-500 hover:text-gray-900"
								}`}>
								<Icon className="w-4 h-4" />
								<span>{tab.label}</span>
							</button>
						);
					})}
				</div>

				{/* Save Toast Notification */}
				{isSaved && (
					<div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200">
						<CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
						<span>Your settings have been saved successfully.</span>
					</div>
				)}

				{/* Tab 1: Profile Info */}
				{activeTab === "profile" && (
					<form
						onSubmit={handleSave}
						className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
						{/* Avatar Header */}
						<div className="flex items-center gap-4 pb-6 border-b border-gray-100">
							<div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-xs">
								JV
							</div>
							<div>
								<h3 className="text-base font-bold text-gray-900">
									Jeremiah Victor
								</h3>
								<p className="text-xs text-gray-400 font-medium mt-0.5">
									Account Owner
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							<div>
								<label className="block text-xs font-semibold text-gray-700 mb-1.5">
									Full Name
								</label>
								<div className="relative">
									<User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
									<input
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
										className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
									/>
								</div>
							</div>

							<div>
								<label className="block text-xs font-semibold text-gray-700 mb-1.5">
									Email Address
								</label>
								<div className="relative">
									<Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
									/>
								</div>
							</div>

							<div>
								<label className="block text-xs font-semibold text-gray-700 mb-1.5">
									Phone Number
								</label>
								<div className="relative">
									<Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
									<input
										type="text"
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
										className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
									/>
								</div>
							</div>

							<div>
								<label className="block text-xs font-semibold text-gray-700 mb-1.5">
									Company Name
								</label>
								<input
									type="text"
									value={company}
									onChange={(e) => setCompany(e.target.value)}
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
								/>
							</div>
						</div>

						<div className="pt-4 flex justify-end">
							<PillButton
								type="submit"
								disabled={isLoading}
								baseColor="#004ac6"
								circleColor="#ffffff"
								textColor="#ffffff"
								hoverTextColor="#004ac6"
								useThunderFont={true}
								className="px-6 py-2.5 rounded-full font-bold text-xs border border-blue-600 shadow-md">
								{isLoading ? (
									<span className="inline-flex items-center gap-2">
										<Loader2 className="w-3.5 h-3.5 animate-spin" />
										<span>Saving...</span>
									</span>
								) : (
									<span>Save Changes</span>
								)}
							</PillButton>
						</div>
					</form>
				)}

				{/* Tab 2: Security */}
				{activeTab === "security" && (
					<form
						onSubmit={handleSave}
						className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
						<h3 className="text-base font-bold font-nohemi text-gray-900 pb-4 border-b border-gray-100">
							Change Password
						</h3>

						<div className="space-y-4 max-w-md">
							<div>
								<label className="block text-xs font-semibold text-gray-700 mb-1.5">
									Current Password
								</label>
								<input
									type="password"
									value={currentPass}
									onChange={(e) => setCurrentPass(e.target.value)}
									placeholder="••••••••••••"
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
								/>
							</div>

							<div>
								<label className="block text-xs font-semibold text-gray-700 mb-1.5">
									New Password
								</label>
								<input
									type="password"
									value={newPass}
									onChange={(e) => setNewPass(e.target.value)}
									placeholder="••••••••••••"
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
								/>
							</div>

							<div>
								<label className="block text-xs font-semibold text-gray-700 mb-1.5">
									Confirm New Password
								</label>
								<input
									type="password"
									value={confirmPass}
									onChange={(e) => setConfirmPass(e.target.value)}
									placeholder="••••••••••••"
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
								/>
							</div>
						</div>

						{/* 2FA Toggle */}
						<div className="pt-6 border-t border-gray-100 flex items-center justify-between">
							<div>
								<h4 className="text-sm font-bold text-gray-900">
									Two-Factor Authentication (2FA)
								</h4>
								<p className="text-xs text-gray-500 font-medium mt-0.5">
									Add an extra layer of security to your account.
								</p>
							</div>

							<button
								type="button"
								onClick={() => setTwoFactor(!twoFactor)}
								className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
									twoFactor ? "bg-blue-600" : "bg-gray-200"
								}`}>
								<div
									className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
										twoFactor ? "translate-x-5" : "translate-x-0"
									}`}
								/>
							</button>
						</div>

						<div className="pt-4 flex justify-end">
							<PillButton
								type="submit"
								disabled={isLoading}
								baseColor="#004ac6"
								circleColor="#ffffff"
								textColor="#ffffff"
								hoverTextColor="#004ac6"
								useThunderFont={true}
								className="px-6 py-2.5 rounded-full font-bold text-xs border border-blue-600 shadow-md">
								{isLoading ? (
									<span className="inline-flex items-center gap-2">
										<Loader2 className="w-3.5 h-3.5 animate-spin" />
										<span>Updating...</span>
									</span>
								) : (
									<span>Update Security</span>
								)}
							</PillButton>
						</div>
					</form>
				)}

				{/* Tab 3: Notifications */}
				{activeTab === "notifications" && (
					<form
						onSubmit={handleSave}
						className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
						<h3 className="text-base font-bold font-nohemi text-gray-900 pb-4 border-b border-gray-100">
							Email Preferences
						</h3>

						<div className="space-y-5">
							{/* Toggle 1 */}
							<div className="flex items-center justify-between">
								<div>
									<h4 className="text-sm font-bold text-gray-900">
										Email Notifications
									</h4>
									<p className="text-xs text-gray-500 font-medium mt-0.5">
										Receive important account & security notices.
									</p>
								</div>
								<button
									type="button"
									onClick={() => setEmailNotifs(!emailNotifs)}
									className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
										emailNotifs ? "bg-blue-600" : "bg-gray-200"
									}`}>
									<div
										className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
											emailNotifs ? "translate-x-5" : "translate-x-0"
										}`}
									/>
								</button>
							</div>

							{/* Toggle 2 */}
							<div className="flex items-center justify-between pt-4 border-t border-gray-100">
								<div>
									<h4 className="text-sm font-bold text-gray-900">
										Project Progress Updates
									</h4>
									<p className="text-xs text-gray-500 font-medium mt-0.5">
										Get notified when our team makes updates to your site.
									</p>
								</div>
								<button
									type="button"
									onClick={() => setProjectUpdates(!projectUpdates)}
									className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
										projectUpdates ? "bg-blue-600" : "bg-gray-200"
									}`}>
									<div
										className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
											projectUpdates ? "translate-x-5" : "translate-x-0"
										}`}
									/>
								</button>
							</div>

							{/* Toggle 3 */}
							<div className="flex items-center justify-between pt-4 border-t border-gray-100">
								<div>
									<h4 className="text-sm font-bold text-gray-900">
										Product News & Offers
									</h4>
									<p className="text-xs text-gray-500 font-medium mt-0.5">
										Receive occasional news about new features & design templates.
									</p>
								</div>
								<button
									type="button"
									onClick={() => setMarketingEmails(!marketingEmails)}
									className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
										marketingEmails ? "bg-blue-600" : "bg-gray-200"
									}`}>
									<div
										className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
											marketingEmails ? "translate-x-5" : "translate-x-0"
										}`}
									/>
								</button>
							</div>
						</div>

						<div className="pt-4 flex justify-end">
							<PillButton
								type="submit"
								disabled={isLoading}
								baseColor="#004ac6"
								circleColor="#ffffff"
								textColor="#ffffff"
								hoverTextColor="#004ac6"
								useThunderFont={true}
								className="px-6 py-2.5 rounded-full font-bold text-xs border border-blue-600 shadow-md">
								{isLoading ? (
									<span className="inline-flex items-center gap-2">
										<Loader2 className="w-3.5 h-3.5 animate-spin" />
										<span>Saving...</span>
									</span>
								) : (
									<span>Save Preferences</span>
								)}
							</PillButton>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
