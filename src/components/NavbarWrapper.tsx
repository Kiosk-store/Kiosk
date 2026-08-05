/** @format */

"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

/**
 * Conditionally renders the global Navbar.
 * Hidden on /dashboard routes to maintain a clean dashboard workspace.
 */
export default function NavbarWrapper() {
	const pathname = usePathname();
	const isDashboard = pathname.startsWith("/dashboard");

	if (isDashboard) return null;

	return <Navbar />;
}
