"""Selection routes — course selection for students.

Available to the student themselves or to an admin.
"""

from fastapi import APIRouter, Depends, HTTPException

from exceptions.custom_exceptions import CourseSelectionException
from services import selection_services
from services.auth_services import is_admin, require_role

router = APIRouter(prefix="/selection", tags=["Selection"])


@router.get("/{student_number}/courses")
def get_student_courses(
    student_number: str,
    current_user: dict = Depends(require_role("student")),
) -> list:
    if not is_admin(current_user) and current_user["sub"] != student_number:
        raise HTTPException(status_code=403, detail="دسترسی مجاز نیست")
    try:
        courses = selection_services.get_student_courses(student_number)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return [c.to_dict() for c in courses]


@router.post("/{student_number}/{course_code}")
def select_course(
    student_number: str,
    course_code: str,
    current_user: dict = Depends(require_role("student")),
) -> dict:
    if not is_admin(current_user) and current_user["sub"] != student_number:
        raise HTTPException(status_code=403, detail="دسترسی مجاز نیست")
    try:
        return selection_services.select_course_for_student(student_number, course_code)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)


@router.delete("/{student_number}/{course_code}")
def drop_course(
    student_number: str,
    course_code: str,
    current_user: dict = Depends(require_role("student")),
) -> dict:
    if not is_admin(current_user) and current_user["sub"] != student_number:
        raise HTTPException(status_code=403, detail="دسترسی مجاز نیست")
    try:
        return selection_services.drop_course_for_student(student_number, course_code)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
