"use client";

import { useState } from "react";

const faqItems = [
  {
    question: "Do I own 100% of my site and content?",
    answer:
      "Yes! Once your build is complete and final payment is made, you own all the design, code, and content 100%. While we handle hosting for convenience, you can request a complete file export at any time with no lock-in.",
    icon: "verified_user",
  },
  {
    question: "How long does a typical build take?",
    answer:
      "Our standard timeline is 7–10 business days for a Landing Page or Sales Funnel, and 14–21 business days for a full E-commerce Store. We move fast and keep you updated at every stage.",
    icon: "timer",
  },
  {
    question: "Can I use my existing custom domain?",
    answer:
      "Abolutely. We can seamlessly connect your current custom domain (from GoDaddy, Namecheap, Google, etc.) or help you register and set up a new domain at no extra charge.",
    icon: "language",
  },
  {
    question: "What if I need updates or changes later?",
    answer:
      "Every site includes an intuitive editor allowing you to update text and photos easily. Additionally, we offer an optional 'Concierge Plan' where our team handles all future updates and maintenance for you.",
    icon: "edit_note",
  },
  {
    question: "Are your websites optimized for mobile and SEO?",
    answer:
      "Yes. Every single site we deliver is 100% responsive across mobile, tablet, and desktop, with lightning-fast load speeds and built-in search engine optimization best practices.",
    icon: "devices",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section
      id="faq"
      className="py-20 md:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-surface relative"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Support & Answers
          </div>
          <h2 className="font-section-heading text-on-surface mb-4">
            Frequently Asked Questions
          </h2>
          <p className="font-body-lead">
            Got questions? We&apos;ve got clear answers to get you launched with confidence.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-surface-container-lowest border-primary shadow-lg shadow-primary/5"
                    : "bg-surface-container-lowest/80 border-outline-variant/60 hover:border-outline-variant"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                        isOpen ? "bg-primary text-on-primary" : "bg-primary/10 text-primary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    </div>
                    <span className="font-card-title text-base md:text-lg text-on-surface">
                      {item.question}
                    </span>
                  </div>

                  <span
                    className={`material-symbols-outlined text-2xl transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 px-6 pb-6 md:px-8 md:pb-8" : "grid-rows-[0fr] opacity-0 px-6 md:px-8"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-on-surface-variant text-base leading-relaxed pt-3 border-t border-outline-variant/40">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
