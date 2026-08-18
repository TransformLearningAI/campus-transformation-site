# Review: the Website + Lookup Tool Package

**Campus Transformation · August 2026**
A critical pass over the homepage mockup, the build spec, and the addendum — flaws found, fixes applied, and a Part 3 spec for the features that turn a report reader into a client.

---

## Part 1 — Flaws found

### In the homepage HTML (fixed in this pass)

**1. The "Look up your school" button didn't go to a lookup.** The hero's secondary CTA was labeled "Look up your school" but linked to the case studies section. Under the old site the lookup tool was one of the two conversion mechanics; the new mockup silently dropped it. **Fixed:** added a proper "Look up your school" section with a search box (UI stub — wire to the app when built), pointed the CTA and a new nav item at it.

**2. Three color pairs failed WCAG contrast at small sizes.** Measured, not guessed: the amber "NO BOARD VOTE" labels ran 3.36:1, the case-card location lines 3.21:1, the "Partner-funded" tag 3.11:1 — all below the 4.5:1 required for small text. Trustees skew 60+; small low-contrast type is not a cosmetic issue for this audience. **Fixed:** introduced a darker amber (`#8a5d0c`, 5.5:1) for small-text uses and darkened the location gray. The bright amber stays for large text and buttons, where it passes.

**3. No meta description or social tags.** The page will be shared in emails and on LinkedIn — that's the whole evangelism workstream — and it had no OG tags, so shares would render bare. **Fixed:** added description and OG tags.

**4. Still open, deliberately:** no mobile nav (links just hide below 860px — needs a hamburger in production); the Scan form CTA is an unwired `#`; case cards should eventually link to the published Halfway File PDFs; no analytics.

### In the build spec (real gaps, now documented — fix before build)

**5. The worked example school has a name collision, and the spec never handles it.** There is a Bethany College in West Virginia *and* one in Lindsborg, Kansas, plus Bethany Lutheran in Minnesota. "Saint Mary's," "Wesleyan," and "Trinity" are worse. The typeahead spec is one line. Required behavior: match on name *and* aliases, always display city/state in suggestions, and when names collide, force a state disambiguation step rather than guessing. The spec's own render target would hit this bug on day one.

**6. `governance.accreditor` has no data source.** The schema carries an accreditor field ("HLC") and the NECHE-vs-everyone-else logic depends on it, but §2.1's pull list never says where it comes from — and it is not a classic IPEDS HD variable. Source it from **ED's DAPIP database** (ope.ed.gov/dapip), which is the accreditation system of record, and verify whether the current IPEDS HD/IC dictionary now carries an accreditor agency field before writing a join.

**7. `assets_to_gaps` assumes data that does not exist.** The schema maps regional gaps to "assets required" (a dorm, a commercial kitchen, acreage) — but no federal dataset says what buildings a campus has. The pipeline cannot know. This is not fixable with data; it's fixable with interaction, and it becomes the best feature in the tool — see Part 3, feature C.

**8. No empty-state or thin-county behavior.** The result page spec demands "three gaps," but a small nonmetro county can have one unsuppressed labor row, or none. Required: render whatever gaps clear the confidence bar (one is fine), and if a whole domain is suppressed say so in one line. A page that pads to three with weak data reads as generic — the exact failure the tool exists to avoid.

**9. No URL scheme.** Results must be linkable — `/school/bethany-college-wv-237181` — because the single most likely next action is a president forwarding the page to a board chair. A tool whose results can't be linked can't spread. This also carries Part 3's email feature for free.

**10. No privacy line.** The moment the tool accepts an email address (Part 3), the page needs one sentence of privacy posture and a link. For this audience — people terrified of being seen looking — "we will never publish or share who ran a report" is not boilerplate, it's positioning.

---

## Part 2 — Usability improvements for the result page

**Lead with the county's name, not the college's.** "What Brooke County is short of" reads as civic information; "Bethany College's situation" reads as a diagnosis. Same content, opposite defensiveness — this extends the spec's §0 rule down to heading level.

**Every number gets a plain-English gloss.** "Location quotient 0.71" means nothing to a trustee. Render: "This region has about 30% fewer behavioral-health counselors than a typical U.S. region its size — and they're paid above the local median." Keep the technical value and vintage in small type beneath. The data earns trust with analysts; the sentence earns it with the board.

**Progressive disclosure, not a wall.** Five modules collapsed to headline + one number each, expandable. A president skims in 40 seconds on a phone; an analyst opens everything. Both are real users.

**Name the reader's next sentence.** Each funding row should end with the sentence the reader can actually say out loud: "Your town qualifies for USDA rural facilities funding — the application would come from Wellsburg, not the college." The tool's job is to arm one person to walk down the hall.

**Print stylesheet from day one.** Board packets are still paper. A clean `@media print` layout (navy stripped, sources intact) is nearly free and doubles as the PDF engine for Part 3.

---

## Part 3 — The conversion layer: from report to relationship

The report answers "what's possible here?" These four features answer "who helps me do it?" — which is the business. Ordering principle, consistent with the spec: **gate nothing, offer everything.** The report stays free and unblocked; every capture point is something the user *wants*, not a toll.

### A. "Send this report to yourself" — download + email

- **Download PDF** — one click, no email required. Server-rendered from the print stylesheet (Playwright `page.pdf()` — same pipeline used for the one-pager). Branded, dated, sources on every figure, the honest-close paragraph on the last page above Jeff's contact block. This PDF *is* the outbound asset: every one forwarded to a board chair is marketing that money can't buy.
- **Email me this report** — sends the PDF plus the live link. This is consented lead capture that gives more than it takes. One optional checkbox: "Keep me posted when [County]'s data changes" — which quietly builds the nurture list the six-month plan called for, per school, with intent signal attached.
- Backend: a small serverless function + a transactional mail API (Resend or Postmark) + a leads table. (Supabase is already in your toolchain on the Mac — one table: email, unitid, timestamp, opt-in flag.) Store nothing about viewers who don't submit.
- Every send includes the data vintage and the one-line privacy promise.

### B. "Ask a question about this report" — human, not chatbot

A question box on the result page, pre-tagged with the school and the module the reader was viewing ("question about: USDA eligibility"). Routed to Jeff's inbox with the school's full record attached, so the reply can be specific. Promise on the box: **"Answered by a person, within two business days."**

Deliberately *not* an AI chat in v1: wrong answers about federal funding eligibility are the one thing this tool cannot afford, and the entire strategy says the phone-call layer is the human moat — the question box is how prospects opt into it. Topic chips ("Who signs this?" / "Would our accreditor care?" / "Which program pays?") lower the blank-box barrier and pre-sort the pipeline. If volume ever justifies an AI layer, constrain it to the school's own precomputed record with citations, and have it hand off — never conclude.

### C. "What do you have?" — the asset picker

This turns spec flaw #7 into the tool's most engaging moment. After the gaps render, one interactive step:

> **Which of these does your campus have more of than it needs?**
> ☐ Dormitory beds ☐ Classroom/office space ☐ Commercial kitchen ☐ Gym or athletics facilities ☐ Labs ☐ Acreage ☐ Parking ☐ An auditorium or theater

Client-side only — checking boxes instantly re-ranks the pathway matches ("Your spare dorm beds + 31% renter cost burden → housing conversion, a *Partner-funded* pathway; here's who paid for it at Purchase College"). No data problem, because the user supplies the missing data; high engagement, because it's about *their* buildings; and the selections (stored only if they email the report) tell Jeff exactly which One-Door Proposal to draft before the first call. It also makes every report unique to the reader — the difference between a lookup and a consultation preview.

### D. "See what a Scan found" — the bridge to paid work

The report's honest close already says the decisive facts aren't public. Show, don't tell: link one **redacted sample One-Pathway Scan** ("a small Appalachian college, name withheld") next to the request button, so the reader sees the artifact the free report is a preview of. The distance between the free page and the sample — named rents, named signatories, a program calendar — makes the Scan's value self-evident. When the first two proposals from the 45-day plan exist, this asset is a by-product, not extra work.

### What deliberately stays out

No accounts or logins (friction without value at this stage). No auto-generated outreach letters to partners (a wrong first touch to a hospital CEO burns the region for Jeff's *real* approach). No public directory of "schools that ran reports" (the privacy promise is the product). No revenue projections per school — unchanged from the spec's refusal list.

### Build order for Part 3

1. Print stylesheet + Download PDF (smallest lift, largest reuse)
2. Asset picker (client-side only, no backend)
3. Email-me + leads table (first backend piece)
4. Question box (same backend, plus notification)
5. Redacted sample Scan (blocked on the 45-day plan producing one — not on code)
