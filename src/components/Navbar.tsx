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
      baseColor="#004ac6"
      pillColor="#ffffff"
      hoveredPillTextColor="#ffffff"
      pillTextColor="#004ac6"
      initialLoadAnimation
    />
  );
}

export { PillNav };
