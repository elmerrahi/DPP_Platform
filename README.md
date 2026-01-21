# DPP_Platform
The Digital Product Passport (DPP) Platform is an innovative SaaS solution designed to help businesses create, audit, and maintain Digital Product Passports (DPPs) in compliance with European regulations such as the Ecodesign for Sustainable Products Regulation (ESPR).

## Project Structure

```
frontend/
  src/
    components/
    pages/
    styles/
    utils/
backend/
  app/
    api/
      v1/
    core/
    db/
    models/
    schemas/
  ai/
    models/
  tests/
```

## Frontend (React)

- Landing page, auth flows, DPP creation, audit flow, and user dashboard.
- Styling uses light purple, light pink, and yellow with expressive typography.
- Branding highlights Yonk AI Leaders and Bicep throughout the UI.

Run locally:

```
cd frontend
npm install
npm run dev
```

## Backend (FastAPI)

- JWT auth, DPP creation, and audit endpoints.
- PostgreSQL with JSONB for flexible DPP data payloads.
- AI placeholder hooks for compliance scoring and transformer-based insights.

Start PostgreSQL (Docker):

```
docker compose up -d db
```

Run locally:

```
cd backend
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Quick run summary (two terminals):

```
# Terminal 1: backend + database
pip install -r requirements.txt (first time only )

docker compose up -d db
cd backend
.venv\\Scripts\\activate
uvicorn app.main:app --reload
```

```
# Terminal 2: frontend
cd frontend
npm install
npm run dev
```

Seed a test user (optional):

```
cd backend
python scripts/seed_user.py --email test@test --password test1234
```

Admin: list users (requires X-Admin-Token header)

```
curl -H "X-Admin-Token: change-me-admin" http://localhost:8000/api/v1/admin/users
```


Here’s the normal end‑to‑end flow map for sign‑up and sign‑in in this project:

Sign up

User fills form in the frontend.
Frontend sends POST http://localhost:8000/api/v1/auth/register.
FastAPI validates input with Pydantic.
Backend checks Postgres for existing email.
Backend hashes password and creates user row.
Backend returns { access_token, user }.
Frontend stores token + user in localStorage.
Frontend redirects to /dashboard.
Sign in

User fills form in the frontend.
Frontend sends POST http://localhost:8000/api/v1/auth/login.
Backend finds user by email.
Backend verifies password hash.
Backend returns { access_token, user }.
Frontend stores token + user in localStorage.
Frontend redirects to /dashboard.
Dashboard access

Frontend sends GET http://localhost:8000/api/v1/users/dashboard with Authorization: Bearer <token>.
Backend validates token and loads user.
Backend returns dashboard JSON.
Frontend renders dashboard.
If you want, I can also diagram it with boxes/arrows or add the exact API payload examples.
