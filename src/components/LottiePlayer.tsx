/**
 * LottiePlayer
 *
 * Lightweight, SSR-safe client-side Lottie animation player using lottie-web.
 * Optimized for iOS & Safari:
 * - Automatically pauses playback when offscreen via IntersectionObserver.
 * - Hardware accelerated with WebKit translateZ(0) to prevent composite lag.
 * - Configured with hideOnTransparent to save battery & GPU draw calls.
 *
 * @format
 */

"use client";

import React, { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

interface LottiePlayerProps {
	src: string;
	className?: string;
	loop?: boolean;
	autoplay?: boolean;
	speed?: number;
}

export default function LottiePlayer({
	src,
	className = "",
	loop = true,
	autoplay = true,
	speed = 1,
}: LottiePlayerProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const animRef = useRef<AnimationItem | null>(null);

	useEffect(() => {
		let isMounted = true;
		let animInstance: AnimationItem | null = null;
		let observer: IntersectionObserver | null = null;

		// Dynamically import lottie-web for SSR safety
		import("lottie-web")
			.then((lottieModule) => {
				if (!isMounted || !containerRef.current) return;
				const lottie = lottieModule.default || lottieModule;

				// Destroy any stale instance
				if (animRef.current) {
					animRef.current.destroy();
				}

				animInstance = lottie.loadAnimation({
					container: containerRef.current,
					renderer: "svg",
					loop,
					autoplay,
					path: encodeURI(src),
					rendererSettings: {
						preserveAspectRatio: "xMidYMid meet",
						progressiveLoad: true,
						hideOnTransparent: true,
					},
				});

				animInstance.setSpeed(speed);
				animRef.current = animInstance;

				// iOS & Safari Optimization: Pause when off-screen to preserve CPU/GPU
				if (typeof IntersectionObserver !== "undefined" && containerRef.current) {
					observer = new IntersectionObserver(
						(entries) => {
							entries.forEach((entry) => {
								if (!animRef.current) return;
								if (entry.isIntersecting) {
									if (autoplay) animRef.current.play();
								} else {
									animRef.current.pause();
								}
							});
						},
						{ threshold: 0.05 },
					);
					observer.observe(containerRef.current);
				}
			})
			.catch((err) => {
				console.warn(`Lottie failed to load from ${src}:`, err);
			});

		return () => {
			isMounted = false;
			if (observer) observer.disconnect();
			if (animInstance) animInstance.destroy();
			if (animRef.current) {
				animRef.current.destroy();
				animRef.current = null;
			}
		};
	}, [src, loop, autoplay, speed]);

	return (
		<div
			ref={containerRef}
			className={className}
			style={{
				transform: "translateZ(0)",
				WebkitTransform: "translateZ(0)",
				backfaceVisibility: "hidden",
				WebkitBackfaceVisibility: "hidden",
			}}
		/>
	);
}
