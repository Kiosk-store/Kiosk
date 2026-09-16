/** @format */

import React from "react";
import { headers } from "next/headers";
import { resolveTenantBranding } from "@/lib/tenantBranding";

export default async function Loading() {
	let isClientSite = false;
	let logoUrl: string | null = null;
	let businessName: string | null = null;

	try {
		const headerList = await headers();
		const host =
			headerList.get("x-forwarded-host") ||
			headerList.get("host") ||
			"";
		if (host) {
			const branding = await resolveTenantBranding(host);
			isClientSite = branding.isClientSite;
			logoUrl = branding.logoUrl || null;
			businessName = branding.businessName || null;
		}
	} catch (e) {
		// Fallback
	}

	return (
		<div
			role="status"
			aria-label="Loading page"
			className="fixed inset-0 z-[99999] flex items-center justify-center bg-white select-none">
			<div className="flex flex-col items-center justify-center p-4">
				{isClientSite ? (
					logoUrl ? (
						<img
							src={logoUrl}
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
