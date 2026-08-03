/**
 * Navbar
 *
 * Thin wrapper that provides the nav item configuration and renders the
 * `StaggeredMenu` as the global navigation. Kept intentionally small;
 * complex menu behavior lives in `StaggeredMenu`.
 *
 * @format
 */

/** @format */

"use client";

import StaggeredMenu from "./StaggeredMenu";

const navItems = [
	{ label: "Services", href: "#services" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "Portfolio", href: "#portfolio" },
	{ label: "About", href: "#about" },
	{ label: "FAQ", href: "#faq" },
];

export default function Navbar() {
	const menuItems = navItems.map((n) => ({
		label: n.label,
		ariaLabel: `Go to ${n.label.toLowerCase()}`,
		link: n.href,
	}));

	const actionItems = [
		{ label: "Login / Sign up", link: "#login", primary: true },
	];

	return (
		<div>
			<StaggeredMenu
				position="right"
				items={menuItems}
				actionItems={actionItems}
				displaySocials={false}
				displayItemNumbering={true}
				menuButtonColor="#0a0a0a"
				openMenuButtonColor="#0a0a0a"
				changeMenuColorOnOpen={true}
				colors={["#B497CF", "#5227FF"]}
				logoUrl="/logo.svg"
				accentColor="#2563eb"
				isFixed={true}
				showMenuText={false}
			/>
		</div>
	);
}
