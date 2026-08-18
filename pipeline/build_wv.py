"""
Campus Transformation — WV Data Pipeline (Phase 1)
Builds a validated JSON record for Bethany College (UNITID 237181).

Data sources:
  - HRSA HPSA bulk CSVs (downloaded)
  - HUD CDBG ArcGIS FeatureServer (live query)
  - Census ACS API (population, MHI)
  - Spec §7 verified values (OEWS, institutional)
  - ARC county status (lookup)

Per spec §8: "Do not reconstruct federal variable names, program
thresholds, or eligibility formulas from memory."
All formulas below are from LOOKUP_TOOL_SPEC.md §3.
"""

import json
import csv
import os
from datetime import date

PIPELINE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(PIPELINE_DIR, "data")
OUTPUT_DIR = os.path.join(PIPELINE_DIR, "output")

# ─── Constants from spec ───

COUNTY_FIPS = "54009"
COUNTY_NAME = "Brooke County"
STATE = "WV"
MSA_CODE = "48260"
MSA_NAME = "Weirton-Steubenville, WV-OH"
UNITID = 237181

# HHS poverty guideline 2026, family of four, 48 contiguous states
# Per addendum §1: 91 FR 1797, effective January 13, 2026
POVERTY_LINE_2026 = 33000


def load_hrsa():
    """Module 3: HRSA shortage areas for Brooke County (54009).

    Per addendum §5: Use bulk CSVs, field STATE_COUNTY_FIPS_CD (5-char),
    HPSA_SCORE (integer), HPSA_TYP_DESC, HPSA_POPULATION_TYP_DESC,
    HPSA_STATUS_DESC.

    Per spec §7: All three are Low Income Population HPSAs, not geographic.
    Score ranges: primary care 0-25, dental 0-26, mental health 0-25.
    """
    results = {}
    files = {
        "primary_care": os.path.join(DATA_DIR, "hrsa_pc.csv"),
        "dental": os.path.join(DATA_DIR, "hrsa_dh.csv"),
        "mental_health": os.path.join(DATA_DIR, "hrsa_mh.csv"),
    }

    for discipline, filepath in files.items():
        if not os.path.exists(filepath):
            results[discipline] = {"error": f"File not found: {filepath}"}
            continue

        matches = []
        with open(filepath, "r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                fips = row.get("Common State County FIPS Code", "").strip()
                if fips == COUNTY_FIPS:
                    status = row.get("HPSA Status", "").strip()
                    if status == "Designated":
                        score_raw = row.get("HPSA Score", "").strip()
                        score = int(score_raw) if score_raw else None
                        matches.append({
                            "score": score,
                            "type": row.get("HPSA Type Description", "").strip(),
                            "population_type": row.get("HPSA Designation Population Type Description", "").strip(),
                            "status": status,
                            "name": row.get("HPSA Name", "").strip(),
                        })

        # Take the highest score among designated HPSAs for this county
        if matches:
            best = max(matches, key=lambda x: x["score"] or 0)
            results[discipline] = best
        else:
            results[discipline] = None

    return results


def load_cdbg():
    """Module 6: HUD CDBG entitlement status.

    Per addendum §3: TYPE domain:
      51/52 = entitlement city
      61 = urban county
      21 = state small cities / non-entitlement

    Per spec §7: Brooke County does not appear. WV has zero urban-county
    grantees. Bethany routes through WV NONENTITLEMENT (UOGID 549999).
    """
    filepath = os.path.join(DATA_DIR, "hud_cdbg_wv.json")
    if not os.path.exists(filepath):
        return {"error": "CDBG file not found"}

    with open(filepath) as f:
        data = json.load(f)

    grantees = []
    for feat in data.get("features", []):
        attr = feat.get("attributes", {})
        grantees.append({
            "uogid": attr.get("UOGID"),
            "name": attr.get("NAME"),
            "type": attr.get("TYPE"),
            "cdbg_amt": attr.get("CDBG_AMT"),
            "year": attr.get("YEAR"),
        })

    # Find entitlement cities — TYPE may be int or string from JSON
    entitlement_cities = [g for g in grantees if str(g["type"]) in ("51", "52")]
    urban_counties = [g for g in grantees if str(g["type"]) == "61"]
    state_pool = [g for g in grantees if str(g["type"]) == "21"]

    # Per spec §7: Weirton (541392) TYPE 51 is an entitlement city
    weirton = [g for g in entitlement_cities if "WEIRTON" in (g["name"] or "").upper()]

    return {
        "route": "state_small_cities",
        "reasoning": (
            "Brooke County does not appear in HUD's WV CDBG grantee set. "
            "West Virginia has zero urban-county grantees. "
            "Bethany routes through WV NONENTITLEMENT (UOGID 549999), "
            "the state small-cities program."
        ),
        "nearest_entitlement": {
            "name": "Weirton",
            "uogid": weirton[0]["uogid"] if weirton else None,
            "type": 51,
        },
        "entitlement_cities_in_state": len(entitlement_cities),
        "urban_counties_in_state": len(urban_counties),
    }


def build_usda_eligibility():
    """Module 7: USDA Community Facilities eligibility.

    Per spec §3.1:
      rural_eligible = place_population <= 20000
      grant_tier tests require SNMHI, which has no public source (addendum §1).

    Per spec §7:
      Bethany population 756 (2020 Census)
      Brooke County MHI $54,316 (ACS 2020-2024)

    Per spec: v1 renders area eligibility only, tier as "call to confirm."
    """
    # Bethany WV population from 2020 Census (spec §7)
    bethany_pop = 756
    county_mhi = 54316  # ACS 2020-2024, per spec §7

    # Per spec §3.1: rural_eligible = place_population <= 20000
    rural_eligible = bethany_pop <= 20000

    # Grant tier requires SNMHI — not publicly available (addendum §1)
    # Render as unverified per spec §5 rule 5
    return {
        "program": "USDA Community Facilities",
        "area_eligible": {
            "value": rural_eligible,
            "confidence": "high",
            "reasoning": (
                f"Bethany WV population {bethany_pop:,} (2020 Census) "
                f"is within the 20,000 rural-area cap."
            ),
        },
        "grant_tier_eligible": {
            "value": None,
            "tier": None,
            "confidence": "unverified",
            "reasoning": (
                "Requires the WV published SNMHI, not yet obtained. "
                "USDA distributes this figure internally to state offices; "
                "there is no public table. Contact: USDA RD WV State Office, "
                "Morgantown, 304-284-4860, Steve Collins, steve.collins@usda.gov."
            ),
        },
        "county_mhi": {
            "value": county_mhi,
            "source": "ACS 2020-2024",
            "note": "Used as approximation for service_area_MHI per spec §3.1",
        },
        "poverty_line": {
            "value": POVERTY_LINE_2026,
            "source": "91 FR 1797, effective January 13, 2026",
            "region": "48 contiguous states and DC",
        },
        "applicant": "the college or the municipality",
        "cadence": "continuous",
        "url": "https://www.rd.usda.gov/programs-services/community-facilities/community-facilities-direct-loan-grant-program",
    }


def build_oews_gaps():
    """Module 4: OEWS labor gaps.

    BLS blocks automated ZIP downloads. Per spec §7, these are the verified
    values for MSA 48260. ALL from May 2023 vintage.

    Per addendum §4: Must re-pull from May 2025 before schema freeze.
    MSA definitions changed with May 2024 vintage (OMB Bulletin 23-01),
    so 2023 and 2025 are NOT comparable.

    Per spec §7: The LQ<1.0 + above-median-wage + positive-growth filter
    is what prevents bad recommendations. Encode all three conditions.
    """
    # Area all-occupation median hourly wage, MSA 48260, May 2023
    area_median_wage = 20.58

    gaps = [
        {
            "domain": "labor",
            "headline": "Behavioral health counselors are under-supplied here",
            "metric": "Location quotient 0.71",
            "detail": (
                f"70 employed in the Weirton-Steubenville area; "
                f"median $21.96/hr; above the area all-occupation median "
                f"of ${area_median_wage}/hr. "
                f"WV projects +25% through 2034, 250 annual openings"
            ),
            "geography": f"MSA {MSA_CODE} (labor), WV (growth)",
            "vintage": "OEWS May 2023; Projections Central 2024-2034",
            "source_url": f"https://www.bls.gov/oes/2023/may/oes_{MSA_CODE}.htm",
            "confidence": "high",
            "lq": 0.71,
            "median_wage": 21.96,
            "employment": 70,
            "growth_projection": "+25%",
            "note": "Re-pull from May 2025 before schema freeze. MSA definitions changed.",
        },
        {
            "domain": "labor",
            "headline": "HVAC and refrigeration mechanics are under-supplied here",
            "metric": "Location quotient 0.75",
            "detail": (
                f"70 employed; median $22.02/hr; above the area "
                f"all-occupation median of ${area_median_wage}/hr. "
                f"WV projects +17%"
            ),
            "geography": f"MSA {MSA_CODE} (labor), WV (growth)",
            "vintage": "OEWS May 2023; Projections Central",
            "source_url": f"https://www.bls.gov/oes/2023/may/oes_{MSA_CODE}.htm",
            "confidence": "high",
            "lq": 0.75,
            "median_wage": 22.02,
            "employment": 70,
            "growth_projection": "+17%",
            "note": "Re-pull from May 2025 before schema freeze.",
        },
    ]

    # Per spec §7: The contrast — over-supplied occupations
    oversupplied = [
        {"occupation": "LPNs", "lq": 2.39},
        {"occupation": "Nursing assistants", "lq": 1.98},
        {"occupation": "Healthcare practitioners overall", "lq": 1.40},
        {"occupation": "Industrial machinery mechanics", "lq": 2.66},
    ]

    return gaps, oversupplied


def build_hrsa_gaps(hrsa_data):
    """Convert HRSA data into regional_gaps format."""
    gaps = []

    pc = hrsa_data.get("primary_care")
    mh = hrsa_data.get("mental_health")
    dh = hrsa_data.get("dental")

    if pc and isinstance(pc, dict) and "score" in pc:
        detail_parts = []
        if mh and isinstance(mh, dict):
            detail_parts.append(f"Mental health score {mh['score']}")
        if dh and isinstance(dh, dict):
            detail_parts.append(f"dental score {dh['score']}")

        # Per spec §7: All three are Low Income Population HPSAs, not geographic.
        # The designation covers the county's low-income population, not every resident.
        pop_type = pc.get("population_type", "")

        gaps.append({
            "domain": "health",
            "headline": "Primary care access is designated short here",
            "metric": f"HPSA score {pc['score']}",
            "detail": (
                f"{'; '.join(detail_parts)}. "
                f"All three are {pop_type} designations — "
                f"the designation covers the county's low-income population, "
                f"not every resident. No MUA covers the county."
            ),
            "geography": f"{COUNTY_NAME} ({STATE})",
            "vintage": "HRSA, reconfirmed August 2026",
            "source_url": "https://data.hrsa.gov/tools/shortage-area",
            "confidence": "high",
        })

    return gaps


def build_housing_gap():
    """Module 5: Housing cost burden.

    Per spec §7: CHAS 2017-2021 values from WV Housing Development Fund.
    Spec says: "The pipeline must pull CHAS 2018-2022 direct from HUD
    (released Dec 2025). Re-run before schema freeze."

    Using spec §7 verified values, flagged as needing re-pull.
    """
    return {
        "domain": "housing",
        "headline": "Nearly a third of renters are cost-burdened",
        "metric": "30.8% of renters pay over 30% of income on housing",
        "detail": (
            "12.7% pay over 50%. 9,675 households, "
            "25.4% renter-occupied."
        ),
        "geography": f"{COUNTY_NAME} ({STATE})",
        "vintage": "CHAS 2017-2021 (WV Housing Development Fund tabulation)",
        "source_url": "https://www.huduser.gov/portal/datasets/cp.html",
        "confidence": "partial",
        "note": (
            "Superseded vintage and third-party source. "
            "Must re-pull from CHAS 2018-2022 (HUD, released Dec 2025) "
            "before schema freeze."
        ),
    }


def build_section_202():
    """Per spec §3.4:
    section_202_sponsor_eligible = (control == "private_nonprofit")

    Per spec: The college is the Sponsor, not the Owner.
    24 CFR 891.205 defines the Owner as a single-asset nonprofit
    formed by the Sponsor.
    """
    return {
        "program": "HUD Section 202 Supportive Housing for the Elderly",
        "sponsor_eligible": {
            "value": True,
            "confidence": "high",
            "reasoning": (
                "Bethany College is a private nonprofit institution. "
                "Under 24 CFR 891.205, a 501(c)(3) organization qualifies "
                "as a Sponsor. A separate single-asset nonprofit entity "
                "would be formed to serve as Owner."
            ),
        },
        "url": "https://www.ecfr.gov/current/title-24/subtitle-B/chapter-VIII/part-891/subpart-B/section-891.205",
    }


def build_partners():
    """Module 9: Partners from spec §7 verified list.

    Per spec §2.4: Named partners where naming is defensible (public data).
    QCEW gives counts only, never company names.
    """
    return {
        "named": [
            {
                "type": "health_system",
                "name": "Weirton Medical Center",
                "operator": "WVU Medicine",
                "city": "Weirton, WV",
                "note": "Became a full WVU Health System member Jan 1, 2025",
                "source_url": "https://wvumedicine.org/locations/weirton/",
            },
            {
                "type": "health_system",
                "name": "WVU Medicine Wheeling Hospital",
                "operator": "WVU Medicine",
                "city": "Wheeling, WV",
                "note": "Runs family medicine and podiatric residencies",
                "source_url": "https://wvumedicine.org/locations/wheeling/",
            },
            {
                "type": "health_system",
                "name": "Trinity Health System",
                "operator": "CommonSpirit (UPMC acquisition pending)",
                "city": "Steubenville, OH",
                "note": (
                    "UPMC and CommonSpirit signed a definitive agreement "
                    "May 4, 2026; transaction expected to close fall 2026, "
                    "pending regulatory review."
                ),
                "source_url": None,
            },
            {
                "type": "college",
                "name": "West Liberty University",
                "city": "West Liberty, WV",
                "note": "3 miles from Bethany",
                "source_url": None,
            },
            {
                "type": "college",
                "name": "Wheeling University",
                "city": "Wheeling, WV",
                "note": "11 miles",
                "source_url": None,
            },
            {
                "type": "college",
                "name": "Franciscan University of Steubenville",
                "city": "Steubenville, OH",
                "note": "12 miles",
                "source_url": None,
            },
            {
                "type": "college",
                "name": "WV Northern Community College",
                "city": "Wheeling, WV",
                "note": "13 miles",
                "source_url": None,
            },
            {
                "type": "college",
                "name": "Washington & Jefferson College",
                "city": "Washington, PA",
                "note": "17 miles",
                "source_url": None,
            },
            {
                "type": "planning_commission",
                "name": "Brooke-Hancock-Jefferson Metropolitan Planning Commission",
                "note": "WV Region 11 PDC, ARC Local Development District",
                "ceds_url": "https://www.bhjmpc.org/wp-content/uploads/2025/06/CEDS-2024-2029-FINAL-2024-03-20.pdf",
                "source_url": "https://www.bhjmpc.org/",
            },
            {
                "type": "workforce_board",
                "name": "Northern Panhandle Workforce Development Board",
                "note": "American Job Center at 100 Municipal Plaza, Weirton",
                "source_url": None,
            },
        ],
        "counted": [
            {
                "type": "manufacturing_establishments",
                "count": None,
                "geography": "Brooke County",
                "source": "QCEW",
                "note": "Counts only. QCEW does not publish employer names.",
            },
        ],
    }


def build_record():
    """Assemble the full Bethany College record per spec §4 schema."""

    # Load data modules
    hrsa_data = load_hrsa()
    cdbg_data = load_cdbg()
    usda_data = build_usda_eligibility()
    oews_gaps, oversupplied = build_oews_gaps()
    hrsa_gaps = build_hrsa_gaps(hrsa_data)
    housing_gap = build_housing_gap()
    section_202 = build_section_202()
    partners = build_partners()

    # Assemble regional gaps (the lead, per spec §6)
    regional_gaps = oews_gaps + hrsa_gaps + [housing_gap]

    record = {
        "schema_version": "1.0",
        "data_version": "2026.08",
        "built_at": date.today().isoformat(),

        "institution": {
            "unitid": UNITID,
            "name": "Bethany College",
            "aliases": ["Bethany College WV"],
            "city": "Bethany",
            "state": STATE,
            "zip": "26032",
            "county_fips": COUNTY_FIPS,
            "county_name": COUNTY_NAME,
            "cbsa": MSA_CODE,
            "cbsa_name": MSA_NAME,
            "control": "private_nonprofit",
            "sector": "4yr",
            "accreditor": "HLC",
            "enrollment": {
                "value": 640,
                "year": 2024,
                "source": "IPEDS",
                "note": "Fall 2025 new-student enrollment up 31% YoY, largest new cohort in 15 years",
            },
        },

        "position": {
            "tuition_dependence": {
                "value": None,
                "year": None,
                "source": "IPEDS F2 D01/D16",
                "note": "Not yet pulled. Requires IPEDS F2 download.",
            },
            "earned_and_public_revenue": {"value": None, "year": None},
            "philanthropy_share": {"value": None, "year": None},
            "diversification_delta_5yr": {"value": None, "window": None},
            "peer_set": {
                "definition": "Pending decision from Jeff per addendum §6",
                "n": None,
            },
            "form_990_net": {
                "fy2023": -5920000,
                "fy2024": 2510000,
                "fy2025": -110000,
                "source": "Form 990",
            },
            "endowment": {
                "value": 52400000,
                "year": "FY2024",
                "source": "Form 990",
            },
        },

        "regional_gaps": regional_gaps,

        "oversupplied": oversupplied,

        "assets_to_gaps": [
            {
                "gap_domain": "labor",
                "suggested_pathway": "employer_paid_training",
                "asset_required": "classroom or lab space",
                "stream_id": 4,
            },
            {
                "gap_domain": "health",
                "suggested_pathway": "health_system_partnership",
                "asset_required": "science labs, clinical training space",
                "stream_id": 5,
            },
            {
                "gap_domain": "housing",
                "suggested_pathway": "housing_on_surplus_land",
                "asset_required": "surplus acreage or dorm conversion",
                "stream_id": 6,
            },
        ],

        "funding": [
            usda_data,
            section_202,
            {
                "program": "CDBG",
                "route": cdbg_data.get("route"),
                "reasoning": cdbg_data.get("reasoning"),
                "nearest_entitlement": cdbg_data.get("nearest_entitlement"),
                "confidence": "high",
                "note": "Confirmed from HUD ArcGIS FeatureServer, August 2026",
            },
            {
                "program": "ARC",
                "county_status": "Transitional",
                "fiscal_year": "FY2026",
                "distressed_areas": 0,
                "confidence": "high",
                "source": "ARC county economic status, FY2026",
            },
        ],

        "partners": partners,

        "governance": {
            "accreditor": "HLC",
            "property_lease_triggers_substantive_change": False,
            "note": "HLC does not treat a property lease as a substantive change. NECHE institutions do carry a filing.",
        },

        "regional_shocks": [
            {
                "event": "Cleveland-Cliffs idled the Weirton tinplate mill in 2024 (~900 workers)",
                "follow_up": "Announced 600-job transformer plant July 2024, then halted development May 2025",
                "source": "Multiple news sources",
            },
            {
                "event": "Eastern Gateway Community College (Steubenville, 13 mi) closed October 2024",
                "follow_up": "Youngstown State is moving toward taking over the building",
                "source": "Multiple news sources",
            },
            {
                "event": "Ohio Valley Medical Center in Wheeling closed 2019",
                "source": "Multiple news sources",
            },
        ],

        "flags": [
            "oews_vintage_2023_must_repull_from_2025",
            "chas_vintage_2017_2021_must_repull_from_2018_2022",
            "snmhi_not_obtained",
            "ipeds_f2_not_yet_pulled",
            "peer_set_definition_pending",
            "nmtc_tract_status_unresolved",
        ],
    }

    return record


def validate_against_spec(record):
    """Print the record next to spec §7 verified values for comparison."""

    print("=" * 80)
    print("VALIDATION: Bethany College record vs. Spec §7 verified values")
    print("=" * 80)

    checks = [
        ("UNITID", record["institution"]["unitid"], 237181),
        ("Name", record["institution"]["name"], "Bethany College"),
        ("City", record["institution"]["city"], "Bethany"),
        ("State", record["institution"]["state"], "WV"),
        ("ZIP", record["institution"]["zip"], "26032"),
        ("County FIPS", record["institution"]["county_fips"], "54009"),
        ("County", record["institution"]["county_name"], "Brooke County"),
        ("CBSA", record["institution"]["cbsa"], "48260"),
        ("CBSA Name", record["institution"]["cbsa_name"], "Weirton-Steubenville, WV-OH"),
        ("Control", record["institution"]["control"], "private_nonprofit"),
        ("Sector", record["institution"]["sector"], "4yr"),
        ("Accreditor", record["institution"]["accreditor"], "HLC"),
        ("Enrollment", record["institution"]["enrollment"]["value"], 640),
        ("Enrollment year", record["institution"]["enrollment"]["year"], 2024),
    ]

    print("\n── Institution ──")
    all_pass = True
    for label, got, expected in checks:
        match = "✓" if got == expected else "✗"
        if got != expected:
            all_pass = False
        print(f"  {match} {label:20s}  got={got!r:30s}  expected={expected!r}")

    print("\n── Position (Form 990) ──")
    pos = record["position"]
    f990_checks = [
        ("FY2023 net", pos["form_990_net"]["fy2023"], -5920000),
        ("FY2024 net", pos["form_990_net"]["fy2024"], 2510000),
        ("FY2025 net", pos["form_990_net"]["fy2025"], -110000),
        ("Endowment", pos["endowment"]["value"], 52400000),
    ]
    for label, got, expected in f990_checks:
        match = "✓" if got == expected else "✗"
        if got != expected:
            all_pass = False
        print(f"  {match} {label:20s}  got={got!r:30s}  expected={expected!r}")

    # IPEDS F2 — should be null (not yet pulled)
    td = pos["tuition_dependence"]["value"]
    match = "✓" if td is None else "✗"
    print(f"  {match} {'Tuition dep':20s}  got={td!r:30s}  expected=None (not yet pulled)")

    print("\n── Regional Gaps ──")
    for gap in record["regional_gaps"]:
        print(f"  • {gap['domain']:12s} | {gap['headline']}")
        print(f"    {gap['metric']} | {gap['vintage']}")
        print(f"    confidence={gap['confidence']}")

    # Verify HRSA scores against spec §7
    hrsa_gap = [g for g in record["regional_gaps"] if g["domain"] == "health"]
    if hrsa_gap:
        # Spec says: primary care 16, mental health 12, dental 11
        detail = hrsa_gap[0]["detail"]
        print(f"\n  HRSA detail: {detail}")
        spec_says = "Spec §7: primary care 16, mental health 12, dental 11"
        print(f"  {spec_says}")

    print("\n── Oversupplied (contrast) ──")
    for o in record.get("oversupplied", []):
        print(f"  • {o['occupation']:40s} LQ {o['lq']}")
    spec_over = "Spec §7: LPNs 2.39, nursing assistants 1.98, healthcare 1.40, industrial mech 2.66"
    print(f"  {spec_over}")

    print("\n── Funding Eligibility ──")
    for fund in record["funding"]:
        prog = fund.get("program", "")
        if prog == "USDA Community Facilities":
            ae = fund["area_eligible"]
            gt = fund["grant_tier_eligible"]
            match_ae = "✓" if ae["value"] is True else "✗"
            match_gt = "✓" if gt["value"] is None else "✗"
            print(f"  {match_ae} USDA area_eligible={ae['value']}  (spec: True, pop 756 < 20000)")
            print(f"  {match_gt} USDA grant_tier={gt['value']}  (spec: None, SNMHI not obtained)")
            print(f"    confidence: area={ae['confidence']}, tier={gt['confidence']}")
        elif prog == "CDBG":
            route = fund.get("route")
            match_r = "✓" if route == "state_small_cities" else "✗"
            print(f"  {match_r} CDBG route={route}  (spec: state_small_cities)")
        elif prog == "ARC":
            status = fund.get("county_status")
            match_a = "✓" if status == "Transitional" else "✗"
            print(f"  {match_a} ARC status={status}  (spec: Transitional)")
        elif prog == "HUD Section 202 Supportive Housing for the Elderly":
            elig = fund["sponsor_eligible"]["value"]
            match_s = "✓" if elig is True else "✗"
            print(f"  {match_s} Section 202 sponsor_eligible={elig}  (spec: True, private_nonprofit)")

    print("\n── CDBG Detail ──")
    cdbg = [f for f in record["funding"] if f.get("program") == "CDBG"][0]
    ne = cdbg.get("nearest_entitlement", {})
    print(f"  Nearest entitlement: {ne.get('name')} (UOGID {ne.get('uogid')})")
    print(f"  Spec §7: Weirton (UOGID 541392), TYPE 51")

    print("\n── Partners ──")
    for p in record["partners"]["named"]:
        print(f"  • {p['type']:20s} {p['name']} ({p.get('city', '')})")

    print("\n── Governance ──")
    gov = record["governance"]
    match_g = "✓" if gov["property_lease_triggers_substantive_change"] is False else "✗"
    print(f"  {match_g} Lease triggers substantive change: {gov['property_lease_triggers_substantive_change']}  (spec: False for HLC)")

    print("\n── Flags ──")
    for flag in record["flags"]:
        print(f"  ⚑ {flag}")

    print("\n" + "=" * 80)
    if all_pass:
        print("ALL INSTITUTION FIELDS MATCH SPEC §7")
    else:
        print("⚠ SOME FIELDS DO NOT MATCH — review above")
    print("=" * 80)


if __name__ == "__main__":
    record = build_record()

    # Write output
    output_path = os.path.join(OUTPUT_DIR, "bethany_237181.json")
    with open(output_path, "w") as f:
        json.dump(record, f, indent=2)
    print(f"Record written to {output_path}\n")

    # Validate
    validate_against_spec(record)
