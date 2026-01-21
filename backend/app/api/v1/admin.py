from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.admin import require_admin
from app.db import models
from app.db.session import get_db
from app.schemas.dpp_schema import UserOut

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=list[UserOut], dependencies=[Depends(require_admin)])
def list_users(db: Session = Depends(get_db)):
    users = db.query(models.User).order_by(models.User.created_at.desc()).all()
    return [
        UserOut(
            id=user.id,
            name=user.name,
            email=user.email,
            created_at=user.created_at,
        )
        for user in users
    ]
