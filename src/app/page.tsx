import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <Pricing />
      <Portfolio />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
