/** @format */

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export interface PageLoaderProps {
	initialClientLogo?: string | null;
	initialBusinessName?: string | null;
	isClientSite?: boolean;
}

const ROOT_HOSTS = [
	"kioosk.online",
	"www.kioosk.online",
	"kiosk.site",
	"www.kiosk.site",
	"localhost",
	"127.0.0.1",
	"0.0.0.0",
];

export default function PageLoader({
	initialClientLogo = null,
	initialBusinessName = null,
	isClientSite = false,
}: PageLoaderProps) {
	const pathname = usePathname();
	const [isLoading, setIsLoading] = useState(true);
	const [isMounted, setIsMounted] = useState(true);

	const [isClient, setIsClient] = useState(isClientSite);
	const [clientLogo, setClientLogo] = useState<string | null>(initialClientLogo);
	const [businessName, setBusinessName] = useState<string | null>(initialBusinessName);

	useEffect(() => {
		// Client-side detection safety net
		if (typeof window !== "undefined") {
			const host = window.location.hostname.toLowerCase().replace(/:\d+$/, "");
			const isSub =
				!ROOT_HOSTS.includes(host) ||
				pathname.startsWith("/tenants") ||
				pathname.startsWith("/domains");

			if (isSub) {
				setIsClient(true);
			}

			// Check for in-page meta tag if initialClientLogo wasn't passed directly
			if (!clientLogo) {
				const metaLogo = document.querySelector('meta[name="client-logo"]')?.getAttribute("content");
				if (metaLogo) {
					setClientLogo(metaLogo);
				}
			}

			if (!businessName) {
				const metaTitle = document.querySelector('meta[name="client-business-name"]')?.getAttribute("content");
				if (metaTitle) {
					setBusinessName(metaTitle);
				}
			}

			// Dynamically ensure browser tab favicon uses client branding and never Kiosk logo
			if (isSub || isClient) {
				const activeLogo =
					clientLogo || document.querySelector('meta[name="client-logo"]')?.getAttribute("content");
				const activeName =
					businessName ||
					document.querySelector('meta[name="client-business-name"]')?.getAttribute("content") ||
					"";
				const targetFavicon =
					activeLogo ||
					`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23004ac6'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='18' font-weight='bold' font-family='sans-serif'>${encodeURIComponent(activeName.trim().charAt(0).toUpperCase() || "W")}</text></svg>`;

				const existingIcons = document.querySelectorAll("link[rel*='icon']");
				if (existingIcons.length > 0) {
					existingIcons.forEach((el) => {
						(el as HTMLLinkElement).href = targetFavicon;
					});
				} else {
					const link = document.createElement("link");
					link.rel = "icon";
					link.href = targetFavicon;
					document.head.appendChild(link);
				}
			}
		}

		const hideLoader = () => {
			setIsLoading(false);
			// Remove from DOM after fade-out transition completes
			setTimeout(() => {
				setIsMounted(false);
			}, 500);
		};

		if (document.readyState === "complete") {
			// Provide a brief smooth reveal threshold (400ms)
			const timer = setTimeout(hideLoader, 400);
			return () => clearTimeout(timer);
		} else {
			window.addEventListener("load", hideLoader);
			// Safety timeout so the loader never gets stuck indefinitely
			const safetyTimer = setTimeout(hideLoader, 2500);
			return () => {
				window.removeEventListener("load", hideLoader);
				clearTimeout(safetyTimer);
			};
		}
	}, [pathname, clientLogo, businessName]);

	if (!isMounted) return null;

	return (
		<div
			aria-hidden={!isLoading}
			className={`fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-opacity duration-500 ease-out select-none ${
				isLoading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
			}`}>
			<div className="flex flex-col items-center justify-center p-4">
				{isClient ? (
					clientLogo ? (
						<img
							src={clientLogo}
							alt={businessName || "Client Logo"}
							className="h-14 sm:h-18 md:h-20 w-auto max-w-[240px] max-h-[100px] object-contain animate-pulse"
						/>
					) : (
						<div className="flex flex-col items-center gap-3 animate-pulse">
							<div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-xl shadow-md">
								{businessName ? businessName.trim().charAt(0).toUpperCase() : "★"}
							</div>
							{businessName && (
								<p className="font-bold text-sm text-gray-900 tracking-tight text-center max-w-xs">
									{businessName}
								</p>
							)}
						</div>
					)
				) : (
					/* Kiosk platform loader for main marketing site */
					<img
						src="/KIOSK PNG2.png"
						alt="Kiosk"
						className="h-10 sm:h-12 md:h-14 w-auto max-w-[220px] object-contain animate-pulse"
					/>
				)}
			</div>
		</div>
	);
}
