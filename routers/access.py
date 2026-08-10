"""Access-control routes — admin only."""

from fastapi import APIRouter, Depends, HTTPException

from exceptions.custom_exceptions import CourseSelectionException
from schemas.auth_schema import AccessGrantRequest
from services import access_services
from services.auth_services import require_role

router = APIRouter(prefix="/access", tags=["Access"])


@router.post("/students/all")
def grant_all_students_access(
    current_user: dict = Depends(require_role("admin")),
) -> dict:
    return access_services.grant_access_to_all()


@router.get("/students")
def list_students_access(current_user: dict = Depends(require_role("admin"))) -> list:
    return access_services.get_students_access()


@router.post("/students/{student_number}")
def set_student_access(
    student_number: str,
    body: AccessGrantRequest,
    current_user: dict = Depends(require_role("admin")),
) -> dict:
    try:
        student = (
            access_services.grant_access(student_number)
            if body.has_access
            else access_services.revoke_access(student_number)
        )
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return student.to_dict()
