<!-- @format -->

# Developer Documentation — Kiosk

## Purpose

This document provides onboarding, architectural, and operational technical guidance for engineers working on `kiosk`. It covers environment setup, routing, multi-tenancy, the admin fulfillment backoffice, database schemas, dynamic live site rendering, and deployment instructions.

---

## Local Setup

1. Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd kiosk
npm install
```

2. Configure local environment variables in `.env.local`:

```env
NEXT_PUBLIC_APP_URL="https://kioosk.online"
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
AUTH_SECRET="your_secret_key"
ADMIN_EMAIL="kioskonline3@gmail.com"
NOTIFICATION_EMAIL="kioskonline3@gmail.com"
RESEND_API_KEY="re_..."
EMAIL_FROM="Kiosk <noreply@kioosk.online>"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
FLUTTERWAVE_PUBLIC_KEY="FLWPUBK-..."
FLUTTERWAVE_SECRET_KEY="FLWSECK-..."
```

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:3000 to view the application.

---

## Key Dependencies & Technologies

- **Next.js 16 (App Router)**: Edge middleware routing, dynamic multi-tenant subdomains, and server components.
- **React 19**: Modern component architecture.
- **Drizzle ORM & Neon PostgreSQL**: Persistence layer with connection pooling.
- **Auth.js v5 / NextAuth & Custom Sessions**: Dual-mode session handling and edge-level authentication guards.
- **Cloudinary Storage**: Multi-tenant media bucket with isolated folder paths (`kiosk/tenants/<tenantId>/...`).
- **Resend API**: Transactional email dispatch system.
- **Upstash Redis**: Rate limiting, caching, and payment idempotency.
- **Tailwind CSS v4 & Framer Motion**: Utility styling and interactive floating `<Dock />`.
- **Lucide React**: Vector icon system.

---

## Architecture & Application Routes

```
src/
├── app/
│   ├── layout.tsx              # Root marketing layout with NavbarWrapper
│   ├── globals.css             # Design tokens and font variables
│   ├── page.tsx                # Marketing landing page
│   ├── services/page.tsx       # Services directory
│   ├── get-started/page.tsx    # Sign In / Sign Up authentication page
│   │
│   ├── admin/                  # MASTER ADMIN OPERATIONS PORTAL (Auth Guarded)
│   │   ├── layout.tsx          # Admin layout with RBAC guard & floating AdminDock
│   │   ├── page.tsx            # Bento Grid Operations Dashboard (Live DB KPIs & Stream)
│   │   ├── projects/
│   │   │   ├── page.tsx        # Fulfillment Queue with search and status tabs
│   │   │   └── [id]/page.tsx   # Fulfillment & Launch Studio (Logo/Media/Offerings review + 1-click Publish)
│   │   ├── users/page.tsx      # User accounts directory & role management
│   │   └── billing/page.tsx    # Master subscription invoices & revenue ledger
│   │
│   ├── dashboard/              # CUSTOMER DASHBOARD
│   │   ├── layout.tsx          # Dashboard layout with floating Dock
│   │   ├── page.tsx            # Customer overview & status trackers
│   │   ├── content/page.tsx    # Streamlined Website Intake Form (Structured data submission)
│   │   ├── projects/page.tsx   # Customer projects list
│   │   ├── billing/page.tsx    # Customer subscription status
│   │   └── settings/page.tsx   # Profile & notifications
│   │
│   ├── tenants/[slug]/page.tsx # DYNAMIC MULTI-TENANT SUBDOMAIN RENDERER (e.g. brand.kioosk.online)
│   ├── domains/[domain]/page.tsx# DYNAMIC CUSTOM DOMAIN RENDERER (e.g. brand.com)
│   │
│   └── api/
│       ├── admin/              # Protected admin REST endpoints (/stats, /projects, /users, /billing)
│       ├── auth/               # Register, Login, Logout, Session handlers
│       ├── upload/route.ts     # Multi-tenant Cloudinary upload endpoint
│       └── projects/content/   # Customer intake submission endpoint with email alerts
│
├── components/
│   ├── admin/
│   │   └── AdminDock.tsx       # Floating Dock navigation for Admin Portal
│   ├── tenant/
│   │   └── TenantLiveSite.tsx  # Universal live website renderer for client sites
│   ├── dashboard/
│   │   ├── Dock.tsx            # Floating interactive dock navigation
│   │   └── ProjectCard.tsx     # Project status card
│   ├── Navbar.tsx              # Public header
│   └── PillButton.tsx          # Interactive animated pill button
│
└── lib/
    ├── auth/admin.ts           # RBAC validation & getAuthenticatedAdmin() helper
    ├── email.ts                # Resend transactional email notification templates
    └── storage/cloudinary.ts   # Cloudinary client & multi-tenant folder helpers
```

---

## Product Philosophy: "Done-For-You" Website Model

Kiosk is built around a **streamlined submission model** rather than a complex drag-and-drop builder:

1. **Client Submits Info**: The business owner fills in structured form fields (Brand Name, Tagline, Story, Logo, Theme Mode, Products/Services, Contact, WhatsApp).
2. **Operations Fulfillment**: The Kiosk team reviews submissions in the Admin Studio (`/admin/projects/[id]`), tests links, assigns domains, and clicks **Publish**.
3. **Dynamic Multi-Tenant Rendering**: Visiting `https://<slug>.kioosk.online` dynamically pulls the client's persisted data from PostgreSQL and renders a responsive, high-converting live website with 1-click WhatsApp checkout.

---

## Operations & Fulfillment Flow

1. **Submission Alert**: When a customer submits on `/dashboard/content`, an email alert is sent to `kioskonline3@gmail.com` and a confirmation receipt is sent to the client.
2. **Review in Admin Hub**: The submission appears live on `/admin/projects`.
3. **One-Click Launch**: In `/admin/projects/[id]`, setting status to `Live` (100%) and clicking **"Publish Website & Email Client Launch Notification"** triggers the client launch email and activates the live site.
