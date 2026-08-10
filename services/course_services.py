"""Business logic for course management."""

from exceptions.custom_exceptions import (
    CourseAlreadyExistsException,
    CourseNotFoundException,
    StudentNotEnrolledException,
)
from models.course import Course
from schemas.course_schema import CourseCreate, CourseUpdate
from services.professor_services import get_professor_by_id
from storage import storage


def create_course(data: CourseCreate) -> Course:
    """Create a new course and persist it."""
    if data.code in storage.courses:
        raise CourseAlreadyExistsException(f"Course with code {data.code} already exists")

    professor = None
    if data.professor_id:
        # Validate that the professor exists BEFORE mutating any state.
        professor = get_professor_by_id(data.professor_id)

    course = Course(
        title=data.title,
        code=data.code,
        units=data.units,
        capacity=data.capacity,
        major=data.major,
        professor_id=data.professor_id,
    )
    storage.courses[course.code] = course

    if professor is not None:
        # Keep the relationship bidirectional.
        professor.assign_course(course.code)

    storage.save_all()
    return course


def get_all_courses() -> list[Course]:
    """Return all courses."""
    return list(storage.courses.values())


def get_course_by_code(code: str) -> Course:
    """Return a course by its code, or raise if not found."""
    course = storage.courses.get(code)
    if course is None:
        raise CourseNotFoundException(f"Course with code {code} not found")
    return course


def update_course(code: str, data: CourseUpdate) -> Course:
    """Update a course's non-None fields and persist the change."""
    course = get_course_by_code(code)

    if data.code is not None and data.code != code:
        # Rename the code and cascade the change to all references.
        if data.code in storage.courses:
            raise CourseAlreadyExistsException(f"Course with code {data.code} already exists")
        del storage.courses[code]
        course.code = data.code
        storage.courses[course.code] = course
        for student in storage.students.values():
            if code in student.selected_courses:
                student.selected_courses.remove(code)
                student.selected_courses.append(course.code)
        for professor in storage.professors.values():
            if code in professor.courses:
                professor.courses.remove(code)
                professor.courses.append(course.code)

    if data.title is not None:
        course.title = data.title
    if data.units is not None:
        course.units = data.units
    if data.capacity is not None:
        course.capacity = data.capacity
    if data.major is not None:
        course.major = data.major

    if "professor_id" in data.model_fields_set:
        # Explicitly provided (even as null) -> manage the assignment.
        new_professor_id = data.professor_id
        if new_professor_id is None:
            # Unassign: detach the current professor, if any.
            if course.professor_id:
                previous = storage.professors.get(course.professor_id)
                if previous is not None and course.code in previous.courses:
                    previous.courses.remove(course.code)
            course.professor_id = None
        elif new_professor_id != course.professor_id:
            # Validate the new professor exists BEFORE detaching from the old one.
            new_professor = get_professor_by_id(new_professor_id)
            if course.professor_id:
                previous = storage.professors.get(course.professor_id)
                if previous is not None and course.code in previous.courses:
                    previous.courses.remove(course.code)
            course.professor_id = new_professor_id
            new_professor.assign_course(course.code)

    storage.save_all()
    return course


def set_grade(course_code: str, student_number: str, grade: float) -> Course:
    """Set a grade for a student in a course (professor only)."""
    course = get_course_by_code(course_code)
    if student_number not in course.students:
        raise StudentNotEnrolledException(
            f"Student {student_number} is not enrolled in course {course_code}"
        )
    if not 0 <= grade <= 20:
        raise ValueError("Grade must be between 0 and 20")
    course.grades[student_number] = float(grade)
    storage.save_all()
    return course


def block_student(course_code: str, student_number: str) -> Course:
    """Block a student from a course: remove and add to blocked list."""
    course = get_course_by_code(course_code)
    if student_number not in course.students:
        raise StudentNotEnrolledException(
            f"Student {student_number} is not enrolled in course {course_code}"
        )
    course.students.remove(student_number)
    if student_number not in course.blocked_students:
        course.blocked_students.append(student_number)
    # Also remove the course from the student's selection.
    student = storage.students.get(student_number)
    if student is not None and course_code in student.selected_courses:
        student.selected_courses.remove(course_code)
    storage.save_all()
    return course


def get_students_in_course(course_code: str) -> list:
    """Return full Student objects enrolled in a course."""
    course = get_course_by_code(course_code)
    students = []
    for student_number in course.students:
        student = storage.students.get(student_number)
        if student is not None:
            students.append(student)
    return students


def delete_course(code: str) -> None:
    """Delete a course and persist the change."""
    get_course_by_code(code)
    del storage.courses[code]
    storage.save_all()
