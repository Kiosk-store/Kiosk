/** @format */

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import PillButton from "@/components/PillButton";
import { Logger } from "@/lib/logger";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		Logger.error("Unhandled Global Error Boundary Caught Exception", error);
	}, [error]);

	return (
		<html>
			<body className="min-h-screen w-full bg-[#f8fafc] text-slate-900 flex flex-col items-center justify-center p-6 select-none font-sans">
				<div className="bg-white border border-gray-200/90 rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl">
					<div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
						<AlertTriangle className="w-8 h-8" />
					</div>

					<div>
						<span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
							Application Error
						</span>
						<h1 className="text-2xl sm:text-3xl font-bold font-nohemi text-gray-900 mt-3">
							Something went wrong
						</h1>
						<p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">
							An unexpected application error occurred. Our team has been notified via automated telemetry.
						</p>
					</div>

					{error.digest && (
						<p className="text-[11px] font-mono text-gray-400 bg-gray-50 p-2 rounded-xl border border-gray-100">
							Digest Code: {error.digest}
						</p>
					)}

					<div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
						<button
							type="button"
							onClick={() => reset()}
							className="w-full sm:w-auto px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md">
							<RefreshCw className="w-4 h-4" />
							<span>Try Again</span>
						</button>

						<Link
							href="/dashboard"
							className="w-full sm:w-auto px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors flex items-center justify-center gap-2">
							<Home className="w-4 h-4" />
							<span>Back to Dashboard</span>
						</Link>
					</div>
				</div>
			</body>
		</html>
	);
}
