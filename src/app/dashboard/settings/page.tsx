/** @format */

"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Bell, CheckCircle2, Loader2, AlertCircle, Building } from "lucide-react";
import PillButton from "@/components/PillButton";
import { useAuth } from "@/context/AuthContext";

export const dynamic = "force-dynamic";

type SettingsTab = "profile" | "security" | "notifications";

export default function SettingsPage() {
	const { user, refreshUser } = useAuth();
	const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
	const [isLoading, setIsLoading] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [toastMsg, setToastMsg] = useState("Updated");
	const [error, setError] = useState<string | null>(null);

	// Profile Form State
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [company, setCompany] = useState("");
	const [image, setImage] = useState<string | null>(null);
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
	const avatarInputRef = React.useRef<HTMLInputElement>(null);

	// Security Form State
	const [currentPass, setCurrentPass] = useState("");
	const [newPass, setNewPass] = useState("");
	const [confirmPass, setConfirmPass] = useState("");

	// Notification Toggles State
	const [emailNotifs, setEmailNotifs] = useState(true);
	const [projectUpdates, setProjectUpdates] = useState(true);

	// Fetch existing user & tenant details from DB on mount
	useEffect(() => {
		async function loadSettings() {
			try {
				const res = await fetch("/api/user/profile");
				if (res.ok) {
					const data = await res.json();
					if (data.user) {
						if (data.user.name) setName(data.user.name);
						if (data.user.email) setEmail(data.user.email);
						if (data.user.phone) setPhone(data.user.phone);
						if (data.user.image) setImage(data.user.image);
						if (data.user.emailNotifications !== undefined) {
							setEmailNotifs(data.user.emailNotifications);
						}
						if (data.user.projectUpdates !== undefined) {
							setProjectUpdates(data.user.projectUpdates);
						}
					}
					if (data.tenant?.name || data.tenant?.company) {
						setCompany(data.tenant.name || data.tenant.company);
					}
				} else if (user) {
					if (user.name) setName(user.name || "");
					if (user.email) setEmail(user.email || "");
					if (user.phone) setPhone(user.phone || "");
					if (user.image) setImage(user.image || null);
					if (user.emailNotifications !== undefined) {
						setEmailNotifs(user.emailNotifications);
					}
					if (user.projectUpdates !== undefined) {
						setProjectUpdates(user.projectUpdates);
					}
				}
			} catch (err) {
				console.error("[FETCH_SETTINGS_ERROR]", err);
			}
		}

		loadSettings();
	}, [user]);

	const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploadingAvatar(true);
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("folder", "kiosk/avatars");

			const res = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (res.ok) {
				const data = await res.json();
				if (data.file?.url) {
					setImage(data.file.url);
					await fetch("/api/user/profile", {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ image: data.file.url }),
					});
					await refreshUser();
					setToastMsg("Updated");
					setIsSaved(true);
					setTimeout(() => setIsSaved(false), 3000);
				}
			}
		} catch (err) {
			console.error("[AVATAR_UPLOAD_ERROR]", err);
		} finally {
			setIsUploadingAvatar(false);
		}
	};

	const displayName = user?.name || name || user?.email?.split("@")[0] || "User";
	const initials = displayName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	// Save Profile & Company Settings
	const handleSaveProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			const res = await fetch("/api/user/profile", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: name || undefined,
					company: company || undefined,
					phone: phone ?? "",
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Failed to save settings.");
				setIsLoading(false);
				return;
			}

			// Update persistent cache
			try {
				localStorage.setItem(
					"@kiosk/user_settings",
					JSON.stringify({ name, phone, company, email }),
				);
			} catch (err) {
				console.error("[LOCAL_STORAGE_WRITE_ERROR]", err);
			}

			await refreshUser();
			setIsLoading(false);
			setToastMsg("Updated");
			setIsSaved(true);
			setTimeout(() => {
				setIsSaved(false);
			}, 3000);
		} catch (err) {
			console.error("[PROFILE_SAVE_ERROR]", err);
			setError("Failed to update profile settings.");
			setIsLoading(false);
		}
	};

	// Save Password
	const handleSavePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		if (newPass !== confirmPass) {
			setError("New password and confirmation do not match.");
			setIsLoading(false);
			return;
		}

		try {
			const res = await fetch("/api/user/password", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					currentPassword: currentPass,
					newPassword: newPass,
					confirmPassword: confirmPass,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Failed to update password.");
				setIsLoading(false);
				return;
			}

			setCurrentPass("");
			setNewPass("");
			setConfirmPass("");
			setIsLoading(false);
			setToastMsg("Updated");
			setIsSaved(true);
			setTimeout(() => {
				setIsSaved(false);
			}, 3000);
		} catch (err) {
			console.error("[PASSWORD_SAVE_ERROR]", err);
			setError("An unexpected error occurred while updating password.");
			setIsLoading(false);
		}
	};

	// Save Notification Preferences
	const handleSaveNotifications = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			const res = await fetch("/api/user/profile", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					emailNotifications: emailNotifs,
					projectUpdates: projectUpdates,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Failed to save notification preferences.");
				setIsLoading(false);
				return;
			}

			await refreshUser();
			setIsLoading(false);
			setToastMsg("Updated");
			setIsSaved(true);
			setTimeout(() => {
				setIsSaved(false);
			}, 3000);
		} catch (err) {
			console.error("[NOTIFICATIONS_SAVE_ERROR]", err);
			setError("Failed to update notification preferences.");
			setIsLoading(false);
		}
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
						Manage your workspace profile, security credentials, and preferences.
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
								onClick={() => {
									setActiveTab(tab.id as SettingsTab);
									setError(null);
								}}
								className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
									isActive
										? "border-blue-600 text-blue-600 font-bold"
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
					<div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200">
						<CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
						<span>{toastMsg}</span>
					</div>
				)}

				{/* Error Notification */}
				{error && (
					<div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200">
						<AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
						<span>{error}</span>
					</div>
				)}

				{/* Tab 1: Profile Info */}
				{activeTab === "profile" && (
					<form
						onSubmit={handleSaveProfile}
						className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
						{/* Avatar Header */}
						<div className="flex items-center gap-4 pb-6 border-b border-gray-100">
							<input
								ref={avatarInputRef}
								type="file"
								accept="image/*"
								onChange={handleAvatarUpload}
								className="hidden"
							/>
							<div
								onClick={() => avatarInputRef.current?.click()}
								className="relative group cursor-pointer shrink-0">
								{image || user?.image ? (
									<img
										src={image || user?.image || ""}
										alt={displayName}
										className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-600/30 shadow-xs group-hover:opacity-75 transition-opacity"
									/>
								) : (
									<div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors">
										{initials}
									</div>
								)}
								<div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
									{isUploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : "Change"}
								</div>
							</div>
							<div>
								<h3 className="text-base font-bold text-gray-900">
									{displayName}
								</h3>
								<p className="text-xs text-gray-400 font-medium mt-0.5">
									{user?.role === "ADMIN" ? "Administrator" : "Account Owner"}
								</p>
								<button
									type="button"
									onClick={() => avatarInputRef.current?.click()}
									className="text-[11px] font-bold text-blue-600 hover:text-blue-700 mt-1 cursor-pointer">
									{isUploadingAvatar ? "Uploading photo..." : "Upload Profile Photo"}
								</button>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							{/* Full Name */}
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
										placeholder="e.g. John Doe"
										className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-gray-400"
									/>
								</div>
							</div>

							{/* Email Address */}
							<div>
								<label className="block text-xs font-semibold text-gray-700 mb-1.5">
									Email Address
								</label>
								<div className="relative">
									<Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
									<input
										type="email"
										disabled
										value={email}
										placeholder="e.g. user@kioosk.online"
										className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-500 bg-gray-50 cursor-not-allowed placeholder:text-gray-400"
									/>
								</div>
							</div>

							{/* Phone Number */}
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
										placeholder="e.g. +234 800 000 0000"
										className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-gray-400"
									/>
								</div>
							</div>

							{/* Company / Workspace Name */}
							<div>
								<label className="block text-xs font-semibold text-gray-700 mb-1.5">
									Company / Workspace Name
								</label>
								<div className="relative">
									<Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
									<input
										type="text"
										value={company}
										onChange={(e) => setCompany(e.target.value)}
										placeholder="e.g. Kiosk Enterprise Store"
										className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-gray-400"
									/>
								</div>
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
						onSubmit={handleSavePassword}
						className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
						<h3 className="text-base font-bold font-nohemi text-gray-900 pb-4 border-b border-gray-100">
							Update Password
						</h3>

						<div className="space-y-4 max-w-md">
							<div>
								<label className="block text-xs font-semibold text-gray-700 mb-1.5">
									Current Password
								</label>
								<input
									type="password"
									required
									value={currentPass}
									onChange={(e) => setCurrentPass(e.target.value)}
									placeholder="••••••••••••"
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-gray-400"
								/>
							</div>

							<div>
								<label className="block text-xs font-semibold text-gray-700 mb-1.5">
									New Password
								</label>
								<input
									type="password"
									required
									value={newPass}
									onChange={(e) => setNewPass(e.target.value)}
									placeholder="••••••••••••"
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-gray-400"
								/>
							</div>

							<div>
								<label className="block text-xs font-semibold text-gray-700 mb-1.5">
									Confirm New Password
								</label>
								<input
									type="password"
									required
									value={confirmPass}
									onChange={(e) => setConfirmPass(e.target.value)}
									placeholder="••••••••••••"
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200/90 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-gray-400"
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
										<span>Updating Password...</span>
									</span>
								) : (
									<span>Update Password</span>
								)}
							</PillButton>
						</div>
					</form>
				)}

				{/* Tab 3: Notifications */}
				{activeTab === "notifications" && (
					<form
						onSubmit={handleSaveNotifications}
						className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
						<h3 className="text-base font-bold font-nohemi text-gray-900 pb-4 border-b border-gray-100">
							Email Preferences
						</h3>

						<div className="space-y-4 max-w-lg">
							<div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
								<div>
									<h4 className="text-xs font-bold text-gray-900">Email Notifications</h4>
									<p className="text-[11px] text-gray-500">Receive email alerts for project builds and invoice updates.</p>
								</div>
								<input
									type="checkbox"
									checked={emailNotifs}
									onChange={(e) => setEmailNotifs(e.target.checked)}
									className="w-4 h-4 text-blue-600 rounded cursor-pointer"
								/>
							</div>

							<div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
								<div>
									<h4 className="text-xs font-bold text-gray-900">Project Status Updates</h4>
									<p className="text-[11px] text-gray-500">Receive real-time progress updates when developers ship custom features.</p>
								</div>
								<input
									type="checkbox"
									checked={projectUpdates}
									onChange={(e) => setProjectUpdates(e.target.checked)}
									className="w-4 h-4 text-blue-600 rounded cursor-pointer"
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
									<span>Save Notification Settings</span>
								)}
							</PillButton>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
