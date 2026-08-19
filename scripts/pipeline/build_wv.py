#!/usr/bin/env python3
"""
Campus Transformation — Data Pipeline (Phase 1: West Virginia only)
Produces institutions.json for Bethany College (UNITID 237181).

Ground truth: docs/LOOKUP_TOOL_SPEC.md and docs/LOOKUP_TOOL_SPEC_ADDENDUM.md.
Where they conflict, the addendum wins.

DO NOT reconstruct federal variable names, thresholds, or eligibility formulas
from memory. Everything comes from the source's data dictionary or the spec.
"""

import json
import os
import sys
from datetime import date

# Add the scripts directory to path
sys.path.insert(0, os.path.dirname(__file__))

from sources.ipeds import fetch_institution_spine, fetch_finance_f2
from sources.oews import fetch_labor_gaps
from sources.hrsa import fetch_hpsa
from sources.cdbg import fetch_cdbg_route
from sources.arc import fetch_arc_status
from sources.usda import compute_usda_eligibility
from sources.census import fetch_census_data
from sources.qcew import fetch_qcew_counts
from sources.partners import get_verified_partners

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

BETHANY_UNITID = 237181
BETHANY_COUNTY_FIPS = "54009"
BETHANY_CBSA = "48260"
STATE = "WV"


def build_bethany_record():
    """Build the complete record for Bethany College per spec §4 schema."""

    print("=" * 60)
    print("Campus Transformation Pipeline — Phase 1: West Virginia")
    print("=" * 60)

    # 1. Institution spine from IPEDS
    print("\n[1/9] Fetching IPEDS institution data...")
    institution = fetch_institution_spine(BETHANY_UNITID, DATA_DIR)

    # 2. Revenue mix from IPEDS F2
    print("\n[2/9] Fetching IPEDS F2 finance data...")
    position = fetch_finance_f2(BETHANY_UNITID, DATA_DIR)

    # 3. Regional gaps — labor (OEWS)
    print("\n[3/9] Fetching OEWS labor data for MSA 48260...")
    labor_gaps = fetch_labor_gaps(BETHANY_CBSA, STATE, DATA_DIR)

    # 4. Regional gaps — health (HRSA HPSA)
    print("\n[4/9] Querying HRSA HPSA for Brooke County...")
    hpsa_gaps = fetch_hpsa(BETHANY_COUNTY_FIPS)

    # 5. CDBG route
    print("\n[5/9] Querying HUD CDBG grantee service...")
    cdbg = fetch_cdbg_route(STATE, BETHANY_COUNTY_FIPS)

    # 6. ARC status
    print("\n[6/9] Fetching ARC county economic status...")
    arc = fetch_arc_status(BETHANY_COUNTY_FIPS, DATA_DIR)

    # 7. Census data + USDA eligibility
    print("\n[7/9] Fetching Census ACS data...")
    census_data = fetch_census_data(BETHANY_COUNTY_FIPS, STATE)
    usda = compute_usda_eligibility(census_data, STATE)

    # 8. QCEW industry counts
    print("\n[8/9] Fetching QCEW establishment counts...")
    qcew = fetch_qcew_counts(BETHANY_COUNTY_FIPS, DATA_DIR)

    # 9. Partners (verified, from spec §7)
    print("\n[9/9] Loading verified partners...")
    partners = get_verified_partners()

    # Assemble the record per spec §4 schema
    record = {
        "schema_version": "1.0",
        "data_version": "2026.08",
        "built_at": date.today().isoformat(),

        "institution": institution,
        "position": position,

        "regional_gaps": labor_gaps + hpsa_gaps,

        "funding": [
            usda,
            cdbg,
            {
                "program": "ARC (Appalachian Regional Commission)",
                "county_status": arc,
                "note": "Distressed and at-risk counties receive priority funding.",
                "url": "https://www.arc.gov/grants-and-contracts/"
            },
            {
                "program": "Section 202 Supportive Housing for the Elderly",
                "sponsor_eligible": {
                    "value": institution.get("control") == "private_nonprofit",
                    "confidence": "high",
                    "reasoning": "24 CFR 891.205: private nonprofit 501(c)(3) organizations are eligible sponsors. The college is the Sponsor, not the Owner; a separate single-asset nonprofit must be formed to own the project."
                },
                "url": "https://www.hud.gov/program_offices/housing/mfh/progdesc/eld202"
            },
        ],

        "partners": partners,

        "governance": {
            "accreditor": "HLC",
            "property_lease_triggers_substantive_change": False,
            "note": "HLC does not treat a property lease as a substantive change. NECHE institutions do carry a filing."
        },

        "industry": qcew,

        "flags": []
    }

    # Collect flags
    if any("suppressed" in str(g.get("confidence", "")) for g in record["regional_gaps"]):
        record["flags"].append("suppressed_cells_in_source_data")

    # Write output
    out_path = os.path.join(OUTPUT_DIR, "institutions.json")
    with open(out_path, "w") as f:
        json.dump([record], f, indent=2, default=str)

    print(f"\n{'=' * 60}")
    print(f"Record written to {out_path}")
    print(f"{'=' * 60}")

    return record


def print_validation(record):
    """Print the record side-by-side with spec §7 verified values."""
    print("\n" + "=" * 80)
    print("VALIDATION: Bethany College record vs. spec §7 verified values")
    print("=" * 80)

    inst = record["institution"]
    rows = [
        ("UNITID", inst.get("unitid"), 237181),
        ("Name", inst.get("name"), "Bethany College"),
        ("City", inst.get("city"), "Bethany"),
        ("State", inst.get("state"), "WV"),
        ("ZIP", inst.get("zip"), "26032"),
        ("County FIPS", inst.get("county_fips"), "54009"),
        ("County Name", inst.get("county_name"), "Brooke County"),
        ("CBSA", inst.get("cbsa"), "48260"),
        ("Control", inst.get("control"), "private_nonprofit"),
        ("Sector", inst.get("sector"), "4yr"),
        ("Accreditor", inst.get("accreditor"), "HLC"),
        ("Enrollment", inst.get("enrollment", {}).get("value"), 640),
    ]

    print(f"\n{'Field':<25} {'Pipeline':<35} {'Spec §7':<35} {'Match'}")
    print("-" * 100)
    for label, got, expected in rows:
        match = "✓" if str(got) == str(expected) else "✗"
        print(f"{label:<25} {str(got):<35} {str(expected):<35} {match}")

    # Position
    pos = record.get("position", {})
    print(f"\n--- Position (IPEDS F2) ---")
    for key in ["tuition_dependence", "earned_and_public_revenue", "philanthropy_share", "diversification_delta_5yr"]:
        entry = pos.get(key, {})
        val = entry.get("value")
        disp = f"{val:.1%}" if isinstance(val, (int, float)) and val is not None else str(val)
        print(f"{key:<35} {disp:<35} {'NOT YET PULLED in §7'}")

    # Regional gaps
    print(f"\n--- Regional Gaps ---")
    for gap in record.get("regional_gaps", []):
        domain = gap.get("domain", "?")
        headline = gap.get("headline", "")
        metric = gap.get("metric", "")
        vintage = gap.get("vintage", "")
        conf = gap.get("confidence", "")
        print(f"  [{domain}] {headline}")
        print(f"    Metric: {metric}  |  Vintage: {vintage}  |  Confidence: {conf}")

    # Funding
    print(f"\n--- Funding Eligibility ---")
    for f in record.get("funding", []):
        prog = f.get("program", "?")
        if "area_eligible" in f:
            ae = f["area_eligible"]
            print(f"  {prog}")
            print(f"    Area eligible: {ae.get('value')} (conf: {ae.get('confidence')})")
            print(f"    Reasoning: {ae.get('reasoning')}")
            gt = f.get("grant_tier_eligible", {})
            print(f"    Grant tier: {gt.get('value')} (conf: {gt.get('confidence')})")
            print(f"    Reasoning: {gt.get('reasoning')}")
        elif "route" in f:
            print(f"  {prog}: {f['route']} (conf: {f.get('confidence')})")
        elif "county_status" in f:
            print(f"  {prog}: {f['county_status']}")
        elif "sponsor_eligible" in f:
            se = f["sponsor_eligible"]
            print(f"  {prog}: eligible={se.get('value')} (conf: {se.get('confidence')})")

    # Partners
    print(f"\n--- Partners ---")
    partners = record.get("partners", {})
    for p in partners.get("named", []):
        print(f"  [named] {p.get('name')} ({p.get('type')})")
    for p in partners.get("counted", []):
        print(f"  [counted] {p.get('type')}: {p.get('count')} in {p.get('geography')}")

    print(f"\n--- Governance ---")
    gov = record.get("governance", {})
    print(f"  Accreditor: {gov.get('accreditor')}")
    print(f"  Lease triggers substantive change: {gov.get('property_lease_triggers_substantive_change')}")

    print(f"\n--- Flags ---")
    print(f"  {record.get('flags', [])}")


if __name__ == "__main__":
    record = build_bethany_record()
    print_validation(record)
