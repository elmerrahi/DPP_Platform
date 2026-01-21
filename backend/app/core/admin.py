from fastapi import Depends, Header, HTTPException, status

from app.core.config import settings


def require_admin(x_admin_token: str = Header(default="")) -> None:
    if not x_admin_token or x_admin_token != settings.admin_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token",
        )
