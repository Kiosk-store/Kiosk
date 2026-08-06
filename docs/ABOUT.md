<!-- @format -->

# About Kiosk

Kiosk is a multi-tenant SaaS platform that makes it simple for small businesses to get online, without making them do the technical work.

**Vision:** A world where every small business, regardless of technical skill, budget, or time, has a professional online presence within days of deciding they need one.

**Mission:** Remove the technical barrier between small business owners and a great website by personalizing proven, pre-built pages for them — combining the speed and affordability of templated tools with the polish and hands-on support of a dedicated team.

Most small business owners don't have the time, design skill, or desire to learn a website builder — and they shouldn't have to. Kiosk exists to remove that barrier entirely: you tell us about your business, and our team personalizes a proven, professionally designed page for you.

## Multi-Tenant Platform Model

Kiosk is engineered from the ground up as a multi-tenant platform:
- **Tenant Isolation**: Every client business operates within an isolated tenant workspace (`tenants` table) with dedicated project spaces, custom domains, and subdomains (e.g. `business.kiosk.site` or `customdomain.com`).
- **Subdomain Routing**: Next.js Edge Middleware dynamically routes incoming requests to the client's tenant environment.
- **Pooled PostgreSQL Database**: Row-level tenant isolation using strict `tenant_id` foreign key scoping across all projects, billing subscriptions, and asset records.

With Kiosk, clients choose the subscription package that fits their business:
- **Landing Page ($20/mo, $192/yr)** — A single, high-converting custom page perfect for a first professional presence. Delivered in 3-5 days.
- **Sales Funnel ($30/mo, $288/yr)** — Up to 5 custom conversion pages with lead capture and CRM integration for driving traffic. Delivered in 5-7 days.
- **E-commerce Store ($43/mo, $408/yr)** — A full product catalog, cart, checkout, and payment gateways for selling online. Delivered in 7-10 days.

Everything is hosted, isolated, and managed for you. No technical setup. No complicated builders. 

## Client Portal & Multi-Tenant Dashboard

Logged-in clients access a sleek, professional light-mode dashboard (`/dashboard`) featuring:
- **Project Tracking & Management (`/dashboard/projects`)**: Filter, search, and monitor real-time project progress for their specific tenant workspace.
- **Start New Project Wizard (`/dashboard/projects/new`)**: Interactive 4-step wizard to order and configure new custom site builds.
- **Billing & Subscription (`/dashboard/billing`)**: Plan status, monthly/yearly billing cycle toggles (-20% discount), and invoice history.
- **Account Settings (`/dashboard/settings`)**: Profile info management, password security, 2FA toggles, and notification preferences.

## Short Version (Homepage)

Kiosk is a multi-tenant platform that helps small businesses get online without the stress. Choose a package, tell us about your business, and our team will build and personalize a proven template for you on your own custom subdomain or domain. No complicated tools. No steep learning curve. Just a professional digital presence launched in days.
