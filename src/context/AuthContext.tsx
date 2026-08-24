/** @format */

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";

export interface UserProfile {
	id: string;
	name: string | null;
	email: string;
	image?: string | null;
	phone?: string | null;
	role: string;
	emailNotifications?: boolean;
	projectUpdates?: boolean;
}

export interface AuthContextType {
	user: UserProfile | null;
	isLoading: boolean;
	error: string | null;
	isPaymentInProgress: boolean;
	setPaymentInProgress: (inProgress: boolean) => void;
	clearError: () => void;
	login: (email: string, password: string) => Promise<boolean>;
	signup: (name: string, email: string, password: string) => Promise<boolean>;
	logout: () => Promise<void>;
	loginWithGoogle: () => Promise<void>;
	loginWithGithub: () => Promise<void>;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isPaymentInProgress, setIsPaymentInProgressState] = useState(false);
	const router = useRouter();

	const setPaymentInProgress = (inProgress: boolean) => {
		setIsPaymentInProgressState(inProgress);
		if (typeof window !== "undefined") {
			if (inProgress) {
				sessionStorage.setItem("kiosk_payment_in_progress", "true");
			} else {
				sessionStorage.removeItem("kiosk_payment_in_progress");
			}
		}
	};

	const checkIsMakingPayment = (): boolean => {
		if (typeof window === "undefined") return false;
		const pathname = window.location.pathname;
		const isPaymentRoute =
			pathname.startsWith("/checkout") ||
			pathname.includes("/billing") ||
			pathname.includes("/payment");
		const hasPaymentStorage = sessionStorage.getItem("kiosk_payment_in_progress") === "true";
		return isPaymentInProgress || isPaymentRoute || hasPaymentStorage;
	};

	const clearError = () => setError(null);

	// Fetch current session on mount and periodic revalidation
	const refreshUser = async () => {
		try {
			setIsLoading(true);
			const res = await fetch("/api/auth/me", { cache: "no-store" });
			if (res.ok) {
				const data = await res.json();
				if (data.authenticated && data.user) {
					setUser(data.user);
				} else {
					handleSessionExpiry();
				}
			} else if (res.status === 401) {
				handleSessionExpiry();
			} else {
				setUser(null);
			}
		} catch (err) {
			console.error("[AUTH_REFRESH_ERROR]", err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSessionExpiry = () => {
		const isMakingPayment = checkIsMakingPayment();
		if (isMakingPayment) {
			// Do NOT log the user out or redirect away while actively in a payment process
			console.warn("[AUTH] Session expired but user is currently in a payment flow. Grace preserved.");
			return;
		}

		setUser((prevUser) => {
			if (prevUser && typeof window !== "undefined") {
				const pathname = window.location.pathname;
				// Auto-redirect to login if on protected routes
				if (pathname.startsWith("/dashboard")) {
					router.push("/get-started?tab=login&expired=true");
				}
			}
			return null;
		});
	};

	useEffect(() => {
		refreshUser();

		// Check session validity periodically every 5 minutes
		const interval = setInterval(() => {
			refreshUser();
		}, 5 * 60 * 1000);

		// Re-validate session when returning to tab/window
		const handleFocus = () => {
			if (document.visibilityState === "visible") {
				refreshUser();
			}
		};

		window.addEventListener("focus", handleFocus);
		document.addEventListener("visibilitychange", handleFocus);

		return () => {
			clearInterval(interval);
			window.removeEventListener("focus", handleFocus);
			document.removeEventListener("visibilitychange", handleFocus);
		};
	}, []);

	// Password Login
	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			setError(null);
			setIsLoading(true);
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				if (res.status === 429) {
					setError("Too many login attempts. Please wait 1 minute before trying again.");
				} else {
					setError(data.error || "Invalid email or password.");
				}
				setIsLoading(false);
				return false;
			}

			setUser(data.user);
			setIsLoading(false);
			router.push("/dashboard");
			return true;
		} catch (err) {
			console.error("[LOGIN_ACTION_ERROR]", err);
			setError("An unexpected network error occurred. Please try again.");
			setIsLoading(false);
			return false;
		}
	};

	// Password Registration
	const signup = async (
		name: string,
		email: string,
		password: string,
	): Promise<boolean> => {
		try {
			setError(null);
			setIsLoading(true);
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				if (res.status === 429) {
					setError("Too many registration attempts. Please wait 1 minute.");
				} else {
					setError(data.error || "Failed to create account.");
				}
				setIsLoading(false);
				return false;
			}

			setUser(data.user);
			setIsLoading(false);
			router.push("/dashboard");
			return true;
		} catch (err) {
			console.error("[SIGNUP_ACTION_ERROR]", err);
			setError("An unexpected network error occurred. Please try again.");
			setIsLoading(false);
			return false;
		}
	};

	// Complete Logout for both Auth.js Google OAuth and custom credentials session
	const logout = async (): Promise<void> => {
		try {
			setIsLoading(true);
			await fetch("/api/auth/logout", { method: "POST" });
			await nextAuthSignOut({ redirect: false });
			setUser(null);
			setIsLoading(false);
			window.location.href = "/get-started";
		} catch (err) {
			console.error("[LOGOUT_ACTION_ERROR]", err);
			setUser(null);
			setIsLoading(false);
			window.location.href = "/get-started";
		}
	};

	// OAuth Logins
	const loginWithGoogle = async (): Promise<void> => {
		await nextAuthSignIn("google", { callbackUrl: "/dashboard" });
	};

	const loginWithGithub = async (): Promise<void> => {
		await nextAuthSignIn("github", { callbackUrl: "/dashboard" });
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				error,
				clearError,
				login,
				signup,
				logout,
				loginWithGoogle,
				loginWithGithub,
				refreshUser,
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
