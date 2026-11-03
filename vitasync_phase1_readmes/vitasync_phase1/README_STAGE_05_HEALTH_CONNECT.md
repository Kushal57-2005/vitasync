# Stage 5 — Android Health Connect and Samsung Health Integration

## Objective

Connect the VitaSync Android application to Health Connect using a native Kotlin Capacitor plugin. Import supported activity and energy records with explicit permissions, source metadata, deduplication and synchronization history.

## Architecture

```text
Samsung Health (when configured to write supported data)
                  |
             Health Connect
                  |
      Capacitor Android Kotlin plugin
                  |
        React/TypeScript bridge
                  |
         VitaSync API /api/v1
                  |
              PostgreSQL
```

Health Connect is the Android health-data access layer. Samsung Health is one possible source of records; availability depends on Samsung Health version, Android version, permissions, record types and user settings. Do not claim direct Samsung Health access if the data is actually read from Health Connect.

## Initial record scope

Investigate current Health Connect SDK support and permission requirements for:

- Steps.
- Exercise sessions.
- Active calories.
- Total calories, if supported and available.
- Distance, if useful.
- Heart rate only if explicitly needed and approved for Phase 1.

Do not request every possible health permission. Request only the types required for the features currently implemented. Explain permission purpose to users.

## Native implementation

1. Configure Capacitor Android.
2. Add the current supported Health Connect Android SDK dependency.
3. Implement a Kotlin plugin with methods such as:
   - `getAvailability`
   - `getGrantedPermissions`
   - `requestPermissions`
   - `readSteps`
   - `readExerciseSessions`
   - `readEnergyRecords`
   - `getChangesToken` / change-based sync where supported
4. Return typed, normalized records to TypeScript.
5. Handle Health Connect not installed/available, permissions denied, partial permissions, app background restrictions and Android version differences.
6. Document manifest declarations and Play Store health-permission declarations required for release.
7. Use a privacy rationale screen before triggering system permission prompts.

Check current official Android Health Connect documentation and SDK version before implementation. Do not hardcode outdated permission behavior.

## Data model

Use an `ActivityRecord` or normalized record model with:

- User ID.
- Provider/source app package where available.
- Health Connect record type.
- External record ID or stable deduplication key.
- Start and end timestamps.
- Duration.
- Value and unit.
- Energy semantics (active, basal/resting, total, session).
- Metadata and source version where available.
- Imported timestamp.
- Last updated timestamp.
- Deleted/removed marker for source deletions if change tracking supports it.

Also create:

- `HealthConnection`
- `HealthSyncLog`
- `HealthSyncCursor` or changes token storage
- `ExternalActivityId`

Do not store a single daily step total as if it were a workout record. Keep raw/normalized records and derive daily aggregates.

## Synchronization behavior

- Support initial historical import within a user-selected and policy-limited range.
- Support incremental sync using changes tokens where supported.
- Use pagination for large reads.
- Make sync idempotent.
- Deduplicate records by source ID and stable key.
- Handle updated and deleted records where supported.
- Retry transient failures with bounded exponential backoff.
- Do not create unbounded background polling.
- Provide user-triggered sync and a reasonable scheduled/background strategy compatible with Android restrictions.
- Record sync start/end, status, records read/created/updated/skipped and errors.
- Never assume continuous or real-time sync.

## Backend APIs

| Method | Endpoint                  | Purpose                                      |
| ------ | ------------------------- | -------------------------------------------- |
| GET    | `/health/connect/status`  | Read connection/sync status                  |
| POST   | `/health/sync`            | Submit normalized records or sync batch      |
| GET    | `/activities/daily?date=` | Daily activity aggregates                    |
| GET    | `/activities/history`     | Activity history                             |
| GET    | `/activities/:id`         | Activity details                             |
| DELETE | `/health/connection`      | Disconnect/revoke stored connection metadata |

Validate every record, source and unit. User identity must come from authentication. Do not trust a client-supplied user ID.

## Privacy and security

- Ask for granular permissions.
- Explain each data type and purpose.
- Support disconnecting.
- Do not transmit data the user has not consented to share.
- Encrypt traffic.
- Restrict access by authenticated user.
- Avoid logging raw health values or sensitive payloads.
- Define retention and deletion behavior.
- Do not use health data for advertising.

## UI requirements

Create a Health Connections page with:

- Health Connect availability.
- Permission explanation.
- Permission request action.
- Data types granted.
- Last successful sync timestamp.
- Manual sync action.
- Error and recovery guidance.
- Disconnect action.

Use ordinary text for statuses, not live badges or animated indicators. Keep light mode, shadcn/ui, React Icons and the no-emoji rule.

## Acceptance criteria

- App detects whether Health Connect is available.
- User can grant only requested permissions.
- Denied permissions are handled without crashing.
- Supported records import with source and units.
- Repeated sync does not duplicate records.
- Time ranges and timezone conversion are correct.
- Active energy and total energy are not confused.
- Sync errors are recorded and shown clearly.
- Disconnect behavior is documented and tested.
- Android native bridge works on a real device or emulator with appropriate Health Connect setup.

## In-depth AI coding prompt

> Implement Stage 5 of VitaSync. First inspect the Capacitor version, Android project and official current Health Connect SDK documentation. Do not assume an old SDK API or that all Samsung Health metrics are available.
>
> Build a Kotlin Capacitor plugin exposing availability, permission status/request, steps, exercise sessions and supported energy records. Keep the TypeScript bridge strongly typed. Add only the Android manifest declarations and permissions needed for the chosen records. Provide a user-facing rationale before requesting OS permissions. Handle unavailable Health Connect, denied or partial permissions, empty data, read failures and Android version differences.
>
> Treat Health Connect as the data access layer and Samsung Health as a possible contributing source. Preserve record source/package, type, external ID, timestamps, units and energy semantics. Implement paginated initial import and incremental synchronization where supported. Make sync idempotent, deduplicate records, handle updates/deletions where possible, and persist sync cursors safely. Do not implement constant polling or claim real-time sync.
>
> Add backend validation and tenant-scoped activity persistence. Keep steps, exercise sessions, active energy, basal/resting energy and total energy semantically distinct. Add reconciliation metadata needed by Stage 4 to avoid double-counting.
>
> Build a light-mode Health Connections screen with clear permissions, sync history, manual sync and disconnect. Use shadcn/ui, React Icons and no emojis, dark theme or live badges.
>
> Test permission denial, partial permission, unavailable provider, empty records, pagination, duplicate records, source updates, timezone handling and energy-type mapping. Run Android build and tests where possible. If hardware or Health Connect test data is unavailable, clearly report that limitation instead of claiming end-to-end verification.

## Out of scope

Medical records, Apple Health, continuous location tracking, live heart-rate monitoring and unsupported background polling.
