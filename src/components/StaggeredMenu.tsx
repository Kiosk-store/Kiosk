/**
 * StaggeredMenu
 *
 * Client-side animated navigation panel using GSAP. This component
 * renders a mobile-first slide-in menu with layered pre-layers,
 * staggered item reveals, and a menu toggle that animates the icon
 * and label text. It exposes a small API via props for colors,
 * numbering, socials and callbacks for open/close events.
 *
 * @format
 */

/** @format */

"use client";

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Menu as IconMenu, X as IconX } from "lucide-react";
import PillButton from "./PillButton";

export interface StaggeredMenuItem {
	label: string;
	ariaLabel: string;
	link: string;
}
export interface StaggeredMenuActionItem {
	label: string;
	link: string;
	primary?: boolean;
	ariaLabel?: string;
}
export interface StaggeredMenuSocialItem {
	label: string;
	link: string;
}
export interface StaggeredMenuProps {
	position?: "left" | "right";
	colors?: string[];
	items?: StaggeredMenuItem[];
	actionItems?: StaggeredMenuActionItem[];
	socialItems?: StaggeredMenuSocialItem[];
	displaySocials?: boolean;
	actionTitle?: string;
	displayItemNumbering?: boolean;
	className?: string;
	logoUrl?: string;
	menuButtonColor?: string;
	openMenuButtonColor?: string;
	accentColor?: string;
	isFixed: boolean;
	changeMenuColorOnOpen?: boolean;
	closeOnClickAway?: boolean;
	showMenuText?: boolean;
	onMenuOpen?: () => void;
	onMenuClose?: () => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
	position = "right",
	colors = ["#B497CF", "#5227FF"],
	items = [],
	actionItems = [],
	socialItems = [],
	displaySocials = false,
	actionTitle,
	displayItemNumbering = true,
	className,
	menuButtonColor = "#fff",
	openMenuButtonColor = "#fff",
	changeMenuColorOnOpen = true,
	accentColor = "#5227FF",
	isFixed = false,
	closeOnClickAway = true,
	showMenuText = true,
	onMenuOpen,
	onMenuClose,
}: StaggeredMenuProps) => {
	const [open, setOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const openRef = useRef(false);

	const panelRef = useRef<HTMLDivElement | null>(null);
	const preLayersRef = useRef<HTMLDivElement | null>(null);
	const preLayerElsRef = useRef<HTMLElement[]>([]);

	const iconRef = useRef<HTMLSpanElement | null>(null);

	const textInnerRef = useRef<HTMLSpanElement | null>(null);
	const textWrapRef = useRef<HTMLSpanElement | null>(null);
	const [textLines, setTextLines] = useState<string[]>(["Menu", "Close"]);

	const openTlRef = useRef<gsap.core.Timeline | null>(null);
	const closeTweenRef = useRef<gsap.core.Tween | null>(null);
	const spinTweenRef = useRef<gsap.core.Timeline | null>(null);
	const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
	const colorTweenRef = useRef<gsap.core.Tween | null>(null);

	const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
	const busyRef = useRef(false);

	const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

	const [atTop, setAtTop] = useState(true);

	React.useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			// Only show staggered menu header when at the hero section top
			if (currentScrollY <= 80) {
				setAtTop(true);
			} else {
				setAtTop(false);
			}
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);



	useLayoutEffect(() => {
		setIsMounted(true);
		const ctx = gsap.context(() => {
			const panel = panelRef.current;
			const preContainer = preLayersRef.current;

			const icon = iconRef.current;
			const textInner = textInnerRef.current;

			if (!panel || !icon) return;

			// collect pre-layer elements used to create the layered slide effect
			let preLayers: HTMLElement[] = [];
			if (preContainer) {
				preLayers = Array.from(
					preContainer.querySelectorAll(".sm-prelayer"),
				) as HTMLElement[];
			}
			preLayerElsRef.current = preLayers;

			const offscreen = position === "left" ? -100 : 100;
			gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
			if (preContainer) {
				gsap.set(preContainer, { xPercent: 0, opacity: 1 });
			}
			gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });

			// ensure the cycling text strip starts at the top
			if (textInner) {
				gsap.set(textInner, { yPercent: 0 });
			}

			if (toggleBtnRef.current)
				gsap.set(toggleBtnRef.current, { color: menuButtonColor });
		});
		return () => ctx.revert();
	}, [menuButtonColor, position]);

	/**
	 * buildOpenTimeline
	 * Construct the GSAP timeline used to open the menu. This prepares
	 * initial states for items, numbers and socials and then animates
	 * the pre-layers, panel and children with staggered timing.
	 */
	const buildOpenTimeline = useCallback(() => {
		const panel = panelRef.current;
		const layers = preLayerElsRef.current;
		if (!panel) return null;

		openTlRef.current?.kill();
		if (closeTweenRef.current) {
			closeTweenRef.current.kill();
			closeTweenRef.current = null;
		}
		itemEntranceTweenRef.current?.kill();

		const itemEls = Array.from(
			panel.querySelectorAll(".sm-panel-itemLabel"),
		) as HTMLElement[];
		const numberEls = Array.from(
			panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item"),
		) as HTMLElement[];
		const actionTitleEl = panel.querySelector(
			".sm-actions-title, .sm-socials-title",
		) as HTMLElement | null;
		const actionEls = Array.from(
			panel.querySelectorAll(".sm-actions-btn, .sm-socials-link"),
		) as HTMLElement[];

		const offscreen = position === "left" ? -100 : 100;
		const layerStates = layers.map((el) => ({ el, start: offscreen }));
		const panelStart = offscreen;

		if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
		if (numberEls.length)
			gsap.set(numberEls, { ["--sm-num-opacity" as string]: 0 });
		if (actionTitleEl) gsap.set(actionTitleEl, { opacity: 0 });
		if (actionEls.length) gsap.set(actionEls, { y: 25, opacity: 0 });

		const tl = gsap.timeline({ paused: true });

		layerStates.forEach((ls, i) => {
			tl.fromTo(
				ls.el,
				{ xPercent: ls.start },
				{ xPercent: 0, duration: 0.5, ease: "power4.out" },
				i * 0.07,
			);
		});

		const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
		const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
		const panelDuration = 0.65;

		tl.fromTo(
			panel,
			{ xPercent: panelStart },
			{ xPercent: 0, duration: panelDuration, ease: "power4.out" },
			panelInsertTime,
		);

		if (itemEls.length) {
			const itemsStartRatio = 0.15;
			const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

			tl.to(
				itemEls,
				{
					yPercent: 0,
					rotate: 0,
					duration: 1,
					ease: "power4.out",
					stagger: { each: 0.1, from: "start" },
				},
				itemsStart,
			);

			if (numberEls.length) {
				tl.to(
					numberEls,
					{
						duration: 0.6,
						ease: "power2.out",
						["--sm-num-opacity" as string]: 1,
						stagger: { each: 0.08, from: "start" },
					},
					itemsStart + 0.1,
				);
			}
		}

		if (actionTitleEl || actionEls.length) {
			const actionsStart = panelInsertTime + panelDuration * 0.4;

			if (actionTitleEl)
				tl.to(
					actionTitleEl,
					{ opacity: 1, duration: 0.5, ease: "power2.out" },
					actionsStart,
				);
			if (actionEls.length) {
				tl.to(
					actionEls,
					{
						y: 0,
						opacity: 1,
						duration: 0.55,
						ease: "power3.out",
						stagger: { each: 0.08, from: "start" },
						onComplete: () => {
							gsap.set(actionEls, { clearProps: "opacity" });
						},
					},
					actionsStart + 0.04,
				);
			}
		}

		// keep the built timeline so callers can play/kill it
		openTlRef.current = tl;
		return tl;
	}, [position]);

	// Play the open timeline while guarding against re-entrancy
	const playOpen = useCallback(() => {
		if (busyRef.current) return;
		busyRef.current = true;
		const tl = buildOpenTimeline();
		if (tl) {
			tl.eventCallback("onComplete", () => {
				busyRef.current = false;
			});
			tl.play(0);
		} else {
			busyRef.current = false;
		}
	}, [buildOpenTimeline]);

	// Play the close animation that quickly moves layers + panel offscreen
	const playClose = useCallback(() => {
		openTlRef.current?.kill();
		openTlRef.current = null;
		itemEntranceTweenRef.current?.kill();

		const panel = panelRef.current;
		const layers = preLayerElsRef.current;
		if (!panel) return;

		const all: HTMLElement[] = [...layers, panel];
		closeTweenRef.current?.kill();

		const offscreen = position === "left" ? -100 : 100;

		closeTweenRef.current = gsap.to(all, {
			xPercent: offscreen,
			duration: 0.32,
			ease: "power3.in",
			overwrite: "auto",
			onComplete: () => {
				const itemEls = Array.from(
					panel.querySelectorAll(".sm-panel-itemLabel"),
				) as HTMLElement[];
				if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

				const numberEls = Array.from(
					panel.querySelectorAll(
						".sm-panel-list[data-numbering] .sm-panel-item",
					),
				) as HTMLElement[];
				if (numberEls.length)
					gsap.set(numberEls, { ["--sm-num-opacity" as string]: 0 });

				const actionTitleEl = panel.querySelector(
					".sm-actions-title, .sm-socials-title",
				) as HTMLElement | null;
				const actionEls = Array.from(
					panel.querySelectorAll(".sm-actions-btn, .sm-socials-link"),
				) as HTMLElement[];
				if (actionTitleEl) gsap.set(actionTitleEl, { opacity: 0 });
				if (actionEls.length) gsap.set(actionEls, { y: 25, opacity: 0 });

				busyRef.current = false;
			},
		});
	}, [position]);

	// Subtle rotate/scale animation for the single React icon glyph
	const animateIcon = useCallback((opening: boolean) => {
		const icon = iconRef.current;
		if (!icon) return;

		spinTweenRef.current?.kill();

		if (opening) {
			spinTweenRef.current = gsap
				.timeline({ defaults: { ease: "power4.out" } })
				.to(icon, { rotate: 10, scale: 1.08, duration: 0.28 })
				.to(icon, { rotate: 0, scale: 1, duration: 0.18 });
		} else {
			spinTweenRef.current = gsap
				.timeline({ defaults: { ease: "power3.inOut" } })
				.to(icon, {
					rotate: 0,
					scale: 1,
					duration: 0.25,
				});
		}
	}, []);

	// Animate toggle button color when opening/closing (optional)
	const animateColor = useCallback(
		(opening: boolean) => {
			const btn = toggleBtnRef.current;
			if (!btn) return;
			colorTweenRef.current?.kill();
			if (changeMenuColorOnOpen) {
				const targetColor = opening ? openMenuButtonColor : menuButtonColor;
				colorTweenRef.current = gsap.to(btn, {
					color: targetColor,
					delay: 0.18,
					duration: 0.3,
					ease: "power2.out",
				});
			} else {
				gsap.set(btn, { color: menuButtonColor });
			}
		},
		[openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen],
	);

	React.useEffect(() => {
		if (toggleBtnRef.current) {
			if (changeMenuColorOnOpen) {
				const targetColor = openRef.current
					? openMenuButtonColor
					: menuButtonColor;
				gsap.set(toggleBtnRef.current, { color: targetColor });
			} else {
				gsap.set(toggleBtnRef.current, { color: menuButtonColor });
			}
		}
	}, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

	// Cycle the toggle label text between "Menu" and "Close" for visual feedback
	const animateText = useCallback((opening: boolean) => {
		const inner = textInnerRef.current;
		if (!inner) return;

		textCycleAnimRef.current?.kill();

		const currentLabel = opening ? "Menu" : "Close";
		const targetLabel = opening ? "Close" : "Menu";
		const cycles = 3;

		const seq: string[] = [currentLabel];
		let last = currentLabel;
		for (let i = 0; i < cycles; i++) {
			last = last === "Menu" ? "Close" : "Menu";
			seq.push(last);
		}
		if (last !== targetLabel) seq.push(targetLabel);
		seq.push(targetLabel);

		setTextLines(seq);
		gsap.set(inner, { yPercent: 0 });

		const lineCount = seq.length;
		const finalShift = ((lineCount - 1) / lineCount) * 100;

		textCycleAnimRef.current = gsap.to(inner, {
			yPercent: -finalShift,
			duration: 0.5 + lineCount * 0.07,
			ease: "power4.out",
		});
	}, []);

	// Toggle menu open/closed and trigger animations/callbacks
	const toggleMenu = useCallback(() => {
		const target = !openRef.current;
		openRef.current = target;
		setOpen(target);

		if (target) {
			onMenuOpen?.();
			playOpen();
		} else {
			onMenuClose?.();
			playClose();
		}

		animateIcon(target);
		animateColor(target);
		animateText(target);
	}, [
		playOpen,
		playClose,
		animateIcon,
		animateColor,
		animateText,
		onMenuOpen,
		onMenuClose,
	]);

	const closeMenu = useCallback(() => {
		if (openRef.current) {
			openRef.current = false;
			setOpen(false);
			onMenuClose?.();
			playClose();
			animateIcon(false);
			animateColor(false);
			animateText(false);
		}
	}, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

	React.useEffect(() => {
		if (!closeOnClickAway || !open) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (
				panelRef.current &&
				!panelRef.current.contains(event.target as Node) &&
				toggleBtnRef.current &&
				!toggleBtnRef.current.contains(event.target as Node)
			) {
				closeMenu();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [closeOnClickAway, open, closeMenu]);

	return (
		<div
			className={`sm-scope z-40 ${open ? "pointer-events-auto fixed top-0 left-0 w-screen h-screen overflow-hidden" : "pointer-events-none absolute top-0 left-0 w-full"}`}>
			<div
				className={
					(className ? className + " " : "") +
					`staggered-menu-wrapper relative w-full h-full z-40 ${open ? "pointer-events-auto" : "pointer-events-none"}`
				}
				style={
					accentColor
						? ({ "--sm-accent": accentColor } as React.CSSProperties)
						: undefined
				}
				data-position={position}
				data-open={open || undefined}>
				<div
					ref={preLayersRef}
					className="sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none z-[5]"
					aria-hidden="true">
					{(() => {
						const raw =
							colors && colors.length
								? colors.slice(0, 4)
								: ["#1e1e22", "#35353c"];
						const arr = [...raw];
						if (arr.length >= 3) {
							const mid = Math.floor(arr.length / 2);
							arr.splice(mid, 1);
						}
						return arr.map((c, i) => (
							<div
								key={i}
								className={`sm-prelayer absolute top-0 right-0 h-full w-full ${!isMounted ? "invisible" : ""}`}
								style={{ background: c }}
							/>
						));
					})()}
				</div>

				<header
					className={`staggered-menu-header fixed top-0 left-0 right-0 max-w-[100vw] box-border flex items-center justify-between px-4 sm:px-10 py-3.5 sm:py-5 bg-transparent transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-[1001] ${
						open || atTop
							? "translate-y-0 opacity-100 pointer-events-auto"
							: "-translate-y-full opacity-0 pointer-events-none"
					}`}
					aria-label="Main navigation header">
					<Link
						href="/"
						className="sm-logo flex items-center select-none pointer-events-auto group"
						aria-label="Kiosk Home">
						<img
							src="/logo.png"
							alt="Kiosk"
							className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105"
						/>
					</Link>

					<button
						ref={toggleBtnRef}
						className={`sm-toggle relative inline-flex items-center gap-2 bg-transparent border-0 cursor-pointer font-bold text-slate-900 leading-none overflow-visible pointer-events-auto transition-colors ${
							open ? "text-slate-900" : "text-slate-900"
						}`}
						aria-label={open ? "Close menu" : "Open menu"}
						aria-expanded={open}
						aria-controls="staggered-menu-panel"
						onClick={toggleMenu}
						type="button">
						{showMenuText && (
							<span
								ref={textWrapRef}
								className="sm-toggle-textWrap relative inline-block h-[1em] overflow-hidden whitespace-nowrap w-[var(--sm-toggle-width,auto)] min-w-[var(--sm-toggle-width,auto)] text-slate-900"
								aria-hidden="true">
								<span
									ref={textInnerRef}
									className="sm-toggle-textInner flex flex-col leading-none text-slate-900 font-bold">
									{textLines.map((l, i) => (
										<span
											className="sm-toggle-line block h-[1em] leading-none"
											key={i}>
											{l}
										</span>
									))}
								</span>
							</span>
						)}

						<span
							ref={iconRef}
							className="sm-icon relative w-10 h-10 shrink-0 inline-flex items-center justify-center text-slate-900 [will-change:transform]"
							aria-hidden="true">
							{/* React icon glyph (menu / close) from lucide-react */}
							<span className="sm-icon-glyph inline-flex items-center justify-center text-slate-900">
								{open ? (
									<IconX
										size={28}
										className="text-slate-900"
										aria-hidden
									/>
								) : (
									<IconMenu
										size={28}
										className="text-slate-900"
										aria-hidden
									/>
								)}
							</span>
						</span>
					</button>
				</header>

				<aside
					id="staggered-menu-panel"
					ref={panelRef}
					className={`staggered-menu-panel absolute top-0 right-0 h-full w-full sm:w-[480px] max-w-full bg-white flex flex-col p-16 sm:p-[6em_2em_2em_2em] overflow-y-auto z-10 backdrop-blur-[12px] pointer-events-auto ${!isMounted ? "invisible" : ""}`}
					style={{ WebkitBackdropFilter: "blur(12px)" }}
					aria-hidden={!open}>
					<div className="sm-panel-inner flex-1 flex flex-col gap-5">
						<ul
							className="sm-panel-list list-none m-0 p-0 flex flex-col gap-2"
							role="list"
							data-numbering={displayItemNumbering || undefined}>
							{items && items.length ? (
								items.map((it, idx) => (
									<li
										className="sm-panel-itemWrap relative overflow-hidden leading-none"
										key={it.label + idx}>
										<a
											className="sm-panel-item relative text-black font-semibold text-[2.2rem] xs:text-[2.8rem] sm:text-[3.6rem] md:text-[4rem] cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1em] max-w-full"
											href={it.link}
											onClick={closeMenu}
											aria-label={it.ariaLabel}
											data-index={idx + 1}>
											<span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
												{it.label}
											</span>
										</a>
									</li>
								))
							) : (
								<li
									className="sm-panel-itemWrap relative overflow-hidden leading-none"
									aria-hidden="true">
									<span className="sm-panel-item relative text-black font-semibold text-[2.2rem] xs:text-[2.8rem] sm:text-[3.6rem] md:text-[4rem] cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1em]">
										<span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
											No items
										</span>
									</span>
								</li>
							)}
						</ul>

						{actionItems && actionItems.length > 0 ? (
							<div
								className="sm-actions mt-auto pt-6 flex flex-col gap-3"
								aria-label="Account actions">
								{actionTitle && (
									<h3 className="sm-actions-title m-0 text-xs font-semibold uppercase tracking-wider text-gray-400">
										{actionTitle}
									</h3>
								)}
								<div className="flex flex-col gap-2.5 w-full">
									{actionItems.map((action, i) => (
										<PillButton
											key={action.label + i}
											href={action.link}
											onClick={closeMenu}
											baseColor="#ffffff"
											circleColor="#0a0a0a"
											textColor="#0a0a0a"
											hoverTextColor="#ffffff"
											className="sm-actions-btn !w-full border-2 border-black"
											aria-label={action.ariaLabel || action.label}>
											{action.label}
										</PillButton>
									))}
								</div>
							</div>
						) : displaySocials && socialItems && socialItems.length > 0 ? (
							<div
								className="sm-socials mt-auto pt-8 flex flex-col gap-3"
								aria-label="Social links">
								<h3 className="sm-socials-title m-0 text-base font-medium [color:var(--sm-accent,#ff0000)]">
									Socials
								</h3>
								<ul
									className="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap"
									role="list">
									{socialItems.map((s, i) => (
										<li
											key={s.label + i}
											className="sm-socials-item">
											<a
												href={s.link}
												target="_blank"
												rel="noopener noreferrer"
												className="sm-socials-link text-[1.2rem] font-medium text-[#111] no-underline relative inline-block py-[2px] transition-[color,opacity] duration-300 ease-linear">
												{s.label}
											</a>
										</li>
									))}
								</ul>
							</div>
						) : null}
					</div>
				</aside>
			</div>

			<style>{`
.sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 40; pointer-events: none; }
.sm-scope .staggered-menu-header { position: fixed; top: 0; left: 0; width: 100%; display: flex; align-items: center; justify-content: space-between; pointer-events: none; z-index: 30; }
.sm-scope .staggered-menu-header > * { pointer-events: auto; }
.sm-scope .sm-logo { display: flex; align-items: center; user-select: none; }
.sm-scope .sm-logo-img { display: block; height: 32px; width: auto; object-fit: contain; }
.sm-scope .sm-toggle { position: relative; display: inline-flex; align-items: center; gap: 0.3rem; background: transparent; border: none; cursor: pointer; color: #e9e9ef; font-weight: 500; line-height: 1; overflow: visible; }
.sm-scope .sm-toggle:focus-visible { outline: 2px solid #ffffffaa; outline-offset: 4px; border-radius: 4px; }
.sm-scope .sm-line:last-of-type { margin-top: 6px; }
.sm-scope .sm-toggle-textWrap { position: relative; margin-right: 0.5em; display: inline-block; height: 1em; overflow: hidden; white-space: nowrap; width: var(--sm-toggle-width, auto); min-width: var(--sm-toggle-width, auto); }
.sm-scope .sm-toggle-textInner { display: flex; flex-direction: column; line-height: 1; }
.sm-scope .sm-toggle-line { display: block; height: 1em; line-height: 1; font-family: var(--font-thunder-lc); }
.sm-scope .sm-icon { position: relative; width: 14px; height: 14px; flex: 0 0 14px; display: inline-flex; align-items: center; justify-content: center; will-change: transform; }
.sm-scope .sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1; }
.sm-scope .sm-icon-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%); will-change: transform; }
.sm-scope .sm-line { display: none !important; }
.sm-scope .staggered-menu-panel { position: absolute; top: 0; right: 0; width: clamp(260px, 38vw, 420px); height: 100%; background: white; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; flex-direction: column; padding: 6em 2em 2em 2em; overflow-y: auto; z-index: 10; pointer-events: none; }
.sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; }
.sm-scope .sm-prelayers { position: absolute; top: 0; right: 0; bottom: 0; width: clamp(260px, 38vw, 420px); pointer-events: none; z-index: 5; opacity: 0; }
.sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }
.sm-scope .sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; }
.sm-scope .sm-panel-inner { flex: 1; display: flex; flex-direction: column; gap: 1.25rem; }
.sm-scope .sm-actions { margin-top: auto; padding-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; width: 100%; }
.sm-scope .sm-actions-btn { display: inline-flex !important; align-items: center !important; justify-content: center !important; width: 100% !important; height: auto !important; min-height: 54px !important; padding: 0.75rem 1.75rem !important; font-family: var(--font-thunder-lc), var(--font-thunder), sans-serif !important; font-size: 2.25rem !important; font-weight: 600 !important; text-transform: uppercase !important; letter-spacing: -1px !important; line-height: 1 !important; border-radius: 9999px !important; text-decoration: none !important; cursor: pointer !important; box-sizing: border-box !important; }
.sm-scope .sm-actions-btn span { font-family: var(--font-thunder-lc), var(--font-thunder), sans-serif !important; letter-spacing: -1px !important; }
.sm-scope .sm-socials { margin-top: auto; padding-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
.sm-scope .sm-socials-title { margin: 0; font-size: 1rem; font-weight: 500; color: var(--sm-accent, #ff0000); }
.sm-scope .sm-socials-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: row; align-items: center; gap: 1rem; flex-wrap: wrap; }
.sm-scope .sm-socials-link { opacity: 1; transition: opacity 0.3s ease; }
.sm-scope .sm-socials-list:hover .sm-socials-link:not(:hover) { opacity: 0.35; }
.sm-scope .sm-socials-list:focus-within .sm-socials-link:not(:focus-visible) { opacity: 0.35; }
.sm-scope .sm-socials-list .sm-socials-link:hover,
.sm-scope .sm-socials-list .sm-socials-link:focus-visible { opacity: 1; }
.sm-scope .sm-socials-link:focus-visible { outline: 2px solid var(--sm-accent, #ff0000); outline-offset: 3px; }
.sm-scope .sm-socials-link { font-size: 1.2rem; font-weight: 500; color: #111; text-decoration: none; position: relative; padding: 2px 0; display: inline-block; transition: color 0.3s ease, opacity 0.3s ease; }
.sm-scope .sm-socials-link:hover { color: var(--sm-accent, #ff0000); }
.sm-scope .sm-panel-title { margin: 0; font-size: 1rem; font-weight: 600; color: #fff; text-transform: uppercase; }
.sm-scope .sm-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.sm-scope .sm-panel-item { position: relative; color: #000; font-weight: 600; font-size: 4rem; cursor: pointer; line-height: 1; letter-spacing: -2px; text-transform: uppercase; transition: background 0.25s, color 0.25s; display: inline-block; text-decoration: none; padding-right: 1.4em; font-family: var(--font-thunder-lc); }
.sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
.sm-scope .sm-panel-item:hover { color: var(--color-primary); }
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem; content: counter(smItem, decimal-leading-zero); position: absolute; top: 0.1em; right: 0; font-size: 18px; font-weight: 400; color: var(--sm-accent, #ff0000); letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
/* show panel when wrapper has data-open */
.sm-scope .staggered-menu-wrapper[data-open] .staggered-menu-panel { pointer-events: auto; }
.sm-scope .staggered-menu-wrapper[data-open] .sm-prelayers { opacity: 1; }

/* also allow reveal when hovering the header/toggle (icon hover) */
.sm-scope .staggered-menu-header:hover ~ .staggered-menu-panel { pointer-events: auto; }

@media (max-width: 1024px) { .sm-scope .staggered-menu-panel { width: 100%; } .sm-scope .sm-prelayers { width: 100%; } .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img { filter: invert(100%); } }
@media (max-width: 640px) { 
  .sm-scope .staggered-menu-panel { width: 100%; padding: 5em 1.5em 1.5em 1.5em; } 
  .sm-scope .sm-prelayers { width: 100%; } 
  .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img { filter: invert(100%); } 
  .sm-scope .sm-panel-item { font-size: 2.5rem; }
  .sm-scope .sm-actions-btn { font-size: 1.5rem !important; min-height: 48px !important; }
}
      `}</style>
		</div>
	);
};

export default StaggeredMenu;
