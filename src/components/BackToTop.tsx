/** @format */

"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.scrollY > 300) {
				setVisible(true);
			} else {
				setVisible(false);
			}
		};

		toggleVisibility();
		window.addEventListener("scroll", toggleVisibility, { passive: true });
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	if (!visible) return null;

	return (
		<button
			type="button"
			onClick={scrollToTop}
			aria-label="Scroll back to top"
			className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-blue-600 text-white backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center transition-all duration-300 group hover:scale-110 active:scale-95 cursor-pointer animate-in fade-in zoom-in-90">
			<ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
		</button>
	);
}
