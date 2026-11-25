/** @format */

"use client";

import React, { useEffect, useRef, useState } from "react";
import type { TurnstileAction } from "@/lib/security/turnstile";

interface TurnstileRenderOptions {
	sitekey: string;
	action?: string;
	theme?: "light" | "dark" | "auto";
	size?: "normal" | "flexible" | "compact";
	callback?: (token: string) => void;
	"expired-callback"?: () => void;
	"error-callback"?: (errorCode?: string) => void;
	"timeout-callback"?: () => void;
}

interface TurnstileApi {
	render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
	reset: (widgetId?: string) => void;
	remove: (widgetId?: string) => void;
	getResponse: (widgetId?: string) => string | undefined;
}

declare global {
	interface Window {
		turnstile?: TurnstileApi;
	}
}

const TURNSTILE_SCRIPT_SRC =
	"https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let turnstileScriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstileApi(): Promise<TurnstileApi> {
	if (typeof window === "undefined") {
		return Promise.reject(new Error("Turnstile requires a browser environment."));
	}

	if (window.turnstile) {
		return Promise.resolve(window.turnstile);
	}

	if (turnstileScriptPromise) {
		return turnstileScriptPromise;
	}

	turnstileScriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
		let pollId: number | null = null;
		let settled = false;

		const cleanupPoll = () => {
			if (pollId !== null) {
				window.clearInterval(pollId);
				pollId = null;
			}
		};

		const failLoad = (message: string, scriptEl?: HTMLScriptElement) => {
			if (settled) return;
			settled = true;
			cleanupPoll();
			scriptEl?.remove();
			turnstileScriptPromise = null;
			reject(new Error(message));
		};

		const waitForApi = (scriptEl?: HTMLScriptElement) => {
			if (settled) return;
			if (window.turnstile) {
				settled = true;
				cleanupPoll();
				resolve(window.turnstile);
				return;
			}
			let attempts = 0;
			pollId = window.setInterval(() => {
				if (settled) {
					cleanupPoll();
					return;
				}
				attempts += 1;
				if (window.turnstile) {
					settled = true;
					cleanupPoll();
					resolve(window.turnstile);
				} else if (attempts >= 50) {
					failLoad("Turnstile API did not initialize in time.", scriptEl);
				}
			}, 100);
		};

		const existingScript = document.querySelector<HTMLScriptElement>(
			'script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]',
		);

		if (existingScript) {
			if (window.turnstile) {
				settled = true;
				resolve(window.turnstile);
				return;
			}
			existingScript.addEventListener(
				"error",
				() => failLoad("Failed to load Cloudflare Turnstile script.", existingScript),
				{ once: true },
			);
			waitForApi(existingScript);
			return;
		}

		const script = document.createElement("script");
		script.src = TURNSTILE_SCRIPT_SRC;
		script.async = true;
		script.defer = true;
		script.onload = () => waitForApi(script);
		script.onerror = () =>
			failLoad("Failed to load Cloudflare Turnstile script.", script);
		document.head.appendChild(script);
	});

	return turnstileScriptPromise;
}

export interface TurnstileWidgetProps {
	action: TurnstileAction;
	onVerify: (token: string) => void;
	onExpire?: () => void;
	onError?: (errorCode?: string) => void;
	resetTrigger?: number;
	theme?: "light" | "dark" | "auto";
	className?: string;
}

export const TURNSTILE_SITE_KEY = (
	process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""
).trim();

/**
 * Explicit-render Cloudflare Turnstile widget for Next.js App Router & React 19.
 * Safely handles React StrictMode double-mounts, tab switches, token expiry, and resets.
 */
export default function TurnstileWidget({
	action,
	onVerify,
	onExpire,
	onError,
	resetTrigger = 0,
	theme = "light",
	className = "",
}: TurnstileWidgetProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const widgetIdRef = useRef<string | null>(null);
	const [loadFailed, setLoadFailed] = useState(false);

	// Keep callback refs fresh so inline callbacks in parents don't tear down the widget
	const onVerifyRef = useRef(onVerify);
	const onExpireRef = useRef(onExpire);
	const onErrorRef = useRef(onError);

	useEffect(() => {
		onVerifyRef.current = onVerify;
		onExpireRef.current = onExpire;
		onErrorRef.current = onError;
	}, [onVerify, onExpire, onError]);

	useEffect(() => {
		if (!TURNSTILE_SITE_KEY || !containerRef.current) return;

		let cancelled = false;
		const container = containerRef.current;

		loadTurnstileApi()
			.then((api) => {
				if (cancelled || !container) return;
				setLoadFailed(false);

				// Ensure container is empty before explicit render
				container.innerHTML = "";

				const widgetId = api.render(container, {
					sitekey: TURNSTILE_SITE_KEY,
					action,
					theme,
					size: "flexible",
					callback: (token: string) => {
						onVerifyRef.current(token);
					},
					"expired-callback": () => {
						onExpireRef.current?.();
					},
					"timeout-callback": () => {
						onExpireRef.current?.();
					},
					"error-callback": (errorCode?: string) => {
						onExpireRef.current?.();
						onErrorRef.current?.(errorCode);
					},
				});

				widgetIdRef.current = widgetId;
			})
			.catch(() => {
				if (!cancelled) {
					setLoadFailed(true);
					onErrorRef.current?.("script-load-failed");
				}
			});

		return () => {
			cancelled = true;
			const widgetId = widgetIdRef.current;
			widgetIdRef.current = null;
			if (widgetId && typeof window !== "undefined" && window.turnstile) {
				try {
					window.turnstile.remove(widgetId);
				} catch {
					// Ignore cleanup errors if container was already unmounted
				}
			}
		};
	}, [action, theme]);

	useEffect(() => {
		if (resetTrigger === 0) return;
		const widgetId = widgetIdRef.current;
		if (widgetId && typeof window !== "undefined" && window.turnstile) {
			try {
				window.turnstile.reset(widgetId);
				onExpireRef.current?.();
			} catch {
				// Ignore reset errors if widget not mounted yet
			}
		}
	}, [resetTrigger]);

	if (!TURNSTILE_SITE_KEY) {
		return null;
	}

	return (
		<div className={className}>
			<div ref={containerRef} className="min-h-[65px] w-full" />
			{loadFailed && (
				<p className="mt-1.5 text-[11px] font-medium text-amber-700">
					Security verification failed to load. Please disable ad blockers for this page or refresh and try again.
				</p>
			)}
		</div>
	);
}
