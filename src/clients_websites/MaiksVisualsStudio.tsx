/** @format */

"use client";

import React, { useState } from "react";
import type { CustomClientTemplateProps } from "./index";
import {
	Camera,
	Film,
	Sparkles,
	Star,
	CheckCircle2,
	MessageCircle,
	ArrowRight,
	ShieldCheck,
	Clock,
	Search,
	Eye,
	Phone,
	Mail,
	MapPin,
	Calendar,
	Play,
	Award,
	Check,
	Heart,
	Layers,
	ExternalLink,
} from "lucide-react";

export default function MaiksVisualsStudio({
	tenantSlug,
	plan,
	content,
	publishedUrl,
}: CustomClientTemplateProps) {
	const businessName = content.businessName || "Maiks Visuals Studio";
	const tagline =
		content.tagline ||
		"Cinematography, High-Fashion Editorial Photography & High-Impact Brand Storytelling";
	const whatsapp = content.whatsappNumber || "08116062226";
	const cleanPhone = whatsapp.replace(/[^0-9]/g, "");

	const [activeCategory, setActiveCategory] = useState("All");
	const [selectedWorkModal, setSelectedWorkModal] = useState<any | null>(null);
	const [likedWorks, setLikedWorks] = useState<Record<string, boolean>>({});

	const categories = [
		"All",
		"Commercial & Brand",
		"Fashion & Editorial",
		"Events & Cinema",
		"Portraits",
	];

	const portfolioWorks = [
		{
			id: "1",
			title: "Vogue Noir: Haute Couture Campaign",
			category: "Fashion & Editorial",
			client: "Lagos Fashion Week Showcase",
			year: "2025",
			desc: "A dramatic visual study in high-contrast monochromatic lighting and bespoke styling for seasonal runway collection.",
			image:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=85",
			featured: true,
		},
		{
			id: "2",
			title: "Aura Premium Fragrance Commercial",
			category: "Commercial & Brand",
			client: "Aura Parfums Global",
			year: "2025",
			desc: "4K cinematic product commercial exploring sensory lighting, liquid dynamics, and ultra-macro visual motion.",
			image:
				"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=85",
			featured: true,
		},
		{
			id: "3",
			title: "The Royal Wedding Cinema",
			category: "Events & Cinema",
			client: "Dr. & Mrs. Adeleke",
			year: "2024",
			desc: "Full-length 4K cinematic documentary capture featuring multi-camera drone cinematography and master grade color grading.",
			image:
				"https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=85",
			featured: false,
		},
		{
			id: "4",
			title: "Solitude: Executive Architectural Series",
			category: "Commercial & Brand",
			client: "Urban Prime Realty",
			year: "2025",
			desc: "Architectural and interior space photography emphasizing geometric minimalism and ambient natural sunlight.",
			image:
				"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=85",
			featured: false,
		},
		{
			id: "5",
			title: "The Sovereign: Studio Portrait Collection",
			category: "Portraits",
			client: "Apex Executive Profiles",
			year: "2024",
			desc: "Intimate medium-format studio portraits capturing authentic personality, refined texture, and nuanced expression.",
			image:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=85",
			featured: false,
		},
		{
			id: "6",
			title: "Echoes of Culture Documentary",
			category: "Events & Cinema",
			client: "Heritage Arts Foundation",
			year: "2024",
			desc: "Immersive festival coverage highlighting traditional artistry, choreography, and rich cultural heritage in 4K HDR.",
			image:
				"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=85",
			featured: true,
		},
	];

	const packages = [
		{
			id: "pkg-1",
			name: "Studio Editorial & Executive Session",
			price: 120000,
			popular: false,
			tag: "Essential",
			duration: "2-3 Hours Studio Session",
			deliverables: [
				"Up to 3 Wardrobe Changes",
				"15 Master-Retouched High-Res Images",
				"Private Online Client Proofing Gallery",
				"Full Commercial Usage License",
				"Express 48-Hour Turnaround Available",
			],
		},
		{
			id: "pkg-2",
			name: "Brand Campaign & Product Cinema",
			price: 280000,
			popular: true,
			tag: "Most Requested",
			duration: "Full Day Production",
			deliverables: [
				"Creative Direction & Storyboarding",
				"30 High-Resolution Retouched Stills",
				"60-Second 4K Cinematic Brand Video",
				"Short-Form Social Media Cuts (9:16)",
				"Professional Studio & On-Location Lighting",
				"Master Color Grading & Audio Engineering",
			],
		},
		{
			id: "pkg-3",
			name: "Signature Wedding & Event Cinema",
			price: 450000,
			popular: false,
			tag: "Luxury Tier",
			duration: "Full Day Multi-Camera Coverage",
			deliverables: [
				"2 Senior Photographers + 2 Cinematographers",
				"4K Drone Aerial Videography",
				"Highlight Teaser Reel (3-5 mins)",
				"Full Extended Feature Film (30-60 mins)",
				"150+ Retouched Digital Art Photographs",
				"Custom Velvet Premium Photo Album",
			],
		},
	];

	const filteredWorks = portfolioWorks.filter((item) => {
		if (activeCategory === "All") return true;
		return item.category === activeCategory;
	});

	const toggleLike = (id: string) => {
		setLikedWorks((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const handleWhatsAppBooking = (packageName: string, price: number) => {
		const formattedPrice = `₦${price.toLocaleString()}`;
		const message = encodeURIComponent(
			`Hello ${businessName}! 🎬📸\n\nI would like to book the *${packageName}* (${formattedPrice}) from your studio website: ${publishedUrl}\n\nPlease check your schedule for my desired production date.`,
		);
		window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
	};

	const handleGeneralInquiry = () => {
		const message = encodeURIComponent(
			`Hello ${businessName}! I am reaching out to discuss a custom production / photoshoot project from your website: ${publishedUrl}`,
		);
		window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
	};

	return (
		<div className="min-h-screen bg-[#fafbfc] text-slate-900 font-montserrat antialiased selection:bg-slate-900 selection:text-white">
			{/* Top Announcement Bar */}
			<div className="bg-slate-900 text-white text-[11px] font-semibold py-2.5 px-4 tracking-wide text-center flex items-center justify-center gap-2 border-b border-slate-800">
				<Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
				<span>Now Booking 2025/2026 Commercial, Fashion & Event Productions Nationwide.</span>
				<span className="hidden sm:inline text-slate-500">|</span>
				<span className="hidden sm:inline text-emerald-400 font-bold">
					Direct WhatsApp Booking
				</span>
			</div>

			{/* Studio Navigation Header */}
			<header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
					{/* Brand Monogram */}
					<a href="#" className="flex items-center gap-3.5 group">
						<div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-600 group-hover:shadow-md">
							<Camera className="w-5 h-5 text-white" />
						</div>
						<div>
							<h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none transition-colors group-hover:text-blue-600">
								{businessName}
							</h1>
							<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
								Cinematography & Creative Direction
							</span>
						</div>
					</a>

					{/* Navigation Links */}
					<nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
						<a
							href="#portfolio"
							className="relative py-1 transition-colors hover:text-slate-900 group">
							<span>Portfolio</span>
							<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full" />
						</a>
						<a
							href="#services"
							className="relative py-1 transition-colors hover:text-slate-900 group">
							<span>Packages</span>
							<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full" />
						</a>
						<a
							href="#experience"
							className="relative py-1 transition-colors hover:text-slate-900 group">
							<span>Experience</span>
							<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full" />
						</a>
						<a
							href="#contact"
							className="relative py-1 transition-colors hover:text-slate-900 group">
							<span>Book Shoot</span>
							<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full" />
						</a>
					</nav>

					{/* Direct WhatsApp Action */}
					<div className="flex items-center gap-3">
						<button
							onClick={handleGeneralInquiry}
							className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-emerald-600/25 hover:-translate-y-0.5 active:scale-95 cursor-pointer">
							<MessageCircle className="w-4 h-4 fill-white transition-transform group-hover:rotate-12" />
							<span className="hidden sm:inline">Book on WhatsApp</span>
						</button>
					</div>
				</div>
			</header>

			{/* Hero Editorial Studio Showcase */}
			<section className="relative overflow-hidden bg-white border-b border-slate-200/90 pt-12 pb-16 sm:py-24">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
						{/* Text Column */}
						<div className="lg:col-span-7 space-y-6 text-center lg:text-left">
							<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-extrabold uppercase tracking-widest">
								<Award className="w-3.5 h-3.5 text-amber-500" />
								<span>Award-Winning Production Studio • 2025</span>
							</div>

							<h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08]">
								Crafting Timeless Visuals Through Cinematic Mastery.
							</h2>

							<p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
								{tagline}
							</p>

							<div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
								<a
									href="#services"
									className="group w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 hover:bg-blue-600 text-white text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-blue-600/20 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2">
									<span>View Packages & Pricing</span>
									<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
								</a>

								<button
									onClick={handleGeneralInquiry}
									className="group w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-2xs hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
									<MessageCircle className="w-4 h-4 text-emerald-600 transition-transform group-hover:scale-110" />
									<span>Chat With Director</span>
								</button>
							</div>

							{/* Studio Stats */}
							<div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
								<div className="p-3 rounded-2xl hover:bg-slate-50 transition-colors">
									<p className="text-xl sm:text-2xl font-black text-slate-900">180+</p>
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
										Shoots Completed
									</p>
								</div>
								<div className="p-3 rounded-2xl hover:bg-slate-50 transition-colors">
									<p className="text-xl sm:text-2xl font-black text-slate-900">4.9 / 5.0</p>
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
										Client Rating
									</p>
								</div>
								<div className="p-3 rounded-2xl hover:bg-slate-50 transition-colors">
									<p className="text-xl sm:text-2xl font-black text-slate-900">4K Cinema</p>
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
										Industry Grade
									</p>
								</div>
							</div>
						</div>

						{/* Hero Image Showcase */}
						<div className="lg:col-span-5 relative group">
							<div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-slate-100 transition-all duration-500 group-hover:shadow-3xl group-hover:border-slate-300">
								<img
									src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=85"
									alt={businessName}
									className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

								{/* Floating Studio Badge */}
								<div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-xl flex items-center justify-between transition-all duration-300 hover:scale-102 hover:bg-white">
									<div>
										<span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-600 flex items-center gap-1">
											<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
											Studio Spotlight
										</span>
										<h4 className="font-extrabold text-xs text-slate-900">
											Vogue Noir: Haute Couture Series
										</h4>
										<p className="text-[11px] font-bold text-slate-500 mt-0.5">
											Editorial & Runway Direction
										</p>
									</div>
									<button
										onClick={handleGeneralInquiry}
										className="p-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white transition-all duration-300 hover:scale-110 cursor-pointer">
										<Camera className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Studio Pillars & Guarantees */}
			<section id="experience" className="py-12 bg-slate-50 border-b border-slate-200/90">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="group p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:shadow-xl hover:border-slate-400 hover:-translate-y-1.5 transition-all duration-300 flex items-start gap-4">
							<div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-6">
								<Film className="w-6 h-6" />
							</div>
							<div>
								<h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
									Cinema-Grade Color Grading
								</h4>
								<p className="text-xs text-slate-500 mt-1 leading-relaxed">
									Custom DaVinci Resolve color profiles tailored for theatrical and broadcast distribution.
								</p>
							</div>
						</div>

						<div className="group p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:shadow-xl hover:border-slate-400 hover:-translate-y-1.5 transition-all duration-300 flex items-start gap-4">
							<div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-6">
								<Clock className="w-6 h-6" />
							</div>
							<div>
								<h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
									Express Turnaround Deliveries
								</h4>
								<p className="text-xs text-slate-500 mt-1 leading-relaxed">
									Fast preview drafts within 48 hours and final master files delivered via secure cloud.
								</p>
							</div>
						</div>

						<div className="group p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:shadow-xl hover:border-slate-400 hover:-translate-y-1.5 transition-all duration-300 flex items-start gap-4">
							<div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-6">
								<MessageCircle className="w-6 h-6" />
							</div>
							<div>
								<h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
									Direct WhatsApp Consultation
								</h4>
								<p className="text-xs text-slate-500 mt-1 leading-relaxed">
									Discuss mood boards, location scouting, and wardrobe direction directly with the director.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Portfolio Gallery Section */}
			<section id="portfolio" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
					<div>
						<div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
							<Sparkles className="w-3.5 h-3.5 text-amber-500" />
							<span>Featured Projects</span>
						</div>
						<h3 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 mt-1">
							Selected Studio Works
						</h3>
					</div>

					{/* Category Filter Pills */}
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
				</div>

				{/* Gallery Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{filteredWorks.map((work) => {
						const isLiked = likedWorks[work.id];

						return (
							<div
								key={work.id}
								className="group bg-white border border-slate-200/90 rounded-3xl overflow-hidden hover:border-slate-900/40 hover:shadow-2xl hover:shadow-slate-900/10 hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col justify-between">
								<div className="relative aspect-4/3 overflow-hidden bg-slate-100">
									<img
										src={work.image}
										alt={work.title}
										className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
									/>

									<span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
										{work.category}
									</span>

									{/* Wishlist / Favorite Heart */}
									<button
										onClick={() => toggleLike(work.id)}
										className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 shadow-md hover:bg-white hover:text-rose-600 hover:scale-115 active:scale-90 transition-all cursor-pointer">
										<Heart
											className={`w-4 h-4 ${
												isLiked ? "fill-rose-500 text-rose-500" : ""
											}`}
										/>
									</button>

									{/* Quick View Trigger Button */}
									<button
										onClick={() => setSelectedWorkModal(work)}
										className="absolute bottom-4 right-4 p-3 rounded-full bg-white/95 backdrop-blur-xs text-slate-900 shadow-lg opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-slate-900 hover:text-white hover:scale-110 active:scale-90 cursor-pointer">
										<Eye className="w-4 h-4" />
									</button>
								</div>

								<div className="p-6 flex-1 flex flex-col justify-between space-y-4">
									<div className="space-y-1.5">
										<div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
											<span>{work.client}</span>
											<span>{work.year}</span>
										</div>

										<h4 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
											{work.title}
										</h4>

										<p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
											{work.desc}
										</p>
									</div>

									<div className="pt-4 border-t border-slate-100 flex items-center justify-between">
										<button
											onClick={() => setSelectedWorkModal(work)}
											className="text-xs font-extrabold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer">
											<span>Project Breakdown</span>
											<ArrowRight className="w-3.5 h-3.5" />
										</button>

										<button
											onClick={() => {
												const msg = encodeURIComponent(
													`Hello ${businessName}! I saw your project "${work.title}" on your website (${publishedUrl}) and would like to produce something similar for my brand.`,
												);
												window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
											}}
											className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer">
											<MessageCircle className="w-3.5 h-3.5 fill-white" />
											<span>Inquire</span>
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</section>

			{/* Service Packages & Pricing */}
			<section id="services" className="py-16 sm:py-24 bg-slate-50 border-t border-b border-slate-200/90">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
					<div className="text-center space-y-3 max-w-2xl mx-auto">
						<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-extrabold uppercase tracking-widest">
							<Sparkles className="w-3.5 h-3.5 text-blue-600" />
							<span>Transparent Production Tiers</span>
						</div>
						<h3 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
							Production Packages & Rates
						</h3>
						<p className="text-xs sm:text-sm text-slate-500 font-medium">
							Choose a bespoke production tier tailored for personal branding, corporate commercial campaigns, or luxury events.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
						{packages.map((pkg) => (
							<div
								key={pkg.id}
								className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
									pkg.popular
										? "bg-slate-900 text-white shadow-2xl scale-102 border-2 border-blue-500 relative"
										: "bg-white text-slate-900 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-slate-300"
								}`}>
								{pkg.popular && (
									<span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
										Most Popular
									</span>
								)}

								<div className="space-y-6">
									<div>
										<span
											className={`text-[10px] font-black uppercase tracking-widest block ${
												pkg.popular ? "text-blue-400" : "text-slate-400"
											}`}>
											{pkg.tag}
										</span>
										<h4 className="text-lg font-black mt-1 leading-snug">{pkg.name}</h4>
										<p
											className={`text-xs mt-1 font-medium ${
												pkg.popular ? "text-slate-300" : "text-slate-500"
											}`}>
											{pkg.duration}
										</p>
									</div>

									<div className="pt-2">
										<div className="flex items-baseline gap-1">
											<span className="text-3xl font-black">
												₦{pkg.price.toLocaleString()}
											</span>
											<span
												className={`text-xs font-bold ${
													pkg.popular ? "text-slate-400" : "text-slate-400"
												}`}>
												/ project
											</span>
										</div>
									</div>

									{/* Deliverables List */}
									<div className="space-y-3 pt-4 border-t border-slate-200/30">
										{pkg.deliverables.map((item, idx) => (
											<div key={idx} className="flex items-start gap-2.5 text-xs">
												<CheckCircle2
													className={`w-4 h-4 shrink-0 mt-0.5 ${
														pkg.popular ? "text-emerald-400" : "text-emerald-600"
													}`}
												/>
												<span
													className={`font-medium leading-relaxed ${
														pkg.popular ? "text-slate-200" : "text-slate-600"
													}`}>
													{item}
												</span>
											</div>
										))}
									</div>
								</div>

								<div className="pt-8">
									<button
										onClick={() => handleWhatsAppBooking(pkg.name, pkg.price)}
										className={`w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
											pkg.popular
												? "bg-emerald-500 hover:bg-emerald-400 text-white"
												: "bg-slate-900 hover:bg-emerald-600 text-white"
										}`}>
										<MessageCircle className="w-4 h-4 fill-white" />
										<span>Book This Package</span>
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Direct WhatsApp Call to Action */}
			<section id="contact" className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-xl relative overflow-hidden group">
					<div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
						<MessageCircle className="w-7 h-7 fill-white" />
					</div>

					<div className="space-y-2 max-w-xl mx-auto">
						<h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
							Have a Custom Production or Film Concept?
						</h3>
						<p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
							Connect directly with Director Maik on WhatsApp for custom moodboard consultation, multi-day shoots, or international travel bookings.
						</p>
					</div>

					<div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
						<button
							onClick={handleGeneralInquiry}
							className="group/cta w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
							<MessageCircle className="w-4 h-4 fill-white transition-transform duration-300 group-hover/cta:rotate-12" />
							<span>Start WhatsApp Consultation</span>
						</button>

						<a
							href={`tel:${cleanPhone}`}
							className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 text-xs font-black uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
							<Phone className="w-4 h-4" />
							<span>Call Direct</span>
						</a>
					</div>
				</div>
			</section>

			{/* Clean Minimalist Studio Footer */}
			<footer className="border-t border-slate-200 bg-white py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
							M
						</div>
						<p className="font-bold text-slate-900">
							© {new Date().getFullYear()} {businessName}. All rights reserved.
						</p>
					</div>

					<div className="flex items-center gap-6 font-semibold">
						<a href="#portfolio" className="hover:text-slate-900 transition-colors">
							Portfolio
						</a>
						<a href="#services" className="hover:text-slate-900 transition-colors">
							Rates & Packages
						</a>
						<button
							onClick={handleGeneralInquiry}
							className="hover:text-emerald-700 transition-colors text-emerald-600 font-bold cursor-pointer">
							WhatsApp Inquiry
						</button>
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

			{/* Project Detail Lightbox Modal */}
			{selectedWorkModal && (
				<div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
					<div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
						<div className="aspect-16/10 rounded-2xl overflow-hidden bg-slate-100">
							<img
								src={selectedWorkModal.image}
								alt={selectedWorkModal.title}
								className="w-full h-full object-cover"
							/>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
								<span>{selectedWorkModal.category}</span>
								<span>{selectedWorkModal.year}</span>
							</div>
							<h4 className="text-xl font-extrabold text-slate-900">
								{selectedWorkModal.title}
							</h4>
							<p className="text-xs text-slate-600 leading-relaxed font-medium">
								{selectedWorkModal.desc}
							</p>
						</div>

						<div className="flex items-center gap-3 pt-2">
							<button
								onClick={() => setSelectedWorkModal(null)}
								className="flex-1 py-3 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer">
								Close
							</button>

							<button
								onClick={() => {
									const msg = encodeURIComponent(
										`Hello ${businessName}! I would like to book a shoot similar to "${selectedWorkModal.title}" from your website: ${publishedUrl}`,
									);
									window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
									setSelectedWorkModal(null);
								}}
								className="flex-1 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:shadow-emerald-600/30 transition-all">
								<MessageCircle className="w-4 h-4 fill-white" />
								<span>Inquire on WhatsApp</span>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
