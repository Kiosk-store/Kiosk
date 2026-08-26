/** @format */

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";

/**
 * Conditionally renders the global Kiosk marketing Navbar.
 * Hidden on:
 * 1. Multi-tenant client subdomains and custom domains
 * 2. /tenants/* routes
 * 3. /domains/* routes
 * 4. /dashboard/* routes
 * 5. /admin/* routes
 */
export default function NavbarWrapper() {
	const pathname = usePathname();
	const [isSubdomain, setIsSubdomain] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const host = window.location.hostname.replace(/:\d+$/, "");
			const rootHosts = ["kioosk.online", "www.kioosk.online", "localhost", "127.0.0.1"];
			if (!rootHosts.includes(host)) {
				setIsSubdomain(true);
			}
		}
	}, []);

	// Hide on internal tenant routes, domain routes, dashboard, admin
	const isExcludedRoute =
		pathname.startsWith("/tenants") ||
		pathname.startsWith("/domains") ||
		pathname.startsWith("/dashboard") ||
		pathname.startsWith("/admin");

	if (isExcludedRoute || isSubdomain) {
		return null;
	}

	return <Navbar />;
}
