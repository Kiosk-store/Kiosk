"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";

export default function Hero() {
  const buttonRefs = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>(
    []
  );
  const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const activeTweenRefs = useRef<(gsap.core.Tween | null)[]>([]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const initPillEffect = (index: number, element: HTMLElement) => {
    const circle = circleRefs.current[index];
    if (!circle) return;

    const rect = element.getBoundingClientRect();
    const { width: w, height: h } = rect;
    const R = ((w * w) / 4 + h * h) / (2 * h);
    const D = Math.ceil(2 * R) + 2;
    const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
    const originY = D - delta;

    circle.style.width = `${D}px`;
    circle.style.height = `${D}px`;
    circle.style.bottom = `-${delta}px`;

    gsap.set(circle, {
      xPercent: -50,
      scale: 0,
      transformOrigin: `50% ${originY}px`,
    });

    const label = element.querySelector<HTMLElement>(".btn-label");
    const white = element.querySelector<HTMLElement>(".btn-label-hover");

    if (label) gsap.set(label, { y: 0 });
    if (white) gsap.set(white, { y: h + 12, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: "power3.easeOut", overwrite: "auto" }, 0);

    if (label) {
      tl.to(label, { y: -(h + 8), duration: 2, ease: "power3.easeOut", overwrite: "auto" }, 0);
    }

    if (white) {
      gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
      tl.to(white, { y: 0, opacity: 1, duration: 2, ease: "power3.easeOut", overwrite: "auto" }, 0);
    }

    tlRefs.current[index] = tl;
  };

  // This would be called when buttons mount
  const setButtonRef = (index: number) => (el: HTMLButtonElement | HTMLAnchorElement | null) => {
    buttonRefs.current[index] = el;
    if (el) {
      setTimeout(() => initPillEffect(index, el), 50);
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 lg:pt-48 lg:pb-32 bg-white overflow-hidden">
      {/* Decorative geometric elements - no gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] border-2 border-blue-100 rotate-12 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] border-2 border-blue-50 -rotate-6 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-50 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Column: Copy & CTA */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
          {/* Headline - flat colors, no gradient */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-gray-900">
            We build your website.{" "}
            <span className="text-blue-600 block sm:inline">
              You scale the business.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Professional custom websites, high-converting sales funnels, and effortless online stores tailored for small businesses. Zero tech hassle.
          </p>

          {/* CTAs - pill buttons with navbar transition styling */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <div className="relative inline-block">
              <button
                ref={setButtonRef(0)}
                onMouseEnter={() => handleEnter(0)}
                onMouseLeave={() => handleLeave(0)}
                className="relative overflow-hidden bg-blue-600 text-white px-8 py-4 font-bold text-base border-2 border-blue-700 rounded-full cursor-pointer"
                style={{ minWidth: "180px" }}
              >
                <span
                  className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                  style={{
                    background: "#ffffff",
                    willChange: "transform",
                  }}
                  aria-hidden="true"
                  ref={(el) => {
                    circleRefs.current[0] = el;
                  }}
                />
                <span className="label-stack relative inline-block leading-[1] z-[2]">
                  <span
                    className="btn-label relative z-[2] inline-block leading-[1]"
                    style={{ willChange: "transform" }}
                  >
                    Get Started Now
                  </span>
                  <span
                    className="btn-label-hover absolute left-0 top-0 z-[3] inline-block"
                    style={{
                      color: "#004ac6",
                      willChange: "transform, opacity",
                    }}
                    aria-hidden="true"
                  >
                    Get Started Now
                  </span>
                </span>
              </button>
            </div>

            <div className="relative inline-block">
              <a
                ref={setButtonRef(1)}
                href="#how-it-works"
                onMouseEnter={() => handleEnter(1)}
                onMouseLeave={() => handleLeave(1)}
                className="relative overflow-hidden text-gray-700 font-bold text-base px-7 py-4 border-2 border-gray-300 rounded-full inline-flex items-center justify-center gap-2 cursor-pointer"
                style={{ minWidth: "180px" }}
              >
                <span
                  className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                  style={{
                    background: "#004ac6",
                    willChange: "transform",
                  }}
                  aria-hidden="true"
                  ref={(el) => {
                    circleRefs.current[1] = el;
                  }}
                />
                <span className="label-stack relative inline-block leading-[1] z-[2]">
                  <span
                    className="btn-label relative z-[2] inline-block leading-[1] flex items-center gap-2"
                    style={{ willChange: "transform" }}
                  >
                    <span>See How It Works</span>
                    <span className="text-xl text-blue-600">→</span>
                  </span>
                  <span
                    className="btn-label-hover absolute left-0 top-0 z-[3] inline-block flex items-center gap-2"
                    style={{
                      color: "#ffffff",
                      willChange: "transform, opacity",
                    }}
                    aria-hidden="true"
                  >
                    <span>See How It Works</span>
                    <span className="text-xl">→</span>
                  </span>
                </span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Strip - flat design */}
          <div className="pt-8 border-t-2 border-gray-200 flex flex-wrap justify-center lg:justify-start items-center gap-8 text-gray-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-blue-600 flex items-center justify-center text-blue-600 font-bold shrink-0 rounded-full">
                <span className="text-xl">⚡</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">7-10 Days</p>
                <p className="text-xs text-gray-500 font-medium">Fast Launch Time</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-blue-600 flex items-center justify-center text-blue-600 font-bold shrink-0 rounded-full">
                <span className="text-xl">✓</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">100% Owned</p>
                <p className="text-xs text-gray-500 font-medium">Your Content & Code</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Preview Card - flat design */}
        <div className="lg:col-span-5 relative">
          {/* Decorative flat elements - no blur or gradients */}
          <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-blue-200 bg-blue-50 rounded-full" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 border-2 border-blue-100 bg-white rounded-full" />

          {/* Flat Card - no glassmorphism */}
          <div className="relative border-2 border-gray-200 bg-white rounded-2xl overflow-hidden">
            {/* Browser Header - flat */}
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b-2 border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-red-400 bg-red-400 rounded-full" />
                <div className="w-3 h-3 border border-yellow-400 bg-yellow-400 rounded-full" />
                <div className="w-3 h-3 border border-green-400 bg-green-400 rounded-full" />
              </div>
              <div className="bg-white px-3.5 py-1 border border-gray-300 text-[11px] text-gray-600 font-mono flex items-center gap-1.5 rounded-full">
                <span className="w-2 h-2 border border-emerald-500 bg-emerald-500 rounded-full" />
                <span>kiosk.design/bakery-preview</span>
              </div>
              <span className="text-sm text-gray-400">🔒</span>
            </div>

            {/* Showcase Image */}
            <div className="aspect-[4/3] relative bg-gray-100">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8aQk-KbKq9uq35WVpvTGYdN49vv_82NRAiRkb7WhCYwvPU1ULvlJ2Z20SYODhiByYVtUOZpH4KiT-NHZf8R_BGqRAw9s9nU8WXx6e_tTImQxFc2JpJ5ks6nQOkXWnremwqd3HVKKVtvtHwL4qkIrRQFroX_cd3cpvT6gL9PG7bhjjyIWP2DGKgoGK1A5cgeGCa7SET1iJSmL34Kfa0m38BMJQkhFqwdDGzMEuDXUO_ABi5UfR8kJB"
                alt="Bakery custom website preview created by Kiosk"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Flat Badge - no shadows or blur */}
            <div className="absolute -bottom-5 -left-5 bg-white p-4 border-2 border-gray-200 flex items-center gap-3 rounded-2xl">
              <div className="w-10 h-10 border-2 border-emerald-500 bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 rounded-full">
                <span className="text-xl">📈</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Conversion Boost</p>
                <p className="text-sm font-bold text-gray-900">+310% Leads</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}