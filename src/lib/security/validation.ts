/**
 * Pure Input Validation Helpers (Zero runtime/database/alias dependencies)
 *
 * Safe to import from both Next.js server routes and standalone Playwright tests.
 *
 * @module security/validation
 * @format
 */

import {
	DISPOSABLE_EMAIL_DOMAINS,
	extractEmailDomain,
	isDisposableEmail,
} from "./disposableDomains";

export { DISPOSABLE_EMAIL_DOMAINS, extractEmailDomain, isDisposableEmail };

const CONTROL_CHARS_RE = /[\r\n\t\x00-\x1F\x7F]/;
const HTML_TAG_OR_ENTITY_RE = /[<>]|&#\d+;|&#x[0-9a-f]+;|&[a-z]{2,12};/i;
const URL_PROTOCOL_RE = /(?:https?:\/\/|ftp:\/\/|www\.|mailto:|javascript:|data:|vbscript:)/i;
const URL_SHORTENER_RE =
	/(?:^|[\s(/])(?:t\.me|x\.com|t\.co|bit\.ly|tinyurl\.com|goo\.gl|ow\.ly|is\.gd|rb\.gy|cutt\.ly|buff\.ly|wa\.me)(?:\/|$|\s)/i;
const BARE_DOMAIN_RE =
	/\b[a-z0-9][a-z0-9-]{1,61}\.(?:com|net|org|io|co|ru|cn|xyz|top|info|biz|site|online|shop|store|click|link|vip|pro|app|dev|me|tv|cc|tk|ml|ga|cf|gq|pw|ly|gg|to|uk|de|fr|ng|za|ca|au|us|eu|ai|page|live|tech|club|fun|icu|work|world|space|website|agency|digital|marketing|casino|bet|porn|sex|xxx)\b/i;

// Unicode letters, combining marks, digits, spaces, and normal punctuation for personal/business names.
// Constructed via RegExp to stay compatible with tsconfig target ES2017 while using ES2018 Unicode escapes at runtime.
const ALLOWED_NAME_CHARS_RE = new RegExp("^[\\p{L}\\p{M}\\p{N}\\s.'’\\-&,()]+$", "u");
const AT_LEAST_TWO_LETTERS_RE = new RegExp("(?:\\p{L}.*){2}", "u");

export interface NameValidationResult {
	valid: boolean;
	reason?: string;
}

/**
 * Checks whether a string contains a URL, shortener, or bare domain pattern.
 */
export function containsUrlOrDomain(value: string): boolean {
	return (
		URL_PROTOCOL_RE.test(value) ||
		URL_SHORTENER_RE.test(value) ||
		BARE_DOMAIN_RE.test(value)
	);
}

/**
 * Validates a user display/contact name against spam links, HTML injection,
 * control characters, and non-human markup while preserving international names.
 */
export function validateHumanName(rawName: string): NameValidationResult {
	const name = rawName.trim();

	if (name.length < 2) {
		return { valid: false, reason: "Name must be at least 2 characters." };
	}

	if (name.length > 64) {
		return { valid: false, reason: "Name must be 64 characters or fewer." };
	}

	if (CONTROL_CHARS_RE.test(rawName)) {
		return { valid: false, reason: "Name contains invalid control characters." };
	}

	if (HTML_TAG_OR_ENTITY_RE.test(name)) {
		return { valid: false, reason: "Name cannot contain HTML or markup." };
	}

	if (containsUrlOrDomain(name)) {
		return { valid: false, reason: "Name cannot contain links or website addresses." };
	}

	if (!ALLOWED_NAME_CHARS_RE.test(name)) {
		return {
			valid: false,
			reason: "Name contains unsupported special characters.",
		};
	}

	if (!AT_LEAST_TWO_LETTERS_RE.test(name)) {
		return { valid: false, reason: "Name must include at least two letters." };
	}

	return { valid: true };
}

/**
 * Checks whether a URL string starts with a dangerous scheme (e.g. javascript:, data:, vbscript:).
 */
export function hasUnsafeUrlScheme(rawUrl: string): boolean {
	const normalized = rawUrl.replace(/[\x00-\x20]+/g, "").toLowerCase();
	return (
		normalized.startsWith("javascript:") ||
		normalized.startsWith("data:") ||
		normalized.startsWith("vbscript:") ||
		normalized.startsWith("file:")
	);
}
