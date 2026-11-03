# Stage 2 — Multi-user Authentication and Database

## Objective

Implement secure multi-user identity, user profiles, goals, PostgreSQL persistence, Prisma migrations and strict tenant isolation. This stage establishes the data foundation for all later modules.

## Core requirements

### Authentication

Implement:

- User registration with name, email and password.
- Login with normalized email.
- Password hashing using Argon2id (or a well-justified, maintained equivalent).
- Short-lived access tokens.
- Rotating refresh tokens stored as hashes in the database.
- Refresh-token reuse detection and token-family revocation.
- Logout from current device and logout-all-devices.
- `GET /api/v1/auth/me`.
- Password reset flow only if an email delivery provider is configured; otherwise document it as deferred rather than creating an insecure fake flow.
- Account deactivation/deletion workflow with clear data-retention behavior.

Do not store plaintext passwords or plaintext refresh tokens. Do not put secrets in frontend bundles or localStorage. For the Capacitor app, use an appropriate secure storage plugin backed by Android Keystore for refresh-token storage. Keep access tokens short-lived and in memory where practical.

### User profile

Profile fields should include:

- Display name.
- Email.
- Date of birth or age input strategy.
- Height in centimeters.
- Sex value required only for formulas that use sex-specific constants; allow an undisclosed/prefer-not-to-say state and explain formula limitations.
- Preferred unit system.
- IANA timezone.
- Created and updated timestamps.

Do not infer sensitive profile attributes. Collect only what is required and explain why.

### Goals

Allow a user to configure:

- Daily calorie target.
- Protein target in grams.
- Carbohydrate target in grams.
- Fat target in grams.
- Optional weight goal and target date.
- Preferred activity/energy calculation method.

Validate targets as positive and within defensible ranges; allow users to revise them.

## Prisma data model

Create normalized Prisma models for at least:

- `User`
- `UserProfile`
- `RefreshToken`
- `UserGoal`
- `UserDevice`
- `AuditEvent` (minimal security-relevant events)

Use UUID or cuid IDs consistently. Add unique email constraints, foreign keys, indexes and cascade/restrict rules deliberately. Store timestamps in UTC. Use Decimal for values where floating-point drift would be undesirable.

A suggested conceptual schema:

```text
User
  id
  name
  email (unique, normalized)
  passwordHash
  createdAt
  updatedAt
  disabledAt?

UserProfile
  id
  userId (unique)
  dateOfBirth?
  heightCm?
  sexForFormula?
  timezone
  unitSystem
  createdAt
  updatedAt

RefreshToken
  id
  userId
  tokenHash
  familyId
  expiresAt
  revokedAt?
  replacedById?
  createdAt

UserGoal
  id
  userId
  calorieTargetKcal?
  proteinTargetG?
  carbohydrateTargetG?
  fatTargetG?
  effectiveFrom
  createdAt
  updatedAt

UserDevice
  id
  userId
  deviceLabel
  platform
  lastSeenAt?
  createdAt

AuditEvent
  id
  userId?
  eventType
  metadataJson?
  createdAt
```

Adapt this schema to Prisma conventions. Do not store raw secrets in `metadataJson`.

## API design

All routes under `/api/v1`.

| Method | Endpoint                | Purpose                    |
| ------ | ----------------------- | -------------------------- |
| POST   | `/auth/register`        | Create account             |
| POST   | `/auth/login`           | Authenticate               |
| POST   | `/auth/refresh`         | Rotate refresh token       |
| POST   | `/auth/logout`          | Revoke current session     |
| POST   | `/auth/logout-all`      | Revoke all sessions        |
| GET    | `/auth/me`              | Current authenticated user |
| GET    | `/users/me/profile`     | Read profile               |
| PATCH  | `/users/me/profile`     | Update profile             |
| GET    | `/users/me/goals`       | Read active goals          |
| PUT    | `/users/me/goals`       | Create/update goals        |
| GET    | `/users/me/devices`     | List user devices          |
| DELETE | `/users/me/devices/:id` | Revoke a device            |

## Authorization rules

- Authenticate every private route.
- Derive user identity from verified server-side token claims.
- Never accept `userId` from request body as authorization authority.
- Every database query for personal data must be scoped to the authenticated user.
- Check ownership before update/delete.
- Return safe errors that do not disclose whether an email exists.
- Apply rate limits to registration, login, refresh and password-reset endpoints.
- Prevent mass assignment by validating allowed fields.
- Add tests proving User A cannot access User B's profile, goals, devices or tokens.

## Frontend requirements

Create:

- Registration page.
- Login page.
- Profile setup page.
- Goal setup/edit page.
- Account/security settings.
- Protected-route behavior.
- Session-expired handling.
- Form validation with Zod and React Hook Form.
- Accessible field labels and helpful error states.

Follow the Stage 1 visual system: light mode only, shadcn/ui, React Icons, no emojis and no live badges.

## Deliverables

- Prisma schema and first migration.
- Seed script with development-only sample users, clearly marked.
- Auth service and route handlers.
- Token rotation and revocation.
- Profile and goal APIs.
- Frontend auth flows.
- Unit and integration tests.
- Updated API documentation.

## Acceptance criteria

- Registration and login work.
- Passwords are hashed.
- Refresh tokens rotate and are stored hashed.
- Logout revokes the relevant token.
- Expired/revoked tokens cannot refresh.
- User-owned queries are tenant-scoped.
- Cross-user access tests fail safely with 403/404.
- Migrations apply to a clean database.
- No secret is committed.
- Frontend session handling works after refresh/reopen using secure storage.

## In-depth AI coding prompt

> Act as a senior application-security engineer and full-stack developer. Implement Stage 2 of VitaSync in the existing repository. First inspect the codebase and Stage 1 conventions. Do not rewrite working foundation code unnecessarily.
>
> Implement multi-user authentication with secure password hashing, short-lived access tokens, rotating refresh tokens, hashed refresh-token persistence, token-family reuse detection, logout and logout-all. Use secure Android storage for refresh tokens through a maintained Capacitor-compatible secure-storage solution; do not store refresh tokens in localStorage. Validate all inputs with shared Zod schemas where practical.
>
> Design Prisma models for User, UserProfile, RefreshToken, UserGoal, UserDevice and AuditEvent. Use PostgreSQL constraints, indexes, foreign keys and appropriate Decimal/date/time types. Create a migration and safe development seed. Store timestamps in UTC and preserve the user's IANA timezone for daily boundaries.
>
> Build registration, login, refresh, logout, current-user, profile and goals APIs under `/api/v1`. Add authentication middleware and authorization helpers. The server must derive user identity from the verified token; never trust a client-supplied user ID. Audit all user-owned queries for tenant isolation.
>
> Build accessible login, registration, profile setup and goals screens using shadcn/ui. Keep the UI light-only, use React Icons, and do not use emojis, dark mode or live-status badges.
>
> Write tests for password hashing, token rotation, expiration, revocation, validation, duplicate email handling and cross-user data access. Run migrations, lint, typecheck and tests. Report exact results and unresolved security risks. Do not claim a test passed unless it was run.

## Out of scope

Food catalogue, barcode lookup, calorie formulas, Health Connect and FitTrack data synchronization.
