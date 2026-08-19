"""
Census ACS data: population and median household income.

Used for USDA Community Facilities eligibility (spec §3.1).

Bethany WV population: 756 (2020 Census, per spec §7)
Brooke County MHI: $54,316 (ACS 2020-2024, per spec §7)

Note: service_area_MHI uses county MHI and MUST be labeled as an
approximation on the page (spec §3.1).
"""

import requests


# Census API — requires a key for data.census.gov API
# But the geocoder at geocoding.geo.census.gov does NOT require a key
CENSUS_API = "https://api.census.gov/data"


def fetch_census_data(county_fips, state):
    """Fetch population and MHI from Census ACS."""
    state_fips = county_fips[:2]
    county_code = county_fips[2:]

    result = {
        "place_population": None,
        "place_population_source": None,
        "county_mhi": None,
        "county_mhi_source": None,
        "county_population": None,
    }

    # Try ACS 5-year 2023 (most recent available)
    # B19013_001E = Median household income
    # B01003_001E = Total population
    acs_year = "2023"
    acs_url = f"{CENSUS_API}/{acs_year}/acs/acs5"

    try:
        # County-level MHI and population
        params = {
            "get": "B19013_001E,B01003_001E,NAME",
            "for": f"county:{county_code}",
            "in": f"state:{state_fips}",
        }
        resp = requests.get(acs_url, params=params, timeout=30)
        if resp.status_code == 200:
            data = resp.json()
            if len(data) > 1:
                row = data[1]
                mhi = _safe_int(row[0])
                pop = _safe_int(row[1])
                name = row[2]
                result["county_mhi"] = mhi
                result["county_population"] = pop
                result["county_mhi_source"] = f"ACS 5-year {acs_year}"
                print(f"  County MHI: ${mhi:,}" if mhi else "  County MHI: unavailable")
                print(f"  County population: {pop:,}" if pop else "  County pop: unavailable")
        else:
            print(f"  ACS county query returned {resp.status_code}")
    except Exception as e:
        print(f"  Warning: ACS county query failed: {e}")

    # Place-level population for USDA eligibility
    # Bethany is a CDP (Census Designated Place)
    # Try place-level query
    try:
        params = {
            "get": "B01003_001E,NAME",
            "for": "place:*",
            "in": f"state:{state_fips}",
        }
        resp = requests.get(acs_url, params=params, timeout=30)
        if resp.status_code == 200:
            data = resp.json()
            for row in data[1:]:
                name = row[1] if len(row) > 1 else ""
                if "Bethany" in name and ("CDP" in name or "town" in name.lower() or "WV" in name or "West Virginia" in name):
                    pop = _safe_int(row[0])
                    result["place_population"] = pop
                    result["place_population_source"] = f"ACS 5-year {acs_year}"
                    print(f"  Place population (Bethany): {pop}")
                    break

            if result["place_population"] is None:
                # Fall back to 2020 Census value from spec §7
                print("  Bethany CDP not found in ACS, using 2020 Census value: 756")
                result["place_population"] = 756
                result["place_population_source"] = "2020 Decennial Census (spec §7 verified)"
        else:
            print(f"  ACS place query returned {resp.status_code}, using spec value")
            result["place_population"] = 756
            result["place_population_source"] = "2020 Decennial Census (spec §7 verified)"
    except Exception as e:
        print(f"  Warning: ACS place query failed: {e}. Using spec value.")
        result["place_population"] = 756
        result["place_population_source"] = "2020 Decennial Census (spec §7 verified)"

    return result


def _safe_int(val):
    try:
        v = str(val).strip()
        if v in ("", "null", "None", "-"):
            return None
        return int(float(v))
    except (ValueError, TypeError):
        return None
