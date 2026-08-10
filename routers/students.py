"""Student routes.

Management endpoints (create/list/update/delete) are admin-only.
The dashboard is available to the student themselves or to an admin.
"""

from fastapi import APIRouter, Depends, HTTPException

from exceptions.custom_exceptions import CourseSelectionException
from schemas.student_schema import StudentCreate, StudentUpdate
from services import dashboard_services, student_services
from services.auth_services import is_admin, require_role

router = APIRouter(prefix="/students", tags=["Students"])


@router.post("/")
def create_student(
    student_data: StudentCreate,
    current_user: dict = Depends(require_role("admin")),
) -> dict:
    try:
        student = student_services.create_student(student_data)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return student.to_dict()


@router.get("/")
def list_students(current_user: dict = Depends(require_role("admin"))) -> list:
    try:
        students = student_services.get_all_students()
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return [s.to_dict() for s in students]


@router.get("/{student_number}")
def get_student(
    student_number: str,
    current_user: dict = Depends(require_role("admin")),
) -> dict:
    try:
        student = student_services.get_student_by_id(student_number)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return student.to_dict()


@router.put("/{student_number}")
def update_student(
    student_number: str,
    student_data: StudentUpdate,
    current_user: dict = Depends(require_role("admin")),
) -> dict:
    try:
        student = student_services.update_student(student_number, student_data)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return student.to_dict()


@router.delete("/{student_number}")
def delete_student(
    student_number: str,
    current_user: dict = Depends(require_role("admin")),
) -> dict:
    try:
        student_services.delete_student(student_number)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return {"message": "Student deleted successfully"}


@router.get("/{student_number}/dashboard")
def get_student_dashboard(
    student_number: str,
    current_user: dict = Depends(require_role("student")),
) -> dict:
    if not is_admin(current_user) and current_user["sub"] != student_number:
        raise HTTPException(status_code=403, detail="دسترسی مجاز نیست")
    return dashboard_services.get_student_dashboard(student_number)
