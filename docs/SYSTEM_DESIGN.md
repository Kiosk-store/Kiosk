<!-- @format -->

# System design — Kiosk

## Overview

`kiosk` is primarily a static marketing site composed of modular components. The system design below describes runtime behavior, rendering strategy, integrations, and operational guidance for deployment and scaling.

## High-level architecture

- Client: Modern browsers running a React/Next.js app. Interactions and animations are handled client-side using `gsap` and `lenis`.
- Server: Next.js build produces static and server-rendered assets. Static pages are served from a CDN when deployed.
- Integrations: analytics, contact forms (serverless or third-party), CMS (optional), and monitoring.

## Rendering strategy

- Use static rendering (SSG) for marketing content where possible to maximize performance and cacheability.
- For any dynamic features (contact forms, lead capture), use API routes or third-party services (Formspree, Netlify Forms, or a serverless function).

## Data flow and component interactions

- Top-level composition: `src/app/page.tsx` imports sections (Navbar, Hero, Pricing, CTA, Footer).
- Each section is self-contained and receives either static content props or fetches (if integrated with a CMS).
- Global utilities: `src/lib/lenis-store.ts` exposes the Lenis scroll instance (if needed) so components can subscribe to scroll events.

## Integration points

- Analytics: instrument page views and key CTA clicks with an analytics provider (GA4, Plausible, or Segment).
- Forms: prefer a dedicated serverless endpoint or third-party provider to avoid hosting complexity.
- Images & assets: host on CDN (Vercel or external) and use Next.js image optimization where applicable.

## Performance and caching

- Serve static pages from CDN with long TTLs and use cache invalidation during deploys.
- Minimize JavaScript bundle by code-splitting large animation logic and only mounting expensive motion code on visible sections.

## Security

- Sanitize any user-submitted data (forms) and validate serverless endpoints.
- Follow standard headers (CSP, HSTS) via platform configuration.

## Observability & monitoring

- Add basic uptime and error monitoring (Sentry or similar) and capture client-side exceptions.
- Track performance metrics (RUM) focusing on Largest Contentful Paint (LCP) and Time to Interactive (TTI).

## Deployment recommendations

- Preferred: Vercel — automatic builds, deployment previews, and static asset CDN.
- Alternative: Netlify or any static host + edge CDN.

## Scalability considerations

- The site is low-compute; scale is handled by the CDN. For dynamic endpoints (form handlers), ensure serverless concurrency limits are considered.

## Evolution notes

- If the product grows to include user accounts or CMS-driven pages, introduce a lightweight backend (serverless or managed) and a content model for pages.
