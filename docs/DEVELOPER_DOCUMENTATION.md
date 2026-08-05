<!-- @format -->

# Developer Documentation — Kiosk

## Purpose

This document provides onboarding and technical guidance for engineers working on `kiosk`. It covers environment setup, routing, component guidelines, dependency rules, and deployment instructions.

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

## Key Dependencies

- **Next.js 16 (App Router)**: Framework powering client and server routes.
- **React 19**: UI library.
- **Framer Motion 11.18.2**: Component animations and React Bits `<Dock />` spring physics.
- **GSAP & `@gsap/react`**: Timeline motion and `PillButton` hover effects.
- **Tailwind CSS v4**: Utility styling framework.
- **Lucide React & Material Symbols**: Icon system.

> [!IMPORTANT]
> **Dependency Stability Notice**: Keep `framer-motion` pinned at `11.18.2` (or stable v11) to avoid Next.js Turbopack missing module errors (`../../../motion/utils/valid-prop.mjs`) found in v12 preview tarballs.

## Application Routes & Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with NavbarWrapper
│   ├── page.tsx                # Marketing landing page
│   ├── about/page.tsx          # About page
│   ├── pricing/page.tsx        # Pricing page
│   ├── services/page.tsx       # Services overview page
│   ├── contact/page.tsx        # Contact page
│   ├── get-started/page.tsx    # Sign In / Sign Up authentication page
│   ├── not-found.tsx           # Custom 404 Page Not Found
│   └── dashboard/
│       ├── layout.tsx          # Dashboard light theme container & Sidebar Dock
│       ├── page.tsx            # Main dashboard overview & dynamic greeting
│       ├── projects/
│       │   ├── page.tsx        # Projects list, search, and status filters
│       │   └── new/page.tsx    # Multi-step Start New Project wizard
│       ├── billing/page.tsx    # Subscription plans & billing history
│       └── settings/page.tsx   # Profile, security, and notification settings
└── components/
    ├── NavbarWrapper.tsx       # Route-aware wrapper to hide marketing nav on /dashboard
    ├── PillButton.tsx          # Flagship GSAP animated pill button component
    └── dashboard/
        ├── Dock.tsx            # React Bits dock component for bottom navigation
        ├── ProjectCard.tsx     # Light card component for projects
        └── Sidebar.tsx         # Sidebar container wrapping Dock
```

## Coding Conventions

- **TypeScript**: Strict mode enabled. Run `npx tsc --noEmit` to verify type safety.
- **Design System Rules**:
  - Light mode theme (`bg-[#f8fafc]`, `bg-white`, `border-gray-200/90`).
  - No background gradients (`bg-gradient-to-*` is prohibited).
  - Use `PillButton` component for primary call-to-actions.
  - Base typography font-size set to 18px (`1.125rem`).

## Navigation & Routing Best Practices

1. **Client Navigation**: Always use `next/link` or `router.push()` from `next/navigation`.
2. **Dashboard Isolation**: The marketing navbar (`StaggeredMenu`) is hidden on `/dashboard` routes via `NavbarWrapper.tsx`.
3. **Log Out Flow**: Log out in the dashboard profile dropdown triggers `router.push('/get-started')`.

## Scripts

- `npm run dev` — Start Next.js development server
- `npm run build` — Build production bundle
- `npm run start` — Serve production build
- `npx tsc --noEmit` — Type-check TypeScript codebase without emitting files

## Verification & QA

Before submitting changes:
1. Run `npx tsc --noEmit` and ensure **0 errors**.
2. Verify responsive layout across mobile, tablet, and desktop viewports.
