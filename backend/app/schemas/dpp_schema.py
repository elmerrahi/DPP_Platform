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
    productName: str = Field(min_length=2, max_length=255)
    productId: str = Field(min_length=2, max_length=120)
    manufacturer: str = Field(min_length=2, max_length=255)
    category: Optional[str] = None
    origin: Optional[str] = None
    materials: Optional[str] = None
    lifecycleFootprint: Optional[str] = None
    certifications: Optional[str] = None
    extraData: Dict[str, Any] = Field(default_factory=dict)


class DPPResponse(BaseModel):
    id: UUID
    productName: str
    productId: str
    createdAt: datetime
    data: Dict[str, Any]


class AuditResponse(BaseModel):
    score: float
    coverage: str
    findings: str


class DashboardResponse(BaseModel):
    user: UserOut
    dpp_count: int
    recent_dpps: list[DPPResponse]
