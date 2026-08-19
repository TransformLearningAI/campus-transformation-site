"""
Verified partners for Bethany College / Brooke County.

All entries from spec §7, manually verified and displayable.
Per spec §2.4: named partners require public, verifiable sources.
Employer names from QCEW are NEVER named — counts only.
"""


def get_verified_partners():
    """Return the verified partner data from spec §7."""
    return {
        "named": [
            {
                "type": "health_system",
                "name": "Weirton Medical Center",
                "operator": "WVU Medicine",
                "city": "Weirton, WV",
                "note": "Became a full WVU Health System member Jan 1, 2025",
                "source_url": "https://wvumedicine.org/locations/weirton/"
            },
            {
                "type": "health_system",
                "name": "WVU Medicine Wheeling Hospital",
                "operator": "WVU Medicine",
                "city": "Wheeling, WV",
                "note": "Runs family medicine and podiatric residencies",
                "source_url": "https://wvumedicine.org/locations/wheeling/"
            },
            {
                "type": "health_system",
                "name": "Trinity Health System",
                "operator": "CommonSpirit Health",
                "city": "Steubenville, OH",
                "note": "UPMC and CommonSpirit signed a definitive agreement May 4, 2026; transaction expected to close fall 2026, pending regulatory review.",
                "source_url": None
            },
            {
                "type": "college",
                "name": "West Liberty University",
                "distance_miles": 3,
                "city": "West Liberty, WV"
            },
            {
                "type": "college",
                "name": "Wheeling University",
                "distance_miles": 11,
                "city": "Wheeling, WV"
            },
            {
                "type": "college",
                "name": "Franciscan University of Steubenville",
                "distance_miles": 12,
                "city": "Steubenville, OH"
            },
            {
                "type": "college",
                "name": "WV Northern Community College",
                "distance_miles": 13,
                "city": "Wheeling, WV"
            },
            {
                "type": "college",
                "name": "Washington & Jefferson College",
                "distance_miles": 17,
                "city": "Washington, PA"
            },
            {
                "type": "planning_commission",
                "name": "Brooke-Hancock-Jefferson Metropolitan Planning Commission",
                "note": "WV Region 11 PDC, ARC Local Development District",
                "ceds_url": "https://www.bhjmpc.org/wp-content/uploads/2025/06/CEDS-2024-2029-FINAL-2024-03-20.pdf"
            },
            {
                "type": "workforce_board",
                "name": "Northern Panhandle Workforce Development Board",
                "location": "American Job Center, 100 Municipal Plaza, Weirton WV"
            },
        ],
        "counted": [
            {
                "type": "manufacturing_establishments",
                "count": None,  # Populated by QCEW module
                "geography": "Brooke County",
                "source": "QCEW",
                "note": "Counts only. QCEW does not publish employer names."
            }
        ]
    }
