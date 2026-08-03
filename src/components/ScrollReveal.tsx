/**
 * ScrollReveal Component
 *
 * Smooth scroll-driven entry animations using IntersectionObserver.
 * Triggers fade & slide transforms when elements enter the viewport.
 *
 * @format
 */

"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
	children: React.ReactNode;
	className?: string;
	direction?: "up" | "down" | "left" | "right" | "fade";
	delay?: number; // Delay in milliseconds
	duration?: number; // Duration in milliseconds
	threshold?: number; // Intersection threshold ratio (0 to 1)
}

export default function ScrollReveal({
	children,
	className = "",
	direction = "up",
	delay = 0,
	duration = 800,
	threshold = 0.05,
}: ScrollRevealProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					if (ref.current) {
						observer.unobserve(ref.current);
					}
				}
			},
			{
				threshold,
				rootMargin: "0px 0px -80px 0px", // Triggers just before coming into view
			}
		);

		const currentRef = ref.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, [threshold]);

	const getDirectionStyles = () => {
		switch (direction) {
			case "up":
				return isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16";
			case "down":
				return isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-16";
			case "left":
				return isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16";
			case "right":
				return isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16";
			case "fade":
				return isVisible ? "opacity-100" : "opacity-0";
			default:
				return "";
		}
	};

	return (
		<div
			ref={ref}
			className={`${className} transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${getDirectionStyles()}`}
			style={{
				transitionDuration: `${duration}ms`,
				transitionDelay: `${delay}ms`,
			}}
		>
			{children}
		</div>
	);
}
