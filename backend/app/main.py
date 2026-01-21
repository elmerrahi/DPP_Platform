from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import audit, dpp_creation, auth, users, admin
from app.core.config import settings
from app.db.init_db import init_db

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(dpp_creation.router, prefix="/api/v1")
app.include_router(audit.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")


@app.on_event("startup")
def startup_event():
    init_db()


@app.get("/health")
def health_check():
    return {"status": "ok"}
