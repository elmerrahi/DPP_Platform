from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db import models
from app.db.session import get_db
from app.schemas.dpp_schema import DPPCreate, DPPResponse

router = APIRouter(prefix="/dpp", tags=["dpp"])


@router.post("", response_model=DPPResponse, status_code=status.HTTP_201_CREATED)
def create_dpp(
    payload: DPPCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    data_payload = payload.model_dump()
    data_payload.pop("productName", None)
    data_payload.pop("productId", None)

    dpp = models.DPP(
        owner_id=user.id,
        product_name=payload.productName,
        product_id=payload.productId,
        data=data_payload,
    )
    db.add(dpp)
    db.commit()
    db.refresh(dpp)

    return DPPResponse(
        id=dpp.id,
        productName=dpp.product_name,
        productId=dpp.product_id,
        createdAt=dpp.created_at,
        data=dpp.data,
    )


@router.get("", response_model=list[DPPResponse])
def list_dpps(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    dpps = db.query(models.DPP).filter(models.DPP.owner_id == user.id).all()
    return [
        DPPResponse(
            id=item.id,
            productName=item.product_name,
            productId=item.product_id,
            createdAt=item.created_at,
            data=item.data,
        )
        for item in dpps
    ]