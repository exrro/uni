"""JWT authentication services."""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from storage import storage

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

bearer_scheme = HTTPBearer(auto_error=False)

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin"
# Hashed with bcrypt in code; never stored in JSON.
ADMIN_PASSWORD_HASH = bcrypt.hashpw(ADMIN_PASSWORD.encode(), bcrypt.gensalt()).decode()


def hash_password(password: str) -> str:
    """Return a bcrypt hash for the given password."""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against a bcrypt hash."""
    try:
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except (ValueError, TypeError):
        return False


def _create_token(sub: str, role: str) -> str:
    """Create a signed JWT with the given subject and role."""
    now = datetime.now(timezone.utc)
    payload = {
        "sub": sub,
        "role": role,
        "iat": now,
        "exp": now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def _find_student(national_id: str, student_number: str) -> Optional[object]:
    """Find a student matching both national id and student number."""
    for student in storage.students.values():
        if student.national_id == national_id and student.student_number == student_number:
            return student
    return None


def _find_professor(personnel_code: str) -> Optional[object]:
    """Find a professor by personnel code (unique)."""
    for professor in storage.professors.values():
        if professor.personnel_code == personnel_code:
            return professor
    return None


def login(role: str, identifier: str, secondary: str) -> dict:
    """Authenticate a user and return a JWT."""
    if role == "admin":
        if identifier == ADMIN_USERNAME and verify_password(secondary, ADMIN_PASSWORD_HASH):
            token = _create_token(sub=ADMIN_USERNAME, role="admin")
            return {
                "access_token": token,
                "role": "admin",
                "sub": ADMIN_USERNAME,
                "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            }
        raise HTTPException(status_code=401, detail="نام کاربری یا رمز عبور اشتباه است")

    if role == "student":
        student = _find_student(identifier, secondary)
        if student is None:
            raise HTTPException(status_code=401, detail="کد ملی یا شماره دانشجویی اشتباه است")
        sub = student.student_number
    elif role == "professor":
        # Professors log in with their personnel code only (unique). The
        # secondary field is accepted but ignored for the professor role.
        professor = _find_professor(identifier)
        if professor is None:
            raise HTTPException(status_code=401, detail="کد استادی اشتباه است")
        sub = professor.personnel_code
    else:
        raise HTTPException(status_code=400, detail="نقش نامعتبر است")

    token = _create_token(sub=sub, role=role)
    return {
        "access_token": token,
        "role": role,
        "sub": sub,
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> dict:
    """Validate the Bearer token and return its payload."""
    if credentials is None:
        raise HTTPException(status_code=401, detail="لطفاً ابتدا وارد شوید")
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="نشست شما نامعتبر یا منقضی شده است")
    sub = payload.get("sub")
    role = payload.get("role")
    if not sub or not role:
        raise HTTPException(status_code=401, detail="نشست شما نامعتبر است")
    return {"sub": sub, "role": role}


def require_role(role: str):
    """Return a dependency that enforces the given role (admin is a superuser)."""

    def dependency(current_user: dict = Depends(get_current_user)) -> dict:
        if current_user["role"] != role and current_user["role"] != "admin":
            raise HTTPException(status_code=403, detail="دسترسی مجاز نیست")
        return current_user

    return dependency


def is_admin(current_user: dict) -> bool:
    """Return True if the authenticated user is an admin."""
    return current_user["role"] == "admin"
