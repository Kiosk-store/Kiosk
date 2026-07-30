export default function CTA() {
  return (
    <section className="py-section-gap px-margin-x-mobile md:px-margin-x-desktop">
      <div className="max-w-[1280px] mx-auto bg-primary rounded-[40px] p-12 md:p-24 text-center text-on-primary relative overflow-hidden">
        {/* Radial gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-display-lg-mobile md:text-display-lg mb-8">
            Ready to grow your business online?
          </h2>
          <p className="text-body-lg mb-12 opacity-90">
            Join over 50 small businesses who trust StartupBuilder for their digital presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-white text-primary px-10 py-5 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer">
              Get started now
            </button>
            <button className="bg-primary-fixed-dim/20 text-on-primary px-10 py-5 rounded-xl font-bold text-lg border border-white/30 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer">
              Talk to an expert
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
