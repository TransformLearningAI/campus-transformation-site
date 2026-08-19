"""
IPEDS data: institution spine (HD file) and finance (F2 file).

Variable names come from the IPEDS data dictionary for each survey year.
DO NOT reconstruct variable names from memory.

HD file variables (2024):
  UNITID, INSTNM, IALIAS, CITY, STABBR, ZIP, COUNTYCD, CBSA, CBSATYPE,
  CONTROL, SECTOR, ICLEVEL, INSTCAT, CLOSEDAT, CYMERGE

F2 file variables (FASB, private nonprofit) — Part D revenue:
  UNITID, F2D01, F2D05, F2D06, F2D07, F2D08, F2D11, F2D12, F2D15, F2D16

Source: https://nces.ed.gov/ipeds/datacenter/
"""

import csv
import io
import os
import zipfile
import requests


# IPEDS data center URLs for the most recent complete data
# HD2024 = Institutional Characteristics 2024-25
HD_URL = "https://nces.ed.gov/ipeds/datacenter/data/HD2024.zip"
# F2 file naming: F{startYY}{endYY}_F2 for private nonprofit FASB
# Try most recent first, fall back to prior year
F2_URLS = [
    ("https://nces.ed.gov/ipeds/datacenter/data/F2223_F2.zip", 2022),
    ("https://nces.ed.gov/ipeds/datacenter/data/F2122_F2.zip", 2021),
]
# Enrollment — EFFY is 12-month unduplicated; EF fall enrollment is the point-in-time
EFFY_URL = "https://nces.ed.gov/ipeds/datacenter/data/EFFY2024.zip"
# Fall enrollment (EF) — provides fall headcount
EF_FALL_URLS = [
    ("https://nces.ed.gov/ipeds/datacenter/data/EF2024A.zip", 2024),
    ("https://nces.ed.gov/ipeds/datacenter/data/EF2023A.zip", 2023),
]
# Prior year F2 for 5-year delta (5 years before most recent)
F2_PRIOR_URLS = [
    ("https://nces.ed.gov/ipeds/datacenter/data/F1718_F2.zip", 2017),
    ("https://nces.ed.gov/ipeds/datacenter/data/F1617_F2.zip", 2016),
]

# Accreditor mapping from IPEDS ACCREDAGENCY field isn't in HD;
# we hard-code known values for WV schools (verified from spec §7)
ACCREDITOR_MAP = {
    237181: "HLC",  # Bethany College — verified
}

# Control code mapping (IPEDS CONTROL field)
CONTROL_MAP = {
    1: "public",
    2: "private_nonprofit",
    3: "private_forprofit",
}

# Level mapping (ICLEVEL)
LEVEL_MAP = {
    1: "4yr",
    2: "2yr",
    3: "less_than_2yr",
}


def _download_and_extract_csv(url, data_dir, expected_prefix=None):
    """Download a ZIP from IPEDS and extract the CSV."""
    fname = url.split("/")[-1]
    zip_path = os.path.join(data_dir, fname)

    if not os.path.exists(zip_path):
        print(f"  Downloading {fname}...")
        resp = requests.get(url, timeout=120)
        resp.raise_for_status()
        with open(zip_path, "wb") as f:
            f.write(resp.content)
        print(f"  Downloaded ({len(resp.content) // 1024}KB)")
    else:
        print(f"  Using cached {fname}")

    with zipfile.ZipFile(zip_path) as zf:
        csv_names = [n for n in zf.namelist() if n.lower().endswith(".csv")]
        if expected_prefix:
            csv_names = [n for n in csv_names if n.lower().startswith(expected_prefix.lower())]
        if not csv_names:
            # Try case-insensitive match without the _rv suffix
            csv_names = [n for n in zf.namelist() if n.lower().endswith(".csv")]

        # Prefer the non-dictionary, non-flags file
        data_csvs = [n for n in csv_names if "_dict_" not in n.lower() and "flags" not in n.lower()]
        if data_csvs:
            csv_name = data_csvs[0]
        else:
            csv_name = csv_names[0]

        print(f"  Extracting {csv_name}...")
        with zf.open(csv_name) as cf:
            content = cf.read().decode("utf-8-sig", errors="replace")
            reader = csv.DictReader(io.StringIO(content))
            return list(reader), reader.fieldnames


def _safe_int(val):
    """Convert to int, returning None for missing/invalid."""
    if val is None:
        return None
    try:
        v = str(val).strip()
        if v in ("", ".", "-2", "-1"):  # IPEDS missing codes
            return None
        return int(float(v))
    except (ValueError, TypeError):
        return None


def _safe_float(val):
    """Convert to float, returning None for missing/invalid."""
    if val is None:
        return None
    try:
        v = str(val).strip()
        if v in ("", ".", "-2", "-1"):
            return None
        return float(v)
    except (ValueError, TypeError):
        return None


def fetch_institution_spine(unitid, data_dir):
    """Fetch institution characteristics from IPEDS HD file."""
    rows, fields = _download_and_extract_csv(HD_URL, data_dir, "hd")

    print(f"  Available fields: {fields[:20]}...")

    # Find the row for our UNITID
    row = None
    for r in rows:
        if _safe_int(r.get("UNITID")) == unitid:
            row = r
            break

    if not row:
        raise ValueError(f"UNITID {unitid} not found in HD file")

    control_code = _safe_int(row.get("CONTROL"))
    level_code = _safe_int(row.get("ICLEVEL"))

    # County FIPS: IPEDS COUNTYCD is a numeric field, needs zero-padding to 5 digits
    county_raw = _safe_int(row.get("COUNTYCD"))
    county_fips = f"{county_raw:05d}" if county_raw else None

    # Get enrollment from EFFY file
    enrollment_val = _fetch_enrollment(unitid, data_dir)

    return {
        "unitid": unitid,
        "name": row.get("INSTNM", "").strip(),
        "aliases": [a.strip() for a in (row.get("IALIAS") or "").split("|") if a.strip()],
        "city": row.get("CITY", "").strip(),
        "state": row.get("STABBR", "").strip(),
        "zip": row.get("ZIP", "").strip()[:5],
        "county_fips": county_fips,
        "county_name": _county_name(county_fips),
        "cbsa": row.get("CBSA", "").strip() if row.get("CBSA", "").strip() not in ("-2", "-1", "") else None,
        "cbsa_name": _cbsa_name(row.get("CBSA", "").strip()),
        "control": CONTROL_MAP.get(control_code, f"unknown_{control_code}"),
        "sector": LEVEL_MAP.get(level_code, f"unknown_{level_code}"),
        "accreditor": ACCREDITOR_MAP.get(unitid, "unknown"),
        "enrollment": enrollment_val,
    }


def _fetch_enrollment(unitid, data_dir):
    """Get fall enrollment from EF file. Fall headcount is the standard figure."""
    # Try fall enrollment files first (EF####A)
    for ef_url, year in EF_FALL_URLS:
        try:
            rows, fields = _download_and_extract_csv(ef_url, data_dir, "ef")
            # EF file: UNITID, EFALEVEL (level of student), EFTOTLT (total)
            # EFALEVEL=1 is "All students total" for grand total
            for r in rows:
                if _safe_int(r.get("UNITID")) == unitid:
                    level = str(r.get("EFALEVEL", r.get("EFNRALEV", ""))).strip()
                    if level == "1":
                        val = _safe_int(r.get("EFTOTLT"))
                        if val and val > 0:
                            print(f"  Fall enrollment: {val} ({year})")
                            return {"value": val, "year": year, "source": f"IPEDS EF fall {year}"}
        except Exception as e:
            print(f"  EF {year}: {e}, trying next...")

    # Fallback to EFFY 12-month
    try:
        rows, fields = _download_and_extract_csv(EFFY_URL, data_dir, "effy")
        for r in rows:
            if _safe_int(r.get("UNITID")) == unitid and str(r.get("EFFYALEV", "")).strip() == "1":
                val = _safe_int(r.get("EFYTOTLT"))
                if val and val > 0:
                    print(f"  12-month enrollment: {val}")
                    return {"value": val, "year": 2024, "source": "IPEDS EFFY 2024 (12-month)"}
    except Exception as e:
        print(f"  Warning: EFFY also failed: {e}")

    return {"value": None, "year": None, "source": "IPEDS"}


def _county_name(fips):
    """Map county FIPS to name. Hard-coded for WV Phase 1."""
    mapping = {
        "54009": "Brooke County",
        "54029": "Hancock County",
        "54051": "Marshall County",
        "54069": "Ohio County",
    }
    return mapping.get(fips, f"County {fips}")


def _cbsa_name(cbsa):
    """Map CBSA code to name. Hard-coded for Phase 1."""
    mapping = {
        "48260": "Weirton-Steubenville, WV-OH",
    }
    return mapping.get(cbsa)


def fetch_finance_f2(unitid, data_dir):
    """
    Fetch revenue mix from IPEDS F2 file (private nonprofit, FASB).

    Variable names per spec §2.2 and the F2 data dictionary:
      F2D01 = Tuition and fees, net
      F2D05 = Federal grants and contracts
      F2D06 = State grants and contracts
      F2D07 = Local government grants and contracts
      F2D08 = Private gifts, grants and contracts
      F2D11 = Sales and services of educational activities
      F2D12 = Sales and services of auxiliary enterprises, net
      F2D15 = Other revenue
      F2D16 = Total revenues and investment return (the denominator)
    """
    rows = None
    fields = None
    fy_year = None
    for f2_url, fy in F2_URLS:
        try:
            rows, fields = _download_and_extract_csv(f2_url, data_dir, "f")
            fy_year = fy
            print(f"  F2 fields available: {[f for f in (fields or []) if f.startswith('F2D')]}")
            break
        except Exception as e:
            print(f"  F2 {fy}: {e}, trying next...")
    if rows is None:
        print("  Warning: no F2 file available")
        return _empty_position()

    row = None
    for r in rows:
        if _safe_int(r.get("UNITID")) == unitid:
            row = r
            break

    if not row:
        print(f"  Warning: UNITID {unitid} not found in F2 file")
        return _empty_position()

    # Extract the Part D revenue variables
    d01 = _safe_float(row.get("F2D01"))  # Tuition and fees, net
    d05 = _safe_float(row.get("F2D05"))  # Federal grants and contracts
    d06 = _safe_float(row.get("F2D06"))  # State grants and contracts
    d07 = _safe_float(row.get("F2D07"))  # Local government grants and contracts
    d08 = _safe_float(row.get("F2D08"))  # Private gifts, grants and contracts
    d11 = _safe_float(row.get("F2D11"))  # Sales and services of educational activities
    d12 = _safe_float(row.get("F2D12"))  # Sales and services of auxiliary enterprises, net
    d15 = _safe_float(row.get("F2D15"))  # Other revenue
    d16 = _safe_float(row.get("F2D16"))  # Total revenues and investment return

    print(f"  F2D01={d01}, F2D05={d05}, F2D06={d06}, F2D07={d07}")
    print(f"  F2D08={d08}, F2D11={d11}, F2D12={d12}, F2D15={d15}, F2D16={d16}")

    # Computed fields per spec §2.2
    tuition_dep = None
    earned_public = None
    philanthropy = None

    if d16 and d16 > 0:
        if d01 is not None:
            tuition_dep = d01 / d16

        # earned_and_public_revenue = (F2D05 + F2D06 + F2D07 + F2D11 + F2D12 + F2D15) / F2D16
        # Deliberately excludes philanthropy (F2D08), appropriations, investment return
        earned_parts = [d05, d06, d07, d11, d12, d15]
        if all(v is not None for v in earned_parts):
            earned_public = sum(earned_parts) / d16

        if d08 is not None:
            philanthropy = d08 / d16

    # 5-year delta requires prior year data
    delta_5yr = None
    try:
        delta_5yr = _compute_5yr_delta(unitid, earned_public, data_dir)
    except Exception as e:
        print(f"  Warning: could not compute 5yr delta: {e}")

    return {
        "tuition_dependence": {
            "value": round(tuition_dep, 4) if tuition_dep is not None else None,
            "year": fy_year,
            "source": "IPEDS F2 D01/D16"
        },
        "earned_and_public_revenue": {
            "value": round(earned_public, 4) if earned_public is not None else None,
            "year": fy_year,
            "source": "IPEDS F2 (D05+D06+D07+D11+D12+D15)/D16"
        },
        "philanthropy_share": {
            "value": round(philanthropy, 4) if philanthropy is not None else None,
            "year": fy_year,
            "source": "IPEDS F2 D08/D16"
        },
        "diversification_delta_5yr": {
            "value": round(delta_5yr, 4) if delta_5yr is not None else None,
            "window": f"{fy_year - 5}-{fy_year}" if delta_5yr is not None else None,
            "source": "IPEDS F2"
        },
        "peer_set": {
            "definition": "Pending Jeff's decision per addendum §6",
            "n": None
        }
    }


def _compute_5yr_delta(unitid, current_earned, data_dir):
    """Compute diversification_delta_5yr from prior F2 data."""
    if current_earned is None:
        return None

    rows = None
    for prior_url, _ in F2_PRIOR_URLS:
        try:
            rows, _ = _download_and_extract_csv(prior_url, data_dir, "f")
            break
        except Exception:
            continue
    if rows is None:
        return None

    for r in rows:
        if _safe_int(r.get("UNITID")) == unitid:
            d05 = _safe_float(r.get("F2D05"))
            d06 = _safe_float(r.get("F2D06"))
            d07 = _safe_float(r.get("F2D07"))
            d11 = _safe_float(r.get("F2D11"))
            d12 = _safe_float(r.get("F2D12"))
            d15 = _safe_float(r.get("F2D15"))
            d16 = _safe_float(r.get("F2D16"))

            if d16 and d16 > 0:
                parts = [d05, d06, d07, d11, d12, d15]
                if all(v is not None for v in parts):
                    prior = sum(parts) / d16
                    return current_earned - prior
            break
    return None


def _empty_position():
    """Return empty position block when F2 data is unavailable."""
    return {
        "tuition_dependence": {"value": None, "year": None, "source": "IPEDS F2 D01/D16"},
        "earned_and_public_revenue": {"value": None, "year": None, "source": "IPEDS F2"},
        "philanthropy_share": {"value": None, "year": None, "source": "IPEDS F2"},
        "diversification_delta_5yr": {"value": None, "window": None, "source": "IPEDS F2"},
        "peer_set": {"definition": "Pending Jeff's decision per addendum §6", "n": None}
    }
