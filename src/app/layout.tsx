import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Material Symbols Outlined */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-nohemi antialiased">{children}</body>
    </html>
  );
}
