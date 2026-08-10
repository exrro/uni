"""Pydantic schemas for Student requests."""

from typing import Optional

from pydantic import BaseModel, Field


class StudentCreate(BaseModel):
    national_id: str = Field(..., min_length=10, max_length=10, pattern=r"^[0-9]{10}$")
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    student_number: str = Field(..., min_length=3, max_length=20)
    major: str = Field(..., min_length=2, max_length=80)
    has_access: bool = False


class StudentUpdate(BaseModel):
    national_id: Optional[str] = Field(None, min_length=10, max_length=10, pattern=r"^[0-9]{10}$")
    first_name: Optional[str] = Field(None, min_length=2, max_length=50)
    last_name: Optional[str] = Field(None, min_length=2, max_length=50)
    student_number: Optional[str] = Field(None, min_length=3, max_length=20)
    major: Optional[str] = Field(None, min_length=2, max_length=80)
