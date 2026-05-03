from fastapi import APIRouter, Depends
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db import models
from app.db.session import get_db
from app.schemas.dpp_schema import DashboardResponse, DPPResponse, UserOut

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def get_me(user: models.User = Depends(get_current_user)):
    return UserOut(
        id=user.id,
        name=user.name,
        email=user.email,
        created_at=user.created_at,
    )


@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    dpp_count = db.query(models.DPP).filter(models.DPP.owner_id == user.id).count()
    recent = (
        db.query(models.DPP)
        .filter(models.DPP.owner_id == user.id)
        .order_by(desc(models.DPP.created_at))
        .limit(5)
        .all()
    )

    recent_items = [
        DPPResponse(
            id=item.id,
            product_name=item.product_name,
            product_id=item.product_id,
            created_at=item.created_at,
            data=item.data,
        )
        for item in recent
    ]

    return DashboardResponse(
        user=UserOut(
            id=user.id,
            name=user.name,
            email=user.email,
            created_at=user.created_at,
        ),
        dpp_count=dpp_count,
        recent_dpps=recent_items,
    )
