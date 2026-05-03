from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dpp_validator import validate_battery_dpp
from app.core.security import get_current_user
from app.db import models
from app.db.session import get_db
from app.schemas.dpp_schema import (
    DPPCreate,
    DPPResponse,
    DPPValidationErrorResponse,
)

router = APIRouter(prefix="/dpp", tags=["dpp"])


def _derive_listing_fields(payload: dict) -> tuple[str, str]:
    """Extract the two denormalized columns we use for listings.

    Both fields are guaranteed present because validation ran first.
    """
    general = payload["general_info"]
    product_id = general["battery_passport_identification"]
    product_name = general["battery_identification"]["model_identification"]
    return product_name, product_id


@router.post(
    "",
    response_model=DPPResponse,
    status_code=status.HTTP_201_CREATED,
    responses={422: {"model": DPPValidationErrorResponse}},
)
def create_dpp(
    body: DPPCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    errors = validate_battery_dpp(body.payload)
    if errors:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "detail": "Battery DPP validation failed",
                "errors": [e.to_dict() for e in errors],
            },
        )

    product_name, product_id = _derive_listing_fields(body.payload)
    dpp = models.DPP(
        owner_id=user.id,
        product_name=product_name,
        product_id=product_id,
        data=body.payload,
    )
    db.add(dpp)
    db.commit()
    db.refresh(dpp)

    return DPPResponse(
        id=dpp.id,
        product_name=dpp.product_name,
        product_id=dpp.product_id,
        created_at=dpp.created_at,
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
            product_name=item.product_name,
            product_id=item.product_id,
            created_at=item.created_at,
            data=item.data,
        )
        for item in dpps
    ]
