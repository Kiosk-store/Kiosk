<!-- @format -->

# Design architecture — Kiosk

## Purpose

This document describes the visual and component architecture for the `kiosk` marketing site. It is written to help designers and engineers reason about the component model, visual tokens, layout rules, interaction patterns, and accessibility expectations.

## Design goals

- Premium, luxury visual direction with a light theme.
- Consistent, prominent CTAs across sections.
- Smooth, high-performance interactions and subtle motion.
- Mobile-first responsiveness and progressive enhancement.

## Key principles

- Component-driven: UI is broken into small, composable components in `src/components`.
- Token-based styling: use a small set of color, spacing and type tokens rather than one-off values.
- Accessibility-first: semantic markup, keyboard focus states, color contrast, and ARIA where necessary.
- Minimal global state: prefer props and local state; central stores only for cross-cutting concerns (e.g., scroll/lenis store).

## Visual system

- Color tokens (recommended):
  - `--color-bg` — primary background (near-black)
  - `--color-primary` — accent/brand color
  - `--color-on-primary` — text/icon color used on primary surfaces
  - `--color-muted` — secondary, supporting elements
- Typography:
  - Display heading: large, expressive type for hero and section headers (`font-display-hero`).
  - Body: readable, relaxed line-height for paragraphs.
  - Scale: maintain consistent font-size scale (base, lead, small).
- Spacing:
  - Use an 8px baseline grid where possible for margins, padding, and radius values.
  - Large sections use `py-20` / `md:py-28` patterns as seen in `CTA`.

## Component hierarchy and responsibilities

- Page (root) — composes sections in `src/app/page.tsx`.
- Section — a full-width block with internal max-width and padding. Responsible for spacing and background.
- Molecules — small grouped UI (e.g., TrustStrip, Testimonials list).
- Atoms — buttons, headings, badges, icons.

## CTA design

- CTAs must be visually prominent and consistent across pages:
  - Primary CTA: high contrast (white on brand color) with rounded pill shape (e.g., `rounded-full`) and shadow.
  - Secondary CTA: subtle outline or semi-transparent surface with backdrop blur for layered depth.

## Motion and interactions

- Use `gsap` and `lenis` for scroll-driven effects; keep motion subtle and performant.
- Respect reduced-motion: provide a global `prefers-reduced-motion` check and reduce animation intensity when requested.

## Accessibility checklist

- Ensure 4.5:1 contrast for body text against background where possible.
- Provide `:focus-visible` states for keyboard users on interactive elements (buttons, links).
- Use semantic HTML (`section`, `nav`, `header`, `main`) and landmarks.

## Design tokens and where they live

- Place tokens in `globals.css` or a small `design-tokens.css` if introduced. Use Tailwind theme extensions where applicable.

## Onboarding guidance for designers

- When adding new sections, create a small Figma or design artifact and annotate tokens used.
- Keep CTA styles in a single place so updates propagate across the site.

## Revision notes

- Treat this as a living document; update when adding new major components or when the theme changes.
