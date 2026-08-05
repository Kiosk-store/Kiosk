<!-- @format -->

# Design Architecture — Kiosk

## Purpose

This document describes the visual and component architecture for the `kiosk` web application and client dashboard. It is written to help designers and engineers reason about the component model, visual tokens, layout rules, interaction patterns, and accessibility expectations.

## Design Goals

- **Sleek & Professionally Neat Light Mode**: Premium light theme (`bg-[#f8fafc]`, crisp `border-gray-200/90` containers, solid color accents).
- **Zero Gradients**: All UI components use solid, curated harmonious color palettes (slate, blue, emerald) without gradient background fills.
- **Enhanced Legibility**: Primary font scale set to 18px base / 1.125rem for maximum visibility.
- **Standardized Button System (`PillButton`)**: Uniform pill-shaped interactive buttons with GSAP hover circle expansion and dual-label sliding transitions.
- **Interactive Navigation**: Bottom floating `<Dock />` component built with Framer Motion spring physics for dashboard navigation.
- **Mobile-First Responsiveness**: Responsive grid systems and progressive enhancement across viewports.

## Visual System

- **Color Tokens**:
  - `--color-background` (`#f8fafc`) — Primary app background.
  - `--color-primary` (`#004ac6`) — Brand primary blue accent.
  - `--color-surface-container-lowest` (`#ffffff`) — Card surface background.
  - `--color-on-surface` (`#0f172a`) — Primary text color.
  - `--color-on-surface-variant` (`#475569`) — Muted body & label text color.
- **Typography Tokens**:
  - **Nohemi**: Primary body and UI heading font (`var(--font-nohemi)`).
  - **Thunder**: High-impact display font (`var(--font-thunder)`, `var(--font-thunder-lc)`).
  - **Scale**: Base font size set to 18px (`1.125rem`) for enhanced visibility across all viewports.

## Component Hierarchy & Layout Rules

### Public Marketing Site
- **Header Navigation**: `NavbarWrapper` conditionally renders `Navbar` / `StaggeredMenu` on public marketing pages (`/`, `/about`, `/pricing`, `/services`, `/contact`).
- **Pages**: Hero, Services preview, Portfolio showcase, Pricing tables, FAQ accordion, CTA section, Footer.

### Dashboard Application (`/dashboard/*`)
- **Header**: Sticky brand logo header bar with dynamic time-based greeting (*Good morning / afternoon / evening*), notification icon trigger, and interactive profile dropdown menu (*Account Settings*, *Billing & Plan*, *Log Out*).
- **Navigation Dock (`Sidebar.tsx`)**: Bottom floating `<Dock />` component using Framer Motion magnification effects for quick route switching (`/dashboard`, `/dashboard/projects`, `/dashboard/billing`, `/dashboard/settings`).
- **Main Views**:
  - **Overview (`/dashboard`)**: Dynamic greeting, project cards, and quick actions.
  - **Projects (`/dashboard/projects`)**: Status filter tabs (*All*, *In Progress*, *In Review*, *Live*, *Drafts*), search input, and project grid.
  - **New Project Wizard (`/dashboard/projects/new`)**: 4-step wizard (*Type → Details → Content → Review*).
  - **Billing & Subscription (`/dashboard/billing`)**: Plan overview, monthly/yearly cycle toggle (-20% discount), upgrade grid, and invoice history table.
  - **Settings (`/dashboard/settings`)**: Tabbed forms (*Profile Info*, *Security/2FA*, *Notifications*).
  - **404 Not Found (`src/app/not-found.tsx`)**: High-aesthetic 404 display with brand typography and architectural grid lines.

## Button System (`PillButton`)

- Built with GSAP animations for spring hover interaction.
- Uses `rounded-full` pill geometry with explicit color tokens (`baseColor`, `circleColor`, `textColor`, `hoverTextColor`).
- Supports both Link navigation (`href`) and button form submission (`type="submit"`).

## Revision Notes

- Updated visual system to Light Mode, removed dark gradients, updated base font size to 18px, and documented the `<Dock />` navigation component.
