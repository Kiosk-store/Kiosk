<!-- @format -->

# Backend Implementation TODO & Roadmap — Kiosk

This TODO roadmap details the exact backend implementation plan for **Kiosk**, tailored to our **Next.js 16 (App Router), React 19, TypeScript, PostgreSQL, and Prisma** stack.

---

## 🚀 Phase 1: Authentication & Authorization Engine (CURRENT PRIORITY)

### 1. Database Schema & Prisma Setup
- [ ] Install Prisma ORM & PostgreSQL client (`npm install @prisma/client` & `npm install -D prisma`).
- [ ] Initialize Prisma (`npx prisma init`) and configure database connection string in `.env`.
- [ ] Define core Auth models in `prisma/schema.prisma`:
  - [ ] `User` (`id`, `name`, `email`, `passwordHash`, `avatarUrl`, `role`, `createdAt`, `updatedAt`).
  - [ ] `Account` (OAuth provider links for Google & GitHub).
  - [ ] `Session` & `RefreshToken` (Token rotation & revocation fields).
- [ ] Run initial migration (`npx prisma migrate dev --name init_auth`).

### 2. Password Hashing & Security Utilities
- [ ] Install `bcryptjs` / `argon2` and `@types/bcryptjs` for secure password hashing.
- [ ] Build utility functions for password hashing & verification (`hashPassword`, `verifyPassword`).
- [ ] Install `jose` / `jsonwebtoken` for RS256 JWT access token generation (15-min TTL) and refresh token management (7-day TTL).

### 3. Auth API Route Handlers (`src/app/api/auth/*`)
- [ ] **`POST /api/auth/register`**:
  - Validate email & password inputs using Zod.
  - Check for existing email registration.
  - Hash password and create `User` record in PostgreSQL.
  - Return authenticated user DTO + set HTTP-Only Refresh Cookie.
- [ ] **`POST /api/auth/login`**:
  - Lookup user by email.
  - Verify password hash match.
  - Issue 15-minute RS256 JWT access token and 7-day HTTP-Only `refreshToken` cookie.
- [ ] **`POST /api/auth/logout`**:
  - Invalidate refresh token in database/Redis.
  - Clear HTTP-Only authentication cookies (`refreshToken=; Max-Age=0`).
- [ ] **`POST /api/auth/refresh`**:
  - Validate refresh token signature & expiration.
  - Issue new access token (Token Rotation).
- [ ] **`GET /api/auth/me`**:
  - Read access token from `Authorization: Bearer <token>` header.
  - Return current authenticated user profile DTO.

### 4. OAuth 2.0 Social Authentication (Google)
- [ ] Configure Google Cloud Console OAuth 2.0 Client ID & Client Secret.
- [ ] Setup `src/app/api/auth/google/route.ts` authorization URL redirect and callback code handler.
- [ ] Upsert user record on successful Google OAuth callback.

### 5. Next.js Auth Middleware (`src/middleware.ts`)
- [ ] Create Next.js route protection middleware.
- [ ] Restrict access to `/dashboard/*` and `/checkout` for unauthenticated visitors (auto-redirect to `/get-started?tab=login`).

### 6. Frontend Auth Integration (`src/app/get-started/page.tsx` & Context)
- [ ] Create `AuthContext.tsx` provider with `useAuth()` custom hook (`user`, `login`, `signup`, `logout`, `isLoading`).
- [ ] Connect `handleSignupSubmit` on `/get-started` to `POST /api/auth/register`.
- [ ] Connect `handleLoginSubmit` on `/get-started` to `POST /api/auth/login`.
- [ ] Connect `handleSocialAuth` on `/get-started` to Google OAuth trigger.
- [ ] Wire dynamic profile header greetings and "Log Out" button on `/dashboard` to `logout()` context handler.

---

## Phase 2: Database Infrastructure & Connection Pool
- [ ] Setup PostgreSQL primary instance with read replicas.
- [ ] Configure **PgBouncer** connection pool (Max Pool Size: 100).
- [ ] Define Project, Subscription, and Invoice schemas in `prisma/schema.prisma`.

---

## Phase 3: Subscriptions & Payment Integration
- [ ] Build Stripe / Paystack webhook handlers (`src/app/api/webhooks/stripe/route.ts`).
- [ ] Sync subscription tiers (`$20/mo`, `$30/mo`, `$43/mo` or `$192/yr`, `$288/yr`, `$408/yr`).
- [ ] Build `Idempotency-Key` header middleware using Redis atomic locks (`SETNX`) to prevent double charging.

---

## Phase 4: Core Domain & Site Provisioning
- [ ] Build `SiteTemplateFactory` (Factory pattern) for dynamic site tier engines (`landing`, `funnel`, `store`).
- [ ] Automate subdomain allocation (`<client>.kiosk.site`).
- [ ] Setup worker threads for PDF invoice generation and asset optimization.

---

## Phase 5: Observable Event Bus & Email Notifications
- [ ] Build `ProjectSubject` publish-subscribe event engine (Observer pattern).
- [ ] Integrate Resend / SendGrid email dispatcher for welcome & invoice emails.

---

## Phase 6: Multi-Layer Caching & Redis Sentinel
- [ ] Setup L1 process LRU cache + L2 Redis Sentinel Cache-Aside layer.

---

## Phase 7: Test-Driven Development (TDD) & CI/CD Pipeline
- [ ] Write Unit Tests (`*.spec.ts`), Integration Tests (`*.test.ts`), and Supertest E2E API Contract Tests.
- [ ] Setup GitHub Actions CI/CD pipeline.
