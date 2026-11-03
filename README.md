# VitaSync

**Your nutrition. Your activity. Your progress.**

VitaSync is an Android-first, multi-user nutrition and fitness tracking application that combines food intake, activity data from Health Connect / Samsung Health, and body-composition records from FitTrack.

---

## Architecture Overview

```text
vitasync/
├── apps/
│   ├── api/             # Express + TypeScript backend
│   │   ├── src/config/  # Zod environment validation & app constants
│   │   ├── src/middleware/ # Request ID, redaction logging, security, error handling
│   │   ├── src/modules/ # Feature-based modules (health, docs)
│   │   └── tests/       # Vitest + Supertest integration tests
│   └── web/             # React 18 + Vite + TypeScript frontend
│       ├── src/app/     # Router & TanStack Query configuration
│       ├── src/components/ # shadcn/ui light-mode primitives & app shell
│       ├── src/pages/   # Foundation shell and feature placeholders
│       ├── src/services/# Typed API client
│       └── capacitor.config.ts # Capacitor Android configuration
├── packages/
│   └── shared/          # Shared types, Zod schemas, endpoints, and envelopes
├── docs/                # Architecture diagrams and API contract specs
├── .env.example         # Environment template
├── pnpm-workspace.yaml  # Monorepo workspace configuration
└── package.json         # Workspace root scripts
```

---

## Core Product & Design Rules

- **Android-First**: Packaged for Android using Capacitor (`com.vitasync.app`).
- **Light Theme Only**: Designed with a crisp, high-contrast, light-only canvas. No dark mode CSS, variables, or theme toggles.
- **React Icons Exclusively**: Emojis, Unicode pictograms, and decorative emoji status icons are prohibited.
- **No Live Status Badges**: States are displayed as plain semantic text (`StatusText`) without deceptive pulsing dots or "live" badge indicators.
- **Strict Tenant Safety**: Server-enforced authorization and tenant scoping on all user-owned data.
- **Decimal-Safe Numeric Handling**: Explicit units and precise macro/measurement representations.

---

## Getting Started

### Prerequisites

- **Node.js**: v20.0.0 or higher
- **pnpm**: v9.0.0 or higher (`corepack enable && corepack use pnpm@11.13.1` or `npm install -g pnpm`)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy the `.env.example` file to create your local `.env`:

```bash
cp .env.example .env
```

### 3. Build Packages

Build the shared package first:

```bash
pnpm --filter @vitasync/shared build
```

---

## Development Scripts

Run both API and Frontend in parallel:

```bash
pnpm dev
```

Or run services individually:

```bash
# Run Express API (http://localhost:4000)
pnpm dev:api

# Run Vite Frontend (http://localhost:5173)
pnpm dev:web
```

---

## Testing, Linting & Typechecking

```bash
# Run unit & integration tests across workspaces
pnpm test

# Verify TypeScript types strictly across all workspaces
pnpm typecheck

# Verify linting across workspaces
pnpm lint

# Build all applications and packages for production
pnpm build
```

---

## Android Packaging via Capacitor

1. Build the web distribution:
   ```bash
   pnpm --filter @vitasync/web build
   ```
2. Initialize Android platform (one-time):
   ```bash
   cd apps/web && npx cap add android
   ```
3. Sync web assets:
   ```bash
   pnpm --filter @vitasync/web cap:sync
   ```
4. Open project in Android Studio:
   ```bash
   pnpm --filter @vitasync/web cap:open:android
   ```
   For full instructions and Android SDK prerequisites, see [apps/web/CAPACITOR.md](apps/web/CAPACITOR.md).

---

## Development Roadmap (Phase 1)

1. [x] **Stage 1 — Project Foundation & Design System**
2. [ ] **Stage 2 — Multi-User Authentication & Database Schema** (Prisma + PostgreSQL)
3. [ ] **Stage 3 — Nutrition, Food Database & Logging** (Open Food Facts + Curated Indian Foods)
4. [ ] **Stage 4 — Calorie Engine & Targets** (BMR, TDEE, Energy Balance)
5. [ ] **Stage 5 — Android Health Connect Bridge** (Kotlin Capacitor Plugin + Samsung Health)
6. [ ] **Stage 6 — FitTrack Integration** (REST API Client + Signed Webhooks)
7. [ ] **Stage 7 — Dashboard & Analytics** (Visual Trends & History)
8. [ ] **Stage 8 — QA, Security Hardening & Release Readiness**
