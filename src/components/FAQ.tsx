/** @format */

"use client";

// FAQ
//
// Accessible accordion for frequently asked questions. Keeps state
// locally and toggles expanded items for each question.
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import LottiePlayer from "./LottiePlayer";

const faqItems = [
	{
		icon: "rocket_launch",
		question: "Why Kiosk instead of building it myself?",
		answer:
			"Most small business owners don't have the time, design skill, or desire to learn a website builder - and they shouldn't have to. Kiosk exists to remove that barrier entirely: you tell us about your business, and our team personalizes a proven, professionally designed page for you. You get the speed and affordability of a templated platform, with a real team doing the work instead of you.",
	},
	{
		icon: "verified_user",
		question: "Do I own my site and content?",
		answer:
			"Your business, brand, and content are 100% yours - always. Kiosk builds and hosts your site on our platform, similar to how a Shopify or Squarespace site works, so you get a professional, fully managed site without needing to manage code, servers, or updates yourself. If you ever want to leave, we'll help you transition your content elsewhere.",
	},
	{
		icon: "timer",
		question: "How fast can my site actually go live?",
		answer:
			"Fast is core to why we exist. Most Landing Pages and Sales Funnels are live within 3–5 business days, and E-commerce Stores within 5–10 days depending on catalog size. Because we personalize proven, pre-built templates rather than coding from scratch, we can move quickly without cutting corners on quality.",
	},
	{
		icon: "language",
		question: "Can I use my existing custom domain?",
		answer:
			"Absolutely. Every site launches on a free Kiosk subdomain (yourbusiness.kioosk.online) so you're live immediately, and you can connect your own custom domain any time as your business grows - from GoDaddy, Namecheap, Google, or another registrar. We'll walk you through the setup.",
	},
	{
		icon: "compare_arrows",
		question: "What's the difference between the three plans?",
		answer:
			"Landing Page is a single, high-converting page - perfect for a first professional presence. Sales Funnel adds multiple connected pages, lead capture, and email integration for businesses actively driving traffic. E-commerce Store adds a full product catalog, cart, and checkout for businesses ready to sell online. All three grow with you - upgrading tiers later is seamless.",
	},
];

export default function FAQ() {
	const [openIndex, setOpenIndex] = useState<number>(0);

	const toggleAccordion = (index: number) => {
		setOpenIndex((prev) => (prev === index ? -1 : index));
	};

	return (
		<section
			id="faq"
			className="py-20 md:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-surface relative overflow-hidden">
			{/* Subtle Professional Background Elements */}
			<div className="absolute inset-0 pointer-events-none" aria-hidden="true">
				{/* Soft Grid Pattern */}
				<div 
					className="absolute inset-0 opacity-[0.03]" 
					style={{
						backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
						backgroundSize: '4rem 4rem',
						maskImage: 'radial-gradient(ellipse 60% 80% at 50% 50%, #000 10%, transparent 100%)',
						WebkitMaskImage: 'radial-gradient(ellipse 60% 80% at 50% 50%, #000 10%, transparent 100%)'
					}}
				/>
				{/* Ambient Glows */}
				<div className="absolute top-0 left-1/4 w-3/4 max-w-3xl h-[600px] bg-primary/[0.03] blur-[120px] rounded-full -translate-y-1/2" />
				<div className="absolute bottom-0 right-1/4 w-3/4 max-w-3xl h-[600px] bg-blue-500/[0.02] blur-[120px] rounded-full translate-y-1/2" />
			</div>

			<div className="max-w-7xl mx-auto relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
					{/* Left Column: Lottie & Header (Sticky on Desktop) */}
					<div className="lg:sticky lg:top-32 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
						<ScrollReveal direction="fade" duration={1000}>
							<div className="w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[420px] h-[240px] sm:h-[300px] lg:h-[380px] mb-8 mx-auto lg:mx-0 flex items-center justify-center">
								<LottiePlayer
									src="/lotties/Question.json"
									className="w-full h-full object-contain drop-shadow-xl"
									loop={true}
									autoplay={true}
								/>
							</div>
						</ScrollReveal>
						
						<ScrollReveal direction="up" delay={150}>
							<h2 className="font-section-heading text-on-surface mb-5 leading-tight">
								Frequently Asked <br className="hidden lg:block" /> Questions
							</h2>
							<p className="font-body-lead max-w-md mx-auto lg:mx-0 opacity-80">
								Got questions? We&apos;ve got clear, straightforward answers to get you launched with total confidence.
							</p>
						</ScrollReveal>
					</div>

					{/* Right Column: Accordion List */}
					<div className="pt-4 lg:pt-0">
						<div className="border-t border-outline-variant/40">
							{faqItems.map((item, index) => {
								const isOpen = openIndex === index;

								return (
									<ScrollReveal
										key={item.question}
										direction="up"
										delay={index * 80}>
										<div
											className={`border-b border-outline-variant/40 transition-colors duration-500 overflow-hidden ${
												isOpen
													? "bg-primary/[0.02]"
													: "hover:bg-surface-variant/30"
											}`}>
											<button
												onClick={() => toggleAccordion(index)}
												className="w-full py-6 md:py-8 px-4 sm:px-6 flex items-start justify-between gap-6 text-left cursor-pointer transition-colors"
												aria-expanded={isOpen}>
												<div className="flex gap-5">
													<div
														className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 mt-0.5 ${
															isOpen
																? "bg-primary text-on-primary shadow-md shadow-primary/20 scale-110"
																: "bg-surface-variant text-on-surface-variant"
														}`}>
														<span className="material-symbols-outlined text-[20px]">
															{item.icon}
														</span>
													</div>
													<span
														className={`font-card-title text-lg md:text-xl transition-colors duration-300 leading-tight ${
															isOpen ? "text-primary" : "text-on-surface"
														}`}>
														{item.question}
													</span>
												</div>

												<span
													className={`material-symbols-outlined text-3xl transition-transform duration-500 shrink-0 ${
														isOpen
															? "rotate-180 text-primary"
															: "text-on-surface-variant"
													}`}>
													expand_more
												</span>
											</button>

											<div
												className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
													isOpen
														? "grid-rows-[1fr] opacity-100 px-4 sm:px-6 pb-6 md:pb-8"
														: "grid-rows-[0fr] opacity-0 px-4 sm:px-6"
												}`}>
												<div className="overflow-hidden">
													<p className="text-on-surface-variant text-[15px] md:text-base leading-relaxed pl-15 md:pl-[60px] max-w-[95%]">
														{item.answer}
													</p>
												</div>
											</div>
										</div>
									</ScrollReveal>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
