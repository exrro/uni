"""Base Person model."""


class Person:
    """Base class for all people in the system."""

    def __init__(self, first_name: str, last_name: str) -> None:
        if not first_name or not last_name:
            raise TypeError("first_name and last_name are required and must not be empty")
        self.first_name = first_name
        self.last_name = last_name

    def get_full_name(self) -> str:
        """Return the person's full name."""
        return f"{self.first_name} {self.last_name}"

    def to_dict(self) -> dict:
        """Return the person's common fields as a JSON-serializable dict."""
        return {
            "first_name": self.first_name,
            "last_name": self.last_name,
        }
