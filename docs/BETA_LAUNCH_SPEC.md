# Beta Launch Spec: "Look Up Your School"

**Companion to `LOOKUP_TOOL_SPEC.md` · applies to the result page and homepage lookup box until beta exit**

The tool ships as a visible beta. For this audience, honesty about newness builds more trust than pretended polish — and beta users reporting oddities are exactly the people we want talking to us. This document specs the banner, the feedback mechanic, and the exit criteria.

---

## 1. The beta banner

**Placement:** a slim bar directly under the site header on the result page, and a small "Beta" chip beside the search box on the homepage. Not a modal, not a dismissible toast — a quiet, persistent label.

**Result page banner copy, verbatim:**

> **Beta.** This report is generated from public federal records and covers every private nonprofit four-year college in the U.S. If a number looks wrong for your campus, it might be — [tell us](#report) and a person will check it within two business days.

**Homepage chip:** the word `BETA` in small caps beside the "Look up your school" heading, amber background, navy text (the existing `.navcta` colors pass contrast).

**Style:** amber-tinted background (`#fdf0d8`), navy text, `--amber-text` (#8a5d0c) for the bold "Beta." lead-in, 14px, one line on desktop, wrapping naturally on mobile. It should read as candor, not warning — no icons, no exclamation marks, no yellow-triangle vocabulary.

**What the banner must NOT say:** "experimental," "use at your own risk," "data may be inaccurate," or any general disclaimer of the data. Every figure already carries its source and vintage; the banner's job is to invite correction, not to undermine the report. A president deciding whether to trust the page reads "a person will check it" as a feature.

---

## 2. "Report a problem" — the feedback mechanic

**Placement:** two entry points, same mechanic.
1. The `tell us` link in the banner.
2. A small line at the bottom of **every module** on the result page: `See something wrong in this section? Tell us.`

**v1 mechanic: pre-filled mailto. No backend.** Each link opens an email to jeff@transformlearning.ai with a machine-parseable subject and a pre-filled body, so every report arrives with its context attached:

```
Subject: [Beta feedback] Bethany College (237181) — funding module

Body (pre-filled):
School: Bethany College, Bethany WV (UNITID 237181)
Report section: Who would pay
Data version: 2026.08
What looks wrong (please describe):

```

Build the subject and body from the record's `unitid`, `institution.name`, the module's title, and `data_version` — all already in the JSON. The user types one sentence and hits send.

**Why mailto and not a form:** no backend exists yet, feedback lands where Jeff already works, and the sender's email address arrives automatically — which makes every bug report also a warm contact with a school name attached. When the Part 3 backend (email-me, question box) gets built, migrate this to the same endpoint; until then, mailto is complete, not a compromise.

**Response promise, shown next to every feedback link:** `Answered by a person, within two business days.` Same promise as the question box, same reason: the human layer is the product.

---

## 3. Triage rules (for Jeff, not for code)

- **A wrong number** (bad join, stale vintage, suppression rendered as zero) → fix in the pipeline, thank the reporter, note the fix. These are gold; each one hardens the tool.
- **A number that's right but reads wrong** (metro-level labor data attributed to the county, LQ confusion) → the display gloss needs work, not the data. File against the plain-English gloss rules in the review doc, Part 2.
- **A disagreement with the framing** ("we're not tuition-dependent") → not a bug. Reply personally; this is a conversation with a prospect, which is the point of the beta.
- Track nothing automatically. A simple email folder is the v1 bug tracker.

---

## 4. Beta exit criteria

Remove the banner when **all three** hold, and not before:

1. **The SNMHI table is populated** for every state with a live report (the USDA phone-call item) — so the funding module renders full grant tiers, not "call to confirm."
2. **Twenty real schools have been looked up by outsiders** (not the team) with no data-error reports open.
3. **The labor module runs on OEWS May 2025 or newer** across all areas, with the vintage break from May 2023 fully resolved.

Until then the banner stays, including through press mentions and outreach. "Beta" on a tool this specific is credibility, not apology.

---

## 5. One instruction for Claude Code

Build the banner and feedback links into the result page template from the first render — they are part of the page's structure, not a layer added before launch. The Edgewater sample (`sample_report_edgewater.html`) does not carry the banner because it is a fictional sample, not a beta report; do not add one there.

---

## 6. "What we do for you once you have your Scan" — the after-the-Scan ladder

The Scan must not read as a dead end. The moment a reader imagines holding the recommendation, the page should answer the next question: *then who helps me do it?* This section renders on the homepage Scan offer and, in compact form, at the close of every report.

**Copy, verbatim (homepage version):**

> ## After your Scan: we don't hand you a document and leave
>
> **If the recommendation makes sense to you**, we turn it into a One-Door Proposal: a 20–30 page working document with the funding program named, the applicant identified, the approval path mapped — who signs what, and when your board is and isn't needed — and a first-90-days plan. Scoped and priced before you commit to anything.
>
> **Then we help you land it.** Introductions to the partners the report named — the health system, the workforce board, the development district. Support on the grant application itself. A one-page board brief written for trustees, not consultants. And we stay with you through the first signature.
>
> **And if the Scan finds nothing worth doing?** We tell you that instead, and it costs you nothing. A recommendation you can trust requires that "no" be a possible answer.

**Design notes:** three short blocks, not a pricing table — the gradualist strategy defers pricing to the scoped conversation, so the site says "scoped and priced before you commit" and never prints a number. The third block is load-bearing: the willingness to say "nothing here" is what makes the first two believable.
