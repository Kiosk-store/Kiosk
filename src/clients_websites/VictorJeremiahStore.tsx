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
	Search,
	Filter,
	Eye,
	ChevronRight,
	Phone,
	Mail,
	MapPin,
	Check,
} from "lucide-react";

export default function VictorJeremiahStore({
	tenantSlug,
	plan,
	content,
	publishedUrl,
}: CustomClientTemplateProps) {
	const businessName = content.businessName || "Victor Jeremiah & Co.";
	const tagline =
		content.tagline || "Curated Luxury Timepieces, Leather Goods & Contemporary Essentials";
	const whatsapp = content.whatsappNumber || "08116062226";
	const cleanPhone = whatsapp.replace(/[^0-9]/g, "");

	const [activeCategory, setActiveCategory] = useState("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedProductForModal, setSelectedProductForModal] = useState<any | null>(null);

	const categories = ["All", "Timepieces", "Leather Goods", "Eyewear", "Essentials"];

	const defaultCatalog = [
		{
			id: "1",
			name: "The Sovereign Chronograph (Midnight Edition)",
			category: "Timepieces",
			price: 85000,
			originalPrice: 110000,
			badge: "Best Seller",
			rating: 5.0,
			reviewsCount: 38,
			desc: "Precision automatic movement encased in sapphire crystal with surgical-grade 316L stainless steel and genuine Italian calfskin strap.",
			image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=85",
		},
		{
			id: "2",
			name: "Artisan Full-Grain Leather Briefcase",
			category: "Leather Goods",
			price: 95000,
			originalPrice: 125000,
			badge: "Staff Pick",
			rating: 4.9,
			reviewsCount: 24,
			desc: "Handcrafted vegetable-tanned leather briefcase engineered for laptops up to 16 inches with solid brass hardware.",
			image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&auto=format&fit=crop&q=85",
		},
		{
			id: "3",
			name: "Heritage Aviator Polarized Sunglasses",
			category: "Eyewear",
			price: 38000,
			originalPrice: 48000,
			badge: "Trending",
			rating: 4.8,
			reviewsCount: 19,
			desc: "Ultra-lightweight titanium frame with 100% UV400 polarized clarity lenses and scratch-resistant coating.",
			image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1000&auto=format&fit=crop&q=85",
		},
		{
			id: "4",
			name: "Grand Tourer Automatic (Emerald Dial)",
			category: "Timepieces",
			price: 115000,
			originalPrice: 145000,
			badge: "Limited Edition",
			rating: 5.0,
			reviewsCount: 42,
			desc: "Exquisite sunburst emerald dial with exhibition caseback, ceramic bezel, and 48-hour power reserve.",
			image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1000&auto=format&fit=crop&q=85",
		},
		{
			id: "5",
			name: "Minimalist RFID Leather Cardholder",
			category: "Leather Goods",
			price: 24000,
			originalPrice: 30000,
			badge: "Popular",
			rating: 4.9,
			reviewsCount: 65,
			desc: "Slimline 6-card profile with center cash compartment and built-in military-grade RFID signal shielding.",
			image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=1000&auto=format&fit=crop&q=85",
		},
		{
			id: "6",
			name: "Signature Matte Black Wireless Audio",
			category: "Essentials",
			price: 52000,
			originalPrice: 65000,
			badge: "New Arrival",
			rating: 4.8,
			reviewsCount: 29,
			desc: "Studio-grade active noise cancellation with 32-hour battery life and custom acoustic drivers.",
			image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=85",
		},
	];

	// Map content if user uploaded products in studio, otherwise use luxury curated catalog
	const catalog =
		content.products && content.products.length > 0
			? content.products.map((p, idx) => ({
					id: String(idx + 1),
					name: p.name,
					category: p.category || categories[(idx % (categories.length - 1)) + 1],
					price: Number(p.price || 50000),
					originalPrice: Math.round(Number(p.price || 50000) * 1.25),
					badge: idx === 0 ? "Featured" : idx === 1 ? "Best Seller" : "",
					rating: 4.9,
					reviewsCount: 15 + idx * 7,
					desc: p.description || "Crafted to the highest standards with exceptional durability.",
					image: p.image || defaultCatalog[idx % defaultCatalog.length].image,
			  }))
			: defaultCatalog;

	const filteredCatalog = catalog.filter((item) => {
		const matchesCategory = activeCategory === "All" || item.category === activeCategory;
		const matchesSearch =
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.desc.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	const handleWhatsAppOrder = (productName: string, price: number) => {
		const formattedPrice = `₦${price.toLocaleString()}`;
		const message = encodeURIComponent(
			`Hello ${businessName}! 👋\n\nI would like to order:\n📌 Item: *${productName}*\n💰 Price: *${formattedPrice}*\n🌐 Link: ${publishedUrl}\n\nPlease confirm availability and delivery details.`,
		);
		window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
	};

	return (
		<div className="min-h-screen bg-[#fafbfc] text-slate-900 font-montserrat antialiased selection:bg-slate-900 selection:text-white">
			{/* Top Notification Announcement Bar */}
			<div className="bg-slate-900 text-white text-[11px] font-semibold py-2.5 px-4 tracking-wide text-center flex items-center justify-center gap-2 border-b border-slate-800">
				<Sparkles className="w-3.5 h-3.5 text-amber-400" />
				<span>
					Complimentary Express Nationwide Delivery on all orders above ₦50,000.
				</span>
				<span className="hidden sm:inline text-slate-400">|</span>
				<span className="hidden sm:inline text-emerald-400 font-bold">
					Direct WhatsApp Order Processing
				</span>
			</div>

			{/* Main Navigation Header */}
			<header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
					{/* Brand Logo / Monogram */}
					<div className="flex items-center gap-3.5">
						{content.logoImage?.url ? (
							<img
								src={content.logoImage.url}
								alt={businessName}
								className="h-10 w-auto object-contain"
							/>
						) : (
							<div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-sm">
								{businessName.charAt(0).toUpperCase()}
							</div>
						)}

						<div>
							<h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none">
								{businessName}
							</h1>
							<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
								Official Flagship Store
							</span>
						</div>
					</div>

					{/* Center Navigation Links */}
					<nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
						<a href="#catalog" className="hover:text-slate-900 transition-colors">
							Collection
						</a>
						<a href="#benefits" className="hover:text-slate-900 transition-colors">
							Why Us
						</a>
						<a href="#reviews" className="hover:text-slate-900 transition-colors">
							Reviews
						</a>
						<a href="#contact" className="hover:text-slate-900 transition-colors">
							Contact
						</a>
					</nav>

					{/* WhatsApp Action Button */}
					<div className="flex items-center gap-3">
						<a
							href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
								`Hello ${businessName}, I would like to make an inquiry.`,
							)}`}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow-emerald-600/20 active:scale-95">
							<MessageCircle className="w-4 h-4 fill-white" />
							<span className="hidden sm:inline">WhatsApp Order</span>
						</a>
					</div>
				</div>
			</header>

			{/* Hero Editorial Section */}
			<section className="relative overflow-hidden bg-white border-b border-slate-200/90 pt-12 pb-16 sm:py-24">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
						{/* Text Column */}
						<div className="lg:col-span-7 space-y-6 text-center lg:text-left">
							<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-extrabold uppercase tracking-widest">
								<Sparkles className="w-3.5 h-3.5 text-amber-500" />
								<span>Signature Collection • {new Date().getFullYear()} Edition</span>
							</div>

							<h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
								Elevate Your Lifestyle With Exceptional Quality.
							</h2>

							<p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
								{tagline}
							</p>

							<div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
								<a
									href="#catalog"
									className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2">
									<span>Explore Products</span>
									<ArrowRight className="w-4 h-4" />
								</a>

								<a
									href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
										`Hello ${businessName}, I would like to speak with a concierge consultant.`,
									)}`}
									target="_blank"
									rel="noreferrer"
									className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-xs font-extrabold uppercase tracking-wider transition-all shadow-2xs flex items-center justify-center gap-2">
									<MessageCircle className="w-4 h-4 text-emerald-600" />
									<span>Chat With Us</span>
								</a>
							</div>

							{/* Authority Stats */}
							<div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
								<div>
									<p className="text-xl sm:text-2xl font-black text-slate-900">4,800+</p>
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
										Orders Fulfilled
									</p>
								</div>
								<div>
									<p className="text-xl sm:text-2xl font-black text-slate-900">4.9 / 5.0</p>
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
										Customer Rating
									</p>
								</div>
								<div>
									<p className="text-xl sm:text-2xl font-black text-slate-900">100%</p>
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
										Original Items
									</p>
								</div>
							</div>
						</div>

						{/* Hero Image Showcase */}
						<div className="lg:col-span-5 relative">
							<div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-slate-100 group">
								<img
									src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=85"
									alt={businessName}
									className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

								{/* Floating Featured Product Card */}
								<div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-xl flex items-center justify-between">
									<div>
										<span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-600">
											In Stock • Ready to Dispatch
										</span>
										<h4 className="font-extrabold text-xs text-slate-900">
											The Sovereign Chronograph
										</h4>
										<p className="text-xs font-black text-slate-900 mt-0.5">₦85,000</p>
									</div>
									<button
										onClick={() =>
											handleWhatsAppOrder("The Sovereign Chronograph", 85000)
										}
										className="p-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white transition-colors">
										<ShoppingBag className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Value Propositions & Guarantees */}
			<section id="benefits" className="py-12 bg-slate-50 border-b border-slate-200/90">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex items-start gap-4">
							<div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center shrink-0">
								<Truck className="w-6 h-6 text-slate-800" />
							</div>
							<div>
								<h4 className="font-extrabold text-sm text-slate-900">
									Nationwide Swift Delivery
								</h4>
								<p className="text-xs text-slate-500 mt-1 leading-relaxed">
									Tracked door-to-door delivery with protective packaging across all states.
								</p>
							</div>
						</div>

						<div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex items-start gap-4">
							<div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center shrink-0">
								<ShieldCheck className="w-6 h-6 text-slate-800" />
							</div>
							<div>
								<h4 className="font-extrabold text-sm text-slate-900">
									100% Quality Guaranteed
								</h4>
								<p className="text-xs text-slate-500 mt-1 leading-relaxed">
									Every piece undergoes rigorous quality inspection prior to packaging.
								</p>
							</div>
						</div>

						<div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex items-start gap-4">
							<div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center shrink-0">
								<Clock className="w-6 h-6 text-slate-800" />
							</div>
							<div>
								<h4 className="font-extrabold text-sm text-slate-900">
									Instant WhatsApp Service
								</h4>
								<p className="text-xs text-slate-500 mt-1 leading-relaxed">
									Direct communication with our dedicated support for quotes and inquiries.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Products Catalog Section */}
			<section id="catalog" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
				{/* Section Header */}
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
					<div>
						<div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
							<Sparkles className="w-3.5 h-3.5 text-amber-500" />
							<span>Curated Catalog</span>
						</div>
						<h3 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 mt-1">
							Featured Collection
						</h3>
					</div>

					{/* Search Input */}
					<div className="relative w-full md:w-72">
						<Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
						<input
							type="text"
							placeholder="Search products..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-9 pr-4 py-2.5 rounded-full border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-900 bg-white shadow-2xs"
						/>
					</div>
				</div>

				{/* Category Pill Filters */}
				<div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
					{categories.map((cat) => (
						<button
							key={cat}
							onClick={() => setActiveCategory(cat)}
							className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
								activeCategory === cat
									? "bg-slate-900 text-white shadow-sm"
									: "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
							}`}>
							{cat}
						</button>
					))}
				</div>

				{/* Product Grid */}
				{filteredCatalog.length === 0 ? (
					<div className="p-16 text-center bg-white border border-slate-200 rounded-3xl space-y-2">
						<ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
						<p className="text-sm font-bold text-slate-700">No items match your filter.</p>
						<button
							onClick={() => {
								setActiveCategory("All");
								setSearchQuery("");
							}}
							className="text-xs font-bold text-slate-900 underline">
							Reset filters
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
						{filteredCatalog.map((product) => (
							<div
								key={product.id}
								className="group bg-white border border-slate-200/90 rounded-3xl overflow-hidden hover:border-slate-900/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
								{/* Image Thumbnail with Badge */}
								<div className="relative aspect-square overflow-hidden bg-slate-100">
									<img
										src={product.image}
										alt={product.name}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									/>

									{product.badge && (
										<span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
											{product.badge}
										</span>
									)}

									{/* Quick View Trigger */}
									<button
										onClick={() => setSelectedProductForModal(product)}
										className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-xs text-slate-900 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer">
										<Eye className="w-4 h-4" />
									</button>
								</div>

								{/* Product Info & Order Action */}
								<div className="p-6 flex-1 flex flex-col justify-between space-y-4">
									<div className="space-y-2">
										<div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
											<span>{product.category}</span>
											<span className="flex items-center gap-1 text-amber-500">
												<Star className="w-3 h-3 fill-amber-400" />
												<span>{product.rating}</span>
											</span>
										</div>

										<h4 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
											{product.name}
										</h4>

										<p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
											{product.desc}
										</p>
									</div>

									{/* Price and CTA */}
									<div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
										<div>
											<div className="flex items-baseline gap-2">
												<span className="text-lg font-black text-slate-900">
													₦{product.price.toLocaleString()}
												</span>
												{product.originalPrice && (
													<span className="text-xs font-semibold text-slate-400 line-through">
														₦{product.originalPrice.toLocaleString()}
													</span>
												)}
											</div>
										</div>

										<button
											onClick={() => handleWhatsAppOrder(product.name, product.price)}
											className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer">
											<MessageCircle className="w-3.5 h-3.5 fill-white" />
											<span>Order</span>
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</section>

			{/* Customer Reviews Section */}
			<section id="reviews" className="py-16 bg-slate-50 border-t border-b border-slate-200/90">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
					<div className="text-center space-y-2">
						<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-widest">
							<Star className="w-3 h-3 fill-amber-500" />
							<span>Verified Buyer Feedback</span>
						</div>
						<h3 className="text-2xl sm:text-3xl font-black text-slate-900">
							Trusted by Customers Worldwide
						</h3>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-3">
							<div className="flex items-center gap-1 text-amber-500">
								{[...Array(5)].map((_, i) => (
									<Star key={i} className="w-4 h-4 fill-amber-400" />
								))}
							</div>
							<p className="text-xs text-slate-600 leading-relaxed font-medium">
								"Ordered the Sovereign Chronograph on WhatsApp and received it within 24 hours in Lagos. The build quality and packaging exceeded my expectations."
							</p>
							<div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
								<span className="font-extrabold text-slate-900">Adeola M.</span>
								<span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
									<CheckCircle2 className="w-3 h-3" /> Verified Order
								</span>
							</div>
						</div>

						<div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-3">
							<div className="flex items-center gap-1 text-amber-500">
								{[...Array(5)].map((_, i) => (
									<Star key={i} className="w-4 h-4 fill-amber-400" />
								))}
							</div>
							<p className="text-xs text-slate-600 leading-relaxed font-medium">
								"The leather briefcase has exceptional craftsmanship. You can tell real attention went into the stitching and hardware. 10/10 recommendation!"
							</p>
							<div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
								<span className="font-extrabold text-slate-900">Chukwudi E.</span>
								<span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
									<CheckCircle2 className="w-3 h-3" /> Verified Order
								</span>
							</div>
						</div>

						<div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-3">
							<div className="flex items-center gap-1 text-amber-500">
								{[...Array(5)].map((_, i) => (
									<Star key={i} className="w-4 h-4 fill-amber-400" />
								))}
							</div>
							<p className="text-xs text-slate-600 leading-relaxed font-medium">
								"Customer service on WhatsApp is super fast and polite. They helped me choose the exact gift piece for my partner. Will definitely buy again."
							</p>
							<div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
								<span className="font-extrabold text-slate-900">Folake A.</span>
								<span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
									<CheckCircle2 className="w-3 h-3" /> Verified Order
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Direct WhatsApp Call to Action Banner */}
			<section id="contact" className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-xl relative overflow-hidden">
					<div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
						<MessageCircle className="w-7 h-7 fill-white" />
					</div>

					<div className="space-y-2 max-w-xl mx-auto">
						<h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
							Looking For Custom Orders or Bulk Inquiries?
						</h3>
						<p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
							Connect directly with our sales team on WhatsApp for personalized recommendations, corporate gifting, or immediate order tracking.
						</p>
					</div>

					<div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
						<a
							href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
								`Hello ${businessName}, I would like to speak directly with your sales manager.`,
							)}`}
							target="_blank"
							rel="noreferrer"
							className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
							<MessageCircle className="w-4 h-4 fill-white" />
							<span>Start WhatsApp Chat</span>
						</a>

						<a
							href={`tel:${cleanPhone}`}
							className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2">
							<Phone className="w-4 h-4" />
							<span>Call Direct</span>
						</a>
					</div>
				</div>
			</section>

			{/* Clean Minimalist Footer */}
			<footer className="border-t border-slate-200 bg-white py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
							{businessName.charAt(0).toUpperCase()}
						</div>
						<p className="font-bold text-slate-900">
							© {new Date().getFullYear()} {businessName}. All rights reserved.
						</p>
					</div>

					<div className="flex items-center gap-6 font-semibold">
						<a href="#catalog" className="hover:text-slate-900 transition-colors">
							Store Collection
						</a>
						<a href="#benefits" className="hover:text-slate-900 transition-colors">
							Guarantees
						</a>
						<a
							href={`https://wa.me/${cleanPhone}`}
							target="_blank"
							rel="noreferrer"
							className="hover:text-slate-900 transition-colors text-emerald-600 font-bold">
							WhatsApp Support
						</a>
					</div>

					<div className="text-[11px] text-slate-400">
						<span>Powered by </span>
						<a
							href="https://kioosk.online"
							target="_blank"
							rel="noreferrer"
							className="font-bold text-slate-700 hover:text-blue-600 underline">
							Kiosk
						</a>
					</div>
				</div>
			</footer>

			{/* Quick View Product Modal Dialog */}
			{selectedProductForModal && (
				<div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
					<div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
						<div className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
							<img
								src={selectedProductForModal.image}
								alt={selectedProductForModal.name}
								className="w-full h-full object-cover"
							/>
						</div>

						<div className="space-y-2">
							<span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
								{selectedProductForModal.category}
							</span>
							<h4 className="text-xl font-extrabold text-slate-900">
								{selectedProductForModal.name}
							</h4>
							<p className="text-xs text-slate-600 leading-relaxed font-medium">
								{selectedProductForModal.desc}
							</p>
							<div className="pt-2 text-2xl font-black text-slate-900">
								₦{selectedProductForModal.price.toLocaleString()}
							</div>
						</div>

						<div className="flex items-center gap-3 pt-2">
							<button
								onClick={() => setSelectedProductForModal(null)}
								className="flex-1 py-3 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
								Close
							</button>

							<button
								onClick={() => {
									handleWhatsAppOrder(
										selectedProductForModal.name,
										selectedProductForModal.price,
									);
									setSelectedProductForModal(null);
								}}
								className="flex-1 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md">
								<MessageCircle className="w-4 h-4 fill-white" />
								<span>Order on WhatsApp</span>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
