import Image from "next/image";

const projects = [
  {
    title: "The Daily Grind Coffee",
    category: "Local Coffee Shop",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_8qtO7egvfk0vnDtcK__RhzjCrjjnsR3A3hJZ_URQ6ipuYIU-b4MULhVI1d4mAsnyrT8psf2ZKXQszBj8Us5LGiOPzW_iTxW5PMDpm47Zkcp9j81Xf8DxeNPweJKtNwRS7VdMcrSTICPoE-JXLwpY8lhgY-Vdqu42L22nIN18Bin5yEAHcPAqeAxWO0Yvw8ikO-ncc1tVz41gOqHHqEyM5Q2KPz0Xk2dSvy8ZC3aWNyX3UoFnpgBk",
    alt: "Website design for a cozy coffee shop with earthy tones and latte art photography",
  },
  {
    title: "Sterling & Associates",
    category: "Boutique Law Firm",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDYhhlCElRHKFRDWDde1AbOM5l8vrowfyFYwQNkYvWaTdwTMW1sHVFyJ8ur5vAlrRHZj-RAc-T5fl06sUA9EJ1o6_qBtyUs_mCzcFmgncbv6bh2Mt8dZYo-c7YMR91kQDzjrVetuQWvHKXjfIDdw6WNyFXnXNw82QQ2f642E7sOG918NP-Z7YEm_HaawAlck72JPWcajX7PFtpCey0Uxj71SmvdkBuPx_r53XNrygpWlKnO0ejzIKzu",
    alt: "Clean website for a boutique law firm with navy blue and professional headshots",
  },
  {
    title: "Mode Modern",
    category: "Fashion Boutique",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuApqL5TWNiuXIpnTb_zD-MM1lUE3pB2dpQ15y_CZpJYYWkVtHW5pl5t1vWohB4L9rM5OzctZ9nG1sjA6V7iRPFjiDc-9b075akutXcdn5HAWw8F7OLTObpzjzKBhxmwbj2SiP2G9SC98zJJaEn71b5LnvepTjlL5WXBm5sswR-tYWJOBzl2goEfKT8uo7OstS-OWVyNzS8OG2el1lPbDwY1Yn0jg1RQs8QH_gsXpmIWNm1gJRwA1mt6",
    alt: "Vibrant e-commerce website for a fashion boutique with editorial photography",
  },
];

export default function Portfolio() {
  return (
    <section
      id="portfolio"
      className="py-section-gap px-margin-x-mobile md:px-margin-x-desktop bg-surface"
    >
      <div className="max-w-[1280px] mx-auto mb-16">
        <h2 className="text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
          Recent client launches
        </h2>
        <p className="text-on-surface-variant">Real websites for real small businesses.</p>
      </div>

      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {projects.map((project) => (
          <div key={project.title} className="group cursor-pointer">
            <div className="browser-frame rounded-2xl bg-white overflow-hidden mb-6 transition-transform group-hover:-translate-y-2">
              <div className="bg-surface-container-high px-3 py-2 flex gap-1 border-b border-outline-variant">
                <div className="w-2 h-2 rounded-full bg-outline" />
                <div className="w-2 h-2 rounded-full bg-outline" />
                <div className="w-2 h-2 rounded-full bg-outline" />
              </div>
              <div className="aspect-[4/3] relative bg-slate-100">
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
            <h4 className="text-headline-md group-hover:text-primary transition-colors">
              {project.title}
            </h4>
            <p className="text-on-surface-variant text-label-sm">{project.category}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
