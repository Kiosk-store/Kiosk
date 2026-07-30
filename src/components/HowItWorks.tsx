const steps = [
  {
    icon: "description",
    title: "1. Tell us about your business",
    description: "Fill out a simple questionnaire about your goals, style, and content.",
  },
  {
    icon: "design_services",
    title: "2. We build your site",
    description: "Our team crafts a custom, professional site optimized for your specific niche.",
  },
  {
    icon: "rate_review",
    title: "3. Review and request changes",
    description:
      "You get a preview link to check everything. We make adjustments until you love it.",
  },
  {
    icon: "rocket_launch",
    title: "4. You're live!",
    description:
      "We handle hosting and domain connection. Your business is officially online.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-surface relative"
    >
      <div className="max-w-7xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
          Simple Process
        </div>
        <h2 className="font-section-heading text-on-surface mb-4">
          Your journey to a professional online presence
        </h2>
        <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mt-6" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step) => (
          <div
            key={step.title}
            className="bg-surface-container-lowest p-8 rounded-[24px] card-hover border border-outline-variant/50 text-center md:text-left"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl mb-6 mx-auto md:mx-0 shrink-0">
              <span className="material-symbols-outlined">{step.icon}</span>
            </div>
            <h3 className="font-card-title mb-3 text-on-surface">{step.title}</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
