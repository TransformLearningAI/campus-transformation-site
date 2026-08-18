# Addendum: Resolved Open Items

**Companion to `LOOKUP_TOOL_SPEC.md` · August 2026**

Section 9 of the spec listed eight open items. Six are resolved here with exact URLs, file names, field names and query patterns. Two changed the spec itself because the answer was not what the spec assumed.

**Read §1 and §5 before writing any code.** Both overturn an instruction in the main document.

---

## 1. State nonmetropolitan MHI: there is no public source

**Status: confirmed negative. This is the finding that most changes the build.**

The spec told the pipeline to obtain USDA's published SNMHI table. **No such table exists.** Not on rd.usda.gov, not on data.gov, not in the Federal Register, not in RD Instruction 3570-B, not in any RD income-limit dataset. Form RD 3570-2, the official worksheet for computing maximum grant assistance, has a blank line for the figure and cites no source.

The reason is in the regulation. 7 CFR 3570.51(h) says the state nonmetropolitan MHI "may be updated on a national basis by the National Office." USDA sets it centrally and distributes it to state offices. It reaches the public only when an individual state office happens to embed it in an eligibility chart, and coverage is sporadic and stale. Two examples that do exist:

- Vermont, 2024: `VT Statewide Nonmetro MHI $71,180` — https://www.rd.usda.gov/media/file/download/2024-vt-cf-wep-eligibility.pdf
- California: `$80,546` — https://cfcc.ca.gov/wp-content/uploads/2023/10/USDA-WEP-Presentation.pdf

There is no West Virginia equivalent, and no 2025 or 2026 vintage of either.

**Consequences for the build.**

1. Delete any instruction to compute SNMHI from ACS. A self-computed figure will not reproduce USDA's, and USDA's governs.
2. SNMHI becomes a **hand-maintained lookup table**, one row per state, each row carrying the value, the source, the date obtained and the name of the person at USDA who provided it. Treat a missing state as `null` and suppress the tier, never as zero.
3. **v1 should ship without it.** Render `area_eligible` (population, fully computable) and render the tier as "call to confirm." That is honest and still useful.

**To obtain West Virginia's:** USDA RD West Virginia State Office, Morgantown, 304-284-4860. Community Programs Director Steve Collins, steve.collins@usda.gov. This is a five-minute phone call and it unblocks the most persuasive module on the page.

### The poverty line half is fully specified

7 CFR 3570.53 defines "poverty line" as the income level **for a family of four** under 42 U.S.C. 9902(2), which means the **HHS poverty guidelines**, not the Census poverty thresholds. The distinction matters and the spec was ambiguous about it.

2026 values, effective January 13, 2026 (91 FR 1797):

| Region | Family of 4 |
|---|---|
| 48 contiguous states and DC | **$33,000** |
| Alaska | $41,250 |
| Hawaii | $37,950 |

Annual, published mid-to-late January. https://www.federalregister.gov/documents/2026/01/15/2026-00755/annual-update-of-the-hhs-poverty-guidelines

---

## 2. ED financial responsibility composite scores

| | |
|---|---|
| **Most recent posted** | **AY 2022-23**. AY 2023-24 and AY 2024-25 both 404. Roughly three award years stale. |
| **Direct URL** | https://studentaid.gov/sites/default/files/ay-22-23-composite-scores.xls |
| **Naming convention** | `ay-YY-YY-composite-scores.xls`, stable back to AY 2016-17 |
| **Landing page** | https://studentaid.gov/data-center/school/composite-scores (Angular SPA; renders "Loading…" to non-JS fetchers, so a scraper needs a headless browser) |
| **Format** | Legacy **BIFF `.xls`**, not xlsx, not CSV, no API. Needs `xlrd` or a LibreOffice conversion step. |
| **Join key** | **OPEID, not UNITID.** Build a crosswalk from the IPEDS `HD` file's `OPEID` column. |
| **Scope** | Private nonprofit and proprietary only. **Publics are exempt and will not appear.** |

FSA's own data-center refresh announcements no longer mention composite scores, which corroborates that this report has fallen off the active cycle. Carry an explicit `as_of_award_year` field and a null path. Do not imply the score is current.

**Still open:** the field list and Bethany's actual score. Both require opening the workbook locally.

---

## 3. HUD CDBG entitlement status: look it up, do not compute it

**The spec's urban-county formula should be replaced with a lookup.** HUD publishes the answer with an explicit grantee-type code in a queryable ArcGIS service.

```
https://services.arcgis.com/VTyQ9soqVukalItT/arcgis/rest/services/Community_Development_Block_Grant_Grantee_Areas/FeatureServer/0/query
  ?where=STUSAB='WV'
  &outFields=UOGID,NAME,TYPE,CDBG_AMT,YEAR
  &returnGeometry=false&f=json
```

1,252 features. Fields: `UOGID`, `NAME`, `TYPE`, `STUSAB`, `STATE`, `CDBG_AMT`, `ESG_AMT`, `HOME_AMT`, `HOPWA_AMT`, `TOT_AMT`, `YEAR`.

**The `TYPE` domain is the whole answer:**

| TYPE | Meaning | Rule |
|---|---|---|
| 51 | Metropolitan city, central city | entitlement |
| 52 | Metropolitan city, other city | entitlement |
| 61 | **Urban county** | entitlement |
| 21 | State grantee | **state small cities / non-entitlement pool** |
| 77 / 90 | Hawaiian small cities / consortia | edge cases |

So: `TYPE IN ('51','52')` is an entitlement city, `TYPE = '61'` is an urban county, `TYPE = '21'` is the state pool (name pattern `<ST> NONENTITLEMENT`, UOGID pattern `SS9999`).

**Trap:** the service-level metadata says "Date of Coverage 2020" but the rows carry `YEAR = 2024`. Trust the row.

**Alternative, for the current program year:** FY2026 formula allocations, posted August 3, 2026.
https://www.hud.gov/sites/dfiles/CPD/documents/FY2026-Formula-Allocations-All-Grantees.xlsx
It is `.xlsx` and must be opened locally, and it is not guaranteed to carry an explicit type column, so the GIS service is the better primary and this is the better amount-of-record.

**West Virginia, verified in full.** Ten grantees: Charleston, Huntington, Wheeling, Parkersburg, Morgantown, **Weirton**, Martinsburg, Beckley, Vienna (all TYPE 51), plus `WV NONENTITLEMENT`. **West Virginia has zero urban-county grantees.** Brooke County does not appear.

---

## 4. OEWS: current data exists, ship the labor module

The spec's item 8 asked whether to ship v1 without labor data because OEWS looked stuck at May 2023. **It is not. Ship the module.**

| | |
|---|---|
| **Current reference period** | **May 2025**, released **May 15, 2026** |
| **Metro and nonmetro file** | **https://www.bls.gov/oes/special-requests/oesm25ma.zip** |
| **Pattern** | `oesm25{ma,nat,st,all}.zip`; year token is the 2-digit reference year |
| **County crosswalk** | **https://www.bls.gov/oes/area_definitions_m2025.xlsx** |
| **Location quotient column** | **`LOC_QUOTIENT`**, all caps with underscore |

**Confirmations that matter:**

- `LOC_QUOTIENT` is present in the **metro/nonmetro and state files only**. It is absent from the national file, since the nation's LQ against itself is 1 by definition. The area file is the one you want anyway.
- OEWS publishes **no county-level estimates**. About 530 metro and nonmetro areas, full stop. The county-to-area crosswalk is a navigation aid, not county data.
- Static per-area HTML (`/oes/2023/may/oes_48260.htm`) **was discontinued after May 2023**. The May 2024+ replacement is a hash-routed SPA at `data.bls.gov/oes/#/area/...`, which is **not scrapable by plain HTTP** because the fragment never reaches the server. The ZIPs are the only bulk path.

**The vintage break, which matters more than it looks.** May 2024 switched to OMB Bulletin 23-01 metro definitions (2020 Census based) and discontinued NECTAs. May 2024 and May 2025 share a vintage and are comparable to each other. **Neither is comparable back to May 2023.** Every OEWS figure in the spec's Bethany worked example is May 2023 and must be re-pulled before schema freeze.

**Two stale-signal traps:** `https://www.bls.gov/oes/update.htm` still announces May 2024 and has not been touched since April 2025. And `/oes/current/` pages returned May 2024 on some fetches and May 2025 on others, apparently cached. **Use explicit `/oes/2025/may/` paths in production.** Also note the release schedule slipped from early April to mid-May between the last two cycles; do not hard-code a cadence.

The BLS API can return OEWS (survey `OE`, datatype code **17** is location quotient), but a full metro-by-occupation pull via a 50-series-per-request API is far more expensive than one ZIP. Use the ZIP.

---

## 5. HRSA shortage areas: reconfirmed, and there is a clean API

**Use the MapServer, not the FeatureServer.** The FeatureServer endpoint returns "Server object extension 'featureserver' not found."

```
https://gisportal.hrsa.gov/server/rest/services/Shortage/HealthProfessionalShortageAreas_FS/MapServer/{layer}/query
  ?where=STATE_COUNTY_FIPS_CD='54009'
  &outFields=*&returnGeometry=false&f=pjson
```

Component-polygon layers are the county-joinable ones: **11 primary care, 3 dental, 7 mental health.** `maxRecordCount` 1000, paginate with `resultOffset`. Pin `f=pjson`; `f=json` sometimes returns the HTML query form. The host intermittently 403s through a proxy, so build in retries.

**Field names, verified:**

| Need | Field |
|---|---|
| Score | `HPSA_SCORE` (**Integer**) |
| Designation type | `HPSA_TYP_DESC`, e.g. "HPSA Population" |
| Population sub-type | `HPSA_POPULATION_TYP_DESC`, e.g. "Low Income Population HPSA" |
| County FIPS | `STATE_COUNTY_FIPS_CD` (5-char) |
| Status | `HPSA_STATUS_DESC`, e.g. "Designated" |

Do not confuse the designation-level `HPSA_*` fields with the component-level `COMP_*` fields.

**Bulk alternative:** `https://data.hrsa.gov/DataDownload/DD_Files/BCD_HPSA_FCT_DET_{PC,DH,MH}.csv` (35MB / 18MB / 14MB), dictionary at `HPSA_DATAMART_METADATA.XLSX`. Refresh cycle is daily; the official statistical snapshot is quarterly; the Federal Register list is annual by July 1.

**Score ranges, and the spec had one backwards:** primary care **0-25**, dental **0-26**, mental health **0-25**. There is no HRSA-wide "high priority" cutoff. NHSC publishes minimum qualifying scores per class year (21+ for primary care physicians and NPs, 18+ for PAs), but those are scholarship placement minimums, recalculated annually, and must not be hard-coded as a general threshold.

**Bethany's county, reconfirmed against HRSA directly rather than a mirror:** primary care **16**, mental health **12**, dental **11**, all Designated. The third-party numbers were right.

**One substantive correction for the page copy.** All three are **Low Income Population** HPSAs, not geographic HPSAs. The designation covers the low-income population of Brooke County, not every resident. Copy that says "your county is a designated shortage area" without that qualifier overstates it.

---

## 6. Peer set: the original definition has a real flaw

The spec proposed private nonprofit, 4-year, FTE within ±40%, same census division. The first two are right and should be hard constraints. The last two need to change.

### What the federal default actually does

NCES builds the IPEDS Data Feedback Report comparison group from **control × Carnegie classification × enrollment size**. Note what is absent: **geography**. Adopting control, Carnegie and size buys you defensibility for free, because you are using the federal methodology. Anything you add beyond it needs its own justification.

Note also that Carnegie changed structurally in 2025. The single Basic Classification is retired, replaced by an Institutional Classification on three axes: Award Level Focus, Academic Program Mix, and Size. Research is no longer a dimension. The relevant cell here is **Award Level Focus = Baccalaureate × Size = Small**. IPEDS `HD` carries both `C21BASIC` (legacy) and the 2025 fields depending on collection year. **Pin the vintage; they are not interchangeable.**

### Why "same census division" is wrong here

West Virginia sits in the **South Atlantic** division, which is DE, DC, FL, GA, MD, NC, SC, VA and WV.

Bethany is in the Northern Panhandle. It recruits from **Pittsburgh**, 40 miles away. A census-division screen would exclude every Pennsylvania and Ohio institution it actually competes with, and include Florida colleges that share no demographic, competitive or state-aid environment with it. The screen would systematically pick the wrong peers for exactly the kind of school this tool is built for.

**Replace it with a 200-300 mile radius, or an explicit adjacent-state list.** If a census-standard geography is needed for defensibility, report it as a stratum rather than using it as a filter.

### Why ±40% FTE is too wide

At 600 FTE that band spans 360 to 840. Fixed-cost structure and auxiliary economics change materially across that range. **Tighten to ±30%**, and relax to ±40% only when the result falls below about 12 peers, documenting the relaxation.

### The exclusions that actually protect the measurement

Each of these is a documented comparability threat in the Urban Institute's IPEDS Finance User Guide, not an analyst preference, which is what makes them defensible:

1. **No hospitals or medical schools** (`HOSPITAL = 2`, `MEDICAL = 2`). A single academic medical center peer can move "tuition as a share of revenue" from 70% to 15%.
2. **No meaningful independent operations** (≤1% of total revenue). Same denominator problem.
3. **Match on residential share.** A 90%-residential college and a commuter college have different business models, not different strategies. This is the biggest hidden confounder in auxiliary revenue and deserves the heaviest weight in similarity ranking.
4. **Cap endowment per FTE** at roughly 3× the focal institution. Otherwise you are comparing against schools whose revenue mix is endowment-driven by construction.
5. **Check `pell_grant_treatment`.** Some FASB institutions report Pell as federal revenue and as a tuition allowance; others treat it as a pass-through. This moves the tuition-versus-federal split directly, which is the exact thing being measured. Least-known pitfall, most damaging here.
6. **Check `parent_child_flag`.** Multi-campus systems report combined at the parent.
7. **Never mix FASB and GASB.** Private nonprofit only, as a hard constraint.

### Recommended shape

**Stage 1, hard screen:** private nonprofit 4-year; degree-granting, Title IV, active; no hospital or medical school; independent operations ≤1%; Carnegie Baccalaureate + Small; highest degree ≤ Master's; FTE within ±30%; endowment per FTE below 3× focal; consistent Pell treatment; standalone reporter.

**Stage 2, soft ranking** on standardized distance, take the top 15 to 25: residential share (heaviest weight), log FTE, log endowment per FTE, undergraduate share, religious affiliation match as a bonus rather than a filter, locale, and market geography by radius.

**Reporting rules:** median and interquartile range, never the mean, because revenue mix is skewed. Show `n` on every figure and suppress below n = 5. Three-year averages for anything touching investment return. Publish the full peer roster with UNITIDs.

**Never screen on the dependent variable.** No screening on tuition dependence, discount rate, or revenue per FTE when the thing being compared is revenue mix.

---

## 7. Geocoding, and a correction to the Bethany example

### The geocoder

No API key. No published rate limit. Batch endpoint accepts up to 10,000 addresses.

```
https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress
  ?address=31+E+Campus+Dr%2C+Bethany%2C+WV+26032
  &benchmark=Public_AR_Current&vintage=Current_Current&format=json
```

Batch: `POST .../geographies/addressbatch`, CSV with **no header**, columns `Unique ID, Street, City, State, ZIP`.

Do not confuse this with `api.census.gov`, the data API, which **does** require a key.

### The correction

**Bethany College geocodes to census tract `54009031600`.** The spec's §7 listed three OZ-2.0-eligible Brooke County tracts (314.01, 314.02, 317) under Bethany's heading, which implied the campus was in one. **It is not.** Those three are down-county toward Wellsburg and Follansbee. The campus tract is 316, and it is not on the eligible list.

Two caveats on that finding. The geocoder fuzzy-matched to *West* Campus Drive rather than East, which on a campus this small is almost certainly the same tract but should be re-run against rooftop coordinates before anything depends on it. And the three eligible GEOIDs still need confirming against the IRS Rev. Proc. 2026-14 appendix rather than a private publisher.

### Opportunity Zones are not actionable yet

OZ 2.0 designations **do not take effect until January 1, 2027.** Treasury published 25,332 eligible tracts on April 6, 2026; state nomination closes September 28, 2026; certification runs through late December. West Virginia may designate 52 of its 200+ eligible tracts and had not submitted as of August 2026.

Eligibility criteria tightened: MFI ≤ **70%** of areawide (down from 80%), or poverty ≥20% **and** MFI ≤125% of areawide. Contiguous-tract nominations are eliminated, and **OZ 1.0 zones do not carry over automatically.**

**Practical guidance: leave OZ out of v1**, or render it as "designations pending, January 2027." A tool that surfaces OZ status before designations exist is showing a user something they cannot act on.

### NMTC is live now and is the better question

Current determination vintage is **2016-2020 ACS** on 2020 tract boundaries, mandatory since September 1, 2024. A tract qualifies if poverty ≥20%, **or** MFI ≤80% of statewide (non-metro county) or of the greater of statewide and metro (metro area). Non-metro tracts get the friendlier test.

Source of record is the CDFI Fund's CIMS, at https://cimsprodprep.cdfifund.gov/CIMS4/apps/pn-nmtc/index.aspx, with a downloadable file at https://www.cdfifund.gov/documents/geographic-reports (currently `.xlsb`, needs `pyxlsb`). Per-tract fields include `NMTCQualified`, `PovertyRate`, `PctMedianFamilyIncome`, `MetroDesignation`.

**NMTC status of tract 54009031600 is still unresolved** and is worth resolving, because unlike OZ it is actionable today.

---

## 8. What is still genuinely open

1. **SNMHI per state.** A phone call. Start with West Virginia.
2. **Three binary files** that need opening locally: the ED composite scores `.xls`, the HUD FY2026 allocations `.xlsx`, and the IRS Rev. Proc. 2026-14 appendix `.xlsx`.
3. **NMTC qualification for tract 54009031600.**
4. **Re-pull the Bethany OEWS figures from May 2025**, and expect movement given the MSA definition change.
5. **A decision from Jeff on the peer set**, per §6. That one is judgment, not research.
