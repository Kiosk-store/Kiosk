/**
 * ScrollReveal
 *
 * Global small utility to register GSAP's ScrollTrigger and add a simple
 * fade/slide reveal for every `section` on the page. This keeps the
 * animation logic centralized rather than duplicating ScrollTrigger calls
 * across many components.
 *
 * @format
 */

"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollReveal() {
	useEffect(() => {
		if (typeof window === "undefined") return;
		gsap.registerPlugin(ScrollTrigger);

		// animate all top-level sections with the same reveal settings
		const sections = Array.from(document.querySelectorAll("section"));

		sections.forEach((el) => {
			// skip if already initialized to avoid duplicate triggers
			if (el.classList.contains("sr-initialized")) return;
			el.classList.add("sr-initialized");

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
			// cleanup any ScrollTrigger instances when the component unmounts
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	}, []);

	return null;
}
