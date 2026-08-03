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

	// Return the element's top offset relative to the document
	const getElementOffset = useCallback((element: HTMLElement) => {
		const rect = element.getBoundingClientRect();
		return rect.top + window.scrollY;
	}, []);

	// Update per-card transforms (translate, scale, rotation, blur)
	// This is called on scroll via RAF for smooth, composited updates.
	const updateCardTransforms = useCallback(() => {
		if (!cardsRef.current.length) return;

		const { scrollTop, containerHeight } = getScrollData();
		const stackPositionPx = parsePercentage(stackPosition, containerHeight);
		const scaleEndPositionPx = parsePercentage(
			scaleEndPosition,
			containerHeight,
		);

		const endElement = document.querySelector(
			".scroll-stack-end",
		) as HTMLElement | null;
		const endElementTop = endElement ? getElementOffset(endElement) : 0;

		let topCardIndex = 0;
		cardsRef.current.forEach((card, i) => {
			const cardTop = getElementOffset(card);
			const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
			if (scrollTop >= triggerStart) {
				topCardIndex = i;
			}
		});

		cardsRef.current.forEach((card, i) => {
			if (!card) return;

			const cardTop = getElementOffset(card);
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

			// Smooth blur based on position in stack
			let blur = 0;
			const isBlurred = i < topCardIndex;
			const depthInStack = topCardIndex - i;

			if (isBlurred) {
				// Progressive blur with smooth easing
				const maxBlur = Math.min(depthInStack * 0.8, blurAmount);
				// Use sine easing for smoother transition
				const easeInOut = (t: number) => t * t * (3 - 2 * t);
				const blurProgress = Math.min(scaleProgress * 1.2, 1);
				blur = maxBlur * easeInOut(blurProgress);
			} else {
				// Gradually unblur when scrolling up
				const unblurProgress = Math.max(
					0,
					1 - (scrollTop - triggerStart) / 300,
				);
				blur = blurAmount * 0.3 * (1 - unblurProgress);
			}

			// Calculate translateY with smoother motion
			let translateY = 0;
			const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
			const pinEnd = endElementTop - containerHeight * 0.6;

			if (scrollTop > pinStart && scrollTop < pinEnd) {
				translateY =
					scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
			} else if (scrollTop >= pinEnd) {
				translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
			}

			// Clamp translateY to prevent overshoot
			translateY = Math.max(0, translateY);

			const newTransform = {
				translateY: Math.round(translateY * 10) / 10,
				scale: Math.round(scale * 1000) / 1000,
				rotation: Math.round(rotation * 10) / 10,
				blur: Math.round(blur * 10) / 10,
			};

			// Apply transform with smoother transitions
			const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
			const filter =
				newTransform.blur > 0.1 ? `blur(${newTransform.blur}px)` : "";
			const opacity = newTransform.blur > 0.1 ? 1 - newTransform.blur / 12 : 1;

			card.style.transform = transform;
			card.style.filter = filter;
			card.style.opacity = String(opacity);
			card.style.transition =
				"transform 0.1s ease-out, filter 0.1s ease-out, opacity 0.1s ease-out";

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
		getElementOffset,
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
			card.style.willChange = "transform, filter, opacity";
			card.style.transformOrigin = "top center";
			card.style.backfaceVisibility = "hidden";
			card.style.transform = "translateZ(0)";
			card.style.filter = "blur(0px)";
			card.style.opacity = "1";
			card.style.transition =
				"transform 0.15s ease-out, filter 0.15s ease-out, opacity 0.15s ease-out";
		});

		updateCardTransforms();

		return () => {
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
		updateCardTransforms,
	]);

	return (
		<div
			className={`relative w-full ${className}`.trim()}
			ref={scrollerRef}>
			<div className="scroll-stack-inner pt-[10vh] px-20 pb-20 min-h-screen">
				{children}
				<div className="scroll-stack-end w-full h-px" />
			</div>
		</div>
	);
};

export default ScrollStack;
