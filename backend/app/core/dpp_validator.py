"""Battery DPP payload validation against the JSON Schema source of truth.

Loads `app/schemas/battery_dpp_schema.json` once, exposes a single
`validate_battery_dpp` function that returns structured field-level errors.
The route layer (`api/v1/dpp_creation.py`) calls this before persistence and
returns the errors as 422 to the client.

Keeping the validator separate from the route lets unit tests exercise it
without spinning up FastAPI / a DB session, and lets the future audit
endpoint reuse the same logic.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator, FormatChecker

SCHEMA_PATH = (
    Path(__file__).resolve().parent.parent / "schemas" / "battery_dpp_schema.json"
)


@dataclass(frozen=True)
class ValidationError:
    """A single validation failure, addressable by JSON path."""

    path: str
    message: str

    def to_dict(self) -> dict[str, str]:
        return {"path": self.path, "message": self.message}


@lru_cache(maxsize=1)
def _load_schema() -> dict:
    with SCHEMA_PATH.open() as f:
        return json.load(f)


@lru_cache(maxsize=1)
def _validator() -> Draft202012Validator:
    # format_checker is required to enforce "format": "email" / "uri" / "date".
    # Without it those keywords are descriptive only — see the
    # test_battery_dpp_schema test file for the captured gotcha.
    return Draft202012Validator(_load_schema(), format_checker=FormatChecker())


def validate_battery_dpp(payload: Any) -> list[ValidationError]:
    """Return the list of validation errors for `payload`.

    An empty list means the payload is valid against the schema. The route
    handler should treat any non-empty list as a 422 condition.

    Errors are sorted by path for deterministic output.
    """
    if not isinstance(payload, dict):
        return [
            ValidationError(
                path="",
                message="Payload must be a JSON object at the top level.",
            )
        ]

    raw_errors = sorted(
        _validator().iter_errors(payload),
        key=lambda e: list(e.absolute_path),
    )
    return [
        ValidationError(
            path=".".join(str(p) for p in err.absolute_path) or "<root>",
            message=err.message,
        )
        for err in raw_errors
    ]
