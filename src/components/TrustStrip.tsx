const logos = ["LogoOne", "TechStart", "PureBake", "UrbanLaw", "Knit&Co"];

export default function TrustStrip() {
  return (
    <section className="py-12 bg-surface-container-lowest border-y border-outline-variant/30">
      <div className="max-w-[1280px] mx-auto px-margin-x-mobile md:px-margin-x-desktop flex flex-col items-center">
        <p className="text-label-sm text-on-surface-variant mb-8 uppercase tracking-widest">
          Over 50 small businesses launched
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
          {logos.map((name) => (
            <span key={name} className="text-headline-md font-bold italic">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
