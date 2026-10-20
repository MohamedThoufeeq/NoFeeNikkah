# NoFeeNikkah

Free, private Muslim matrimonial platform. The repository is a full-stack
JavaScript application:

- **Client** — React 18 + Vite, token-driven cream/glass/red design system.
- **API** — Node.js + Express 5, Supabase (Auth + Postgres), opaque
  server-side sessions, repositories, services, MVC controllers and central
  error/logging middleware.

---

## Quick start

Requirements: Node.js **20.19+** and a Supabase project.

```bash
npm install

# 1. Create local configuration
cp .env.example .env

# 2. Fill in Supabase values (see below), then run the SQL migration
#    server/sql/001_init.sql in the Supabase SQL editor.

# 3. Start the API (terminal 1)
npm run dev:server        # http://localhost:8080

# 4. Start the client (terminal 2)
npm run dev               # http://localhost:5173
```

Useful commands:

```bash
npm run lint              # client + server, zero warnings
npm run test:server       # Node test runner
npm run build             # production client bundle
npm run check             # lint + server tests + build
npm start                 # start the API without file watching
npm run seed:demo         # optional demo auth users, profiles and interests
```

For offline UI work only, set `VITE_USE_MOCKS=true`; the complete sample-data
flow keeps working without the API.

### Codespaces and forwarded ports

The Vite dev server proxies `/api` to `http://127.0.0.1:8080` inside the
Codespace. This lets the browser use a single forwarded origin:

```dotenv
VITE_API_BASE_URL=/api
VITE_AUTH_API_BASE_URL=/api/auth
```

Forward port **5173** (private is fine while you are signed in to GitHub) and
open `https://<codespace-name>-5173.app.github.dev`. The API stays on
`localhost:8080` and is reached through the proxy, so session cookies remain
first-party and CORS is not involved. Only expose port 8080 separately if you
need to call the API or OpenAPI docs directly.

---

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor** and run `server/sql/001_init.sql`. For an existing
   project created before the extended search filters, run
   `server/sql/002_search_filters.sql` instead.
3. Copy **Project URL**, **anon/public key** and **service_role key** from
   **Project Settings → API**.
4. Put the URL and anon key in both the `VITE_SUPABASE_*` and `SUPABASE_*`
   variables; put the service-role key only in `SUPABASE_SERVICE_ROLE_KEY`.
5. Enable the providers you want in **Authentication → Providers**.
6. Add the client callback URL to **Authentication → URL Configuration →
   Redirect URLs**:
   - `http://localhost:5173/auth/callback`
   - your production equivalent, e.g. `https://app.example.com/auth/callback`
7. Optional: seed 50 demo accounts, profiles and interests:

   ```bash
   npm run seed:demo -- --dry-run   # preview
   npm run seed:demo                # write to the project in .env
   ```

   The password for every demo account is `DemoPass123!`. See
   [`server/scripts/README.md`](server/scripts/README.md) for the full list and
   local-Supabase instructions.

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. It is used only by the
Node API.

---

## Environment

All variables are documented in `.env.example`. The most important ones:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | Profiles/search/interests API (Vite proxy) |
| `VITE_AUTH_API_BASE_URL` | `${VITE_API_BASE_URL}/auth` | Login/register/social API |
| `VITE_USE_MOCKS` | `false` | Offline sample-data mode |
| `VITE_SUPABASE_URL` | — | Public Supabase URL for the OAuth redirect |
| `VITE_SUPABASE_ANON_KEY` | — | Public Supabase anon key |
| `VITE_SOCIAL_PROVIDERS` | `google,github` | Providers shown on auth screens |
| `PORT` | `8080` | API port |
| `FRONTEND_URL` | `http://localhost:5173` | CORS + email redirects |
| `CORS_ORIGINS` | `FRONTEND_URL` | Comma-separated allowed origins |
| `SUPABASE_URL` | — | Supabase project URL |
| `SUPABASE_ANON_KEY` | — | Supabase auth client key |
| `SUPABASE_SERVICE_ROLE_KEY` | — | Server-only database/admin key |
| `SESSION_TTL_DAYS` | `30` | Opaque session lifetime |
| `COOKIE_SAME_SITE` | `lax` | Use `none` (with HTTPS) for cross-site clients |
| `SOCIAL_PROVIDERS` | `google,github` | Providers accepted by the API |
| `SERVE_CLIENT` | `false` | Let Express serve `dist/` in single-container deploys |

`VITE_*` values are embedded in the browser bundle. Secrets belong only in the
server variables.

---

## Architecture

```text
src/                          React client
├── app/                      Router, shell, error boundary
├── components/               Layout, profile card, reusable UI
├── data/                     Navigation, reference and sample data
├── features/
│   ├── auth/                 Observable session store + social login UI
│   ├── profile/              Model, mapper, schema, form, read-only view
│   └── search/               Search result composition
├── lib/
│   ├── api/                  Fetch client + auth/profile services
│   ├── hooks/                Generic async data hook
│   └── utils/                Pure helpers
├── pages/                    Route-level screens
└── styles/                   Global tokenised design system

server/                       Node API
├── openapi/                  OpenAPI 3.0 contract + documentation
├── scripts/                  Demo-data seed script + fixtures
├── sql/                      Supabase schema, RLS and triggers
├── src/
│   ├── config/               Validated environment config
│   ├── core/                 Errors, logger, response + async helpers
│   ├── db/                   Supabase connection factory
│   ├── repositories/         Persistence adapters (Supabase/PostgREST)
│   ├── models/               Canonical profile domain model
│   ├── services/             Auth, session, profile, interest use-cases
│   ├── controllers/          HTTP adapters (MVC controllers)
│   ├── presenters/           Privacy-aware response serialization
│   ├── middleware/           Auth, validation, rate limits, errors, logs
│   ├── routes/               Route composition
│   ├── container.js          Composition root / dependency injection
│   ├── app.js                Express app
│   └── server.js             HTTP server + graceful shutdown
└── tests/                    Node built-in tests
```

### Backend design

- **MVC** — routes → controllers → services → repositories; presenters own
  response shape, models own domain rules.
- **SOLID** — each repository/service has one reason to change; provider calls
  are behind `SupabaseAuthRepository`; services receive dependencies through
  the container and do not import Express or Supabase directly.
- **OOP where it adds clarity** — cohesive classes for the connection,
  repositories, services, presenters and controllers; pure helpers remain
  functions.
- **Errors** — one `AppError` hierarchy, one central error middleware and one
  consistent JSON envelope.
- **Logging** — structured Pino logs, request IDs, sensitive-field redaction.
- **Sessions** — random opaque tokens hashed at rest, stored in `sessions`.
  The browser may use an HttpOnly cookie; mobile/legacy clients may use
  `Authorization: Bearer <token>`. Supabase access tokens are never stored by
  the application session layer.
- **Social login** — the browser performs the Supabase OAuth redirect, then
  exchanges the Supabase access token at `POST /api/auth/social`; the API
  verifies it, ensures a profile exists and issues an application session.
- **Database** — all writes go through the service-role client; RLS is enabled
  with least-privilege policies for any direct authenticated access.

See [`server/README.md`](server/README.md) for the request lifecycle and
security notes, and [`server/openapi/openapi.yaml`](server/openapi/openapi.yaml)
for the full OpenAPI 3.0 contract. Viewing, validation and maintenance guidance
is in [`server/openapi/README.md`](server/openapi/README.md).

---

## API at a glance

All responses use a consistent envelope:

```json
{ "success": true, "data": { } }
```

```json
{
  "success": false,
  "error": { "code": "VALIDATION_ERROR", "message": "…", "details": [] },
  "requestId": "…"
}
```

| Area | Method | Path |
| --- | --- | --- |
| Health | `GET` | `/health`, `/api/health`, `/api/health/db` |
| Register | `POST` | `/api/auth/register` |
| Login | `POST` | `/api/auth/login` |
| Social exchange | `POST` | `/api/auth/social` |
| Providers | `GET` | `/api/auth/providers` |
| Current user | `GET` | `/api/auth/me` |
| Current user (alias) | `GET` | `/api/auth/session` |
| Logout | `POST` | `/api/auth/logout` |
| Logout everywhere | `POST` | `/api/auth/logout-all` |
| Delete account | `DELETE` | `/api/auth/account` |
| My profile | `GET/PATCH/PUT/DELETE` | `/api/profiles/me` |
| Profile by id | `GET` | `/api/profiles/:id` |
| Search | `GET` | `/api/filter?...` or `/api/search?...` |
| Update (legacy) | `POST` | `/api/:id` |
| Send interest | `POST` | `/api/interests` |
| Sent/received | `GET` | `/api/interests/sent`, `/api/interests/received` |
| Accept/decline | `PATCH` | `/api/interests/:id` |
| Withdraw | `DELETE` | `/api/interests/:id` |

The legacy `POST /api/:id/senInterest/:targetId` route is retained for older
clients.

---

## Styling

All client styles are global and token-driven; there are no per-page CSS files
and no inline style objects.

```text
src/styles/
├── tokens.css       Colour, type, spacing, radius, shadow, blur, z-index
├── base.css         Reset, background, typography defaults
├── utilities.css    Container, stack, grid, text helpers
├── components.css   Buttons, fields, cards, alerts, toasts, avatars…
├── features.css     Screen composition (nav, auth, profile, search, edit)
└── index.css        Import entry point
```

Change `src/styles/tokens.css` to re-theme the whole application. Reusable
classes and components are documented in `src/styles/components.css`.

---

## How to extend

### Add a profile field

1. Add it to `src/features/profile/profile.mapper.js`.
2. Add the input to `src/features/profile/editProfileSchema.js`.
3. Add a read-only row in `src/features/profile/profileSections.js`.
4. Add the database column, model mapping and API schema on the server.
5. If it is an enum, add the option list to `profileOptions.js`.

### Add a backend endpoint

1. Add/extend a repository method in `server/src/repositories/`.
2. Add the use-case to a service in `server/src/services/`.
3. Add a controller method in `server/src/controllers/`.
4. Add a Zod schema and route in `server/src/routes/` + `validators/`.
5. Wire any new object in `server/src/container.js`.
6. Add a unit test under `server/tests/`.

### Add a page

1. Create `src/pages/MyPage.jsx` with a default export.
2. Lazy-load it in `src/app/App.jsx`.
3. Add a `<Route>` and, if needed, an entry in `src/data/navigation.js`.

---

## Production checklist

- [x] Client lint/build clean; server lint clean
- [x] Server unit tests
- [x] Route-level code splitting and lazy location dataset
- [x] Central API error/logging/validation/rate limiting
- [x] Opaque sessions hashed at rest; HttpOnly cookie + bearer support
- [x] Supabase RLS policies and SQL indexes
- [x] Privacy: contact numbers masked for other members
- [x] Social OAuth handshake and logout flows
- [ ] Add a password-reset UI/flow if required
- [ ] Replace the in-memory rate-limit store with Redis for multi-instance APIs
- [ ] Add object storage for profile-image uploads (the API stores an image URL)
- [ ] Configure TLS, HSTS and a reverse proxy in production
- [ ] Set `COOKIE_SAME_SITE=none` + HTTPS only if the client and API are on
      different sites
- [ ] Run the SQL migration against staging and production projects
- [ ] Add database backup/monitoring/alerting
