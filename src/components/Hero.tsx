"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 lg:pt-48 lg:pb-32 bg-surface-bright overflow-hidden">
      {/* Background Decorative Glow Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] md:w-[650px] md:h-[650px] bg-gradient-to-br from-primary/15 via-secondary/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Copy & CTA */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left z-10">
          {/* Floating Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Next-Gen Web Presences for Small Business</span>
          </div>

          {/* Headline */}
          <h1 className="font-display-hero text-on-surface">
            We build your website.{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary-container bg-clip-text text-transparent block sm:inline">
              You scale the business.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-body-lead max-w-xl mx-auto lg:mx-0">
            Professional custom websites, high-converting sales funnels, and effortless online stores tailored for small businesses. Zero tech hassle.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button className="w-full sm:w-auto bg-primary text-on-primary px-8 py-4 rounded-full font-semibold text-base hover:bg-primary-container hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer">
              Get Started Now
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-on-surface font-semibold text-base px-7 py-4 rounded-full border border-outline-variant hover:bg-surface-container-high transition-all duration-300"
            >
              <span>See How It Works</span>
              <span className="material-symbols-outlined text-xl text-primary">arrow_forward</span>
            </a>
          </div>

          {/* Quick Metrics Strip */}
          <div className="pt-8 border-t border-outline-variant/50 flex flex-wrap justify-center lg:justify-start items-center gap-8 text-on-surface-variant">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                <span className="material-symbols-outlined text-xl">bolt</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-on-surface">7-10 Days</p>
                <p className="text-xs text-on-surface-variant font-medium">Fast Launch Time</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                <span className="material-symbols-outlined text-xl">verified</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-on-surface">100% Owned</p>
                <p className="text-xs text-on-surface-variant font-medium">Your Content & Code</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Preview Card */}
        <div className="lg:col-span-5 relative">
          {/* Glow backdrop */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/20 rounded-[32px] blur-2xl transform rotate-1 scale-95 pointer-events-none" />

          {/* Glassmorphic Frame */}
          <div className="relative rounded-[24px] bg-surface-container-lowest/95 backdrop-blur-xl p-3 border border-white shadow-2xl shadow-primary/15 hover:shadow-primary/25 transition-all duration-500">
            {/* Browser Header */}
            <div className="bg-surface-container-high/80 rounded-t-[18px] px-4 py-3 flex items-center justify-between border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="bg-surface-container px-3.5 py-1 rounded-full text-[11px] text-on-surface-variant font-mono flex items-center gap-1.5 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>kiosk.design/bakery-preview</span>
              </div>
              <span className="material-symbols-outlined text-sm text-on-surface-variant">lock</span>
            </div>

            {/* Showcase Image */}
            <div className="aspect-[4/3] relative rounded-b-[18px] overflow-hidden bg-slate-100 group">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8aQk-KbKq9uq35WVpvTGYdN49vv_82NRAiRkb7WhCYwvPU1ULvlJ2Z20SYODhiByYVtUOZpH4KiT-NHZf8R_BGqRAw9s9nU8WXx6e_tTImQxFc2JpJ5ks6nQOkXWnremwqd3HVKKVtvtHwL4qkIrRQFroX_cd3cpvT6gL9PG7bhjjyIWP2DGKgoGK1A5cgeGCa7SET1iJSmL34Kfa0m38BMJQkhFqwdDGzMEuDXUO_ABi5UfR8kJB"
                alt="Bakery custom website preview created by Kiosk"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
            </div>

            {/* Floating Live Badge */}
            <div className="absolute -bottom-5 -left-5 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-xl flex items-center gap-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                <span className="material-symbols-outlined text-xl">trending_up</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">Conversion Boost</p>
                <p className="text-sm font-bold text-on-surface">+310% Leads</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
