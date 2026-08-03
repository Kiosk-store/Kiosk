"use client";

const footerLinks = {
	company: [
		{ label: "About Us", href: "#about" },
		{ label: "Portfolio", href: "#portfolio" },
		{ label: "Pricing", href: "#pricing" },
	],
	legal: [
		{ label: "Privacy Policy", href: "#" },
		{ label: "Terms of Service", href: "#" },
	],
};

export default function Footer() {
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<footer className="bg-[#03152c] text-white pt-32 md:pt-40 overflow-hidden relative z-20">
			{/* Asymmetric Wave Shape Divider */}
			<div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
				<svg
					className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[90px]"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 1200 120"
					preserveAspectRatio="none">
					<path
						d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V0H1200V30C1132.19,68.88,1055.71,111.31,985.66,92.83Z"
						className="fill-surface"
					></path>
				</svg>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20 md:mb-32 relative z-10">
				{/* Brand Info */}
				<div className="col-span-1 md:col-span-1 space-y-5">
					<span className="font-card-title text-2xl font-bold tracking-tight text-white block">
						Kiosk
					</span>
					<p className="text-white/60 text-sm md:text-[15px] leading-relaxed max-w-xs font-medium">
						Building professional digital presences for small business owners
						who mean business. Fast, affordable, and fully managed.
					</p>
				</div>

				{/* Company */}
				<div>
					<h5 className="font-label-caption mb-6 text-white/40 uppercase tracking-[0.15em] text-[11px] font-bold">Company</h5>
					<ul className="space-y-4 text-[15px]">
						{footerLinks.company.map((link) => (
							<li key={link.label}>
								<a
									href={link.href}
									className="text-white/70 hover:text-white transition-colors duration-300">
									{link.label}
								</a>
							</li>
						))}
					</ul>
				</div>

				{/* Contact */}
				<div>
					<h5 className="font-label-caption mb-6 text-white/40 uppercase tracking-[0.15em] text-[11px] font-bold">Contact</h5>
					<ul className="space-y-4 text-[15px]">
						<li>
							<a
								href="mailto:hello@kiosk.com"
								className="text-white/70 hover:text-white transition-colors duration-300">
								hello@kiosk.com
							</a>
						</li>
						<li className="flex gap-3 mt-6">
							<a
								href="#"
								className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-[#03152c] transition-all duration-300 border border-white/10 hover:border-transparent">
								<span className="material-symbols-outlined text-[18px]">share</span>
							</a>
							<a
								href="#"
								className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-[#03152c] transition-all duration-300 border border-white/10 hover:border-transparent">
								<span className="material-symbols-outlined text-[18px]">
									public
								</span>
							</a>
						</li>
					</ul>
				</div>

				{/* Legal */}
				<div>
					<h5 className="font-label-caption mb-6 text-white/40 uppercase tracking-[0.15em] text-[11px] font-bold">Legal</h5>
					<ul className="space-y-4 text-[15px]">
						{footerLinks.legal.map((link) => (
							<li key={link.label}>
								<a
									href={link.href}
									className="text-white/70 hover:text-white transition-colors duration-300">
									{link.label}
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* Bottom Section & Massive Typography */}
			<div className="relative w-full flex flex-col items-center justify-end overflow-hidden pt-10">
				{/* Copyright & Socials */}
				<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-white/50 text-xs md:text-sm mb-6 md:mb-2 relative z-10">
					<p className="font-medium tracking-wide">&copy; {new Date().getFullYear()} Kiosk. All rights reserved.</p>
					
					<div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
						<a
							href="#"
							className="hover:text-white transition-colors font-medium">
							Twitter
						</a>
						<a
							href="#"
							className="hover:text-white transition-colors font-medium">
							LinkedIn
						</a>
						
						{/* Back to Top Button */}
						<button 
							onClick={scrollToTop}
							className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors ml-0 md:ml-4 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-white/10"
							aria-label="Scroll back to top"
						>
							Back to top 
							<span className="material-symbols-outlined text-sm group-hover:-translate-y-0.5 transition-transform">
								arrow_upward
							</span>
						</button>
					</div>
				</div>

				{/* Massive Edge-to-Edge Typography */}
				<div className="w-full flex justify-center leading-[0.75] select-none pointer-events-none translate-y-[12%] mt-4 md:mt-0">
					<span 
						className="font-thunder-lc uppercase text-[24vw] md:text-[25vw] font-bold tracking-[-0.02em] whitespace-nowrap"
						style={{
							background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 70%, rgba(255,255,255,0) 100%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
							color: "transparent"
						}}>
						KIOSK
					</span>
				</div>
			</div>
		</footer>
	);
}
