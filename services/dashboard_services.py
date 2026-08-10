"""Dashboard aggregation services."""

from exceptions.custom_exceptions import (
    CourseNotFoundException,
    ProfessorNotFoundException,
    StudentNotFoundException,
)
from services.course_services import get_course_by_code
from storage import storage


def get_student_dashboard(student_number: str) -> dict:
    """Aggregate a student's dashboard data."""
    student = storage.students.get(student_number)
    if student is None:
        raise StudentNotFoundException(f"Student with number {student_number} not found")

    courses = []
    total_units = 0
    graded = []
    for course_code in student.selected_courses:
        course = storage.courses.get(course_code)
        if course is None:
            continue
        professor_name = None
        if course.professor_id:
            professor = storage.professors.get(course.professor_id)
            if professor is not None:
                professor_name = professor.get_full_name()
        grade = course.grades.get(student_number)
        courses.append(
            {
                "course_number": course_code,
                "title": course.title,
                "professor_name": professor_name,
                "units": course.units,
                "grade": grade,
            }
        )
        total_units += course.units
        if grade is not None:
            graded.append(grade)

    average_grade = round(sum(graded) / len(graded), 2) if graded else 0.0

    return {
        "student": student.to_dict(),
        "courses": courses,
        "average_grade": average_grade,
        "total_units": total_units,
    }


def get_professor_dashboard(personnel_code: str) -> dict:
    """Aggregate a professor's dashboard data."""
    professor = storage.professors.get(personnel_code)
    if professor is None:
        raise ProfessorNotFoundException(
            f"Professor with personnel code {personnel_code} not found"
        )

    courses = []
    total_students = 0
    student_averages: dict = {}
    for course_code in professor.courses:
        course = storage.courses.get(course_code)
        if course is None:
            continue
        courses.append(
            {
                "course_number": course_code,
                "title": course.title,
                "student_count": len(course.students),
                "capacity": course.capacity,
            }
        )
        total_students += len(course.students)
        for student_number, grade in course.grades.items():
            student_averages.setdefault(student_number, []).append(grade)

    top_students = []
    for student_number, grades in student_averages.items():
        if not grades:
            continue
        student = storage.students.get(student_number)
        full_name = student.get_full_name() if student else student_number
        avg = round(sum(grades) / len(grades), 2)
        top_students.append(
            {"student_number": student_number, "full_name": full_name, "average_grade": avg}
        )
    top_students.sort(key=lambda s: s["average_grade"], reverse=True)
    top_students = top_students[:3]

    return {
        "professor": professor.to_dict(),
        "courses": courses,
        "top_students": top_students,
        "total_students": total_students,
    }
