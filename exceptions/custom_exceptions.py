"""Custom domain exceptions for the course registration system."""


class CourseSelectionException(Exception):
    """Base exception for all course registration domain errors."""

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class StudentNotFoundException(CourseSelectionException):
    pass


class StudentAlreadyExistsException(CourseSelectionException):
    pass


class ProfessorNotFoundException(CourseSelectionException):
    pass


class ProfessorAlreadyExistsException(CourseSelectionException):
    pass


class CourseNotFoundException(CourseSelectionException):
    pass


class CourseAlreadyExistsException(CourseSelectionException):
    pass


class CourseFullException(CourseSelectionException):
    pass


class StudentAlreadyEnrolledException(CourseSelectionException):
    pass


class StudentNotEnrolledException(CourseSelectionException):
    pass


class CourseNotSelectedByStudentException(CourseSelectionException):
    pass


class StudentBlockedException(CourseSelectionException):
    pass


class StudentAccessDeniedException(CourseSelectionException):
    pass
