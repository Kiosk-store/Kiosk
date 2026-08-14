/**
 * Currency Configuration
 *
 * Defines supported currencies with their symbols, locales, and approximate
 * exchange rates relative to USD. Rates are baked-in approximations — for
 * production-grade accuracy, swap `EXCHANGE_RATES` with a live API response.
 *
 * Base prices are in USD. All other currencies are derived by multiplying.
 *
 * @module currency
 * @format
 */

export interface CurrencyConfig {
	/** ISO 4217 currency code */
	code: string;
	/** Display symbol */
	symbol: string;
	/** Intl.NumberFormat locale string */
	locale: string;
	/** Approximate rate vs 1 USD */
	rateFromUSD: number;
	/** Friendly label shown in UI */
	label: string;
}

/** Supported currency map keyed by ISO 4217 code */
export const CURRENCIES: Record<string, CurrencyConfig> = {
	USD: {
		code: "USD",
		symbol: "$",
		locale: "en-US",
		rateFromUSD: 1,
		label: "US Dollar",
	},
	NGN: {
		code: "NGN",
		symbol: "₦",
		locale: "en-NG",
		rateFromUSD: 1620,
		label: "Nigerian Naira",
	},
	GBP: {
		code: "GBP",
		symbol: "£",
		locale: "en-GB",
		rateFromUSD: 0.79,
		label: "British Pound",
	},
	EUR: {
		code: "EUR",
		symbol: "€",
		locale: "en-IE",
		rateFromUSD: 0.93,
		label: "Euro",
	},
	CAD: {
		code: "CAD",
		symbol: "CA$",
		locale: "en-CA",
		rateFromUSD: 1.37,
		label: "Canadian Dollar",
	},
	AUD: {
		code: "AUD",
		symbol: "A$",
		locale: "en-AU",
		rateFromUSD: 1.54,
		label: "Australian Dollar",
	},
	GHS: {
		code: "GHS",
		symbol: "₵",
		locale: "en-GH",
		rateFromUSD: 15.5,
		label: "Ghanaian Cedi",
	},
	KES: {
		code: "KES",
		symbol: "KSh",
		locale: "en-KE",
		rateFromUSD: 129,
		label: "Kenyan Shilling",
	},
	ZAR: {
		code: "ZAR",
		symbol: "R",
		locale: "en-ZA",
		rateFromUSD: 18.5,
		label: "South African Rand",
	},
};

/**
 * Map of ISO 3166-1 alpha-2 country codes → currency code.
 * Countries not in this map fall back to USD.
 */
export const COUNTRY_TO_CURRENCY: Record<string, string> = {
	// Nigeria
	NG: "NGN",
	// United Kingdom
	GB: "GBP",
	// Eurozone countries
	DE: "EUR",
	FR: "EUR",
	IT: "EUR",
	ES: "EUR",
	NL: "EUR",
	BE: "EUR",
	AT: "EUR",
	PT: "EUR",
	IE: "EUR",
	FI: "EUR",
	GR: "EUR",
	LU: "EUR",
	MT: "EUR",
	CY: "EUR",
	SK: "EUR",
	SI: "EUR",
	EE: "EUR",
	LV: "EUR",
	LT: "EUR",
	// Canada
	CA: "CAD",
	// Australia / New Zealand
	AU: "AUD",
	NZ: "AUD",
	// Ghana
	GH: "GHS",
	// Kenya
	KE: "KES",
	// South Africa
	ZA: "ZAR",
};

/**
 * Base prices in USD (monthly / yearly).
 * Yearly is monthly × 12 × 0.8 (20% discount).
 */
export const BASE_PRICES_USD = {
	landing: { monthly: 15, yearly: 144 },
	funnel: { monthly: 30, yearly: 288 },
	store: { monthly: 50, yearly: 480 },
} as const;

export type PlanKey = keyof typeof BASE_PRICES_USD;

/**
 * Converts a USD price to the target currency and formats it for display.
 */
export function formatPrice(
	usdAmount: number,
	currency: CurrencyConfig,
): string {
	const converted = usdAmount * currency.rateFromUSD;

	// For very large numbers (NGN etc.) skip decimal places
	const maximumFractionDigits = converted >= 1000 ? 0 : 2;

	return new Intl.NumberFormat(currency.locale, {
		style: "currency",
		currency: currency.code,
		maximumFractionDigits,
		minimumFractionDigits: 0,
	}).format(converted);
}

/**
 * Returns the CurrencyConfig for a given country code, defaulting to USD.
 */
export function getCurrencyForCountry(countryCode: string): CurrencyConfig {
	const currencyCode = COUNTRY_TO_CURRENCY[countryCode?.toUpperCase()] ?? "USD";
	return CURRENCIES[currencyCode] ?? CURRENCIES.USD;
}
