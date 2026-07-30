"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const faqItems = [
  {
    question: "Do I own my site?",
    answer:
      "Yes! Once the final payment is made, you own 100% of the design and content. While we host it for you to keep things simple, you can request a file export at any time.",
  },
  {
    question: "How long does it take?",
    answer:
      "Our standard timeline is 7-10 business days for a Landing Page or Sales Funnel, and 14-21 days for an E-commerce Store, depending on your responsiveness during the review phase.",
  },
  {
    question: "Can I use my own domain?",
    answer:
      "Absolutely. We can connect your existing domain or help you purchase and set up a new one directly through our platform.",
  },
  {
    question: "What if I need changes later?",
    answer:
      "Every site comes with an easy-to-use editor. You can change text and images yourself, or subscribe to our 'Concierge' plan where we handle all updates for you.",
  },
];

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="faq-item border border-outline-variant rounded-2xl overflow-hidden bg-surface-container-lowest">
      <button
        className="w-full px-8 py-6 flex justify-between items-center text-left cursor-pointer"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-headline-md text-lg">{question}</span>
        <span
          className="material-symbols-outlined transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          expand_more
        </span>
      </button>
      <div
        ref={contentRef}
        className="faq-content overflow-hidden faq-transition bg-surface-container-low px-8"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight ?? 0}px` : "0px",
        }}
      >
        <p className="py-6 text-on-surface-variant">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }, []);

  // Force re-render to get correct scrollHeight after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="faq"
      className="py-section-gap px-margin-x-mobile md:px-margin-x-desktop bg-surface"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-on-surface-variant">
            Everything you need to know about getting started.
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              isOpen={mounted && openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
