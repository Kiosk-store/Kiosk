import Image from "next/image";

const testimonials = [
  {
    quote:
      "They took the stress out of the tech. I finally have a website that looks like I spent thousands on it, but I didn't have to lift a finger.",
    name: "Sarah Jenkins",
    role: "Owner, Bloom Florals",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBmCPXILYFOzJvqBpUit0X12WPNcHvYojf2FmRHkuO3HxQAJxA5g4ruS5zptEOC8B_Rum-7mzKtaQ6RAilioPNkfEbYVo4h4etxB4uytqxosxMfBALmwiNt5mZOjGOoH8WgdAUcGEpASUGgZ0BLotu0mrxwLXTim-RJxFdo86Rvn-FVp9vHq8DnC7fEdu1CaZFLe_6yvLh3r-PrLoyJAeQ9BB8bQteASRd3njNBrSjoERPlnpLM7EUs",
    avatarAlt: "Portrait of Sarah Jenkins, small business owner",
  },
  {
    quote:
      "Our sales tripled once we moved our shop to the StartupBuilder platform. The mobile experience is seamless.",
    name: "Michael Chen",
    role: "Founder, TechFix",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCGAaTYB1pT6XxvD-KtcsOOScky3nqNq6cO1vV0PrWkDBZ81BFvWm8yx6kfsf-PRA-MOhwrvgRng3QO-pGMnX3pTyIUUU11prufdpTVjCNoBjhxM4yIqTjZAPgmaDQSZcNTEvpW7aLCfDccvz1eN2l9omxYdSEC_llaCu83qsYcKq1ADESewQz0h7cFpUlZTrJwF5LGGhCYs5xG1V_uEHLNUfErKsrH4iHHEBAz_A4JN3lvkle871sk",
    avatarAlt: "Portrait of Michael Chen, entrepreneur",
  },
];

function StarRating() {
  return (
    <div className="flex gap-1 text-primary mb-4">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-section-gap px-margin-x-mobile md:px-margin-x-desktop bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-section-gap items-center">
        {/* Testimonial Cards */}
        <div>
          <h2 className="text-headline-lg-mobile md:text-headline-lg text-on-surface mb-8">
            What our partners say
          </h2>

          <div className="space-y-12">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-surface p-8 rounded-2xl border border-outline-variant/30"
              >
                <StarRating />
                <p className="text-body-lg text-on-surface italic mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 overflow-hidden relative">
                    <Image
                      src={t.avatar}
                      alt={t.avatarAlt}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <p className="text-label-md">{t.name}</p>
                    <p className="text-on-surface-variant text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Image */}
        <div className="hidden lg:block relative">
          <div className="aspect-[4/5] rounded-[32px] overflow-hidden relative">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwgILlBMl6FpGfT3YD5Ihn9XR3zdrhyo7cKcoV_bClmdkzH-qFxky3OMlCb6XORwSOdAu9e0H-9h8ggNLUKOeieNMDGJMASJyZQKXihbhC-zBHeikEEjtOMG_h5OFUZ7cNLiRI6Jk9rPcYMTUjmQmsgg5NJpXx22vk_7CwHVfUjKg2XmoJu2RHX91LUr_yenMNCCvxxIz_3_Ms4O-Fy1K5m5RD27QfVMwoEui_sq3Ai2c_L9q3gCpP"
              alt="Small business owner working happily on a laptop in a bright, airy storefront"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
          <div className="absolute -bottom-10 -left-10 bg-primary p-8 rounded-2xl text-on-primary">
            <div className="text-4xl font-bold mb-1">98%</div>
            <div className="text-label-md opacity-90">Client satisfaction rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
