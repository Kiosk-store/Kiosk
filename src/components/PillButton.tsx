/** @format */

"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export type PillButtonProps = {
	href?: string;
	type?: "button" | "submit" | "reset";
	className?: string;
	children?: React.ReactNode;
	baseColor?: string;
	circleColor?: string;
	textColor?: string;
	hoverTextColor?: string;
	useThunderFont?: boolean;
	onClick?: (e: React.MouseEvent<HTMLElement>) => void;
	style?: React.CSSProperties;
	[key: string]: unknown;
};

const PillButton: React.FC<PillButtonProps> = ({
	href,
	className = "",
	children,
	baseColor = "#120F17",
	circleColor = "#ffffff",
	textColor = "#ffffff",
	hoverTextColor = "#120F17",
	type = "button",
	useThunderFont = true,
	...rest
}) => {
	const rootRef = useRef<HTMLElement | null>(null);
	const circleRef = useRef<HTMLSpanElement | null>(null);
	const labelRef = useRef<HTMLSpanElement | null>(null);
	const hoverLabelRef = useRef<HTMLSpanElement | null>(null);
	const tlRef = useRef<gsap.core.Timeline | null>(null);
	const activeTweenRef = useRef<gsap.core.Tween | null>(null);
	const layoutRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		const root = rootRef.current;
		const circle = circleRef.current;
		if (!root || !circle) return;

		const layout = () => {
			if (!rootRef.current || !circleRef.current) return;
			const rect = rootRef.current.getBoundingClientRect();
			const { width: w, height: h } = rect;
			if (!w || !h) return;

			// Calculate circle size matching PillNav geometry
			const R = ((w * w) / 4 + h * h) / (2 * h);
			const D = Math.ceil(2 * R) + 4;
			const delta =
				Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 2;
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
				gsap.set(labelRef.current, {
					y: 0,
					color: textColor,
				});
			}
			if (hoverLabelRef.current) {
				gsap.set(hoverLabelRef.current, {
					y: Math.ceil(h + 12),
					opacity: 0,
					color: hoverTextColor,
				});
			}

			// Kill previous timeline
			tlRef.current?.kill();

			const tl = gsap.timeline({ paused: true });

			// Animation matching PillNav exactly
			tl.to(
				circle,
				{
					scale: 1.25,
					xPercent: -50,
					duration: 1.5,
					ease: "power3.out",
					overwrite: "auto",
				},
				0,
			);

			if (labelRef.current) {
				tl.to(
					labelRef.current,
					{
						y: -(h + 12),
						duration: 1.5,
						ease: "power3.out",
						overwrite: "auto",
					},
					0,
				);
			}

			if (hoverLabelRef.current) {
				tl.to(
					hoverLabelRef.current,
					{
						y: 0,
						opacity: 1,
						duration: 1.5,
						ease: "power3.out",
						overwrite: "auto",
					},
					0,
				);
			}

			tlRef.current = tl;
		};

		layoutRef.current = layout;

		// Initial setup with delay to ensure DOM is ready
		const timeoutId = setTimeout(layout, 60);

		// Re-run on resize
		const resizeObserver = new ResizeObserver(() => {
			layout();
		});

		if (rootRef.current) {
			resizeObserver.observe(rootRef.current);
		}

		window.addEventListener("resize", layout);

		if (document.fonts) {
			document.fonts.ready.then(layout).catch(() => {});
		}

		return () => {
			clearTimeout(timeoutId);
			window.removeEventListener("resize", layout);
			resizeObserver.disconnect();
			tlRef.current?.kill();
			activeTweenRef.current?.kill();
		};
	}, [baseColor, circleColor, textColor, hoverTextColor, children]);

	const handleEnter = () => {
		if (!tlRef.current && layoutRef.current) {
			layoutRef.current();
		}
		const tl = tlRef.current;
		if (!tl) return;
		activeTweenRef.current?.kill();
		activeTweenRef.current = tl.tweenTo(tl.duration(), {
			duration: 0.32,
			ease: "power3.out",
			overwrite: "auto",
		});
	};

	const handleLeave = () => {
		const tl = tlRef.current;
		if (!tl) return;
		activeTweenRef.current?.kill();
		activeTweenRef.current = tl.tweenTo(0, {
			duration: 0.22,
			ease: "power3.out",
			overwrite: "auto",
		});
	};

	const fontStyle: React.CSSProperties = useThunderFont
		? {
				fontFamily:
					'var(--font-thunder-lc), var(--font-thunder), "Thunder", system-ui, -apple-system, sans-serif',
				textTransform: "uppercase",
				letterSpacing: "-0.5px",
			}
		: {};

	const baseClasses = `
    relative inline-flex items-center justify-center
    min-h-[50px] px-7 py-3 rounded-full
    font-bold text-[1.4rem] md:text-[1.55rem] uppercase tracking-[-0.5px] leading-none
    overflow-hidden cursor-pointer select-none
    no-underline box-border whitespace-nowrap
    ${className}
  `;

	const content = (
		<>
			{/* Expanding Circle - matches PillNav */}
			<span
				ref={circleRef}
				className="absolute left-1/2 bottom-0 rounded-full pointer-events-none z-[1] block"
				style={{
					willChange: "transform, opacity",
				}}
				aria-hidden
			/>

			{/* Text Stack - matches PillNav */}
			<span
				className="relative inline-flex items-center justify-center leading-none z-[2] w-full"
				style={fontStyle}>
				<span
					ref={labelRef}
					className="inline-block z-[2] whitespace-nowrap leading-none"
					style={{
						...fontStyle,
						willChange: "transform",
					}}>
					{children}
				</span>
				<span
					ref={hoverLabelRef}
					className="absolute left-0 right-0 top-0 inline-flex items-center justify-center z-[3] whitespace-nowrap leading-none"
					style={{
						...fontStyle,
						willChange: "transform, opacity",
					}}
					aria-hidden>
					{children}
				</span>
			</span>
		</>
	);

	const { style: restStyle, ...restProps } = rest as Record<string, unknown>;

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
				style={{
					backgroundColor: baseColor,
					cursor: "pointer",
					pointerEvents: "auto",
					...fontStyle,
					...(restStyle || {}),
				}}
				{...restProps}>
				{content}
			</a>
		);
	}

	return (
		<button
			type={type}
			ref={(el: HTMLButtonElement | null) => {
				rootRef.current = el as HTMLElement | null;
			}}
			onMouseEnter={handleEnter}
			onMouseLeave={handleLeave}
			className={baseClasses}
			style={{
				backgroundColor: baseColor,
				cursor: "pointer",
				pointerEvents: "auto",
				...fontStyle,
				...(restStyle || {}),
			}}
			{...restProps}>
			{content}
		</button>
	);
};

export default PillButton;
