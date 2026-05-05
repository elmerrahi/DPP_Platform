from fastapi import APIRouter, Depends, File, UploadFile
from pydantic import BaseModel

from ai.models.transformer_model import run_transformer_insights
from ai.models.compliance_model import score_compliance
from app.core.security import get_current_user
from app.schemas.dpp_schema import AuditResponse

router = APIRouter(prefix="/audit", tags=["audit"])


@router.post("", response_model=AuditResponse)
def audit_dpp(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
):
    payload = {
        "filename": file.filename,
        "content_type": file.content_type,
        "owner_id": str(user.id),
    }
    result = score_compliance(payload)
    return AuditResponse(**result)


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
def chat_with_llm(payload: ChatRequest):
    return run_transformer_insights({"message": payload.message})