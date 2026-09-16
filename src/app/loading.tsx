/** @format */

import React from "react";

export default function Loading() {
	return (
		<div
			role="status"
			aria-label="Loading page"
			className="fixed inset-0 z-[99999] flex items-center justify-center bg-white select-none">
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
