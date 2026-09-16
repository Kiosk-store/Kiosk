/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
	Scale,
	ArrowLeft,
	CheckCircle2,
	Clock,
	DollarSign,
	ShieldCheck,
	AlertTriangle,
	Sparkles,
	Globe,
	FileText,
	HelpCircle,
	ExternalLink,
	Zap,
} from "lucide-react";

export default function TermsOfServicePage() {
	const lastUpdated = "September 16, 2026";
	const effectiveDate = "January 1, 2026";

	const [activeSection, setActiveSection] = useState<string | null>(null);

	const sections = [
		{ id: "acceptance", title: "1. Agreement & Acceptance" },
		{ id: "services", title: "2. Turnkey Scope & 3-5 Day Delivery" },
		{ id: "billing", title: "3. Subscriptions & Payment Terms" },
		{ id: "refunds", title: "4. 30-Day Guarantee & Cancellation" },
		{ id: "ownership", title: "5. Intellectual Property & Ownership" },
		{ id: "domains", title: "6. Custom Domains & Hosting SLA" },
		{ id: "client-warranties", title: "7. Client Content & Warranties" },
		{ id: "acceptable-use", title: "8. Acceptable Use Policy" },
		{ id: "third-party", title: "9. Third-Party Integrations" },
		{ id: "liability", title: "10. Limitation of Liability" },
		{ id: "termination", title: "11. Suspension & Termination" },
		{ id: "governing-law", title: "12. Governing Law & Disputes" },
		{ id: "contact", title: "13. Inquiries & Legal Support" },
	];

	return (
		<main className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
			<Navbar />

			{/* Page Header */}
			<section className="pt-32 pb-14 sm:pt-40 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-linear-to-b from-white to-slate-50">
				<div className="max-w-5xl mx-auto space-y-4 text-center sm:text-left">
					<div className="flex items-center justify-center sm:justify-start gap-2">
						<Link
							href="/"
							className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-full">
							<ArrowLeft className="w-3.5 h-3.5" />
							<span>Back to Home</span>
						</Link>
						<span className="text-xs text-slate-400">•</span>
						<span className="text-xs font-semibold text-slate-500">Legal Documents</span>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="space-y-2">
							<div className="flex items-center justify-center sm:justify-start gap-3">
								<div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
									<Scale className="w-5 h-5" />
								</div>
								<h1 className="text-3xl sm:text-5xl font-bold font-nohemi text-slate-900 tracking-tight">
									Terms of Service
								</h1>
							</div>
							<p className="text-slate-500 text-xs sm:text-sm font-medium">
								Effective Date: {effectiveDate} • Last Updated: {lastUpdated}
							</p>
						</div>

						<div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-2xl text-blue-700 text-xs font-bold self-center sm:self-auto shadow-xs">
							<Sparkles className="w-4 h-4 text-blue-600" />
							<span>Transparent Turnkey Terms & Guarantees</span>
						</div>
					</div>
				</div>
			</section>

			{/* Main Content Layout */}
			<section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex-1">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
					{/* Table of Contents Sidebar */}
					<aside className="lg:col-span-4 space-y-6 hidden lg:block">
						<div className="sticky top-28 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
							<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
								Table of Contents
							</h3>
							<nav className="space-y-1">
								{sections.map((sec) => (
									<a
										key={sec.id}
										href={`#${sec.id}`}
										onClick={() => setActiveSection(sec.id)}
										className={`block text-xs py-1.5 px-2.5 rounded-lg font-medium transition-colors ${
											activeSection === sec.id
												? "bg-blue-50 text-blue-600 font-bold"
												: "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
										}`}>
										{sec.title}
									</a>
								))}
							</nav>

							<div className="pt-4 border-t border-slate-100 space-y-3">
								<p className="text-[11px] text-slate-500 leading-relaxed">
									Have legal or contract inquiries about our turnkey packages?
								</p>
								<Link
									href="/contact?category=legal"
									className="block text-center w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs">
									Contact Legal & Support Desk
								</Link>
							</div>
						</div>
					</aside>

					{/* Terms Content */}
					<div className="lg:col-span-8 space-y-10 text-slate-700 text-sm leading-relaxed">
						{/* Key Highlights Card */}
						<div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
							<div className="flex items-center gap-2 text-slate-900 font-bold font-nohemi text-base">
								<CheckCircle2 className="w-5 h-5 text-emerald-600" />
								<span>The Kiosk Commitment: Key Terms at a Glance</span>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
								<div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
									<strong className="text-xs text-slate-900 block font-bold">100% Client Ownership</strong>
									<p className="text-xs text-slate-600 mt-0.5">You own your business logos, domain name, copy, and product catalog outright.</p>
								</div>
								<div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
									<strong className="text-xs text-slate-900 block font-bold">3-5 Day Live Build</strong>
									<p className="text-xs text-slate-600 mt-0.5">Your customized site preview is delivered within 3 to 5 business days.</p>
								</div>
								<div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
									<strong className="text-xs text-slate-900 block font-bold">30-Day Money-Back Guarantee</strong>
									<p className="text-xs text-slate-600 mt-0.5">Full 100% refund if you are not delighted with your site within 30 days.</p>
								</div>
								<div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
									<strong className="text-xs text-slate-900 block font-bold">No Lock-in Contracts</strong>
									<p className="text-xs text-slate-600 mt-0.5">Cancel or pause your subscription directly through your dashboard anytime.</p>
								</div>
							</div>
						</div>

						{/* Section 1 */}
						<section id="acceptance" className="space-y-4 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi flex items-center gap-2">
								<FileText className="w-5 h-5 text-blue-600 shrink-0" />
								<span>1. Agreement & Acceptance</span>
							</h2>
							<p>
								These Terms of Service (&quot;Terms&quot;) constitute a legally binding contract
								between you (&quot;Customer,&quot; &quot;Client,&quot; &quot;Subscriber,&quot; or
								&quot;you&quot;) and Kiosk Technologies (&quot;Kiosk,&quot; &quot;we,&quot; &quot;us,&quot;
								or &quot;our&quot;), governing your use of our platform at{" "}
								<a
									href="https://kioosk.online"
									className="text-blue-600 hover:underline font-semibold">
									kioosk.online
								</a>{" "}
								and our turnkey website design, development, hosting, and ongoing digital management services.
							</p>
							<p>
								By registering an account, selecting a service tier, submitting payment, or accessing
								the Kiosk dashboard, you confirm that you are at least 18 years of age, have the legal
								capacity to bind yourself or your company, and agree to be bound by these Terms and our{" "}
								<Link href="/privacy" className="text-blue-600 font-semibold hover:underline">
									Privacy Policy
								</Link>
								.
							</p>
						</section>

						{/* Section 2 */}
						<section id="services" className="space-y-4 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi flex items-center gap-2">
								<Zap className="w-5 h-5 text-blue-600 shrink-0" />
								<span>2. Turnkey Service Scope & 3-5 Day Delivery SLA</span>
							</h2>
							<p>
								Kiosk provides full-service, managed turnkey web development. Unlike generic website builders,
								our engineering and design team writes the copy, optimizes the layout, integrates payment channels,
								and publishes your live website.
							</p>

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
								<div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
									<span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">Tier 01</span>
									<h4 className="font-bold text-slate-900 text-sm mt-0.5">Landing Page</h4>
									<p className="text-xs text-slate-500 mt-1">High-converting single-page presence for service professionals.</p>
								</div>
								<div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
									<span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">Tier 02</span>
									<h4 className="font-bold text-slate-900 text-sm mt-0.5">Sales Funnel</h4>
									<p className="text-xs text-slate-500 mt-1">Multi-step conversion funnel with lead capture and WhatsApp routing.</p>
								</div>
								<div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
									<span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">Tier 03</span>
									<h4 className="font-bold text-slate-900 text-sm mt-0.5">E-Commerce Store</h4>
									<p className="text-xs text-slate-500 mt-1">Full storefront with product catalogue, Paystack checkout, and inventory tracking.</p>
								</div>
							</div>

							<div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2 mt-3">
								<strong className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
									Delivery Timeline Commitment
								</strong>
								<p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
									Upon receipt of your onboarding submission (business details, logo, product photos, and contact info),
									our team commits to delivering an initial live preview within <strong>3 to 5 business days</strong>.
									Delays in submitting required brand assets or answers to clarifying questions will extend delivery
									timelines accordingly.
								</p>
							</div>
						</section>

						{/* Section 3 */}
						<section id="billing" className="space-y-4 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi flex items-center gap-2">
								<DollarSign className="w-5 h-5 text-blue-600 shrink-0" />
								<span>3. Subscriptions, Payments & Grace Periods</span>
							</h2>
							<ul className="list-disc pl-6 space-y-2.5 text-slate-700">
								<li>
									<strong>Recurring Subscriptions:</strong> Subscriptions are billed on an automated monthly or annual
									basis in advance. Your active plan covers continuous cloud hosting, SSL certificates, security maintenance,
									and ongoing content revisions.
								</li>
								<li>
									<strong>Supported Payment Channels:</strong> We accept debit/credit cards (Visa, Mastercard, Verve),
									direct Bank Transfers, USSD, and Mobile Money powered by Paystack.
								</li>
								<li>
									<strong>5-Day Grace Period:</strong> If a scheduled renewal fails due to insufficient funds or card expiry,
									your website remains 100% active and online during a 5-day grace period while our system sends renewal notices.
								</li>
								<li>
									<strong>Past-Due Status:</strong> If an invoice remains unpaid after the 5-day grace period, the site is
									flagged and temporarily paused. Your project files, product inventory, and customer records remain
									securely preserved for 60 days to allow immediate reactivation upon payment.
								</li>
							</ul>
						</section>

						{/* Section 4 */}
						<section id="refunds" className="space-y-4 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi flex items-center gap-2">
								<Clock className="w-5 h-5 text-blue-600 shrink-0" />
								<span>4. 30-Day Money-Back Guarantee & Cancellations</span>
							</h2>
							<div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-slate-700 space-y-2">
								<strong className="text-xs font-bold uppercase tracking-wider text-emerald-900 block flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-emerald-600" />
									<span>100% Risk-Free 30-Day Money-Back Guarantee</span>
								</strong>
								<p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
									We are dedicated to your total satisfaction. If during the first 30 days following your initial plan
									purchase you are not completely satisfied with your site design or service, you can request a 100%
									full refund. No hassles, no questions asked.
								</p>
							</div>
							<p>
								<strong>Cancellation Policy:</strong> You may cancel your subscription at any time directly through your
								Workspace Dashboard or by notifying our support desk. There are zero cancellation penalties or long-term
								lock-in commitments. Following cancellation, your website remains live until the end of your current paid
								billing cycle.
							</p>
						</section>

						{/* Section 5 */}
						<section id="ownership" className="space-y-4 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi flex items-center gap-2">
								<ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
								<span>5. Intellectual Property & Brand Ownership</span>
							</h2>
							<div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
								<h4 className="font-bold text-slate-900 text-sm">
									100% Client Ownership of Brand Assets
								</h4>
								<p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
									You retain full, exclusive ownership of all logos, registered trademarks, business copy, customer lists,
									photographs, product data, and custom domain names you provide to Kiosk. You grant Kiosk only the limited
									license required to host, format, cache, and display your assets publicly for the operation of your website.
								</p>
							</div>
							<p className="text-xs sm:text-sm text-slate-600">
								<strong>Platform Code Ownership:</strong> Kiosk retains all rights, title, and interest in our underlying
								platform engine, serverless architectures, proprietary CSS design systems, template structures, and
								automation algorithms.
							</p>
						</section>

						{/* Section 6 */}
						<section id="domains" className="space-y-4 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi flex items-center gap-2">
								<Globe className="w-5 h-5 text-blue-600 shrink-0" />
								<span>6. Custom Domains & Hosting Uptime SLA</span>
							</h2>
							<ul className="list-disc pl-6 space-y-2 text-slate-700">
								<li>
									<strong>Subdomains & Custom Domains:</strong> Every package includes a complimentary high-speed subdomain
									(`yourbusiness.kioosk.online`). You may connect your own custom domain (`yourbusiness.com`) at any time
									via your dashboard.
								</li>
								<li>
									<strong>Managed DNS & SSL:</strong> Kiosk handles SSL certificate generation and automated DNS routing
									assistance at no additional cost.
								</li>
								<li>
									<strong>Hosting SLA Target:</strong> We maintain a 99.9% uptime objective across our global edge cloud
									infrastructure. Scheduled maintenance windows are communicated in advance.
								</li>
							</ul>
						</section>

						{/* Section 7 */}
						<section id="client-warranties" className="space-y-3 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi">
								7. Client Content Warranties
							</h2>
							<p>By submitting photos, text, or branding assets to Kiosk, you warrant and represent that:</p>
							<ul className="list-disc pl-6 space-y-1.5 text-slate-700">
								<li>You own or possess the valid legal license to use all provided assets.</li>
								<li>Your content does not violate any copyright, patent, trademark, trade secret, or privacy right.</li>
								<li>Your products, services, and marketing claims comply with all applicable consumer protection laws.</li>
							</ul>
						</section>

						{/* Section 8 */}
						<section id="acceptable-use" className="space-y-4 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi flex items-center gap-2">
								<AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
								<span>8. Acceptable Use Policy & Prohibited Activities</span>
							</h2>
							<p>You agree not to use Kiosk services to publish, sell, or facilitate:</p>
							<div className="bg-red-50/70 border border-red-200/80 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-red-900 space-y-2">
								<strong className="block font-bold">Strictly Prohibited Activities:</strong>
								<ul className="list-disc pl-5 space-y-1 text-red-800">
									<li>Phishing, identity theft, financial fraud, or counterfeit goods.</li>
									<li>Malware distribution, spyware, or malicious script injection.</li>
									<li>Harassment, defamation, hate speech, or non-consensual content.</li>
									<li>Unlawful weapon sales, unlicensed pharmaceutical trading, or illegal substances.</li>
									<li>Unsolicited bulk email spamming or automated bot crawling.</li>
								</ul>
							</div>
							<p className="text-xs text-slate-500">
								Violation of our Acceptable Use Policy will result in immediate website suspension without prior notice.
							</p>
						</section>

						{/* Section 9 */}
						<section id="third-party" className="space-y-3 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi">
								9. Third-Party Integrations & External Gateways
							</h2>
							<p>
								Kiosk integrates with external platforms, including Paystack for payment processing, WhatsApp for
								direct messaging, and third-party domain registrars. While we maintain reliable integrations, Kiosk is
								not responsible for external service downtime or changes to third-party APIs beyond our control.
							</p>
						</section>

						{/* Section 10 */}
						<section id="liability" className="space-y-4 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi">
								10. Limitation of Liability & Indemnification
							</h2>
							<p>
								To the maximum extent permitted by applicable law, in no event shall Kiosk Technologies, its directors,
								employees, or suppliers be liable for any indirect, incidental, special, consequential, or punitive damages,
								including loss of profits, revenue, or customer data, arising from the use or inability to use our services.
							</p>
							<p>
								Our total aggregate liability under these Terms shall not exceed the amount actually paid by you to Kiosk
								during the three (3) months immediately preceding the event giving rise to the claim.
							</p>
						</section>

						{/* Section 11 */}
						<section id="termination" className="space-y-3 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi">
								11. Account Suspension & Cold Storage Data Backup
							</h2>
							<p>
								Either party may terminate the service agreement at any time. Upon termination, you may request an export
								of all written website copy and uploaded media. Website assets are kept in secure cold backup for 60 days
								following cancellation before permanent server decommissioning.
							</p>
						</section>

						{/* Section 12 */}
						<section id="governing-law" className="space-y-3 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi">
								12. Governing Law & Dispute Resolution
							</h2>
							<p>
								These Terms shall be governed by and construed in accordance with applicable commercial laws. In the event
								of any controversy or dispute, the parties agree to first attempt informal resolution in good faith for
								at least thirty (30) days by contacting our support desk before initiating formal legal proceedings.
							</p>
						</section>

						{/* Section 13: Dedicated Legal Support Box */}
						<section id="contact" className="scroll-mt-28 pt-4">
							<div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
								<div className="space-y-2 text-center sm:text-left">
									<h3 className="text-xl font-bold font-nohemi flex items-center justify-center sm:justify-start gap-2">
										<HelpCircle className="w-5 h-5 text-blue-400" />
										<span>Questions about our Terms of Service?</span>
									</h3>
									<p className="text-xs sm:text-sm text-slate-300 max-w-md">
										Our support team is available to assist you with contract details, billing questions,
										or custom enterprise agreements.
									</p>
								</div>
								<div className="flex flex-col sm:flex-row gap-3 shrink-0">
									<Link
										href="/contact?category=legal"
										className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md text-center">
										Contact Support Desk
									</Link>
									<a
										href="mailto:support@kioosk.online"
										className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors text-center border border-white/10">
										support@kioosk.online
									</a>
								</div>
							</div>
						</section>
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
}
