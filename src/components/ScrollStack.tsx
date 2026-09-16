/**
 * ScrollStack
 *
 * A performant, scroll-driven stacked card layout. Cards scale/blur/translate
 * as the user scrolls to create a stacked, depth-like presentation. Works
 * with or without the `lenis` smooth-scroll instance.
 *
 * @format
 */

/** @format */

import React, { useLayoutEffect, useRef, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { lenisStore } from "@/lib/lenis-store";

export interface ScrollStackItemProps {
	itemClassName?: string;
	children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
	children,
	itemClassName = "",
}) => (
	<div
		className={`scroll-stack-card relative w-full ${itemClassName}`.trim()}
		style={{
			backfaceVisibility: "hidden",
			transformStyle: "preserve-3d",
		}}>
		{children}
	</div>
);

interface ScrollStackProps {
	className?: string;
	children: ReactNode;
	itemDistance?: number;
	itemScale?: number;
	itemStackDistance?: number;
	stackPosition?: string;
	scaleEndPosition?: string;
	baseScale?: number;
	scaleDuration?: number;
	rotationAmount?: number;
	blurAmount?: number;
	useWindowScroll?: boolean;
	onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
	children,
	className = "",
	itemDistance = 80,
	itemScale = 0.02,
	itemStackDistance = 20,
	stackPosition = "10%",
	scaleEndPosition = "5%",
	baseScale = 0.9,
	scaleDuration = 0.5,
	rotationAmount = 0,
	blurAmount = 3,
	onStackComplete,
}) => {
	const scrollerRef = useRef<HTMLDivElement>(null);
	const stackCompletedRef = useRef(false);
	const cardsRef = useRef<HTMLElement[]>([]);
	const isUpdatingRef = useRef(false);

	// Normalize progress between start and end positions (0..1)
	const calculateProgress = useCallback(
		(scrollTop: number, start: number, end: number) => {
			if (scrollTop < start) return 0;
			if (scrollTop > end) return 1;
			return (scrollTop - start) / (end - start);
		},
		[],
	);

	// Convert percentage strings like "10%" into pixel values
	const parsePercentage = useCallback(
		(value: string | number, containerHeight: number) => {
			if (typeof value === "string" && value.includes("%")) {
				return (parseFloat(value) / 100) * containerHeight;
			}
			return parseFloat(value as string);
		},
		[],
	);

	const getScrollData = useCallback(() => {
		return {
			scrollTop: window.scrollY,
			containerHeight: window.innerHeight,
		};
	}, []);

	const cardTopsRef = useRef<number[]>([]);
	const endElementTopRef = useRef<number>(0);

	// Measure and cache card document offsets once (and on resize) to prevent layout thrashing on scroll
	const measureOffsets = useCallback(() => {
		if (!cardsRef.current.length) return;
		const scrollY = window.scrollY;
		cardTopsRef.current = cardsRef.current.map((card) => {
			const rect = card.getBoundingClientRect();
			return rect.top + scrollY;
		});
		const endElement = document.querySelector(
			".scroll-stack-end",
		) as HTMLElement | null;
		endElementTopRef.current = endElement
			? endElement.getBoundingClientRect().top + scrollY
			: 0;
	}, []);

	// Update per-card transforms (translate, scale, rotation, opacity)
	// Completely avoids forced synchronous layout queries and eliminates expensive Gaussian blur on mobile.
	const updateCardTransforms = useCallback(() => {
		if (!cardsRef.current.length) return;

		const { scrollTop, containerHeight } = getScrollData();
		const stackPositionPx = parsePercentage(stackPosition, containerHeight);
		const scaleEndPositionPx = parsePercentage(
			scaleEndPosition,
			containerHeight,
		);

		const isMobile =
			typeof window !== "undefined" &&
			(window.innerWidth < 768 || "ontouchstart" in window);

		const cardTops = cardTopsRef.current;
		const endElementTop = endElementTopRef.current;

		let topCardIndex = 0;
		for (let i = 0; i < cardsRef.current.length; i++) {
			const cardTop = cardTops[i] ?? 0;
			const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
			if (scrollTop >= triggerStart) {
				topCardIndex = i;
			}
		}

		cardsRef.current.forEach((card, i) => {
			if (!card) return;

			const cardTop = cardTops[i] ?? 0;
			const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
			const triggerEnd = cardTop - scaleEndPositionPx;

			const scaleProgress = calculateProgress(
				scrollTop,
				triggerStart,
				triggerEnd,
			);
			const targetScale = baseScale + i * itemScale;
			const scale = 1 - scaleProgress * (1 - targetScale);
			const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

			const isBlurred = i < topCardIndex;
			const depthInStack = topCardIndex - i;

			// On iOS/mobile, skip filter: blur(...) entirely to avoid severe GPU texture reallocation lag.
			// Pure opacity fading delivers identical depth aesthetics at 60/120fps compositor speed.
			let blur = 0;
			let opacity = 1;

			if (isMobile) {
				opacity = isBlurred ? Math.max(0.45, 1 - depthInStack * 0.15) : 1;
			} else {
				if (isBlurred) {
					const maxBlur = Math.min(depthInStack * 0.8, blurAmount);
					const easeInOut = (t: number) => t * t * (3 - 2 * t);
					const blurProgress = Math.min(scaleProgress * 1.2, 1);
					blur = maxBlur * easeInOut(blurProgress);
				} else {
					const unblurProgress = Math.max(
						0,
						1 - (scrollTop - triggerStart) / 300,
					);
					blur = blurAmount * 0.3 * (1 - unblurProgress);
				}
				opacity = blur > 0.1 ? 1 - blur / 12 : 1;
			}

			// Calculate translateY with smooth clamping
			let translateY = 0;
			const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
			const pinEnd = endElementTop - containerHeight * 0.6;

			if (scrollTop > pinStart && scrollTop < pinEnd) {
				translateY =
					scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
			} else if (scrollTop >= pinEnd) {
				translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
			}

			translateY = Math.max(0, translateY);

			const roundedY = Math.round(translateY * 10) / 10;
			const roundedScale = Math.round(scale * 1000) / 1000;
			const roundedRotation = Math.round(rotation * 10) / 10;

			card.style.transform = `translate3d(0, ${roundedY}px, 0) scale(${roundedScale}) rotate(${roundedRotation}deg)`;
			if (!isMobile && blur > 0.1) {
				card.style.filter = `blur(${Math.round(blur * 10) / 10}px)`;
			} else {
				card.style.filter = "none";
			}
			card.style.opacity = String(Math.round(opacity * 100) / 100);

			// Check if last card is fully revealed
			if (i === cardsRef.current.length - 1) {
				const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
				if (isInView && !stackCompletedRef.current) {
					stackCompletedRef.current = true;
					onStackComplete?.();
				} else if (!isInView && stackCompletedRef.current) {
					stackCompletedRef.current = false;
				}
			}
		});
	}, [
		itemScale,
		itemStackDistance,
		stackPosition,
		scaleEndPosition,
		baseScale,
		rotationAmount,
		blurAmount,
		onStackComplete,
		calculateProgress,
		parsePercentage,
		getScrollData,
	]);

	// Use requestAnimationFrame for smooth updates and avoid layout thrashing
	useEffect(() => {
		const handleScroll = () => {
			if (!isUpdatingRef.current) {
				isUpdatingRef.current = true;
				requestAnimationFrame(() => {
					updateCardTransforms();
					isUpdatingRef.current = false;
				});
			}
		};

		const lenis = lenisStore.get();
		if (lenis) {
			lenis.on("scroll", handleScroll);
		}

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			if (lenis) {
				lenis.off("scroll", handleScroll);
			}
			window.removeEventListener("scroll", handleScroll);
		};
	}, [updateCardTransforms]);

	// Initialize card DOM refs and base styles when component mounts
	useLayoutEffect(() => {
		const cards = Array.from(
			document.querySelectorAll(".scroll-stack-card"),
		) as HTMLElement[];
		cardsRef.current = cards;

		cards.forEach((card, i) => {
			if (i < cards.length - 1) {
				card.style.marginBottom = `${itemDistance}px`;
			}
			card.style.willChange = "transform, opacity";
			card.style.transformOrigin = "top center";
			card.style.backfaceVisibility = "hidden";
			card.style.transform = "translateZ(0)";
			card.style.opacity = "1";
		});

		measureOffsets();
		updateCardTransforms();

		const handleResize = () => {
			measureOffsets();
			updateCardTransforms();
		};

		window.addEventListener("resize", handleResize, { passive: true });

		return () => {
			window.removeEventListener("resize", handleResize);
			cardsRef.current = [];
			isUpdatingRef.current = false;
		};
	}, [
		itemDistance,
		itemScale,
		itemStackDistance,
		stackPosition,
		scaleEndPosition,
		baseScale,
		scaleDuration,
		rotationAmount,
		blurAmount,
		onStackComplete,
		measureOffsets,
		updateCardTransforms,
	]);

	return (
		<div
			className={`relative w-full ${className}`.trim()}
			ref={scrollerRef}>
			<div className="scroll-stack-inner pt-[10vh] px-4 md:px-12 lg:px-20 pb-20 min-h-screen">
				{children}
				<div className="scroll-stack-end w-full h-px" />
			</div>
		</div>
	);
};

export default ScrollStack;
