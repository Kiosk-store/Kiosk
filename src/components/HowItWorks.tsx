"use client";

import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";

const steps = [
  {
    num: "01",
    title: "Tell us about your business",
    body: "Fill out a simple questionnaire about your goals, style, and content. We'll use this to understand your vision and create a tailored strategy.",
    bg: "#e8f0fe",
  },
  {
    num: "02",
    title: "We build your site",
    body: "Our team crafts a custom, professional site optimized for your specific niche. Every detail is carefully considered to create a unique online presence.",
    bg: "#d4d9c8",
  },
  {
    num: "03",
    title: "Review & request changes",
    body: "You get a preview link to check everything. We make adjustments until you love it — your feedback is essential to the process.",
    bg: "#e8e8e0",
  },
  {
    num: "04",
    title: "You're live!",
    body: "We handle hosting and domain connection. Your business is officially online, with ongoing support to keep everything running smoothly.",
    bg: "#d4d9c8",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      data-bg="dark"
      style={{
        background: "var(--ink)",
        color: "var(--paper)",
        position: "relative",
        padding: "0",
      }}
    >
      <div style={{ position: "relative", margin: "0 -10px" }}>
        <ScrollStack
          useWindowScroll={true}
          itemDistance={80}
          itemScale={0.02}
          baseScale={0.9}
          scaleEndPosition="5%"
          stackPosition="10%"
          blurAmount={3}
        >
          {steps.map((s, i) => {
            const ink = "#1a1a1a";
            const numColor = "rgba(0,0,0,0.06)";

            return (
              <ScrollStackItem
                key={s.num}
                itemClassName="!rounded-none !shadow-none !bg-transparent !my-0 !p-0 !h-auto"
              >
                <article
                  style={{
                    background: s.bg,
                    color: ink,
                    minHeight: 240,
                    padding: "32px 40px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    overflow: "visible",
                    borderRadius: 0,
                    position: "relative",
                    willChange: "transform, filter, opacity",
                    marginBottom: "24px",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      marginBottom: "8px",
                      fontFamily: "var(--font-thunder-lc)",
                      fontWeight: 700,
                      fontSize: "clamp(24px, 3.3vw, 42px)",
                      lineHeight: 1,
                      textTransform: "uppercase",
                      color: ink,
                      letterSpacing: "0.00em",
                      textAlign: "left",
                      zIndex: 1,
                      paddingRight: "80px",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      maxWidth: 480,
                      margin: 0,
                      textAlign: "left",
                      fontFamily: "var(--font-nohemi)",
                      fontSize: "clamp(14px, 1.1vw, 17px)",
                      lineHeight: 1.6,
                      color: ink,
                      letterSpacing: "0.00em",
                      zIndex: 1,
                      opacity: 0.8,
                    }}
                  >
                    {s.body}
                  </p>
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      right: "clamp(16px, 3vw, 32px)",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontFamily: "var(--font-thunder-lc)",
                      fontWeight: 700,
                      fontSize: "clamp(53px, 6.6vw, 88px)",
                      lineHeight: 1,
                      color: numColor,
                      pointerEvents: "none",
                      userSelect: "none",
                      zIndex: 0,
                      overflow: "visible",
                    }}
                  >
                    {s.num}
                  </span>
                </article>
              </ScrollStackItem>
            );
          })}
        </ScrollStack>
      </div>
    </section>
  );
}