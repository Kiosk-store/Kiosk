/**
 * Resend Transactional Email Notification System
 *
 * Professional, clean, and accessible transactional email templates for Kiosk:
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
const EMAIL_FROM = process.env.EMAIL_FROM || "Kiosk <noreply@kioosk.online>";

/**
 * Resolves the active base application URL across local dev, preview branches, and production.
 */
function getAppUrl(): string {
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
export async function sendEmail({ to, subject, html }: SendEmailPayload): Promise<{ success: boolean; id?: string; error?: string }> {
	if (!RESEND_API_KEY) {
		console.log(`[EMAIL_DEV_FALLBACK] To: ${to} | Subject: ${subject}`);
		return { success: true, id: `dev_mock_${crypto.randomUUID().slice(0, 8)}` };
	}

	try {
		const res = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${RESEND_API_KEY}`,
			},
			body: JSON.stringify({
				from: EMAIL_FROM,
				to: [to],
				subject,
				html,
			}),
		});

		const data = await res.json();

		if (!res.ok) {
			console.error("[RESEND_API_ERROR]", data);
			return { success: false, error: data.message || "Failed to dispatch email via Resend" };
		}

		return { success: true, id: data.id };
	} catch (err) {
		console.error("[EMAIL_DISPATCH_EXCEPTION]", err);
		return { success: false, error: "Unexpected network error during email dispatch" };
	}
}

/**
 * Helper generating consistent email base shell
 */
function renderEmailShell({
	title,
	headerTag,
	contentHtml,
	footerNote,
}: {
	title: string;
	headerTag?: string;
	contentHtml: string;
	footerNote?: string;
}) {
	return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>${title}</title>
			</head>
			<body style="margin: 0; padding: 32px 16px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.5; -webkit-font-smoothing: antialiased;">
				<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
					<tr>
						<td align="center">
							<table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; border-spacing: 0; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);" cellpadding="0" cellspacing="0">
								<!-- Top Header -->
								<tr>
									<td style="padding: 24px 32px; border-bottom: 1px solid #f1f5f9;">
										<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
											<tr>
												<td align="left">
													<table role="presentation" border="0" cellspacing="0" cellpadding="0">
														<tr>
															<td style="width: 32px; height: 32px; background-color: #004ac6; border-radius: 8px; text-align: center; vertical-align: middle; color: #ffffff; font-weight: 800; font-size: 16px;">
																K
															</td>
															<td style="padding-left: 10px; font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">
																KIOSK
															</td>
														</tr>
													</table>
												</td>
												${
													headerTag
														? `<td align="right">
																<span style="display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; color: #004ac6; background-color: #eff6ff; border: 1px solid #dbeafe; border-radius: 9999px; text-transform: uppercase;">
																	${headerTag}
																</span>
														   </td>`
														: ""
												}
											</tr>
										</table>
									</td>
								</tr>

								<!-- Main Body Content -->
								<tr>
									<td style="padding: 32px;">
										${contentHtml}
									</td>
								</tr>

								<!-- Clean Footer -->
								<tr>
									<td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
										<p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
											${footerNote || "This is an automated notification from your Kiosk workspace."}<br/>
											© ${new Date().getFullYear()} Kiosk Technologies. All rights reserved.
										</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</body>
		</html>
	`;
}

/**
 * 1. Welcome Greeting Email
 */
export async function sendWelcomeEmail(toEmail: string, userName: string) {
	const appUrl = getAppUrl();
	const subject = "Welcome to Kiosk - Your Workspace is Ready";
	const contentHtml = `
		<h1 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 800; color: #0f172a;">Welcome aboard, ${userName}!</h1>
		<p style="margin: 0 0 20px 0; font-size: 14px; color: #475569; line-height: 1.6;">
			Your Kiosk workspace is fully configured. You can now submit your business details, view live website builds, and manage your online presence in one place.
		</p>
		<div style="margin: 28px 0; text-align: left;">
			<a href="${appUrl}/dashboard" style="display: inline-block; background-color: #004ac6; color: #ffffff; font-weight: 700; font-size: 13px; padding: 12px 28px; border-radius: 9999px; text-decoration: none;">
				Open Your Dashboard
			</a>
		</div>
		<p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.6;">
			If you ever have questions or need assistance with your site, our team is available to help anytime.
		</p>
	`;

	const html = renderEmailShell({
		title: "Welcome to Kiosk",
		headerTag: "Account Ready",
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
	const adminEmail = process.env.ADMIN_EMAIL || process.env.NOTIFICATION_EMAIL || "kioskonline3@gmail.com";
	const appUrl = getAppUrl();
	const reviewUrl = payload.projectId ? `${appUrl}/admin/projects/${payload.projectId}` : `${appUrl}/admin/projects`;
	const subject = `New Submission: ${payload.businessName} (${payload.plan.replace(/_/g, " ")})`;

	const contentHtml = `
		<h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 800; color: #0f172a;">New Client Content Submitted</h1>
		<p style="margin: 0 0 20px 0; font-size: 14px; color: #64748b;">
			A client has submitted their website intake details for fulfillment review and domain publishing.
		</p>

		<!-- Business Summary Card -->
		<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
			<div style="margin-bottom: 12px;">
				<span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Business Name</span>
				<p style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 2px 0 0 0;">${payload.businessName}</p>
			</div>

			<div style="margin-bottom: 12px;">
				<span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Tagline</span>
				<p style="font-size: 13px; font-weight: 600; color: #334155; margin: 2px 0 0 0;">${payload.tagline || "N/A"}</p>
			</div>

			<div style="border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 12px;">
				<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
					<tr>
						<td style="font-size: 12px; color: #64748b;">Plan:</td>
						<td align="right" style="font-size: 12px; font-weight: 700; color: #004ac6;">${payload.plan.replace(/_/g, " ")}</td>
					</tr>
					<tr>
						<td style="font-size: 12px; color: #64748b; padding-top: 6px;">Theme Mode:</td>
						<td align="right" style="font-size: 12px; font-weight: 600; color: #334155; padding-top: 6px;">${payload.themeMode || "Light"}</td>
					</tr>
					<tr>
						<td style="font-size: 12px; color: #64748b; padding-top: 6px;">Brand Assets:</td>
						<td align="right" style="font-size: 12px; font-weight: 600; color: #334155; padding-top: 6px;">${payload.imagesCount || 0} Photos Attached</td>
					</tr>
				</table>
			</div>
		</div>

		<!-- Client Contact Info -->
		<div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
			<span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 8px;">Customer Information</span>
			<p style="font-size: 13px; color: #334155; margin: 0 0 4px 0;"><strong>Name:</strong> ${payload.clientName}</p>
			<p style="font-size: 13px; color: #334155; margin: 0 0 4px 0;"><strong>Email:</strong> <a href="mailto:${payload.clientEmail}" style="color: #004ac6; text-decoration: none;">${payload.clientEmail}</a></p>
			${payload.contactPhone ? `<p style="font-size: 13px; color: #334155; margin: 0 0 4px 0;"><strong>Phone:</strong> ${payload.contactPhone}</p>` : ""}
			${payload.whatsappLink ? `<p style="font-size: 13px; color: #334155; margin: 0;"><strong>WhatsApp:</strong> ${payload.whatsappLink}</p>` : ""}
		</div>

		<div style="text-align: center; margin-bottom: 8px;">
			<a href="${reviewUrl}" style="display: inline-block; background-color: #004ac6; color: #ffffff; font-weight: 700; font-size: 13px; padding: 12px 32px; border-radius: 9999px; text-decoration: none;">
				Open Review Studio in Admin Hub
			</a>
		</div>
	`;

	const html = renderEmailShell({
		title: "New Website Review Request",
		headerTag: "Action Required",
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
	const subject = `Details Received: ${businessName} is Now in Review`;

	const contentHtml = `
		<div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
			<span style="display: inline-block; background-color: #16a34a; color: #ffffff; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 9999px; margin-bottom: 6px; text-transform: uppercase;">In Review</span>
			<h1 style="font-size: 18px; font-weight: 800; color: #15803d; margin: 0 0 4px 0;">We have received your business details!</h1>
			<p style="font-size: 13px; color: #166534; margin: 0;">
				Thank you ${clientName || "there"}, our team has received your content and brand assets for <strong>${businessName}</strong>.
			</p>
		</div>

		<p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
			Our fulfillment team is now personalizing your <strong>${plan.replace(/_/g, " ")}</strong> website layout, setting up your domain, and optimizing your responsive views.
		</p>

		<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
			<p style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">What happens next?</p>
			<ul style="font-size: 13px; color: #64748b; margin: 0; padding-left: 18px; line-height: 1.6;">
				<li>Our team reviews your submitted brand photos and copy.</li>
				<li>We configure your subdomains and WhatsApp ordering triggers.</li>
				<li>You will receive an email as soon as your website is live!</li>
			</ul>
		</div>

		<div style="text-align: left; margin-bottom: 16px;">
			<a href="${appUrl}/dashboard/projects" style="display: inline-block; background-color: #004ac6; color: #ffffff; font-weight: 700; font-size: 13px; padding: 12px 28px; border-radius: 9999px; text-decoration: none;">
				Track Status in Dashboard
			</a>
		</div>
	`;

	const html = renderEmailShell({
		title: "Website Details Received",
		headerTag: "In Progress",
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
	const subject = `Your Website is Live: ${payload.businessName}`;

	const contentHtml = `
		<div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
			<span style="display: inline-block; background-color: #16a34a; color: #ffffff; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 9999px; margin-bottom: 6px; text-transform: uppercase;">Published</span>
			<h1 style="font-size: 18px; font-weight: 800; color: #15803d; margin: 0 0 4px 0;">Your website is officially live!</h1>
			<p style="font-size: 13px; color: #166534; margin: 0;">
				Congratulations ${payload.clientName || "there"}, your <strong>${payload.businessName}</strong> website has completed review and is published online.
			</p>
		</div>

		<!-- Live URL Box -->
		<div style="background-color: #004ac6; border-radius: 12px; padding: 24px; color: #ffffff; margin-bottom: 24px; text-align: center;">
			<span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #93c5fd; display: block; margin-bottom: 6px;">Your Published Website</span>
			<p style="font-size: 16px; font-weight: 800; color: #ffffff; word-break: break-all; margin: 0 0 16px 0;">
				${payload.publishedUrl}
			</p>
			<a href="${payload.publishedUrl}" target="_blank" style="display: inline-block; background-color: #ffffff; color: #004ac6; font-weight: 800; font-size: 13px; padding: 10px 26px; border-radius: 9999px; text-decoration: none;">
				Visit Your Live Website
			</a>
		</div>

		<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
			<p style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">Next steps for your business:</p>
			<ul style="font-size: 13px; color: #64748b; margin: 0; padding-left: 18px; line-height: 1.6;">
				<li>Share your link across WhatsApp, Instagram, and social bio links.</li>
				<li>Inquiries and WhatsApp orders will route directly to your phone.</li>
				<li>You can update business hours and details anytime from your dashboard.</li>
			</ul>
		</div>

		<div style="text-align: left;">
			<a href="${appUrl}/dashboard" style="display: inline-block; background-color: #f1f5f9; color: #0f172a; font-weight: 700; font-size: 13px; padding: 10px 24px; border-radius: 9999px; text-decoration: none; border: 1px solid #cbd5e1;">
				Go to Dashboard
			</a>
		</div>
	`;

	const html = renderEmailShell({
		title: "Your Website is Live",
		headerTag: "Published Live",
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
	const subject = `Update on ${projectName}: Status is ${status}`;
	const contentHtml = `
		<h1 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 800; color: #0f172a;">Project Status Update</h1>
		<p style="margin: 0 0 16px 0; font-size: 14px; color: #475569; line-height: 1.6;">
			Hello ${userName}, your project <strong>${projectName}</strong> has been updated to: <strong style="color: #004ac6;">${status}</strong>.
		</p>
		${
			publishedUrl
				? `<p style="margin: 0 0 20px 0; font-size: 13px; color: #475569;">Published URL: <a href="${publishedUrl}" style="color: #004ac6; font-weight: 700; text-decoration: none;">${publishedUrl}</a></p>`
				: ""
		}
		<div style="margin-top: 20px;">
			<a href="${appUrl}/dashboard/projects" style="display: inline-block; background-color: #004ac6; color: #ffffff; font-weight: 700; font-size: 13px; padding: 10px 24px; border-radius: 9999px; text-decoration: none;">
				View Project
			</a>
		</div>
	`;

	const html = renderEmailShell({
		title: "Project Status Update",
		headerTag: status,
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
	const subject = `Invoice ${invoiceNumber}: Kiosk ${plan} Renewal`;
	const contentHtml = `
		<h1 style="margin: 0 0 6px 0; font-size: 18px; font-weight: 800; color: #0f172a;">Website Hosting Renewal Invoice</h1>
		<p style="margin: 0 0 20px 0; font-size: 13px; color: #64748b;">Invoice Number: <strong>${invoiceNumber}</strong> | Due Date: <strong>${dueDate}</strong></p>

		<p style="margin: 0 0 16px 0; font-size: 14px; color: #334155; line-height: 1.6;">
			Hello ${userName}, your monthly hosting and maintenance subscription for <strong>${plan}</strong> is ready for renewal.
		</p>

		<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
			<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
				<tr>
					<td style="font-size: 13px; color: #64748b;">Plan:</td>
					<td align="right" style="font-size: 13px; font-weight: 700; color: #0f172a;">${plan}</td>
				</tr>
				<tr>
					<td style="font-size: 14px; font-weight: 700; color: #0f172a; padding-top: 10px; border-top: 1px solid #e2e8f0;">Total Amount:</td>
					<td align="right" style="font-size: 16px; font-weight: 800; color: #004ac6; padding-top: 10px; border-top: 1px solid #e2e8f0;">${currency} ${amount}.00</td>
				</tr>
			</table>
		</div>

		<div style="text-align: center; margin-bottom: 20px;">
			<a href="${paymentLink}" style="display: inline-block; background-color: #004ac6; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 32px; border-radius: 9999px; text-decoration: none;">
				Pay Invoice (${currency} ${amount}.00)
			</a>
		</div>

		<p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5; text-align: center;">
			Supports Card, Bank Transfer, USSD, and Mobile Money.
		</p>
	`;

	const html = renderEmailShell({
		title: `Invoice ${invoiceNumber}`,
		headerTag: "Renewal Due",
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
	const subject = `Notice: ${daysRemaining} Days Remaining for Invoice #${invoiceNumber}`;
	const contentHtml = `
		<div style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
			<span style="display: inline-block; background-color: #ea580c; color: #ffffff; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 9999px; margin-bottom: 6px; text-transform: uppercase;">Grace Period</span>
			<h1 style="font-size: 18px; font-weight: 800; color: #9a3412; margin: 0 0 4px 0;">Hosting Renewal Pending</h1>
			<p style="font-size: 13px; color: #c2410c; margin: 0;">
				Hello ${userName}, renewal invoice #${invoiceNumber} for your <strong>${plan}</strong> website remains unpaid.
			</p>
		</div>

		<p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
			Your website remains active under our grace period. Please complete payment within the next <strong>${daysRemaining} days</strong> to ensure uninterrupted service.
		</p>

		<div style="text-align: center; margin-bottom: 16px;">
			<a href="${paymentLink}" style="display: inline-block; background-color: #ea580c; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 32px; border-radius: 9999px; text-decoration: none;">
				Pay Invoice (${currency} ${amount}.00)
			</a>
		</div>
	`;

	const html = renderEmailShell({
		title: "Grace Period Notice",
		headerTag: "Urgent",
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
	const subject = `Action Required: Website Renewal Expired #${invoiceNumber}`;
	const contentHtml = `
		<div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
			<span style="display: inline-block; background-color: #dc2626; color: #ffffff; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 9999px; margin-bottom: 6px; text-transform: uppercase;">Payment Required</span>
			<h1 style="font-size: 18px; font-weight: 800; color: #991b1b; margin: 0 0 4px 0;">Hosting Renewal Overdue</h1>
			<p style="font-size: 13px; color: #b91c1c; margin: 0;">
				Hello ${userName}, the grace period for invoice #${invoiceNumber} has ended.
			</p>
		</div>

		<p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
			Your website files, data, and configurations are secure. To restore your site to live status, please complete the renewal payment.
		</p>

		<div style="text-align: center; margin-bottom: 16px;">
			<a href="${paymentLink}" style="display: inline-block; background-color: #dc2626; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 32px; border-radius: 9999px; text-decoration: none;">
				Restore Website (${currency} ${amount}.00)
			</a>
		</div>
	`;

	const html = renderEmailShell({
		title: "Website Renewal Expired",
		headerTag: "Expired",
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
	const subject = "Reset Your Kiosk Password";
	const contentHtml = `
		<h1 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 800; color: #0f172a;">Password Reset Request</h1>
		<p style="margin: 0 0 16px 0; font-size: 14px; color: #334155; line-height: 1.6;">
			Hello ${userName || "there"}, we received a request to reset the password for your Kiosk account.
		</p>
		<p style="margin: 0 0 24px 0; font-size: 13px; color: #64748b; line-height: 1.6;">
			Click the button below to choose a new password. This secure link is valid for <strong>1 hour</strong>.
		</p>

		<div style="margin-bottom: 24px;">
			<a href="${resetUrl}" style="display: inline-block; background-color: #004ac6; color: #ffffff; font-weight: 700; font-size: 13px; padding: 12px 28px; border-radius: 9999px; text-decoration: none;">
				Reset Password
			</a>
		</div>

		<p style="margin: 0 0 12px 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
			If you did not request this, please ignore this email. Your password will remain unchanged.
		</p>
	`;

	const html = renderEmailShell({
		title: "Reset Your Password",
		headerTag: "Security",
		contentHtml,
	});

	return sendEmail({ to: toEmail, subject, html });
}
