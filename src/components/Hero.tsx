import Image from "next/image";

export default function Hero() {
  return (
    <section className="pt-[160px] pb-section-gap px-margin-x-mobile md:px-margin-x-desktop bg-surface-bright relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-gutter items-center">
        {/* Text Content */}
        <div className="space-y-stack-lg">
          <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface max-w-xl">
            We build your business a website.{" "}
            <span className="text-primary">You focus on the business.</span>
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-lg">
            Professional custom sites, sales funnels, and online stores hosted on our platform with
            easy custom domain upgrades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="bg-primary text-on-primary px-8 py-4 rounded-xl text-label-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer">
              Get started
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center text-primary text-label-md px-8 py-4 hover:underline"
            >
              See how it works{" "}
              <span className="material-symbols-outlined ml-1">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* Browser Mockup */}
        <div className="relative mt-12 lg:mt-0">
          <div className="browser-frame rounded-xl bg-white overflow-hidden">
            <div className="bg-surface-container-high px-4 py-3 flex gap-1.5 border-b border-outline-variant">
              <div className="browser-dot bg-error/40" />
              <div className="browser-dot bg-[#eab30866]" />
              <div className="browser-dot bg-[#22c55e66]" />
            </div>
            <div className="aspect-video relative bg-slate-100">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8aQk-KbKq9uq35WVpvTGYdN49vv_82NRAiRkb7WhCYwvPU1ULvlJ2Z20SYODhiByYVtUOZpH4KiT-NHZf8R_BGqRAw9s9nU8WXx6e_tTImQxFc2JpJ5ks6nQOkXWnremwqd3HVKKVtvtHwL4qkIrRQFroX_cd3cpvT6gL9PG7bhjjyIWP2DGKgoGK1A5cgeGCa7SET1iJSmL34Kfa0m38BMJQkhFqwdDGzMEuDXUO_ABi5UfR8kJB"
                alt="A professional website design for an artisanal bakery with elegant typography and modern interface"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
