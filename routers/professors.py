"""Professor routes.

Management endpoints (create/list/update/delete) and course assignment are
admin-only. The dashboard is available to the professor themselves or an admin.
"""

from fastapi import APIRouter, Depends, HTTPException

from exceptions.custom_exceptions import CourseSelectionException
from schemas.professor_schema import ProfessorCreate, ProfessorUpdate
from services import dashboard_services, professor_services, selection_services
from services.auth_services import is_admin, require_role

router = APIRouter(prefix="/professors", tags=["Professors"])


@router.post("/")
def create_professor(
    professor_data: ProfessorCreate,
    current_user: dict = Depends(require_role("admin")),
) -> dict:
    try:
        professor = professor_services.create_professor(professor_data)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return professor.to_dict()


@router.get("/")
def list_professors(current_user: dict = Depends(require_role("admin"))) -> list:
    try:
        professors = professor_services.get_all_professors()
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return [p.to_dict() for p in professors]


@router.get("/{personnel_code}")
def get_professor(
    personnel_code: str,
    current_user: dict = Depends(require_role("admin")),
) -> dict:
    try:
        professor = professor_services.get_professor_by_id(personnel_code)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return professor.to_dict()


@router.put("/{personnel_code}")
def update_professor(
    personnel_code: str,
    professor_data: ProfessorUpdate,
    current_user: dict = Depends(require_role("admin")),
) -> dict:
    try:
        professor = professor_services.update_professor(personnel_code, professor_data)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return professor.to_dict()


@router.delete("/{personnel_code}")
def delete_professor(
    personnel_code: str,
    current_user: dict = Depends(require_role("admin")),
) -> dict:
    try:
        professor_services.delete_professor(personnel_code)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return {"message": "Professor deleted successfully"}


@router.post("/{personnel_code}/courses/{course_code}")
def assign_professor_to_course(
    personnel_code: str,
    course_code: str,
    current_user: dict = Depends(require_role("admin")),
) -> dict:
    try:
        return selection_services.assign_professor_to_course(personnel_code, course_code)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)


@router.get("/{personnel_code}/dashboard")
def get_professor_dashboard(
    personnel_code: str,
    current_user: dict = Depends(require_role("professor")),
) -> dict:
    if not is_admin(current_user) and current_user["sub"] != personnel_code:
        raise HTTPException(status_code=403, detail="دسترسی مجاز نیست")
    return dashboard_services.get_professor_dashboard(personnel_code)
