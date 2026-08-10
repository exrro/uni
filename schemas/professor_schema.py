"""Pydantic schemas for Professor requests."""

from typing import Optional

from pydantic import BaseModel, Field


class ProfessorCreate(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    personnel_code: str = Field(..., min_length=3, max_length=20)
    department: str = Field(..., min_length=2, max_length=80)


class ProfessorUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=2, max_length=50)
    last_name: Optional[str] = Field(None, min_length=2, max_length=50)
    personnel_code: Optional[str] = Field(None, min_length=3, max_length=20)
    department: Optional[str] = Field(None, min_length=2, max_length=80)
