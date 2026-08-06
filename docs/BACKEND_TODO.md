<!-- @format -->

# Scalable Backend Architecture TODO & Technical Roadmap — Kiosk

This TODO roadmap defines the enterprise-scalable backend architecture for **Kiosk**, specifically tailored to our **Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4** tech stack.

---

## Scalable Stack Architecture Overview

| Layer | Enterprise Scalable Technology Stack |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router Route Handlers & Server Actions) |
| **Load Balancing** | Layer 4 (AWS NLB / Cloudflare) + Layer 7 Application Load Balancer |
| **Rate Limiting** | `@upstash/ratelimit` + Upstash Redis Sliding Window Algorithm |
| **Authentication** | Auth.js v5 (NextAuth) + Zod + Upstash Redis Session Cache |
| **Session Protection**| Automatic Token Refresh & Checkout State Persistence (Zero Logout During Payment) |
| **Double-Charge Protection**| Upstash Redis Atomic Locks (`SETNX`) + Webhook Event Deduplication |
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

## Phase 1: Authentication & Authorization Engine (STARTING PRIORITY)

### 1. Stack Dependencies & Database Schema
- [x] Install core Auth dependencies (`next-auth@beta`, `@auth/drizzle-adapter`, `@auth/prisma-adapter`, `zod`).
- [x] Install Rate Limiting dependencies (`@upstash/ratelimit`, `@upstash/redis`).
- [x] Install Drizzle ORM & PostgreSQL client (`drizzle-orm`, `postgres`).
- [x] Define core database schema in `src/db/schema.ts`:
  - [x] `users` (`id`, `name`, `email`, `passwordHash`, `image`, `role`, `createdAt`, `updatedAt`).
  - [x] `accounts` (`userId`, `type`, `provider`, `providerAccountId`, `refresh_token`, `access_token`).
  - [x] `sessions` (`sessionToken`, `userId`, `expires`).
  - [x] `verificationTokens` (`identifier`, `token`, `expires`).
- [ ] Run migration pipeline (`npx drizzle-kit generate` & `npx drizzle-kit migrate`).

### 2. Rate Limiting Middleware (`src/lib/ratelimit.ts`)
- [x] Initialize Upstash Redis Sliding Window Rate Limiter (`src/lib/ratelimit.ts`).
- [x] Configure Auth Rate Limiter (5 requests / 1 min on `/api/auth/*` routes).
- [x] Configure API Rate Limiter (100 requests / 1 min on general API routes).
- [x] Add `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` HTTP headers and return `429 Too Many Requests` on breach.

### 3. Security & Password Hashing
- [x] Install `bcryptjs` for secure password hashing.
- [x] Create security module (`src/lib/auth/password.ts`) with Zod schema validation.
- [ ] Configure JWT access token issuance (RS256) and HTTP-Only cookie security (`SameSite=Strict`, `Secure`).

### 4. Auth API Route Handlers (`src/app/api/auth/*`)
- [x] **`POST /api/auth/register`**:
  - Apply Rate Limiter middleware (`authRatelimit`).
  - Validate email & password with Zod schema.
  - Check database for duplicate email.
  - Hash password and insert user record into PostgreSQL.
  - Issue session DTO & set secure auth cookie.
- [x] **`POST /api/auth/login`**:
  - Apply Rate Limiter middleware (`authRatelimit`).
  - Lookup user record & verify bcrypt password hash.
  - Issue session token & HTTP-Only refresh cookie.
- [x] **`POST /api/auth/logout`**:
  - Invalidate token in Upstash Redis token revocation blacklist.
  - Clear HTTP-Only session cookies.
- [x] **`GET /api/auth/me`**:
  - Return current authenticated session profile DTO.

### 5. Checkout Session Protection (Zero Logout During Payment)
- [ ] **Background Token Auto-Refresh**: Configure NextAuth silent token refresh on `/checkout` entry so JWT access tokens never expire mid-payment.
- [ ] **Pre-Payment Auth Lock**: Validate active user session *before* submitting payment payload to Stripe/Paystack.
- [ ] **Form State Persistence**: Store transient checkout form state in encrypted `sessionStorage` so if a user opens a 3D Secure bank verification tab, their checkout form remains fully populated upon return.
- [ ] **Grace Period Cookie Handling**: Set a 1-hour session extension window while a user is actively on `/checkout`.

### 6. OAuth 2.0 Google & GitHub Providers
- [x] Configure Google & GitHub OAuth client keys template in `.env` & `.env.example`.
- [x] Mount Auth.js v5 route handler (`src/auth.ts` & `src/app/api/auth/[...nextauth]/route.ts`).
- [x] Attach Google OAuth trigger to the "Continue with Google" button on `src/app/get-started/page.tsx`.

### 7. Next.js Edge Protection & Rate Limiting Middleware (`src/middleware.ts`)
- [x] Implement Next.js edge middleware to guard `/dashboard/*` and `/checkout` routes.
- [x] Attach rate limit checks to incoming API requests at the edge.
- [x] Redirect unauthenticated visitors to `/get-started?tab=login`.

### 8. Frontend Auth State Integration (`src/app/get-started/page.tsx`)
- [x] Build `AuthContext.tsx` provider with `useAuth()` custom hook (`user`, `login`, `signup`, `logout`, `isLoading`).
- [x] Wire `handleSignupSubmit`, `handleLoginSubmit`, and `handleGoogleAuth` on `/get-started` to real API endpoints.
- [x] Handle `429 Too Many Requests` error responses gracefully on the UI with error alerts.
- [x] Connect dashboard profile header greetings and "Log Out" button to `logout()` context handler.

---

## Phase 2: Load Balancing & Infrastructure Architecture
- [ ] Configure **Layer 4 Load Balancer** (Cloudflare Anycast / AWS NLB) for TCP packet routing & DDoS protection.
- [ ] Configure **Layer 7 Load Balancer** (AWS ALB / NGINX / Vercel Edge Router) with Weighted Round-Robin algorithm.
- [x] Configure health check endpoint (`GET /api/healthz`) returning HTTP `200 OK` with DB & Redis latency metrics.
- [x] Configure **Neon PostgreSQL** serverless driver & PgBouncer connection pool (`prepare: false`) in `src/db/index.ts`.
- [x] Write schema models for `tenants`, `projects`, `subscriptions`, and `idempotency_keys` in `src/db/schema.ts`.

---

## Phase 3: Subscriptions & Payment Double-Charge Protection
- [ ] Integrate **Stripe Billing API** & **Paystack** webhooks (`src/app/api/webhooks/stripe/route.ts`).
- [ ] **Strict Payment Idempotency Engine (`Idempotency-Key`)**:
  - [ ] Generate unique client-side `Idempotency-Key` (v4 UUID) when `/checkout` mounts.
  - [ ] Implement Upstash Redis atomic lock (`SETNX idempotency:<key> PENDING EX 300`) to block concurrent duplicate requests.
  - [ ] Instantly return cached `200 OK` response payload if a duplicate request with the same `Idempotency-Key` arrives.
- [ ] **UI Submit Button Lockout**: Disable payment button immediately on first click (`isProcessing = true`) and display loading spinner to prevent double-clicking.
- [ ] **Webhook Deduplication**: Log processed Stripe/Paystack `event_id` in Redis/PostgreSQL to prevent duplicate processing on gateway webhook retries.
- [ ] Map active plans: `$20/mo` ($192/yr), `$30/mo` ($288/yr), `$43/mo` ($408/yr).

---

## Phase 4: Domain & Site Provisioning Engine
- [x] Build `SiteTemplateFactory` (Factory pattern) & multi-tenant projects API (`GET/POST /api/projects`) in `src/app/api/projects/route.ts`.
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
