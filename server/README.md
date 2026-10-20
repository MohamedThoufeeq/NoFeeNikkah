# NoFeeNikkah API

Node.js + Express 5 backend for the NoFeeNikkah client. It provides email/password
authentication, OAuth social sign-in exchange, opaque server-side sessions,
profile CRUD, search and interests on top of Supabase Auth + Postgres.

The full machine-readable contract is in
[`openapi/openapi.yaml`](openapi/openapi.yaml), with viewing, validation and
maintenance notes in [`openapi/README.md`](openapi/README.md).

---

## Stack

- Node.js 20.19+ (ES modules)
- Express 5
- Supabase (`@supabase/supabase-js`) for Auth and Postgres
- Zod for request validation
- Pino / pino-http for structured logging
- Helmet, CORS, compression, cookie-parser and express-rate-limit
- Node's built-in test runner

---

## Layout

```text
server/
├── openapi/                   OpenAPI 3.0 contract and documentation guide
├── scripts/                   Demo-data seed script and fixtures
├── sql/001_init.sql           Tables, indexes, triggers, RLS, cleanup function
├── sql/002_search_filters.sql Extended matrimony filters for existing projects
├── src/
│   ├── config/env.js          Validated environment configuration
│   ├── core/                  AppError hierarchy, logger, responses, async wrapper
│   ├── db/                    SupabaseConnection (service-role + anon clients)
│   ├── repositories/          BaseRepository + profile/session/interest/auth adapters
│   ├── models/Profile.js      Canonical profile model and legacy API mapping
│   ├── presenters/            Privacy-aware JSON serialization
│   ├── services/              Auth, Session, Profile and Interest use-cases
│   ├── controllers/           HTTP adapters
│   ├── middleware/            Auth, validation, rate limits, errors, request IDs
│   ├── validators/            Zod schemas
│   ├── routes/                Route composition
│   ├── container.js           Composition root
│   ├── app.js                 Express application
│   └── server.js              Listener, cleanup timer, graceful shutdown
└── tests/                     Unit tests (no database required)
```

---

## Request lifecycle

```text
request
  → requestId + structured request log
  → CORS / Helmet / body parsing / cookie parsing
  → global rate limit
  → route-level rate limit (auth endpoints)
  → Zod validation
  → authentication (opaque session lookup)
  → controller
  → service (business rules)
  → repository (Supabase)
  → presenter (privacy-aware DTO)
  → { success, data } response
```

Errors at any layer are normalised by `middleware/errorHandler.js`.

---

## Environment

Copy the root `.env.example` to `.env`. The server validates the following at
startup and refuses to boot with an unsafe/incomplete configuration.

| Variable | Required | Default | Notes |
| --- | --- | --- | --- |
| `NODE_ENV` | no | `development` | `development`, `test`, `production` |
| `PORT` | no | `8080` | HTTP port |
| `API_PUBLIC_URL` | no | `http://localhost:8080` | Public API origin |
| `FRONTEND_URL` | no | `http://localhost:5173` | CORS + auth email redirects |
| `CORS_ORIGINS` | no | `FRONTEND_URL` | Comma-separated allowed origins |
| `TRUST_PROXY` | no | `0` | Express trust-proxy hop count |
| `SUPABASE_URL` | **yes** | — | Supabase project URL |
| `SUPABASE_ANON_KEY` | **yes** | — | Auth credential/token verification |
| `SUPABASE_SERVICE_ROLE_KEY` | **yes** | — | Server-only database/admin access |
| `SESSION_COOKIE_NAME` | no | `nfn_session` | HttpOnly cookie name |
| `SESSION_TTL_DAYS` | no | `30` | Opaque session lifetime |
| `SESSION_TOUCH_INTERVAL_SECONDS` | no | `300` | Throttles `last_used_at` writes |
| `COOKIE_SECURE` | no | prod: true | Force Secure cookies |
| `COOKIE_SAME_SITE` | no | `lax` | `lax`, `strict`, `none` |
| `BODY_LIMIT` | no | `1mb` | JSON/urlencoded body limit |
| `LOG_LEVEL` | no | `info` | Pino level |
| `RATE_LIMIT_WINDOW_MS` | no | `900000` | Global window |
| `RATE_LIMIT_MAX` | no | `300` | Global requests / window |
| `AUTH_RATE_LIMIT_MAX` | no | `15` | Login/register/social requests / window |
| `SOCIAL_PROVIDERS` | no | `google,github` | Providers accepted for token exchange |
| `SERVE_CLIENT` | no | `false` | Serve `dist/` from Express |
| `CLIENT_DIST_PATH` | no | `<repo>/dist` | Custom client build directory |

`COOKIE_SAME_SITE=none` automatically forces `Secure`; use it only with HTTPS
and when the browser client and API are on different sites.

---

## Supabase setup

1. Run `sql/001_init.sql` in the Supabase SQL editor. If the project already
   has the original schema, run `sql/002_search_filters.sql` instead to add the
   extended search filters.
2. Enable **Email** auth and any OAuth providers you need.
3. Add the client callback URLs under **Authentication → URL Configuration →
   Redirect URLs**, e.g. `http://localhost:5173/auth/callback`.
4. Copy the project URL and keys into the server environment.
5. Keep the service-role key server-side only.

The SQL creates:

- `profiles` — canonical profile data, one row per `auth.users` row.
- `sessions` — hashed opaque session tokens, expiry, revocation, client metadata.
- `interests` — sent/accepted/declined interests with uniqueness and no-self checks.
- Indexes for search, arrays and active sessions.
- `updated_at` triggers.
- RLS policies for direct authenticated access; the backend service role bypasses
  RLS by design.
- `search_profiles()` with age, location, language, occupation, income,
  marital-status, sect, education, eating-habit, practicing-level,
  smoking/drinking and financial-status filters.
- `delete_expired_sessions()` for optional pg_cron scheduling.

---

## Authentication and sessions

### Registration

`POST /api/auth/register`

```json
{ "username": "aisha_r", "email": "aisha@example.com", "password": "at-least-8-chars", "fullName": "Aisha Rahman" }
```

Behavior:

1. Rejects a taken username (case-insensitive).
2. Calls Supabase `signUp` and sends the confirmation email if enabled.
3. Creates the matching profile. If profile creation fails, the auth user is
   deleted as a compensating action.
4. If Supabase returns a session (email confirmation disabled), the API also
   creates an application session.

Example response:

```json
{
  "success": true,
  "data": {
    "user": { "id": "…", "email": "aisha@example.com", "username": "aisha_r", "fullName": "Aisha Rahman", "image": "" },
    "requiresEmailConfirmation": true
  }
}
```

### Login

`POST /api/auth/login`

```json
{ "email": "aisha@example.com", "password": "…" }
```

Response:

```json
{
  "success": true,
  "data": {
    "token": "opaque-session-token",
    "expiresAt": "2026-11-19T10:00:00.000Z",
    "user": { "id": "…", "email": "aisha@example.com", "username": "aisha_r", "fullName": "Aisha Rahman", "image": "" }
  }
}
```

The response also sets the HttpOnly `nfn_session` cookie. Clients can use either
the cookie or `Authorization: Bearer <token>`. The token is random, and only its
SHA-256 hash is stored in `sessions`.

### Social login

1. The browser uses the Supabase JS client to perform the OAuth redirect and
   receives a Supabase access token at `/auth/callback`.
2. The browser calls `POST /api/auth/social`:

```json
{ "accessToken": "supabase-access-token" }
```

3. The API verifies the token with Supabase, ensures a profile exists, creates an
   application session and returns the same shape as login.

The API never stores or returns a Supabase refresh token.

### Current session

`GET /api/auth/me` (or `/api/auth/session`)

```json
{
  "success": true,
  "data": {
    "user": { "id": "…", "email": "…", "username": "…", "fullName": "…", "image": "" },
    "profile": { "id": "…", "fullName": "…", "isPublic": true, "…": "…" },
    "expiresAt": "2026-11-19T10:00:00.000Z"
  }
}
```

### Logout and account deletion

- `POST /api/auth/logout` revokes the current token and clears the cookie. It
  works even if the session has already expired.
- `POST /api/auth/logout-all` revokes every active session for the user.
- `DELETE /api/auth/account` revokes sessions, deletes the Supabase auth user and
  cascades to profile/interests.

### Session details

- TTL: `SESSION_TTL_DAYS`.
- Activity updates are throttled by `SESSION_TOUCH_INTERVAL_SECONDS`.
- Expired/revoked sessions return `401 UNAUTHORIZED`.
- A periodic cleanup task runs hourly; an SQL function is available for pg_cron.
- The `sessions` table has RLS enabled with no policies, so only the service
  role can read it.

---

## Profiles

Profile **reads** are public for public profiles; they optionally resolve a
session so the viewer's own profile is excluded from search and owner-only
contact details are returned. **Writes** require authentication.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/profiles/me` | required | Full profile including contact numbers |
| `PATCH` / `PUT` | `/api/profiles/me` | required | Partial/full profile update |
| `DELETE` | `/api/profiles/me` | required | Delete the profile row (account remains) |
| `GET` | `/api/profiles/:id` | optional | Public profile (private profiles return 404) |
| `GET` | `/api/filter?…` | optional | Search public profiles |
| `GET` | `/api/search?…` | optional | Alias for `/api/filter` |
| `POST` | `/api/:id` | required | Legacy update endpoint; `id` must be the caller |

### Profile update payload

The domain model accepts canonical camelCase fields **and** legacy names used by
the existing client:

```json
{
  "fullname": "Aisha Rahman",
  "gender": "female",
  "dateOfBirth": "1997-04-12",
  "languagesKnownArray": ["English", "Tamil"],
  "occupationArray": ["Engineer"],
  "permenantCountry": "India",
  "fromAge": "24",
  "toAge": "32",
  "isPublic": true
}
```

Identity fields (`id`, `username`, `email`) cannot be changed through a profile
update. The service preserves the authenticated values.

### Search filters

`GET /api/filter?gender=female&country=India&state=Tamil%20Nadu&city=Chennai&language=English&age=32&income=60000&occupation=Engineer&page=1&limit=20`

- `gender`: `male`, `female`, `both`
- `age`: maximum age (inclusive)
- `income`: maximum monthly income
- `language` / `occupation`: case-insensitive partial match inside the arrays
- `page` / `limit`: pagination (`limit` max 100)

Response:

```json
{
  "success": true,
  "data": {
    "profiles": [
      {
        "id": "…",
        "fullName": "Aisha Rahman",
        "age": 29,
        "city": "Chennai",
        "languages": ["English", "Tamil"],
        "occupations": ["Engineer"],
        "aboutMe": "…",
        "image": ""
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
  }
}
```

### Privacy

- Full contact numbers are returned only from `/api/profiles/me`.
- Other members receive masked numbers.
- Private profiles are indistinguishable from missing profiles.
- Email and social links remain visible as part of the profile contract; adjust
  `ProfilePresenter` if your privacy policy requires otherwise.

---

## Interests

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/interests` | Send `{ "targetProfileId": "uuid" }` |
| `GET` | `/api/interests/sent` | Interests sent by the caller |
| `GET` | `/api/interests/received` | Interests received by the caller |
| `PATCH` | `/api/interests/:id` | Recipient accepts/declines `{ "status": "accepted" }` |
| `DELETE` | `/api/interests/:id` | Sender withdraws an interest |
| `POST` | `/api/:id/senInterest/:targetId` | Legacy send route |

Rules:

- Cannot send to yourself.
- Cannot send twice to the same profile (`409 CONFLICT`).
- Only the recipient can change status.
- Only the sender can withdraw.
- Deleting a profile cascades its interests.

---

## Response and error contract

Success:

```json
{ "success": true, "data": { }, "meta": { } }
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Enter a valid email address.",
    "details": [{ "path": "email", "message": "…" }]
  },
  "requestId": "9e4f…"
}
```

Common codes:

| Code | HTTP | Meaning |
| --- | --- | --- |
| `VALIDATION_ERROR` | 422 | Zod validation failed |
| `BAD_REQUEST` | 400 | Invalid operation |
| `UNAUTHORIZED` | 401 | Missing/expired session |
| `FORBIDDEN` | 403 | Authenticated but not allowed |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Duplicate username/email/interest |
| `RATE_LIMITED` | 429 | Too many requests |
| `PAYLOAD_TOO_LARGE` | 413 | Body exceeds `BODY_LIMIT` |
| `INVALID_JSON` | 400 | Malformed JSON |
| `DATABASE_ERROR` | 500 | Database failure (generic message) |
| `INTERNAL_ERROR` | 500 | Unexpected failure (generic message) |

Production responses never include database messages, stack traces or provider
internals.

---

## Security

- Helmet security headers; CSP is disabled because the API serves JSON.
- Strict CORS allow-list with credentials.
- Origin guard on cookie-authenticated unsafe requests (CSRF defence).
- Global and auth-specific rate limits.
- Zod validation for params, query and body.
- Opaque session tokens hashed at rest.
- HttpOnly, Secure (production), SameSite cookies.
- Bearer-token support for clients that cannot use cookies.
- Service-role key used only in `SupabaseConnection`.
- Pino redaction for authorization, cookies, tokens and passwords.
- RLS enabled on all application tables.
- Private profiles hidden; contact numbers masked.
- Uniform registration/password errors avoid account enumeration where possible.

### Known production limitations

- `express-rate-limit` uses the in-memory store; use Redis for a multi-instance
  deployment.
- Profile-image upload is not implemented; the API stores an image URL.
- Password-reset UI/flow is not included.
- `DELETE /api/profiles/me` deletes only the profile row. Use
  `DELETE /api/auth/account` to delete the whole account.

---

## Demo data

After running the migration and setting `SUPABASE_URL` plus
`SUPABASE_SERVICE_ROLE_KEY`, seed 50 auth users, profiles and 105 sample
interests:

```bash
npm run seed:demo -- --dry-run   # preview only
npm run seed:demo                # create/update demo data
```

All demo accounts use `DemoPass123!`. The dataset includes public and private
profiles plus pending, accepted and declined interests. See
[`scripts/README.md`](scripts/README.md) for the account list, idempotency rules
and local-Supabase instructions.

---

## Development commands

```bash
npm run dev:server    # node --watch server/src/server.js
npm start             # production listener
npm run test:server   # node --test server/tests/*.test.js
npm run seed:demo     # create demo auth users, profiles and interests
npm run lint          # includes server/**/*.js
npm run check         # lint + server tests + client build
```

The unit tests cover profile/legacy mapping, privacy masking, session hashing,
auth flows, profile creation/update and private-profile visibility. They do not
require a Supabase connection.

---

## Deployment notes

1. Run the SQL migration in the target Supabase project.
2. Set `NODE_ENV=production`, a strong `CORS_ORIGINS`, and HTTPS cookie settings.
3. Keep the API behind a reverse proxy that sets forwarded headers and matches
   `TRUST_PROXY`.
4. Use `/health` for liveness and `/api/health/db` for readiness.
5. Terminate TLS at the proxy; the API sets HSTS and Secure cookies.
6. If serving the client from Express, build it first and set `SERVE_CLIENT=true`.
7. Scale horizontally only after replacing the in-memory rate-limit store.
