/** @format */

import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/ratelimit";
import { sendSupportTicketEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters."),
	email: z.string().email("Please provide a valid email address."),
	phone: z.string().optional().or(z.literal("")),
	category: z.string().default("Technical Support & Site Edits"),
	priority: z.enum(["normal", "high", "urgent"]).default("normal"),
	subject: z.string().min(3, "Subject must be at least 3 characters."),
	message: z.string().min(10, "Message must be at least 10 characters."),
	websiteUrl: z.string().optional().or(z.literal("")),
});

/**
 * POST /api/contact
 * Handles inbound customer support requests, website edit tickets, and sales inquiries.
 */
export async function POST(request: Request) {
	try {
		const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
		const rateLimit = await checkRateLimit(ip, "api");
		if (!rateLimit.success) {
			return NextResponse.json(
				{ error: "Too many requests. Please wait a minute before submitting again." },
				{ status: 429 },
			);
		}

		const body = await request.json().catch(() => ({}));
		const parseResult = contactSchema.safeParse(body);

		if (!parseResult.success) {
			const issues = parseResult.error.issues || [];
			const errorMsg =
				issues.length > 0
					? issues.map((i: { message: string }) => i.message).join(" ")
					: "Please check all required fields and provide valid information.";
			return NextResponse.json(
				{ error: errorMsg, details: parseResult.error.flatten() },
				{ status: 400 },
			);
		}

		const { name, email, phone, category, priority, subject, message, websiteUrl } =
			parseResult.data;

		// Generate structured ticket ID: e.g. KSK-849201
		const randomSuffix = Math.floor(100000 + Math.random() * 900000);
		const ticketId = `KSK-${randomSuffix}`;

		// Dispatch notifications via email system
		await sendSupportTicketEmail({
			ticketId,
			name,
			email,
			phone,
			category,
			priority,
			subject,
			message,
			websiteUrl,
		}).catch((err) => {
			console.error("[CONTACT_EMAIL_DISPATCH_ERROR]", err);
		});

		return NextResponse.json(
			{
				success: true,
				ticketId,
				message:
					"Your support inquiry has been received. A confirmation has been sent to your email.",
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("[CONTACT_ROUTE_EXCEPTION]", error);
		return NextResponse.json(
			{ error: "An unexpected server error occurred while processing your request." },
			{ status: 500 },
		);
	}
}
