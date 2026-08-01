<!-- @format -->

Kiosk — marketing & portfolio site built with Next.js

## Overview

`kiosk` is a marketing and portfolio site built with Next.js and React. The project focuses on high-quality visuals, smooth interactions, and a modular component-driven structure. It uses Tailwind-inspired utility classes and a small set of design system conventions located in `src/components` and `src/lib`.

## About Kiosk

**Kiosk makes it simple for small businesses to get online.**

Most small business owners don’t need a complicated website. They just need a clean place to show what they offer, share their contact details, and start selling — without spending weeks learning tools or paying high monthly fees.

That’s why we built Kiosk.

With Kiosk, you can choose the package that fits your business:

- **Landing Page** — A simple, professional page with your business info, photos, WhatsApp button, and contact details.
- **Online Store** — A full e-commerce store where customers can browse products and pay online.

Everything is hosted for you. No technical setup. No complicated builders. Just fill in your details and go live.

We’re building Kiosk for the everyday business owner — the ones who are too busy running their business to become website experts.

**Simple. Affordable. Built for small businesses.**

---

### Shorter version (for a homepage About section)

**About Kiosk**
Kiosk helps small businesses get online without the stress.
Choose a simple landing page or a full online store — we handle the rest.
No complicated tools. No steep learning curve. Just a clean online home for your business.

## Quick links

- Design & architecture: [docs/DESIGN_ARCHITECTURE.md](docs/DESIGN_ARCHITECTURE.md)
- System design: [docs/SYSTEM_DESIGN.md](docs/SYSTEM_DESIGN.md)
- Developer documentation: [docs/DEVELOPER_DOCUMENTATION.md](docs/DEVELOPER_DOCUMENTATION.md)

## Getting started (development)

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 to preview locally. The main entry is `src/app/page.tsx` which composes the top-level sections (Navbar, Hero, Pricing, CTA, etc.).

## Available scripts

- `npm run dev` — start Next.js in development mode
- `npm run build` — production build
- `npm run start` — start the production server after build
- `npm run lint` — run ESLint

## Tech stack & notable dependencies

- Framework: Next.js (app router)
- UI: React 19 and component-driven layout in `src/components`
- Styling: Tailwind-ish utilities (Tailwind CSS v4 + utilities/plugins)
- Motion & scroll: `gsap` and `lenis` for smooth scroll and animations
- Icons: `lucide-react`
- Other: `clsx`, `class-variance-authority`, `shadcn` bits

## Repository layout (high level)

- `src/app` — Next.js app entry, global styles, and route-level files
- `src/components` — UI components used to compose the homepage and other views
- `src/lib` — small utilities and stores (for example: `lenis-store.ts`)
- `public` — static assets and fonts

## Design & docs

Detailed design architecture, system design, and developer documentation have been added under `docs/`. These files explain the component model, data flow, deployment recommendations, accessibility guidelines, and developer conventions to help the team onboard quickly.

## Deployment

This app is well suited for Vercel (recommended). For production builds, run `npm run build` then `npm run start` (or deploy via the Vercel platform for automatic builds and CDN delivery).

## Contributing

- Follow the component and styling conventions in `docs/DEVELOPER_DOCUMENTATION.md` when adding or updating UI.
- Run `npm run lint` to check code quality before committing.

## Where to go next

- Review the design architecture: [docs/DESIGN_ARCHITECTURE.md](docs/DESIGN_ARCHITECTURE.md)
- Review the system design: [docs/SYSTEM_DESIGN.md](docs/SYSTEM_DESIGN.md)
- Read developer setup and coding guidelines: [docs/DEVELOPER_DOCUMENTATION.md](docs/DEVELOPER_DOCUMENTATION.md)
