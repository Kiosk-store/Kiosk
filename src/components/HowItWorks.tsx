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
      className="py-section-gap px-margin-x-mobile md:px-margin-x-desktop bg-surface"
    >
      <div className="max-w-[1280px] mx-auto text-center mb-16">
        <h2 className="text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
          Your journey to a professional online presence
        </h2>
        <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
      </div>

      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {steps.map((step) => (
          <div
            key={step.title}
            className="bg-surface-container-lowest p-8 rounded-2xl card-hover transition-all text-center md:text-left"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl mb-6 mx-auto md:mx-0">
              <span className="material-symbols-outlined">{step.icon}</span>
            </div>
            <h3 className="text-headline-md mb-3">{step.title}</h3>
            <p className="text-on-surface-variant">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
