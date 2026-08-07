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
- [x] Install Drizzle ORM & PostgreSQL client (`drizzle-orm`, `postgres`, `drizzle-kit`).
- [x] Define core database schema in `src/db/schema.ts`:
  - [x] `users` (`id`, `name`, `email`, `passwordHash`, `image`, `role`, `createdAt`, `updatedAt`).
  - [x] `accounts` (`userId`, `type`, `provider`, `providerAccountId`, `refresh_token`, `access_token`).
  - [x] `sessions` (`sessionToken`, `userId`, `expires`).
  - [x] `verificationTokens` (`identifier`, `token`, `expires`).
- [x] Push migration schema to Neon PostgreSQL (`npm run db:push`).

### 2. Rate Limiting Middleware (`src/lib/ratelimit.ts`)
- [x] Initialize Upstash Redis Sliding Window Rate Limiter (`src/lib/ratelimit.ts`).
- [x] Configure Auth Rate Limiter (5 requests / 1 min on `/api/auth/*` routes).
- [x] Configure API Rate Limiter (100 requests / 1 min on general API routes).
- [x] Add `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` HTTP headers and return `429 Too Many Requests` on breach.

### 3. Security & Password Hashing
- [x] Install `bcryptjs` for secure password hashing.
- [x] Create security module (`src/lib/auth/password.ts`) with Zod schema validation.
- [x] Configure HTTP-Only session cookie security (`SameSite=Lax`, `Secure` in production, dual-token flush on logout).
- [x] Conduct code security & vulnerability audit (`security_audit_report.md`).

### 4. Auth & User Profile API Route Handlers (`src/app/api/auth/*` & `src/app/api/user/*`)
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
  - Destroy active database session in Neon PostgreSQL.
  - Invalidate and clear all `kiosk_session` and NextAuth session cookies.
- [x] **`GET /api/auth/me`**:
  - Return current authenticated session profile DTO (supporting custom session and Auth.js Google OAuth).
- [x] **`PATCH /api/user/profile`**:
  - Update user profile details (`name`) in Neon PostgreSQL with Zod validation and live `useAuth()` sync.

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
- [x] Integrate **Flutterwave REST API v3 Gateway** (`src/lib/flutterwave.ts`).
- [x] **Strict Payment Idempotency Engine (`Idempotency-Key`)**:
  - [x] Implement Upstash Redis atomic lock (`SETNX @kiosk/idempotency:<key> LOCKED EX 300`) in `POST /api/payments/initialize` to block concurrent double charges.
  - [x] Support multi-currency checkout (`USD`, `NGN`, `GHS`, `KES`) mapped to active plans ($20/mo, $30/mo, $43/mo).
- [x] **Webhook Security & Deduplication (`POST /api/webhooks/flutterwave`)**:
  - [x] Secret hash verification via `verif-hash` header.
  - [x] Event deduplication in Upstash Redis (`@kiosk/webhook:flw:<id>`).
  - [x] Transaction verification with Flutterwave API and Neon PostgreSQL tenant plan upgrade.

---

## Phase 4: Domain & Site Provisioning Engine
- [x] Build `SiteTemplateFactory` (Factory pattern) & multi-tenant projects API (`GET/POST /api/projects`) in `src/app/api/projects/route.ts`.
- [x] Build Site Provisioning & Template Selection page (`src/app/dashboard/projects/new/page.tsx`).
- [x] Automate wildcard subdomain (`<client>.kiosk.site`) & custom domain edge routing engine in `src/middleware.ts`.
- [ ] Setup **Inngest** serverless background workers for PDF invoice generation and asset optimization.

---

## Phase 5: Observable Event Bus & Email Notifications
- [x] Build `ProjectSubject` publish-subscribe event pipeline (Observer pattern) in `src/lib/events/ProjectSubject.ts`.
- [x] Integrate **Resend API** transactional email system with responsive HTML templates in `src/lib/email.ts`.
- [ ] Wire **Upstash QStash** event bus for asynchronous decoupled event handling.

---

## Phase 6: Multi-Layer Caching Architecture
- [x] Setup L1 process LRU memory cache & L2 Upstash Redis Cache-Aside layer (`src/lib/cache/CacheService.ts`).
- [x] Attach event-driven cache eviction hooks on database mutations in `/api/projects`.

---

## Phase 7: Test-Driven Development (TDD) & CI/CD Pipeline
- [ ] Write Unit Tests with **Vitest** (`*.spec.ts`).
- [ ] Write E2E API tests with **Playwright** (`*.e2e-spec.ts`).
- [ ] Setup **GitHub Actions** CI/CD pipeline for automated linting, type-checking (`npx tsc --noEmit`), Vitest suite execution, and Vercel deployment.
