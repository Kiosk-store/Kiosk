"use client";

import { useState } from "react";

const tiers = [
  {
    name: "Landing Page",
    badge: "Fast Launch",
    priceOneTime: "$499",
    priceMonthly: "$49",
    description: "Perfect for new businesses needing a crisp, high-converting digital business card.",
    features: [
      "Custom responsive design",
      "Mobile & speed optimized",
      "Basic SEO setup",
      "Contact form & maps integration",
      "Domain connection support",
    ],
    cta: "Choose Landing Page",
    featured: false,
  },
  {
    name: "Sales Funnel",
    badge: "Most Popular",
    priceOneTime: "$999",
    priceMonthly: "$89",
    description: "Multi-page growth engine engineered to convert traffic into paying customers.",
    features: [
      "Up to 5 custom pages",
      "High-converting copy outline",
      "Advanced SEO & metadata",
      "Email list & CRM integration",
      "Analytics & tracking setup",
      "Priority revisions",
    ],
    cta: "Choose Sales Funnel",
    featured: true,
  },
  {
    name: "E-commerce Store",
    badge: "Full Power",
    priceOneTime: "$1,499",
    priceMonthly: "$129",
    description: "Full-featured online store with seamless inventory and checkout flow.",
    features: [
      "Full product management",
      "Stripe & PayPal payment setup",
      "Automated email notifications",
      "Inventory & order dashboard",
      "Coupon & promotion rules",
      "Dedicated concierge support",
    ],
    cta: "Choose E-commerce",
    featured: false,
  },
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"one-time" | "monthly">("one-time");

  return (
    <section
      id="pricing"
      className="py-20 md:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-surface-container-low relative overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
          Transparent Pricing
        </div>
        <h2 className="font-section-heading text-on-surface mb-4">
          Investment for every business stage
        </h2>
        <p className="font-body-lead max-w-lg mx-auto">
          No hidden fees. Pick the package that fits your goals today.
        </p>

        {/* Toggle Switch */}
        <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-surface-container-high border border-outline-variant/60">
          <button
            onClick={() => setBillingCycle("one-time")}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
              billingCycle === "one-time"
                ? "bg-primary text-on-primary shadow-md"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            One-Time Build
          </button>
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              billingCycle === "monthly"
                ? "bg-primary text-on-primary shadow-md"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span>Managed Monthly</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold uppercase">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch relative z-10">
        {tiers.map((tier) => {
          const price = billingCycle === "one-time" ? tier.priceOneTime : tier.priceMonthly;
          const period = billingCycle === "one-time" ? "one-time payment" : "/ month";

          return (
            <div
              key={tier.name}
              className={`rounded-[32px] p-8 md:p-10 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 ${
                tier.featured
                  ? "bg-surface-container-lowest border-2 border-primary shadow-2xl shadow-primary/20 relative z-10 lg:scale-105"
                  : "bg-surface-container-lowest border border-outline-variant/60 shadow-lg hover:shadow-xl"
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full ${
                      tier.featured
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {tier.badge}
                  </span>
                </div>

                {/* Plan Name */}
                <h3 className="font-card-title text-on-surface mb-2">{tier.name}</h3>
                <p className="text-on-surface-variant text-sm mb-6 min-h-[40px] leading-relaxed">
                  {tier.description}
                </p>

                {/* Price Display */}
                <div className="mb-8 p-5 rounded-2xl bg-surface-container-low/80 border border-outline-variant/40">
                  <div className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight font-nohemi">
                    {price}
                  </div>
                  <div className="text-xs text-on-surface-variant font-semibold mt-1 uppercase tracking-wider">
                    {period}
                  </div>
                </div>

                {/* Features list */}
                <ul className="space-y-3.5 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-on-surface font-medium">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-4 rounded-full font-semibold text-base cursor-pointer transition-all duration-300 ${
                  tier.featured
                    ? "bg-primary text-on-primary hover:bg-primary-hover shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95"
                    : "border-2 border-primary text-primary hover:bg-primary/5 active:scale-95"
                }`}
              >
                {tier.cta}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
