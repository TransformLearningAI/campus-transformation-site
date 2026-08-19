"""
BLS QCEW — industry establishment counts by county.

Per spec §2.4: QCEW gives establishment counts by NAICS, NEVER company names.
Employers by sector: counts only.

Per spec §5: Must never display named employers sourced from QCEW.

Suppression in thin industries is expected. Flag, never zero-fill.
"""

import csv
import io
import os
import requests


# QCEW annual averages — county level
# Format: https://data.bls.gov/cew/data/api/{year}/a/area/{area_fips}.csv
QCEW_API = "https://data.bls.gov/cew/data/api"


def fetch_qcew_counts(county_fips, data_dir):
    """Fetch establishment counts from QCEW for a county."""
    year = "2024"  # Most recent annual averages
    url = f"{QCEW_API}/{year}/a/area/{county_fips}.csv"

    csv_path = os.path.join(data_dir, f"qcew_{county_fips}_{year}.csv")

    if not os.path.exists(csv_path):
        print(f"  Downloading QCEW data for {county_fips}...")
        try:
            resp = requests.get(url, timeout=30)
            if resp.status_code == 200:
                with open(csv_path, "w") as f:
                    f.write(resp.text)
                print(f"  Downloaded QCEW ({len(resp.text) // 1024}KB)")
            else:
                # Try 2023
                year = "2023"
                url = f"{QCEW_API}/{year}/a/area/{county_fips}.csv"
                resp = requests.get(url, timeout=30)
                resp.raise_for_status()
                with open(csv_path, "w") as f:
                    f.write(resp.text)
                print(f"  Downloaded QCEW {year} ({len(resp.text) // 1024}KB)")
        except Exception as e:
            print(f"  Warning: QCEW download failed: {e}")
            return _empty_qcew(county_fips)
    else:
        print(f"  Using cached QCEW data")

    # Parse and extract establishment counts by major NAICS sector
    sectors = {}
    suppressed = False

    try:
        with open(csv_path, "r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                own_code = row.get("own_code", "").strip()
                industry_code = row.get("industry_code", "").strip()
                agglvl = row.get("agglvl_code", "").strip()

                # Private ownership (own_code=5), supersector level (agglvl=74 or 73)
                if own_code != "5":
                    continue
                # NAICS supersector level
                if agglvl not in ("73", "74"):
                    continue

                title = row.get("industry_title", "").strip()
                estabs = row.get("annual_avg_emplvl", row.get("qtrly_estabs", "")).strip()
                establishments = row.get("annual_avg_estabs", "").strip()

                if establishments in ("", "0"):
                    suppressed = True
                    continue

                try:
                    est_count = int(establishments)
                except (ValueError, TypeError):
                    suppressed = True
                    continue

                if est_count > 0:
                    sectors[title] = est_count
    except Exception as e:
        print(f"  Warning: QCEW parse error: {e}")
        return _empty_qcew(county_fips)

    counted = []
    for title, count in sorted(sectors.items(), key=lambda x: -x[1]):
        counted.append({
            "type": title,
            "count": count,
            "geography": f"Brooke County ({county_fips})",
            "source": "QCEW",
            "note": "Counts only. QCEW does not publish employer names."
        })
        print(f"  {title}: {count} establishments")

    result = {
        "counted": counted,
        "vintage": f"QCEW {year} annual averages",
        "suppressed": suppressed,
    }

    if suppressed:
        print("  Note: some cells suppressed in thin industries")

    return result


def _empty_qcew(county_fips):
    return {
        "counted": [],
        "vintage": "QCEW unavailable",
        "suppressed": True,
    }
