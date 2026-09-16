/** @format */

"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
	const [visible, setVisible] = useState(false);

	const visibleRef = React.useRef(false);
	const rafRef = React.useRef<number | null>(null);

	useEffect(() => {
		const toggleVisibility = () => {
			if (rafRef.current !== null) return;
			rafRef.current = requestAnimationFrame(() => {
				rafRef.current = null;
				const shouldShow = window.scrollY > 300;
				if (shouldShow !== visibleRef.current) {
					visibleRef.current = shouldShow;
					setVisible(shouldShow);
				}
			});
		};

		toggleVisibility();
		window.addEventListener("scroll", toggleVisibility, { passive: true });
		return () => {
			window.removeEventListener("scroll", toggleVisibility);
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
			}
		};
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
			className="fixed bottom-[max(1.5rem,calc(env(safe-area-inset-bottom,0px)+1rem))] right-[max(1.25rem,env(safe-area-inset-right,0px))] z-40 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-blue-600 text-white backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center transition-all duration-300 group hover:scale-110 active:scale-95 cursor-pointer animate-in fade-in zoom-in-90 touch-manipulation">
			<ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
		</button>
	);
}
