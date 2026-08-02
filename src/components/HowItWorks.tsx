/**
 * HowItWorks
 *
 * Section component that displays the step-by-step process. Uses
 * `ScrollStack` for the stacked visual and GSAP/ScrollTrigger for
 * per-card reveal animations.
 *
 * @format
 */

/** @format */

"use client";

import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";

const steps = [
	{
		num: "01",
		title: "Choose a plan",
		body: "Select a Landing Page or Online Store package that fits your business needs.",
		bg: "#e8f0fe",
	},
	{
		num: "02",
		title: "Provide your details",
		body: "Tell us your business info, photos, pricing, and contact (including WhatsApp). No technical setup required.",
		bg: "#d4d9c8",
	},
	{
		num: "03",
		title: "We build and host",
		body: "We design, configure payments and integrations, and host your site so you don't manage infrastructure.",
		bg: "#e8e8e0",
	},
	{
		num: "04",
		title: "Launch & grow",
		body: "We connect your domain and hand over a live, maintained site so you can focus on customers.",
		bg: "#d4d9c8",
	},
];

export default function HowItWorks() {
	// Setup per-card scroll-triggered reveal animations
	useEffect(() => {
		if (typeof window === "undefined") return;
		gsap.registerPlugin(ScrollTrigger);

		const els = document.querySelectorAll(".howit-card");
		els.forEach((el) => {
			gsap.fromTo(
				el,
				{ y: 40, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 0.8,
					ease: "power3.out",
					scrollTrigger: {
						trigger: el,
						start: "top 85%",
						toggleActions: "play none none reverse",
					},
				},
			);
		});

		return () => {
			// cleanup ScrollTrigger instances when unmounting
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	}, []);

	return (
		<section
			id="how-it-works"
			data-bg="dark"
			style={{
				background: "var(--ink)",
				color: "var(--paper)",
				position: "relative",
				padding: "0",
			}}>
			<div style={{ position: "relative", margin: "0 -10px" }}>
				<ScrollStack
					useWindowScroll={true}
					itemDistance={80}
					itemScale={0.02}
					baseScale={0.9}
					scaleEndPosition="5%"
					stackPosition="10%"
					blurAmount={3}>
					{steps.map((s) => {
						// use a fixed black to avoid prefers-color-scheme overrides
						const ink = "#0a0a0a";
						const numColor = "#0a0a0a";
						const titleColor = "#0a0a0a";
						const bodyColor = "#0a0a0a";

						return (
							<ScrollStackItem
								key={s.num}
								itemClassName="!rounded-none !shadow-none !bg-transparent !my-0 !p-0 !h-auto">
								<article
									className="howit-card"
									style={{
										background: s.bg,
										color: ink,
										minHeight: 240,
										padding: "32px 40px",
										display: "flex",
										flexDirection: "column",
										alignItems: "flex-start",
										justifyContent: "center",
										overflow: "visible",
										borderRadius: 0,
										position: "relative",
										willChange: "transform, filter, opacity",
										marginBottom: "24px",
										border: "1px solid rgba(255,255,255,0.08)",
									}}>
									<h3
										style={{
											margin: 0,
											marginBottom: "8px",
											fontFamily: "var(--font-thunder-lc)",
											fontWeight: 700,
											fontSize: "clamp(24px, 3.3vw, 42px)",
											lineHeight: 1,
											textTransform: "uppercase",
											color: titleColor,
											letterSpacing: "0.00em",
											textAlign: "left",
											zIndex: 1,
											paddingRight: "80px",
										}}>
										{s.title}
									</h3>
									<p
										style={{
											maxWidth: 480,
											margin: 0,
											textAlign: "left",
											fontFamily: "var(--font-nohemi)",
											fontSize: "clamp(14px, 1.1vw, 17px)",
											lineHeight: 1.6,
											color: bodyColor,
											letterSpacing: "0.00em",
											zIndex: 1,
											opacity: 0.8,
										}}>
										{s.body}
									</p>
									<span
										aria-hidden="true"
										style={{
											position: "absolute",
											right: "clamp(16px, 3vw, 32px)",
											top: "50%",
											transform: "translateY(-50%)",
											fontFamily: "var(--font-thunder-lc)",
											fontWeight: 700,
											fontSize: "clamp(53px, 6.6vw, 88px)",
											lineHeight: 1,
											color: numColor,
											pointerEvents: "none",
											userSelect: "none",
											zIndex: 0,
											overflow: "visible",
										}}>
										{s.num}
									</span>
								</article>
							</ScrollStackItem>
						);
					})}
				</ScrollStack>
			</div>
		</section>
	);
}
