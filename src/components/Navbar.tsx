/** @format */

"use client";

import StaggeredMenu from "./StaggeredMenu";

const navItems = [
	{ label: "Pricing", href: "#pricing" },
	{ label: "About", href: "#about" },
	{ label: "Log in", href: "/login" },
	{ label: "Get Started", href: "/get-started" },
];

export default function Navbar() {
	const menuItems = navItems.map((n) => ({
		label: n.label,
		ariaLabel: `Go to ${n.label.toLowerCase()}`,
		link: n.href,
	}));

	const socialItems = [
		{ label: "Twitter", link: "https://twitter.com" },
		{ label: "GitHub", link: "https://github.com" },
		{ label: "LinkedIn", link: "https://linkedin.com" },
	];

	return (
		<div>
			<StaggeredMenu
				position="right"
				items={menuItems}
				socialItems={socialItems}
				displaySocials={true}
				displayItemNumbering={true}
				menuButtonColor="#0a0a0a"
				openMenuButtonColor="#0a0a0a"
				changeMenuColorOnOpen={true}
				colors={["#B497CF", "#5227FF"]}
				logoUrl="/logo.svg"
				accentColor="#ff6b6b"
				isFixed={true}
				showMenuText={false}
			/>
		</div>
	);
}
