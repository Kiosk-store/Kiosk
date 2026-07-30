"use client";

import { useState } from "react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "FAQ", href: "#faq" },
];

function smoothScrollTo(href: string) {
  const target = document.querySelector(href);
  if (target) {
    const offset = 80;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = target.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    smoothScrollTo(href);
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm">
      <div className="max-w-[1280px] mx-auto px-margin-x-mobile md:px-margin-x-desktop py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-headline-md font-bold text-primary">StartupBuilder</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-stack-lg">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-body-md text-on-surface-variant hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-xl text-label-md hover:bg-primary transition-all active:scale-95 cursor-pointer">
            Get started
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-on-surface cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-container border-b border-outline-variant px-margin-x-mobile py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-label-md text-on-surface"
            >
              {link.label}
            </a>
          ))}
          <button className="bg-primary text-on-primary px-6 py-3 rounded-xl text-label-md w-full cursor-pointer">
            Get started
          </button>
        </div>
      )}
    </nav>
  );
}
