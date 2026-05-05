# Battery DPP — Regulatory references

Companion document to `battery_dpp_schema.json`. For every field in the
schema, this file gives the regulatory citation, the EUR-Lex pointer where
applicable, and the access level mandated by Annex XIII of Regulation (EU)
2023/1542. Reviewers can verify regulatory accuracy without parsing JSON.

## Primary sources

| Source | URL |
|---|---|
| Regulation (EU) 2023/1542 (Battery Regulation) — full text | <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1542> |
| Regulation (EU) 2023/1542 — official PDF | <https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1542> |
| Battery Pass Consortium — Content Guidance v1.1 (Dec 2023) | <https://thebatterypass.eu/> |
| EU Critical Raw Materials Act (2023) | <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1252> |
| ESPR (Ecodesign for Sustainable Products Regulation) | <https://eur-lex.europa.eu/eli/reg/2024/1781/oj> |

## Important reconciliation note

Battery Pass Content Guidance v1.1 (Dec 2023) was **superseded by
DIN-DKE-SPEC 99100** in January 2025. v1.1 attribute names and groupings
may have been adjusted in the newer specification (relabeling, reordering,
synthesis of attributes). We currently target v1.1 because it is the most
recent **freely accessible** authoritative reference; DIN-DKE-SPEC 99100
is behind a DIN paywall.

When DIN-DKE-SPEC 99100 becomes publicly accessible (or the consortium
releases a free v1.2), reconcile field names accordingly. Track this as a
known schema-evolution item.

## Applicability matrix

The DPP requirement (Article 77) applies only to three battery categories:

| Category | Code in schema | DPP required? | Threshold |
|---|---|---|---|
| Light Means of Transport (e-bikes, e-scooters, ≤ 25 kg) | `LMT` | Yes | All LMT batteries |
| Industrial batteries (excluding stationary storage) | `INDUSTRIAL_OVER_2KWH` | Yes | > 2 kWh |
| Stationary battery energy storage systems | `INDUSTRIAL_STATIONARY_STORAGE_OVER_2KWH` | Yes | > 2 kWh |
| Electric vehicle batteries | `EV` | Yes | All EV batteries |
| Portable batteries (AA, AAA, phone, etc.) | (not modeled) | **No** | — |
| Starting, lighting, ignition (SLI) batteries | (not modeled) | **No** | — |

## Per-field regulatory mapping

### 6.1 — General battery and manufacturer information

| Field | Regulatory source | Access level | Mandatory |
|---|---|---|---|
| `general_info.battery_passport_identification` | Article 77(3) — ISO/IEC 15459 unique identifier | public | yes |
| `general_info.battery_identification.model_identification` | Annex XIII 1(a) → Annex VI Part A(1) → Article 38(6) | public | yes |
| `general_info.battery_identification.serial_number` / `batch_number` / `product_number` | Article 38(6) — at least one required | public | yes |
| `general_info.responsible_economic_operator_identification` | Battery Pass Consortium recommendation; references Article 77(4) | public | no (voluntary) |
| `general_info.manufacturer_identification.*` | Annex VI Part A(1); Article 38(7); Article 3(33) for "manufacturer" definition | public | yes |
| `general_info.manufacturer_identification.unique_operator_identifier` | ESPR Article 2(32); Battery Reg Article 11(1); ISO/IEC 15459:2015 | public | recommended |
| `general_info.manufacturing_place.*` | Annex VI Part A(3); ESPR Article 2(33) for unique facility identifier | public | yes |
| `general_info.manufacturing_date` | Annex VI Part A(4) — month and year | public | yes |
| `general_info.battery_category` | Annex VI Part A(2); Article 3 | public | yes |
| `general_info.battery_weight.total_kg` | Annex VI Part A(5); Annex XIII 1(a) | public | yes |
| `general_info.battery_weight.module_kg` / `cell_kg` | Battery Pass Consortium recommendation (voluntary granular weights) | public | no |
| `general_info.battery_status` | Annex XIII 4(c) | legitimate-interest | yes (dynamic) |

### 6.2 — Compliance, labels, certifications

| Field | Regulatory source | Access level | Mandatory |
|---|---|---|---|
| `compliance.separate_collection_symbol_displayed` | Article 13(4) via Annex XIII 1(q) — WEEE symbol from 18 Aug 2025 | public | yes |
| `compliance.cadmium_symbol_required` | Article 13(5) via Annex XIII 1(q) — required if Cd > 0.002% | public | conditional |
| `compliance.lead_symbol_required` | Article 13(5) via Annex XIII 1(q) — required if Pb > 0.004% | public | conditional |
| `compliance.labels_meaning` | Article 74(1e) via Annex XIII 1(s) | public | yes |
| `compliance.eu_declaration_of_conformity_id` | Article 7(1f) via Annex XIII 1(c); Article 18 | public | yes |
| `compliance.eu_declaration_of_conformity_url` | Article 18 via Annex XIII 1(r) — model in Annex IX, elements in Annex VIII | public | recommended |
| `compliance.test_results_compliance_url` | Annex XIII 3 — restricted to authorities | notified-bodies | recommended |

### 6.3 — Battery carbon footprint

Carbon footprint requirements apply in **three staged steps** per Article 7
and Figure 16 of the Battery Pass guidance:

1. **CF declaration** — Article 7(1)
2. **CF performance class** — Article 7(2)
3. **CF maximum threshold** — Article 7(3)

Timeline (from Battery Pass Figure 16):

| Measure | EV batteries | Industrial batteries > 2 kWh (non-storage) | Stationary storage > 2 kWh | LMT batteries |
|---|---|---|---|---|
| CF declaration | Feb 2025 | Aug 2026 | Aug 2030 | implementing act TBD |
| CF performance class | Aug 2026 | Aug 2028 | Feb 2032 | implementing act TBD |
| CF max threshold | Feb 2028 | Aug 2030 | (date 2033+) | implementing act TBD |

**Important:** Article 7(1) text explicitly covers LMT batteries
("rechargeable industrial batteries with a capacity above 2 kWh, light
means of transport (LMT) batteries and electric vehicle (EV) batteries
placed on the Union market"). LMT is therefore in legal scope, but as
of Battery Pass v1.1 (Dec 2023) the Commission delegated act
establishing the LMT-specific methodology and start dates had not yet
been published. The compliance checker should treat CF as **applicable
but not yet enforceable** for LMT until the implementing act lands.

For EV batteries, the methodology follows the **JRC Rules for the
calculation of the Carbon Footprint of Electric Vehicle Batteries (CFB-EV)**.
For industrial batteries, see the JRC **CFB-IND** rules.

| Field | Regulatory source | Access level | Mandatory |
|---|---|---|---|
| `carbon_footprint.carbon_footprint_kg_co2e_per_kwh` | Article 7(1d) | public | yes (per timeline above) |
| `carbon_footprint.carbon_footprint_per_lifecycle_stage_pct.*` | Article 7(1e); Annex II point 4 via Annex XIII 1(c) | public | yes |
| `carbon_footprint.carbon_footprint_performance_class` | Article 7(2) via Annex XIII 1(c) | public | yes (from staged date) |
| `carbon_footprint.carbon_footprint_study_url` | Article 7(1g) via Annex XIII 1(c) | public | yes |

### 6.4 — Supply chain due diligence

The mandatory DPP element is **only the due diligence report** per Annex
XIII 1(d) and Article 52(3). Voluntary additions exist per Article 53.

Operators with **net turnover < €40 million in the previous financial
year** are exempt from due diligence obligations per Article 47.

| Field | Regulatory source | Access level | Mandatory |
|---|---|---|---|
| `supply_chain_due_diligence.due_diligence_report_url` | Annex XIII 1(d); Article 52(3) | public | yes (subject to Article 47 exemption) |
| `supply_chain_due_diligence.third_party_assurances` | Article 53 (voluntary) | public | no |

### 6.5 — Battery materials and composition

| Field | Regulatory source | Access level | Mandatory |
|---|---|---|---|
| `materials_composition.battery_chemistry.*` | Annex XIII 1(b); Annex VI Part A(7) | public | yes |
| `materials_composition.critical_raw_materials[]` | Annex XIII 1(b); Annex VI Part A(10); EU Critical Raw Materials Act 2023 (34-material list) | public | yes (if any present > 0.1% w/w) |
| `materials_composition.detailed_composition_url` | Annex XIII 2(a) — restricted to legitimate interest + Commission | legitimate-interest | recommended |
| `materials_composition.hazardous_substances[]` | Annex XIII 1(b); Annex VI Part A(8); CLP Regulation; REACH SCIP database for SVHCs > 0.1% w/w | public | yes (if any present > 0.1% w/w) |
| `materials_composition.substance_impact_statements[]` | Annex XIII 1(s); Article 74(1f) | public | recommended |

### 6.6 — Circularity and resource efficiency

| Field | Regulatory source | Access level | Mandatory |
|---|---|---|---|
| `circularity.removal_manual_url` | Annex XIII 2(c) | legitimate-interest | yes |
| `circularity.disassembly_manual_url` | Annex XIII 2(c) | legitimate-interest | yes |
| `circularity.spare_parts_url` | Annex XIII 2(b); Recital 69 | legitimate-interest | yes |
| `circularity.safety_instructions_url` | Annex XIII 2(d) | legitimate-interest | yes |
| `circularity.extinguishing_agent` | Annex VI Part A(9) | public | yes |
| `circularity.recycled_content.*` | Article 8 via Annex XIII 1(c); Annex VIII | public | from 18 Aug 2031 |
| `circularity.renewable_content_share_pct` | Article 7(1b) via Annex XIII 1(c) | public | recommended |
| `circularity.end_of_life_info.end_user_role_text` | Article 74(1a)(1b) | public | yes |
| `circularity.end_of_life_info.collection_take_back_info_url` | Article 74(1c) | public | yes |

### 6.7 — Performance and durability

Static parameters apply to all DPP-mandated categories. Dynamic parameters
(state-of-health data) require a Battery Management System (BMS) and apply
primarily to EV and industrial batteries with a BMS.

Reference standards: Annex IV (Part A) for performance/durability
parameters, Annex VII for state-of-health parameters.

| Field | Regulatory source | Access level | Mandatory |
|---|---|---|---|
| `performance_durability.rated_capacity_ah` | Article 10(1); Annex IV Part A; Annex XIII 1(g) | public | yes |
| `performance_durability.voltage_v.*` | Article 10(1); Annex XIII 1(h) | public | yes |
| `performance_durability.original_power_capability_w` | Annex XIII 1(i) | public | yes |
| `performance_durability.expected_lifetime_cycles.*` | Annex XIII 1(j); Article 10(1) + Annex IV | public | yes |
| `performance_durability.warranty_calendar_life` | Annex XIII 1(k) | public | recommended |
| `performance_durability.temperature_idle_state_c.*` | Annex XIII 1(l) | public | yes |
| `performance_durability.round_trip_efficiency_pct` | Annex XIII 1(n) | public | yes |
| `performance_durability.internal_resistance_ohm` | Annex XIII 1(o) | public | yes |
| `performance_durability.dynamic_state_of_health.*` | Article 14; Annex VII; Annex XIII 4(a)(b) | legitimate-interest | yes if BMS present |

## Cross-references to other EU regulations

The Battery Regulation interacts with several adjacent regulations the
schema touches but does not fully model:

| Adjacent regulation | Touches schema field | Notes |
|---|---|---|
| **REACH (EC 1907/2006)** | `materials_composition.hazardous_substances` | SVHC reporting via SCIP database for substances > 0.1% w/w |
| **CLP Regulation (EC 1272/2008)** | `materials_composition.hazardous_substances.hazard_classes` | Hazard classification taxonomy |
| **EU Critical Raw Materials Act (2024)** | `materials_composition.critical_raw_materials` | 34-material list (subject to update — RMIS is the live source) |
| **WEEE Directive (2012/19/EU)** | `compliance.separate_collection_symbol_displayed` | Origin of the WEEE symbol |
| **GDPR (EU 2016/679)** | `dynamic_state_of_health.*` | Some battery dynamic data may be linkable to vehicle owners — handle as personal data if so |
| **ESPR (EU 2024/1781)** | unique operator/facility identifiers | Provides the wider DPP framework Battery DPP fits into |

## Coherence rules (for the deterministic compliance checker — Priority 4)

These are invariants the schema does **not** enforce via JSON Schema
constraints alone but should be checked by `check_battery_dpp()`:

1. **Lifecycle CF percentages** — `raw_material_acquisition_pct + main_production_pct + distribution_pct + eol_recycling_pct` should equal 100 (±0.5% tolerance).
2. **Recycled content cap** — sum of `pre_consumer_pct` and `post_consumer_pct` for any material must not exceed 100.
3. **Cadmium / lead symbols** — if `cadmium_symbol_required` is `false`, the manufacturer must (out of band) confirm Cd ≤ 0.002% w/w. Same for lead at 0.004%.
4. **DPP application date** — if `manufacturing_date` is **before 2027-02** and `battery_category` is in the DPP-mandated set, the DPP is voluntary (early-adopter case); flag as informational rather than failure.
5. **Battery status transitions** — `battery_status` may legally transition only along: `Original → Repurposed | Re-used | Remanufactured | Waste`; from any non-Waste state to Waste; never back to Original. The compliance checker should validate transitions when given prior state.
6. **CF declaration applicability** — `carbon_footprint.*` is required only for EV (from Feb 2025), industrial (from Aug 2026), stationary storage (from Aug 2030). For LMT, CF is currently **not required** by the regulation; treat as optional in schema.
7. **Due diligence exemption** — operators with net turnover < €40 M may set `due_diligence_report_url` to a documented "exempt under Article 47" sentinel rather than a real URL.

## How to extend the schema

When the regulation evolves (delegated acts, new categories, new staged
dates), follow this process:

1. Confirm the new requirement in the official EUR-Lex text.
2. Update `battery_dpp_schema.json` — add the field with full
   `x-regulatory-source`, `x-data-access`, `x-mandatory` annotations.
3. Update this `regulatory_references.md` with the new row in the
   appropriate section table.
4. Update `version` in the schema header (semver: patch for
   clarifications, minor for additive changes, major for breaking changes).
5. If a coherence rule applies, add it to "Coherence rules" above.
6. Open a PR titled `schema: extend battery DPP for <regulation/date>`.

Schema versioning is critical for `docs/5- Gouvernance IA et conformité.pdf`
governance compliance — every audit must be tied to the schema version
that was active at the time of the audit.
