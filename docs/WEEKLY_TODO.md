<!-- @format -->

# Technical TODO Roadmap & Action Plan - Kiosk

---

## Executive Summary & Core Objectives

This technical TODO roadmap outlines the high-priority engineering tasks, design redesigns, template expansion, test coverage goals, and deployment preparations for **Kiosk** (Next.js 16, React 19, TypeScript, Drizzle ORM, Auth.js v5, Flutterwave, Upstash Redis).

---

## 1. Front-End Redesign & Visual Design Audit

### Hero Section Redesign (`src/components/Hero.tsx`)
- [ ] **High-Impact Headline & Typography**: Redesign hero title with solid high-contrast typography, clean pill badges, and modern responsive font scaling.
- [ ] **Interactive CTA Integration**: Enhance primary and secondary `PillButton` triggers with hover states and subtle button shadows.
- [ ] **Visual Metric Cards & Icons**: Replace empty placeholder badge circles with Lucide React icons (`Zap`, `ShieldCheck`, `TrendingUp`, `Sparkles`).
- [ ] **Enhanced Browser Window Mockup**: Upgrade live website preview card with dynamic status indicators, solid card floaters, and crisp card borders.

### Design Typos & Visual Consistency Audit
- [ ] **Icon & Element Alignment**: Audit components for missing icon SVGs inside circular badges (`Hero.tsx`, `CTA.tsx`, `HowItWorks.tsx`).
- [ ] **Color Token Audit**: Enforce consistent solid design token usage (`#004ac6` primary blue, `emerald-500` status indicators, `slate-900` text).
- [ ] **Copy Clean Up**: Remove illegal em-dashes from user-facing copy in compliance with Kiosk developer guidelines.
- [ ] **Responsive Spacing**: Fix mobile-to-desktop padding shifts (`pt-32` vs `pt-44`) and container padding alignment.

---

## 2. Multi-Tenant Industry Site Templates (4-6 Preset Engine)

### Factory Architecture (`src/lib/factory/SiteTemplateFactory.ts`)
- [ ] **Template 1: Modern Business Landing Page** - Single page with Hero CTA, Services Grid, WhatsApp direct booking, and contact form.
- [ ] **Template 2: High-Converting Sales Funnel** - Multi-stage funnel with landing offer, value stack, lead capture, CRM integration, and thank-you page.
- [ ] **Template 3: E-Commerce Storefront** - Full digital store with catalog grid, cart drawer, Stripe/Flutterwave payment gateway, and order receipt.
- [ ] **Template 4: Creative Agency Showcase** - Visual showcase with case studies, interactive portfolio grid, pricing tables, and client intake form.
- [ ] **Template 5: Local Restaurant & Bistro** - Dynamic food menu showcase, table reservation modal, direct WhatsApp ordering, and location map.
- [ ] **Template 6: Professional Services & Consulting** - Expert profile, service package calculator, calendar booking widget, and client testimonials stack.

---

## 3. Authentication & Checkout Session Protection Engine

- [ ] **Background Token Auto-Refresh**: Wire silent token refresh on `/checkout` entry so JWT access tokens do not expire during payment flows.
- [ ] **Pre-Payment Auth Verification**: Validate active user session before dispatching payment payload to Flutterwave / Stripe gateways.
- [ ] **Checkout Form State Persistence**: Implement encrypted `sessionStorage` caching so transient form data persists if users navigate to 3D Secure bank verification tabs.
- [ ] **Grace Period Cookie Handler**: Set a 1-hour session extension window when visitors are actively interacting with `/checkout`.

---

## 4. Decoupled Event Messaging & Async Workers

- [ ] **Upstash QStash Integration**: Wire QStash for asynchronous event publishing and background job dispatching.
- [ ] **Email Notification Decoupling**: Offload Resend transactional email dispatches (`src/lib/email.ts`) from blocking HTTP request threads to QStash workers.
- [ ] **Invoice PDF Generation**: Verify Inngest background workers (`src/inngest/client.ts`) for generating downloadable PDF payment receipts upon webhook trigger.

---

## 5. E2E Testing, TDD & CI/CD Automation

- [ ] **Playwright Test Environment**: Configure Playwright (`playwright.config.ts`) for API and integration testing.
- [ ] **API Endpoint Tests (`*.e2e-spec.ts`)**:
  - `POST /api/auth/register` & `POST /api/auth/login` (validation, rate-limiting, error responses).
  - `POST /api/payments/initialize` (atomic lock `SETNX` double-charge protection).
  - `POST /api/webhooks/flutterwave` (secret hash verification and event deduplication).
- [ ] **GitHub Actions CI/CD Pipeline (`.github/workflows/ci.yml`)**:
  - Automated `npx tsc --noEmit` and ESLint checks on every PR.
  - Automatic Vitest suite execution on merges.

---

## 6. Production Deployment Pre-Flight & Infrastructure


- [ ] **Wildcard Subdomain Middleware Audit**: Verify `<client>.kiosk.site` header forwarding and edge routing in `src/middleware.ts`.
- [ ] **Production Build Audit**: Execute `npm run build` locally to verify 0 build errors and zero TypeScript compile issues (`npx tsc --noEmit`).

---

## Task Progress Summary

| Category | High Priority Task | Status | Target Deliverable |
| :--- | :--- | :---: | :--- |
| **Design / UI** | Hero Section Redesign & Interactive Card | Pending | `src/components/Hero.tsx` |
| **Design / UI** | Design Typos & Visual Audit Adjustments | Pending | Design polish across UI |
| **Templates** | 4-6 Industry Site Template Engine | Pending | `SiteTemplateFactory.ts` |
| **Auth** | Checkout Session & Token Persistence | Pending | `src/app/checkout/page.tsx` |
| **Async Bus** | Upstash QStash Event Bus Setup | Pending | `src/lib/events/` |
| **Testing** | Playwright E2E Test Suite | Pending | `*.e2e-spec.ts` |
| **DevOps** | GitHub Actions CI/CD Pipeline | Pending | `.github/workflows/` |
| **Deploy** | Production Pre-Flight Audit | Pending | Vercel & Neon Setup |

---

## Verification & Acceptance Criteria

1. **Type Safety**: `npx tsc --noEmit` completes with **0 errors**.
2. **Build Success**: `npm run build` generates optimized production bundles without warnings or failures.
3. **Template Coverage**: 6 fully configured site templates available in `SiteTemplateFactory`.
4. **UI Design Standard**: 100% clean solid typography, responsive layout, zero missing icons, and vibrant modern aesthetic.
