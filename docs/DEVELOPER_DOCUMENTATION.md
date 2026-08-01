<!-- @format -->

# Developer documentation — Kiosk

## Purpose

This document provides onboarding and day-to-day guidance for engineers working on `kiosk`. It covers environment setup, coding conventions, component guidelines, testing, and deployment steps.

## Local setup

1. Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd kiosk
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open http://localhost:3000 to view the app.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — run ESLint

## Coding conventions

- TypeScript: prefer typed props for public components. Keep `any` to an absolute minimum.
- File names: use PascalCase for React components (`Hero.tsx`, `Navbar.tsx`) and kebab-case for utility files when appropriate.
- Exports: prefer default export for single-component files; named exports for utility modules.
- CSS: prefer utility classes; when a repeated pattern emerges, refactor into a small class or component.

## Component guidelines

- Keep components small and focused. If a component grows beyond ~200 lines, consider splitting it.
- Props: use a single interface for props and keep callback props well-named (e.g., `onSubmit`, `onClose`).
- Accessibility: buttons and links must include discernible text and `aria` attributes when required.

## State management

- Prefer local state and prop drilling for simple flows.
- Use `src/lib/lenis-store.ts` for global scroll instance sharing only — avoid creating multiple global stores unless necessary.

## Animations

- Use `gsap` for complex timeline animations and `lenis` for smooth scrolling. Keep heavy computation off the main render path and memoize expensive values where possible.

## Adding a new page or section

1. Create the component under `src/components`.
2. Add the section to `src/app/page.tsx` in the desired order.
3. Ensure responsive behavior and test on narrow viewports.

## Forms & integrations

- Prefer third-party form endpoints or serverless functions for lead capture. Sanitize and validate inputs server-side.

## Testing & linting

- ESLint is configured; run `npm run lint` before committing.
- Add unit tests for critical logic where it makes sense. For UI, prefer visual/manual checks and small Jest/React Testing Library tests for component behavior when applicable.

## CI / CD

- Use platform (Vercel) previews for pull requests and run linters as part of CI. Keep deploys atomic and use branch previews for QA.

## Release process

- For a marketing site, releases are normally gated by commits to `main` and validated by preview deploys. Tag releases as necessary.

## Onboarding checklist for new contributors

- Run the dev server and explore `src/components`.
- Read `docs/DESIGN_ARCHITECTURE.md` and `docs/SYSTEM_DESIGN.md`.
- Run `npm run lint` and ensure your editor uses the project's TypeScript version.

## Contacts and ownership

- Keep a short OWNERS file or GitHub CODEOWNERS if the project will have multiple maintainers. Document primary contacts for design and engineering in the repository root if needed.
