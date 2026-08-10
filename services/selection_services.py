"""Business logic for course selection, dropping, and professor assignment."""

from exceptions.custom_exceptions import (
    CourseFullException,
    StudentAccessDeniedException,
    StudentAlreadyEnrolledException,
    StudentBlockedException,
    StudentNotEnrolledException,
)
from models.course import Course
from models.student import Student
from services.course_services import get_course_by_code
from services.professor_services import get_professor_by_id
from services.student_services import get_student_by_id
from storage import storage


def select_course_for_student(student_number: str, course_code: str) -> dict:
    """Enroll a student in a course on both the course and the student side."""
    student = get_student_by_id(student_number)
    course = get_course_by_code(course_code)

    if not student.has_access:
        raise StudentAccessDeniedException(
            f"Student {student_number} does not have access to select courses"
        )

    if student_number in course.blocked_students:
        raise StudentBlockedException(
            f"Student {student_number} is blocked from course {course_code} by the professor"
        )
    if course.is_full():
        raise CourseFullException(f"Course {course_code} is full")
    if student_number in course.students:
        raise StudentAlreadyEnrolledException(
            f"Student {student_number} is already enrolled in course {course_code}"
        )

    course.add_student(student_number)
    student.select_course(course_code)
    storage.save_all()

    return {"message": f"Student {student_number} selected course {course_code} successfully"}


def drop_course_for_student(student_number: str, course_code: str) -> dict:
    """Remove a student from a course on both the course and the student side."""
    student = get_student_by_id(student_number)
    course = get_course_by_code(course_code)

    if student_number not in course.students:
        raise StudentNotEnrolledException(
            f"Student {student_number} is not enrolled in course {course_code}"
        )

    course.remove_student(student_number)
    student.drop_course(course_code)
    storage.save_all()

    return {"message": f"Student {student_number} dropped course {course_code} successfully"}


def get_student_courses(student_number: str) -> list[Course]:
    """Return the Course objects for all courses selected by a student."""
    student = get_student_by_id(student_number)
    return [get_course_by_code(course_code) for course_code in student.selected_courses]


def assign_professor_to_course(personnel_code: str, course_code: str) -> dict:
    """Assign a professor to a course on both the professor and the course side."""
    professor = get_professor_by_id(personnel_code)
    course = get_course_by_code(course_code)

    course.assign_professor(personnel_code)
    professor.assign_course(course_code)
    storage.save_all()

    return {"message": f"Professor {personnel_code} assigned to course {course_code} successfully"}
