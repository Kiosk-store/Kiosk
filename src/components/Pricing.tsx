const tiers = [
  {
    name: "Landing Page",
    price: "$499",
    description: "Perfect for new businesses needing a single-page digital business card.",
    features: ["Custom design", "Mobile optimized", "SEO ready"],
    cta: "Choose Landing Page",
    featured: false,
  },
  {
    name: "Sales Funnel",
    price: "$999",
    description: "A multi-page experience designed to convert visitors into loyal customers.",
    features: [
      "Up to 5 custom pages",
      "Conversion copywriting",
      "Advanced SEO package",
      "Email list integration",
    ],
    cta: "Choose Sales Funnel",
    featured: true,
  },
  {
    name: "E-commerce Store",
    price: "$1,499",
    description: "Full-featured online store with inventory and payment management.",
    features: ["Product management", "Stripe/PayPal setup", "Automated notifications"],
    cta: "Choose E-commerce",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="py-section-gap px-margin-x-mobile md:px-margin-x-desktop bg-surface-container-low"
    >
      <div className="max-w-[1280px] mx-auto text-center mb-16">
        <h2 className="text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
          Pricing for every business stage
        </h2>
        <p className="text-on-surface-variant">Simple, transparent pricing. No hidden fees.</p>
      </div>

      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-gutter items-end">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`bg-surface-container-lowest p-stack-lg rounded-2xl flex flex-col h-full ${
              tier.featured
                ? "border-2 border-primary shadow-xl relative scale-105 z-10"
                : "border border-outline-variant shadow-sm"
            }`}
          >
            {tier.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-label-sm uppercase tracking-wider">
                Most Popular
              </div>
            )}

            <h3 className="text-headline-md mb-2">{tier.name}</h3>
            <div className="text-4xl font-bold mb-4">
              {tier.price}{" "}
              <span className="text-on-surface-variant text-lg font-normal">one-time</span>
            </div>
            <p className="text-on-surface-variant mb-8">{tier.description}</p>

            <ul className="space-y-4 mb-12 flex-grow">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">
                    check_circle
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-4 rounded-xl font-bold cursor-pointer transition-all ${
                tier.featured
                  ? "bg-primary text-on-primary hover:shadow-lg"
                  : "border-2 border-primary text-primary hover:bg-primary/5"
              }`}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
