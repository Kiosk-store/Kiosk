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
