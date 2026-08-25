<!-- @format -->

# Developer Documentation — Kiosk

## Purpose

This document provides onboarding and technical guidance for engineers working on `kiosk`. It covers environment setup, routing, component guidelines, dependency rules, live preview architecture, and deployment instructions.

---

## Local Setup

1. Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd kiosk
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open http://localhost:3000 to view the application.

---

## Key Dependencies

- **Next.js 16 (App Router)**: Framework powering client and server routes.
- **React 19**: UI library.
- **Auth.js v5 (`next-auth@beta`)**: Multi-provider authentication and session management.
- **Drizzle ORM & Neon PostgreSQL**: Data layer with PgBouncer connection pooling.
- **Upstash Redis (`@upstash/redis` & `@upstash/ratelimit`)**: Sliding window rate limiting, L2 caching, and payment idempotency locks.
- **Framer Motion 11.18.2**: Component animations and React Bits `<Dock />` spring physics.
- **GSAP & `@gsap/react`**: Timeline motion, `<ScrollStack />`, and `<PillButton />` hover effects.
- **Lottie-Web (`lottie-web`)**: SSR-safe client-side vector animation player (`<LottiePlayer />`).
- **Tailwind CSS v4**: Utility styling framework.
- **Lucide React & Material Symbols**: Icon system.

> [!IMPORTANT]
> **Dependency Stability Notice**: Keep `framer-motion` pinned at `11.18.2` (or stable v11) to avoid Next.js Turbopack missing module errors found in v12 preview tarballs.

---

## Application Routes & Component Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with NavbarWrapper
│   ├── globals.css             # Design tokens, fonts, and @media responsive root scaling
│   ├── page.tsx                # Marketing landing page
│   ├── about/page.tsx          # About page
│   ├── pricing/page.tsx        # Pricing page
│   ├── services/page.tsx       # Dedicated 7-section Services page with Lottie player & quiz
│   ├── contact/page.tsx        # Contact page
│   ├── get-started/page.tsx    # Sign In / Sign Up authentication page
│   ├── not-found.tsx           # Architectural 404 Page Not Found
│   ├── api/
│   │   ├── auth/               # Register, Login, Logout, Session endpoints
│   │   ├── upload/route.ts     # Multi-tenant Cloudinary upload endpoint
│   │   ├── user/
│   │   │   ├── profile/route.ts# User profile & phone number persistence
│   │   │   └── password/route.ts# Password update endpoint
│   │   ├── payments/           # Flutterwave checkout & idempotency handlers
│   │   ├── webhooks/           # Webhook verification & deduplication
│   │   └── projects/
│   │       ├── route.ts        # Project creation & list endpoints
│   │       └── content/route.ts# Website Content Studio submission, email alerts & draft sync
│   └── dashboard/
│       ├── layout.tsx          # Dashboard light theme container & Sidebar Dock
│       ├── page.tsx            # Main dashboard overview & dynamic time greeting
│       ├── projects/
│       │   ├── page.tsx        # Projects list, search, and status filters
│       │   └── new/page.tsx    # Multi-step Start New Project wizard
│       ├── content/
│       │   └── page.tsx        # Website Content Studio with live interactive preview & separated logo upload
│       ├── templates/
│       │   └── page.tsx        # Interactive Templates directory with live modal preview
│       ├── billing/page.tsx    # Subscription plans & billing history
│       └── settings/page.tsx   # Profile, phone number, security, and notification settings
└── components/
    ├── Navbar.tsx              # Public header navigation
    ├── NavbarWrapper.tsx       # Route-aware wrapper hiding marketing nav on /dashboard
    ├── PillButton.tsx          # Flagship GSAP animated pill button component
    ├── CTA.tsx                 # Full-bleed blue background CTA section with wave transition
    ├── Footer.tsx              # Dark footer with wave silhouette divider
    ├── HowItWorks.tsx          # GSAP-driven scroll stack process section
    ├── LottiePlayer.tsx        # SSR-safe Lottie vector animation player
    ├── ScrollStack.tsx         # Stacked card scroll trigger wrapper
    └── dashboard/
        ├── Dock.tsx            # React Bits dock component for bottom navigation
        ├── ProjectCard.tsx     # Project card with direct navigation to Content Studio
        └── Sidebar.tsx         # Sidebar container wrapping Dock
```

---

## Multi-Tenant Cloudinary Media Storage Pipeline

- **Storage Engine**: Serverless Cloudinary integration via Node `crypto` SHA-1 cryptographic signature authentication (`src/lib/storage/cloudinary.ts`).
- **Strict Tenant Partitioning**:
  - Automatically isolates user uploads under `kiosk/tenants/<tenantSlug>/<category>/` (`logos`, `brand_assets`, `products`, `avatars`).
  - Generates collision-proof public IDs (`<name>_<timestamp>_<uuid>`) to prevent cross-tenant overwrites.
- **Auto Image Optimization**: Automatic WebP/AVIF compression and responsive thumbnail generation via `getOptimizedImageUrl()`.

---

## Transactional Email Notification System

Provides automated notifications via Resend API (`src/lib/email.ts`):
1. **Admin Review Alert (`sendWebsiteReviewNotificationToAdmin`)**: Sent to `ADMIN_EMAIL` / `support@kioosk.online` with business details, plan tier, uploaded photo count, contact info, and deep-link directly to `/dashboard/content?projectId=<id>`.
2. **Client Review Confirmation (`sendWebsiteReviewConfirmationToClient`)**: Reassures client that project is updated to **"85% • In Review"** and being personalized.
3. **Welcome Greeting Email (`sendWelcomeEmail`)**: Dispatched on standard registration and OAuth account creation via NextAuth's `createUser` lifecycle hook.
4. **Deep-Link URL Resolver**: Dynamic `getAppUrl()` resolves base URL seamlessly across local development, Vercel preview branches, and production.

---

## Session & Authentication Lifecycle

- **Session Expiration**: User session tokens expire strictly after **6 hours** of inactivity.
- **Payment Grace Window**: If a user is actively completing a transaction on `/checkout` (`isCheckoutInProgress` state), automatic logout is suspended to prevent mid-payment session termination.
- **Rate Limiting**: Auth and upload endpoints enforce Upstash Redis sliding window limits.

---

## Coding Conventions

- **TypeScript**: Strict mode enabled. Run `node node_modules/typescript/lib/tsc.js --noEmit` to verify type safety.
- **Feedback Standards**: Settings and profile updates show concise **"Updated"** feedback.
- **Design System Rules**:
  - Light mode theme (`bg-[#f8fafc]`, `bg-white`, `border-gray-200/90`) for main portal.
  - Live Preview dual-theming: Supports Light (`#ffffff`) and Midnight Dark Mode (`#070d1d`, `#0d162a`, `#111c33`).
  - Zero background gradients (`bg-gradient-to-*` is prohibited on cards and hero urgency banners).
  - Use `PillButton` component for primary call-to-actions.
  - Base typography: 18px base desktop, 16px base mobile.
  - No em-dashes `—` in user-facing marketing copy.

---

## Navigation & Routing Best Practices

1. **Client Navigation**: Always use `next/link` or `router.push()` from `next/navigation`.
2. **Dashboard Isolation**: The marketing navbar (`StaggeredMenu`) is hidden on `/dashboard` routes via `NavbarWrapper.tsx`.
3. **Project Card Editing**: Clicking a project card routes to `/dashboard/content?projectId=<id>`.
4. **Log Out Flow**: Log out in the dashboard profile dropdown triggers `logout()` from `AuthContext` and redirects to `/get-started`.

---

## Scripts & QA Verification

- `npm run dev` — Start Next.js development server
- `npm run build` — Build production bundle
- `npm run start` — Serve production build
- `node node_modules/typescript/lib/tsc.js --noEmit` — Type-check TypeScript codebase without emitting files

Before submitting changes:
1. Run `node node_modules/typescript/lib/tsc.js --noEmit` and ensure **0 errors**.
2. Verify responsive layout across mobile (< 640px), tablet, and desktop viewports.

