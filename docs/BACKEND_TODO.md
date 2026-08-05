<!-- @format -->

# Scalable Backend Architecture TODO & Technical Roadmap — Kiosk

This TODO roadmap defines the enterprise-scalable backend architecture for **Kiosk**, specifically tailored to our **Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4** tech stack.

---

## 🛠️ Scalable Stack Architecture Overview

| Layer | Enterprise Scalable Technology Stack |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router Route Handlers & Server Actions) |
| **Authentication** | Auth.js v5 (NextAuth) + Zod + Upstash Redis Session Cache |
| **Database** | PostgreSQL (Neon Serverless / AWS Aurora) |
| **ORM & Querying** | Drizzle ORM / Prisma ORM + PgBouncer Connection Pooling |
| **Payments** | Stripe Billing API + Paystack Engine + Upstash Idempotency Locks |
| **Background Jobs** | Inngest / BullMQ (Async serverless worker queues) |
| **Caching Engine** | Upstash Redis (Serverless-optimized HTTP/REST Redis Cluster) |
| **Email & Transact** | Resend + React Email (`@react-email/components`) |
| **Domain Provision**| Vercel Domains API / Cloudflare API v4 (`<client>.kiosk.site`) |
| **Testing & TDD** | Vitest + Supertest + Playwright API Testing |
| **Observability** | Sentry Error Tracking + Axiom Structured Logging |

---

## 🚀 Phase 1: Authentication & Authorization Engine (STARTING PRIORITY)

### 1. Stack Dependencies & Database Schema
- [ ] Install core Auth dependencies (`npm install next-auth@beta @auth/drizzle-adapter @auth/prisma-adapter zod`).
- [ ] Install Drizzle ORM & PostgreSQL client (`npm install drizzle-orm postgres` & `npm install -D drizzle-kit`).
- [ ] Define core database schema in `src/db/schema.ts`:
  - [ ] `users` (`id`, `name`, `email`, `passwordHash`, `image`, `role`, `createdAt`, `updatedAt`).
  - [ ] `accounts` (`userId`, `type`, `provider`, `providerAccountId`, `refresh_token`, `access_token`).
  - [ ] `sessions` (`sessionToken`, `userId`, `expires`).
  - [ ] `verificationTokens` (`identifier`, `token`, `expires`).
- [ ] Run migration pipeline (`npx drizzle-kit generate` & `npx drizzle-kit migrate`).

### 2. Security & Password Hashing
- [ ] Install `bcryptjs` / `argon2` for secure password hashing.
- [ ] Create security module (`src/lib/auth/password.ts`) with Zod schema validation.
- [ ] Configure JWT access token issuance (RS256) and HTTP-Only cookie security (`SameSite=Strict`, `Secure`).

### 3. Auth API Route Handlers (`src/app/api/auth/*`)
- [ ] **`POST /api/auth/register`**:
  - Validate email & password with Zod schema.
  - Check database for duplicate email.
  - Hash password and insert user record into PostgreSQL.
  - Issue session DTO & set secure auth cookie.
- [ ] **`POST /api/auth/login`**:
  - Lookup user record & verify bcrypt password hash.
  - Issue session token & HTTP-Only refresh cookie.
- [ ] **`POST /api/auth/logout`**:
  - Invalidate token in Upstash Redis token revocation blacklist.
  - Clear HTTP-Only session cookies.
- [ ] **`GET /api/auth/me`**:
  - Return current authenticated session profile DTO.

### 4. OAuth 2.0 Google & GitHub Providers
- [ ] Configure Google & GitHub OAuth client keys in `.env`.
- [ ] Mount Auth.js v5 route handler (`src/app/api/auth/[...nextauth]/route.ts`).
- [ ] Attach Google OAuth trigger to the "Continue with Google" button on `src/app/get-started/page.tsx`.

### 5. Next.js Route Protection Middleware (`src/middleware.ts`)
- [ ] Implement Next.js edge middleware to guard `/dashboard/*` and `/checkout` routes.
- [ ] Redirect unauthenticated visitors to `/get-started?tab=login`.

### 6. Frontend Auth State Integration (`src/app/get-started/page.tsx`)
- [ ] Build `AuthContext.tsx` provider with `useAuth()` custom hook (`user`, `login`, `signup`, `logout`, `isLoading`).
- [ ] Wire `handleSignupSubmit`, `handleLoginSubmit`, and `handleSocialAuth` on `/get-started` to real API endpoints.
- [ ] Connect dashboard profile header greetings and "Log Out" button to `logout()` context handler.

---

## Phase 2: Database Infrastructure & Connection Pooling
- [ ] Provision **Neon PostgreSQL** serverless instance.
- [ ] Configure **PgBouncer** pooling endpoint (`max_connections=100`).
- [ ] Write schema models for `projects`, `subscriptions`, `invoices`, and `idempotency_keys`.

---

## Phase 3: Subscriptions & Payment Integration
- [ ] Integrate **Stripe Billing API** & **Paystack** webhooks (`src/app/api/webhooks/stripe/route.ts`).
- [ ] Implement **Upstash Redis** distributed lock (`SETNX idempotency:<key>`) for `Idempotency-Key` headers on `/checkout` to eliminate double charging.
- [ ] Map active plans: `$20/mo` ($192/yr), `$30/mo` ($288/yr), `$43/mo` ($408/yr).

---

## Phase 4: Domain & Site Provisioning Engine
- [ ] Build `SiteTemplateFactory` (Factory pattern) for dynamic site tier engines (`landing`, `funnel`, `store`).
- [ ] Automate wildcard subdomain allocation (`<client>.kiosk.site`) via **Vercel Domains API / Cloudflare API v4**.
- [ ] Setup **Inngest** serverless background workers for PDF invoice generation and asset optimization.

---

## Phase 5: Observable Event Bus & Email Notifications
- [ ] Build `ProjectSubject` publish-subscribe event pipeline (Observer pattern).
- [ ] Integrate **Resend API** with **React Email** templates (`@react-email/components`) for welcome & invoice receipts.
- [ ] Wire **Upstash QStash** event bus for asynchronous decoupled event handling.

---

## Phase 6: Multi-Layer Caching Architecture
- [ ] Setup L1 process LRU memory cache (5-second TTL).
- [ ] Configure **Upstash Redis** Cache-Aside layer for sub-5ms user session and project metadata lookups.
- [ ] Attach event-driven cache eviction hooks on database mutations.

---

## Phase 7: Test-Driven Development (TDD) & CI/CD Pipeline
- [ ] Write Unit Tests with **Vitest** (`*.spec.ts`).
- [ ] Write E2E API tests with **Playwright** (`*.e2e-spec.ts`).
- [ ] Setup **GitHub Actions** CI/CD pipeline for automated linting, type-checking (`npx tsc --noEmit`), Vitest suite execution, and Vercel deployment.
