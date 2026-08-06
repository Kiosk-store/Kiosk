/** @format */

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import CookieConsent from "@/components/CookieConsent";

const thunderLC = localFont({
	src: [
		{
			path: "../../public/fonts/Thunder/Thunder-LightLC.woff2",
			weight: "300",
			style: "normal",
		},
		{
			path: "../../public/fonts/Thunder/Thunder-MediumLC.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/fonts/Thunder/Thunder-SemiBoldLC.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "../../public/fonts/Thunder/Thunder-BoldLC.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "../../public/fonts/Thunder/Thunder-ExtraBoldLC.woff2",
			weight: "800",
			style: "normal",
		},
		{
			path: "../../public/fonts/Thunder/Thunder-BlackLC.woff2",
			weight: "900",
			style: "normal",
		},
		{
			path: "../../public/fonts/Thunder/Thunder-BlackLCItalic.woff2",
			weight: "900",
			style: "italic",
		},
	],
	variable: "--font-thunder-lc",
	display: "swap",
});

const thunderHC = localFont({
	src: [
		{
			path: "../../public/fonts/Thunder/Thunder-BlackHC.woff2",
			weight: "900",
			style: "normal",
		},
		{
			path: "../../public/fonts/Thunder/Thunder-BlackHCItalic.woff2",
			weight: "900",
			style: "italic",
		},
	],
	variable: "--font-thunder-hc",
	display: "swap",
});

const nohemi = localFont({
	src: [
		{
			path: "../../public/fonts/Nohemi/Nohemi-Thin.woff2",
			weight: "100",
			style: "normal",
		},
		{
			path: "../../public/fonts/Nohemi/Nohemi-ExtraLight.woff2",
			weight: "200",
			style: "normal",
		},
		{
			path: "../../public/fonts/Nohemi/Nohemi-Light.woff2",
			weight: "300",
			style: "normal",
		},
		{
			path: "../../public/fonts/Nohemi/Nohemi-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/fonts/Nohemi/Nohemi-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/fonts/Nohemi/Nohemi-SemiBold.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "../../public/fonts/Nohemi/Nohemi-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "../../public/fonts/Nohemi/Nohemi-ExtraBold.woff2",
			weight: "800",
			style: "normal",
		},
		{
			path: "../../public/fonts/Nohemi/Nohemi-Black.woff2",
			weight: "900",
			style: "normal",
		},
	],
	variable: "--font-nohemi",
	display: "swap",
});

const dirtyline = localFont({
	src: [
		{
			path: "../../public/fonts/Dirtyline/Dirtyline-36daysoftype2022.woff2",
			weight: "400",
			style: "normal",
		},
	],
	variable: "--font-dirtyline",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Kiosk | Modern Websites for Small Businesses",
	description:
		"Professional custom sites, sales funnels, and online stores hosted on our platform with easy custom domain upgrades. Built for small businesses.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`scroll-smooth ${thunderLC.variable} ${thunderHC.variable} ${nohemi.variable} ${dirtyline.variable}`}>
			<head>
				{/* Material Symbols Outlined */}
				<link
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="font-nohemi antialiased">
				<NavbarWrapper />
				{children}
				<CookieConsent />
			</body>
		</html>
	);
}
