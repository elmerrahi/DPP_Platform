"""Tests for backend/app/schemas/battery_dpp_schema.json.

Verifies:
- The schema document is itself a valid JSON Schema draft 2020-12.
- Realistic valid DPPs (one per DPP-mandated battery category) pass validation.
- Deliberately broken payloads are rejected, with the error pointing to the
  expected field — guarding against permissive schemas that accept too much.

Coherence rules from regulatory_references.md (e.g. lifecycle CF percentages
sum to 100, recycled-content cap, status-transition validity) are NOT
enforced here — they belong in the deterministic compliance checker
(NEXT_STEPS.md Priority 4). Placeholder skipped tests below mark them so
the test list mirrors the documented rules.
"""

from __future__ import annotations

import json
from pathlib import Path

import pytest
from jsonschema import Draft202012Validator, FormatChecker

SCHEMA_PATH = (
    Path(__file__).resolve().parent.parent.parent
    / "app"
    / "schemas"
    / "battery_dpp_schema.json"
)
FIXTURES_DIR = Path(__file__).resolve().parent / "fixtures"


@pytest.fixture(scope="module")
def schema() -> dict:
    with SCHEMA_PATH.open() as f:
        return json.load(f)


@pytest.fixture(scope="module")
def validator(schema: dict) -> Draft202012Validator:
    # format_checker is required to actually enforce string format keywords
    # ("email", "uri", "date", etc.). Without it, format is descriptive only
    # and bad emails / URIs slip through silently.
    return Draft202012Validator(schema, format_checker=FormatChecker())


def _load_fixture(name: str) -> dict:
    with (FIXTURES_DIR / f"{name}.json").open() as f:
        return json.load(f)


def test_schema_is_itself_valid_draft_2020_12(schema: dict) -> None:
    """The schema document conforms to JSON Schema draft 2020-12 metaschema."""
    Draft202012Validator.check_schema(schema)


@pytest.mark.parametrize(
    "fixture_name",
    ["valid_lmt", "valid_industrial", "valid_ev"],
)
def test_valid_dpp_passes_validation(
    validator: Draft202012Validator, fixture_name: str
) -> None:
    """A realistic minimal DPP for each DPP-mandated category should validate cleanly."""
    payload = _load_fixture(fixture_name)
    errors = sorted(
        validator.iter_errors(payload), key=lambda e: list(e.absolute_path)
    )
    if errors:
        pretty = [
            (".".join(str(p) for p in e.absolute_path) or "<root>", e.message)
            for e in errors
        ]
        pytest.fail(f"Valid fixture '{fixture_name}' was rejected: {pretty}")


@pytest.mark.parametrize(
    "fixture_name,expected_path_segment",
    [
        ("invalid_missing_battery_category", "battery_category"),
        ("invalid_wrong_battery_category", "battery_category"),
        ("invalid_negative_weight", "total_kg"),
        ("invalid_bad_country_code", "country"),
        ("invalid_bad_email_format", "email"),
        ("invalid_bad_manufacturing_date", "manufacturing_date"),
    ],
)
def test_invalid_dpp_fails_at_expected_path(
    validator: Draft202012Validator,
    fixture_name: str,
    expected_path_segment: str,
) -> None:
    """A payload broken at one specific field should be rejected, with at
    least one validation error pointing at that field's name in its path."""
    payload = _load_fixture(fixture_name)
    errors = list(validator.iter_errors(payload))
    if not errors:
        pytest.fail(
            f"Invalid fixture '{fixture_name}' was unexpectedly accepted"
        )
    # For missing-required-field errors, the field name appears in the error
    # message (not in absolute_path — the path stops at the parent object).
    # So we check both locations.
    matches = [
        (".".join(str(p) for p in e.absolute_path), e.message)
        for e in errors
        if expected_path_segment in ".".join(str(p) for p in e.absolute_path)
        or expected_path_segment in e.message
    ]
    if not matches:
        details = [
            (".".join(str(p) for p in e.absolute_path) or "<root>", e.message)
            for e in errors
        ]
        pytest.fail(
            f"Expected at least one error mentioning "
            f"'{expected_path_segment}' (in path or message); got: {details}"
        )


# Coherence rules — see backend/app/schemas/regulatory_references.md
# These cannot be enforced by JSON Schema alone and belong in the
# deterministic compliance checker (NEXT_STEPS.md Priority 4).
# Listed here as skipped so the test inventory mirrors the documented rules.


@pytest.mark.skip(reason="blocked on Priority 4 — deterministic compliance checker")
def test_carbon_footprint_lifecycle_percentages_sum_to_100() -> None:
    """raw_material + main_production + distribution + eol_recycling == 100 (±0.5)."""


@pytest.mark.skip(reason="blocked on Priority 4 — deterministic compliance checker")
def test_recycled_content_pre_plus_post_consumer_capped_at_100() -> None:
    """For each material, pre_consumer_pct + post_consumer_pct must not exceed 100."""


@pytest.mark.skip(reason="blocked on Priority 4 — deterministic compliance checker")
def test_battery_status_transitions_are_legal() -> None:
    """Original → {Repurposed,Re-used,Remanufactured,Waste}; never back to Original."""


@pytest.mark.skip(reason="blocked on Priority 4 — deterministic compliance checker")
def test_lmt_carbon_footprint_is_informational_not_blocking() -> None:
    """For LMT batteries (in scope per Article 7(1) but no implementing act
    yet), missing CF should be flagged as informational, not as a violation."""
