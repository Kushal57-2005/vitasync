# Stage 7 — Dashboard, History and Analytics

## Objective

Build the user-facing dashboard that combines nutrition, energy estimates, activity and FitTrack body measurements. The dashboard must be understandable, source-aware and honest about uncertainty.

## Dashboard information architecture

Primary navigation:

- Overview
- Nutrition
- Activity
- Body
- History
- Settings

Use a mobile-first layout suitable for Android. Avoid overloading the first screen.

## Overview screen

Display:

1. Date selector and timezone-aware day.
2. Calories consumed.
3. Daily calorie target.
4. Estimated TDEE and estimated energy balance, with clear labels.
5. Protein, carbohydrates and fat consumed versus user targets.
6. Meal summary.
7. Steps and supported activity summary.
8. Most recent weight/body-composition measurement with measurement date.
9. Data freshness and source information in ordinary text.

Do not use live badges or animated live indicators. Do not imply data is real-time. Show the last imported/synchronized timestamp.

## Nutrition screen

- Meals grouped by breakfast, lunch, dinner and snacks.
- Add food action.
- Search and barcode actions.
- Per-food quantity and macro values.
- Daily macro totals.
- Edit/delete food logs.
- Distinguish unavailable nutrition fields from zero.
- Explain when product data is community sourced or unverified.

## Activity screen

- Steps by day.
- Exercise sessions and duration.
- Available active/resting/total energy values with explicit semantics.
- Source and sync timestamp.
- No invented activity when Health Connect data is absent.
- Avoid treating activity calories as total daily expenditure.

## Body screen

- Weight history.
- BMI history.
- Body-fat percentage history.
- Muscle mass history when supplied.
- BMR history and calculation/source method.
- Report date and source.
- Distinguish FitTrack-reported measurements from VitaSync estimates.
- Do not draw continuous trend lines across long gaps as if daily measurements exist without making gaps visible.

## History and date handling

- Daily, weekly and monthly views.
- Use the user's IANA timezone for day boundaries.
- Support date range selection.
- Handle missing days without inventing zero values.
- Aggregate daily food logs from saved nutrition snapshots.
- Aggregate activity only with defined overlap/deduplication rules.
- Show the method used for estimated TDEE.
- Preserve source data and calculation versions.

## Charts

Use a maintained React charting library compatible with the web frontend and mobile WebView. Choose accessible charts with:

- Labels and units.
- Tooltips or accessible data tables.
- Empty and insufficient-data states.
- Responsive sizing.
- No misleading axes or truncated baselines for quantities where this distorts interpretation.
- Visible measurement points and dates.
- No decorative chart effects that obscure data.

## Backend aggregation

Create dashboard query services and endpoints:

| Method | Endpoint                        | Purpose                      |
| ------ | ------------------------------- | ---------------------------- |
| GET    | `/dashboard/today?date=`        | Daily overview               |
| GET    | `/dashboard/weekly?startDate=`  | Weekly overview              |
| GET    | `/dashboard/monthly?month=`     | Monthly overview             |
| GET    | `/dashboard/progress?from=&to=` | Body and nutrition trends    |
| GET    | `/dashboard/sources`            | Data source freshness/status |

Use database aggregation where appropriate. Avoid N+1 queries. Cache only derived data that can be safely invalidated when underlying logs change.

## UX and accessibility

- Light theme only.
- shadcn/ui components.
- React Icons only.
- No emojis or emoji-style icons.
- No dark mode or theme toggle.
- No live-status badges, pulse effects or animated dots.
- Use plain-language labels and explicit units.
- Loading skeletons are allowed, but do not mimic live status.
- Provide empty, error, stale-data and partial-data states.
- Ensure screen-reader labels and accessible chart alternatives.
- Do not rely on color alone to communicate deficit/surplus or data source.

## Acceptance criteria

- Dashboard values reconcile with underlying food logs and activity records.
- User timezone is respected.
- Missing data is not rendered as zero.
- Estimated and imported values are visually distinguished.
- Historical body measurements retain their measurement dates.
- Charts are responsive and accessible.
- Dashboard is tenant-scoped.
- No unsupported real-time claims or live badges.
- Data source and last-sync information are understandable.

## In-depth AI coding prompt

> Implement Stage 7 of VitaSync. Inspect existing API endpoints, food logs, energy calculation services, activity records and FitTrack measurement models before building the UI. Do not create a second calculation implementation in the frontend. The backend is the source for authoritative summaries; frontend calculations should be limited to presentation.
>
> Build Overview, Nutrition, Activity, Body, History and Settings screens. The Overview should show food intake, targets, macros, estimated TDEE, estimated energy balance, steps/activity and latest body measurements. Every value must have a clear unit and data meaning. Distinguish imported data, user-entered data and estimates. Show timestamps and sources where useful.
>
> Implement daily, weekly and monthly API aggregation with timezone-aware day boundaries. Missing data must remain missing, not zero. Activity aggregation must follow Stage 4 overlap rules. Food summaries must use historical food-log snapshots. Body charts must use actual measurement dates and must not imply daily measurements when none exist.
>
> Use accessible responsive charts with labels, units, tooltips and data-table alternatives. Avoid misleading axes and decorative visual effects. Add loading, empty, stale, partial and error states. Use shadcn/ui, Tailwind and React Icons. The visual system is light-only, with no dark mode, emojis, live badges, pulsing dots or real-time claims.
>
> Optimize backend queries and avoid N+1 patterns. Add authorization tests for every dashboard endpoint. Add integration tests proving that daily and weekly summaries reconcile with source records and timezone boundaries. Run lint, typecheck, tests and production build; report exact outcomes.

## Out of scope

AI coaching, meal-plan generation, predictions, social feeds, gamification and real-time monitoring.
