"""Tests for app.core.dpp_validator — the function the /dpp route calls
before persistence to gate writes to the JSONB store.

These exercise the validator directly (no FastAPI, no DB), reusing the
fixtures from tests/schemas/fixtures/ that were written to round-trip
through the JSON Schema in the test-infrastructure PR.
"""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from app.core.dpp_validator import (
    ValidationError,
    validate_battery_dpp,
)

FIXTURES_DIR = (
    Path(__file__).resolve().parent.parent / "schemas" / "fixtures"
)


def _load(name: str) -> dict:
    with (FIXTURES_DIR / f"{name}.json").open() as f:
        return json.load(f)


@pytest.mark.parametrize(
    "fixture_name",
    ["valid_lmt", "valid_industrial", "valid_ev"],
)
def test_valid_payloads_return_no_errors(fixture_name: str) -> None:
    payload = _load(fixture_name)
    errors = validate_battery_dpp(payload)
    assert errors == [], f"Valid fixture '{fixture_name}' rejected: {errors}"


@pytest.mark.parametrize(
    "fixture_name,expected_substring",
    [
        ("invalid_missing_battery_category", "battery_category"),
        ("invalid_wrong_battery_category", "battery_category"),
        ("invalid_negative_weight", "total_kg"),
        ("invalid_bad_country_code", "country"),
        ("invalid_bad_email_format", "email"),
        ("invalid_bad_manufacturing_date", "manufacturing_date"),
    ],
)
def test_invalid_payloads_surface_field_in_path_or_message(
    fixture_name: str, expected_substring: str
) -> None:
    payload = _load(fixture_name)
    errors = validate_battery_dpp(payload)
    assert errors, f"Invalid fixture '{fixture_name}' was unexpectedly accepted"
    assert any(
        expected_substring in e.path or expected_substring in e.message
        for e in errors
    ), (
        f"Expected '{expected_substring}' to appear in some error path or "
        f"message; got: {[(e.path, e.message) for e in errors]}"
    )


def test_non_dict_payload_fails_at_root() -> None:
    """The validator must reject non-object payloads with a single root error,
    not crash."""
    errors = validate_battery_dpp("not a dict")  # type: ignore[arg-type]
    assert len(errors) == 1
    assert errors[0].path == ""
    assert "JSON object" in errors[0].message


def test_empty_dict_fails_with_required_section_errors() -> None:
    """Top-level required sections (general_info, compliance,
    supply_chain_due_diligence) must be flagged when missing."""
    errors = validate_battery_dpp({})
    messages = " ".join(e.message for e in errors)
    assert "general_info" in messages
    assert "compliance" in messages
    assert "supply_chain_due_diligence" in messages


def test_validation_error_dict_serialization() -> None:
    """ValidationError.to_dict produces the contract the route returns."""
    err = ValidationError(path="general_info.battery_category", message="x")
    assert err.to_dict() == {
        "path": "general_info.battery_category",
        "message": "x",
    }
