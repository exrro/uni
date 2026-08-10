"""JSON-file based persistent storage layer for the registration system."""

import json
from pathlib import Path

from models.course import Course
from models.professor import Professor
from models.student import Student

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
STUDENTS_FILE = DATA_DIR / "students.json"
PROFESSORS_FILE = DATA_DIR / "professors.json"
COURSES_FILE = DATA_DIR / "courses.json"

# In-memory stores:
#   students   -> {student_number: Student}
#   professors -> {personnel_code: Professor}
#   courses    -> {code: Course}
students: dict = {}
professors: dict = {}
courses: dict = {}

professor_counter: int = 1


def _ensure_files() -> None:
    """Create the data directory and the three JSON files if they do not exist."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    for path in (STUDENTS_FILE, PROFESSORS_FILE, COURSES_FILE):
        if not path.exists():
            path.write_text("{}", encoding="utf-8")


_ensure_files()


def _read_json(path: Path) -> dict:
    """Read and parse a JSON file, returning {} on any error."""
    try:
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def _write_json(data: dict, path: Path) -> None:
    """Write data to a JSON file as formatted JSON."""
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)


def save_all() -> None:
    """Serialize all in-memory objects to their respective JSON files."""
    _write_json({num: s.to_dict() for num, s in students.items()}, STUDENTS_FILE)
    _write_json({code: p.to_dict() for code, p in professors.items()}, PROFESSORS_FILE)
    _write_json({c.code: c.to_dict() for c in courses.values()}, COURSES_FILE)


def load_all() -> None:
    """Reconstruct all in-memory objects from JSON and restore the counters."""
    global professor_counter

    students.clear()
    professors.clear()
    courses.clear()

    for student_number, data in _read_json(STUDENTS_FILE).items():
        students[student_number] = Student(**data)

    for personnel_code, data in _read_json(PROFESSORS_FILE).items():
        professors[personnel_code] = Professor(**data)

    for code, data in _read_json(COURSES_FILE).items():
        courses[code] = Course(**data)

    # Restore the professor counter from generated ids like "05000000001".
    professor_ids = []
    for p in professors.values():
        if isinstance(p.id, str) and p.id.isdigit() and len(p.id) == 11:
            professor_ids.append(int(p.id[-7:]))
    professor_counter = max(professor_ids) + 1 if professor_ids else 1


def reset_storage() -> None:
    """Clear all in-memory stores, reset counters, and overwrite JSON files with {}."""
    global professor_counter

    students.clear()
    professors.clear()
    courses.clear()

    professor_counter = 1

    _write_json({}, STUDENTS_FILE)
    _write_json({}, PROFESSORS_FILE)
    _write_json({}, COURSES_FILE)
