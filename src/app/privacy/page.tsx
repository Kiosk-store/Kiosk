/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
	ShieldCheck,
	ArrowLeft,
	Lock,
	Mail,
	Eye,
	Server,
	CreditCard,
	Cookie,
	FileText,
	CheckCircle2,
	AlertCircle,
	ExternalLink,
	UserCheck,
	Globe,
	RefreshCw,
} from "lucide-react";

export default function PrivacyPolicyPage() {
	const lastUpdated = "September 16, 2026";
	const effectiveDate = "January 1, 2026";

	const [activeSection, setActiveSection] = useState<string | null>(null);

	const sections = [
		{ id: "overview", title: "1. Overview & Scope" },
		{ id: "collection", title: "2. Information We Collect" },
		{ id: "legal-bases", title: "3. Legal Bases for Processing" },
		{ id: "usage", title: "4. How We Use Your Data" },
		{ id: "subprocessors", title: "5. Third-Party Sub-processors" },
		{ id: "cookies", title: "6. Cookies & Tracking" },
		{ id: "security", title: "7. Security & Retention" },
		{ id: "rights", title: "8. Your Data Rights & Choices" },
		{ id: "children", title: "9. Children's Privacy" },
		{ id: "transfers", title: "10. International Data Transfers" },
		{ id: "updates", title: "11. Policy Changes & Inquiries" },
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
									<ShieldCheck className="w-5 h-5" />
								</div>
								<h1 className="text-3xl sm:text-5xl font-bold font-nohemi text-slate-900 tracking-tight">
									Privacy Policy
								</h1>
							</div>
							<p className="text-slate-500 text-xs sm:text-sm font-medium">
								Effective Date: {effectiveDate} • Last Updated: {lastUpdated}
							</p>
						</div>

						<div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl text-emerald-700 text-xs font-bold self-center sm:self-auto shadow-xs">
							<CheckCircle2 className="w-4 h-4 text-emerald-600" />
							<span>GDPR & NDPR Compliant Data Architecture</span>
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
									Need clarification or want to exercise your data rights?
								</p>
								<Link
									href="/contact?category=privacy"
									className="block text-center w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs">
									Contact Privacy Team
								</Link>
							</div>
						</div>
					</aside>

					{/* Policy Content */}
					<div className="lg:col-span-8 space-y-10 text-slate-700 text-sm leading-relaxed">
						{/* Executive Summary Box */}
						<div className="bg-blue-50/70 border border-blue-200/80 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
							<div className="flex items-center gap-2 text-blue-800 font-bold font-nohemi text-base">
								<Lock className="w-5 h-5 text-blue-600" />
								<span>Privacy at Kiosk: Executive Summary (TL;DR)</span>
							</div>
							<p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
								At Kiosk, your business data and your customers’ trust are paramount.
								<strong> We do not sell or rent your personal data to third parties.</strong> We
								only collect data necessary to build, publish, host, and bill for your turnkey
								websites. All payment details are processed through certified PCI-DSS Level 1
								gateways (Paystack). You retain 100% ownership of your business content and may
								export or delete your account at any time.
							</p>
						</div>

						{/* Section 1 */}
						<section id="overview" className="space-y-4 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi flex items-center gap-2">
								<FileText className="w-5 h-5 text-blue-600 shrink-0" />
								<span>1. Overview & Scope of This Policy</span>
							</h2>
							<p>
								This Privacy Policy describes how Kiosk Technologies (&quot;Kiosk,&quot; &quot;we,&quot;
								&quot;us,&quot; or &quot;our&quot;) collects, utilizes, stores, and protects personal
								information obtained through our primary website at{" "}
								<a
									href="https://kioosk.online"
									className="text-blue-600 hover:underline font-semibold">
									kioosk.online
								</a>
								, our client onboarding and administration portals, and any hosted client
								subdomains or custom domain websites powered by the Kiosk engine (collectively,
								the &quot;Services&quot;).
							</p>
							<p>
								This policy applies to individuals who visit our website (&quot;Visitors&quot;),
								business owners and subscribers who register for Kiosk accounts (&quot;Clients&quot;
								or &quot;Subscribers&quot;), and individuals who interact with websites built and
								hosted by Kiosk on behalf of our Clients (&quot;End Users&quot;).
							</p>
						</section>

						{/* Section 2 */}
						<section id="collection" className="space-y-4 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi flex items-center gap-2">
								<Eye className="w-5 h-5 text-blue-600 shrink-0" />
								<span>2. Information We Collect</span>
							</h2>
							<p>
								We collect information in three distinct ways: information you directly provide,
								information collected automatically through platform telemetry, and information
								received from third-party integrations.
							</p>

							<div className="space-y-3 pt-2">
								<div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
									<h4 className="font-bold text-slate-900 text-sm">
										A. Information You Voluntarily Provide
									</h4>
									<ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs sm:text-sm text-slate-600">
										<li>
											<strong>Account Credentials:</strong> Full name, company name, email
											address, encrypted password, and contact phone or WhatsApp number.
										</li>
										<li>
											<strong>Website Content & Branding Assets:</strong> Logos, photos, product
											catalogs, price lists, brand colors, marketing copy, and testimonials submitted
											for site construction.
										</li>
										<li>
											<strong>Domain Configuration Details:</strong> Domain names, registrar login
											tokens (if delegated for DNS setup), and DNS record configurations.
										</li>
										<li>
											<strong>Communications & Support Inquiries:</strong> Messages, ticket
											submissions, email threads, and feedback sent to our support desk.
										</li>
									</ul>
								</div>

								<div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
									<h4 className="font-bold text-slate-900 text-sm">
										B. Information Collected Automatically
									</h4>
									<ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs sm:text-sm text-slate-600">
										<li>
											<strong>Technical Telemetry:</strong> Internet Protocol (IP) address, browser
											version, device type, operating system, and language preferences.
										</li>
										<li>
											<strong>Usage Analytics:</strong> Session duration, pages viewed, referring
											URLs, button clicks, and hosting performance latency logs.
										</li>
									</ul>
								</div>

								<div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
									<h4 className="font-bold text-slate-900 text-sm">
										C. Payment & Billing Information
									</h4>
									<p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
										All payments are processed directly through certified PCI-DSS compliant third-party
										payment gateways (Paystack). Kiosk does <strong>not</strong> collect, process, or
										store sensitive card numbers, CVVs, or PINs on our servers. We receive only
										transaction reference tokens, billing addresses, invoice timestamps, and payment status
										confirmations.
									</p>
								</div>
							</div>
						</section>

						{/* Section 3 */}
						<section id="legal-bases" className="space-y-4 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi flex items-center gap-2">
								<UserCheck className="w-5 h-5 text-blue-600 shrink-0" />
								<span>3. Legal Bases for Data Processing</span>
							</h2>
							<p>Under international privacy regulations (including GDPR and NDPR), we process your data based on:</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
								<div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
									<strong className="text-xs text-blue-600 uppercase tracking-wide block">Contractual Obligation</strong>
									<p className="text-xs text-slate-600 mt-1">To build, deploy, host, and maintain your website as agreed in our package tiers.</p>
								</div>
								<div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
									<strong className="text-xs text-blue-600 uppercase tracking-wide block">Legitimate Business Interests</strong>
									<p className="text-xs text-slate-600 mt-1">To protect against fraud, secure server infrastructure, and enhance platform performance.</p>
								</div>
								<div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
									<strong className="text-xs text-blue-600 uppercase tracking-wide block">Legal Compliance</strong>
									<p className="text-xs text-slate-600 mt-1">To retain financial transaction records for statutory auditing and taxation.</p>
								</div>
								<div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
									<strong className="text-xs text-blue-600 uppercase tracking-wide block">Explicit Consent</strong>
									<p className="text-xs text-slate-600 mt-1">Where you have opted in to receive marketing communications or promotional feature guides.</p>
								</div>
							</div>
						</section>

						{/* Section 4 */}
						<section id="usage" className="space-y-4 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi flex items-center gap-2">
								<Server className="w-5 h-5 text-blue-600 shrink-0" />
								<span>4. How We Use Your Information</span>
							</h2>
							<p>We process collected data exclusively for the following operational purposes:</p>
							<ul className="list-disc pl-6 space-y-2 text-slate-700">
								<li>
									<strong>Website Construction & Hosting:</strong> Generating your responsive digital presence,
									provisioning subdomains (`tenant.kioosk.online`), and configuring custom domain routing.
								</li>
								<li>
									<strong>Automated SSL Provisioning:</strong> Issuing and renewing Let’s Encrypt SSL/TLS certificates
									for uninterrupted HTTPS security.
								</li>
								<li>
									<strong>Account Operations & Billing:</strong> Processing recurring renewals, issuing receipt
									invoices, and managing 5-day grace periods.
								</li>
								<li>
									<strong>Customer Care & Support Triage:</strong> Answering revision requests, debugging DNS configurations,
									and resolving tickets submitted via our support desk.
								</li>
								<li>
									<strong>System Notifications:</strong> Delivering transactional status updates, deployment notices,
									and password reset links via Resend.
								</li>
							</ul>
						</section>

						{/* Section 5 */}
						<section id="subprocessors" className="space-y-4 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi flex items-center gap-2">
								<Globe className="w-5 h-5 text-blue-600 shrink-0" />
								<span>5. Third-Party Sub-processors & Infrastructure</span>
							</h2>
							<p>
								We do not sell, license, or monetize your data. We share necessary operational data only with
								audited third-party infrastructure providers under strict confidentiality agreements:
							</p>

							<div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
								<table className="w-full text-left text-xs border-collapse">
									<thead>
										<tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider">
											<th className="p-3.5">Sub-processor</th>
											<th className="p-3.5">Function</th>
											<th className="p-3.5">Data Transferred</th>
											<th className="p-3.5">Location</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-100 text-slate-700">
										<tr>
											<td className="p-3.5 font-bold text-slate-900">Vercel Inc.</td>
											<td className="p-3.5">Edge Hosting & Serverless Execution</td>
											<td className="p-3.5">IP addresses, static assets, HTTP requests</td>
											<td className="p-3.5">Global Edge / USA</td>
										</tr>
										<tr>
											<td className="p-3.5 font-bold text-slate-900">Neon Inc.</td>
											<td className="p-3.5">Serverless PostgreSQL Database</td>
											<td className="p-3.5">Encrypted user accounts, project schemas</td>
											<td className="p-3.5">AWS US-East / EU</td>
										</tr>
										<tr>
											<td className="p-3.5 font-bold text-slate-900">Paystack Payments</td>
											<td className="p-3.5">Payment Gateway & Subscriptions</td>
											<td className="p-3.5">Transaction amounts, payment tokens</td>
											<td className="p-3.5">Nigeria / Global</td>
										</tr>
										<tr>
											<td className="p-3.5 font-bold text-slate-900">Resend Inc.</td>
											<td className="p-3.5">Transactional Email Delivery</td>
											<td className="p-3.5">Recipient email, notification content</td>
											<td className="p-3.5">USA</td>
										</tr>
										<tr>
											<td className="p-3.5 font-bold text-slate-900">Upstash</td>
											<td className="p-3.5">Distributed Redis Rate Limiting</td>
											<td className="p-3.5">Hashed IP identifiers for DDoS mitigation</td>
											<td className="p-3.5">Global Edge</td>
										</tr>
									</tbody>
								</table>
							</div>
						</section>

						{/* Section 6 */}
						<section id="cookies" className="space-y-4 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi flex items-center gap-2">
								<Cookie className="w-5 h-5 text-blue-600 shrink-0" />
								<span>6. Cookies & Tracking Technologies</span>
							</h2>
							<p>
								Kiosk utilizes minimal, privacy-friendly cookies. We do <strong>not</strong> install third-party
								behavioral advertising cookies or trackers.
							</p>
							<ul className="list-disc pl-6 space-y-1.5 text-slate-700">
								<li>
									<strong>Strictly Necessary Cookies:</strong> Encrypted session tokens (`authjs.session-token`)
									required to keep you logged in to your workspace dashboard.
								</li>
								<li>
									<strong>Performance & Preference Cookies:</strong> Storage of chosen currency preferences (NGN / USD)
									and UI theme modes.
								</li>
								<li>
									<strong>Privacy-First Analytics:</strong> Aggregated, anonymized page view metrics powered by Vercel
									Analytics with zero cookie tracking.
								</li>
							</ul>
						</section>

						{/* Section 7 */}
						<section id="security" className="space-y-4 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi flex items-center gap-2">
								<Lock className="w-5 h-5 text-blue-600 shrink-0" />
								<span>7. Data Security & Storage Retention</span>
							</h2>
							<p>
								We implement multi-layered administrative, technical, and physical security measures to safeguard your
								information:
							</p>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
								<div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
									<strong className="text-slate-900 text-xs block mb-1">TLS 1.3 Encryption</strong>
									<p className="text-xs text-slate-600">All data in transit is encrypted using modern high-cipher SSL certificates.</p>
								</div>
								<div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
									<strong className="text-slate-900 text-xs block mb-1">bcrypt Password Hashing</strong>
									<p className="text-xs text-slate-600">Account credentials are salted and irreversibly hashed before storage.</p>
								</div>
								<div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
									<strong className="text-slate-900 text-xs block mb-1">Isolated Multi-Tenancy</strong>
									<p className="text-xs text-slate-600">Each client’s database partition is strictly segregated at the data layer.</p>
								</div>
							</div>
							<p className="text-xs text-slate-600 mt-2">
								<strong>Retention Period:</strong> Active accounts retain project data indefinitely. Upon account cancellation,
								website data is preserved in cold backup for 60 days to allow reactivation, after which all site files and databases
								are permanently wiped, with the exception of statutory billing invoices retained for tax reporting.
							</p>
						</section>

						{/* Section 8 */}
						<section id="rights" className="space-y-4 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi flex items-center gap-2">
								<ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
								<span>8. Your Legal Rights & Data Portability</span>
							</h2>
							<p>Regardless of your geographical location, Kiosk grants all registered users full control over their data:</p>
							<ul className="list-disc pl-6 space-y-2 text-slate-700">
								<li>
									<strong>Right of Access & Inspection:</strong> Request an export of all personal information and business
									records stored in your profile.
								</li>
								<li>
									<strong>Right of Rectification:</strong> Edit or update inaccurate business names, WhatsApp numbers,
									or content directly through the dashboard or by contacting support.
								</li>
								<li>
									<strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request full deletion of your
									account, tenant subdomains, and associated databases.
								</li>
								<li>
									<strong>Data Portability:</strong> Receive your written website copy and uploaded media assets in standard
									formats (ZIP, JSON, HTML).
								</li>
							</ul>
							<p className="pt-1">
								To exercise any of these statutory rights, please submit a request through our{" "}
								<Link href="/contact?category=privacy" className="text-blue-600 font-bold hover:underline">
									Privacy Support Portal
								</Link>{" "}
								or email us directly at{" "}
								<a href="mailto:support@kioosk.online" className="text-blue-600 font-bold hover:underline">
									support@kioosk.online
								</a>
								. We process and confirm all verified requests within 30 days.
							</p>
						</section>

						{/* Section 9 */}
						<section id="children" className="space-y-3 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi">
								9. Children’s Privacy
							</h2>
							<p>
								Kiosk is a commercial business service intended strictly for adult business operators and entrepreneurs.
								Our services are not directed to individuals under 18 years of age. We do not knowingly collect or solicit
								personal data from minors. If you believe a minor has registered an account, please contact us immediately
								for prompt account removal.
							</p>
						</section>

						{/* Section 10 */}
						<section id="transfers" className="space-y-3 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi">
								10. International Cross-Border Data Transfers
							</h2>
							<p>
								Because Kiosk operates globally distributed edge architecture (via Vercel and Neon), your information
								may be transferred to, stored, and processed in cloud servers located in the United States, Europe, and other
								jurisdictions. We ensure all international transfers adhere to Standard Contractual Clauses (SCCs) and
								equivalent cross-border data protection frameworks.
							</p>
						</section>

						{/* Section 11 */}
						<section id="updates" className="space-y-4 scroll-mt-28">
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-nohemi">
								11. Policy Revisions & Contact Desk
							</h2>
							<p>
								We may revise this Privacy Policy periodically to reflect technological advancements, new platform
								features, or regulatory updates. When significant changes occur, we will notify registered users via email
								and update the &quot;Last Updated&quot; date at the top of this document.
							</p>
						</section>

						{/* Dedicated Privacy Contact Box */}
						<div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
							<div className="space-y-2 text-center sm:text-left">
								<h3 className="text-xl font-bold font-nohemi flex items-center justify-center sm:justify-start gap-2">
									<Mail className="w-5 h-5 text-blue-400" />
									<span>Questions about our Privacy Policy?</span>
								</h3>
								<p className="text-xs sm:text-sm text-slate-300 max-w-md">
									Our Data Protection Officer and compliance team are available to assist with data
									requests, GDPR questions, or deletion notices.
								</p>
							</div>
							<div className="flex flex-col sm:flex-row gap-3 shrink-0">
								<Link
									href="/contact?category=privacy"
									className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md text-center">
									Contact Privacy Desk
								</Link>
								<a
									href="mailto:support@kioosk.online"
									className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors text-center border border-white/10">
									support@kioosk.online
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
}
