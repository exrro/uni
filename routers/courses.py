"""Course routes.

Management endpoints (create/list/update/delete) are admin-only.
Grade/roster endpoints are for the owning professor or an admin.
"""

from fastapi import APIRouter, Depends, HTTPException

from exceptions.custom_exceptions import CourseSelectionException
from schemas.auth_schema import GradeSetRequest
from schemas.course_schema import CourseCreate, CourseUpdate
from services import course_services
from services.auth_services import get_current_user, is_admin, require_role

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.post("/")
def create_course(
    course_data: CourseCreate,
    current_user: dict = Depends(require_role("admin")),
) -> dict:
    try:
        course = course_services.create_course(course_data)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return course.to_dict()


@router.get("/")
def list_courses(current_user: dict = Depends(get_current_user)) -> list:
    # Any authenticated user (student, professor, admin) can list courses —
    # students need it for the "انتخاب واحد" modal.
    try:
        courses = course_services.get_all_courses()
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return [c.to_dict() for c in courses]


@router.get("/{course_code}")
def get_course(
    course_code: str,
    current_user: dict = Depends(get_current_user),
) -> dict:
    # Only admins or the professor who owns the course may view it.
    try:
        course = course_services.get_course_by_code(course_code)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    if not is_admin(current_user) and course.professor_id != current_user["sub"]:
        raise HTTPException(status_code=403, detail="دسترسی مجاز نیست")
    return course.to_dict()


@router.put("/{course_code}")
def update_course(
    course_code: str,
    course_data: CourseUpdate,
    current_user: dict = Depends(require_role("admin")),
) -> dict:
    try:
        course = course_services.update_course(course_code, course_data)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return course.to_dict()


@router.delete("/{course_code}")
def delete_course(
    course_code: str,
    current_user: dict = Depends(require_role("admin")),
) -> dict:
    try:
        course_services.delete_course(course_code)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return {"message": "Course deleted successfully"}


@router.get("/{course_code}/students")
def get_course_students(
    course_code: str,
    current_user: dict = Depends(require_role("professor")),
) -> list:
    course = course_services.get_course_by_code(course_code)
    if not is_admin(current_user) and course.professor_id != current_user["sub"]:
        raise HTTPException(status_code=403, detail="دسترسی مجاز نیست")
    students = course_services.get_students_in_course(course_code)
    return [s.to_dict() for s in students]


@router.post("/{course_code}/grades/{student_number}")
def set_course_grade(
    course_code: str,
    student_number: str,
    grade_data: GradeSetRequest,
    current_user: dict = Depends(require_role("professor")),
) -> dict:
    course = course_services.get_course_by_code(course_code)
    if not is_admin(current_user) and course.professor_id != current_user["sub"]:
        raise HTTPException(status_code=403, detail="دسترسی مجاز نیست")
    try:
        course = course_services.set_grade(course_code, student_number, grade_data.grade)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return course.to_dict()


@router.delete("/{course_code}/students/{student_number}")
def block_student_from_course(
    course_code: str,
    student_number: str,
    current_user: dict = Depends(require_role("professor")),
) -> dict:
    course = course_services.get_course_by_code(course_code)
    if not is_admin(current_user) and course.professor_id != current_user["sub"]:
        raise HTTPException(status_code=403, detail="دسترسی مجاز نیست")
    try:
        course = course_services.block_student(course_code, student_number)
    except CourseSelectionException as e:
        raise HTTPException(status_code=400, detail=e.message)
    return course.to_dict()
