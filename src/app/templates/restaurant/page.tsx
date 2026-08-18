/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PillButton from "@/components/PillButton";
import { Utensils, Calendar, Clock, MapPin, CheckCircle2, MessageCircle, Star } from "lucide-react";

export const dynamic = "force-dynamic";

const MENU_ITEMS = [
	{
		id: 1,
		name: "Truffle & Wild Mushroom Tagliatelle",
		category: "Mains",
		price: "$26.00",
		desc: "Handmade tagliatelle, black summer truffle butter, aged parmesan, and wild forest herbs.",
		tag: "CHEF FAVOURITE",
		icon: "🍝",
	},
	{
		id: 2,
		name: "Wood-Fired Burrata Caprese",
		category: "Starters",
		price: "$18.00",
		desc: "Fresh Puglia burrata, heirloom tomatoes, basil oil, and aged balsamic glaze.",
		tag: "POPULAR",
		icon: "🧀",
	},
	{
		id: 3,
		name: "Dry-Aged Ribeye Steak (300g)",
		category: "Mains",
		price: "$42.00",
		desc: "Grass-fed 28-day dry-aged beef, bone marrow jus, roasted garlic, and truffle fries.",
		tag: "SIGNATURE",
		icon: "🥩",
	},
	{
		id: 4,
		name: "Artisan Tiramisu Classico",
		category: "Desserts",
		price: "$12.00",
		desc: "Espresso-soaked savoiardi, mascarpone cream, and 70% dark cocoa powder.",
		tag: "SWEET",
		icon: "🍰",
	},
];

export default function RestaurantTemplate() {
	const [activeCategory, setActiveCategory] = useState<string>("All");
	const [isReservationOpen, setIsReservationOpen] = useState<boolean>(false);
	const [reservationConfirmed, setReservationConfirmed] = useState<boolean>(false);

	const filteredMenu =
		activeCategory === "All"
			? MENU_ITEMS
			: MENU_ITEMS.filter((item) => item.category === activeCategory);

	return (
		<main className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans">
			<Navbar />

			{/* Template Banner Notice */}
			<div className="bg-amber-700 text-white text-xs font-bold py-2.5 px-4 text-center sticky top-0 z-50 flex items-center justify-center gap-2">
				<Utensils className="w-4 h-4" />
				<span>Template Preview: Restaurant & Bistro (src/app/templates/restaurant)</span>
				<Link
					href="/checkout?plan=landing&billing=monthly"
					className="ml-3 bg-white text-amber-800 px-3 py-0.5 rounded-full font-extrabold uppercase text-[10px] hover:bg-amber-50 transition-colors">
					Use This Template →
				</Link>
			</div>

			{/* Hero Section */}
			<section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
				<div className="bg-stone-950 border border-stone-800 rounded-3xl p-8 sm:p-14 shadow-2xl space-y-8 relative overflow-hidden">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
						<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
						<span>RESTAURANT & BISTRO PRESET</span>
					</div>

					<div className="max-w-3xl space-y-4">
						<h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-nohemi text-white tracking-tight leading-tight">
							Artisan Culinary Dining & Table Reservations
						</h1>
						<p className="text-stone-400 text-sm sm:text-lg font-medium leading-relaxed">
							Savor handcrafted seasonal dishes, organic wines, and warm hospitality in an elegant atmosphere. Book your table or order direct on WhatsApp.
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-4 pt-2">
						<button
							type="button"
							onClick={() => setIsReservationOpen(true)}
							className="px-8 py-3.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors shadow-lg flex items-center gap-2 cursor-pointer">
							<Calendar className="w-4 h-4" />
							<span>Book A Table Now</span>
						</button>

						<a
							href="https://wa.me/1234567890"
							target="_blank"
							rel="noopener noreferrer"
							className="px-6 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors inline-flex items-center gap-2 shadow-md">
							<MessageCircle className="w-4 h-4" />
							<span>WhatsApp Order</span>
						</a>
					</div>

					<div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-stone-400 font-semibold border-t border-stone-800">
						<span className="flex items-center gap-1.5">
							<Clock className="w-4 h-4 text-amber-500" />
							<span>Open Today: 12:00 PM – 11:00 PM</span>
						</span>
						<span className="flex items-center gap-1.5">
							<MapPin className="w-4 h-4 text-amber-500" />
							<span>45 Gourmet Street, Downtown</span>
						</span>
					</div>
				</div>
			</section>

			{/* Categorized Food Menu */}
			<section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
					<div>
						<h2 className="text-2xl sm:text-3xl font-bold font-nohemi text-white">
							Our Seasonal Food Menu
						</h2>
						<p className="text-xs sm:text-sm text-stone-400 font-medium mt-1">
							Fresh ingredients sourced daily from local organic farms.
						</p>
					</div>

					{/* Category Tabs */}
					<div className="flex items-center gap-2 overflow-x-auto scrollbar-none max-w-full p-1 bg-stone-950 border border-stone-800 rounded-2xl">
						{["All", "Starters", "Mains", "Desserts"].map((cat) => (
							<button
								key={cat}
								type="button"
								onClick={() => setActiveCategory(cat)}
								className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
									activeCategory === cat
										? "bg-amber-600 text-white shadow-md"
										: "text-stone-400 hover:text-white"
								}`}>
								{cat}
							</button>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{filteredMenu.map((item) => (
						<div
							key={item.id}
							className="bg-stone-950 border border-stone-800 rounded-3xl p-6 shadow-xl flex items-start gap-4 hover:border-amber-600/50 transition-colors">
							<span className="text-4xl p-3 bg-stone-900 border border-stone-800 rounded-2xl shrink-0">{item.icon}</span>
							<div className="space-y-2 flex-1">
								<div className="flex items-center justify-between">
									<h3 className="text-base font-bold text-white">{item.name}</h3>
									<span className="text-base font-bold font-mono text-amber-400 ml-2">{item.price}</span>
								</div>
								<p className="text-xs text-stone-400 font-medium leading-relaxed">{item.desc}</p>
								<span className="inline-block text-[9px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/30">
									{item.tag}
								</span>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Reservation Modal */}
			{isReservationOpen && (
				<div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
					<div className="w-full max-w-md bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
						<div className="flex items-center justify-between border-b border-stone-800 pb-4">
							<div className="flex items-center gap-2">
								<Calendar className="w-5 h-5 text-amber-500" />
								<h3 className="text-lg font-bold font-nohemi text-white">Table Reservation</h3>
							</div>
							<button
								type="button"
								onClick={() => setIsReservationOpen(false)}
								className="text-xs font-bold text-stone-400 hover:text-white cursor-pointer">
								Close ✕
							</button>
						</div>

						{reservationConfirmed ? (
							<div className="p-6 rounded-2xl bg-amber-950/60 border border-amber-500/30 text-center space-y-2">
								<CheckCircle2 className="w-8 h-8 text-amber-400 mx-auto" />
								<p className="text-sm font-bold text-white">Reservation Confirmed!</p>
								<p className="text-xs text-stone-400">A confirmation SMS & WhatsApp message has been sent to your phone.</p>
							</div>
						) : (
							<form onSubmit={(e) => { e.preventDefault(); setReservationConfirmed(true); }} className="space-y-4">
								<div>
									<label className="block text-xs font-bold text-stone-400 mb-1">Your Name</label>
									<input
										type="text"
										required
										placeholder="Sarah Jenkins"
										className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-600 focus:ring-2 focus:ring-amber-500 focus:outline-none"
									/>
								</div>

								<div>
									<label className="block text-xs font-bold text-stone-400 mb-1">Guests & Time</label>
									<select className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:ring-2 focus:ring-amber-500 focus:outline-none">
										<option>2 Guests — 7:00 PM Today</option>
										<option>4 Guests — 8:00 PM Today</option>
										<option>6 Guests — 8:30 PM Tomorrow</option>
									</select>
								</div>

								<button
									type="submit"
									className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer">
									Confirm Table Reservation
								</button>
							</form>
						)}
					</div>
				</div>
			)}

			<Footer />
		</main>
	);
}
