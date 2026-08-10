"""Course model."""

from exceptions.custom_exceptions import (
    CourseFullException,
    StudentAlreadyEnrolledException,
    StudentNotEnrolledException,
)


class Course:
    """A course offered by the university. Identified by its unique code."""

    def __init__(
        self,
        title: str,
        code: str,
        units: int,
        capacity: int,
        major: str = None,
        professor_id: str = None,
        students: list = None,
        grades: dict = None,
        blocked_students: list = None,
    ) -> None:
        if not title or not code:
            raise TypeError("title and code are required")
        if units is None or capacity is None:
            raise TypeError("units and capacity are required")
        self.title = title
        self.code = code
        self.units = units
        self.capacity = capacity
        self.major = major
        self.professor_id = professor_id
        self.students = students if students is not None else []
        self.grades = grades if grades is not None else {}
        self.blocked_students = blocked_students if blocked_students is not None else []

    def is_full(self) -> bool:
        """Return True if the course has reached its capacity."""
        return len(self.students) >= self.capacity

    def add_student(self, student_number: str) -> None:
        """Enroll a student in the course."""
        if self.is_full():
            raise CourseFullException(f"Course {self.code} is full")
        if student_number in self.students:
            raise StudentAlreadyEnrolledException(
                f"Student {student_number} is already enrolled in course {self.code}"
            )
        self.students.append(student_number)

    def remove_student(self, student_number: str) -> None:
        """Remove a student from the course."""
        if student_number not in self.students:
            raise StudentNotEnrolledException(
                f"Student {student_number} is not enrolled in course {self.code}"
            )
        self.students.remove(student_number)

    def assign_professor(self, professor_id: str) -> None:
        """Assign a professor to the course."""
        self.professor_id = professor_id

    def to_dict(self) -> dict:
        """Return the course as a JSON-serializable dict."""
        return {
            "title": self.title,
            "code": self.code,
            "units": self.units,
            "capacity": self.capacity,
            "major": self.major,
            "professor_id": self.professor_id,
            "students": self.students,
            "grades": self.grades,
            "blocked_students": self.blocked_students,
        }
