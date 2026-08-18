/** @format */

export type SiteTier =
	| "Landing Page"
	| "Sales Funnel"
	| "E-commerce"
	| "Agency Showcase"
	| "Restaurant & Bistro"
	| "Professional Consulting";

export interface TemplateConfig {
	id: string;
	tier: SiteTier;
	title: string;
	defaultPages: string[];
	features: string[];
	deliveryWindow: string;
	progress: number;
	previewUrl: string;
}

export class SiteTemplateFactory {
	/**
	 * Creates a site template configuration based on the requested tier/preset.
	 */
	public static createTemplate(tier: SiteTier | string): TemplateConfig {
		switch (tier) {
			case "Landing Page":
			case "landing-page":
				return {
					id: "landing-page",
					tier: "Landing Page",
					title: "Modern Business Landing Page",
					defaultPages: ["Home"],
					features: [
						"Hero Section with Direct CTA",
						"Interactive Services & About Grid",
						"WhatsApp & Lead Intake Form",
						"Basic Meta SEO & Sitemap",
					],
					deliveryWindow: "3-5 days",
					progress: 15,
					previewUrl: "/templates/landing-page",
				};

			case "Sales Funnel":
			case "sales-funnel":
				return {
					id: "sales-funnel",
					tier: "Sales Funnel",
					title: "High-Converting Sales Funnel",
					defaultPages: [
						"Landing Offer",
						"Value Stack",
						"Testimonials",
						"Lead Capture",
						"Thank You Page",
					],
					features: [
						"Opt-In Lead Magnet Gate",
						"Video Sales Letter (VSL) Module",
						"Order Bump & Urgency Timers",
						"CRM & Mailchimp Automation",
					],
					deliveryWindow: "5-7 days",
					progress: 10,
					previewUrl: "/templates/sales-funnel",
				};

			case "E-commerce":
			case "ecommerce":
			case "store":
				return {
					id: "ecommerce",
					tier: "E-commerce",
					title: "E-Commerce Digital Storefront",
					defaultPages: [
						"Home",
						"Product Catalog",
						"Product Details",
						"Cart Drawer",
						"Checkout",
					],
					features: [
						"Product Inventory & Category Filters",
						"Interactive Slide-Out Cart Drawer",
						"Card & Bank Transfer Payment Gateway",
						"Order Receipt & Status Confirmation",
					],
					deliveryWindow: "7-10 days",
					progress: 5,
					previewUrl: "/templates/ecommerce",
				};

			case "Agency Showcase":
			case "agency":
				return {
					id: "agency",
					tier: "Agency Showcase",
					title: "Creative Agency Showcase",
					defaultPages: [
						"Agency Home",
						"Case Studies",
						"Portfolio Grid",
						"Services & Pricing",
						"Intake Form",
					],
					features: [
						"Filterable Portfolio Case Studies",
						"Interactive Client Intake Calculator",
						"Team & Client Testimonials Stack",
						"Custom Quote Request Modal",
					],
					deliveryWindow: "5-7 days",
					progress: 10,
					previewUrl: "/templates/agency",
				};

			case "Restaurant & Bistro":
			case "restaurant":
				return {
					id: "restaurant",
					tier: "Restaurant & Bistro",
					title: "Local Restaurant & Bistro",
					defaultPages: [
						"Home",
						"Digital Food Menu",
						"Table Reservations",
						"Chef Specials",
						"Location & Hours",
					],
					features: [
						"Categorized Interactive Food Menu",
						"Table Reservation Booking Widget",
						"Direct WhatsApp Order Trigger",
						"Google Maps & Operating Hours Card",
					],
					deliveryWindow: "3-5 days",
					progress: 15,
					previewUrl: "/templates/restaurant",
				};

			case "Professional Consulting":
			case "consulting":
				return {
					id: "consulting",
					tier: "Professional Consulting",
					title: "Professional Services & Consulting",
					defaultPages: [
						"Expert Profile",
						"Service Packages",
						"Case Results",
						"Calendar Booking",
						"Client Intake",
					],
					features: [
						"Consultant Profile & Authority Badges",
						"Service Package Estimator",
						"Calendar Appointment Booking Widget",
						"Client Video Testimonials",
					],
					deliveryWindow: "5-7 days",
					progress: 10,
					previewUrl: "/templates/consulting",
				};

			default:
				throw new Error(`Unsupported site tier: ${tier}`);
		}
	}

	/**
	 * Returns all available template presets in the platform library.
	 */
	public static getAllTemplates(): TemplateConfig[] {
		return [
			this.createTemplate("landing-page"),
			this.createTemplate("sales-funnel"),
			this.createTemplate("ecommerce"),
			this.createTemplate("agency"),
			this.createTemplate("restaurant"),
			this.createTemplate("consulting"),
		];
	}
}
