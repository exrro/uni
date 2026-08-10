"""Pydantic schemas for Course requests."""

from typing import Optional

from pydantic import BaseModel, Field


class CourseCreate(BaseModel):
    major: str = Field(..., min_length=2, max_length=80)
    title: str = Field(..., min_length=2, max_length=100)
    code: str = Field(..., min_length=2, max_length=20)
    units: int = Field(..., ge=1, le=5)
    capacity: int = Field(..., ge=1, le=200)
    professor_id: Optional[str] = Field(None, min_length=1, max_length=20)


class CourseUpdate(BaseModel):
    major: Optional[str] = Field(None, min_length=2, max_length=80)
    title: Optional[str] = Field(None, min_length=2, max_length=100)
    code: Optional[str] = Field(None, min_length=2, max_length=20)
    units: Optional[int] = Field(None, ge=1, le=5)
    capacity: Optional[int] = Field(None, ge=1, le=200)
    professor_id: Optional[str] = Field(None, min_length=1, max_length=20)
