# Contributing to DPP_Platform

Welcome! DPP_Platform is built by **Young AI Leaders – French Hub**, a
volunteer association working to make EU Digital Product Passport
compliance accessible to small businesses. This guide gets you from
`git clone` to a running stack in **about 30 minutes**.

If something here is wrong, out of date, or harder than it should be,
**please open a PR fixing it** — onboarding friction is project risk.

---

## Prerequisites

| Tool | Required version | Why |
|---|---|---|
| **Python** | **3.12.x** (NOT 3.13) | Several pinned dependencies (`pydantic-core 2.16/2.18`, `psycopg2-binary 2.9.9`) lack cp313 wheels and fail to build from source on 3.13. See [Known gotchas](#known-gotchas). |
| **Node.js** | **20.x LTS** | Tested with `v20.19.0`. |
| **Docker + Docker Compose** | recent (v2 plugin syntax: `docker compose`) | Postgres runs in a container. |
| **Git** | any recent | — |

### Installing the right Python on Linux

```bash
# Debian/Ubuntu — Python 3.12 is in the default repos on 24.04+
sudo apt install python3.12 python3.12-venv

# If you only have older versions, use pyenv or deadsnakes PPA.
```

### Installing Node 20

Use [`nvm`](https://github.com/nvm-sh/nvm):

```bash
nvm install 20 && nvm use 20
```

---

## First-time setup

```bash
git clone <repo-url> DPP_Platform
cd DPP_Platform
```

### 1. Start Postgres

```bash
docker compose up -d db
```

The `db` service publishes Postgres on **host port `5433`** (not the
default `5432`) to avoid colliding with other Postgres containers many of
us run. The connection string in `backend/app/core/config.py` already
points to `localhost:5433`. If you have nothing else on `5432` and prefer
the default, change both `docker-compose.yml` and `config.py` together —
or override via a `.env` file (see [Configuration](#configuration)).

Verify it came up:

```bash
docker compose ps        # should show dpp-postgres "Up X seconds"
```

### 2. Backend (terminal 1)

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate                 # macOS/Linux
# .venv\Scripts\activate                  # Windows PowerShell
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8002
```

> **Important:** use `python -m uvicorn`, **not** the bare `uvicorn` command.
> See [Known gotchas → conda + venv PATH shadowing](#known-gotchas).

When it boots cleanly, you should see:

```
INFO:     Will watch for changes in these directories: ['.../backend']
INFO:     Uvicorn running on http://127.0.0.1:8002 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

### 3. Frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Vite will print a `Local:` URL (typically `http://localhost:5173/`).
Open it in a browser.

The frontend reads its API base URL from `frontend/.env.local` (which
already points to `http://localhost:8002/api/v1`). If you don't have
that file, create one:

```bash
echo "VITE_API_BASE_URL=http://localhost:8002/api/v1" > frontend/.env.local
```

### 4. Smoke test

In a third terminal:

```bash
curl -s http://localhost:8002/health
# expect: {"status":"ok"}

curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8002/docs
# expect: 200
```

If those both succeed, you're set up correctly. The backend's
auto-generated Swagger UI is at <http://localhost:8002/docs> and is the
fastest way to explore the API.

### 5. Seed a test user (optional)

```bash
cd backend
source .venv/bin/activate
python scripts/seed_user.py --email test@test.com --password test1234
```

Then sign in at the frontend with those credentials.

---

## Configuration

Settings live in `backend/app/core/config.py` and use `pydantic-settings`,
which reads a `backend/.env` file if present (gitignored).

To override defaults locally, create `backend/.env`:

```ini
# Example overrides — copy this file from .env.example if present
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5433/dpp_platform
JWT_SECRET=replace-me-with-a-real-secret
ADMIN_TOKEN=replace-me-too
```

**Never commit a real `.env`.** The `.gitignore` blocks `.env` and
`.env.*` (except `.env.example`). If you commit one by accident, rotate
the secret immediately and rewrite git history.

Default dev secrets in `config.py` (`change-me`, `change-me-admin`) are
**only safe for local development**. Any deployment must override them.

---

## Project layout

```
backend/
  app/
    main.py             # FastAPI entrypoint (app + CORS + health)
    api/v1/             # Versioned routes — all API lives here
      auth.py           #   /register, /login (JWT)
      dpp_creation.py   #   /dpp create, list
      audit.py          #   /audit upload, score
      users.py          #   /users dashboard
      admin.py          #   /admin/* (X-Admin-Token gated)
    core/
      config.py         # Settings (pydantic-settings)
      security.py       # JWT + password hashing (passlib + bcrypt)
      admin.py          # Admin token guard
    db/
      base.py           # SQLAlchemy declarative base
      session.py        # Engine + SessionLocal
      models.py         # ORM: User, DPP (with JSONB payload)
      init_db.py        # create_all on startup (no migrations yet)
    schemas/            # Pydantic request/response schemas
  ai/
    models/             # Placeholders for compliance & transformer models
                        #   — empty stubs, no LLM yet (see NEXT_STEPS.md)
  tests/                # Pytest — currently health-check only
  scripts/seed_user.py  # CLI to seed a test account
  requirements.txt
frontend/
  src/
    App.jsx             # React Router setup
    components/         # One folder per component (index.jsx inside)
    pages/              # Thin route wrappers
    utils/api.js        # All backend HTTP calls go here
    utils/auth.js       # Token + user storage in localStorage
    styles/             # Theme: light purple / pink / yellow
docs/                   # French planning artifacts (PDF)
docker-compose.yml      # Postgres for local dev
README.md               # User-facing project intro
CLAUDE.md               # Guide for AI assistants on this repo
NEXT_STEPS.md           # Active prioritization plan
PROJECT_LOG.txt         # Chronological dev log
```

For a deeper architectural overview, see `CLAUDE.md`. For what to build
next, see `NEXT_STEPS.md`.

---

## Running tests

```bash
cd backend
source .venv/bin/activate
pytest
```

Tests are sparse right now (a single health-check test). Adding tests
to features you touch is a high-value contribution.

---

## Known gotchas

These are real failure modes encountered during onboarding. If you hit
one, you're not alone — and the fix is documented here.

### conda + venv PATH shadowing

**Symptom:** You activate `.venv` (the prompt shows `(.venv)`), run
`uvicorn app.main:app`, and get
`ModuleNotFoundError: No module named 'jose'` — even though
`pip install` succeeded.

**Cause:** If `~/miniconda3/bin` is on your `PATH` (because conda's
`(base)` env is also active), the bare `uvicorn` command resolves to
**conda's** `uvicorn` binary, which uses conda's Python — not your
venv's. The `(.venv)` prompt is purely cosmetic; it does not guarantee
PATH supremacy.

**Fix:** Always invoke uvicorn through the venv's Python:

```bash
python -m uvicorn app.main:app --reload --port 8002
```

`python -m` resolves `uvicorn` from the currently running Python's
site-packages, sidestepping PATH lookup entirely. `python` itself is
correctly resolved by the venv's `activate` script.

Alternatively, use the absolute path: `.venv/bin/uvicorn ...`.

### Python 3.13 wheel gaps

**Symptom:** `pip install -r requirements.txt` fails building
`pydantic-core` or `psycopg2-binary` from source, with errors like
`pg_config executable not found` or
`Python interpreter version (3.13) is newer than PyO3's maximum supported version (3.12)`.

**Cause:** This `requirements.txt` was pinned in early 2024, before
Python 3.13's release. Several pinned native packages don't ship cp313
wheels, and source builds break on 3.13's stricter typing changes.

**Fix:** Use Python **3.12**. Either install it system-wide
(`apt install python3.12` on Ubuntu 24.04+) or via `pyenv`. Then:

```bash
rm -rf backend/.venv
python3.12 -m venv backend/.venv
```

Bumping pins to versions with 3.13 wheels (pydantic ≥ 2.10,
psycopg2-binary ≥ 2.9.10) is a viable alternative for someone who wants
to do that work — note that bumping pydantic from 2.6 to 2.10 may
require validating FastAPI compatibility.

### Windows-installed `node_modules` on Linux

**Symptom:** `npm run dev` errors with `sh: 1: vite: Permission denied`,
even though `npm install` succeeded.

**Cause:** `node_modules/` was installed on Windows and copied to Linux
(or vice versa). Execute bits get stripped by the FAT/NTFS round-trip.
You can spot the fingerprint: `node_modules/.bin/` contains `*.cmd` and
`*.ps1` files, and `node_modules/@esbuild/` has both `linux-x64` and
`win32-x64`.

**Fix (surgical):**

```bash
chmod +x frontend/node_modules/.bin/*
```

**Fix (clean):**

```bash
rm -rf frontend/node_modules frontend/package-lock.json
cd frontend && npm install
```

The clean fix also re-resolves any lockfile inconsistencies — preferred
if you're not in a hurry.

### Port collisions

**Symptom:** `Bind for 0.0.0.0:5432 failed: port is already allocated`
or `[Errno 98] address already in use`.

**Cause:** Another Postgres or backend already runs on the standard
ports. Common in setups where you have multiple projects.

**Fix:** This repo is configured to use non-default ports (Postgres
**5433**, backend **8002**) for exactly this reason. Don't change them
unless your machine doesn't have the collision.

If something else is also on 5433 or 8002, find and stop it:

```bash
ss -tlnp 'sport = :5433'
ss -tlnp 'sport = :8002'
docker ps   # see if another container holds the port
```

### Stale `backend/node_modules/`

**Note:** the repo currently contains a `backend/node_modules/` directory
left over from initial scaffolding. The backend is **Python**, not Node.
Ignore this directory — it's not part of the runtime. The `.gitignore`
blocks new files from being added to it, and a cleanup commit to remove
the stale tracked files is planned (see `NEXT_STEPS.md`).

---

## Branch and commit conventions

- **Branches:** `feat/<short-description>`, `fix/<short-description>`,
  `docs/<short-description>`, `chore/<short-description>`. Examples:
  `feat/battery-dpp-schema`, `fix/audit-upload-mime-type`.
- **Commit messages:** imperative mood, ≤ 70 chars in subject. Body is
  optional but encouraged for non-trivial changes (the *why*, not the
  *what*). Reference issue numbers when applicable.
- **PRs:** keep them focused. One feature, one fix, one PR. Smaller PRs
  get reviewed faster.

Example:

```
feat: add deterministic compliance check for battery DPPs

Implements check_battery_dpp() based on EU 2023/1542 Article 77.
Returns score 0-100 and list of violations with regulatory citations.
Phase 1 / Priority 4 from NEXT_STEPS.md.
```

---

## Reporting issues

When opening an issue, please include:

- What you were trying to do
- The exact command(s) you ran
- The full error output (no truncation)
- Your OS, Python version (`python --version`), and Node version
  (`node --version`)
- Whether you're on a fresh clone or an existing checkout

The "Known gotchas" section above is built from real reports. If you
hit something not covered there, you're helping future contributors by
documenting it.

---

## Where to start

If you're a new volunteer looking for somewhere to begin, see
`NEXT_STEPS.md` — it lists the current priorities in order. The top of
the queue is usually the highest-leverage place to contribute.

Welcome aboard.
