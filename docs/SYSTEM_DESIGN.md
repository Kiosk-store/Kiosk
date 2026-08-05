<!-- @format -->

# System Design — Kiosk

## Overview

`kiosk` is a modern Next.js 16 web application consisting of two primary subsystems:
1. **Public Marketing Application**: Modular marketing pages (`/`, `/about`, `/services`, `/pricing`, `/contact`, `/get-started`).
2. **Authenticated Client Dashboard**: Single-page app workspace (`/dashboard`, `/dashboard/projects`, `/dashboard/projects/new`, `/dashboard/billing`, `/dashboard/settings`).

## High-Level Architecture

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

- **Client Runtime**: React 19, Framer Motion (Dock spring physics), GSAP (PillButton animation), Tailwind CSS v4.
- **Rendering Strategy**: Static Generation (SSG) for marketing content and Client-Side Rendering (CSR) for interactive dashboard views.

## Subsystems & Data Flow

### 1. Public Marketing Subsystem
- **Routing & Layout**: Global `layout.tsx` wraps pages with `NavbarWrapper` to conditionally render `Navbar` and `StaggeredMenu`.
- **User Onboarding Flow**: Users click "Get Started" to reach `/get-started`. On form submission, a loading spinner is triggered, followed by client-side navigation to `/dashboard`.

### 2. Client Dashboard Subsystem
- **Layout & Navigation**: `/dashboard/layout.tsx` enforces light mode styling (`bg-[#f8fafc]`) and renders the persistent floating bottom `<Dock />` component wrapper (`Sidebar.tsx`).
- **Header Profile State**: `page.tsx` renders dynamic greetings based on client local time (`00:00-11:59` Morning, `12:00-16:59` Afternoon, `17:00-23:59` Evening) and toggles the profile dropdown menu.
- **Log Out Behavior**: Selecting "Log Out" closes state and redirects to `/get-started`.

### 3. Start New Project Wizard Subsystem
- **Wizard Flow (`/dashboard/projects/new`)**: 4-step interactive configuration form (*Type → Details → Content → Review*).
- **Submission State**: Simulates backend project initialization with progress state indicators and redirects to `/dashboard/projects`.

## Performance & UX Guidelines

- **Zero Gradients**: High-contrast, clean solid colors with slate/blue accents.
- **Typographic Accessibility**: 18px base font scale for legibility across viewports.
- **Error Handling**: Native Next.js `not-found.tsx` fallback page handles 404 routes gracefully.

## Security & Deployment

- Deployments hosted on Vercel with automatic edge CDN caching for static assets.
- Input validation on onboarding and project wizard forms.
