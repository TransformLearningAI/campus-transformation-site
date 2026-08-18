# Audit Fix Pack — Instructions and Replacement Copy for Claude Code

**Companion to `PERSUASION_AUDIT.md` · numbered to match its priority list · August 2026**

Rules for executing this pack: copy marked **VERBATIM** is final — paste it, don't improve it. Items marked **JEFF APPROVES FIRST** must be shown to Jeff before the change is made. Adapt selectors/structure to how the site is actually built; never invent new marketing claims, numbers, or institution names beyond what this pack provides. After each phase, show a summary of what changed before deploying.

---

## FIX 1 — One homepage, working links (structural)

1a. Make the "Start with one building" page (currently the `?v=2` variant) the page served at `campustransformation.org/`. 301-redirect any URL that served the old version. Archive the old homepage's source in the repo (e.g., `/archive/homepage-v1.html`) — do not delete it; several of its sections are reused below.

1b. Fix the Process page CTA that links to `/campus-transformation#contact` (404). Point it to `/inquiry`.

1c. Crawl the site for any other internal links to removed/renamed paths and fix them. Report what you found.

---

## FIX 2 — Accreditation copy (highest-stakes copy change)

2a. Replace FAQ #2 in full. **VERBATIM:**

> **What happens to accreditation?**
> For most of the pathways we recommend, nothing. Leasing a building, renting facilities, hosting a partner, or employer-paid training are not "substantive changes" under federal accreditation rules, and SACSCOC, HLC, and MSCHE do not treat property leases as reportable. (New England institutions accredited by NECHE do file for significant leases and asset sales — we'll tell you if that's you.) A full campus transformation, where an institution eventually chooses to operate outside accreditation, is one option at the far end of a long spectrum — never the starting point, and never a requirement. You do not give up anything to take a first step.

2b. Replace the "What you might leave behind" list. **VERBATIM:**

> **What a first step does not touch:** your accreditation, your federal aid eligibility, your degree programs, your mission statement. A single-pathway project runs alongside the college you already are.

Remove the phrase "federal financial aid paperwork" and "some or all accreditation compliance" wherever they appear.

---

## FIX 3 — De-name, retire the death list, blog rule

3a. Cases page, "modeled transformation plans": strip the real institution names. Pittsburgh Technical College becomes "A closed technical college in western Pennsylvania (180 acres, 461 dorm beds, professional kitchens)". Hampshire College becomes "An 800-acre New England liberal arts campus". Keep the third (already anonymized) as-is. Remove "Closing Fall 2026"-style status lines from these entries.

3b. Move the "Happening Now" closure list off the homepage flow to its own page at `/market-context`, retitled **VERBATIM:** "The market context: closures are accelerating" with this intro line: "We keep this page because the trend is real. Nothing on it is a prediction about any individual institution." Link to it only from the FAQ and footer.

3c. **JEFF APPROVES FIRST:** Blog. Propose (do not execute without approval): unpublish or rewrite "Your First Client Will Almost Kill You" to remove any identifiable prospect detail (especially "a school that can't make payroll"); retitle "Oakland City Doesn't Have to Die" to remove the named institution + death phrasing (suggest: "A University Suspended Its Undergraduate Programs. The Campus Still Has Options."). Add a one-line editorial policy to the blog index footer, **VERBATIM:** "We never write about prospects, clients, or identifiable conversations. What's discussed with us stays with us."

---

## FIX 4 — "No board vote" reframe (sequencing, not circumvention)

On the homepage "What this does not require" section, change the first card's header from "No board vote, usually" to **"Within authority your board has already delegated"** and replace its body. **VERBATIM:**

> Most boards have already delegated lease, license, and grant-application authority to the president or CFO — it's in your signature policy. A single-pathway project is designed to fit inside that existing delegation, so that what eventually reaches your board isn't a blank question but a working proposal with the risk already taken out. Boards get better decisions when the first version arrives de-risked. We'll read your bylaws and delegation policy and tell you exactly which side of the line your project falls on.

Do not change the other three cards.

---

## FIX 5 — Cases page restructure

Lead the cases page with the stayed-open cases (Cheyney, Purchase, Warren Wilson, Goucher, D'Youville, Lackawanna, Dakota Wesleyan, Alvernia — the card copy already exists on the new homepage; reuse it) under the heading **VERBATIM:** "Colleges that stayed colleges — and found new revenue."

Move Marygrove, Goddard, and Saint Rose below them under the heading **VERBATIM:** "And what happens to campuses whose boards waited." Keep their content; the honesty of the heading is the point. Change the page's closing CTA from "Is your campus next?" to **VERBATIM:** "Every one of these started with one decision. See what your first one could be." (button unchanged → /inquiry).

---

## FIX 6 — One price sentence, one free offer

6a. Sitewide, replace every pricing/fee sentence ("sliding scale and always negotiable," "Free for qualifying institutions. Typically a $15-20K engagement," etc.) with **VERBATIM:** "Your first step with us is free. Anything beyond it is scoped and priced before you commit to anything."

6b. The free offer is named **One-Pathway Scan** everywhere. "Community X-Ray" survives only as a method reference inside service descriptions ("built on our Community X-Ray analysis"), never as an offer with its own price or CTA.

---

## FIX 7 — Trust surfacing; cut the anti-lines

7a. Remove sitewide: "We're not McKinsey" (and the surrounding "We're not a real estate company" framing if it lists competitors) and "Your campus is the venue. Our technology is the engine. Your community is the mission."

7b. Add to the homepage, directly after the case-studies section, a short trust block. **VERBATIM:**

> **Built by people who ran the institutions, not a real estate firm.**
> Professors, deans, a school superintendent who ran a $137M district, workforce and community developers — seven advanced degrees among us, and decades inside the schools now facing this market. [Meet the team →](/about)

---

## FIX 8 — Inquiry form softening

On /inquiry: make "Current situation" optional and reorder its options to: Planning ahead · Exploring alternatives · Enrollment declining · Under financial pressure · Considering closure · Already closed. (Rename "Under financial distress" → "Under financial pressure.") Remove "Already closed" from the *enrollment* dropdown (it isn't an enrollment size). Add one line under the form's confidentiality sentence, **VERBATIM:** "You don't need to label your situation to talk to us."

---

## FIX 9 — CFO-facing numbers

9a. Debt copy: replace "a campus generating $5-7M in revenue can service $1-2M in annual bond payments" (both places) with **VERBATIM:** "A transformed campus producing $2–3M in net operating income can service $1–2M in annual bond payments — and bondholders consistently prefer a paying going concern to a 20-to-40-cents-on-the-dollar liquidation."

9b. Add directly under the five-year financial table, **VERBATIM:** "Build-out capital is the line you don't see here — because in the models we recommend, it isn't the college's line. Renovation is carried by grant programs, development partners, or tenant investment. The worked examples on our cases page show who actually paid."

9c. Timeline: make both pages agree. FAQ #8 and the Process page stat both become **VERBATIM:** "First revenue: months. Self-sustaining: typically 2–3 years."

9d. Replace the "65% of small privates showing financial stress (Forbes)" stat with **VERBATIM:** "442 private colleges projected at risk over the next decade (Bain/NPR analysis, 2026)" — keep the other two stats.

9e. FAQ #4: change "WIOA funding (up to $15,000 per student)" to **VERBATIM:** "WIOA training funds (award caps are set by each local workforce board), employer-sponsored training, DOL grants, and state workforce development funds."

---

## FIX 10 — Municipal landing section

Add a section to the homepage (after the audience selector) or a page at `/towns`, targeted at mayors, city managers, and EDCs. **VERBATIM:**

> ## For the town that hosts a campus
>
> If the college in your community is struggling — or already gone — the campus is still your problem and still your opportunity. You don't need the college's permission to plan.
>
> A campus reuse feasibility study is the fastest, cheapest first step a municipality can take: Ashland, Wisconsin commissioned one for $7,500 after Northland College closed. The Village of Cazenovia commissioned one for its closed college campus and then won a $10 million state revitalization award on the strength of it. Public buyers, public budgets, no confidentiality friction.
>
> We conduct these studies — one campus, one report, the realistic uses ranked, the funding programs named. And if the college is still open, a town-initiated conversation is often the least threatening way for its board to start one.
>
> **[Talk to us about your campus →](/inquiry)**

Set the Municipality/EDC card in the audience selector to link here.

---

## Execution order

Phase 1 = Fixes 1, 3b, 8 (structural, low copy risk).
Phase 2 = Fixes 2, 4, 5, 6, 7, 9 (copy replacements — every block provided verbatim above).
Phase 3 = Fix 10 (new section) and Fix 3a (de-naming).
Fix 3c is proposed to Jeff, never auto-executed.
After each phase: summary of diffs → Jeff approves → deploy.
