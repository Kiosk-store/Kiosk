/** @format */

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
	Zap,
} from "lucide-react";

export default function VictorJeremiahStore({
	tenantSlug,
	plan,
	content,
	publishedUrl,
}: CustomClientTemplateProps) {
	const businessName = content.businessName || "Victor Jeremiah Premium Store";
	const tagline = content.tagline || "Curated high-end collections delivered directly to you";
	const whatsapp = content.whatsappNumber || "08116062226";
	const cleanPhone = whatsapp.replace(/[^0-9]/g, "");

	const defaultProducts = [
		{
			id: "1",
			name: "Signature Premium Collection 01",
			price: "₦45,000",
			badge: "Best Seller",
			desc: "Handcrafted with premium materials. Limited seasonal batch with guaranteed durability.",
			image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
		},
		{
			id: "2",
			name: "Executive Luxury Edition",
			price: "₦78,000",
			badge: "Popular",
			desc: "Engineered for excellence and modern lifestyle. Includes custom gift packaging.",
			image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
		},
		{
			id: "3",
			name: "Modern Minimalist Essential",
			price: "₦32,000",
			badge: "New Arrival",
			desc: "Ultra-sleek profile designed for daily utility and maximum comfort.",
			image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
		},
	];

	const displayProducts =
		content.products && content.products.length > 0
			? content.products.map((p, idx) => ({
					id: String(idx + 1),
					name: p.name,
					price: `₦${Number(p.price || 0).toLocaleString()}`,
					badge: idx === 0 ? "Featured" : "",
					desc: p.description || "Premium quality guaranteed.",
					image: p.image || defaultProducts[idx % defaultProducts.length].image,
			  }))
			: defaultProducts;

	const handleWhatsAppOrder = (productName: string, price: string) => {
		const message = encodeURIComponent(
			`Hello ${businessName}, I would like to order "${productName}" (${price}) from your website: ${publishedUrl}`,
		);
		window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
	};

	return (
		<div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-600 selection:text-white">
			{/* Top Announcement Bar */}
			<div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white text-xs font-bold py-2.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
				<Sparkles className="w-3.5 h-3.5" />
				<span>Fast Delivery Available Nationwide. Order Directly on WhatsApp!</span>
			</div>

			{/* Main Header / Navigation */}
			<header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-4">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-blue-500/20">
							{businessName.charAt(0).toUpperCase()}
						</div>
						<div>
							<h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white leading-tight">
								{businessName}
							</h1>
							<span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
								<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
								Verified Store
							</span>
						</div>
					</div>

					<a
						href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
							`Hello ${businessName}, I want to make an inquiry.`,
						)}`}
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md">
						<MessageCircle className="w-4 h-4" />
						<span className="hidden sm:inline">Chat on WhatsApp</span>
					</a>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative px-4 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto text-center space-y-6">
				<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-extrabold uppercase tracking-wider">
					<Zap className="w-3.5 h-3.5 text-blue-400" />
					<span>Bespoke Edition</span>
				</div>

				<h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
					{businessName}
				</h2>

				<p className="text-sm sm:text-lg text-slate-300 max-w-xl mx-auto font-medium">
					{tagline}
				</p>

				{/* Trust Badges */}
				<div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400">
					<div className="flex items-center gap-2">
						<ShieldCheck className="w-4 h-4 text-blue-400" />
						<span>100% Quality Guaranteed</span>
					</div>
					<div className="flex items-center gap-2">
						<Truck className="w-4 h-4 text-blue-400" />
						<span>Express Doorstep Delivery</span>
					</div>
					<div className="flex items-center gap-2">
						<Clock className="w-4 h-4 text-blue-400" />
						<span>Instant WhatsApp Support</span>
					</div>
				</div>
			</section>

			{/* Products Catalog Grid */}
			<section className="px-4 sm:px-8 py-12 max-w-6xl mx-auto space-y-8">
				<div className="flex items-center justify-between border-b border-slate-800 pb-4">
					<div>
						<h3 className="text-xl font-extrabold text-white">Our Featured Catalog</h3>
						<p className="text-xs text-slate-400">Tap any item to order immediately via WhatsApp</p>
					</div>
					<span className="text-xs font-bold text-slate-400">
						{displayProducts.length} Items Available
					</span>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{displayProducts.map((product) => (
						<div
							key={product.id}
							className="group bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10">
							<div className="space-y-4">
								<div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-800">
									<img
										src={product.image}
										alt={product.name}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									/>
									{product.badge && (
										<span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
											{product.badge}
										</span>
									)}
								</div>

								<div>
									<h4 className="font-bold text-white text-base group-hover:text-blue-300 transition-colors">
										{product.name}
									</h4>
									<p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.desc}</p>
								</div>
							</div>

							<div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between">
								<span className="text-lg font-black text-emerald-400">{product.price}</span>
								<button
									onClick={() => handleWhatsAppOrder(product.name, product.price)}
									className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-md">
									<MessageCircle className="w-3.5 h-3.5" />
									<span>Order on WhatsApp</span>
								</button>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Direct WhatsApp Contact CTA */}
			<section className="px-4 sm:px-8 py-16 max-w-4xl mx-auto">
				<div className="bg-gradient-to-br from-blue-900/60 to-slate-900 border border-blue-800/50 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
					<div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
						<MessageCircle className="w-6 h-6" />
					</div>

					<div className="space-y-2">
						<h3 className="text-2xl sm:text-3xl font-extrabold text-white">
							Have custom inquiries or special orders?
						</h3>
						<p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
							Chat directly with our representative on WhatsApp for instant inquiries, bulk pricing, or custom requests.
						</p>
					</div>

					<a
						href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
							`Hello ${businessName}, I would like to make a custom inquiry.`,
						)}`}
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all shadow-xl hover:scale-105">
						<span>Start WhatsApp Chat Now</span>
						<ArrowRight className="w-4 h-4" />
					</a>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-slate-900 px-4 sm:px-8 py-8 text-center text-xs text-slate-500">
				<p>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
				<p className="mt-2 text-[11px]">
					Powered by{" "}
					<a href="https://kioosk.online" className="text-blue-400 hover:underline">
						Kiosk
					</a>
				</p>
			</footer>
		</div>
	);
}
