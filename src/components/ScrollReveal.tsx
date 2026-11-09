/**
 * ScrollReveal Component
 *
 * Smooth scroll-driven entry animations using IntersectionObserver.
 * Optimized with eager rootMargin (500px pre-trigger) to prevent any
 * white/blank screen flashes during fast scrolls on all devices.
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
	duration = 350,
	threshold = 0.01,
}: ScrollRevealProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const currentRef = ref.current;
		if (!currentRef) return;

		// Immediately mark visible if already within or near the visible screen on mount
		const rect = currentRef.getBoundingClientRect();
		if (rect.top < window.innerHeight + 500 && rect.bottom > -300) {
			setIsVisible(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.unobserve(currentRef);
				}
			},
			{
				threshold,
				// Eager 500px pre-trigger: renders and fades content in 500px before
				// entering viewport so high-speed scrolling never reveals blank white space.
				rootMargin: "200px 0px 500px 0px",
			}
		);

		observer.observe(currentRef);

		return () => {
			observer.unobserve(currentRef);
		};
	}, [threshold]);

	const getDirectionStyles = () => {
		switch (direction) {
			case "up":
				return isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5";
			case "down":
				return isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1.5";
			case "left":
				return isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1.5";
			case "right":
				return isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1.5";
			case "fade":
				return isVisible ? "opacity-100" : "opacity-0";
			default:
				return "";
		}
	};

	return (
		<div
			ref={ref}
			className={`${className} transition-[opacity,transform] ease-out ${getDirectionStyles()}`}
			style={{
				transitionDuration: `${duration}ms`,
				transitionDelay: isVisible && delay > 0 ? `${delay}ms` : "0ms",
			}}
		>
			{children}
		</div>
	);
}
