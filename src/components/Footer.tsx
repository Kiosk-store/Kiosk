/** @format */

// Footer
//
// Site footer with company, contact and legal links. Visuals are
// driven by Tailwind tokens so the component focuses on structure.
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
	return (
		<footer className="bg-surface-container-lowest py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-t border-outline-variant/60">
			<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-16">
				{/* Brand */}
				<div className="col-span-1 md:col-span-1 space-y-4">
					<span className="font-card-title text-xl text-primary font-nohemi font-bold block">
						Kiosk
					</span>
					<p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
						Building professional digital presences for small business owners
						who mean business.
					</p>
				</div>

				{/* Company */}
				<div>
					<h5 className="font-label-caption mb-6 text-on-surface">Company</h5>
					<ul className="space-y-3 text-sm">
						{footerLinks.company.map((link) => (
							<li key={link.label}>
								<a
									href={link.href}
									className="text-on-surface-variant hover:text-primary transition-colors">
									{link.label}
								</a>
							</li>
						))}
					</ul>
				</div>

				{/* Contact */}
				<div>
					<h5 className="font-label-caption mb-6 text-on-surface">Contact</h5>
					<ul className="space-y-3 text-sm">
						<li>
							<a
								href="mailto:contact@startupbuilder.com"
								className="text-on-surface-variant hover:text-primary transition-colors">
								contact@startupbuilder.com
							</a>
						</li>
						<li className="flex gap-3 mt-4">
							<a
								href="#"
								className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
								<span className="material-symbols-outlined text-sm">share</span>
							</a>
							<a
								href="#"
								className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
								<span className="material-symbols-outlined text-sm">
									public
								</span>
							</a>
						</li>
					</ul>
				</div>

				{/* Legal */}
				<div>
					<h5 className="font-label-caption mb-6 text-on-surface">Legal</h5>
					<ul className="space-y-3 text-sm">
						{footerLinks.legal.map((link) => (
							<li key={link.label}>
								<a
									href={link.href}
									className="text-on-surface-variant hover:text-primary transition-colors">
									{link.label}
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="max-w-7xl mx-auto pt-8 border-t border-outline-variant/50 flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant text-xs md:text-sm">
				<p>&copy; {new Date().getFullYear()} Kiosk. All rights reserved.</p>
				<div className="flex gap-6">
					<a
						href="#"
						className="hover:text-primary transition-colors">
						Twitter
					</a>
					<a
						href="#"
						className="hover:text-primary transition-colors">
						LinkedIn
					</a>
				</div>
			</div>
		</footer>
	);
}
