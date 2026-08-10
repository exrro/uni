"""Authentication routes."""

import time

from fastapi import APIRouter, HTTPException, Request

from schemas.auth_schema import LoginRequest
from services import auth_services

router = APIRouter(prefix="/auth", tags=["Auth"])

# Simple in-memory token bucket per IP to prevent brute force on login.
_MAX_ATTEMPTS = 10
_WINDOW_SECONDS = 60.0
_attempts: dict = {}


def _check_rate_limit(client_ip: str) -> None:
    now = time.monotonic()
    bucket = _attempts.get(client_ip)
    if bucket is None or now - bucket["start"] > _WINDOW_SECONDS:
        _attempts[client_ip] = {"start": now, "count": 1}
        return
    bucket["count"] += 1
    if bucket["count"] > _MAX_ATTEMPTS:
        raise HTTPException(
            status_code=429,
            detail="تعداد تلاش‌های ناموفق بیش از حد مجاز است؛ لطفاً بعداً دوباره تلاش کنید",
        )


@router.post("/login")
def login(request: Request, login_data: LoginRequest) -> dict:
    _check_rate_limit(request.client.host if request.client else "unknown")
    try:
        return auth_services.login(login_data.role, login_data.identifier, login_data.secondary)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail="درخواست نامعتبر است")
