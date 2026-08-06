/** @format */

export type SiteTier = "Landing Page" | "Sales Funnel" | "E-commerce";

export interface TemplateConfig {
	tier: SiteTier;
	defaultPages: string[];
	features: string[];
	deliveryWindow: string;
	progress: number;
}

export class SiteTemplateFactory {
	/**
	 * Creates a site template configuration based on the requested tier.
	 */
	public static createTemplate(tier: SiteTier): TemplateConfig {
		switch (tier) {
			case "Landing Page":
				return {
					tier: "Landing Page",
					defaultPages: ["Home"],
					features: [
						"Hero Section with CTA",
						"Services Grid",
						"WhatsApp Direct Integration",
						"Contact Form",
					],
					deliveryWindow: "3-5 days",
					progress: 15,
				};

			case "Sales Funnel":
				return {
					tier: "Sales Funnel",
					defaultPages: [
						"Landing Offer",
						"Value Stack",
						"Testimonials",
						"Lead Capture",
						"Thank You Page",
					],
					features: [
						"High-Converting Sales Copy",
						"Lead Capture Form",
						"CRM Integration",
						"Automated Follow-ups",
					],
					deliveryWindow: "5-7 days",
					progress: 10,
				};

			case "E-commerce":
				return {
					tier: "E-commerce",
					defaultPages: [
						"Home",
						"Product Catalog",
						"Product Details",
						"Cart",
						"Checkout",
					],
					features: [
						"Product Inventory Management",
						"Shopping Cart",
						"Stripe / Paystack Payment Gateway",
						"Order Confirmation System",
					],
					deliveryWindow: "7-10 days",
					progress: 5,
				};

			default:
				throw new Error(`Unsupported site tier: ${tier}`);
		}
	}
}
