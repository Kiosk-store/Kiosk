/**
 * File & Media Upload API Route
 *
 * Handles client file uploads (images, logos, brand PDFs), uploads them to Cloudinary
 * with SHA-1 signature authentication, and returns optimized CDN URLs.
 *
 * @module api/upload
 * @format
 */

import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/storage/cloudinary";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/ratelimit";
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
	try {
		const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
		const rateLimit = await checkRateLimit(ip, "api");
		if (!rateLimit.success) {
			return NextResponse.json(
				{ error: "Too many upload requests. Please try again in a moment." },
				{ status: 429 },
			);
		}

		// Authenticate User
		const authSession = await auth();
		const customUser = await getAuthenticatedUser();
		const userId = authSession?.user?.id || customUser?.id;

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized. Please sign in to upload files." }, { status: 401 });
		}

		// Resolve Multi-Tenant Workspace for folder partitioning
		let tenant = await db.query.tenants.findFirst({
			where: eq(tenants.ownerId, userId),
		});

		const tenantSlug = tenant?.slug || `user-${userId.slice(0, 8)}`;

		const formData = await request.formData();
		const file = formData.get("file") as File | null;
		const category = ((formData.get("category") || formData.get("folder") || "assets") as string)
			.replace(/^kiosk\/?(tenants\/[^\/]+\/)?/, "")
			.replace(/[^a-z0-9_-]/gi, "");

		// Strict Multi-Tenant Folder Partitioning: kiosk/tenants/<tenantSlug>/<category>
		const isolatedFolder = `kiosk/tenants/${tenantSlug}/${category || "assets"}`;

		if (!file) {
			return NextResponse.json({ error: "No file provided in form data." }, { status: 400 });
		}

		// Max size validation: 25MB
		const maxSizeBytes = 25 * 1024 * 1024;
		if (file.size > maxSizeBytes) {
			return NextResponse.json({ error: "File size exceeds the 25MB limit." }, { status: 400 });
		}

		// Generate collision-proof file ID
		const nameBase = file.name.split(".").slice(0, -1).join(".").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30) || "asset";
		const uniquePublicId = `${nameBase}_${Date.now()}_${crypto.randomUUID().slice(0, 6)}`;

		const buffer = Buffer.from(await file.arrayBuffer());
		const result = await uploadToCloudinary(buffer, {
			folder: isolatedFolder,
			publicId: uniquePublicId,
			resourceType: file.type.startsWith("image/") ? "image" : "raw",
		});

		return NextResponse.json(
			{
				success: true,
				file: {
					name: file.name,
					size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
					url: result.secureUrl,
					publicId: result.publicId,
					format: result.format,
					width: result.width,
					height: result.height,
				},
			},
			{ status: 200 },
		);
	} catch (err: any) {
		console.error("[UPLOAD_API_ERROR]", err);
		return NextResponse.json(
			{ error: err.message || "Failed to upload file to storage." },
			{ status: 500 },
		);
	}
}
