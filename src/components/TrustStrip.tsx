/** @format */

// TrustStrip
//
// Short band showing partner / client names to provide social proof.
const businessNames = [
	"LogoOne",
	"TechStart",
	"PureBake",
	"UrbanLaw",
	"Knit&Co",
];

export default function TrustStrip() {
	return (
		<section className="py-16 bg-white border-t-2 border-b-2 border-gray-200">
			<div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
				<div className="flex items-center gap-3 mb-10">
					<span className="w-8 h-0.5 bg-blue-600" />
					<p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">
						Trusted by growing businesses
					</p>
					<span className="w-8 h-0.5 bg-blue-600" />
				</div>

				<div className="flex flex-wrap justify-center items-center gap-10 md:gap-14 lg:gap-18">
					{businessNames.map((name) => (
						<span
							key={name}
							className="text-lg md:text-xl lg:text-2xl font-bold text-gray-400 hover:text-gray-700 transition-colors duration-200">
							{name}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
