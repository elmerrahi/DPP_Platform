# DPP_Platform
The Digital Product Passport (DPP) Platform is an innovative SaaS solution designed to help businesses create, audit, and maintain Digital Product Passports (DPPs) in compliance with European regulations such as the Ecodesign for Sustainable Products Regulation (ESPR).

## Project Structure

```
.
|-- backend/                 # FastAPI service
|   |-- app/
|   |   |-- api/
|   |   |   `-- v1/           # API routes (versioned)
|   |   |-- core/             # Settings, security, shared utils
|   |   |-- db/               # DB session, migrations, init
|   |   |-- models/           # ORM models
|   |   `-- schemas/          # Pydantic request/response schemas
|   |-- ai/
|   |   `-- models/           # AI-related artifacts (placeholder)
|   `-- tests/                # Backend tests
|-- frontend/                 # React app
|   `-- src/
|       |-- components/       # Reusable UI components
|       |-- pages/            # Route-level pages
|       |-- styles/           # Global styles, themes
|       `-- utils/            # Helpers and utilities
|-- docker-compose.yml        # Local services (Postgres)
|-- PROJECT_LOG.txt           # Project notes/logs
`-- README.md                 # You are here
```

Notes:
- All backend routes are under `backend/app/api/v1`.
- Frontend talks to the backend at `http://localhost:8000` by default.


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
.venv\\Scripts\\activacd te
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


Here is the normal end-to-end flow map for sign-up and sign-in in this project:

Sign up
1. User fills form in the frontend.
2. Frontend sends POST http://localhost:8000/api/v1/auth/register.
3. FastAPI validates input with Pydantic.
4. Backend checks Postgres for existing email.
5. Backend hashes password and creates user row.
6. Backend returns { access_token, user }.
7. Frontend stores token + user in localStorage.
8. Frontend redirects to /dashboard.

Sign in
1. User fills form in the frontend.
2. Frontend sends POST http://localhost:8000/api/v1/auth/login.
3. Backend finds user by email.
4. Backend verifies password hash.
5. Backend returns { access_token, user }.
6. Frontend stores token + user in localStorage.
7. Frontend redirects to /dashboard.

Dashboard access
1. Frontend sends GET http://localhost:8000/api/v1/users/dashboard with Authorization: Bearer <token>.
2. Backend validates token and loads user.
3. Backend returns dashboard JSON.
4. Frontend renders dashboard.
