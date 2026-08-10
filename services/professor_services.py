"""Business logic for professor management."""

from exceptions.custom_exceptions import (
    ProfessorAlreadyExistsException,
    ProfessorNotFoundException,
)
from models.professor import Professor
from schemas.professor_schema import ProfessorCreate, ProfessorUpdate
from storage import storage


def create_professor(data: ProfessorCreate) -> Professor:
    """Create a new professor and persist it."""
    if data.personnel_code in storage.professors:
        raise ProfessorAlreadyExistsException(
            f"Professor with personnel code {data.personnel_code} already exists"
        )

    professor = Professor(
        id="0500" + str(storage.professor_counter).zfill(7),
        first_name=data.first_name,
        last_name=data.last_name,
        personnel_code=data.personnel_code,
        department=data.department,
    )
    storage.professor_counter += 1
    storage.professors[professor.personnel_code] = professor
    storage.save_all()
    return professor


def get_all_professors() -> list[Professor]:
    """Return all professors."""
    return list(storage.professors.values())


def get_professor_by_id(personnel_code: str) -> Professor:
    """Return a professor by personnel_code, or raise if not found."""
    professor = storage.professors.get(personnel_code)
    if professor is None:
        raise ProfessorNotFoundException(
            f"Professor with personnel code {personnel_code} not found"
        )
    return professor


def update_professor(personnel_code: str, data: ProfessorUpdate) -> Professor:
    """Update a professor's non-None fields and persist the change."""
    professor = get_professor_by_id(personnel_code)

    if data.personnel_code is not None and data.personnel_code != personnel_code:
        if data.personnel_code in storage.professors:
            raise ProfessorAlreadyExistsException(
                f"Professor with personnel code {data.personnel_code} already exists"
            )

    if data.first_name is not None:
        professor.first_name = data.first_name
    if data.last_name is not None:
        professor.last_name = data.last_name
    if data.department is not None:
        professor.department = data.department

    if data.personnel_code is not None and data.personnel_code != personnel_code:
        del storage.professors[personnel_code]
        professor.personnel_code = data.personnel_code
        storage.professors[professor.personnel_code] = professor

    storage.save_all()
    return professor


def delete_professor(personnel_code: str) -> None:
    """Delete a professor and persist the change."""
    get_professor_by_id(personnel_code)
    del storage.professors[personnel_code]
    storage.save_all()
