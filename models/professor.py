"""Professor model."""

from models.person import Person


class Professor(Person):
    """A professor who teaches courses."""

    def __init__(
        self,
        id: str,
        first_name: str,
        last_name: str,
        personnel_code: str,
        department: str,
        courses: list = None,
    ) -> None:
        super().__init__(first_name, last_name)
        self.id = id
        self.personnel_code = personnel_code
        self.department = department
        self.courses = courses if courses is not None else []

    def assign_course(self, course_code: str) -> None:
        """Add a course to the professor's teaching list if not already present."""
        if course_code not in self.courses:
            self.courses.append(course_code)

    def get_courses(self) -> list:
        """Return the list of course numbers taught by this professor."""
        return self.courses

    def to_dict(self) -> dict:
        """Return the professor as a JSON-serializable dict."""
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "personnel_code": self.personnel_code,
            "department": self.department,
            "courses": self.courses,
        }
