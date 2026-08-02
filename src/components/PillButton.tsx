/** @format */

"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export interface PillButtonProps extends React.HTMLAttributes<HTMLElement> {
	href?: string;
	className?: string;
	children?: React.ReactNode;
	// Optional color overrides
	baseColor?: string; // Button background
	circleColor?: string; // Hover circle color
	textColor?: string; // Normal text
	hoverTextColor?: string; // Text color on hover
}

const PillButton: React.FC<PillButtonProps> = ({
	href,
	className = "",
	children,
	baseColor = "#120F17",
	circleColor = "#ffffff",
	textColor = "#ffffff",
	hoverTextColor = "#120F17",
	...rest
}) => {
	const rootRef = useRef<HTMLElement | null>(null);
	const circleRef = useRef<HTMLSpanElement | null>(null);
	const labelRef = useRef<HTMLSpanElement | null>(null);
	const hoverLabelRef = useRef<HTMLSpanElement | null>(null);
	const tlRef = useRef<gsap.core.Timeline | null>(null);

	useEffect(() => {
		const root = rootRef.current;
		const circle = circleRef.current;
		if (!root || !circle) return;

		const layout = () => {
			const rect = root.getBoundingClientRect();
			const { width: w, height: h } = rect;

			// Calculate circle size so it fully covers the button
			const R = ((w * w) / 4 + h * h) / (2 * h);
			const D = Math.ceil(2 * R) + 2;
			const delta =
				Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
			const originY = D - delta;

			circle.style.width = `${D}px`;
			circle.style.height = `${D}px`;
			circle.style.bottom = `-${delta}px`;
			circle.style.background = circleColor;

			gsap.set(circle, {
				xPercent: -50,
				scale: 0,
				transformOrigin: `50% ${originY}px`,
			});

			if (labelRef.current) {
				gsap.set(labelRef.current, { y: 0, color: textColor });
			}
			if (hoverLabelRef.current) {
				gsap.set(hoverLabelRef.current, {
					y: h + 20,
					opacity: 0,
					color: hoverTextColor,
				});
			}

			// Kill previous timeline
			tlRef.current?.kill();

			const tl = gsap.timeline({ paused: true });

			// Circle expands
			tl.to(
				circle,
				{
					scale: 1.2,
					duration: 0.55,
					ease: "power3.out",
				},
				0,
			);

			// Original text slides up
			if (labelRef.current) {
				tl.to(
					labelRef.current,
					{
						y: -(h + 10),
						duration: 0.55,
						ease: "power3.out",
					},
					0,
				);
			}

			// Hover text slides in
			if (hoverLabelRef.current) {
				tl.to(
					hoverLabelRef.current,
					{
						y: 0,
						opacity: 1,
						duration: 0.55,
						ease: "power3.out",
					},
					0,
				);
			}

			tlRef.current = tl;
		};

		layout();

		// Re-run after paint & fonts
		requestAnimationFrame(layout);
		const timeout = setTimeout(layout, 60);

		window.addEventListener("resize", layout);
		if (document.fonts) {
			document.fonts.ready.then(layout).catch(() => {});
		}

		return () => {
			window.removeEventListener("resize", layout);
			clearTimeout(timeout);
			tlRef.current?.kill();
		};
	}, [baseColor, circleColor, textColor, hoverTextColor, children]);

	const handleEnter = () => {
		const tl = tlRef.current;
		if (!tl) return;
		tl.tweenTo(tl.duration(), {
			duration: 0.3,
			ease: "power3.out",
			overwrite: "auto",
		});
	};

	const handleLeave = () => {
		const tl = tlRef.current;
		if (!tl) return;
		tl.tweenTo(0, {
			duration: 0.22,
			ease: "power3.out",
			overwrite: "auto",
		});
	};

	const baseClasses = `
    relative inline-flex items-center justify-center
    h-12 px-8 rounded-full
    font-semibold text-[15px] uppercase tracking-wide
    overflow-hidden cursor-pointer select-none
    transition-none
    pill-fallback ${className}
  `;

	const content = (
		<>
			{/* Expanding Circle */}
			<span
				ref={circleRef}
				className="hover-circle absolute left-1/2 bottom-0 rounded-full pointer-events-none z-[1] block"
				style={{ willChange: "transform, opacity" }}
				aria-hidden
			/>

			{/* Text Stack */}
			<span className="relative inline-block leading-none z-[2]">
				<span
					ref={labelRef}
					className="btn-label inline-block z-[2]"
					style={{ willChange: "transform" }}>
					{children}
				</span>
				<span
					ref={hoverLabelRef}
					className="btn-label-hover absolute left-0 top-0 inline-block z-[3]"
					style={{ willChange: "transform, opacity" }}
					aria-hidden>
					{children}
				</span>
			</span>
		</>
	);

	// split out style from rest so we can pass explicit props with correct ref types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { style: restStyle, ...restProps } = rest as any;

	if (href) {
		return (
			<a
				href={href}
				ref={(el: HTMLAnchorElement | null) => {
					rootRef.current = el as HTMLElement | null;
				}}
				onMouseEnter={handleEnter}
				onMouseLeave={handleLeave}
				className={baseClasses}
				style={{ backgroundColor: baseColor, ...(restStyle || {}) }}
				{...restProps}>
				{content}
			</a>
		);
	}

	return (
		<button
			type="button"
			ref={(el: HTMLButtonElement | null) => {
				rootRef.current = el as HTMLElement | null;
			}}
			onMouseEnter={handleEnter}
			onMouseLeave={handleLeave}
			className={baseClasses}
			style={{ backgroundColor: baseColor, ...(restStyle || {}) }}
			{...restProps}>
			{content}
		</button>
	);
};

export default PillButton;
