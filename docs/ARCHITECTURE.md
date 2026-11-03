# VitaSync Architecture — Stage 1 Foundation

## Overview

VitaSync is an Android-first, multi-user nutrition and fitness tracking application designed to integrate food logging, activity tracking (Health Connect / Samsung Health), and body composition analytics (FitTrack).

## Monorepo Layout

VitaSync is structured as a `pnpm` monorepo:

- **`apps/web`**: React 18 + Vite + TypeScript frontend. Styled with Tailwind CSS and custom shadcn/ui primitives following a strict light-mode design system. Packaged for Android using Capacitor.
- **`apps/api`**: Express + TypeScript backend. Provides structured logging, correlation IDs, centralized error handling, environment validation via Zod, and security middleware (Helmet, CORS, rate limiting).
- **`packages/shared`**: Reusable TypeScript contracts, Zod schemas, and standard API response envelope types (`ApiResponse<T>`, `ApiErrorResponse`, `ApiHealthResponse`).
- **`docs/`**: Architecture diagrams, setup instructions, and API contract specifications.

## Key Design Principles

1. **Light Mode First and Only**: No dark mode variables, theme toggles, or inverted styles in Phase 1.
2. **React Icons Exclusively**: No emojis, Unicode glyphs, or decorative pictograms used as icons.
3. **No Live Status Badges**: States and statuses are rendered as plain semantic text (`StatusText`).
4. **Tenant Security**: All data endpoints will enforce server-side user scoping (established in Stage 2).
5. **Idempotency & UTC**: All server timestamps are UTC. Idempotent synchronization for external records.
