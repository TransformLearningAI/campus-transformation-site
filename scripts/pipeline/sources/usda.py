"""
USDA Community Facilities eligibility computation.

Per spec §3.1 and addendum §1:

Area eligibility:
  rural_eligible = place_population <= 20,000

Grant tiers (ALL require both population AND income):
  75% = pop <= 5,000  AND service_area_MHI < max(poverty_line, 0.60 * SNMHI)
  55% = pop <= 12,000 AND service_area_MHI < max(poverty_line, 0.70 * SNMHI)
  35% = pop <= 20,000 AND service_area_MHI < max(poverty_line, 0.80 * SNMHI)
  15% = pop <= 20,000 AND service_area_MHI < max(poverty_line, 0.90 * SNMHI)

The max(poverty_line, ...) floor applies to ALL four tiers (7 CFR 3570.63).

SNMHI: NO PUBLIC SOURCE EXISTS (addendum §1 confirmed negative).
Must be obtained by phone per state. v1 ships without it, rendering
tier as "call to confirm."

Poverty line: HHS poverty guidelines for family of 4 (not Census thresholds).
2026: $33,000 for 48 contiguous states + DC.

service_area_MHI: v1 uses county MHI as an approximation. MUST label it so.
"""


# HHS poverty guidelines 2026, family of 4
# Per addendum §1: 91 FR 1797, effective January 13, 2026
POVERTY_LINE_2026 = {
    "contiguous": 33_000,
    "AK": 41_250,
    "HI": 37_950,
}

# SNMHI lookup table — hand-maintained, one row per state.
# Each entry: (value, source, date_obtained, contact)
# Per addendum §1: must be obtained by phone. Missing = None.
SNMHI_TABLE = {
    # "WV": (value, "source", "date", "contact"),
    # Not yet obtained. Blocks grant tier computation.
}


def compute_usda_eligibility(census_data, state):
    """Compute USDA Community Facilities eligibility."""
    place_pop = census_data.get("place_population")
    county_mhi = census_data.get("county_mhi")
    pop_source = census_data.get("place_population_source", "Census")

    # Area eligibility is the population test only
    area_eligible = place_pop is not None and place_pop <= 20_000

    area_reasoning = (
        f"Bethany WV population {place_pop:,} ({pop_source}) "
        f"is {'within' if area_eligible else 'above'} the 20,000 rural-area cap."
    ) if place_pop is not None else "Place population unavailable."

    # Grant tier — requires SNMHI which we don't have
    snmhi_entry = SNMHI_TABLE.get(state)
    tier_value = None
    tier_name = None
    tier_confidence = "unverified"
    tier_reasoning = "Requires the WV published SNMHI, not yet obtained by phone. Call USDA RD WV State Office (304-284-4860) to obtain."

    if snmhi_entry is not None and county_mhi is not None:
        snmhi_val = snmhi_entry[0]
        poverty_line = POVERTY_LINE_2026.get(state, POVERTY_LINE_2026["contiguous"])

        # Test each tier from highest to lowest
        tiers = [
            ("75%", 5_000, 0.60),
            ("55%", 12_000, 0.70),
            ("35%", 20_000, 0.80),
            ("15%", 20_000, 0.90),
        ]

        for tier_label, pop_cap, pct in tiers:
            if place_pop <= pop_cap:
                threshold = max(poverty_line, pct * snmhi_val)
                if county_mhi < threshold:
                    tier_value = True
                    tier_name = tier_label
                    tier_confidence = "high"
                    tier_reasoning = (
                        f"Population {place_pop:,} <= {pop_cap:,} AND "
                        f"county MHI ${county_mhi:,} < "
                        f"max(${poverty_line:,}, {pct:.0%} × ${snmhi_val:,}) = ${threshold:,.0f}. "
                        f"Note: county MHI used as approximation for service area MHI."
                    )
                    break

    return {
        "program": "USDA Community Facilities",
        "area_eligible": {
            "value": area_eligible,
            "confidence": "high" if place_pop is not None else "unverified",
            "reasoning": area_reasoning,
        },
        "grant_tier_eligible": {
            "value": tier_value,
            "tier": tier_name,
            "confidence": tier_confidence,
            "reasoning": tier_reasoning,
        },
        "applicant": "the college or the municipality",
        "cadence": "continuous",
        "url": "https://www.rd.usda.gov/programs-services/community-facilities/community-facilities-direct-loan-grant-program"
    }
