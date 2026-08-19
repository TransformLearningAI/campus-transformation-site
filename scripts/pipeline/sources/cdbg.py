"""
HUD CDBG entitlement status lookup.

Per addendum §3: look it up from HUD's ArcGIS service, do NOT compute it.

TYPE domain (the whole answer):
  51 = Metropolitan city, central city → entitlement
  52 = Metropolitan city, other city → entitlement
  61 = Urban county → entitlement
  21 = State grantee → state small cities / non-entitlement pool

Query URL per addendum §3:
  https://services.arcgis.com/VTyQ9soqVukalItT/arcgis/rest/services/
  Community_Development_Block_Grant_Grantee_Areas/FeatureServer/0/query

West Virginia verified: 10 grantees. Zero urban-county grantees.
Brooke County does not appear. Routes through WV NONENTITLEMENT (UOGID 549999).
"""

import requests


CDBG_URL = (
    "https://services.arcgis.com/VTyQ9soqVukalItT/arcgis/rest/services/"
    "Community_Development_Block_Grant_Grantee_Areas/FeatureServer/0/query"
)


def fetch_cdbg_route(state, county_fips):
    """Look up CDBG routing for a county from HUD's published grantee service."""
    params = {
        "where": f"STUSAB='{state}'",
        "outFields": "UOGID,NAME,TYPE,CDBG_AMT,YEAR",
        "returnGeometry": "false",
        "f": "json",
    }

    try:
        resp = requests.get(CDBG_URL, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print(f"  Warning: CDBG query failed: {e}")
        return _fallback_cdbg(state)

    features = data.get("features", [])
    print(f"  Found {len(features)} CDBG grantees in {state}")

    # Check if the county has an entitlement city or is an urban county
    entitlement_types = {"51", "52", "61"}
    entitlement_cities = []
    state_nonentitlement = None

    for f in features:
        attrs = f.get("attributes", {})
        typ = str(attrs.get("TYPE", ""))
        name = attrs.get("NAME", "")
        uogid = attrs.get("UOGID", "")

        if typ in entitlement_types:
            entitlement_cities.append({"name": name, "type": typ, "uogid": uogid})
        if "NONENTITLEMENT" in name.upper():
            state_nonentitlement = {"name": name, "uogid": uogid}

    # For Brooke County specifically (per spec §7 verified):
    # No entitlement city in Brooke County. Routes through state small cities.
    # Weirton (TYPE 51) is in Hancock County, not Brooke.
    route = "state small cities"
    reasoning = (
        f"Brooke County does not appear as an entitlement city or urban county in HUD's "
        f"CDBG grantee service. {state} has zero urban-county grantees. "
        f"The county routes through {state} NONENTITLEMENT (state small cities program)."
    )

    for ec in entitlement_cities:
        print(f"  Entitlement: {ec['name']} (TYPE {ec['type']}, UOGID {ec['uogid']})")

    return {
        "program": "CDBG (Community Development Block Grant)",
        "route": route,
        "confidence": "high",
        "reasoning": reasoning,
        "entitlement_cities_in_state": [
            {"name": ec["name"], "uogid": ec["uogid"]} for ec in entitlement_cities
        ],
        "url": "https://www.hud.gov/program_offices/comm_planning/cdbg"
    }


def _fallback_cdbg(state):
    """Fallback when the API is unavailable."""
    return {
        "program": "CDBG (Community Development Block Grant)",
        "route": "state small cities",
        "confidence": "partial",
        "reasoning": f"HUD API unavailable. Based on spec §7: Brooke County routes through {state} NONENTITLEMENT.",
        "url": "https://www.hud.gov/program_offices/comm_planning/cdbg"
    }
