/**
 * Server-Side Anti-Spam, Trusted IP, Origin Verification & Signed Form-Token Module
 *
 * Zero external service dependencies:
 * - Trusted client IP extraction (Vercel-safe by default; Cloudflare opt-in via TRUST_CLOUDFLARE_IP=true)
 * - Same-Origin & Sec-Fetch-Site verification against canonical configured hosts
 * - Stateless HMAC-SHA256 signed form-load timestamp tokens with atomic single-use nonce claiming
 * - Honeypot field detection
 *
 * @module security/antispam
 * @format
 */

import crypto from "crypto";
import { redis } from "../ratelimit";

export {
	containsUrlOrDomain,
	DISPOSABLE_EMAIL_DOMAINS,
	extractEmailDomain,
	hasUnsafeUrlScheme,
	isDisposableEmail,
	validateHumanName,
	type NameValidationResult,
} from "./validation";

export type FormTokenScope = "signup" | "forgot-password" | "contact";

export const FORM_HONEYPOT_FIELD = "website_hp";

const DEFAULT_MIN_ELAPSED_MS: Record<FormTokenScope, number> = {
	signup: 2500,
	"forgot-password": 1200,
	contact: 2500,
};

const DEFAULT_MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours
const NONCE_TTL_SECONDS = 2 * 60 * 60; // 2 hours
const MAX_MEMORY_NONCES = 5000;

declare global {
	var __kioskConsumedFormNonces: Map<string, number> | undefined;
}

function getNonceMemoryStore(): Map<string, number> {
	if (!globalThis.__kioskConsumedFormNonces) {
		globalThis.__kioskConsumedFormNonces = new Map<string, number>();
	}
	return globalThis.__kioskConsumedFormNonces;
}

function pruneNonceMemoryStore(store: Map<string, number>, now: number): void {
	if (store.size <= MAX_MEMORY_NONCES) return;
	for (const [nonce, expiresAt] of store.entries()) {
		if (expiresAt <= now) {
			store.delete(nonce);
		}
	}
	while (store.size > MAX_MEMORY_NONCES) {
		const oldest = store.keys().next().value;
		if (!oldest) break;
		store.delete(oldest);
	}
}

// ---------------------------------------------------------------------------
// 1. TRUSTED CLIENT IP EXTRACTION
// ---------------------------------------------------------------------------

const IPV4_RE = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
const IPV6_RE = /^[0-9a-fA-F:]{2,45}$/;

function normalizeIpCandidate(raw: string | null): string | null {
	if (!raw) return null;

	// Take first entry if header holds a comma-separated proxy chain
	let candidate = raw.split(",")[0]?.trim().replace(/^"+|"+$/g, "") || "";
	if (!candidate || candidate.length > 64) return null;

	// Unwrap bracketed IPv6 with optional port: [::1]:3000 -> ::1
	if (candidate.startsWith("[")) {
		const closeIdx = candidate.indexOf("]");
		if (closeIdx > 1) {
			candidate = candidate.slice(1, closeIdx);
		}
	} else if (
		candidate.includes(":") &&
		!candidate.includes("::") &&
		candidate.indexOf(":") === candidate.lastIndexOf(":")
	) {
		// Unwrap IPv4:port -> IPv4
		const [hostPart] = candidate.split(":");
		if (hostPart && IPV4_RE.test(hostPart)) {
			candidate = hostPart;
		}
	}

	// Normalize IPv4-mapped IPv6 addresses (e.g. ::ffff:192.0.2.1 -> 192.0.2.1)
	if (candidate.toLowerCase().startsWith("::ffff:")) {
		const mapped = candidate.slice(7);
		if (IPV4_RE.test(mapped)) {
			candidate = mapped;
		}
	}

	const ipv4Match = IPV4_RE.exec(candidate);
	if (ipv4Match) {
		const validOctets = ipv4Match.slice(1).every((octet) => {
			const num = Number(octet);
			return num >= 0 && num <= 255;
		});
		return validOctets ? candidate : null;
	}

	if (candidate.includes(":") && IPV6_RE.test(candidate)) {
		return candidate.toLowerCase();
	}

	return null;
}

/**
 * Extracts a normalized client IP prioritizing platform-guaranteed headers.
 * Only trusts `cf-connecting-ip` when `TRUST_CLOUDFLARE_IP="true"` so attackers
 * cannot bypass Vercel rate limits by spoofing Cloudflare headers.
 */
export function getClientIp(request: Request): string {
	const headerCandidates: Array<string | null> = [];

	if (process.env.TRUST_CLOUDFLARE_IP === "true") {
		headerCandidates.push(request.headers.get("cf-connecting-ip"));
	}

	headerCandidates.push(
		request.headers.get("x-vercel-forwarded-for"),
		request.headers.get("x-real-ip"),
		request.headers.get("x-forwarded-for"),
	);

	for (const raw of headerCandidates) {
		const normalized = normalizeIpCandidate(raw);
		if (normalized) {
			return normalized;
		}
	}

	return "unknown";
}

// ---------------------------------------------------------------------------
// 2. SAME-ORIGIN & SEC-FETCH-SITE CHECK
// ---------------------------------------------------------------------------

function isLocalHost(host: string): boolean {
	const lower = host.toLowerCase();
	return (
		lower === "localhost" ||
		lower.startsWith("localhost:") ||
		lower === "127.0.0.1" ||
		lower.startsWith("127.0.0.1:") ||
		lower === "[::1]" ||
		lower.startsWith("[::1]:")
	);
}

function addHostFromUrl(set: Set<string>, rawUrl?: string): void {
	if (!rawUrl) return;
	const trimmed = rawUrl.trim();
	if (!trimmed) return;
	try {
		const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
		const parsed = new URL(withProto);
		if (parsed.host) {
			set.add(parsed.host.toLowerCase());
		}
	} catch {
		// Ignore malformed env values
	}
}

export interface OriginCheckResult {
	ok: boolean;
	reason?: string;
}

/**
 * Verifies that an incoming request originates from a canonical configured host
 * rather than a cross-site page, spoofed X-Forwarded-Host, or origin-less script.
 */
export function verifySameOrigin(
	request: Request,
	options?: { allowMissingOnGet?: boolean },
): OriginCheckResult {
	const secFetchSite = request.headers.get("sec-fetch-site")?.trim().toLowerCase();
	if (secFetchSite === "cross-site") {
		return { ok: false, reason: "cross_site_fetch" };
	}

	// Build allowedHosts strictly from canonical configured domains (never client X-Forwarded-Host)
	const allowedHosts = new Set<string>(["kioosk.online", "www.kioosk.online"]);
	addHostFromUrl(allowedHosts, process.env.NEXT_PUBLIC_APP_URL);
	addHostFromUrl(allowedHosts, process.env.AUTH_URL);
	addHostFromUrl(allowedHosts, process.env.NEXTAUTH_URL);
	addHostFromUrl(allowedHosts, process.env.VERCEL_URL);
	addHostFromUrl(allowedHosts, process.env.VERCEL_BRANCH_URL);
	addHostFromUrl(allowedHosts, process.env.VERCEL_PROJECT_PRODUCTION_URL);

	const isProd = process.env.NODE_ENV === "production";
	if (!isProd) {
		const hostHeader = (request.headers.get("host") || "").split(",")[0]?.trim().toLowerCase();
		if (hostHeader && isLocalHost(hostHeader)) {
			allowedHosts.add(hostHeader);
		}
		allowedHosts.add("localhost:3000");
		allowedHosts.add("127.0.0.1:3000");
		allowedHosts.add("localhost");
		allowedHosts.add("127.0.0.1");
	}

	const validateUrlHeader = (
		rawHeader: string,
		label: "origin" | "referer",
	): OriginCheckResult => {
		if (rawHeader === "null") {
			return { ok: false, reason: `${label}_null` };
		}
		try {
			const parsed = new URL(rawHeader);
			if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
				return { ok: false, reason: `${label}_invalid_protocol` };
			}
			const host = parsed.host.toLowerCase();
			if (isProd && !isLocalHost(host) && parsed.protocol !== "https:") {
				return { ok: false, reason: `${label}_insecure_protocol` };
			}
			if (!allowedHosts.has(host)) {
				return { ok: false, reason: `${label}_host_mismatch` };
			}
			return { ok: true };
		} catch {
			return { ok: false, reason: `${label}_malformed` };
		}
	};

	const origin = request.headers.get("origin")?.trim();
	if (origin) {
		return validateUrlHeader(origin, "origin");
	}

	const referer = request.headers.get("referer")?.trim();
	if (referer) {
		return validateUrlHeader(referer, "referer");
	}

	// Same-origin GET requests omit Origin and may omit Referer under privacy proxies
	// or older Safari/WebViews (which also omit Sec-Fetch-Site).
	if (options?.allowMissingOnGet && request.method.toUpperCase() === "GET") {
		return { ok: true };
	}

	return { ok: false, reason: "missing_origin" };
}

// ---------------------------------------------------------------------------
// 3. SIGNED FORM-LOAD TIMESTAMP TOKENS
// ---------------------------------------------------------------------------

interface FormTokenPayload {
	s: FormTokenScope;
	t: number;
	n: string;
}

function getFormTokenSecret(): string | null {
	const configured =
		process.env.FORM_TOKEN_SECRET ||
		process.env.AUTH_SECRET ||
		process.env.NEXTAUTH_SECRET;

	if (configured && configured.trim().length > 0) {
		return configured.trim();
	}

	if (process.env.NODE_ENV !== "production") {
		return "kiosk_dev_form_token_fallback_secret_2026";
	}

	return null;
}

function signPayload(payloadB64: string, secret: string): string {
	return crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
}

/**
 * Generates an HMAC-SHA256 signed token recording when a form was loaded in the browser.
 */
export function createFormToken(scope: FormTokenScope): string {
	const secret = getFormTokenSecret();
	if (!secret) {
		throw new Error("FORM_TOKEN_SECRET or AUTH_SECRET must be configured in production.");
	}

	const payload: FormTokenPayload = {
		s: scope,
		t: Date.now(),
		n: crypto.randomBytes(12).toString("hex"),
	};

	const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
	const signature = signPayload(payloadB64, secret);
	return `${payloadB64}.${signature}`;
}

async function isNonceConsumed(nonce: string): Promise<boolean> {
	const now = Date.now();
	const memStore = getNonceMemoryStore();
	const memExpiry = memStore.get(nonce);
	if (memExpiry && memExpiry > now) {
		return true;
	}

	if (redis) {
		try {
			const exists = await redis.get<string | number>(`@kiosk/form-nonce:${nonce}`);
			if (exists !== null && exists !== undefined) {
				memStore.set(nonce, now + DEFAULT_MAX_AGE_MS);
				return true;
			}
		} catch (err) {
			console.warn("[FORM_NONCE_REDIS_READ_FALLBACK]", err);
		}
	}

	return false;
}

/**
 * Atomically claims a form token nonce (Redis SET NX EX + in-memory guard) so concurrent
 * replay attempts with the same valid token cannot race past single-use protection.
 * Returns `true` if claimed for the first time, `false` if already consumed.
 */
export async function claimFormTokenNonce(nonce?: string): Promise<boolean> {
	if (!nonce) return false;

	const now = Date.now();
	const memStore = getNonceMemoryStore();
	const existingExpiry = memStore.get(nonce);
	if (existingExpiry && existingExpiry > now) {
		return false;
	}

	// Claim synchronously in local process memory first to stop intra-instance races
	memStore.set(nonce, now + DEFAULT_MAX_AGE_MS);
	pruneNonceMemoryStore(memStore, now);

	if (redis) {
		try {
			const res = await redis.set(`@kiosk/form-nonce:${nonce}`, "1", {
				ex: NONCE_TTL_SECONDS,
				nx: true,
			});
			// Upstash returns "OK" when key was newly created, null when it already existed
			return res === "OK";
		} catch (err) {
			console.warn("[FORM_NONCE_REDIS_CLAIM_FALLBACK]", err);
			// Fall back to the local in-memory claim already recorded above
			return true;
		}
	}

	return true;
}

export type FormTokenErrorCode =
	| "missing"
	| "misconfigured"
	| "invalid"
	| "wrong_scope"
	| "too_fast"
	| "expired"
	| "replayed";

export interface VerifyFormTokenResult {
	ok: boolean;
	code?: FormTokenErrorCode;
	nonce?: string;
	elapsedMs?: number;
}

/**
 * Verifies signature, scope, minimum human fill time, expiration, and single-use replay status.
 */
export async function verifyFormToken(
	token: unknown,
	expectedScope: FormTokenScope,
	options?: { minElapsedMs?: number; maxAgeMs?: number },
): Promise<VerifyFormTokenResult> {
	if (typeof token !== "string" || token.trim().length === 0) {
		return { ok: false, code: "missing" };
	}

	const secret = getFormTokenSecret();
	if (!secret) {
		return { ok: false, code: "misconfigured" };
	}

	const parts = token.trim().split(".");
	if (parts.length !== 2 || !parts[0] || !parts[1]) {
		return { ok: false, code: "invalid" };
	}

	const [payloadB64, providedSig] = parts;
	const expectedSig = signPayload(payloadB64, secret);

	const providedBuf = Buffer.from(providedSig, "utf8");
	const expectedBuf = Buffer.from(expectedSig, "utf8");
	if (
		providedBuf.length !== expectedBuf.length ||
		!crypto.timingSafeEqual(providedBuf, expectedBuf)
	) {
		return { ok: false, code: "invalid" };
	}

	let payload: FormTokenPayload;
	try {
		const decoded = Buffer.from(payloadB64, "base64url").toString("utf8");
		payload = JSON.parse(decoded) as FormTokenPayload;
	} catch {
		return { ok: false, code: "invalid" };
	}

	if (
		!payload ||
		typeof payload.s !== "string" ||
		typeof payload.t !== "number" ||
		!Number.isFinite(payload.t) ||
		typeof payload.n !== "string" ||
		payload.n.length < 16
	) {
		return { ok: false, code: "invalid" };
	}

	if (payload.s !== expectedScope) {
		return { ok: false, code: "wrong_scope" };
	}

	const minElapsedMs = options?.minElapsedMs ?? DEFAULT_MIN_ELAPSED_MS[expectedScope];
	const maxAgeMs = options?.maxAgeMs ?? DEFAULT_MAX_AGE_MS;
	const elapsedMs = Date.now() - payload.t;

	if (elapsedMs < minElapsedMs) {
		return { ok: false, code: "too_fast", elapsedMs };
	}

	if (elapsedMs > maxAgeMs) {
		return { ok: false, code: "expired", elapsedMs };
	}

	if (await isNonceConsumed(payload.n)) {
		return { ok: false, code: "replayed", elapsedMs };
	}

	return { ok: true, nonce: payload.n, elapsedMs };
}

// ---------------------------------------------------------------------------
// 4. HONEYPOT DETECTION
// ---------------------------------------------------------------------------

const HONEYPOT_KEYS = [FORM_HONEYPOT_FIELD, "companyWebsite", "faxNumber"] as const;

/**
 * Returns true if any hidden honeypot field was populated by an automated bot.
 */
export function isHoneypotTripped(body: unknown): boolean {
	if (!body || typeof body !== "object" || Array.isArray(body)) {
		return false;
	}

	const record = body as Record<string, unknown>;
	for (const key of HONEYPOT_KEYS) {
		const val = record[key];
		if (typeof val === "string" && val.trim().length > 0) {
			return true;
		}
	}

	return false;
}
