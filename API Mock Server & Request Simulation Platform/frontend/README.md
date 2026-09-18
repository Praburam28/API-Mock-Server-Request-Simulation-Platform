# API Mock Server & Request Simulation Platform — Frontend

React + Vite + TypeScript + Material UI frontend for the **API Mock Server &
Request Simulation Platform**, built against the FastAPI/SQLAlchemy/MySQL/
Redis/JWT backend.

Lets you define mock endpoints (method, path, request schema, response
scenarios, status codes, headers, delays), version them, inspect live
request history, and monitor traffic from a dashboard — all without writing
a real backend service.

---

## Tech Stack

| Layer      | Choice                                          |
|------------|--------------------------------------------------|
| Framework  | React 18 + Vite 5                                |
| Language   | TypeScript 5 (strict mode)                       |
| UI Library | Material UI v6 (custom dark "workshop" theme)    |
| HTTP       | Axios (JWT bearer interceptor, typed errors)     |
| Routing    | React Router v6                                  |

No CSS framework beyond MUI's `sx` prop / theme — no Tailwind, no extra
component libraries. Design tokens (colors, fonts, method/status color
coding) live in `src/theme/tokens.ts`.

---

## Prerequisites

- **Node.js 18+** (built and tested on Node v22.22.2 / npm v10.9.7 — any
  current LTS will work)
- The backend running and reachable (FastAPI + MySQL + Redis, e.g. via
  `docker compose up` from the backend repo) — this frontend has no mock
  data of its own, it talks to the real API for everything, including login.

Check what you have installed:
```bash
node -v
npm -v
```
If those commands aren't found, install Node from https://nodejs.org
(pick the LTS installer) or via a version manager like `nvm`:
```bash
nvm install --lts
nvm use --lts
```
npm is bundled with Node — there's nothing separate to install for it.

---

## Setup

```bash
# 1. Unzip and enter the project
cd frontend

# 2. Copy the env file and point it at your backend
cp .env.example .env
# then edit .env if your backend isn't on http://localhost:8000

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

The app runs at **http://localhost:5173**. The backend's CORS config
already whitelists this origin (`http://localhost:5173` and
`http://127.0.0.1:5173`), so no extra backend changes are needed.

---

## Environment Variables

Defined in `.env` (copy from `.env.example`):

| Variable              | Default                 | Purpose                          |
|-----------------------|--------------------------|-----------------------------------|
| `VITE_API_BASE_URL`   | `http://localhost:8000` | Base URL the frontend calls for all API requests |

Vite only exposes variables prefixed with `VITE_` to client code — don't
put secrets here, this is a public frontend build.

---

## Available Scripts

| Command           | What it does                                           |
|--------------------|----------------------------------------------------------|
| `npm run dev`      | Starts the Vite dev server with hot reload on :5173      |
| `npm run build`    | Type-checks (`tsc -b`) then builds a production bundle to `dist/` |
| `npm run preview`  | Serves the built `dist/` folder locally, to sanity-check a production build |

---

## Project Structure

frontend/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example
└── src/
├── main.tsx # React root, providers (theme, router, auth, toast)
├── App.tsx # Route definitions
├── theme/
│ ├── tokens.ts # Colors, fonts, method/status color coding
│ └── index.ts # MUI theme built from tokens
├── types/
│ └── index.ts # TS types mirroring every backend Pydantic schema
├── api/
│ ├── client.ts # Axios instance, JWT interceptor, error unwrapping
│ ├── auth.ts # /auth/*
│ ├── mockApis.ts # /mock-apis
│ ├── apiVersions.ts # /mock-apis/{id}/versions
│ ├── versionResources.ts # request-schema, response-template, response-scenarios
│ └── misc.ts # /request-logs, /dashboard, /users
├── context/
│ ├── AuthContext.tsx # Current user, login/register/logout
│ └── ToastContext.tsx # Global snackbar notifications
├── components/ # Shared UI: Layout, badges, dialogs, JSON editor, etc.
└── pages/ # One file per route (Dashboard, MockApiList, ...)


---

## What's Implemented

- **Auth** — register, login, JWT stored client-side, `/auth/me` bootstrap
  on load, automatic redirect to `/login` on a 401 response.
- **Dashboard** — total/active mock APIs, total/error requests, average
  response time, most-used endpoints (`GET /dashboard`).
- **Mock APIs** — full CRUD. Delete is admin-only, matching the backend's
  `require_admin` dependency on that route.
- **API Versions** — per mock API, create/edit versions and switch which
  one you're configuring.
- **Request Schema** — per version: body / query / path / header
  field-type maps (`"string" | "integer" | "float" | "boolean"`), matching
  exactly what `MockExecutionService` validates against at call time.
- **Response Template** — a baseline body/headers/status per version.
- **Response Scenarios** — success / validation error / unauthorized /
  not found / server error / custom, each with its own status code,
  response delay (ms), headers, body, and an explicit "set as default"
  action, since the backend only ever serves the scenario with
  `is_default = true`.
- **Request Logs** — paginated, filterable by mock API / method / status
  range, with a detail drawer showing query params, path params, headers,
  and body.
- **Users** (admin only) — search, paginate, create, edit, activate/
  deactivate, delete.

---

## Notes & Assumptions

- **Admin role detection**: `UserResponse` only returns `role_id`, not a
  role name. The UI treats `role_id === 1` as Admin, based on the order
  roles are seeded in the backend's `db/seed.py` (Admin seeded before
  User). If your seed data assigns different IDs, update:
  - `ADMIN_ROLE_ID` in `src/context/AuthContext.tsx`
  - `ROLES` in `src/components/UserFormDialog.tsx`
- **Status-range filtering**: the Request Logs page lets you filter by
  2xx/3xx/4xx/5xx, but the backend's `/request-logs` endpoint only accepts
  an exact `response_status`. The range filter is applied client-side per
  page as a result.
- **JSON editors**: schema and response-body fields use a dependency-free
  monospace textarea with inline JSON validation — no external code-editor
  library is pulled in.

---

## Troubleshooting

- **Requests fail / CORS errors** — confirm the backend is running and
  `VITE_API_BASE_URL` in `.env` points to it.
- **Stuck on a blank page after login** — check the browser console; a
  401 from `/auth/me` will bounce you back to `/login` and clear the
  stored token.
- **"command not found: npm"** — Node isn't installed or isn't on your
  PATH; see Prerequisites above.