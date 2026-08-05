/**
 * CTA
 *
 * Full-bleed blue background CTA section with wave silhouette transition
 * matching the dark footer.
 *
 * @format
 */
import PillButton from "./PillButton";
import ScrollReveal from "./ScrollReveal";

export default function CTA() {
	return (
		<section className="w-full bg-[#004ac6] text-white pt-16 pb-16 md:pt-28 md:pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
			{/* Radial background highlight */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.18)_0%,_transparent_75%)] pointer-events-none" />

			<ScrollReveal direction="up">
				<div className="max-w-4xl mx-auto text-center relative z-10 space-y-6 sm:space-y-8">
					<h2 className="text-3xl sm:text-5xl md:text-6xl font-bold font-nohemi text-white tracking-tight leading-[1.15]">
						Ready to grow your business online?
					</h2>
					<p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed">
						Stop struggling with website builders. Let our team launch your
						professional digital presence in days.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center pt-2 sm:pt-4 max-w-md sm:max-w-none mx-auto">
						<PillButton
							href="/checkout?plan=landing"
							baseColor="#ffffff"
							circleColor="#0a0a0a"
							textColor="#004ac6"
							hoverTextColor="#ffffff"
							useThunderFont={true}
							className="w-full sm:w-auto px-8 py-3.5 sm:px-9 sm:py-4 rounded-full font-bold text-sm sm:text-base shadow-xl cursor-pointer text-center">
							Get Started Now
						</PillButton>
						<PillButton
							href="/services"
							baseColor="rgba(255, 255, 255, 0.15)"
							circleColor="#ffffff"
							textColor="#ffffff"
							hoverTextColor="#004ac6"
							className="w-full sm:w-auto px-8 py-3.5 sm:px-9 sm:py-4 rounded-full font-bold text-sm sm:text-base border-2 border-white/50 backdrop-blur-sm shadow-xl cursor-pointer text-center">
							Contact Support
						</PillButton>
					</div>
				</div>
			</ScrollReveal>
		</section>
	);
}
