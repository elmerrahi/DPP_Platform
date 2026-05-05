# DPP_Platform — Claude Code Guide

## What this project is
DPP_Platform is a SaaS that helps businesses create, audit, and maintain
**Digital Product Passports (DPPs)** in compliance with EU regulations,
notably the Ecodesign for Sustainable Products Regulation (ESPR).

Core user flows:
- Sign up / sign in (JWT-based).
- Create a DPP describing a product (stored as flexible JSONB).
- Upload artifacts for audit / compliance scoring.
- View the user's DPPs and audit results from a dashboard.

Branding surfaces "Yonk AI Leaders" and "Bicep" across landing/auth UI.

## Architecture at a glance
- **Backend** — FastAPI (`backend/app/`)
  - `app/main.py` — app entry, CORS, health endpoint.
  - `app/api/v1/` — versioned routes: `auth.py`, `dpp_creation.py`,
    `audit.py`, `users.py`, `admin.py`. All API routes live here.
  - `app/core/` — `config.py` (settings), `security.py` (JWT/password hashing),
    `admin.py` (admin-token gate).
  - `app/db/` — SQLAlchemy base/session, `models.py` (User, DPP with JSONB payload),
    `init_db.py`.
  - `app/schemas/` — Pydantic request/response models.
  - `ai/models/` — placeholder modules (`compliance_model.py`,
    `transformer_model.py`) for future ML-based compliance scoring and
    transformer insights. Treat as stubs, not production AI.
  - `tests/` — pytest; currently only a health-check test.
- **Frontend** — Vite + React (`frontend/src/`)
  - `App.jsx` wires routes: landing, sign-in, sign-up, dashboard,
    DPP create, audit.
  - `components/` — one folder per component (`index.jsx` inside each).
  - `pages/` — thin wrappers around components for each route.
  - `utils/api.js` — single place that calls the backend; defaults to
    `http://localhost:8000`.
  - `utils/auth.js` — token/user storage (localStorage).
  - `styles/` — light purple / pink / yellow theme.
- **Database** — Postgres 16 via `docker-compose.yml` (service `db`,
  database `dpp_platform`, user/pass `postgres`/`postgres`).

## Conventions & gotchas
- **API base path**: everything is under `/api/v1/...`. When adding a
  route, register it in `app/api/v1/` and include it from `main.py`.
- **DPP payloads are JSONB**: schema flexibility is intentional — prefer
  extending the JSON payload over adding new columns for product attributes.
- **Auth**: JWT in `Authorization: Bearer <token>` header; token + user
  cached in browser `localStorage` by `utils/auth.js`.
- **Admin endpoints** require the `X-Admin-Token` header (see
  `app/core/admin.py`). Default dev token is `change-me-admin` — do not
  ship this value to production.
- **AI modules are placeholders.** Don't assume real inference; wire real
  models behind the same interfaces when implemented.
- **Stale `backend/node_modules/`** exists in the tree. The backend is
  Python/FastAPI — ignore this directory; it's leftover and not part of
  the backend runtime.
- **Windows-style venv activation** (`.venv\Scripts\activate`) appears in
  docs; on Linux/macOS use `source .venv/bin/activate`.

## Run it locally
```bash
# 1. Database
docker compose up -d db

# 2. Backend (terminal 1)
cd backend
python -m venv .venv && source .venv/bin/activate   # Linux/macOS
pip install -r requirements.txt
uvicorn app.main:app --reload        # http://localhost:8000  (docs at /docs)

# 3. Frontend (terminal 2)
cd frontend
npm install
npm run dev
```

Seed a test user:
```bash
cd backend
python scripts/seed_user.py --email test@test.com --password test1234
```

## Testing
```bash
cd backend && pytest
```

## Further reading
- `README.md` — longer setup walk-through and end-to-end auth flow diagram.
- `PROJECT_LOG.txt` — chronological dev log (scaffolding notes, fixes).
