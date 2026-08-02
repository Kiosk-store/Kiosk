/**
 * CTA
 *
 * Simple call-to-action section used on the homepage. Keeps markup
 * minimal and declarative; visual styles are handled via Tailwind classes.
 *
 * @format
 */
import PillButton from "./PillButton";

export default function CTA() {
	return (
		<section className="py-20 md:py-28 lg:py-32 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto bg-primary rounded-[40px] p-10 md:p-20 text-center text-on-primary relative overflow-hidden shadow-2xl shadow-primary/20">
				{/* Radial gradient overlay */}
				<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent pointer-events-none" />

				<div className="relative z-10 max-w-2xl mx-auto space-y-8">
					<h2 className="font-display-hero text-white">
						Ready to grow your business online?
					</h2>
					<p className="text-body-lead text-white/90">
						Join over 50 small businesses who trust Kiosk for their digital
						presence.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
						<PillButton className="bg-white text-primary px-9 py-4 rounded-full font-bold text-base hover:bg-opacity-95 transition-all duration-300 shadow-xl cursor-pointer">
							Get Started Now
						</PillButton>
						<PillButton
							href="#"
							className="bg-white/10 text-white px-9 py-4 rounded-full font-bold text-base border border-white/30 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer">
							Talk to an Expert
						</PillButton>
					</div>
				</div>
			</div>
		</section>
	);
}
