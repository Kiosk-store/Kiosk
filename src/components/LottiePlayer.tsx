/**
 * LottiePlayer
 *
 * Lightweight, SSR-safe client-side Lottie animation player using lottie-web.
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
					},
				});

				animInstance.setSpeed(speed);
				animRef.current = animInstance;
			})
			.catch((err) => {
				console.warn(`Lottie failed to load from ${src}:`, err);
			});

		return () => {
			isMounted = false;
			if (animInstance) animInstance.destroy();
			if (animRef.current) {
				animRef.current.destroy();
				animRef.current = null;
			}
		};
	}, [src, loop, autoplay, speed]);

	return <div ref={containerRef} className={className} />;
}
