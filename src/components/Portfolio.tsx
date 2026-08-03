/** @format */

// Portfolio
//
// Simple showcase grid for recent client projects. Images are loaded
// via Next.js `Image` for optimized delivery.
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const projects = [
	{
		title: "The Daily Grind Coffee",
		category: "Local Coffee Shop",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuA_8qtO7egvfk0vnDtcK__RhzjCrjjnsR3A3hJZ_URQ6ipuYIU-b4MULhVI1d4mAsnyrT8psf2ZKXQszBj8Us5LGiOPzW_iTxW5PMDpm47Zkcp9j81Xf8DxeNPweJKtNwRS7VdMcrSTICPoE-JXLwpY8lhgY-Vdqu42L22nIN18Bin5yEAHcPAqeAxWO0Yvw8ikO-ncc1tVz41gOqHHqEyM5Q2KPz0Xk2dSvy8ZC3aWNyX3UoFnpgBk",
		alt: "Website design for a cozy coffee shop with earthy tones and latte art photography",
	},
	{
		title: "Sterling & Associates",
		category: "Boutique Law Firm",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuDYhhlCElRHKFRDWDde1AbOM5l8vrowfyFYwQNkYvWaTdwTMW1sHVFyJ8ur5vAlrRHZj-RAc-T5fl06sUA9EJ1o6_qBtyUs_mCzcFmgncbv6bh2Mt8dZYo-c7YMR91kQDzjrVetuQWvHKXjfIDdw6WNyFXnXNw82QQ2f642E7sOG918NP-Z7YEm_HaawAlck72JPWcajX7PFtpCey0Uxj71SmvdkBuPx_r53XNrygpWlKnO0ejzIKzu",
		alt: "Clean website for a boutique law firm with navy blue and professional headshots",
	},
	{
		title: "Mode Modern",
		category: "Fashion Boutique",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuApqL5TWNiuXIpnTb_zD-MM1lUE3pB2dpQ15y_CZpJYYWkVtHW5pl5t1vWohB4L9rM5OzctZ9nG1sjA6V7iRPFjiDc-9b075akutXcdn5HAWw8F7OLTObpzjzKBhxmwbj2SiP2G9SC98zJJaEn71b5LnvepTjlL5WXBm5sswR-tYWJOBzl2goEfKT8uo7OstS-OWVyNzS8OG2el1lPbDwY1Yn0jg1RQs8QH_gsXpmIWNm1gJRwA1mt6",
		alt: "Vibrant e-commerce website for a fashion boutique with editorial photography",
	},
];

export default function Portfolio() {
	return (
		<section
			id="portfolio"
			className="py-20 md:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-surface relative">
			<ScrollReveal direction="up">
				<div className="max-w-7xl mx-auto mb-16 text-center md:text-left">
					<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
						Client Showcase
					</div>
					<h2 className="font-section-heading text-on-surface mb-3">
						Recent client launches
					</h2>
					<p className="font-body-lead">
						Real websites built for real small business owners.
					</p>
				</div>
			</ScrollReveal>

			<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
				{projects.map((project, i) => (
					<ScrollReveal
						key={project.title}
						direction="up"
						delay={i * 150}
						className="group cursor-pointer">
						<div className="browser-frame rounded-2xl bg-white overflow-hidden mb-6 transition-transform duration-300 group-hover:-translate-y-2">
							<div className="bg-surface-container-high px-3 py-2 flex gap-1.5 border-b border-outline-variant/50">
								<div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
								<div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
								<div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
							</div>
							<div className="aspect-[4/3] relative bg-slate-100">
								<Image
									src={project.image}
									alt={project.alt}
									fill
									className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
									sizes="(max-width: 768px) 100vw, 33vw"
								/>
							</div>
						</div>
						<h4 className="font-card-title text-on-surface group-hover:text-primary transition-colors mb-1">
							{project.title}
						</h4>
						<p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
							{project.category}
						</p>
					</ScrollReveal>
				))}
			</div>
		</section>
	);
}
