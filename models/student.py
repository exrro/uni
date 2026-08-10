"""Student model."""

from exceptions.custom_exceptions import CourseNotSelectedByStudentException
from models.person import Person


class Student(Person):
    """A student enrolled at the university. Identified by national id and student number."""

    def __init__(
        self,
        national_id: str,
        first_name: str,
        last_name: str,
        student_number: str,
        major: str,
        selected_courses: list = None,
        has_access: bool = False,
    ) -> None:
        super().__init__(first_name, last_name)
        self.national_id = national_id
        self.student_number = student_number
        self.major = major
        self.selected_courses = selected_courses if selected_courses is not None else []
        self.has_access = has_access

    def select_course(self, course_code: str) -> None:
        """Add a course to the student's selection if not already present."""
        if course_code not in self.selected_courses:
            self.selected_courses.append(course_code)

    def drop_course(self, course_code: str) -> None:
        """Remove a course from the student's selection."""
        if course_code not in self.selected_courses:
            raise CourseNotSelectedByStudentException(
                f"Course {course_code} is not selected by this student"
            )
        self.selected_courses.remove(course_code)

    def get_courses(self) -> list:
        """Return the list of selected course codes."""
        return self.selected_courses

    def to_dict(self) -> dict:
        """Return the student as a JSON-serializable dict."""
        return {
            "national_id": self.national_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "student_number": self.student_number,
            "major": self.major,
            "selected_courses": self.selected_courses,
            "has_access": self.has_access,
        }
