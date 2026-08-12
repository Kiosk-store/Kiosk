/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PillButton from "@/components/PillButton";
import { ShoppingBag, CheckCircle2, ShoppingCart, Trash2, ShieldCheck, CreditCard, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const DEMO_PRODUCTS = [
	{ id: 1, name: "Artisan Espresso Bean Blend", price: 24.0, category: "Coffee", image: "☕" },
	{ id: 2, name: "Single Origin Roast", price: 28.0, category: "Coffee", image: "🫘" },
	{ id: 3, name: "Ceramic Pour-Over Dripper", price: 35.0, category: "Equipment", image: "🏺" },
	{ id: 4, name: "Precision Coffee Scale", price: 42.0, category: "Equipment", image: "⚖️" },
];

export default function EcommerceTemplate() {
	const [cart, setCart] = useState<typeof DEMO_PRODUCTS>([]);
	const [isCartOpen, setIsCartOpen] = useState(false);

	const addToCart = (product: (typeof DEMO_PRODUCTS)[number]) => {
		setCart((prev) => [...prev, product]);
		setIsCartOpen(true);
	};

	const removeFromCart = (index: number) => {
		setCart((prev) => prev.filter((_, i) => i !== index));
	};

	const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

	return (
		<main className="min-h-screen bg-slate-50 flex flex-col font-sans">
			<Navbar />

			{/* Template Banner Notice */}
			<div className="bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 text-center sticky top-0 z-50 flex items-center justify-center gap-2">
				<ShoppingBag className="w-4 h-4" />
				<span>Template Preview: E-Commerce Storefront Tier 03 (src/app/templates/ecommerce)</span>
				<Link
					href="/checkout?plan=store&billing=monthly"
					className="ml-3 bg-white text-emerald-700 px-3 py-0.5 rounded-full font-extrabold uppercase text-[10px] hover:bg-emerald-50 transition-colors">
					Use This Template →
				</Link>
			</div>

			{/* Header */}
			<section className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex items-center justify-between">
				<div>
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
						<span>Tier 03 E-Commerce Template</span>
					</div>
					<h1 className="text-3xl sm:text-4xl font-bold font-nohemi text-slate-900">
						Digital Storefront & Cart Drawer
					</h1>
				</div>

				<button
					type="button"
					onClick={() => setIsCartOpen(true)}
					className="relative p-3 rounded-2xl bg-white border border-slate-200 shadow-xs hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer">
					<ShoppingCart className="w-5 h-5 text-slate-700" />
					<span className="text-xs font-bold text-slate-900 hidden sm:inline">Cart</span>
					{cart.length > 0 && (
						<span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
							{cart.length}
						</span>
					)}
				</button>
			</section>

			{/* Product Catalog Grid */}
			<section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{DEMO_PRODUCTS.map((product) => (
					<div
						key={product.id}
						className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group">
						<div>
							<div className="w-full h-40 rounded-2xl bg-slate-100 flex items-center justify-center text-4xl mb-4 group-hover:scale-105 transition-transform">
								{product.image}
							</div>
							<span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
								{product.category}
							</span>
							<h3 className="text-sm font-bold text-slate-900 mt-2">{product.name}</h3>
						</div>

						<div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
							<span className="text-base font-bold font-mono text-slate-900">${product.price.toFixed(2)}</span>
							<button
								type="button"
								onClick={() => addToCart(product)}
								className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-colors cursor-pointer">
								Add to Cart
							</button>
						</div>
					</div>
				))}
			</section>

			{/* Slide-out Cart Drawer Modal */}
			{isCartOpen && (
				<div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
					<div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
						<div className="space-y-6 overflow-y-auto flex-1">
							<div className="flex items-center justify-between border-b border-slate-100 pb-4">
								<div className="flex items-center gap-2">
									<ShoppingCart className="w-5 h-5 text-emerald-600" />
									<h3 className="text-lg font-bold font-nohemi text-slate-900">Your Shopping Cart</h3>
								</div>
								<button
									type="button"
									onClick={() => setIsCartOpen(false)}
									className="text-xs font-bold text-slate-400 hover:text-slate-700">
									Close ✕
								</button>
							</div>

							{cart.length === 0 ? (
								<p className="text-xs text-slate-400 text-center py-12">Your cart is empty. Click &quot;Add to Cart&quot; to test items.</p>
							) : (
								<div className="space-y-3">
									{cart.map((item, idx) => (
										<div key={`${item.id}-${idx}`} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
											<div className="flex items-center gap-3">
												<span className="text-xl">{item.image}</span>
												<div>
													<p className="font-bold text-slate-900">{item.name}</p>
													<p className="font-mono text-slate-500">${item.price.toFixed(2)}</p>
												</div>
											</div>
											<button
												type="button"
												onClick={() => removeFromCart(idx)}
												className="text-rose-500 hover:text-rose-700 p-1">
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Cart Footer */}
						<div className="pt-4 border-t border-slate-100 space-y-4">
							<div className="flex items-center justify-between text-sm font-bold text-slate-900">
								<span>Subtotal</span>
								<span className="font-mono">${cartTotal.toFixed(2)}</span>
							</div>

							<PillButton
								href="/checkout?plan=store&billing=monthly"
								baseColor="#004ac6"
								circleColor="#ffffff"
								textColor="#ffffff"
								hoverTextColor="#004ac6"
								useThunderFont={true}
								className="w-full py-3 text-xs font-bold border border-blue-600 shadow-md text-center">
								Proceed to E-Commerce Checkout
							</PillButton>
						</div>
					</div>
				</div>
			)}

			<Footer />
		</main>
	);
}
