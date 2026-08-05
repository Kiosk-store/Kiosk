<!-- @format -->

# System Design — Kiosk

## Overview

`kiosk` is a modern Next.js 16 web application consisting of two primary subsystems:
1. **Public Marketing Application**: Modular, high-conversion marketing pages (`/`, `/about`, `/services`, `/pricing`, `/contact`, `/get-started`).
2. **Authenticated Client Dashboard**: Single-page app workspace (`/dashboard`, `/dashboard/projects`, `/dashboard/projects/new`, `/dashboard/billing`, `/dashboard/settings`).

## High-Level System Architecture

```
                  ┌──────────────────────────────────────────────┐
                  │                 User Client                  │
                  │         (Modern Web Browser / Mobile)        │
                  └──────────────────────┬───────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │          Next.js App Router (CDN/Edge)        │
                 └───────────┬───────────────────────┬───────────┘
                             │                       │
           ┌─────────────────┴──────────────┐ ┌──────┴────────────────────────┐
           │      Public Marketing Pages    │ │   Authenticated Client Portal   │
           │  (/, /about, /services, etc.)  │ │          (/dashboard/*)         │
           └────────────────────────────────┘ └─────────────────────────────────┘
                                                     │
                                                     ▼
                                       ┌───────────────────────────┐
                                       │   Backend API Microservice│
                                       │ (See BACKEND_SYSTEM_DESIGN│
                                       │ & BACKEND_ARCHITECTURE)   │
                                       └───────────────────────────┘
```

- **Client Runtime**: React 19, Framer Motion (Dock spring physics), GSAP (PillButton animation), Lottie-Web (`LottiePlayer`), ScrollStack, Tailwind CSS v4.
- **Rendering Strategy**: Static Generation (SSG) for marketing content and Client-Side Rendering (CSR) for interactive dashboard views.

---

## Subsystems & Data Flow

### 1. Public Marketing Subsystem
- **Routing & Layout**: Global `layout.tsx` wraps pages with `NavbarWrapper` to conditionally render `Navbar` and `StaggeredMenu`.
- **Dedicated Services Page (`/services`)**:
  - **Hero Section**: Architectural grid lines, minimal technical crosshairs (`+`), and an interactive `<LottiePlayer />` canvas supporting live tab switching between *Sales Funnel*, *Landing Page*, and *E-Commerce*.
  - **Service Tier Deep Dive Sections**: Full breakdown of Landing Page (`$499 setup + $20/mo`), Sales Funnel (`$799 setup + $30/mo`), and E-commerce Store (`$1,199 setup + $43/mo`).
  - **Interactive Billing Toggle**: Allows toggling between Monthly and Yearly (Save 20%) billing cycles across service cards.
  - **Interactive Process Section (`<HowItWorks />`)**: Animated 4-card scroll stack process section.
  - **Decision Helper Quiz**: Interactive 3-choice recommendation engine recommending tier packages based on business goals.
- **Full-Bleed CTA System (`CTA.tsx`)**:
  - Full-width blue background section (`bg-[#004ac6]`) with radial highlight.
  - Asymmetric wave divider SVG (`fill-[#004ac6]`) seamlessly transitioning into the dark footer (`#03152c`).
- **User Onboarding Flow**: Users click "Get Started" to reach `/get-started`. On form submission, a loading spinner is triggered, followed by client-side navigation to `/dashboard`.

### 2. Client Dashboard Subsystem
- **Layout & Navigation**: `/dashboard/layout.tsx` enforces light mode styling (`bg-[#f8fafc]`) and renders the persistent floating bottom `<Dock />` component wrapper (`Sidebar.tsx`).
- **Header Profile State**: `page.tsx` renders dynamic greetings based on client local time (`00:00-11:59` Morning, `12:00-16:59` Afternoon, `17:00-23:59` Evening), notification icon trigger, and profile dropdown menu (*Account Settings*, *Billing & Plan*, *Log Out*).
- **Log Out Behavior**: Selecting "Log Out" closes state and redirects to `/get-started`.

### 3. Start New Project Wizard Subsystem
- **Wizard Flow (`/dashboard/projects/new`)**: 4-step interactive configuration form (*Type → Details → Content → Review*).
- **Submission State**: Simulates backend project initialization with progress state indicators and redirects to `/dashboard/projects`.

---

## Performance & Responsive System

- **Fluid Mobile Scaling**: Root `rem` scaling configured in `globals.css`:
  - `html { font-size: 18px; }` on desktop.
  - `@media (max-width: 640px) { html { font-size: 16px; } }` for mobile viewports (< 640px).
- **Zero Gradients**: High-contrast, clean solid colors with slate/blue accents.
- **Error Handling**: Native Next.js `not-found.tsx` fallback page handles 404 routes gracefully.

---

## Security & Deployment

- Deployments hosted on Vercel with automatic edge CDN caching for static assets.
- Input validation on onboarding and project wizard forms.
- Transport Layer Security (TLS 1.3) across all endpoints.
