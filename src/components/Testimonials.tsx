/** @format */

// Testimonials
//
// Client quotes and a visual showcase. Lightweight component using
// `next/image` for performance and simple mapping of testimonial data.
import Image from "next/image";

const testimonials = [
	{
		quote:
			"They took the stress out of tech completely. I finally have a website that looks like I spent $10k+ on it, but without the hassle or high costs.",
		name: "Sarah Jenkins",
		role: "Owner, Bloom Florals",
		rating: 5,
		avatar:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuBmCPXILYFOzJvqBpUit0X12WPNcHvYojf2FmRHkuO3HxQAJxA5g4ruS5zptEOC8B_Rum-7mzKtaQ6RAilioPNkfEbYVo4h4etxB4uytqxosxMfBALmwiNt5mZOjGOoH8WgdAUcGEpASUGgZ0BLotu0mrxwLXTim-RJxFdo86Rvn-FVp9vHq8DnC7fEdu1CaZFLe_6yvLh3r-PrLoyJAeQ9BB8bQteASRd3njNBrSjoERPlnpLM7EUs",
		avatarAlt: "Portrait of Sarah Jenkins",
	},
	{
		quote:
			"Our sales tripled within 60 days after migrating to the Kiosk platform. The mobile conversion experience is simply flawless.",
		name: "Michael Chen",
		role: "Founder, TechFix",
		rating: 5,
		avatar:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCGAaTYB1pT6XxvD-KtcsOOScky3nqNq6cO1vV0PrWkDBZ81BFvWm8yx6kfsf-PRA-MOhwrvgRng3QO-pGMnX3pTyIUUU11prufdpTVjCNoBjhxM4yIqTjZAPgmaDQSZcNTEvpW7aLCfDccvz1eN2l9omxYdSEC_llaCu83qsYcKq1ADESewQz0h7cFpUlZTrJwF5LGGhCYs5xG1V_uEHLNUfErKsrH4iHHEBAz_A4JN3lvkle871sk",
		avatarAlt: "Portrait of Michael Chen",
	},
];

export default function Testimonials() {
	return (
		<section className="py-20 md:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest relative overflow-hidden">
			{/* Background Accent */}
			<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
				{/* Left Column: Heading & Reviews */}
				<div className="lg:col-span-7 space-y-8">
					<div>
						<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
							Real Partner Stories
						</div>
						<h2 className="font-section-heading text-on-surface">
							Loved by business owners who mean business
						</h2>
					</div>

					<div className="grid grid-cols-1 gap-6">
						{testimonials.map((t) => (
							<div
								key={t.name}
								className="bg-surface p-8 rounded-[28px] border border-outline-variant/40 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative group">
								{/* Rating Stars */}
								<div className="flex items-center gap-1 text-amber-400 mb-4">
									{[...Array(t.rating)].map((_, i) => (
										<span
											key={i}
											className="material-symbols-outlined text-xl"
											style={{ fontVariationSettings: "'FILL' 1" }}>
											star
										</span>
									))}
								</div>

								{/* Quote */}
								<p className="font-body-lead text-on-surface italic mb-6 leading-relaxed">
									&ldquo;{t.quote}&rdquo;
								</p>

								{/* User Details */}
								<div className="flex items-center gap-4 pt-4 border-t border-outline-variant/30">
									<div className="w-12 h-12 rounded-full overflow-hidden relative ring-2 ring-primary/20 shrink-0">
										<Image
											src={t.avatar}
											alt={t.avatarAlt}
											fill
											className="object-cover"
											sizes="48px"
										/>
									</div>
									<div>
										<p className="font-card-title text-base font-bold text-on-surface">
											{t.name}
										</p>
										<p className="text-on-surface-variant text-xs font-medium">
											{t.role}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Right Column: Hero Visual Showcase */}
				<div className="lg:col-span-5 relative">
					<div className="aspect-[4/5] rounded-[36px] overflow-hidden relative border border-outline-variant/40 shadow-2xl">
						<Image
							src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwgILlBMl6FpGfT3YD5Ihn9XR3zdrhyo7cKcoV_bClmdkzH-qFxky3OMlCb6XORwSOdAu9e0H-9h8ggNLUKOeieNMDGJMASJyZQKXihbhC-zBHeikEEjtOMG_h5OFUZ7cNLiRI6Jk9rPcYMTUjmQmsgg5NJpXx22vk_7CwHVfUjKg2XmoJu2RHX91LUr_yenMNCCvxxIz_3_Ms4O-Fy1K5m5RD27QfVMwoEui_sq3Ai2c_L9q3gCpP"
							alt="Happy small business owner working in a shop"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 40vw"
						/>

						{/* Gradient Overlay */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

						{/* Overlay Stat Pill */}
						<div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-xl flex items-center justify-between">
							<div>
								<div className="text-3xl md:text-4xl font-extrabold font-nohemi text-primary">
									98%
								</div>
								<div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
									Client Satisfaction
								</div>
							</div>
							<div className="h-10 w-[1px] bg-outline-variant/50" />
							<div>
								<div className="text-3xl md:text-4xl font-extrabold font-nohemi text-on-surface">
									4.9 / 5
								</div>
								<div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
									Average Rating
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
