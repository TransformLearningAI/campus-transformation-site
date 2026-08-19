#!/usr/bin/env python3
"""
Campus Transformation — Data Pipeline: ALL STATES
Produces institutions.json for every private nonprofit 4-year college
under 3,000 FTE in the IPEDS universe.

Reuses cached IPEDS and OEWS data from the WV run.
"""

import csv
import io
import json
import os
import sys
import time
import zipfile
from collections import defaultdict
from datetime import date

sys.path.insert(0, os.path.dirname(__file__))

from sources.ipeds import (
    _download_and_extract_csv, _safe_int, _safe_float,
    HD_URL, F2_URLS, F2_PRIOR_URLS, CONTROL_MAP, LEVEL_MAP,
    ACCREDITOR_MAP,
)
from sources.hrsa import fetch_hpsa
from sources.cdbg import fetch_cdbg_route
from sources.usda import compute_usda_eligibility
from sources.partners import get_verified_partners

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Spec §1: ~1,700 private nonprofit 4-year institutions under 3,000 FTE
MAX_FTE = 3000


def load_all_institutions():
    """Load all institutions from IPEDS HD file, filter to target population."""
    print("Loading IPEDS HD file...")
    rows, fields = _download_and_extract_csv(HD_URL, DATA_DIR, "hd")

    institutions = []
    for r in rows:
        control = _safe_int(r.get("CONTROL"))
        level = _safe_int(r.get("ICLEVEL"))

        # Filter: private nonprofit (2), 4-year (1)
        if control != 2 or level != 1:
            continue

        # Skip closed institutions
        closedat = r.get("CLOSEDAT", "").strip()
        if closedat and closedat != "-2":
            continue

        unitid = _safe_int(r.get("UNITID"))
        if not unitid:
            continue

        county_raw = _safe_int(r.get("COUNTYCD"))
        county_fips = f"{county_raw:05d}" if county_raw else None

        institutions.append({
            "unitid": unitid,
            "name": r.get("INSTNM", "").strip(),
            "city": r.get("CITY", "").strip(),
            "state": r.get("STABBR", "").strip(),
            "zip": r.get("ZIP", "").strip()[:5],
            "county_fips": county_fips,
            "cbsa": r.get("CBSA", "").strip() if r.get("CBSA", "").strip() not in ("-2", "-1", "") else None,
            "control": "private_nonprofit",
            "sector": "4yr",
        })

    print(f"  Found {len(institutions)} private nonprofit 4-year institutions")
    return institutions


def load_enrollment_map():
    """Load fall enrollment for all institutions."""
    print("Loading enrollment data...")
    ef_urls = [
        ("https://nces.ed.gov/ipeds/datacenter/data/EF2023A.zip", 2023),
    ]
    enrollment = {}
    for url, year in ef_urls:
        try:
            rows, _ = _download_and_extract_csv(url, DATA_DIR, "ef")
            for r in rows:
                uid = _safe_int(r.get("UNITID"))
                level = str(r.get("EFALEVEL", "")).strip()
                if uid and level == "1":
                    val = _safe_int(r.get("EFTOTLT"))
                    if val and val > 0:
                        enrollment[uid] = {"value": val, "year": year, "source": f"IPEDS EF fall {year}"}
            print(f"  Loaded {len(enrollment)} enrollment records")
            break
        except Exception as e:
            print(f"  EF {year}: {e}")
    return enrollment


def load_f2_data():
    """Load F2 finance data for all institutions."""
    print("Loading F2 finance data...")
    current = {}
    prior = {}
    fy_year = None

    for url, fy in F2_URLS:
        try:
            rows, _ = _download_and_extract_csv(url, DATA_DIR, "f")
            fy_year = fy
            for r in rows:
                uid = _safe_int(r.get("UNITID"))
                if uid:
                    current[uid] = r
            print(f"  Loaded {len(current)} F2 current records (FY{fy})")
            break
        except Exception as e:
            print(f"  F2 {fy}: {e}")

    for url, fy in F2_PRIOR_URLS:
        try:
            rows, _ = _download_and_extract_csv(url, DATA_DIR, "f")
            for r in rows:
                uid = _safe_int(r.get("UNITID"))
                if uid:
                    prior[uid] = r
            print(f"  Loaded {len(prior)} F2 prior records (FY{fy})")
            break
        except Exception as e:
            print(f"  F2 prior {fy}: {e}")

    return current, prior, fy_year


def compute_position(unitid, f2_current, f2_prior, fy_year):
    """Compute revenue mix from F2 data."""
    row = f2_current.get(unitid)
    if not row:
        return None

    d01 = _safe_float(row.get("F2D01"))
    d05 = _safe_float(row.get("F2D05"))
    d06 = _safe_float(row.get("F2D06"))
    d07 = _safe_float(row.get("F2D07"))
    d08 = _safe_float(row.get("F2D08"))
    d11 = _safe_float(row.get("F2D11"))
    d12 = _safe_float(row.get("F2D12"))
    d15 = _safe_float(row.get("F2D15"))
    d16 = _safe_float(row.get("F2D16"))

    if not d16 or d16 <= 0:
        return None

    tuition_dep = d01 / d16 if d01 is not None else None
    earned_parts = [d05, d06, d07, d11, d12, d15]
    earned_public = sum(p for p in earned_parts if p is not None) / d16 if all(p is not None for p in earned_parts) else None
    philanthropy = d08 / d16 if d08 is not None else None

    # 5-year delta
    delta = None
    if earned_public is not None:
        prior_row = f2_prior.get(unitid)
        if prior_row:
            pd05 = _safe_float(prior_row.get("F2D05"))
            pd06 = _safe_float(prior_row.get("F2D06"))
            pd07 = _safe_float(prior_row.get("F2D07"))
            pd11 = _safe_float(prior_row.get("F2D11"))
            pd12 = _safe_float(prior_row.get("F2D12"))
            pd15 = _safe_float(prior_row.get("F2D15"))
            pd16 = _safe_float(prior_row.get("F2D16"))
            if pd16 and pd16 > 0:
                pparts = [pd05, pd06, pd07, pd11, pd12, pd15]
                if all(p is not None for p in pparts):
                    prior_earned = sum(pparts) / pd16
                    delta = earned_public - prior_earned

    return {
        "tuition_dependence": {"value": round(tuition_dep, 4) if tuition_dep is not None else None, "year": fy_year, "source": "IPEDS F2 D01/D16"},
        "earned_and_public_revenue": {"value": round(earned_public, 4) if earned_public is not None else None, "year": fy_year, "source": "IPEDS F2"},
        "philanthropy_share": {"value": round(philanthropy, 4) if philanthropy is not None else None, "year": fy_year, "source": "IPEDS F2"},
        "diversification_delta_5yr": {"value": round(delta, 4) if delta is not None else None, "window": f"{fy_year-5}-{fy_year}" if delta else None, "source": "IPEDS F2"},
        "peer_set": {"definition": "Pending Jeff's decision per addendum §6", "n": None}
    }


def load_oews_all():
    """Load all OEWS data from the cached ZIP, indexed by AREA (CBSA)."""
    print("Loading OEWS data (all MSAs)...")
    import openpyxl, tempfile, shutil

    zip_path = os.path.join(DATA_DIR, "oesm25ma.zip")
    if not os.path.exists(zip_path):
        print("  ERROR: OEWS ZIP not found. Run build_wv.py first.")
        return {}, {}

    with zipfile.ZipFile(zip_path) as zf:
        xlsx_files = [n for n in zf.namelist() if n.lower().endswith(".xlsx") and "msa" in n.lower()]
        if not xlsx_files:
            print("  ERROR: no MSA xlsx in OEWS ZIP")
            return {}, {}

        with zf.open(xlsx_files[0]) as ef:
            with tempfile.NamedTemporaryFile(suffix=".xlsx", delete=False) as tmp:
                shutil.copyfileobj(ef, tmp)
                tmp_path = tmp.name

        wb = openpyxl.load_workbook(tmp_path, read_only=True, data_only=True)
        ws = wb.active
        rows_iter = ws.iter_rows(values_only=True)
        header = [str(c).strip() if c else "" for c in next(rows_iter)]

        # Index by AREA
        by_area = defaultdict(list)
        all_occ_medians = {}

        for vals in rows_iter:
            row = dict(zip(header, [str(v).strip() if v is not None else "" for v in vals]))
            area = row.get("AREA", "")
            by_area[area].append(row)

            occ_code = row.get("OCC_CODE", "")
            if occ_code == "00-0000":
                h_med = row.get("H_MEDIAN", "")
                a_med = row.get("A_MEDIAN", "")
                hv = None
                try:
                    hv = float(h_med) if h_med and h_med not in ("*", "**", "#") else None
                except ValueError:
                    pass
                if hv is None:
                    try:
                        av = float(a_med) if a_med and a_med not in ("*", "**", "#") else None
                        if av and av > 100:
                            hv = round(av / 2080, 2)
                    except ValueError:
                        pass
                if hv:
                    all_occ_medians[area] = hv

        wb.close()
        os.unlink(tmp_path)

    print(f"  Loaded {len(by_area)} areas, {sum(len(v) for v in by_area.values())} total rows")
    return by_area, all_occ_medians


def compute_labor_gaps(cbsa, oews_by_area, oews_medians):
    """Compute labor gaps for a CBSA from pre-loaded OEWS data."""
    if not cbsa or cbsa not in oews_by_area:
        return []

    all_occ_median = oews_medians.get(cbsa)
    if not all_occ_median:
        return []

    gaps = []
    for row in oews_by_area[cbsa]:
        occ_code = row.get("OCC_CODE", "")
        if occ_code == "00-0000" or occ_code.endswith("0000"):
            continue

        lq_raw = row.get("LOC_QUOTIENT", "")
        try:
            lq = float(lq_raw) if lq_raw and lq_raw not in ("*", "**", "#", "~") else None
        except ValueError:
            lq = None
        if lq is None or lq >= 1.0:
            continue

        h_med_raw = row.get("H_MEDIAN", "")
        a_med_raw = row.get("A_MEDIAN", "")
        try:
            h_med = float(h_med_raw) if h_med_raw and h_med_raw not in ("*", "**", "#") else None
        except ValueError:
            h_med = None
        if h_med is None:
            try:
                a_med = float(a_med_raw) if a_med_raw and a_med_raw not in ("*", "**", "#") else None
                if a_med and a_med > 100:
                    h_med = round(a_med / 2080, 2)
            except ValueError:
                pass

        if h_med is None or h_med <= all_occ_median:
            continue

        title = row.get("OCC_TITLE", "")
        employment = row.get("TOT_EMP", "")

        gaps.append({
            "domain": "labor",
            "headline": f"{title} — undersupplied in this region",
            "metric": f"Location quotient {lq:.2f}",
            "detail": f"{employment} employed; median ${h_med:.2f}/hr, above area median ${all_occ_median:.2f}",
            "geography": f"MSA {cbsa} (metro-level, not county-level)",
            "vintage": "OEWS May 2025",
            "source_url": "https://www.bls.gov/oes/",
            "confidence": "high"
        })

    gaps.sort(key=lambda x: float(x["metric"].split()[-1]))
    return gaps[:10]


def build_all():
    """Build records for all target institutions."""
    # Load bulk data
    institutions = load_all_institutions()
    enrollment_map = load_enrollment_map()
    f2_current, f2_prior, fy_year = load_f2_data()
    oews_by_area, oews_medians = load_oews_all()

    # Filter to enrollment <= MAX_FTE
    target = []
    for inst in institutions:
        uid = inst["unitid"]
        enr = enrollment_map.get(uid, {})
        val = enr.get("value")
        if val is not None and val > MAX_FTE:
            continue
        inst["enrollment"] = enr if enr else {"value": None, "year": None, "source": "IPEDS"}
        target.append(inst)

    print(f"\nTarget population: {len(target)} institutions (private nonprofit 4yr, ≤{MAX_FTE} FTE)")

    # Group by state for progress tracking
    by_state = defaultdict(list)
    for inst in target:
        by_state[inst["state"]].append(inst)

    print(f"Across {len(by_state)} states\n")

    # CDBG data: batch by state (one API call per state)
    print("Pre-fetching CDBG data by state...")
    cdbg_cache = {}
    for st in sorted(by_state.keys()):
        try:
            cdbg_cache[st] = fetch_cdbg_route(st, "")
        except Exception:
            cdbg_cache[st] = {"program": "CDBG", "route": "unknown", "confidence": "unverified"}
        time.sleep(0.2)
    print(f"  CDBG data for {len(cdbg_cache)} states\n")

    # Build records
    records = []
    total = len(target)

    for i, inst in enumerate(target):
        uid = inst["unitid"]
        state = inst["state"]
        cbsa = inst["cbsa"]
        county = inst["county_fips"]

        if (i + 1) % 100 == 0 or i == 0:
            print(f"  Processing {i+1}/{total}: {inst['name']} ({state})...")

        # Position
        position = compute_position(uid, f2_current, f2_prior, fy_year)

        # Labor gaps (from pre-loaded OEWS)
        labor_gaps = compute_labor_gaps(cbsa, oews_by_area, oews_medians)

        # HPSA — skip API calls for bulk; use empty for now
        # (HRSA API is too slow/flaky for 1700 counties; will batch from bulk CSV later)
        hpsa_gaps = []

        # Funding
        census_data = {
            "place_population": None,
            "place_population_source": None,
            "county_mhi": None,
            "county_mhi_source": None,
        }
        usda = compute_usda_eligibility(census_data, state)

        cdbg = cdbg_cache.get(state, {"program": "CDBG", "route": "unknown", "confidence": "unverified"})

        # Section 202
        sec202 = {
            "program": "Section 202 Supportive Housing for the Elderly",
            "sponsor_eligible": {
                "value": True,
                "confidence": "high",
                "reasoning": "Private nonprofit 501(c)(3). 24 CFR 891.205."
            },
            "url": "https://www.hud.gov/program_offices/housing/mfh/progdesc/eld202"
        }

        record = {
            "schema_version": "1.0",
            "data_version": "2026.08",
            "built_at": date.today().isoformat(),
            "institution": {
                "unitid": uid,
                "name": inst["name"],
                "city": inst["city"],
                "state": state,
                "zip": inst["zip"],
                "county_fips": county,
                "cbsa": cbsa,
                "control": "private_nonprofit",
                "sector": "4yr",
                "enrollment": inst["enrollment"],
            },
            "position": position or {
                "tuition_dependence": {"value": None, "year": None, "source": "IPEDS F2"},
                "earned_and_public_revenue": {"value": None, "year": None, "source": "IPEDS F2"},
                "philanthropy_share": {"value": None, "year": None, "source": "IPEDS F2"},
                "diversification_delta_5yr": {"value": None, "window": None, "source": "IPEDS F2"},
                "peer_set": {"definition": "Pending", "n": None}
            },
            "regional_gaps": labor_gaps + hpsa_gaps,
            "funding": [usda, cdbg, sec202],
            "governance": {
                "accreditor": ACCREDITOR_MAP.get(uid, "unknown"),
                "property_lease_triggers_substantive_change": False,
            },
            "flags": []
        }

        records.append(record)

    # Write output
    out_path = os.path.join(OUTPUT_DIR, "institutions.json")
    with open(out_path, "w") as f:
        json.dump(records, f, indent=2, default=str)

    size_mb = os.path.getsize(out_path) / (1024 * 1024)
    print(f"\n{'=' * 60}")
    print(f"Built {len(records)} records")
    print(f"Output: {out_path} ({size_mb:.1f} MB)")
    print(f"{'=' * 60}")

    # Stats
    with_f2 = sum(1 for r in records if r["position"] and r["position"]["tuition_dependence"]["value"] is not None)
    with_labor = sum(1 for r in records if r["regional_gaps"])
    print(f"  With F2 finance data: {with_f2}")
    print(f"  With labor gaps: {with_labor}")
    print(f"  States: {len(by_state)}")


if __name__ == "__main__":
    build_all()
