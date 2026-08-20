/**
 * Resend Transactional Email Notification System
 *
 * Provides transactional email dispatching for user lifecycle events:
 * 1. Welcome Greeting Email (`sendWelcomeEmail`)
 * 2. Project Status Update Notice (`sendProjectStatusEmail`)
 * 3. Password Reset Request Email (`sendPasswordResetEmail`)
 *
 * Features automatic local development fallback logging when `RESEND_API_KEY` is not set.
 *
 * @module email
 * @format
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const EMAIL_FROM = process.env.EMAIL_FROM || "Kiosk <noreply@kioosk.online>";

export interface SendEmailPayload {
	to: string;
	subject: string;
	html: string;
}

/**
 * Dispatches an email via Resend API or logs fallback payload in local development mode.
 *
 * @param payload - Recipient, subject line, and HTML template string
 * @returns Object indicating success status and message ID or error
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
 * Dispatches Welcome Email to newly registered users.
 *
 * @param toEmail - User email address
 * @param userName - User full name or display handle
 */
export async function sendWelcomeEmail(toEmail: string, userName: string) {
	const subject = "Welcome to Kiosk! Your Multi-Tenant Workspace is Live";
	const html = `
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8">
				<title>Welcome to Kiosk</title>
			</head>
			<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 40px 20px;">
				<div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; border: 1px solid #e2e8f0;">
					<div style="display: flex; align-items: center; margin-bottom: 24px;">
						<div style="width: 32px; height: 32px; background-color: #2563eb; border-radius: 8px; color: #ffffff; font-weight: bold; text-align: center; line-height: 32px; font-size: 16px; margin-right: 12px;">K</div>
						<span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">KIOSK</span>
					</div>
					<h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">Welcome aboard, ${userName}!</h1>
					<p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
						Your custom multi-tenant workspace is fully provisioned and ready. You can now build, manage, and scale your custom website landing pages, sales funnels, and e-commerce stores.
					</p>
					<div style="margin-bottom: 32px;">
						<a href="${process.env.NEXT_PUBLIC_APP_URL || "https://kioosk.online"}/dashboard" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 9999px; text-decoration: none;">Go to Your Dashboard →</a>
					</div>
					<hr style="border: none; border-top: 1px solid #f1f5f9; margin-bottom: 24px;" />
					<p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
						If you have any questions, our dedicated support team is available 24/7 inside your workspace.
					</p>
				</div>
			</body>
		</html>
	`;

	return sendEmail({ to: toEmail, subject, html });
}

/**
 * Dispatches Project Build Status Updates to users.
 *
 * @param toEmail - User email address
 * @param userName - User name
 * @param projectName - Name of site project
 * @param status - Project status (e.g. "In Progress", "Published")
 * @param publishedUrl - Subdomain URL
 */
export async function sendProjectStatusEmail(
	toEmail: string,
	userName: string,
	projectName: string,
	status: string,
	publishedUrl?: string,
) {
	const subject = `Update on ${projectName}: Status is now ${status}`;
	const html = `
		<!DOCTYPE html>
		<html>
			<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 40px 20px;">
				<div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; border: 1px solid #e2e8f0;">
					<h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">Hello ${userName},</h2>
					<p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
						Great news! Your project <strong>${projectName}</strong> has been updated to status: <span style="background-color: #dbeafe; color: #1e40af; font-weight: 700; padding: 4px 10px; border-radius: 9999px; font-size: 12px;">${status}</span>.
					</p>
					${
						publishedUrl
							? `<p style="font-size: 14px; color: #475569; margin-bottom: 24px;">Preview URL: <a href="${publishedUrl}" style="color: #2563eb; font-weight: 600;">${publishedUrl}</a></p>`
							: ""
					}
					<a href="${process.env.NEXT_PUBLIC_APP_URL || "https://kioosk.online"}/dashboard" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 9999px; text-decoration: none;">View Project Details</a>
				</div>
			</body>
		</html>
	`;

	return sendEmail({ to: toEmail, subject, html });
}

/**
 * Dispatches Fresh Scheduled Payment Request (Invoice) for upcoming billing cycle.
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
	const subject = `Invoice ${invoiceNumber}: Kiosk ${plan} Renewal Payment Request`;
	const html = `
		<!DOCTYPE html>
		<html>
			<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 40px 20px;">
				<div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; border: 1px solid #e2e8f0;">
					<div style="display: flex; align-items: center; margin-bottom: 24px;">
						<div style="width: 32px; height: 32px; background-color: #004ac6; border-radius: 8px; color: #ffffff; font-weight: bold; text-align: center; line-height: 32px; font-size: 16px; margin-right: 12px;">K</div>
						<span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">KIOSK BILLING</span>
					</div>
					<h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Upcoming Hosting Renewal Invoice</h1>
					<p style="font-size: 14px; color: #64748b; margin-bottom: 24px;">Invoice Number: <strong>${invoiceNumber}</strong> | Due Date: <strong>${dueDate}</strong></p>
					
					<p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
						Hello ${userName}, your monthly hosting and maintenance subscription for <strong>${plan}</strong> is ready for renewal.
					</p>

					<div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
						<div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
							<span style="color: #64748b;">Plan Subscription</span>
							<strong style="color: #0f172a;">${plan}</strong>
						</div>
						<div style="display: flex; justify-content: space-between; font-size: 16px; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
							<span style="font-weight: 700; color: #0f172a;">Total Due</span>
							<strong style="font-weight: 800; color: #004ac6;">${currency} ${amount}.00</strong>
						</div>
					</div>

					<div style="margin-bottom: 28px; text-align: center;">
						<a href="${paymentLink}" style="display: block; background-color: #004ac6; color: #ffffff; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 9999px; text-decoration: none; text-align: center;">Click to Pay Invoice (${currency} ${amount}.00) →</a>
					</div>

					<div style="background-color: #eff6ff; border-radius: 10px; padding: 16px; border: 1px solid #bfdbfe; margin-bottom: 24px;">
						<p style="font-size: 12px; font-weight: 700; color: #1e40af; margin: 0 0 4px 0;">Flexible Payment Channels Supported:</p>
						<p style="font-size: 12px; color: #1e3a8a; margin: 0;">
							✓ Debit/Credit Card (Visa, Mastercard, Verve)<br/>
							✓ Instant Bank Transfer (Virtual Account)<br/>
							✓ USSD (*737#, *919#, etc.)<br/>
							✓ Mobile Money Wallets
						</p>
					</div>

					<hr style="border: none; border-top: 1px solid #f1f5f9; margin-bottom: 20px;" />
					<p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;">
						Note: We do not automatically debit your card silently. Please click the button above to pay and keep your website online.
					</p>
				</div>
			</body>
		</html>
	`;

	return sendEmail({ to: toEmail, subject, html });
}

/**
 * Dispatches Grace Period Reminder when invoice payment is past due.
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
	const subject = `Urgent: ${daysRemaining} Days of Grace Period Remaining for ${invoiceNumber}`;
	const html = `
		<!DOCTYPE html>
		<html>
			<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 40px 20px;">
				<div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; border: 1px solid #fed7aa;">
					<div style="display: inline-block; background-color: #ffedd5; color: #c2410c; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; margin-bottom: 16px;">
						GRACE PERIOD NOTICE (${daysRemaining} DAYS REMAINING)
					</div>
					<h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">Your Kiosk Website Hosting Renewal is Due</h1>
					<p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
						Hello ${userName}, we noticed the renewal invoice <strong>#${invoiceNumber}</strong> (${currency} ${amount}.00) for your <strong>${plan}</strong> website has not been completed.
					</p>
					<p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
						Your website remains active under our 7-day grace period. Please settle this invoice within the next <strong>${daysRemaining} days</strong> to prevent temporary site suspension.
					</p>

					<div style="margin-bottom: 28px; text-align: center;">
						<a href="${paymentLink}" style="display: block; background-color: #ea580c; color: #ffffff; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 9999px; text-decoration: none; text-align: center;">Pay Overdue Invoice (${currency} ${amount}.00) →</a>
					</div>

					<p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 0;">
						Supports Card, Direct Bank Transfer, USSD, and Mobile Money.
					</p>
				</div>
			</body>
		</html>
	`;

	return sendEmail({ to: toEmail, subject, html });
}

/**
 * Dispatches Site Flagged / Suspended Notification when grace period expires.
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
	const subject = `Action Required: Website Temporarily Flagged for Unpaid Renewal #${invoiceNumber}`;
	const html = `
		<!DOCTYPE html>
		<html>
			<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 40px 20px;">
				<div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; border: 1px solid #fecaca;">
					<div style="display: inline-block; background-color: #fee2e2; color: #b91c1c; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; margin-bottom: 16px;">
						SITE FLAGGED / PAYMENT REQUIRED
					</div>
					<h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">Your Website Hosting Has Expired</h1>
					<p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
						Hello ${userName}, the 7-day grace period for invoice <strong>#${invoiceNumber}</strong> has ended without payment. Your website for <strong>${plan}</strong> is currently displaying a temporary payment notice.
					</p>
					<p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
						Your site files, domain configurations, and content remain completely safe. To instantly restore your website to live status, click the button below to complete the renewal payment.
					</p>

					<div style="margin-bottom: 28px; text-align: center;">
						<a href="${paymentLink}" style="display: block; background-color: #dc2626; color: #ffffff; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 9999px; text-decoration: none; text-align: center;">Instantly Restore Website (${currency} ${amount}.00) →</a>
					</div>
				</div>
			</body>
		</html>
	`;

	return sendEmail({ to: toEmail, subject, html });
}
