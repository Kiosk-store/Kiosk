/** @format */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { FormTokenScope } from "@/lib/security/antispam";

export interface FormGuardState {
	formToken: string;
	honeypot: string;
	setHoneypot: (value: string) => void;
	getFormToken: () => Promise<string>;
	refreshToken: () => Promise<string>;
}

/**
 * Client hook that manages the signed form-load timestamp token and hidden honeypot state
 * for public forms (/get-started signup & forgot-password, /contact).
 */
export function useFormGuard(scope: FormTokenScope): FormGuardState {
	const [formToken, setFormToken] = useState("");
	const [honeypot, setHoneypot] = useState("");
	const tokenRef = useRef("");
	const inflightRef = useRef<Promise<string> | null>(null);

	const fetchToken = useCallback(
		(signal?: AbortSignal): Promise<string> => {
			const promise = (async () => {
				try {
					const res = await fetch(
						`/api/auth/form-token?scope=${encodeURIComponent(scope)}`,
						{
							method: "GET",
							cache: "no-store",
							credentials: "same-origin",
							signal,
						},
					);
					if (!res.ok) return "";
					const data = (await res.json()) as { token?: string };
					const nextToken = typeof data.token === "string" ? data.token : "";
					if (!signal?.aborted) {
						tokenRef.current = nextToken;
						setFormToken(nextToken);
					}
					return nextToken;
				} catch {
					return "";
				} finally {
					if (inflightRef.current === promise) {
						inflightRef.current = null;
					}
				}
			})();

			inflightRef.current = promise;
			return promise;
		},
		[scope],
	);

	useEffect(() => {
		const controller = new AbortController();
		void fetchToken(controller.signal);
		return () => {
			controller.abort();
		};
	}, [fetchToken]);

	const getFormToken = useCallback(async (): Promise<string> => {
		if (tokenRef.current) return tokenRef.current;
		if (inflightRef.current) return inflightRef.current;
		return fetchToken();
	}, [fetchToken]);

	const refreshToken = useCallback(async (): Promise<string> => {
		tokenRef.current = "";
		setFormToken("");
		setHoneypot("");
		return fetchToken();
	}, [fetchToken]);

	return {
		formToken,
		honeypot,
		setHoneypot,
		getFormToken,
		refreshToken,
	};
}
