from datetime import datetime
from typing import Any, Dict, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=72)


class UserOut(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AuthResponse(Token):
    user: UserOut


class DPPCreate(BaseModel):
    """Battery DPP creation payload — validated against battery_dpp_schema.json.

    Pydantic does only a minimal envelope check (must be a dict). The
    structural and field-level validation lives in
    `app.core.dpp_validator.validate_battery_dpp` and the JSON Schema it
    loads. This separation keeps the schema as the single source of truth.
    """

    payload: Dict[str, Any] = Field(
        ...,
        description=(
            "Full battery DPP document conforming to "
            "battery_dpp_schema.json — see backend/app/schemas/."
        ),
    )


class DPPResponse(BaseModel):
    id: UUID
    product_name: str = Field(
        description="Derived from general_info.battery_identification.model_identification"
    )
    product_id: str = Field(
        description="Derived from general_info.battery_passport_identification"
    )
    created_at: datetime
    data: Dict[str, Any]


class DPPValidationErrorItem(BaseModel):
    path: str
    message: str


class DPPValidationErrorResponse(BaseModel):
    detail: str = "Battery DPP validation failed"
    errors: list[DPPValidationErrorItem]


class AuditResponse(BaseModel):
    score: float
    coverage: str
    findings: str


class DashboardResponse(BaseModel):
    user: UserOut
    dpp_count: int
    recent_dpps: list[DPPResponse]
