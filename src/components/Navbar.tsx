/** @format */

"use client";

import PillNav from "./PillNav";

const navItems = [
	{ label: "Services", href: "#services" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "About", href: "#about" },
	{ label: "Portfolio", href: "#portfolio" },
	{ label: "FAQ", href: "#faq" },
];

export default function Navbar() {
	return (
		<PillNav
			items={navItems}
			logoAlt="Kiosk"
			baseColor="var(--color-primary)"
			pillColor="var(--color-surface-container-lowest)"
			hoveredPillTextColor="var(--color-on-primary)"
			pillTextColor="var(--color-primary)"
			initialLoadAnimation
		/>
	);
}

export { PillNav };
