# Stage 6 — FitTrack REST API and Body Composition Integration

## Objective

Connect VitaSync to the existing FitTrack project through a documented, authenticated REST API and signed webhooks. Import confirmed body-composition measurements and report metadata without duplicating FitTrack's report extraction pipeline.

## Non-negotiable prerequisite

Inspect the real FitTrack repository and current API before implementation. Confirm its framework, authentication, user model, report lifecycle, database ownership and actual available fields. Do not invent endpoints, payloads, user IDs or report models.

FitTrack remains the source of truth for report extraction and original report records. VitaSync stores a synchronized copy of validated measurements and provenance for its own analytics.

## Integration model

Preferred flow:

1. User chooses Connect FitTrack in VitaSync.
2. User authorizes the connection through a secure account-linking flow.
3. FitTrack issues or establishes a scoped integration credential.
4. VitaSync stores only a securely protected credential/reference, never plaintext credentials in ordinary tables or logs.
5. FitTrack sends a signed event when a report is processed or corrected.
6. VitaSync verifies signature, timestamp and event ID.
7. VitaSync maps the FitTrack account to the authenticated VitaSync user.
8. VitaSync validates measurements, stores source IDs and timestamps, and acknowledges the event.
9. Periodic/manual reconciliation can fetch missed updates.

Do not match accounts by email alone. Use a verified account-linking flow and stable external user mapping.

## Data to synchronize when actually available

- External report ID.
- Report creation and measurement dates.
- Weight in kg.
- Height in cm.
- BMI.
- Body-fat percentage.
- Muscle mass, with exact definition and unit.
- BMR, with method/source if available.
- Visceral fat only if the report actually provides it and its meaning is documented.
- Other body measurements only when supported by the real report schema.
- Extraction/verification status.
- Original report reference or secure link, if authorized.

Do not infer missing measurements. Do not treat a model-estimated value as a measured value. Preserve units, measurement method, report date and provenance.

## Suggested VitaSync data models

- `FitTrackConnection`
- `FitTrackAccountMapping`
- `FitTrackReport`
- `BodyMeasurement`
- `BodyComposition`
- `IntegrationEvent`
- `WebhookSecretVersion` or secure secret-manager reference

Store external IDs with unique constraints scoped to the provider. Preserve measurement history; never overwrite an old measurement with a new one. Corrections should be traceable.

## Webhook security

- HMAC signature or equivalent strong signature scheme.
- Timestamp tolerance and replay protection.
- Unique event ID with idempotency.
- Secret rotation.
- Constant-time signature comparison.
- HTTPS only.
- Strict payload schema validation.
- No secrets or full sensitive payloads in logs.
- Dead-letter/retry strategy for transient processing errors.
- Safe acknowledgement semantics.

## API contract proposal — confirm against FitTrack

VitaSync-side endpoints may include:

| Method | Endpoint                         | Purpose                           |
| ------ | -------------------------------- | --------------------------------- |
| POST   | `/integrations/fittrack/connect` | Start account linking             |
| GET    | `/integrations/fittrack/status`  | Read connection status            |
| POST   | `/integrations/fittrack/webhook` | Receive signed event              |
| POST   | `/integrations/fittrack/sync`    | Trigger reconciliation            |
| DELETE | `/integrations/fittrack`         | Disconnect                        |
| GET    | `/body/measurements`             | Read body history                 |
| GET    | `/body/composition`              | Read composition history          |
| GET    | `/body/reports`                  | Read synchronized report metadata |

The FitTrack-side endpoint names and payloads must be determined by repository inspection and a jointly documented contract. These VitaSync endpoints are a proposal, not claims about the existing FitTrack API.

## Data validation

- Validate plausible ranges but do not silently clamp values.
- Confirm units before conversion.
- Recompute BMI only as a consistency check when height and weight are available; preserve FitTrack's reported BMI separately.
- Flag discrepancies for review rather than overwriting source values.
- Validate report ownership through account mapping.
- Preserve report measured-at time separately from import time.
- Handle corrected, deleted or reprocessed reports according to FitTrack's actual lifecycle.

## UI requirements

- FitTrack connection setup.
- Connection status as ordinary text, not a live badge.
- Last synchronization time.
- Manual synchronization.
- Imported report list.
- Body measurement timeline.
- Disconnect and data-retention explanation.
- Error states for expired/revoked connection.

Keep the light-mode design, shadcn/ui, React Icons and no-emoji rule.

## Acceptance criteria

- Connection uses a verified account-linking process.
- A report event is accepted only with a valid signature.
- Duplicate webhook delivery does not duplicate records.
- Invalid or replayed events are rejected.
- External account mapping cannot be spoofed by client input.
- Imported values retain source, unit, measured date and report ID.
- Missing values remain missing.
- Historical values are not overwritten by newer reports.
- Corrections are traceable.
- Disconnect behavior is tested.
- Integration contract is documented and validated against the actual FitTrack codebase.

## In-depth AI coding prompt

> Implement Stage 6 of VitaSync by first inspecting the existing FitTrack repository and its actual API. The user has a separate FitTrack project. Do not invent its framework, endpoints, database fields, authentication mechanism, event names or report payloads. Produce an integration discovery report first: identify the real report lifecycle, user identity model, report fields, available API routes, authentication options and safe webhook extension points. If any required capability does not exist, propose the smallest FitTrack change and wait for contract agreement before coding it.
>
> Implement a secure account-linking flow between a VitaSync user and a FitTrack account. Never map users solely by matching email addresses. Implement scoped credentials or an equivalent secure integration mechanism. Store credential references securely and redact them from logs.
>
> Implement VitaSync webhook verification using HMAC or an agreed strong signature scheme, timestamp tolerance, replay protection, unique event IDs, idempotency, secret rotation and strict schema validation. Process report events transactionally. Add retries/dead-letter handling for transient failures.
>
> Import only measurements actually present in the confirmed FitTrack contract: weight, height, BMI, body-fat percentage, muscle mass, BMR and optional visceral fat or other measurements where their definitions and units are documented. Preserve report ID, source, measurement timestamp, import timestamp, units, method and verification status. Do not fabricate missing values. Preserve history and make corrections traceable.
>
> Build connection settings, synchronization history, report history and body-composition timeline using the established light-mode shadcn/ui design and React Icons. Do not use dark mode, emojis or live badges.
>
> Add tests for invalid signatures, replay, duplicate events, account mapping, malformed payloads, unit validation, missing fields, corrected reports, disconnect and cross-user isolation. Validate the integration against the actual FitTrack project and report precisely what has and has not been tested.

## Out of scope

Rebuilding FitTrack extraction, uploading/reprocessing source reports in VitaSync, AI body analysis and predictive body-composition modeling.
