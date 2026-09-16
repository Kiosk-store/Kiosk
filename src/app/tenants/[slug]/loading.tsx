/** @format */

import React from "react";

export default function TenantLoading() {
	return (
		<div
			role="status"
			aria-label="Loading website"
			className="fixed inset-0 z-[99999] flex items-center justify-center bg-white select-none">
			<div className="flex flex-col items-center justify-center gap-3 p-4">
				<div className="w-10 h-10 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
			</div>
		</div>
	);
}
