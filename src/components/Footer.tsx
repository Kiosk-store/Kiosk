const footerLinks = {
  company: [
    { label: "About Us", href: "#about" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Pricing", href: "#pricing" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest py-16 px-margin-x-mobile md:px-margin-x-desktop border-t border-outline-variant">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter mb-16">
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <span className="text-headline-md font-bold text-primary mb-4 block">
            StartupBuilder
          </span>
          <p className="text-on-surface-variant text-sm max-w-xs">
            Building professional digital presences for small business owners who mean business.
          </p>
        </div>

        {/* Company */}
        <div>
          <h5 className="text-label-md mb-6 uppercase text-xs tracking-widest text-on-surface">
            Company
          </h5>
          <ul className="space-y-3">
            {footerLinks.company.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-on-surface-variant hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h5 className="text-label-md mb-6 uppercase text-xs tracking-widest text-on-surface">
            Contact
          </h5>
          <ul className="space-y-3">
            <li>
              <a
                href="mailto:contact@startupbuilder.com"
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                contact@startupbuilder.com
              </a>
            </li>
            <li className="flex gap-4 mt-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary hover:text-white transition-all"
              >
                <span className="material-symbols-outlined text-sm">share</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary hover:text-white transition-all"
              >
                <span className="material-symbols-outlined text-sm">public</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h5 className="text-label-md mb-6 uppercase text-xs tracking-widest text-on-surface">
            Legal
          </h5>
          <ul className="space-y-3">
            {footerLinks.legal.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-on-surface-variant hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1280px] mx-auto pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant text-sm">
        <p>&copy; {new Date().getFullYear()} StartupBuilder. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary">
            Twitter
          </a>
          <a href="#" className="hover:text-primary">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
