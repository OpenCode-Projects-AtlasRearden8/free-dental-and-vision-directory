# STATUS

Last verified: 2026-11-07 · Node v20.19.2 · Python 3.13.5

## What was built

**Free Dental & Vision Directory** — a local-first, static directory of free and low-cost dental, glasses, and hearing help in the U.S. Plain-English and beginner/ADHD-friendly, education only (never medical advice).

- `index.html` — home page: universal first steps (call 211, HRSA community-health-center finder), how the directory works, distinction from sibling guides
- `dental.html` — community health centers (sliding scale), dental-school & hygiene-school clinics, dentist charity programs (Missions of Mercy, Give Kids A Smile), Medicaid/CHIP/Medicare-Advantage/VA routes
- `vision.html` — vision voucher & exam programs (VISION USA, New Eyes, Prevent Blindness, Lions), OneSight, optometry schools, low-cost fallbacks, sudden-vision safety note
- `hearing.html` — hearing-aid assistance charities (HLAA, Miracle-Ear Foundation, Starkey, Lions, Sertoma), university audiology clinics, OTC hearing aids, state assistive-technology programs, sudden-hearing-loss safety note
- `clinic-events.html` — what free clinic-day events include, where to find them, how the day runs, morning checklist
- `documents.html` — first-visit document checklist + six booking questions + what to do if a document is missing
- `ask-for-help.html` — one-page, fill-in-the-blank kind ask-for-help script (printable)
- `style.css` — shared warm print-friendly styling; no JavaScript anywhere
- `test/check.js` — dependency-free validator (see below)
- `README.md` (credits Asdale Dynamics, LLC) · `LICENSE` (MIT, exact line `Copyright (c) 2026 Asdale Dynamics, LLC`)

Deliberately distinct from sibling guides: covers care for teeth/eyes/ears only; medications live in `free-prescription-savings-directory`, insurance paperwork/bills in `free-health-admin-kit`.

## How to run it

No build, no install:

- Open `index.html` directly in a browser, or
- `python3 -m http.server 8000` from this folder → http://localhost:8000

## Verification results

- `node test/check.js` → **ALL CHECKS PASSED** (7 pages, 22 vetted domains). Checks: pages exist, education-not-medical-advice disclaimer on every page, titles & meta descriptions, Asdale Dynamics credit on every page, all internal links/anchors resolve, every external link is HTTPS to the program's own homepage-level domain, exactly one correct `aria-current` nav marker per page, all nav links present, MIT LICENSE has the exact required copyright line, README credits the LLC, no tracking/signup/cookie/form patterns anywhere, secret & personal-data scan clean.
- Served locally with `python3 -m http.server` → all 7 pages and `style.css` return HTTP 200.

## Design decisions

- Links are **homepage-level only** (program-owned domains) with an education note on what to ask, instead of deep links that rot. The validator enforces this.
- No forms, accounts, cookies, analytics, or JavaScript — "no tracking signups" is enforced by test, not just promised.

## Known gaps

- Program status is point-in-time: charities rotate funding (e.g., Starkey's U.S. program availability, local Lions funds). Always confirm with the program; the pages say so plainly.
- No state-by-state specifics (state Medicaid dental coverage, state 211 event calendars) — that depth belongs to a future state-level annex.
- The last-verified check could be an automated link-reachability test, but that would require network access at test time; it was deliberately kept offline/local-first.
- No print-optimized stylesheet yet (CSS is simple enough that browser print works reasonably); a dedicated `@media print` pass is a nice future polish.
- Sibling guides `free-prescription-savings-directory` and `free-health-admin-kit` are referenced here but live in their own repos.
