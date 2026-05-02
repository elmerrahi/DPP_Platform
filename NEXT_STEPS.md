# DPP_Platform — Next Steps & Priorities

> **Audience:** Young AI Leaders – French Hub volunteers contributing to DPP_Platform.
> **Last updated:** 2026-05-02
> **Status:** Living document — update as priorities shift.

This document is a pragmatic prioritization plan calibrated for the project's
real constraints: **zero monetary budget**, **volunteer part-time effort**,
and **French association** structure. It is grounded in the planning artifacts
in `docs/` (especially `6- Roadmap produit.pdf` and `5- Gouvernance IA et conformité.pdf`)
and the current state of the codebase.

---

## Where the project stands

Existing scaffolding represents roughly **40% of Phase 1 (MVP)** as defined in
`docs/6- Roadmap produit.pdf`.

**Built and working:**
- FastAPI backend with versioned routes (`/api/v1/auth`, `/dpp`, `/audit`, `/users`, `/admin`)
- JWT authentication, password hashing, X-Admin-Token gate for admin endpoints
- Postgres with JSONB DPP payloads (flexibility-first schema decision is correct)
- React frontend with all planned pages (landing, auth, dashboard, DPP create, audit) and routing
- Local-dev Docker compose for Postgres
- Health check endpoint and a single passing test

**Missing or stub-only:**
- `backend/ai/models/compliance_model.py` and `transformer_model.py` are empty placeholders
- Audit endpoint exists but has no real OCR, scoring, or incoherence detection
- `DppForm` and `AuditResults` frontend components likely not fully wired to the backend
- No chatbot, no regulatory watch, no ERP/PLM integration (these are Phase 2/3 anyway)
- No Alembic migrations (only SQLAlchemy `create_all`)
- No `.gitignore` (significant footgun — see Priority 3)
- No audit trail per DPP, no version history tables
- Default secrets in source (`config.py`: `jwt_secret="change-me"`, `admin_token="change-me-admin"`)
- README documents Windows-style venv activation; bare `uvicorn` command shadowed by conda
- Tests beyond a single health check do not exist

This is a fine starting point. It is also fragile if more volunteers join —
onboarding friction will kill the project faster than any missing feature.

---

## Strategic principles

1. **Phase 1 is deterministic, not AI-powered.** Your `docs/6- Roadmap produit.pdf`
   explicitly defers AI-powered scoring, chatbot, and regulatory watch to
   Phases 2-3. Resist the temptation to skip ahead — `docs/5- Gouvernance IA.pdf`
   imposes strict requirements on AI features (mandatory source citations,
   per-DPP audit trail, model/prompt versioning, human validation gate)
   that you cannot meet without infrastructure that doesn't exist yet.
2. **Free-tier first, open-source second, paid only with grant funding.**
   No exceptions. Every dependency added has a cost-of-future-deployment.
3. **Demoable value over architectural ambition.** Volunteer projects that
   try to build "the right architecture" before shipping anything tend to
   ship nothing. Build the smallest end-to-end slice, get feedback, iterate.
4. **Onboarding friction is project risk.** Every contributor lost at setup
   is a feature you won't ship. A 30-minute onboarding is non-negotiable.

---

## Top 5 priorities (this quarter)

### Priority 1 — Pick ONE product category and lock its DPP schema *(this week)*

The single highest-leverage decision available. `docs/4- Référentiel réglementaire.pdf`
lists multiple categories (Textiles, Batteries, Electronics) — building for
"all of them" is how volunteer projects die.

**Recommendation: batteries.**
- **Battery Regulation EU 2023/1542** is the most mature DPP-mandating law
  (already in force as of February 2024 for industrial and EV batteries).
- The regulation enumerates **specific mandatory fields** (carbon footprint,
  recycled content %, hazardous substances, supply chain due diligence) —
  clean inputs for deterministic validation.
- The EU **CIRPASS-2** project has published a draft battery DPP data model
  in JSON-LD. Adopt it instead of inventing one.
- Public reference DPPs exist (Volvo, BMW have shipped early prototypes) —
  ground-truth examples for testing.

**Concrete deliverable:** a JSON-LD schema file at
`backend/app/schemas/battery_dpp_schema.json` listing every mandatory field
with its regulatory citation (e.g., `EU 2023/1542 Article 77 §2(a)`). This
single file unlocks: form generation, deterministic compliance checking,
audit logic, export validation.

### Priority 2 — Wire the existing form → backend end-to-end *(this week)*

`DppForm` (frontend) and `POST /api/v1/dpp` (backend) both exist and are
probably not fully connected. Make the create flow demoable: user fills
form → POST → DB row → success page → list view. **No AI, no scoring, no
audit.** Just CRUD against the battery schema from Priority 1.

This is the smallest demoable unit of value and the only way to start
getting feedback from anyone (compliance officer, manufacturer, fellow
association member) outside the dev team.

### Priority 3 — `.gitignore` + secrets hygiene *(today, ~1 hour)*

The repo currently has **no `.gitignore`**. Combined with default secrets
in `backend/app/core/config.py` (`jwt_secret = "change-me"`,
`admin_token = "change-me-admin"`), this is a foreseeable footgun. The next
volunteer who creates a `.env` with real credentials will commit it.

**Minimum viable `.gitignore`:**

```gitignore
# Python
backend/.venv/
**/__pycache__/
*.pyc
*.pyo
*.pyd

# Node
frontend/node_modules/
frontend/dist/
backend/node_modules/   # leftover cruft, should be deleted

# Env / secrets
**/.env
**/.env.local
**/.env.*.local
!**/.env.example

# OS / editor
.DS_Store
.vscode/
.idea/

# Logs
*.log
```

Move dev secrets to a committed `.env.example` (with `change-me` placeholders)
and require real values via `.env` (gitignored). `pydantic-settings` already
supports this in `backend/app/core/config.py:5`.

### Priority 4 — Deterministic compliance checker *(2-3 weeks)*

Once Priority 1 (schema) is locked, this is a **pure Python function** —
no AI, no external API:

```python
def check_battery_dpp(payload: dict) -> ComplianceReport:
    """
    Returns score 0-100 + list of violations.

    Score = % of mandatory fields present that pass type/range/coherence checks.
    Each violation cites the regulatory article it derives from.
    """
```

This is your **MVP "audit"**. It's the deterministic-rules-only version of
what `docs/5- Gouvernance IA.pdf` insists must come *before* AI:

> "Règles déterministes pour les contrôles critiques."

Wire it to the existing `/audit` endpoint and the `AuditResults` frontend
component. Then you have: create DPP → check DPP → see compliance report.
**That's a usable product**, even without AI.

### Priority 5 — `CONTRIBUTING.md` and 30-minute onboarding *(this week, ~1 day)*

Volunteer projects fail at the onboarding step. Recent setup of this repo
took ~2 hours because of port conflicts, Python 3.13 wheel gaps, miniconda
PATH shadowing, and a `node_modules` previously installed on Windows. Every
future volunteer will hit some subset of these.

**A `CONTRIBUTING.md` should contain:**

- **Prerequisites** with exact versions: Python **3.12** (not 3.13 — wheel
  coverage gaps), Node **20.x**, Docker, optional pyenv/nvm
- **The exact commands that work**, including:
  - `python -m uvicorn app.main:app --reload --port 8002`
    (NOT bare `uvicorn` — it gets shadowed by conda's binary if present)
  - Database on host port **5433** (not 5432, to avoid collision with
    other Postgres containers many volunteers run)
- **Known gotchas** documented:
  - Conda + venv interaction (PATH may shadow venv)
  - Windows-installed `node_modules` strip exec bits — fix with
    `chmod +x node_modules/.bin/*` or `rm -rf node_modules && npm install`
  - Python 3.13 + pinned `pydantic-core 2.16.2` requires Rust source
    build that fails on 3.13; either use 3.12 or bump pydantic to ≥2.10
- **Smoke test:** `curl http://localhost:8002/health` returns
  `{"status":"ok"}` after both servers boot
- **Branch naming**, commit message conventions, PR review expectations

Goal: **30 minutes from `git clone` to a running stack.**

---

## What NOT to do yet (deliberately deferred)

| Defer | Why |
|---|---|
| LLM-powered compliance scoring | API costs money; `docs/5- Gouvernance IA.pdf` governance bar (source citations, audit trail, versioning) needs infrastructure that doesn't exist yet |
| Chatbot ("Expert DPP Assistant") | Same as above + must cite sources per `docs/5` = needs a regulatory knowledge base you haven't built |
| Regulatory watch (EUR-Lex / ISO ingestion) | Massive scope: scrapers + classifiers + alerts. Phase 3 in `docs/6` |
| ERP / PLM API integrations | Phase 3+. Until you have one pilot client, this is premature |
| Multi-tenant isolation | Required by `docs/5` *eventually*. Single-tenant is fine for pilot users; Postgres row-level security can be retrofitted later |
| Custom AI model training | No GPUs, training data, or labelers. Use Anthropic / OpenAI APIs *if* Phase 2 reaches grant funding |

---

## Free-tier deployment stack (matches the zero-budget reality)

| Layer | Free service | Why |
|---|---|---|
| Frontend (Vite/React) | **Vercel Hobby** | Free SSL, custom domain, Vite-native, generous bandwidth |
| Backend (FastAPI) | **Fly.io** free tier (3 shared VMs) or **Render** free (sleeps when idle, fine for pilot) | First-class FastAPI + Docker support |
| Postgres | **Supabase** free tier (500 MB) or **Neon** (0.5 GB, scale-to-zero) | Either holds hundreds of DPPs |
| File storage (audit uploads) | **Supabase Storage** or **Cloudflare R2** (10 GB free) | Both handle PDFs/JSON cheaply |
| CI/CD | **GitHub Actions** (2000 min/month free; **unlimited** for public repos) | Lint + tests + deploy hooks |
| Docs site | **GitHub Pages** | Free static hosting |
| AI (Phase 2 only) | **Anthropic** ($5 free credits) + **OpenRouter** free models for prototyping | Don't deploy until budget plan exists |

The single most important meta-decision: **make the repository public on
GitHub**. Free CI minutes go from 2000/month to unlimited, free Vercel
deploys are easier, volunteer recruiting is easier, and the open-source
posture aligns with EU regulatory/CIRPASS values, which strengthens grant
applications.

---

## French / association leverage points

These are real funding and partnership paths an association working on EU
compliance tooling can pursue. They are not promises — they are leads to
investigate when capacity allows.

- **CIRPASS-2** (the EU project defining DPP standards) actively wants
  reference implementations. Aligning with their data model is mutually
  beneficial. Even without money, the *legitimacy stamp* matters for grant
  applications.
- **ADEME** (Agence de la transition écologique) funds environmental
  compliance tooling. ESPR is squarely in their remit.
- **France 2030 / Bpifrance** "Numérique vert" calls fund associations on
  the digital sustainability axis.
- **Hugging Face Climate / OSS Grants** — once Phase 2 introduces the
  AI-powered scoring, this becomes plausible.
- **University partnerships** — Sorbonne, INSA, Polytechnique have student
  capstone projects. A DPP compliance platform is an excellent semester-long
  project for MS students. They contribute for academic credit; you mentor.
- **NLnet / Sovereign Tech Fund / Mozilla** — open-source-specific funders
  who care about EU regulatory tooling.

---

## This week's concrete plan

If volunteers want a kanban-ready week, this is it:

| Day | Task | Outcome |
|---|---|---|
| Mon | Add `.gitignore`, move dev secrets to `.env.example` | No more accidental secret commits |
| Mon-Tue | Read CIRPASS-2 battery DPP draft + EU 2023/1542 Article 77; write `battery_dpp_schema.json` with citations | Schema locked |
| Tue-Wed | Wire `DppForm` (frontend) → `POST /api/v1/dpp` (backend) using the schema | Demoable creation flow |
| Wed | Update `README.md` with the *actual working* commands (`python -m uvicorn ...`, port 8002, DB on 5433) | New volunteers don't lose 2 h on setup |
| Thu | Write `CONTRIBUTING.md` with prereqs, smoke test, known gotchas | 30-minute onboarding |
| Fri | Sketch `check_battery_dpp()` signature + first 3 deterministic rules (mandatory fields presence, no negative weights, recycled % ≤ 100) | Foundation for Priority 4 |

If only **two** things ship this week, do `.gitignore` and the schema file.
Everything else compounds from those.

---

## Open questions for the maintainer

These are decisions that need a human call before implementation can proceed:

1. **Public or private GitHub repo?** Public unlocks unlimited CI, easier
   volunteer recruiting, and grant-application credibility. The downside is
   visibility of in-progress work and any unintentionally committed secrets.
2. **Single product category for MVP** — confirm batteries, or pick a
   different one if the team has stronger domain knowledge in textiles or
   electronics.
3. **Hosting provider for first deploy** — Fly.io vs. Render for backend,
   Vercel vs. Cloudflare Pages for frontend. Trial both with a "hello world"
   deploy before committing.
4. **Which volunteers own which priority?** Work assignment matters more
   than the priority list itself; without owners, nothing ships.
