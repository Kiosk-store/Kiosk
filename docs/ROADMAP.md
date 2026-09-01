<!-- @format -->

# Kiosk — Product Roadmap

> **Launch Target: September 30, 2026**

This roadmap tracks every milestone from the initial build through public launch and post-launch growth. It is the single source of truth for what has shipped, what is in progress, and what is coming next.

---

## Status Legend

| Badge | Meaning |
| :--- | :--- |
| ✅ Done | Shipped and production-ready |
| 🔄 In Progress | Actively being worked on |
| 🔜 Up Next | Queued — starts after current milestone |
| 📋 Planned | Scoped and confirmed for a future phase |
| 💡 Exploration | Under consideration, not yet committed |

---

## Phase 1 — Core Infrastructure ✅ Done

> **Goal**: Lay the full-stack, multi-tenant foundation.

- ✅ Next.js 16 App Router project scaffold
- ✅ Neon PostgreSQL + Drizzle ORM schema (`users`, `tenants`, `projects`, `sessions`)
- ✅ Auth.js v5 authentication (Google OAuth + email/password)
- ✅ Custom secure HTTP-only session cookies
- ✅ RBAC roles — `USER`, `ADMIN`, `SUPERADMIN`
- ✅ Edge Middleware — subdomain rewriter (`<tenant>.kioosk.online → /tenants/[slug]`)
- ✅ Custom domain rewriter (`<customdomain.com> → /domains/[domain]`)
- ✅ Upstash Redis rate limiting (Sliding Window)
- ✅ Cloudinary multi-tenant media isolation (`kiosk/tenants/<id>/...`)
- ✅ Flutterwave subscription payments (3 plans × 2 billing cycles)
- ✅ Webhook signature verification + idempotency locks
- ✅ Resend transactional email engine (`src/lib/email.ts`)

---

## Phase 2 — Client Dashboard ✅ Done

> **Goal**: Give clients a polished self-service workspace.

- ✅ `/dashboard` — main hub with subscription status and quick actions
- ✅ `/dashboard/projects` — real-time project progress tracking
- ✅ `/dashboard/content` — Website Intake Studio (form, media uploads, product catalog)
- ✅ `/dashboard/templates` — industry-specific template browser
- ✅ `/dashboard/projects/new` — new project wizard
- ✅ `/dashboard/billing` — plan details, monthly/yearly toggle, invoice history
- ✅ `/dashboard/settings` — profile, password, notifications

---

## Phase 3 — Admin Operations Backoffice ✅ Done

> **Goal**: Give the Kiosk team full control over fulfillment and launch.

- ✅ `/admin` — Bento Grid Operations Hub with live KPIs (Queue, In Progress, Live, Revenue)
- ✅ `/admin/projects` — Fulfillment Queue with search and status filters
- ✅ `/admin/projects/[id]` — Fulfillment & Launch Studio
  - Full brand assets inspector (logo, gallery, copy, offerings)
  - Published domain assignment
  - Internal fulfillment notes
  - 1-click **"Publish Website & Email Client Launch Notification"**
- ✅ `/admin/users` — user directory with role assignment
- ✅ `/admin/billing` — revenue ledger and invoice management
- ✅ Interactive floating `AdminDock` navigation

---

## Phase 4 — Email Notification System ✅ Done

> **Goal**: Automate every client and team touchpoint.

- ✅ Admin intake alert (instant notification on new submission)
- ✅ Client intake receipt (submission acknowledgement)
- ✅ Website Live celebration email (dispatched on 1-click Publish)
- ✅ Hosting renewal invoices & grace period notices
- ✅ Password reset & account welcome emails

---

## Phase 5 — Live Website Renderer ✅ Done

> **Goal**: Dynamically render each tenant's published site on their subdomain/domain.

- ✅ `<TenantLiveSite />` dynamic renderer for Landing Pages, Sales Funnels, and E-Commerce Stores
- ✅ 1-click WhatsApp Commerce with pre-filled product order messages
- ✅ Responsive, high-converting page output from intake data

---

## Phase 6 — Pre-Launch Polish 🔄 In Progress

> **Goal**: Harden UX, squash bugs, and prepare for real users.
> **Target completion: September 25, 2026**

- 🔄 End-to-end QA pass across all dashboard and admin flows
- 🔄 TypeScript strict-mode error resolution (`tsc_err.txt` backlog)
- 🔄 Mobile responsiveness audit — dashboard, intake studio, live sites
- 🔄 Performance audit — Core Web Vitals (LCP, CLS, INP) on tenant pages
- 🔜 Accessibility review (WCAG 2.1 AA) on all public-facing pages
- 🔜 Error boundary coverage for all critical pages
- 🔜 Loading skeleton states across dashboard
- 🔜 Empty state designs for zero-project and zero-product states

---

## Phase 7 — Marketing Site & Checkout 🔜 Up Next

> **Goal**: Public-facing homepage and frictionless onboarding funnel.
> **Target completion: September 28, 2026**

- 🔜 Public homepage (`/`) — hero, features, pricing, testimonials, FAQ
- 🔜 Pricing page (`/pricing`) with plan comparison table
- 🔜 `/checkout` — guided plan selection → signup → payment flow
- 🔜 About/contact page
- 🔜 SEO meta tags, Open Graph images, and sitemap
- 🔜 Cookie consent banner (NDPR/GDPR-compliant)

---

## Phase 8 — Production Launch 🔜 Up Next

> **Goal**: Go live and accept first paying customers.
> **Target: September 30, 2026 🚀**

- 🔜 DNS and custom domain provisioning on production (`kioosk.online`)
- 🔜 Production environment variables finalised and secured
- 🔜 Neon PostgreSQL production branch promoted
- 🔜 Upstash Redis production instance configured
- 🔜 Flutterwave live-mode keys activated
- 🔜 Resend domain verified for deliverability
- 🔜 Cloudinary production plan confirmed
- 🔜 Vercel production deployment + wildcard subdomain routing verified
- 🔜 Smoke test — full end-to-end order (signup → intake → publish → live site)
- 🔜 Team onboarding — admin accounts and fulfillment SOPs documented

---

## Phase 9 — Post-Launch Growth 📋 Planned

> **Goal**: Stabilise operations and grow the customer base.
> **Target: October – December 2026**

- 📋 Customer analytics dashboard (page views, WhatsApp clicks, conversion)
- 📋 Referral / affiliate programme
- 📋 Automated renewal reminders and dunning sequences
- 📋 Expanded template library (10+ industry verticals)
- 📋 SMS notification integration (Termii / Vonage)
- 📋 In-dashboard live chat support widget

---

## Phase 10 — Platform Expansion 💡 Exploration

> Long-term capabilities being evaluated.

- 💡 Client self-serve minor edits (text, phone number, hours)
- 💡 AI-assisted intake (auto-generate copy from a few keywords)
- 💡 Custom domain self-service connection (DNS wizard)
- 💡 White-label reseller programme
- 💡 Native mobile app (React Native) for client dashboard

---

## Key Dates Summary

| Milestone | Target Date |
| :--- | :--- |
| Phase 6 — Pre-Launch Polish complete | Sep 25, 2026 |
| Phase 7 — Marketing site & checkout live | Sep 28, 2026 |
| **Phase 8 — Public Launch 🚀** | **Sep 30, 2026** |
| Phase 9 — Post-launch growth kicks off | Oct 1, 2026 |

---

_Last updated: September 2026_
