"""
BLS OEWS labor data.

Per spec §2.3 and addendum §4:
  Current: May 2025, released May 15 2026
  File: oesm25ma.zip
  Crosswalk: area_definitions_m2025.xlsx
  LQ column: LOC_QUOTIENT (all caps with underscore)

OEWS publishes metro/nonmetro level ONLY, not county.
Label all output as MSA-level.

Triple filter for gap identification (spec §7):
  LOC_QUOTIENT < 1.0
  AND A_MEDIAN > area all-occupation median
  AND positive state projected growth

The vintage break: May 2024+ uses OMB Bulletin 23-01 metro definitions.
May 2023 and May 2025 are NOT comparable.
"""

import csv
import io
import os
import zipfile
import requests


OEWS_ZIP_URL = "https://www.bls.gov/oes/special-requests/oesm25ma.zip"
OEWS_CROSSWALK_URL = "https://www.bls.gov/oes/area_definitions_m2025.xlsx"


def fetch_labor_gaps(cbsa_code, state, data_dir):
    """Fetch and filter OEWS data for labor gaps in an MSA."""
    # Download the OEWS ZIP
    # BLS requires a User-Agent header; bare requests get 403'd
    headers = {"User-Agent": "CampusTransformation/1.0 (jeff@transformlearning.ai)"}

    # Try May 2025 first, fall back to May 2024
    oews_urls = [
        ("oesm25ma.zip", "https://www.bls.gov/oes/special-requests/oesm25ma.zip", "May 2025"),
        ("oesm24ma.zip", "https://www.bls.gov/oes/special-requests/oesm24ma.zip", "May 2024"),
    ]

    zip_path = None
    vintage_label = None
    for fname, url, vintage in oews_urls:
        zp = os.path.join(data_dir, fname)
        if os.path.exists(zp):
            zip_path = zp
            vintage_label = vintage
            print(f"  Using cached {fname}")
            break
        try:
            print(f"  Downloading {fname} from BLS...")
            resp = requests.get(url, headers=headers, timeout=180)
            resp.raise_for_status()
            with open(zp, "wb") as f:
                f.write(resp.content)
            print(f"  Downloaded ({len(resp.content) // (1024*1024)}MB)")
            zip_path = zp
            vintage_label = vintage
            break
        except Exception as e:
            print(f"  {fname}: {e}, trying next...")

    if zip_path is None:
        print("  Warning: could not download any OEWS file")
        return []

    # Extract and parse — May 2025 ships as xlsx, earlier vintages as CSV
    import openpyxl

    with zipfile.ZipFile(zip_path) as zf:
        all_names = zf.namelist()
        # Find the MSA data file (xlsx or csv)
        xlsx_files = [n for n in all_names if n.lower().endswith(".xlsx") and "msa" in n.lower()]
        csv_files = [n for n in all_names if n.lower().endswith(".csv") and ("oesm" in n.lower() or "all_data" in n.lower())]

        if xlsx_files:
            data_file = xlsx_files[0]
            print(f"  Parsing {data_file} (Excel)...")
            with zf.open(data_file) as ef:
                import tempfile, shutil
                with tempfile.NamedTemporaryFile(suffix=".xlsx", delete=False) as tmp:
                    shutil.copyfileobj(ef, tmp)
                    tmp_path = tmp.name
                wb = openpyxl.load_workbook(tmp_path, read_only=True, data_only=True)
                ws = wb.active
                rows_iter = ws.iter_rows(values_only=True)
                header = [str(c).strip() if c else "" for c in next(rows_iter)]
                print(f"  Columns: {header[:15]}...")
                all_rows = []
                for vals in rows_iter:
                    all_rows.append(dict(zip(header, [str(v).strip() if v is not None else "" for v in vals])))
                wb.close()
                os.unlink(tmp_path)
        elif csv_files:
            data_file = csv_files[0]
            print(f"  Parsing {data_file} (CSV)...")
            with zf.open(data_file) as cf:
                content = cf.read().decode("utf-8-sig", errors="replace")
                reader = csv.DictReader(io.StringIO(content))
                all_rows = list(reader)
                header = reader.fieldnames
        else:
            print(f"  Warning: no data file found in ZIP. Contents: {all_names}")
            return []

    # Filter to our MSA. OEWS AREA field matches CBSA code.
    msa_rows = []
    all_occ_median = None

    for row in all_rows:
        area = row.get("AREA", row.get("area", "")).strip()
        if area != cbsa_code:
            continue

        occ_code = row.get("OCC_CODE", row.get("occ_code", "")).strip()
        # Use H_MEDIAN (hourly) if available, else convert A_MEDIAN (annual) / 2080
        h_median_raw = row.get("H_MEDIAN", row.get("h_median", ""))
        a_median_raw = row.get("A_MEDIAN", row.get("a_median", ""))
        median_raw = h_median_raw if _safe_float(h_median_raw) else a_median_raw

        if occ_code == "00-0000":
            all_occ_median = _safe_float(h_median_raw)
            if all_occ_median is None:
                # Fall back to annual / 2080
                ann = _safe_float(a_median_raw)
                if ann and ann > 100:  # clearly annual
                    all_occ_median = round(ann / 2080, 2)
            print(f"  All-occupation median wage: ${all_occ_median}/hr" if all_occ_median else "  All-occ median: N/A")

        msa_rows.append(row)

    if not msa_rows:
        print(f"  Warning: no OEWS data found for MSA {cbsa_code}")
        return []

    print(f"  Found {len(msa_rows)} occupation rows for MSA {cbsa_code}")

    if all_occ_median is None:
        print("  Warning: all-occupation median not found, cannot apply wage filter")
        return []

    # Apply the triple filter:
    # 1. LQ < 1.0
    # 2. Median wage > all-occupation median (above-median wage = genuine need, not low-wage surplus)
    # 3. Positive growth — need state projections (handled separately)
    gaps = []
    for row in msa_rows:
        occ_code = row.get("OCC_CODE", "").strip()
        lq = _safe_float(row.get("LOC_QUOTIENT", ""))
        median = _safe_float(row.get("A_MEDIAN", ""))
        title = row.get("OCC_TITLE", "").strip()
        employment = row.get("TOT_EMP", "").strip()

        # Skip totals and broad groups
        if occ_code in ("00-0000",) or occ_code.endswith("0000"):
            continue

        if lq is None or median is None:
            continue

        # Filter 1: undersupplied (LQ < 1.0)
        if lq >= 1.0:
            continue

        # Get hourly wage for comparison
        h_med = _safe_float(row.get("H_MEDIAN", row.get("h_median", "")))
        a_med = _safe_float(row.get("A_MEDIAN", row.get("a_median", "")))
        if h_med is None and a_med and a_med > 100:
            h_med = round(a_med / 2080, 2)

        if h_med is None:
            continue

        # Filter 2: above-median wage (genuine demand signal)
        if h_med <= all_occ_median:
            continue

        gaps.append({
            "occ_code": occ_code,
            "title": title,
            "lq": lq,
            "median_wage": h_med,
            "employment": employment,
        })

    # Sort by LQ ascending (most undersupplied first)
    gaps.sort(key=lambda x: x["lq"])

    # Take top gaps for the record (limit to most relevant)
    top_gaps = gaps[:10]

    print(f"  Found {len(gaps)} occupations with LQ < 1.0 and wage > area median")
    for g in top_gaps[:5]:
        print(f"    {g['title']}: LQ {g['lq']}, ${g['median_wage']}/hr, {g['employment']} employed")

    # Convert to spec §4 regional_gaps format
    results = []
    for g in top_gaps:
        results.append({
            "domain": "labor",
            "headline": f"{g['title']} — undersupplied in this region",
            "metric": f"Location quotient {g['lq']:.2f}",
            "detail": (
                f"{g['employment']} employed in the area; "
                f"median ${g['median_wage']:.2f}/hr, "
                f"above the area all-occupation median of ${all_occ_median:.2f}"
            ),
            "geography": f"MSA {cbsa_code} (labor data is metro-level, not county-level)",
            "vintage": f"OEWS {vintage_label}",
            "source_url": f"https://www.bls.gov/oes/",
            "confidence": "high"
        })

    return results


def _safe_float(val):
    if val is None:
        return None
    try:
        v = str(val).strip().replace(",", "")
        if v in ("", "*", "**", "#", "~", "-"):
            return None
        return float(v)
    except (ValueError, TypeError):
        return None
