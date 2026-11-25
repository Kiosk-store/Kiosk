/**
 * Resend Transactional Email Notification System (Plain-Text Clean Style)
 *
 * Clean, cardless, background-free typography email templates for Kiosk with
 * strict HTML escaping, URL scheme sanitization, and header injection protection:
 * 1. Welcome Greeting Email (`sendWelcomeEmail`)
 * 2. Admin Submission Alert (`sendWebsiteReviewNotificationToAdmin`)
 * 3. Client Submission Confirmation (`sendWebsiteReviewConfirmationToClient`)
 * 4. Website Live Published Email (`sendWebsiteLiveEmail`)
 * 5. Project Status Update Notice (`sendProjectStatusEmail`)
 * 6. Payment & Renewal Requests (`sendPaymentRequestEmail`, `sendGracePeriodReminderEmail`, `sendSiteFlaggedNoticeEmail`)
 * 7. Password Reset Request Email (`sendPasswordResetEmail`)
 *
 * @module email
 * @format
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const EMAIL_FROM = process.env.EMAIL_FROM || "Kioosk <noreply@kioosk.online>";

/**
 * Escapes HTML special characters to prevent HTML injection / phishing payloads in email templates.
 */
export function escapeHtml(value: string | number | null | undefined): string {
	if (value === null || value === undefined) return "";
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

/**
 * Strips CR/LF and ASCII control characters from header fields (e.g. email Subject lines).
 */
export function sanitizeEmailHeader(value: string | null | undefined): string {
	if (!value) return "";
	return value.replace(/[\r\n\x00-\x1F\x7F]+/g, " ").trim();
}

/**
 * Validates and HTML-escapes a URL for safe use inside an HTML `href` attribute.
 * Only permits `http:` and `https:` URLs; blocks `javascript:`, `data:`, `vbscript:`, etc.
 */
export function sanitizeEmailUrl(
	rawUrl: string | null | undefined,
	fallback = "",
): string {
	const trimmed = (rawUrl || "").trim();
	if (!trimmed) {
		return fallback ? escapeHtml(fallback) : "";
	}

	const normalizedForSchemeCheck = trimmed.replace(/[\x00-\x20]+/g, "").toLowerCase();
	const schemeMatch = /^([a-z][a-z0-9+.-]*):/i.exec(normalizedForSchemeCheck);
	if (schemeMatch && schemeMatch[1] !== "http" && schemeMatch[1] !== "https") {
		return fallback ? escapeHtml(fallback) : "";
	}

	const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

	try {
		const parsed = new URL(candidate);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
			return fallback ? escapeHtml(fallback) : "";
		}
		return escapeHtml(parsed.toString());
	} catch {
		return fallback ? escapeHtml(fallback) : "";
	}
}

/**
 * Resolves the active base application URL across local dev, preview branches, and production.
 */
export function getAppUrl(): string {
	if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
	if (process.env.AUTH_URL) return process.env.AUTH_URL.replace(/\/$/, "");
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
	return "https://kioosk.online";
}

export interface SendEmailPayload {
	to: string;
	subject: string;
	html: string;
}

/**
 * Dispatches an email via Resend API or logs fallback payload in local development mode.
 */
export async function sendEmail({
	to,
	subject,
	html,
}: SendEmailPayload): Promise<{ success: boolean; id?: string; error?: string }> {
	const apiKey = process.env.RESEND_API_KEY || RESEND_API_KEY;
	const fromAddress = process.env.EMAIL_FROM || EMAIL_FROM || "Kioosk <noreply@kioosk.online>";
	const safeSubject = sanitizeEmailHeader(subject);
	const safeTo = sanitizeEmailHeader(to);

	if (!apiKey) {
		console.log(`[EMAIL_DEV_FALLBACK] To: ${safeTo} | Subject: ${safeSubject}`);
		return { success: true, id: `dev_mock_${crypto.randomUUID().slice(0, 8)}` };
	}

	try {
		let res = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				from: fromAddress,
				to: [safeTo],
				subject: safeSubject,
				html,
			}),
		});

		let data = (await res.json()) as { id?: string; name?: string; message?: string };

		// If rejected due to domain not being verified in Resend, automatically fallback to onboarding@resend.dev
		if (
			!res.ok &&
			(data.name === "validation_error" ||
				data.message?.toLowerCase().includes("domain") ||
				data.message?.toLowerCase().includes("verify") ||
				data.message?.toLowerCase().includes("not verified"))
		) {
			console.warn("[RESEND_FALLBACK_TO_ONBOARDING]", data.message);
			res = await fetch("https://api.resend.com/emails", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${apiKey}`,
				},
				body: JSON.stringify({
					from: "Kioosk <onboarding@resend.dev>",
					to: [safeTo],
					subject: safeSubject,
					html,
				}),
			});
			data = (await res.json()) as { id?: string; name?: string; message?: string };
		}

		if (!res.ok) {
			console.error("[RESEND_API_ERROR]", data);
			return { success: false, error: data.message || "Failed to dispatch email via Resend" };
		}

		return { success: true, id: data.id };
	} catch (err: unknown) {
		console.error("[EMAIL_DISPATCH_EXCEPTION]", err);
		const message =
			err instanceof Error
				? err.message
				: "Unexpected network error during email dispatch";
		return { success: false, error: message };
	}
}

/**
 * Minimalist, Cardless Email Shell (Plain white canvas, standard readable typography)
 */
function renderEmailShell({
	title,
	contentHtml,
}: {
	title: string;
	contentHtml: string;
}) {
	const appUrl = getAppUrl();
	const safeAppHref = sanitizeEmailUrl(appUrl, "https://kioosk.online");
	const logoBaseUrl = appUrl.includes("localhost") ? "https://kioosk.online" : appUrl;
	const safeLogoUrl = sanitizeEmailUrl(
		`${logoBaseUrl}/KIOSK%20PNG2.png`,
		"https://kioosk.online/KIOSK%20PNG2.png",
	);
	const safeTitle = escapeHtml(title);

	return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>${safeTitle}</title>
			</head>
			<body style="margin: 0; padding: 24px 16px; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; font-size: 15px; line-height: 1.6; -webkit-font-smoothing: antialiased;">
				<div style="max-width: 580px; margin: 0 auto;">
					<!-- Brand Logo Header -->
					<div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f3f4f6;">
						<a href="${safeAppHref}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">
							<img src="${safeLogoUrl}" alt="Kioosk" width="130" style="display: block; width: 130px; max-width: 130px; height: auto; border: 0; outline: none; text-decoration: none;" />
						</a>
					</div>

					${contentHtml}

					<div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280; line-height: 1.5;">
						<p style="margin: 0 0 4px 0;">Best regards,</p>
						<p style="margin: 0 0 8px 0; font-weight: 700; color: #111827;">The Kioosk Team</p>
						<p style="margin: 0;">
							<a href="https://kioosk.online" style="color: #004ac6; text-decoration: none;">kioosk.online</a> &bull; <a href="https://wa.me/2348116062226" style="color: #004ac6; text-decoration: none;">WhatsApp: +234 811 606 2226</a>
						</p>
					</div>
				</div>
			</body>
		</html>
	`;
}

/**
 * 1. Welcome Greeting Email
 */
export async function sendWelcomeEmail(toEmail: string, userName: string) {
	const appUrl = getAppUrl();
	const safeDashboardHref = sanitizeEmailUrl(`${appUrl}/dashboard`, "https://kioosk.online/dashboard");
	const safeDashboardText = escapeHtml(`${appUrl}/dashboard`);
	const safeUserName = escapeHtml(userName || "Valued User");

	const subject = "Welcome to Kioosk - Your Workspace is Ready";
	const contentHtml = `
		<p style="margin: 0 0 16px 0;">Hi ${safeUserName},</p>
		<p style="margin: 0 0 16px 0;">
			Welcome to Kioosk. Your workspace is fully set up and ready to use.
		</p>
		<p style="margin: 0 0 16px 0;">
			You can log in to your dashboard to submit your business details, view live website builds, and manage your online store:
		</p>
		<p style="margin: 0 0 24px 0;">
			👉 <a href="${safeDashboardHref}" style="color: #004ac6; font-weight: 700; text-decoration: underline;">Open Your Kioosk Dashboard</a> (${safeDashboardText})
		</p>
		<p style="margin: 0 0 16px 0;">
			If you need any help getting started, simply reply directly to this email and our team will assist you.
		</p>
	`;

	const html = renderEmailShell({
		title: "Welcome to Kioosk",
		contentHtml,
	});

	return sendEmail({ to: toEmail, subject, html });
}

export interface WebsiteReviewEmailPayload {
	clientName: string;
	clientEmail: string;
	businessName: string;
	tagline: string;
	plan: string;
	logoUrl?: string | null;
	imagesCount?: number;
	productsCount?: number;
	servicesCount?: number;
	projectId?: string;
	contactPhone?: string;
	contactEmail?: string;
	whatsappLink?: string;
	selectedFont?: string;
	themeMode?: string;
}

/**
 * 2. Admin Submission Alert
 */
export async function sendWebsiteReviewNotificationToAdmin(payload: WebsiteReviewEmailPayload) {
	const adminEmail = process.env.ADMIN_EMAIL || process.env.NOTIFICATION_EMAIL;
	if (!adminEmail) {
		console.warn("[EMAIL_ADMIN_NOTICE] ADMIN_EMAIL or NOTIFICATION_EMAIL is not configured.");
		if (process.env.NODE_ENV !== "production") {
			return { success: true, id: `dev_mock_${crypto.randomUUID().slice(0, 8)}` };
		}
		return { success: false, error: "Admin email not configured" };
	}
	const appUrl = getAppUrl();
	const rawReviewUrl = payload.projectId
		? `${appUrl}/admin/projects/${encodeURIComponent(payload.projectId)}`
		: `${appUrl}/admin/projects`;
	const safeReviewHref = sanitizeEmailUrl(rawReviewUrl, "https://kioosk.online/admin/projects");
	const safeReviewText = escapeHtml(rawReviewUrl);

	const formattedPlan = payload.plan.replace(/_/g, " ");
	const subject = sanitizeEmailHeader(
		`[New Submission] ${payload.businessName} (${formattedPlan})`,
	);

	const safeBusinessName = escapeHtml(payload.businessName);
	const safeTagline = escapeHtml(payload.tagline || "N/A");
	const safePlan = escapeHtml(formattedPlan);
	const safeTheme = escapeHtml(payload.themeMode || "Light");
	const safeImagesCount = escapeHtml(payload.imagesCount || 0);
	const safeClientName = escapeHtml(payload.clientName);
	const safeClientEmail = escapeHtml(payload.clientEmail);
	const safePhone = payload.contactPhone ? escapeHtml(payload.contactPhone) : "";
	const safeWhatsapp = payload.whatsappLink ? escapeHtml(payload.whatsappLink) : "";

	const contentHtml = `
		<p style="margin: 0 0 16px 0;"><strong>New Client Submission Received:</strong></p>
		<p style="margin: 0 0 16px 0;">
			A client has submitted their website intake details for review and publishing:
		</p>

		<p style="margin: 0 0 8px 0;"><strong>Business Details:</strong></p>
		<ul style="margin: 0 0 20px 0; padding-left: 20px;">
			<li><strong>Business:</strong> ${safeBusinessName}</li>
			<li><strong>Tagline:</strong> ${safeTagline}</li>
			<li><strong>Plan:</strong> ${safePlan}</li>
			<li><strong>Theme:</strong> ${safeTheme}</li>
			<li><strong>Assets:</strong> ${safeImagesCount} files uploaded</li>
		</ul>

		<p style="margin: 0 0 8px 0;"><strong>Client Contact:</strong></p>
		<ul style="margin: 0 0 24px 0; padding-left: 20px;">
			<li><strong>Name:</strong> ${safeClientName}</li>
			<li><strong>Email:</strong> ${safeClientEmail}</li>
			${safePhone ? `<li><strong>Phone:</strong> ${safePhone}</li>` : ""}
			${safeWhatsapp ? `<li><strong>WhatsApp:</strong> ${safeWhatsapp}</li>` : ""}
		</ul>

		<p style="margin: 0 0 16px 0;">
			👉 Review this project in the Admin Hub:<br/>
			<a href="${safeReviewHref}" style="color: #004ac6; font-weight: 700; text-decoration: underline;">${safeReviewText}</a>
		</p>
	`;

	const html = renderEmailShell({
		title: "New Client Submission",
		contentHtml,
	});

	return sendEmail({ to: adminEmail, subject, html });
}

/**
 * 3. Client Submission Confirmation Email
 */
export async function sendWebsiteReviewConfirmationToClient(
	toEmail: string,
	clientName: string,
	businessName: string,
	plan: string,
) {
	const appUrl = getAppUrl();
	const safeProjectsHref = sanitizeEmailUrl(
		`${appUrl}/dashboard/projects`,
		"https://kioosk.online/dashboard/projects",
	);
	const safeProjectsText = escapeHtml(`${appUrl}/dashboard/projects`);
	const subject = sanitizeEmailHeader(`Details Received: ${businessName} is Now in Review`);

	const safeClientName = escapeHtml(clientName || "there");
	const safeBusinessName = escapeHtml(businessName);
	const safePlan = escapeHtml(plan.replace(/_/g, " "));

	const contentHtml = `
		<p style="margin: 0 0 16px 0;">Hi ${safeClientName},</p>
		<p style="margin: 0 0 16px 0;">
			We have received your business details and brand assets for <strong>${safeBusinessName}</strong>.
		</p>
		<p style="margin: 0 0 16px 0;">
			Our fulfillment team is now setting up your <strong>${safePlan}</strong> website layout, connecting your subdomain, and testing your WhatsApp order flows.
		</p>

		<p style="margin: 0 0 8px 0;"><strong>What to expect next:</strong></p>
		<ul style="margin: 0 0 24px 0; padding-left: 20px;">
			<li>Our team reviews your submitted content.</li>
			<li>We build and optimize your website for mobile and desktop.</li>
			<li>You will receive an email confirmation as soon as your website is live!</li>
		</ul>

		<p style="margin: 0 0 16px 0;">
			You can track progress anytime from your dashboard:<br/>
			👉 <a href="${safeProjectsHref}" style="color: #004ac6; font-weight: 700; text-decoration: underline;">${safeProjectsText}</a>
		</p>
	`;

	const html = renderEmailShell({
		title: "Website Details Received",
		contentHtml,
	});

	return sendEmail({ to: toEmail, subject, html });
}

export interface WebsiteLiveEmailPayload {
	toEmail: string;
	clientName: string;
	businessName: string;
	publishedUrl: string;
	plan: string;
}

/**
 * 4. Website Live Published Email
 */
export async function sendWebsiteLiveEmail(payload: WebsiteLiveEmailPayload) {
	const appUrl = getAppUrl();
	const safeDashboardHref = sanitizeEmailUrl(
		`${appUrl}/dashboard`,
		"https://kioosk.online/dashboard",
	);
	const safeDashboardText = escapeHtml(`${appUrl}/dashboard`);
	const safePublishedHref = sanitizeEmailUrl(payload.publishedUrl, "https://kioosk.online");
	const safePublishedText = escapeHtml(payload.publishedUrl);
	const safeClientName = escapeHtml(payload.clientName || "there");
	const safeBusinessName = escapeHtml(payload.businessName);

	const subject = sanitizeEmailHeader(`Your Website is Live: ${payload.businessName}`);

	const contentHtml = `
		<p style="margin: 0 0 16px 0;">Hi ${safeClientName},</p>
		<p style="margin: 0 0 16px 0;">
			Great news! Your <strong>${safeBusinessName}</strong> website has completed review and is officially live on the internet.
		</p>

		<p style="margin: 0 0 8px 0;"><strong>Your Live Website Link:</strong></p>
		<p style="margin: 0 0 24px 0;">
			👉 <a href="${safePublishedHref}" target="_blank" rel="noopener noreferrer" style="color: #004ac6; font-weight: 800; font-size: 16px; text-decoration: underline;">${safePublishedText}</a>
		</p>

		<p style="margin: 0 0 8px 0;"><strong>Next steps for your brand:</strong></p>
		<ul style="margin: 0 0 24px 0; padding-left: 20px;">
			<li>Add your website link to your Instagram, TikTok, and WhatsApp bio.</li>
			<li>Customers can now browse your products/services and order directly to your WhatsApp.</li>
			<li>You can manage your products and updates anytime from your Kioosk dashboard.</li>
		</ul>

		<p style="margin: 0 0 16px 0;">
			Access your dashboard:<br/>
			👉 <a href="${safeDashboardHref}" style="color: #004ac6; font-weight: 700; text-decoration: underline;">${safeDashboardText}</a>
		</p>
	`;

	const html = renderEmailShell({
		title: "Your Website is Live",
		contentHtml,
	});

	return sendEmail({ to: payload.toEmail, subject, html });
}

/**
 * 5. Project Status Email
 */
export async function sendProjectStatusEmail(
	toEmail: string,
	userName: string,
	projectName: string,
	status: string,
	publishedUrl?: string,
) {
	const appUrl = getAppUrl();
	const safeProjectsHref = sanitizeEmailUrl(
		`${appUrl}/dashboard/projects`,
		"https://kioosk.online/dashboard/projects",
	);
	const safeProjectsText = escapeHtml(`${appUrl}/dashboard/projects`);
	const safeUserName = escapeHtml(userName || "there");
	const safeProjectName = escapeHtml(projectName);
	const safeStatus = escapeHtml(status);
	const safePublishedHref = publishedUrl ? sanitizeEmailUrl(publishedUrl) : "";
	const safePublishedText = publishedUrl ? escapeHtml(publishedUrl) : "";

	const subject = sanitizeEmailHeader(`Update on ${projectName}: Status is ${status}`);
	const contentHtml = `
		<p style="margin: 0 0 16px 0;">Hi ${safeUserName},</p>
		<p style="margin: 0 0 16px 0;">
			Your project <strong>${safeProjectName}</strong> has been updated to: <strong>${safeStatus}</strong>.
		</p>
		${
			safePublishedHref
				? `<p style="margin: 0 0 16px 0;">Published URL: <a href="${safePublishedHref}" style="color: #004ac6; font-weight: 700; text-decoration: underline;">${safePublishedText}</a></p>`
				: safePublishedText
					? `<p style="margin: 0 0 16px 0;">Published URL: ${safePublishedText}</p>`
					: ""
		}
		<p style="margin: 0 0 16px 0;">
			👉 View details in your dashboard:<br/>
			<a href="${safeProjectsHref}" style="color: #004ac6; font-weight: 700; text-decoration: underline;">${safeProjectsText}</a>
		</p>
	`;

	const html = renderEmailShell({
		title: "Project Status Update",
		contentHtml,
	});

	return sendEmail({ to: toEmail, subject, html });
}

/**
 * 6. Payment Request / Invoice Email
 */
export async function sendPaymentRequestEmail({
	toEmail,
	userName,
	invoiceNumber,
	plan,
	amount,
	currency,
	dueDate,
	paymentLink,
}: {
	toEmail: string;
	userName: string;
	invoiceNumber: string;
	plan: string;
	amount: number;
	currency: string;
	dueDate: string;
	paymentLink: string;
}) {
	const subject = sanitizeEmailHeader(`Invoice ${invoiceNumber}: Kioosk ${plan} Renewal`);
	const safeUserName = escapeHtml(userName || "there");
	const safeInvoiceNumber = escapeHtml(invoiceNumber);
	const safePlan = escapeHtml(plan);
	const safeDueDate = escapeHtml(dueDate);
	const safeCurrency = escapeHtml(currency);
	const safeAmount = escapeHtml(amount);
	const safePaymentHref = sanitizeEmailUrl(paymentLink, "https://kioosk.online/dashboard/billing");
	const safePaymentText = escapeHtml(paymentLink);

	const contentHtml = `
		<p style="margin: 0 0 16px 0;">Hi ${safeUserName},</p>
		<p style="margin: 0 0 16px 0;">
			Your hosting and maintenance subscription for <strong>${safePlan}</strong> is ready for renewal.
		</p>

		<p style="margin: 0 0 8px 0;"><strong>Invoice Summary:</strong></p>
		<ul style="margin: 0 0 24px 0; padding-left: 20px;">
			<li><strong>Invoice Number:</strong> ${safeInvoiceNumber}</li>
			<li><strong>Plan:</strong> ${safePlan}</li>
			<li><strong>Due Date:</strong> ${safeDueDate}</li>
			<li><strong>Total Amount:</strong> ${safeCurrency} ${safeAmount}.00</li>
		</ul>

		<p style="margin: 0 0 16px 0;">
			👉 Pay your invoice securely online:<br/>
			<a href="${safePaymentHref}" style="color: #004ac6; font-weight: 700; font-size: 16px; text-decoration: underline;">Pay ${safeCurrency} ${safeAmount}.00</a> (${safePaymentText})
		</p>
		<p style="margin: 0 0 16px 0; font-size: 13px; color: #6b7280;">
			Supports Card, Bank Transfer, USSD, and Mobile Money.
		</p>
	`;

	const html = renderEmailShell({
		title: `Invoice ${invoiceNumber}`,
		contentHtml,
	});

	return sendEmail({ to: toEmail, subject, html });
}

/**
 * 7. Grace Period Reminder Email
 */
export async function sendGracePeriodReminderEmail({
	toEmail,
	userName,
	invoiceNumber,
	plan,
	amount,
	currency,
	daysRemaining,
	paymentLink,
}: {
	toEmail: string;
	userName: string;
	invoiceNumber: string;
	plan: string;
	amount: number;
	currency: string;
	daysRemaining: number;
	paymentLink: string;
}) {
	const subject = sanitizeEmailHeader(
		`Reminder: ${daysRemaining} Days Remaining for Invoice #${invoiceNumber}`,
	);
	const safeUserName = escapeHtml(userName || "there");
	const safeInvoiceNumber = escapeHtml(invoiceNumber);
	const safePlan = escapeHtml(plan);
	const safeCurrency = escapeHtml(currency);
	const safeAmount = escapeHtml(amount);
	const safeDaysRemaining = escapeHtml(daysRemaining);
	const safePaymentHref = sanitizeEmailUrl(paymentLink, "https://kioosk.online/dashboard/billing");
	const safePaymentText = escapeHtml(paymentLink);

	const contentHtml = `
		<p style="margin: 0 0 16px 0;">Hi ${safeUserName},</p>
		<p style="margin: 0 0 16px 0;">
			This is a friendly reminder that renewal invoice <strong>#${safeInvoiceNumber}</strong> (${safeCurrency} ${safeAmount}.00) for your <strong>${safePlan}</strong> website remains pending.
		</p>
		<p style="margin: 0 0 20px 0;">
			Your website remains active under our grace period. Please complete payment within the next <strong>${safeDaysRemaining} days</strong> to keep your site online without interruption.
		</p>
		<p style="margin: 0 0 16px 0;">
			👉 Pay Invoice:<br/>
			<a href="${safePaymentHref}" style="color: #004ac6; font-weight: 700; text-decoration: underline;">${safePaymentText}</a>
		</p>
	`;

	const html = renderEmailShell({
		title: "Grace Period Notice",
		contentHtml,
	});

	return sendEmail({ to: toEmail, subject, html });
}

/**
 * 8. Site Flagged / Suspended Notice Email
 */
export async function sendSiteFlaggedNoticeEmail({
	toEmail,
	userName,
	invoiceNumber,
	plan,
	amount,
	currency,
	paymentLink,
}: {
	toEmail: string;
	userName: string;
	invoiceNumber: string;
	plan: string;
	amount: number;
	currency: string;
	paymentLink: string;
}) {
	const subject = sanitizeEmailHeader(
		`Action Required: Website Renewal Expired for ${plan} #${invoiceNumber}`,
	);
	const safeUserName = escapeHtml(userName || "there");
	const safeInvoiceNumber = escapeHtml(invoiceNumber);
	const safeCurrency = escapeHtml(currency);
	const safeAmount = escapeHtml(amount);
	const safePaymentHref = sanitizeEmailUrl(paymentLink, "https://kioosk.online/dashboard/billing");
	const safePaymentText = escapeHtml(paymentLink);

	const contentHtml = `
		<p style="margin: 0 0 16px 0;">Hi ${safeUserName},</p>
		<p style="margin: 0 0 16px 0;">
			The renewal period for invoice <strong>#${safeInvoiceNumber}</strong> (${safeCurrency} ${safeAmount}.00) has expired.
		</p>
		<p style="margin: 0 0 20px 0;">
			Your website files, data, and configurations are secure. To reactivate your website immediately, please complete the renewal payment.
		</p>
		<p style="margin: 0 0 16px 0;">
			👉 Reactivate Your Website:<br/>
			<a href="${safePaymentHref}" style="color: #004ac6; font-weight: 700; text-decoration: underline;">${safePaymentText}</a>
		</p>
	`;

	const html = renderEmailShell({
		title: "Website Renewal Expired",
		contentHtml,
	});

	return sendEmail({ to: toEmail, subject, html });
}

/**
 * 9. Password Reset Request Email
 */
export async function sendPasswordResetEmail({
	toEmail,
	userName,
	resetUrl,
}: {
	toEmail: string;
	userName: string;
	resetUrl: string;
}) {
	const subject = "Reset Your Kioosk Password";
	const safeUserName = escapeHtml(userName || "there");
	const safeResetHref = sanitizeEmailUrl(resetUrl, "https://kioosk.online/get-started");
	const safeResetText = escapeHtml(resetUrl);

	const contentHtml = `
		<p style="margin: 0 0 16px 0;">Hi ${safeUserName},</p>
		<p style="margin: 0 0 16px 0;">
			We received a request to reset the password for your Kioosk account.
		</p>
		<p style="margin: 0 0 16px 0;">
			Click the link below to set a new password. This secure link will expire in <strong>1 hour</strong>:
		</p>
		<p style="margin: 0 0 24px 0;">
			👉 <a href="${safeResetHref}" style="color: #004ac6; font-weight: 700; text-decoration: underline;">Reset Your Password</a> (${safeResetText})
		</p>
		<p style="margin: 0; font-size: 13px; color: #6b7280;">
			If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
		</p>
	`;

	const html = renderEmailShell({
		title: "Reset Your Password",
		contentHtml,
	});

	return sendEmail({ to: toEmail, subject, html });
}

/**
 * 10. Support Ticket Notification & Customer Confirmation Emails
 */
export interface SupportTicketPayload {
	ticketId: string;
	name: string;
	email: string;
	phone?: string;
	category: string;
	priority: string;
	subject: string;
	message: string;
	websiteUrl?: string;
}

export async function sendSupportTicketEmail(payload: SupportTicketPayload) {
	const adminEmail = process.env.ADMIN_EMAIL || "support@kioosk.online";

	const safeTicketId = escapeHtml(payload.ticketId);
	const safeName = escapeHtml(payload.name);
	const cleanEmail = sanitizeEmailHeader(payload.email);
	const safeEmailText = escapeHtml(cleanEmail);
	const safeMailtoHref = escapeHtml(`mailto:${cleanEmail}`);
	const safePhone = payload.phone ? escapeHtml(payload.phone) : "";
	const safeCategory = escapeHtml(payload.category);
	const safePriority = escapeHtml(payload.priority.toUpperCase());
	const safeSubjectText = escapeHtml(payload.subject);
	const safeMessage = escapeHtml(payload.message);
	const safeWebsiteHref = payload.websiteUrl ? sanitizeEmailUrl(payload.websiteUrl) : "";
	const safeWebsiteText = payload.websiteUrl ? escapeHtml(payload.websiteUrl) : "";

	// 1. Send alert notification to Support Admin
	const adminSubject = sanitizeEmailHeader(
		`[Support Ticket #${payload.ticketId}] ${payload.priority.toUpperCase()}: ${payload.subject}`,
	);
	const adminContentHtml = `
		<p style="margin: 0 0 16px 0;"><strong>New Support Ticket #${safeTicketId}</strong></p>
		<div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
			<p style="margin: 0 0 8px 0;"><strong>Name:</strong> ${safeName}</p>
			<p style="margin: 0 0 8px 0;"><strong>Email:</strong> <a href="${safeMailtoHref}" style="color: #004ac6;">${safeEmailText}</a></p>
			${safePhone ? `<p style="margin: 0 0 8px 0;"><strong>Phone/WhatsApp:</strong> ${safePhone}</p>` : ""}
			<p style="margin: 0 0 8px 0;"><strong>Category:</strong> ${safeCategory}</p>
			<p style="margin: 0 0 8px 0;"><strong>Priority:</strong> ${safePriority}</p>
			${
				safeWebsiteHref
					? `<p style="margin: 0 0 8px 0;"><strong>Website/URL:</strong> <a href="${safeWebsiteHref}" target="_blank" rel="noopener noreferrer" style="color: #004ac6;">${safeWebsiteText}</a></p>`
					: safeWebsiteText
						? `<p style="margin: 0 0 8px 0;"><strong>Website/URL:</strong> ${safeWebsiteText}</p>`
						: ""
			}
		</div>

		<p style="margin: 0 0 8px 0; font-weight: 700;">Message Content:</p>
		<div style="background-color: #ffffff; border-left: 3px solid #004ac6; padding: 12px 16px; margin-bottom: 24px; font-family: monospace; font-size: 14px; white-space: pre-wrap; color: #1f2937;">
			${safeMessage}
		</div>

		<p style="margin: 0; font-size: 13px; color: #6b7280;">
			Reply directly to <a href="${safeMailtoHref}" style="color: #004ac6;">${safeEmailText}</a> to assist this customer.
		</p>
	`;

	const adminHtml = renderEmailShell({
		title: adminSubject,
		contentHtml: adminContentHtml,
	});

	await sendEmail({
		to: adminEmail,
		subject: adminSubject,
		html: adminHtml,
	});

	// 2. Send automated confirmation receipt to customer
	const clientSubject = sanitizeEmailHeader(
		`We received your inquiry: #${payload.ticketId} - Kioosk Support`,
	);
	const clientContentHtml = `
		<p style="margin: 0 0 16px 0;">Hi ${safeName},</p>
		<p style="margin: 0 0 16px 0;">
			Thank you for reaching out to Kioosk Support. We have received your inquiry regarding <strong>&quot;${safeSubjectText}&quot;</strong>.
		</p>
		<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin: 18px 0;">
			<p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;">Ticket Reference ID:</p>
			<p style="margin: 0; font-size: 16px; font-weight: 700; color: #004ac6;">#${safeTicketId}</p>
		</div>
		<p style="margin: 0 0 16px 0;">
			Our team has been notified and will review your request. Our typical response time is within <strong>2 to 4 hours</strong> during regular business operations.
		</p>
		<p style="margin: 0 0 16px 0;">
			If you need urgent real-time updates, you can also reach us <a href="https://wa.me/2348116062226" style="color: #004ac6; font-weight: 600; text-decoration: underline;">directly on WhatsApp (+234 811 606 2226)</a> or reply to this email with any additional details.
		</p>
	`;

	const clientHtml = renderEmailShell({
		title: clientSubject,
		contentHtml: clientContentHtml,
	});

	return sendEmail({
		to: cleanEmail,
		subject: clientSubject,
		html: clientHtml,
	});
}

/**
 * 11. Recurring Payment Success Email
 */
export async function sendRecurringPaymentSuccessEmail({
	toEmail,
	userName,
	plan,
	amount,
	currency,
	cardLast4,
	nextBillingDate,
}: {
	toEmail: string;
	userName: string;
	plan: string;
	amount: number;
	currency: string;
	cardLast4?: string;
	nextBillingDate: string;
}) {
	const subject = sanitizeEmailHeader(`Subscription Renewed: Your ${plan} Website is Active`);
	const safeUserName = escapeHtml(userName || "there");
	const safePlan = escapeHtml(plan);
	const safeCurrency = escapeHtml(currency);
	const safeAmount = escapeHtml(amount);
	const safeCardLast4 = cardLast4 ? escapeHtml(cardLast4) : "";
	const safeNextBillingDate = escapeHtml(nextBillingDate);
	const safeBillingHref = sanitizeEmailUrl(
		`${getAppUrl()}/dashboard/billing`,
		"https://kioosk.online/dashboard/billing",
	);

	const contentHtml = `
		<p style="margin: 0 0 16px 0;">Hi ${safeUserName},</p>
		<p style="margin: 0 0 16px 0;">
			Your recurring subscription for your <strong>${safePlan}</strong> website has automatically renewed successfully.
		</p>
		<div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
			<p style="margin: 0 0 6px 0; font-size: 14px; color: #166534;"><strong>Amount Billed:</strong> ${safeCurrency} ${safeAmount}.00</p>
			${safeCardLast4 ? `<p style="margin: 0 0 6px 0; font-size: 14px; color: #166534;"><strong>Payment Card:</strong> •••• ${safeCardLast4}</p>` : ""}
			<p style="margin: 0; font-size: 14px; color: #166534;"><strong>Next Renewal Date:</strong> ${safeNextBillingDate}</p>
		</div>
		<p style="margin: 0 0 16px 0;">
			Your live website and custom domain remain online with zero downtime. You can view your invoice history and manage your billing settings anytime from your dashboard.
		</p>
		<p style="margin: 0 0 16px 0;">
			👉 <a href="${safeBillingHref}" style="color: #004ac6; font-weight: 700; text-decoration: underline;">View Billing Dashboard</a>
		</p>
	`;

	const html = renderEmailShell({
		title: "Subscription Renewed",
		contentHtml,
	});

	return sendEmail({ to: toEmail, subject, html });
}

/**
 * 12. Recurring Payment Failed Warning Email
 */
export async function sendRecurringPaymentFailedEmail({
	toEmail,
	userName,
	plan,
	amount,
	currency,
	cardLast4,
	paymentLink,
	dueDate,
}: {
	toEmail: string;
	userName: string;
	plan: string;
	amount: number;
	currency: string;
	cardLast4?: string;
	paymentLink: string;
	dueDate: string;
}) {
	const subject = sanitizeEmailHeader(
		`Urgent: Recurring Payment Failed for Your ${plan} Website`,
	);
	const safeUserName = escapeHtml(userName || "there");
	const safePlan = escapeHtml(plan);
	const safeCurrency = escapeHtml(currency);
	const safeAmount = escapeHtml(amount);
	const safeCardLast4 = cardLast4 ? escapeHtml(cardLast4) : "";
	const safeDueDate = escapeHtml(dueDate);
	const safePaymentHref = sanitizeEmailUrl(paymentLink, "https://kioosk.online/dashboard/billing");

	const contentHtml = `
		<p style="margin: 0 0 16px 0;">Hi ${safeUserName},</p>
		<p style="margin: 0 0 16px 0;">
			We attempted to renew your <strong>${safePlan}</strong> website subscription (${safeCurrency} ${safeAmount}.00)${safeCardLast4 ? ` using your card ending in •••• ${safeCardLast4}` : ""}, but the charge could not be completed.
		</p>
		<div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
			<p style="margin: 0; font-size: 14px; color: #92400e;">
				<strong>Notice:</strong> If payment is not completed or recurring billing updated before <strong>${safeDueDate}</strong>, your plan will be terminated and your live website will be paused.
			</p>
		</div>
		<p style="margin: 0 0 16px 0;">
			Please update your payment method or pay the renewal invoice immediately using the link below:
		</p>
		<p style="margin: 0 0 20px 0;">
			👉 <a href="${safePaymentHref}" style="color: #004ac6; font-weight: 700; text-decoration: underline;">Pay Renewal & Update Payment Method</a>
		</p>
	`;

	const html = renderEmailShell({
		title: "Recurring Payment Failed",
		contentHtml,
	});

	return sendEmail({ to: toEmail, subject, html });
}

/**
 * 13. Plan Terminated Notice Email
 */
export async function sendPlanTerminatedNoticeEmail({
	toEmail,
	userName,
	plan,
	reactivationLink,
}: {
	toEmail: string;
	userName: string;
	plan: string;
	reactivationLink: string;
}) {
	const subject = sanitizeEmailHeader(
		`Your Kioosk Subscription Plan Has Been Terminated: ${plan}`,
	);
	const safeUserName = escapeHtml(userName || "there");
	const safePlan = escapeHtml(plan);
	const safeReactivationHref = sanitizeEmailUrl(
		reactivationLink,
		"https://kioosk.online/dashboard/billing",
	);
	const safeReactivationText = escapeHtml(reactivationLink);

	const contentHtml = `
		<p style="margin: 0 0 16px 0;">Hi ${safeUserName},</p>
		<p style="margin: 0 0 16px 0;">
			Your 1-month subscription period for your <strong>${safePlan}</strong> website has ended and no active recurring payment was received. As a result, your subscription plan has been terminated and your live website is temporarily paused.
		</p>
		<div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
			<p style="margin: 0 0 8px 0; font-size: 14px; color: #991b1b;">
				<strong>Website Status:</strong> Paused / Subscription Inactive
			</p>
			<p style="margin: 0; font-size: 13px; color: #b91c1c;">
				Your website content, domain settings, images, and data remain securely stored. Nothing has been deleted.
			</p>
		</div>
		<p style="margin: 0 0 16px 0;">
			To instantly reactivate your website and restore live visitors, please log in and restart your subscription:
		</p>
		<p style="margin: 0 0 24px 0;">
			👉 <a href="${safeReactivationHref}" style="color: #004ac6; font-weight: 700; text-decoration: underline;">Reactivate Your Plan Now</a> (${safeReactivationText})
		</p>
		<p style="margin: 0; font-size: 13px; color: #6b7280;">
			If you have any questions or require assistance, reply directly to this email and our team will help you.
		</p>
	`;

	const html = renderEmailShell({
		title: "Subscription Plan Terminated",
		contentHtml,
	});

	return sendEmail({ to: toEmail, subject, html });
}

/**
 * 14. Recurring Payment Setup Reminder Email (Sent prior to 1-month period end)
 */
export async function sendRecurringSetupReminderEmail({
	toEmail,
	userName,
	plan,
	expiryDate,
	paymentLink,
}: {
	toEmail: string;
	userName: string;
	plan: string;
	expiryDate: string;
	paymentLink: string;
}) {
	const subject = sanitizeEmailHeader(
		`Action Required: Your ${plan} 1-Month Subscription Expires on ${expiryDate}`,
	);
	const safeUserName = escapeHtml(userName || "there");
	const safePlan = escapeHtml(plan);
	const safeExpiryDate = escapeHtml(expiryDate);
	const safePaymentHref = sanitizeEmailUrl(paymentLink, "https://kioosk.online/dashboard/billing");
	const safePaymentText = escapeHtml(paymentLink);

	const contentHtml = `
		<p style="margin: 0 0 16px 0;">Hi ${safeUserName},</p>
		<p style="margin: 0 0 16px 0;">
			Your 1-month subscription for your <strong>${safePlan}</strong> website will expire on <strong>${safeExpiryDate}</strong>.
		</p>
		<div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
			<p style="margin: 0; font-size: 14px; color: #92400e;">
				<strong>Notice:</strong> Automatic recurring payment is currently <strong>not set</strong> on your account. To prevent your website plan from terminating at the end of the period, please ensure payment is completed or set up recurring card billing.
			</p>
		</div>
		<p style="margin: 0 0 16px 0;">
			👉 Renew & Enable Recurring Payment:<br/>
			<a href="${safePaymentHref}" style="color: #004ac6; font-weight: 700; text-decoration: underline;">${safePaymentText}</a>
		</p>
	`;

	const html = renderEmailShell({
		title: "Subscription Renewal Notice",
		contentHtml,
	});

	return sendEmail({ to: toEmail, subject, html });
}
