/** @format */

const fs = require("fs");
const path = require("path");

// Read arguments: node scripts/scaffold-client.cjs <slug> [title]
const args = process.argv.slice(2);
const slug = (args[0] || "").toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
const rawTitle = args[1] || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

if (!slug) {
	console.log(`
Usage:
  npm run scaffold <subdomain-slug> "[Business Name]"

Examples:
  npm run scaffold bella-bakery "Bella Bakery"
  npm run scaffold apex-fitness "Apex Fitness Gym"
  npm run scaffold prime-consulting "Prime Consulting"
`);
	process.exit(1);
}

// PascalCase component name (e.g. bella-bakery -> BellaBakerySite)
const componentName =
	slug
		.split("-")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join("") + "Site";

const clientsDir = path.resolve(process.cwd(), "src/clients_websites");
const targetFile = path.join(clientsDir, `${componentName}.tsx`);
const registryFile = path.join(clientsDir, "index.tsx");

if (fs.existsSync(targetFile)) {
	console.error(`Error: File already exists at src/clients_websites/${componentName}.tsx`);
	process.exit(1);
}

// Generate bespoke React component template
const templateCode = `/** @format */

"use client";

import React, { useState } from "react";
import type { CustomClientTemplateProps } from "./index";
import {
	ShoppingBag,
	Sparkles,
	Star,
	CheckCircle2,
	MessageCircle,
	ArrowRight,
	ShieldCheck,
	Truck,
	Clock,
	Search,
	Heart,
	Phone,
} from "lucide-react";

export default function ${componentName}({
	tenantSlug,
	plan,
	content,
	publishedUrl,
}: CustomClientTemplateProps) {
	const businessName = content.businessName || "${rawTitle}";
	const tagline =
		content.tagline || "High-quality products and professional services delivered to you";
	const whatsapp = content.whatsappNumber || "08116062226";
	const cleanPhone = whatsapp.replace(/[^0-9]/g, "");

	const [activeCategory, setActiveCategory] = useState("All");
	const [searchQuery, setSearchQuery] = useState("");

	const defaultCatalog = [
		{
			id: "1",
			name: "Premium Featured Item 01",
			price: 45000,
			badge: "Best Seller",
			desc: "Engineered with highest standards and premium materials for daily utility.",
			image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=85",
		},
		{
			id: "2",
			name: "Signature Collection Item 02",
			price: 68000,
			badge: "Popular",
			desc: "Exclusive craftsmanship with guaranteed durability and modern design.",
			image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&auto=format&fit=crop&q=85",
		},
		{
			id: "3",
			name: "Contemporary Essential 03",
			price: 32000,
			badge: "New Arrival",
			desc: "Ultra-sleek profile designed for maximum comfort and lasting performance.",
			image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=85",
		},
	];

	const catalog =
		content.products && content.products.length > 0
			? content.products.map((p, idx) => ({
					id: String(idx + 1),
					name: p.name,
					price: Number(p.price || 40000),
					badge: idx === 0 ? "Featured" : "",
					desc: p.description || "Premium quality guaranteed.",
					image: p.image || defaultCatalog[idx % defaultCatalog.length].image,
			  }))
			: defaultCatalog;

	const handleWhatsAppOrder = (productName: string, price: number) => {
		const formattedPrice = "₦" + price.toLocaleString();
		const message = encodeURIComponent(
			"Hello " + businessName + "! 👋\\n\\nI want to order: *" + productName + "* (" + formattedPrice + ") from your website: " + publishedUrl,
		);
		window.open("https://wa.me/" + cleanPhone + "?text=" + message, "_blank");
	};

	return (
		<div className="min-h-screen bg-[#fafbfc] text-slate-900 font-montserrat antialiased selection:bg-slate-900 selection:text-white">
			{/* Top Announcement Bar */}
			<div className="bg-slate-900 text-white text-[11px] font-semibold py-2.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 border-b border-slate-800">
				<Sparkles className="w-3.5 h-3.5 text-amber-400" />
				<span>Fast Nationwide Delivery • Direct WhatsApp Order Processing</span>
			</div>

			{/* Main Navigation */}
			<header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						{content.logoImage?.url ? (
							<img src={content.logoImage.url} alt={businessName} className="h-10 w-auto object-contain" />
						) : (
							<div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg">
								{businessName.charAt(0).toUpperCase()}
							</div>
						)}
						<div>
							<h1 className="font-extrabold text-lg sm:text-xl text-slate-900 leading-none">
								{businessName}
							</h1>
							<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
								Verified Online Store
							</span>
						</div>
					</div>

					<a
						href={"https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent("Hello " + businessName + ", I would like to make an inquiry.")}
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow-emerald-600/20 hover:-translate-y-0.5 active:scale-95">
						<MessageCircle className="w-4 h-4 fill-white" />
						<span className="hidden sm:inline">WhatsApp Us</span>
					</a>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
				<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-extrabold uppercase tracking-widest">
					<Sparkles className="w-3.5 h-3.5 text-amber-500" />
					<span>Official Brand Site</span>
				</div>

				<h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight">
					{businessName}
				</h2>

				<p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium leading-relaxed">
					{tagline}
				</p>

				<div className="pt-2 flex items-center justify-center gap-4">
					<a
						href="#catalog"
						className="px-8 py-4 rounded-full bg-slate-900 hover:bg-blue-600 text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center gap-2">
						<span>Explore Catalog</span>
						<ArrowRight className="w-4 h-4" />
					</a>
				</div>
			</section>

			{/* Catalog Section */}
			<section id="catalog" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
				<div className="border-b border-slate-200 pb-4 flex items-center justify-between">
					<div>
						<h3 className="text-2xl font-black text-slate-900">Featured Offerings</h3>
						<p className="text-xs text-slate-500">Tap any item to order directly on WhatsApp</p>
					</div>
					<span className="text-xs font-bold text-slate-400">{catalog.length} Items</span>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{catalog.map((product) => (
						<div
							key={product.id}
							className="group bg-white border border-slate-200/90 rounded-3xl overflow-hidden hover:border-slate-400 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
							<div className="relative aspect-square overflow-hidden bg-slate-100">
								<img
									src={product.image}
									alt={product.name}
									className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
								/>
								{product.badge && (
									<span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-extrabold uppercase tracking-wider">
										{product.badge}
									</span>
								)}
							</div>

							<div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
								<div className="space-y-1">
									<h4 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
										{product.name}
									</h4>
									<p className="text-xs text-slate-500 line-clamp-2">{product.desc}</p>
								</div>

								<div className="pt-4 border-t border-slate-100 flex items-center justify-between">
									<span className="text-lg font-black text-slate-900">₦{product.price.toLocaleString()}</span>
									<button
										onClick={() => handleWhatsAppOrder(product.name, product.price)}
										className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer">
										<MessageCircle className="w-3.5 h-3.5 fill-white" />
										<span>Order</span>
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Direct WhatsApp Call to Action */}
			<section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
					<div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
						<MessageCircle className="w-6 h-6 fill-white" />
					</div>
					<div className="space-y-2">
						<h3 className="text-2xl sm:text-3xl font-black">Need Custom Inquiries or Bulk Orders?</h3>
						<p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
							Chat directly with our representative on WhatsApp for immediate support and quotes.
						</p>
					</div>
					<a
						href={"https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent("Hello " + businessName + ", I would like to make an inquiry.")}
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95">
						<span>Chat on WhatsApp</span>
						<ArrowRight className="w-4 h-4" />
					</a>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
				<p>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
				<p className="mt-2 text-[11px]">
					Powered by <a href="https://kioosk.online" className="text-blue-600 font-bold hover:underline">Kiosk</a>
				</p>
			</footer>
		</div>
	);
}
`;

// 1. Write the new component file
fs.writeFileSync(targetFile, templateCode, "utf8");
console.log(`Created new bespoke template: src/clients_websites/${componentName}.tsx`);

// 2. Automatically register in src/clients_websites/index.tsx
let registryContent = fs.readFileSync(registryFile, "utf8");

// Add import statement
const importLine = `import ${componentName} from "./${componentName}";\n`;
if (!registryContent.includes(`import ${componentName}`)) {
	registryContent = registryContent.replace(
		"import VictorJeremiahStore from",
		`${importLine}import VictorJeremiahStore from`,
	);
}

// Add slug entry in customTemplateRegistry object
const registryEntry = `\t"${slug}": ${componentName},\n`;
if (!registryContent.includes(`"${slug}":`)) {
	registryContent = registryContent.replace(
		'"victorjeremiah-2e6925": VictorJeremiahStore,',
		`"victorjeremiah-2e6925": VictorJeremiahStore,\n${registryEntry.trimEnd()}`,
	);
}

fs.writeFileSync(registryFile, registryContent, "utf8");
console.log(`Registered slug "${slug}" -> <${componentName} /> in src/clients_websites/index.tsx!`);
console.log(`\nReady! Visit http://localhost:3000/tenants/${slug} or https://${slug}.kioosk.online to view.`);
