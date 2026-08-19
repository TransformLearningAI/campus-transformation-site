"""
HRSA Health Professional Shortage Areas (HPSA).

Uses the MapServer (NOT FeatureServer — per addendum §5, FeatureServer
returns "Server object extension not found").

Layers (component-polygon, county-joinable):
  11 = primary care
   3 = dental
   7 = mental health

Key fields (per addendum §5):
  HPSA_SCORE — Integer
  HPSA_TYP_DESC — e.g. "HPSA Population"
  HPSA_POPULATION_TYP_DESC — e.g. "Low Income Population HPSA"
  STATE_COUNTY_FIPS_CD — 5-char
  HPSA_STATUS_DESC — e.g. "Designated"

Score ranges (addendum §5):
  Primary care: 0-25
  Dental: 0-26
  Mental health: 0-25

IMPORTANT: All Brooke County HPSAs are Low Income Population designations,
NOT geographic. Page copy must not overstate coverage.
"""

import requests
import time

BASE_URL = "https://gisportal.hrsa.gov/server/rest/services/Shortage/HealthProfessionalShortageAreas_FS/MapServer"

LAYERS = {
    "primary_care": 11,
    "dental": 3,
    "mental_health": 7,
}

SCORE_RANGES = {
    "primary_care": "0-25",
    "dental": "0-26",
    "mental_health": "0-25",
}


def fetch_hpsa(county_fips):
    """Query HRSA MapServer for HPSA designations in a county."""
    results = []

    # Try MapServer first; if it returns empty for all 3, use spec §7 verified values
    api_found_any = False

    for domain, layer_id in LAYERS.items():
        url = f"{BASE_URL}/{layer_id}/query"
        params = {
            "where": f"STATE_COUNTY_FIPS_CD='{county_fips}'",
            "outFields": "HPSA_SCORE,HPSA_TYP_DESC,HPSA_POPULATION_TYP_DESC,HPSA_STATUS_DESC,HPSA_NAME",
            "returnGeometry": "false",
            "f": "pjson",  # Pin pjson per addendum §5; f=json sometimes returns HTML
        }

        for attempt in range(3):
            try:
                resp = requests.get(url, params=params, timeout=30)
                if resp.status_code == 403:
                    print(f"    HRSA 403 on attempt {attempt + 1}, retrying...")
                    time.sleep(2)
                    continue
                resp.raise_for_status()
                data = resp.json()
                break
            except Exception as e:
                if attempt == 2:
                    print(f"  Warning: HRSA {domain} query failed after 3 attempts: {e}")
                    data = {}
                time.sleep(2)

        features = data.get("features", [])
        designated = [
            f["attributes"] for f in features
            if f.get("attributes", {}).get("HPSA_STATUS_DESC") == "Designated"
        ]

        if not designated:
            print(f"  No designated {domain} HPSA in {county_fips}")
            continue

        # Take the highest score among designated HPSAs
        best = max(designated, key=lambda x: x.get("HPSA_SCORE", 0))
        score = best.get("HPSA_SCORE")
        typ = best.get("HPSA_TYP_DESC", "")
        pop_typ = best.get("HPSA_POPULATION_TYP_DESC", "")

        # Scores are integers per addendum §5
        if isinstance(score, float):
            score = int(score)

        label = domain.replace("_", " ").title()
        designation_note = ""
        if "Low Income" in pop_typ:
            designation_note = f" ({pop_typ} — covers low-income population, not every resident)"
        elif pop_typ:
            designation_note = f" ({pop_typ})"

        results.append({
            "domain": "health",
            "headline": f"{label} shortage: HPSA score {score}{designation_note}",
            "metric": f"HPSA score {score} (range {SCORE_RANGES[domain]})",
            "detail": f"Designation type: {typ}. {pop_typ}." if pop_typ else f"Designation type: {typ}.",
            "geography": f"Brooke County ({county_fips})",
            "vintage": "HRSA, reconfirmed Aug 2026",
            "source_url": f"https://data.hrsa.gov/tools/shortage-area",
            "confidence": "high"
        })

        api_found_any = True
        print(f"  {label}: score {score}, {typ}, {pop_typ}")

    # If API returned nothing, fall back to spec §7 verified values for Brooke County
    if not api_found_any and county_fips == "54009":
        print("  HRSA API returned no results; using spec §7 verified values")
        verified = [
            ("primary_care", 16, "Low Income Population HPSA"),
            ("dental", 11, "Low Income Population HPSA"),
            ("mental_health", 12, "Low Income Population HPSA"),
        ]
        for domain, score, pop_typ in verified:
            label = domain.replace("_", " ").title()
            results.append({
                "domain": "health",
                "headline": f"{label} shortage: HPSA score {score} ({pop_typ} — covers low-income population, not every resident)",
                "metric": f"HPSA score {score} (range {SCORE_RANGES[domain]})",
                "detail": f"Designation type: HPSA Population. {pop_typ}.",
                "geography": f"Brooke County ({county_fips})",
                "vintage": "HRSA, reconfirmed Aug 2026 (spec §7 verified)",
                "source_url": "https://data.hrsa.gov/tools/shortage-area",
                "confidence": "high"
            })

    return results
