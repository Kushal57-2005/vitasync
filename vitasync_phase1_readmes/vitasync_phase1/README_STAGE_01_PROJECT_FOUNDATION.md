# Stage 1 — Project Foundation and Design System

## Objective

Create the maintainable VitaSync monorepo and establish the frontend, backend, shared contracts, development tooling, and visual design system. Do not implement business modules yet.

## Product decisions

- Android-first, multi-user application.
- React + Vite + TypeScript frontend, packaged for Android using Capacitor.
- shadcn/ui and Tailwind CSS for UI.
- React Icons for all icons.
- Node.js + Express + TypeScript backend.
- PostgreSQL + Prisma will be configured in Stage 2.
- Kotlin Capacitor plugin work for Health Connect is deferred to Stage 5.
- Light mode only in Phase 1.

## Architecture

Use a monorepo with this suggested structure:

```text
vitasync/
  apps/
    web/
      src/
        app/
        components/
        features/
        hooks/
        lib/
        pages/
        services/
        styles/
        types/
      public/
      capacitor.config.ts
    api/
      src/
        config/
        middleware/
        modules/
        routes/
        utils/
      tests/
  packages/
    shared/
      src/
        contracts/
        schemas/
        types/
  docs/
  .env.example
  package.json
  pnpm-workspace.yaml
  README.md
```

You may adjust the exact structure if there is a clear technical reason, but keep feature boundaries and shared API contracts explicit.

## Frontend requirements

1. Initialize React, Vite and TypeScript with strict mode.
2. Configure Tailwind CSS and shadcn/ui using the current compatible setup.
3. Configure Capacitor Android and document how to add/open the Android project.
4. Establish React Router or an equivalent routing solution.
5. Establish a query/cache strategy such as TanStack Query.
6. Establish form handling with React Hook Form and Zod.
7. Create a typed API client with a configurable base URL.
8. Create reusable page layout, sidebar/navigation where appropriate, mobile navigation, page header, cards, form fields, dialogs, tables and toast patterns.
9. Build a small design-token layer for spacing, typography, borders, radii and semantic colors.
10. Ensure layouts work at narrow Android widths and common desktop browser widths.

## Visual design rules — mandatory

- Light theme only. Do not add dark mode, dark theme CSS, or a theme toggle.
- Use a predominantly white or very light neutral canvas, subtle borders, restrained shadows and clear typography.
- Use a restrained accent color for primary actions; do not make the entire interface colorful.
- Use shadcn/ui components and customize them consistently rather than mixing unrelated component libraries.
- Use React Icons for icons. Do not use emoji characters, Unicode pictograms, or emoji as status decoration.
- No live badges, live indicators, pulsing dots, animated status badges, or real-time monitoring claims.
- Status text may appear as ordinary text where necessary, but do not decorate it with a badge.
- Avoid excessive gradients, glassmorphism, neon colors and oversized dashboard cards.
- Maintain accessible contrast, keyboard focus, labels, error text and touch target sizes.
- Prefer clear information hierarchy and compact, useful data presentation.

## Backend foundation

1. Initialize Express + TypeScript.
2. Add environment validation.
3. Add centralized error handling.
4. Add request logging with sensitive fields redacted.
5. Add request ID/correlation ID middleware.
6. Add `/api/v1/health` readiness endpoint.
7. Add CORS configuration from environment variables.
8. Add basic rate limiting and security headers.
9. Organize routes by feature module.
10. Add OpenAPI documentation scaffolding or a documented API contract approach.

## Engineering standards

- Use ESLint and Prettier.
- Use strict TypeScript settings.
- Avoid `any`; explain unavoidable exceptions.
- Keep secrets out of source control.
- Provide `.env.example` with placeholders only.
- Add scripts for dev, build, lint, typecheck and test.
- Add a root README with setup instructions.
- Pin or lock dependency versions through the chosen package manager.
- Do not create fake API responses that look like production data without clearly labeling them as mock fixtures.

## Deliverables

- Working monorepo.
- Frontend starts locally.
- Backend starts locally.
- Capacitor Android project can be generated/opened.
- Shared package resolves from both apps.
- Design-system primitives and one sample shell page.
- Environment example and setup documentation.
- Lint, typecheck and build scripts.

## Acceptance criteria

- A new developer can clone the repo, install dependencies and start frontend/backend by following the README.
- Frontend builds with strict TypeScript.
- Backend health endpoint responds successfully.
- Android Capacitor project is initialized and build prerequisites are documented.
- UI visibly follows the light-only design rules.
- No dark mode, emoji icons, or live-status badges exist.
- No business logic from later stages is prematurely implemented.

## In-depth AI coding prompt

> You are the lead full-stack engineer establishing the foundation for VitaSync, a multi-user Android-first nutrition and fitness tracking product. Inspect the current repository before making changes. If it is empty, initialize a pnpm monorepo with a React + Vite + TypeScript frontend in `apps/web`, an Express + TypeScript API in `apps/api`, and a shared TypeScript package in `packages/shared`. Package the frontend for Android with Capacitor. Configure Tailwind CSS and shadcn/ui, and use React Icons exclusively for icons.
>
> Follow a light-mode-only design system. Do not create dark theme variables, a theme toggle, emoji icons, live badges, pulsing status dots, or real-time status decoration. Build a polished responsive application shell with accessible navigation, page title area, content container, buttons, cards, inputs, dialogs, tables and toast conventions. Use restrained colors, subtle borders, clean typography and mobile-friendly spacing.
>
> On the API side, create a modular Express application with environment validation, security headers, CORS allowlisting, request IDs, redacted request logging, centralized errors, rate limiting and `/api/v1/health`. Add strict TypeScript, ESLint, Prettier, test and build scripts. Provide `.env.example` without real secrets and detailed local setup documentation.
>
> Do not implement authentication, food tracking, calorie calculations, Health Connect, or FitTrack integration in this stage. Do not invent external API contracts. Run installation, lint, typecheck, tests and builds where possible. Report exact commands and actual outcomes, list files created, and disclose anything that could not be tested. Never claim success without command output.

## Out of scope

Authentication, Prisma models, food APIs, calorie formulas, Health Connect permissions, FitTrack API implementation, analytics and production deployment.
