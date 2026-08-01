/** @format */

"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollReveal() {
	useEffect(() => {
		if (typeof window === "undefined") return;
		gsap.registerPlugin(ScrollTrigger);

		const sections = Array.from(document.querySelectorAll("section"));

		sections.forEach((el) => {
			// skip if already animated
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
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	}, []);

	return null;
}
