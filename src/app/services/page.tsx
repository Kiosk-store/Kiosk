/** @format */

"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import HowItWorks from "@/components/HowItWorks";

import ServicesHero from "@/components/services/ServicesHero";
import ServiceTiers from "@/components/services/ServiceTiers";
import StandardGuarantee from "@/components/services/StandardGuarantee";
import ServiceAddOns from "@/components/services/ServiceAddOns";
import ServicesDecisionHelper from "@/components/services/ServicesDecisionHelper";
import CustomServicesCTA from "@/components/services/CustomServicesCTA";

export default function ServicesPage() {
	return (
		<main className="min-h-screen bg-[#f8fafc] w-full overflow-x-hidden text-gray-900">
			<Navbar />
			<ServicesHero />
			<ServiceTiers />
			<HowItWorks />
			<StandardGuarantee />
			<ServiceAddOns />
			<ServicesDecisionHelper />
			<CustomServicesCTA />
			<CTA />
			<Footer />
		</main>
	);
}
