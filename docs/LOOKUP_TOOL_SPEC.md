# Build Spec: "Look Up Your School"

**campustransformation.org · v1 · August 2026**

Read this before writing code. It defines what the tool must do, what data backs it, and what it is forbidden to display. The data pipeline is specified separately from the app because they fail in different ways.

---

## 0. The one rule that governs everything else

**The output is a needs assessment of the region, not a distress assessment of the college.**

The previous version of this tool compared a school to its peers, which under the old strategy meant showing a president how bad it was. That is the wrong front door now. The whole gradualist thesis is that a college in emotional crisis cannot hear a transformation pitch, and a page that opens by scoring the institution's decline puts the reader into exactly that state before they reach anything useful.

Same data, opposite register. Not "here is how you rank against schools that closed." Instead: **here is what your county is short of, here is what you already own that could supply it, here is who would pay for it, and here is who at your institution can sign it.**

If a design decision is ambiguous, resolve it toward that sentence.

---

## 1. Architecture

**Precompute everything. The app performs no data work at request time.**

```
  [ ETL pipeline, run offline ]         [ static artifact ]        [ the app ]
  IPEDS + county datasets       →       institutions.json     →    lookup + result page
  (Python, run 1-2x/year)               (or SQLite)                (reads local file only)
```

Non-negotiable properties:

1. **No live API calls from the web app.** Not to Census, not to BLS, not to HRSA. A federal endpoint being slow, rate-limited, or reorganized must never affect a page a trustee is looking at.
2. **The artifact is versioned and dated.** Every build stamps `data_version` and `built_at`. The result page shows the vintage.
3. **The app never computes eligibility.** All formulas run in the pipeline. The app renders precomputed booleans and strings.
4. **Regenerating data must not require touching app code.** Schema changes are versioned; the app validates `schema_version` on load and fails loudly rather than rendering wrong.

Size estimate: roughly 1,700 private nonprofit 4-year institutions under 3,000 FTE, plus their ~1,100 distinct counties. Well under 20MB as JSON, smaller as SQLite. Ship it in the repo.

---

## 2. Data sources and the exact pulls

Everything joins on two keys: **UNITID** (institution) and **county FIPS** (place). That is the entire data model.

### 2.1 Institution spine

| Source | Pull | Notes |
|---|---|---|
| **IPEDS Institutional Characteristics** (`HD####`) | UNITID, institution name, aliases, city, state, ZIP, **county FIPS (`COUNTYCD`)**, CBSA, locale code, control, sector, closure/merger flags | This is the college database. Free, complete, authoritative. https://nces.ed.gov/ipeds/datacenter/ |
| **IPEDS Finance, F2 file** (private nonprofit, FASB) | See §2.2 | Publics file `F1A`, for-profits file `F3`. **Pull all three or you silently drop institutions.** |
| **IPEDS Fall Enrollment** (`EF`) | Total and FTE, 10-year trend | |
| **Urban Institute Education Data Portal** | Optional wrapper that normalizes IPEDS variable names across years | https://educationdata.urban.org/documentation/ . Saves real ETL pain. Verify its finance endpoint schema before depending on it. |

### 2.2 Revenue mix (IPEDS F2, Part D)

| Variable | Part D line | Meaning |
|---|---|---|
| `F2D01` | 01 | Tuition and fees, net |
| `F2D05` | 05 | Federal grants and contracts |
| `F2D06` | 06 | State grants and contracts |
| `F2D07` | 07 | Local government grants and contracts |
| `F2D08` | 08 | Private gifts, grants and contracts |
| `F2D11` | 11 | Sales and services of educational activities |
| `F2D12` | 12 | Sales and services of auxiliary enterprises, net |
| `F2D15` | 15 | **Other revenue.** Novel revenue with no IPEDS home lands here. Best single flag. |
| `F2D16` | 16 | Total revenues and investment return. **The denominator.** |

Computed fields:

```
tuition_dependence          = F2D01 / F2D16
earned_and_public_revenue   = (F2D05 + F2D06 + F2D07 + F2D11 + F2D12 + F2D15) / F2D16
philanthropy_share          = F2D08 / F2D16
diversification_delta_5yr   = earned_and_public_revenue(t) - earned_and_public_revenue(t-5)
```

**Do not call the second field "non-tuition share."** It is not the complement of tuition dependence, because it deliberately excludes philanthropy (F2D08), appropriations, investment return, hospital revenue and independent operations. The complement would be `(F2D16 - F2D01) / F2D16`, which measures something different and much less interesting. What we care about is revenue the institution **earned or won**, which is why gifts are tracked separately as `philanthropy_share`. Label it accurately wherever it renders, and enumerate the included lines in a tooltip.

This also resolves what would otherwise be dead pulls: F2D05 and F2D08 appear in the table above and are now both consumed.

**Honesty requirement.** A jump in `F2D15` can be a one-time asset sale, an insurance settlement, or pandemic-era federal money. The pipeline must never label a delta as a "success." It reports the number and its direction. Interpretation is a human's job.

**Verify variable names against the data dictionary for each year you pull.** They change. Do not reconstruct them from memory.

### 2.3 Regional need, keyed on county FIPS

| Domain | Source | Pull | Vintage caveat |
|---|---|---|---|
| **Labor** | BLS **OEWS** | By MSA and nonmetro area: SOC code, employment, **`LOC_QUOTIENT`**, median hourly wage, annual mean. Target: LQ < 1.0 **and** wage above the area all-occupation median **and** positive state projected growth | Current release is **May 2025**, published May 15 2026: `oesm25ma.zip`. OEWS publishes MSA-level, **not county-level**. Crosswalk: `area_definitions_m2025.xlsx`. See ADDENDUM §4 for file mechanics and a vintage-break warning. |
| **Labor growth** | Projections Central / state LMI | State 10-year occupational projections and annual openings | State-level, not MSA. **Label it as state-level on the page.** |
| **Industry mix** | BLS **QCEW** | County establishment counts, employment, average weekly wage by NAICS | Suppression in thin industries |
| **Housing** | **HUD CHAS** | Renter households >30% and >50% of income; owner equivalents; by AMI band | Current vintage is ACS 2018-2022. About 3 years behind. Fine for structural need. |
| **Health** | **HRSA** shortage areas | HPSA designations (primary care, dental, mental health), **HPSA score**, designation type (geographic / population / facility) | Refreshed daily. Bulk CSVs are 14-35MB; download them properly, do not scrape. |
| **Child care** | CAP child care deserts + **state licensing database** | Licensed slots per child under 6. CAP's desert definition: more than 3 children under 6 per licensed slot | CAP vintage varies; state licensing files are more current and more granular |
| **Commuting** | Census **LEHD LODES / OnTheMap** | Share of employed residents working outside the county, by industry | Synthetic noise below tract level |
| **Population and income** | Census **ACS 5-year** | County and place population; **median household income**; poverty rate | Needed for USDA eligibility. Get an API key. |
| **What is already funded** | **USAspending.gov** API v2 | `POST /api/v2/search/spending_by_award/` filtered by place of performance. Recipient, Assistance Listing number, obligation | Free, no key. **The API's StandardLocationObject takes a 3-digit county code plus a separate state, not a 5-digit FIPS.** Split `54009` into `{state: "WV", county: "009"}` or the call silently returns nothing. |

### 2.4 Partner and program layers

| Layer | Source | Naming allowed? |
|---|---|---|
| Hospitals and health systems | CMS Provider of Services file; HRSA facility data | **Yes.** Names and addresses are public. |
| Other colleges within radius | IPEDS `HD` + haversine on lat/long | **Yes** |
| Regional EDD / planning commission | EDA EDD directory; ARC Local Development District list | **Yes**, including CEDS URL |
| Local WIOA workforce board | State workforce agency directory | **Yes** |
| CDEs licensed in the state | CDFI Fund allocatee list | **Yes**, with contacts |
| Employers by sector | QCEW | **No. Counts only.** QCEW gives establishment counts by NAICS, never company names. |
| Senior living / housing developers | State HFA developer lists | Counts only in v1. Naming requires manual verification. |

---

## 3. Deterministic eligibility (the differentiator)

This is the part nobody else shows and it is fully computable. Each returns a boolean plus the reasoning string that produced it.

### 3.1 USDA Community Facilities

```
rural_eligible   = place_population <= 20000

grant_tier_75    = place_population <= 5000  AND service_area_MHI < max(poverty_line, 0.60 * SNMHI)
grant_tier_55    = place_population <= 12000 AND service_area_MHI < max(poverty_line, 0.70 * SNMHI)
grant_tier_35    = place_population <= 20000 AND service_area_MHI < max(poverty_line, 0.80 * SNMHI)
grant_tier_15    = place_population <= 20000 AND service_area_MHI < max(poverty_line, 0.90 * SNMHI)
```

**The `max(poverty_line, ...)` floor applies to all four tiers, not just the 75% tier.** 7 CFR 3570.63(b)(2), (3) and (4) each use the same "below the higher of the poverty line or N percent of the State nonmetropolitan median household income" construction. Dropping the floor from the lower tiers produces false negatives in any state where the poverty line exceeds the percentage figure, which would silently disqualify towns that legally qualify.

**Both halves are required.** Population alone qualifies for nothing. The income test is what actually disqualifies most candidate towns, and getting this wrong would put a false promise on the page.

**SNMHI is not publicly published anywhere. See ADDENDUM §1 before writing any code against it.** It is defined in **7 CFR 3570.53**, but 7 CFR 3570.51(h) says the figure "may be updated on a national basis by the National Office," and USDA distributes it internally to state offices. There is no national table, no CSV, no API, and no Federal Register notice carrying it. Do not derive it from ACS: a self-computed figure will not reproduce USDA's, and USDA's is the one that governs. It must be hard-coded per state from values obtained by phone, with a manual refresh process.

**The poverty line in the "higher of" test is fully specified and easy.** 7 CFR 3570.53 defines it as the level of income **for a family of four** under 42 U.S.C. 9902(2), which is the **HHS poverty guidelines**, not the Census poverty thresholds. The 2026 figure, effective January 13, 2026, is **$33,000** for the 48 contiguous states and DC, $41,250 for Alaska, $37,950 for Hawaii. Annual, published mid-to-late January.

Two further notes for reasoning strings:

- **The 15% tier population threshold.** 7 CFR 3570.63(b)(4) states 50,000. USDA's program page states 20,000. The operative constraint is the **20,000 area-eligibility cap**, which binds first, so 20,000 is correct as the test. But do not let a user-facing reasoning string attribute a 20,000 tier threshold to 7 CFR 3570.63, because the regulation does not say that.
- **`service_area_MHI` is the MHI of the project's defined service area**, not automatically the county. v1 uses county MHI and **must label it as an approximation on the page.**

Program page: https://www.rd.usda.gov/programs-services/community-facilities/community-facilities-direct-loan-grant-program
Regulation: https://www.ecfr.gov/current/title-7/subtitle-B/chapter-XXXV/part-3570/subpart-B/section-3570.63

### 3.2 CDBG route

```
cdbg_route = "entitlement"   if the place is a metro city >= 50,000
                             or the principal city of an MSA
           = "urban county"  if (county_population - population_of_entitled_cities_within_it) >= 200000
                             and the county qualifies
           = "state small cities" otherwise
```

**The entitled-cities exclusion is not optional.** HUD's threshold is "populations of at least 200,000 (excluding the population of entitled cities)." A pipeline reading raw ACS county population will mis-route any county that only clears 200,000 because of an entitlement city inside it.

**Better: do not implement this formula at all.** HUD publishes the answer directly, with a grantee-type code, in a queryable feature service. See ADDENDUM §3. Look the answer up rather than deriving it.

Verify against HUD's published entitlement roster rather than inferring from population alone. The practical output is one sentence: *your project applies through [City X, an entitlement community] / [the state small cities program].*

### 3.3 ARC and EDA distress

- ARC publishes county economic status (distressed / at-risk / transitional / competitive / attainment) annually as data tables. Straight lookup by FIPS.
- EDA distress rests on 24-month unemployment and per-capita income tests. Computable, but confirm the current thresholds against the active NOFO before shipping.

### 3.4 Section 202

```
section_202_sponsor_eligible = (control == "private_nonprofit")
```

Note the string literal: `private_nonprofit` with an underscore, matching the schema in §4. The earlier draft of this spec used a space and would have returned `false` for every institution in the artifact.

**The college is the Sponsor, not the Owner.** 24 CFR 891.205 defines the Owner as "a single-asset private nonprofit organization that may be established by the Sponsor." So the college's 501(c)(3) qualifies it to sponsor a project, but a separate single-asset nonprofit entity has to be formed to own it. HUD also recognizes 501(c)(4) organizations and nonprofit consumer cooperatives as eligible sponsors.

Worth surfacing anyway, because it is the rare federal program where a college's nonprofit status is itself the qualifying asset. The page copy must say "sponsor," not "apply."

https://www.ecfr.gov/current/title-24/subtitle-B/chapter-VIII/part-891/subpart-B/section-891.205

---

## 4. The record schema

This is the contract between the pipeline and the app. Version it.

```jsonc
{
  "schema_version": "1.0",
  "data_version": "2026.08",
  "built_at": "2026-08-18",

  "institution": {
    "unitid": 237181,
    "name": "Bethany College",
    "aliases": ["Bethany College WV"],
    "city": "Bethany", "state": "WV", "zip": "26032",
    "county_fips": "54009", "county_name": "Brooke County",
    "cbsa": "48260", "cbsa_name": "Weirton-Steubenville, WV-OH",
    "control": "private_nonprofit", "sector": "4yr",
    "accreditor": "HLC",
    "enrollment": { "value": 640, "year": 2024, "source": "IPEDS" }
  },

  "position": {
    "tuition_dependence":         { "value": null, "year": null, "source": "IPEDS F2 D01/D16" },
    "earned_and_public_revenue":  { "value": null, "year": null },
    "philanthropy_share":         { "value": null, "year": null },
    "diversification_delta_5yr":  { "value": null, "window": null },
    "peer_set": { "definition": "private nonprofit 4yr, FTE within +/-40%, same census division", "n": null }
  },

  "regional_gaps": [
    {
      "domain": "labor",
      "headline": "Behavioral health counselors are under-supplied here",
      "metric": "Location quotient 0.71",
      "detail": "70 employed in the Weirton-Steubenville area; median $21.96/hr; WV projects +25% through 2034",
      "geography": "MSA 48260 (labor), WV (growth)",
      "vintage": "OEWS May 2023; Projections Central 2024-2034",
      "source_url": "https://www.bls.gov/oes/2023/may/oes_48260.htm",
      "confidence": "high"
    }
  ],

  "assets_to_gaps": [
    { "gap_domain": "labor", "suggested_pathway": "employer_paid_training",
      "asset_required": "classroom or lab space", "stream_id": 4 }
  ],

  "funding": [
    { "program": "USDA Community Facilities",
      "area_eligible":       { "value": true, "confidence": "high",
                               "reasoning": "Bethany WV population 756 is within the 20,000 rural-area cap." },
      "grant_tier_eligible": { "value": null, "tier": null, "confidence": "unverified",
                               "reasoning": "Requires the WV published SNMHI, not yet obtained." },
      "applicant": "the college or the municipality", "cadence": "continuous",
      "url": "https://www.rd.usda.gov/programs-services/community-facilities/community-facilities-direct-loan-grant-program" }
  ],

  "partners": {
    "named": [
      { "type": "health_system", "name": "Weirton Medical Center",
        "operator": "WVU Medicine", "city": "Weirton, WV",
        "note": "Became a full WVU Health System member Jan 1, 2025",
        "source_url": "https://wvumedicine.org/locations/weirton/" }
    ],
    "counted": [
      { "type": "manufacturing_establishments", "count": null,
        "geography": "Brooke County", "source": "QCEW",
        "note": "Counts only. QCEW does not publish employer names." }
    ]
  },

  "governance": {
    "accreditor": "HLC",
    "property_lease_triggers_substantive_change": false,
    "note": "HLC does not treat a property lease as a substantive change. NECHE institutions do carry a filing."
  },

  "flags": ["suppressed_cells_in_qcew", "oews_vintage_2023"]
}
```

**Every displayed number carries `value`, `vintage`, `source_url`, and `confidence`.** A field without a source is a bug, not a missing nicety. `confidence` is one of `high` / `partial` / `unverified`, and `unverified` fields must not render.

---

## 5. Display rules and the refusal list

### Must display

- The vintage of every figure, inline, in small type. "Cost burden, HUD CHAS 2018-2022."
- The geography each figure actually describes. Labor data is metro-level, not county-level. Growth projections are state-level. **Say so** rather than implying county precision.
- A visible statement that the result is generated from public records.

### Must never display

1. **A distress score, closure-risk score, or survival probability.** Not in any form, including a color-coded gauge. This is the single most important prohibition in the document. It contradicts the strategy and it is not something the data can honestly support.
2. **A peer comparison framed as ranking against schools that closed.**
3. **Named employers sourced from QCEW or inferred from anything.** Counts only, unless a human verified the name.
4. **Any figure whose `confidence` is `unverified`.** Suppress the field, do not guess and do not show a zero.
5. **An unqualified eligibility boolean for a test that is only half-computed.** Compound eligibility must be split into separately-rendered components, each with its own confidence, exactly as the USDA entry in §4 does. A `true` on the population half must never render as "eligible" while the income half is unknown. This is the specific failure mode that would put a false federal-funding promise in front of a president.
6. **Projected dollar revenue for a proposed pathway.** The site already carries range projections and they are its weakest asset. Do not let a tool generate new ones per-school.
7. **A recommendation phrased as a conclusion.** The tool produces a hypothesis. See §6.

### Suppression behavior

When a county has suppressed or missing cells, render the section as "not available for this county" with a one-line reason. Never zero-fill. Never interpolate from the state.

---

## 6. The result page

Order matters. It is designed so a nervous reader gets something useful before anything uncomfortable.

**1. What your region is short of.** Three gaps, each with a number, a geography, and a vintage. This is the lead. It is about the county, not the college, which is why it can be read without defensiveness.

**2. What you already have that could supply it.** Map each gap to one of the eight pathways, tagged by signature level (`Start here` / `Partner-funded` / `Board decision`, matching the homepage).

**3. Who would pay.** The deterministic eligibility results, with the reasoning string shown. "Your county qualifies for a federal grant share of up to X% because A and B" is the most persuasive thing on the page.

**4. Who is already nearby.** Named partners where naming is defensible, counts where it is not.

**5. Where you stand.** Revenue mix and tuition dependence, stated flatly, no scoring, no color. Last, deliberately.

**6. The honest close, and the conversion mechanic.** Verbatim intent:

> This is what the public record says about your campus. The part that decides whether any of it works is not in the public record: what a lease like this actually earns, who carries the capital risk, and whether a local employer will sign. That takes about a dozen phone calls, and it is what the One-Pathway Scan is.

That paragraph is not marketing garnish. It is true, it is the argument for the paid work, and it inoculates the tool against being read as a finished answer.

---

## 7. Worked example: Bethany College, WV

Real values, verified where marked. Use this as the render target. **Fields marked NOT VERIFIED must not appear in the UI**; they are here to show the pipeline what to go get.

**Institution.** UNITID 237181. Bethany, WV 26032. Brooke County, FIPS 54009. Weirton-Steubenville WV-OH MSA (48260). Private nonprofit, 4-year. Accreditor: **HLC**, next review 2029. Enrollment **640 (fall 2024)**. Fall 2025 new-student enrollment up 31% year over year, largest new cohort in 15 years.

**Position.** Form 990 net results: FY2023 **−$5.92M**, FY2024 **+$2.51M**, FY2025 **−$0.11M**. Endowment ~$52.4M (FY2024). Sticker $41,898 (2026-27); IPEDS average net price $19,035. IPEDS F2 revenue-mix panel: NOT YET PULLED. Composite score: NOT VERIFIED (ED posts these only in spreadsheets behind a JS page; the pipeline must download the file, not scrape the page).

**Regional gaps (the lead).**

| Gap | Metric | Detail | Vintage / geography |
|---|---|---|---|
| Behavioral health counselors | **LQ 0.71** | 70 employed, median $21.96/hr, above the area all-occupation median of $20.58. WV projects **+25%** through 2034, 250 annual openings | **OEWS May 2023**, MSA 48260; growth is WV statewide. **Re-pull from May 2025 before schema freeze** and expect the numbers to move: MSA definitions changed with the May 2024 vintage (OMB Bulletin 23-01), so 2023 and 2025 are not comparable. |
| HVAC and refrigeration mechanics | **LQ 0.75** | 70 employed, median $22.02/hr. WV projects +17% | same |
| Primary care access | **HPSA score 16** | Mental health 12, dental 11. **All three are Low Income Population HPSAs, not geographic** — the designation covers the county's low-income population, not every resident, and the page copy must not overstate it. No MUA covers the county | **Reconfirmed against HRSA's own MapServer, Aug 2026.** Scores are integers in HRSA's schema; drop the decimals. Primary care scores run 0-25, dental 0-26, mental health 0-25 |
| Renter cost burden | **30.8% over 30%**, 12.7% over 50% | 9,675 households, 25.4% renter-occupied | **CHAS 2017-2021, obtained via a WV Housing Development Fund tabulation. Superseded and third-party on both counts.** The pipeline must pull CHAS **2018-2022** direct from HUD (released Dec 2025). Re-run before schema freeze. |

**The contrast that makes this example instructive.** The region is *over*-supplied in several health occupations: LPNs LQ **2.39**, nursing assistants **1.98**, healthcare practitioners overall **1.40**, industrial machinery mechanics **2.66**. A naive "add a nursing program" recommendation would be exactly wrong here, and a tool that only looked at raw employment counts would make it. **The LQ-below-1.0-plus-above-median-wage-plus-positive-growth filter is what prevents that.** Encode all three conditions; do not simplify to one.

**Regional shocks worth surfacing.** Cleveland-Cliffs idled the Weirton tinplate mill in 2024 (~900 workers), announced a 600-job transformer plant in July 2024, then **halted development in May 2025** (reported variously as cancelled and as indefinitely delayed; use the softer framing). Eastern Gateway Community College (Steubenville, 13 miles) **closed in October 2024**, and Youngstown State is moving toward taking over the building. Ohio Valley Medical Center in Wheeling closed in 2019. This is a region that has lost institutional capacity repeatedly, which is context a proposal has to speak to.

**Funding eligibility.** Bethany's population is **756** (2020 Census), Wellsburg 2,450, Follansbee 2,853, all under the USDA 5,000 threshold; Weirton at 19,163 is under 20,000 but over 12,000. The **income half of the 75% test cannot be computed** until WV's SNMHI is obtained by phone (§9). Brooke County MHI is **$54,316** (ACS 2020-2024). ARC FY2026 status: **Transitional**, zero distressed areas.

**CDBG.** Confirmed from HUD's own grantee feature service: **Weirton** (UOGID 541392) and **Wheeling** (UOGID 541446) are entitlement cities, TYPE 51. **Brooke County does not appear** in the WV grantee set, and West Virginia has **zero urban-county grantees**. Bethany, Wellsburg, Follansbee and the county route through `WV NONENTITLEMENT` (UOGID 549999), the state small-cities program.

**Opportunity Zones, corrected.** The campus at 31 E Campus Dr geocodes to **census tract 54009031600** (Census Tract 316). That tract is **not** among Brooke County's OZ-2.0-eligible tracts, which are 314.01, 314.02 and 317, all down-county toward Wellsburg and Follansbee. **So the Bethany campus itself is not OZ-eligible**, and an earlier draft of this spec implied otherwise by listing the three tracts under Bethany's heading. Brooke County also has no designated OZ 1.0 tract; the nearest are in Hancock County (Weirton) and Ohio County (Wheeling). Two caveats: the geocoder returned a fuzzy match on *West* Campus Drive rather than East, which is almost certainly the same tract on a campus this small but should be re-run against rooftop coordinates; and the three eligible-tract GEOIDs still need confirmation against the IRS Rev. Proc. 2026-14 appendix rather than a private publisher. **NMTC low-income-community status of tract 54009031600 is unresolved** and is the more useful question anyway, since NMTC is live now and OZ 2.0 designations do not take effect until January 2027.

**Named partners (all verifiable, all displayable).**

- Weirton Medical Center, WVU Medicine, Weirton WV. Full WVU Health System member since Jan 1, 2025.
- WVU Medicine Wheeling Hospital, Wheeling WV. Runs family medicine and podiatric residencies.
- Trinity Health System, Steubenville OH, operated by CommonSpirit. **UPMC and CommonSpirit signed a definitive agreement on May 4, 2026; the transaction is expected to close in fall 2026, pending regulatory review.**
- West Liberty University (3 mi), Wheeling University (11 mi), Franciscan University of Steubenville (12 mi), WV Northern Community College (13 mi), Washington & Jefferson (17 mi).
- **Brooke-Hancock-Jefferson Metropolitan Planning Commission** (WV Region 11 PDC, ARC Local Development District). CEDS 2024-2029: https://www.bhjmpc.org/wp-content/uploads/2025/06/CEDS-2024-2029-FINAL-2024-03-20.pdf
- **Northern Panhandle Workforce Development Board**, American Job Center at 100 Municipal Plaza, Weirton.

**Counted, not named.** Manufacturing and energy establishments in Brooke and Hancock counties, from QCEW. The only sourced largest-employer list found dates to 2014 and must not be used.

---

## 8. Build order

1. **Pipeline first, one state.** Get WV end to end and validate the Bethany record by hand against §7. Do not build UI against mock data.
2. **Schema freeze.** Once the Bethany record renders correctly, freeze `schema_version` 1.0.
3. **Scale the pipeline** to all states. Expect suppression and missing-county problems; flag rather than fill.
4. **App.** Typeahead over institution name and alias, result page per §6, no data logic.
5. **Lead capture** on the One-Pathway Scan request, not on viewing the result. The result must be free and unblocked. Gating it kills the entire purpose.

### What Claude Code should not do

- **Do not reconstruct federal variable names, program thresholds, or eligibility formulas from memory.** Every one of them is in this document or must be re-derived from the source's own data dictionary. This is the single highest-risk failure mode: a wrong IPEDS variable or a dropped income test produces a page that is confidently, invisibly false.
- **Do not add live API calls** to make a field "more current."
- **Do not add a score, gauge, grade, or risk indicator**, however tastefully designed.
- **Do not zero-fill or interpolate suppressed data.**
- **Do not name employers** the pipeline did not verify.

---

## 9. Open items

**Six of the eight original open items are now resolved. See the companion document `LOOKUP_TOOL_SPEC_ADDENDUM.md` for exact URLs, file names, field names, and query patterns.** Do not re-research them.

What genuinely still requires a human:

1. **State nonmetropolitan MHI.** Confirmed to have no public source of any kind. Blocks the USDA grant-tier module, which is the most persuasive element on the page. Resolution is a phone call per state, starting with West Virginia: USDA RD WV State Office, Morgantown, 304-284-4860, Community Programs Director Steve Collins, steve.collins@usda.gov. **v1 can ship without it** by rendering area eligibility only and labeling the tier as "call to confirm."

2. **Three binary files that have to be opened locally**, because no fetch tool can parse them. None is hard, all are blocking for their module:
   - `ay-22-23-composite-scores.xls` (ED composite scores; note it is legacy BIFF `.xls` and keys on **OPEID**, not UNITID)
   - `FY2026-Formula-Allocations-All-Grantees.xlsx` (HUD, only needed if you prefer it to the GIS service)
   - `rp-26-14-appendix.xlsx` (IRS, the statutory OZ 2.0 eligible-tract list)

3. **The peer-set definition needs a decision from Jeff, not a lookup.** ADDENDUM §6 recommends a specific two-stage design and explains why the original "same census division" screen is actively wrong for a school like Bethany. Read that section before implementing.

4. **Whether the tool ships with the labor module.** Recommendation: **yes.** The original doubt was that OEWS data was stuck at May 2023. It is not; May 2025 is out. See ADDENDUM §4.

## 10. Provenance

The source research behind this spec, including the verified case files and the funding and governance detail, lives in the 45-day plan document. The Bethany figures in §7 come from a dedicated verification pass in August 2026; the "NOT VERIFIED" labels are deliberate and should be treated as a work list, not as noise to be cleaned up.
