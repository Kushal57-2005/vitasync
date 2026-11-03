# VitaSync — Phase 1 Development Pack

**Product:** VitaSync  
**Tagline:** Your nutrition. Your activity. Your progress.  
**Purpose:** A multi-user Android-first nutrition and fitness tracking application that combines food intake, activity data from Health Connect/Samsung Health, and body-composition data from FitTrack.

## Product and design decisions

- Android-first application, distributed as an Android app through Capacitor.
- Frontend: React + Vite + TypeScript.
- UI: shadcn/ui + Tailwind CSS.
- Icons: React Icons only. Do not use emoji characters or decorative Unicode symbols as icons.
- Visual direction: light-mode-first, clean, calm, modern, accessible.
- Do not implement a dark theme or dark-mode toggle in Phase 1.
- Do not use live-status badges, pulsing indicators, animated status dots, or badges that imply real-time monitoring.
- Backend: Node.js + Express + TypeScript.
- Database: PostgreSQL + Prisma.
- Authentication: secure multi-user authentication with short-lived access tokens and rotating refresh tokens.
- Android native integration: Capacitor Android plugin written in Kotlin for Health Connect.
- Food data: Open Food Facts API, a curated Indian-food dataset, and user-verified custom foods.
- FitTrack integration: authenticated REST API and signed webhooks, after confirming FitTrack's actual API contract.

## Important engineering constraints

1. Do not invent FitTrack endpoints, payloads, credentials, or database schemas. Inspect the existing FitTrack project and agree on a versioned integration contract.
2. Do not assume Open Food Facts data is complete or verified. Store source, retrieval time, verification state, and nutrition basis.
3. Do not fabricate missing nutrition values. Display missing values as unavailable.
4. Keep calorie intake, resting energy, activity energy, and estimated total daily energy expenditure distinct. Prevent double-counting.
5. Health Connect permissions and available record types vary by Android version, device, source app, and user consent. Handle unavailable permissions and missing data gracefully.
6. All user-owned data must be tenant-scoped and authorized on the server. Never trust a client-supplied user ID.
7. Store timestamps in UTC and calculate daily summaries using each user's configured timezone.
8. Use decimal-safe numeric handling for nutrition and measurements. Define units explicitly.
9. Make imports idempotent and preserve provenance for external records.
10. Do not add AI food recognition, AI diet recommendations, meal planning, or predictive analytics in Phase 1.

## How to use this pack

Complete the stages in order. Give the relevant stage README to your coding assistant or development team. Ask it to inspect the existing repository before editing files, produce a plan, implement the stage, run tests, and report actual results. Do not allow it to claim tests passed unless it ran them.

## Eight stages

1. `README_STAGE_01_PROJECT_FOUNDATION.md` — repository, frontend, backend, tooling, design system.
2. `README_STAGE_02_AUTH_DATABASE.md` — multi-user authentication, Prisma schema, migrations, authorization.
3. `README_STAGE_03_NUTRITION_FOOD.md` — food catalogue, Indian foods, barcode lookup, food logs and macros.
4. `README_STAGE_04_CALORIE_ENGINE.md` — BMR, TDEE, targets, energy balance and calculation tests.
5. `README_STAGE_05_HEALTH_CONNECT.md` — Android Health Connect bridge and Samsung Health data synchronization.
6. `README_STAGE_06_FITTRACK_INTEGRATION.md` — FitTrack REST API, signed webhooks and body composition history.
7. `README_STAGE_07_DASHBOARD_ANALYTICS.md` — dashboard, history, charts, loading/empty/error states.
8. `README_STAGE_08_QA_DEPLOYMENT.md` — security, end-to-end testing, deployment, observability and release readiness.

## Definition of Phase 1 complete

A registered user can securely manage their profile; search and log food; scan packaged-food barcodes; see calories and macros calculated from known nutrition data; connect Health Connect and import supported activity records; connect their FitTrack account and synchronize validated body measurements; and view daily, weekly and monthly summaries without exposing another user's data.
