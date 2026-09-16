/** @format */

"use client";

import React, { useEffect, useState } from "react";

export default function PageLoader() {
	const [isLoading, setIsLoading] = useState(true);
	const [isMounted, setIsMounted] = useState(true);

	useEffect(() => {
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
	}, []);

	if (!isMounted) return null;

	return (
		<div
			aria-hidden={!isLoading}
			className={`fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-opacity duration-500 ease-out select-none ${
				isLoading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
			}`}>
			<div className="flex flex-col items-center justify-center p-4">
				<img
					src="/KIOSK PNG2.png"
					alt="Kiosk"
					className="h-10 sm:h-12 md:h-14 w-auto max-w-[220px] object-contain animate-pulse"
				/>
			</div>
		</div>
	);
}
