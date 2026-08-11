/**
 * CurrencyContext
 *
 * Provides the detected user currency + formatted price helpers to the entire
 * component tree. Detects the visitor's country via `ipapi.co` (free, no key
 * needed) on mount, then resolves the matching CurrencyConfig.
 *
 * Falls back silently to USD if the lookup fails or the browser is offline.
 *
 * @format
 */

"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useMemo,
	useCallback,
} from "react";
import {
	CurrencyConfig,
	CURRENCIES,
	BASE_PRICES_USD,
	PlanKey,
	formatPrice,
	getCurrencyForCountry,
} from "@/lib/currency";

/* ------------------------------------------------------------------ */
/*  Context shape                                                        */
/* ------------------------------------------------------------------ */

interface CurrencyContextValue {
	/** Currently resolved currency (defaults to USD until geo lookup completes) */
	currency: CurrencyConfig;
	/** Whether the geo lookup is still in-flight */
	isLoading: boolean;
	/**
	 * Returns a formatted price string for a given plan + billing cycle.
	 * e.g. formatPlanPrice("landing", "monthly") → "₦32,400" for NGN users
	 */
	formatPlanPrice: (plan: PlanKey, cycle: "monthly" | "yearly") => string;
	/**
	 * Returns a raw number for a given plan + billing cycle in the user's currency.
	 */
	getPlanPrice: (plan: PlanKey, cycle: "monthly" | "yearly") => number;
}

/* ------------------------------------------------------------------ */
/*  Context + hook                                                       */
/* ------------------------------------------------------------------ */

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function useCurrency(): CurrencyContextValue {
	const ctx = useContext(CurrencyContext);
	if (!ctx) {
		throw new Error("useCurrency must be used inside <CurrencyProvider>");
	}
	return ctx;
}

/* ------------------------------------------------------------------ */
/*  Provider                                                             */
/* ------------------------------------------------------------------ */

interface CurrencyProviderProps {
	children: React.ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
	const [currency, setCurrency] = useState<CurrencyConfig>(CURRENCIES.USD);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		async function detectCurrency() {
			try {
				// ipapi.co is free, CORS-safe, no API key required (up to 30k req/month)
				const res = await fetch("https://ipapi.co/json/", {
					// Short timeout — if it doesn't respond in 4s, fallback to USD
					signal: AbortSignal.timeout(4000),
				});

				if (!res.ok) throw new Error("geo lookup failed");

				const data = await res.json();
				const countryCode: string = data.country_code ?? "";

				if (!cancelled) {
					setCurrency(getCurrencyForCountry(countryCode));
				}
			} catch {
				// Silently keep USD fallback
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		}

		detectCurrency();
		return () => {
			cancelled = true;
		};
	}, []);

	const getPlanPrice = useCallback(
		(plan: PlanKey, cycle: "monthly" | "yearly"): number => {
			return BASE_PRICES_USD[plan][cycle] * currency.rateFromUSD;
		},
		[currency],
	);

	const formatPlanPrice = useCallback(
		(plan: PlanKey, cycle: "monthly" | "yearly"): string => {
			return formatPrice(BASE_PRICES_USD[plan][cycle], currency);
		},
		[currency],
	);

	const value = useMemo<CurrencyContextValue>(
		() => ({
			currency,
			isLoading,
			formatPlanPrice,
			getPlanPrice,
		}),
		[currency, isLoading, formatPlanPrice, getPlanPrice],
	);

	return (
		<CurrencyContext.Provider value={value}>
			{children}
		</CurrencyContext.Provider>
	);
}
