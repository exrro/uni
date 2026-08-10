"""Pydantic schemas for authentication requests."""

from typing import Literal

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    role: Literal["student", "professor", "admin"]
    identifier: str = Field(..., min_length=1, max_length=50)
    secondary: str = Field(..., min_length=1, max_length=50)


class GradeSetRequest(BaseModel):
    grade: float = Field(..., ge=0, le=20)


class AccessGrantRequest(BaseModel):
    has_access: bool = True
