"""Business logic for student management."""

from exceptions.custom_exceptions import (
    StudentAlreadyExistsException,
    StudentNotFoundException,
)
from models.student import Student
from schemas.student_schema import StudentCreate, StudentUpdate
from storage import storage


def _national_id_exists(national_id: str, exclude: Student = None) -> bool:
    """Return True if another student already uses the given national id."""
    for student in storage.students.values():
        if student is not exclude and student.national_id == national_id:
            return True
    return False


def create_student(data: StudentCreate) -> Student:
    """Create a new student and persist it."""
    if data.student_number in storage.students:
        raise StudentAlreadyExistsException(
            f"Student with number {data.student_number} already exists"
        )
    if _national_id_exists(data.national_id):
        raise StudentAlreadyExistsException(
            f"Student with national id {data.national_id} already exists"
        )

    student = Student(
        national_id=data.national_id,
        first_name=data.first_name,
        last_name=data.last_name,
        student_number=data.student_number,
        major=data.major,
        has_access=data.has_access,
    )
    storage.students[student.student_number] = student
    storage.save_all()
    return student


def get_all_students() -> list[Student]:
    """Return all students."""
    return list(storage.students.values())


def get_student_by_id(student_number: str) -> Student:
    """Return a student by student_number, or raise if not found."""
    student = storage.students.get(student_number)
    if student is None:
        raise StudentNotFoundException(f"Student with number {student_number} not found")
    return student


def update_student(student_number: str, data: StudentUpdate) -> Student:
    """Update a student's non-None fields and persist the change."""
    student = get_student_by_id(student_number)

    if data.student_number is not None and data.student_number != student_number:
        if data.student_number in storage.students:
            raise StudentAlreadyExistsException(
                f"Student with number {data.student_number} already exists"
            )
    if data.national_id is not None and _national_id_exists(data.national_id, exclude=student):
        raise StudentAlreadyExistsException(
            f"Student with national id {data.national_id} already exists"
        )

    if data.national_id is not None:
        student.national_id = data.national_id
    if data.first_name is not None:
        student.first_name = data.first_name
    if data.last_name is not None:
        student.last_name = data.last_name
    if data.major is not None:
        student.major = data.major

    if data.student_number is not None and data.student_number != student_number:
        # Rename the student number and keep course rosters consistent.
        for course in storage.courses.values():
            if student_number in course.students:
                course.students.remove(student_number)
                course.students.append(data.student_number)
        del storage.students[student_number]
        student.student_number = data.student_number
        storage.students[student.student_number] = student

    storage.save_all()
    return student


def delete_student(student_number: str) -> None:
    """Delete a student and remove them from all course rosters."""
    get_student_by_id(student_number)
    for course in storage.courses.values():
        if student_number in course.students:
            course.students.remove(student_number)
    del storage.students[student_number]
    storage.save_all()
