# Stage 8 — Quality Assurance, Security and Release

## Objective

Prepare VitaSync for a controlled Phase 1 release. Verify correctness, privacy, security, integration reliability, Android packaging, backend deployment, backups and operational readiness.

## Test strategy

### Unit tests

Cover:

- BMR and TDEE formulas.
- Macro scaling and unit conversion.
- Nutrition rounding.
- Null versus zero nutrient handling.
- Food-log snapshots.
- Timezone/day-boundary calculations.
- Activity overlap and deduplication.
- Webhook signature verification.
- Token rotation and expiration.
- Validation schemas.

### Integration tests

Cover:

- Registration/login/refresh/logout.
- User profile and goals.
- Food search and barcode provider adapter.
- Food log CRUD and daily summary.
- Custom food ownership.
- Activity batch sync and deduplication.
- FitTrack webhook processing.
- Dashboard aggregation.
- Database migrations.

Use provider mocks for deterministic automated tests. Keep a separate opt-in integration test for real external APIs; never make the main test suite depend on public API availability.

### End-to-end tests

Cover core user journeys:

1. Register and complete profile.
2. Set nutrition goals.
3. Search and add a food.
4. Scan a known barcode on a supported Android device.
5. Log a meal and verify macros.
6. Grant Health Connect permissions and import supported records.
7. Connect FitTrack and receive a test report event.
8. View daily and historical dashboard.
9. Log out and verify protected pages are inaccessible.

### Multi-user isolation

Create User A and User B. Verify that each cannot read, update or delete the other's:

- Food logs.
- Custom foods.
- Saved meals.
- Goals.
- Activity records.
- Health connections.
- FitTrack mappings.
- Body measurements.
- Dashboard data.

Test both API routes and background/webhook processing.

## Security checklist

- Password hashing configured correctly.
- Access tokens short-lived.
- Refresh-token rotation and revocation.
- Secure token storage on Android.
- TLS required in production.
- CORS allowlist.
- Security headers.
- Request validation.
- SQL injection protection through Prisma parameterized operations.
- Rate limiting.
- Sensitive log redaction.
- Webhook signature and replay protection.
- Secret management and rotation.
- Authorization on every user-owned resource.
- Database least-privilege credentials.
- Backup encryption and restore test.
- Account export/deletion policy.
- Health data permission and privacy disclosures.

Run dependency and static analysis scans. Fix high/critical findings or document an explicit release-blocking exception.

## Performance and reliability

- Add database indexes based on actual query patterns.
- Set timeouts for external API calls.
- Retry only safe transient operations.
- Use idempotency keys for imports and webhook processing.
- Paginate history and search results.
- Avoid loading all user records into memory.
- Add structured logs and request IDs.
- Monitor API error rates, latency and database health without logging sensitive health payloads.
- Define backup and restore procedures.
- Test schema migration on a staging copy.
- Ensure background sync failures do not block manual app use.

## Deployment

### Backend

Choose a deployment platform that supports Node.js, PostgreSQL, environment secrets, TLS and persistent operations. Document:

- Build command.
- Start command.
- Environment variables.
- Migration procedure.
- Health/readiness checks.
- Backup schedule.
- Rollback procedure.

### Android

- Configure application ID and signing.
- Use separate development/staging/production API URLs.
- Remove debug logs and test credentials.
- Verify Android permissions and Health Connect declarations.
- Build signed release artifact.
- Test install, upgrade and uninstall/reinstall behavior.
- Verify privacy policy and data disclosures.
- Test on physical Android devices, not only browser preview.

### Data and privacy

- Publish privacy policy describing food, activity and body-composition data processing.
- Explain external providers and synchronization.
- Provide disconnect and deletion workflows.
- Define data retention.
- Do not sell or use health data for advertising.
- Request only necessary permissions.

## Release gates

Do not release if:

- Cross-user data leakage exists.
- Critical/high security issues remain unresolved.
- Food quantities or calorie calculations are materially incorrect.
- Activity data is double-counted.
- FitTrack webhook verification is bypassable.
- Migrations cannot be safely applied.
- Backup restore has not been tested.
- Health permission disclosures are incomplete.
- Core Android flows fail on a real device.

## Deliverables

- Test plan and test reports.
- Security review and dependency scan.
- Android release build.
- Backend deployment configuration.
- Database migration and backup runbook.
- Privacy/data-flow documentation.
- Known limitations list.
- Phase 1 release checklist.

## Acceptance criteria

- All critical unit/integration tests pass.
- Core end-to-end journeys pass on supported Android test devices.
- Cross-user isolation tests pass.
- No unresolved critical security findings.
- External provider failures degrade gracefully.
- Database backup restore is demonstrated.
- Production environment contains no committed secrets.
- Android release build installs and runs.
- Privacy disclosures accurately describe collected and synchronized data.
- Known limitations are documented honestly.

## In-depth AI coding prompt

> Act as the release engineer and security-focused QA lead for VitaSync. Inspect the complete application and all eight stage requirements. Do not assume that implemented features are correct merely because they compile.
>
> Create a test matrix covering unit, integration, end-to-end, Android device and multi-user authorization scenarios. Prioritize calculation correctness, food quantity conversion, missing nutrition data, timezone boundaries, Health Connect permissions, activity deduplication, FitTrack webhook security, token lifecycle and tenant isolation.
>
> Add deterministic provider mocks for Open Food Facts, Health Connect bridge and FitTrack. Keep optional live integration tests separate and explicitly gated. Run tests and report exact command output, pass/fail counts and skipped tests. Do not fabricate test results.
>
> Perform a security review of authentication, refresh-token storage, authorization, CORS, rate limiting, input validation, webhook signature/replay protection, secret management, sensitive logs and database access. Run dependency/static analysis scans where tooling is available. Treat unresolved cross-user leakage, critical/high vulnerabilities, broken calculation semantics and webhook bypasses as release blockers.
>
> Prepare backend deployment documentation, environment-variable inventory, database migration procedure, backup/restore runbook, health checks, rollback procedure and Android signing/release instructions. Verify that the Android package uses the correct production API URL, no debug secrets, appropriate Health Connect declarations and a working permission explanation.
>
> Verify privacy disclosures, data export/deletion, connection disconnect behavior and data retention. Produce a release readiness report with evidence, known limitations, unresolved issues and a go/no-go recommendation. Use the established light-only shadcn/ui design with React Icons; no dark mode, emojis or live badges. Never claim a physical-device or production test was completed unless it was actually performed.

## Out of scope

Public launch marketing, subscriptions, social features, AI features and features not included in the Phase 1 scope.
