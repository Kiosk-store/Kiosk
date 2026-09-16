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
	duration = 500,
	threshold = 0.02,
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
				rootMargin: "0px 0px 60px 0px", // Eager trigger so elements don't feel delayed on mobile
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
				return isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3";
			case "down":
				return isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3";
			case "left":
				return isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3";
			case "right":
				return isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3";
			case "fade":
				return isVisible ? "opacity-100" : "opacity-0";
			default:
				return "";
		}
	};

	return (
		<div
			ref={ref}
			className={`${className} transition-[opacity,transform] ease-[cubic-bezier(0.16,1,0.3,1)] ${getDirectionStyles()}`}
			style={{
				transitionDuration: `${duration}ms`,
				transitionDelay: `${delay}ms`,
				willChange: "transform, opacity",
				transform: "translateZ(0)",
				WebkitTransform: "translateZ(0)",
			}}
		>
			{children}
		</div>
	);
}
