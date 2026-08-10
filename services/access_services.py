"""Admin access-granting services.

Controls whether a student has access to their own panel (selecting courses,
viewing grades, dashboards). Professors always have full access to their panel.
"""

from exceptions.custom_exceptions import StudentNotFoundException
from storage import storage


def grant_access(student_number: str):
    """Grant a student full access to their panel."""
    student = storage.students.get(student_number)
    if student is None:
        raise StudentNotFoundException(f"Student with number {student_number} not found")
    student.has_access = True
    storage.save_all()
    return student


def revoke_access(student_number: str):
    """Revoke a student's access to their panel."""
    student = storage.students.get(student_number)
    if student is None:
        raise StudentNotFoundException(f"Student with number {student_number} not found")
    student.has_access = False
    storage.save_all()
    return student


def grant_access_to_all() -> dict:
    """Grant access to every student in the system."""
    count = 0
    for student in storage.students.values():
        if not student.has_access:
            student.has_access = True
            count += 1
    storage.save_all()
    return {
        "message": f"دسترسی برای {count} دانشجو فعال شد",
        "total_students": len(storage.students),
    }


def get_students_access() -> list:
    """Return every student with their current access status."""
    return [
        {
            "student_number": student.student_number,
            "full_name": student.get_full_name(),
            "major": student.major,
            "has_access": student.has_access,
        }
        for student in storage.students.values()
    ]
