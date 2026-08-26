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
	Heart,
	TrendingUp,
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
	const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});

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

	const toggleLike = (id: string) => {
		setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
	};

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
				<Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
				<span>
					Complimentary Express Nationwide Delivery on all orders above ₦50,000.
				</span>
				<span className="hidden sm:inline text-slate-500">|</span>
				<span className="hidden sm:inline text-emerald-400 font-bold">
					Direct WhatsApp Order Processing
				</span>
			</div>

			{/* Main Navigation Header */}
			<header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
					{/* Brand Logo / Monogram */}
					<a href="#" className="flex items-center gap-3.5 group">
						{content.logoImage?.url ? (
							<img
								src={content.logoImage.url}
								alt={businessName}
								className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
							/>
						) : (
							<div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-600 group-hover:shadow-md">
								{businessName.charAt(0).toUpperCase()}
							</div>
						)}

						<div>
							<h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none transition-colors duration-200 group-hover:text-blue-600">
								{businessName}
							</h1>
							<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
								Official Flagship Store
							</span>
						</div>
					</a>

					{/* Center Navigation Links */}
					<nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
						<a
							href="#catalog"
							className="relative py-1 transition-colors hover:text-slate-900 group">
							<span>Collection</span>
							<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full" />
						</a>
						<a
							href="#benefits"
							className="relative py-1 transition-colors hover:text-slate-900 group">
							<span>Why Us</span>
							<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full" />
						</a>
						<a
							href="#reviews"
							className="relative py-1 transition-colors hover:text-slate-900 group">
							<span>Reviews</span>
							<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full" />
						</a>
						<a
							href="#contact"
							className="relative py-1 transition-colors hover:text-slate-900 group">
							<span>Contact</span>
							<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full" />
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
							className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-emerald-600/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-95">
							<MessageCircle className="w-4 h-4 fill-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
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
							<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-extrabold uppercase tracking-widest hover:bg-slate-200/70 transition-colors cursor-default">
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
									className="group w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 hover:bg-blue-600 text-white text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-blue-600/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center gap-2">
									<span>Explore Products</span>
									<ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
								</a>

								<a
									href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
										`Hello ${businessName}, I would like to speak with a concierge consultant.`,
									)}`}
									target="_blank"
									rel="noreferrer"
									className="group w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center gap-2">
									<MessageCircle className="w-4 h-4 text-emerald-600 transition-transform duration-300 group-hover:scale-110" />
									<span>Chat With Us</span>
								</a>
							</div>

							{/* Authority Stats */}
							<div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
								<div className="p-3 rounded-2xl hover:bg-slate-50 transition-colors">
									<p className="text-xl sm:text-2xl font-black text-slate-900">4,800+</p>
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
										Orders Fulfilled
									</p>
								</div>
								<div className="p-3 rounded-2xl hover:bg-slate-50 transition-colors">
									<p className="text-xl sm:text-2xl font-black text-slate-900">4.9 / 5.0</p>
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
										Customer Rating
									</p>
								</div>
								<div className="p-3 rounded-2xl hover:bg-slate-50 transition-colors">
									<p className="text-xl sm:text-2xl font-black text-slate-900">100%</p>
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
										Original Items
									</p>
								</div>
							</div>
						</div>

						{/* Hero Image Showcase */}
						<div className="lg:col-span-5 relative group">
							<div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-slate-100 transition-all duration-500 group-hover:shadow-3xl group-hover:border-slate-300">
								<img
									src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=85"
									alt={businessName}
									className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

								{/* Floating Featured Product Card */}
								<div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-xl flex items-center justify-between transition-all duration-300 hover:scale-102 hover:bg-white">
									<div>
										<span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-600 flex items-center gap-1">
											<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
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
										className="p-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white transition-all duration-300 hover:scale-110 hover:shadow-md cursor-pointer">
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
						<div className="group p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:shadow-xl hover:border-slate-400 hover:-translate-y-1.5 transition-all duration-300 flex items-start gap-4 cursor-default">
							<div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-6">
								<Truck className="w-6 h-6" />
							</div>
							<div>
								<h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
									Nationwide Swift Delivery
								</h4>
								<p className="text-xs text-slate-500 mt-1 leading-relaxed">
									Tracked door-to-door delivery with protective packaging across all states.
								</p>
							</div>
						</div>

						<div className="group p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:shadow-xl hover:border-slate-400 hover:-translate-y-1.5 transition-all duration-300 flex items-start gap-4 cursor-default">
							<div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-6">
								<ShieldCheck className="w-6 h-6" />
							</div>
							<div>
								<h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
									100% Quality Guaranteed
								</h4>
								<p className="text-xs text-slate-500 mt-1 leading-relaxed">
									Every piece undergoes rigorous quality inspection prior to packaging.
								</p>
							</div>
						</div>

						<div className="group p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:shadow-xl hover:border-slate-400 hover:-translate-y-1.5 transition-all duration-300 flex items-start gap-4 cursor-default">
							<div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-6">
								<Clock className="w-6 h-6" />
							</div>
							<div>
								<h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
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
					<div className="relative w-full md:w-72 group">
						<Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-slate-900" />
						<input
							type="text"
							placeholder="Search products..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-9 pr-4 py-2.5 rounded-full border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 bg-white shadow-2xs transition-all"
						/>
					</div>
				</div>

				{/* Category Pill Filters */}
				<div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
					{categories.map((cat) => (
						<button
							key={cat}
							onClick={() => setActiveCategory(cat)}
							className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
								activeCategory === cat
									? "bg-slate-900 text-white shadow-md scale-102"
									: "bg-white text-slate-600 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 hover:scale-105 active:scale-95"
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
							className="text-xs font-bold text-slate-900 underline hover:text-blue-600 transition-colors">
							Reset filters
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
						{filteredCatalog.map((product) => {
							const isLiked = likedItems[product.id];

							return (
								<div
									key={product.id}
									className="group bg-white border border-slate-200/90 rounded-3xl overflow-hidden hover:border-slate-900/40 hover:shadow-2xl hover:shadow-slate-900/10 hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col justify-between">
									{/* Image Thumbnail with Badge & Quick Actions */}
									<div className="relative aspect-square overflow-hidden bg-slate-100">
										<img
											src={product.image}
											alt={product.name}
											className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
										/>

										{product.badge && (
											<span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm transition-transform duration-300 group-hover:scale-105">
												{product.badge}
											</span>
										)}

										{/* Top Right Like Button */}
										<button
											onClick={() => toggleLike(product.id)}
											className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 shadow-md hover:bg-white hover:text-rose-600 hover:scale-115 active:scale-90 transition-all cursor-pointer">
											<Heart
												className={`w-4 h-4 ${
													isLiked ? "fill-rose-500 text-rose-500" : ""
												}`}
											/>
										</button>

										{/* Quick View Trigger Button */}
										<button
											onClick={() => setSelectedProductForModal(product)}
											className="absolute bottom-4 right-4 p-3 rounded-full bg-white/95 backdrop-blur-xs text-slate-900 shadow-lg opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-slate-900 hover:text-white hover:scale-110 active:scale-90 cursor-pointer">
											<Eye className="w-4 h-4" />
										</button>
									</div>

									{/* Product Info & Order Action */}
									<div className="p-6 flex-1 flex flex-col justify-between space-y-4">
										<div className="space-y-2">
											<div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
												<span className="uppercase tracking-wider">
													{product.category}
												</span>
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

										{/* Price and CTA Button */}
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
												onClick={() =>
													handleWhatsAppOrder(product.name, product.price)
												}
												className="group/btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-emerald-600/30 hover:scale-105 active:scale-95 cursor-pointer">
												<MessageCircle className="w-3.5 h-3.5 fill-white transition-transform duration-300 group-hover/btn:rotate-12" />
												<span>Order</span>
											</button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</section>

			{/* Customer Reviews Section */}
			<section id="reviews" className="py-16 bg-slate-50 border-t border-b border-slate-200/90">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
					<div className="text-center space-y-2">
						<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-200/80 transition-colors">
							<Star className="w-3 h-3 fill-amber-500" />
							<span>Verified Buyer Feedback</span>
						</div>
						<h3 className="text-2xl sm:text-3xl font-black text-slate-900">
							Trusted by Customers Worldwide
						</h3>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 space-y-3">
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

						<div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 space-y-3">
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

						<div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 space-y-3">
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
				<div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-xl relative overflow-hidden group">
					<div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
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
							className="group/cta w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
							<MessageCircle className="w-4 h-4 fill-white transition-transform duration-300 group-hover/cta:rotate-12" />
							<span>Start WhatsApp Chat</span>
						</a>

						<a
							href={`tel:${cleanPhone}`}
							className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 text-xs font-black uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
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
						<a
							href="#catalog"
							className="hover:text-slate-900 transition-colors relative group">
							<span>Store Collection</span>
						</a>
						<a
							href="#benefits"
							className="hover:text-slate-900 transition-colors relative group">
							<span>Guarantees</span>
						</a>
						<a
							href={`https://wa.me/${cleanPhone}`}
							target="_blank"
							rel="noreferrer"
							className="hover:text-emerald-700 transition-colors text-emerald-600 font-bold">
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
								className="flex-1 py-3 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer">
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
								className="flex-1 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:shadow-emerald-600/30 transition-all">
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
