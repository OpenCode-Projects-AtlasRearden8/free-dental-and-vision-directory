# Free Dental & Vision Directory

A plain-English, static directory of free and low-cost **dental, glasses, and hearing help** in the United States — dental-school sliding-scale clinics, free clinic-day events, vision voucher programs, hearing-aid assistance charities, a first-visit document checklist, and a one-page kind ask-for-help script.

Part of a family of three companion guides, each intentionally separate:

| Guide | Covers |
|---|---|
| **free-dental-and-vision-directory** (this one) | Teeth, glasses, hearing — where the care is |
| free-prescription-savings-directory | Medications and prescription savings |
| free-health-admin-kit | Insurance paperwork, bills, medical records |

## Everything in this project is:

- **Education only** — never medical advice. Every page says so plainly.
- **Plain vetted links** — each program's own homepage, with a note about what to ask.
- **No tracking, no signups** — plain HTML/CSS files. No forms, no accounts, no cookies, no analytics, no build step.
- **Local-first** — works offline; you could print the whole site and hand it to a neighbor.
- **Beginner- and ADHD-friendly** — warm prose, short steps, call scripts you can read off the phone screen.

## Pages

| File | What's inside |
|---|---|
| `index.html` | Home: how to start, the universal 211/HRSA first steps |
| `dental.html` | Dental: community health centers, dental schools, dentist charity programs, Medicaid/CHIP |
| `vision.html` | Vision: exam and glasses-voucher programs, optometry schools, OTC routes |
| `hearing.html` | Hearing: hearing-aid charities, university audiology clinics, OTC hearing aids, state AT programs |
| `clinic-events.html` | Free clinic-day events: what they are, where to find them, how the day runs |
| `documents.html` | What to bring on your first visit + questions to ask when booking |
| `ask-for-help.html` | A one-page, fill-in-the-blank kind ask-for-help script (print it) |

## How to run it

Nothing to install and nothing to build — it's plain HTML and CSS.

- **Browse:** double-click `index.html`, or
- **Serve locally:** from this folder run

```bash
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

## Verify / test

A small dependency-free Node script checks the whole site: internal links resolve, every page carries the education-not-medical-advice disclaimer, every external link is an HTTPS homepage or a listed vetted domain, the LICENSE is intact, and no tracking/signup patterns appear anywhere.

```bash
node test/check.js
```

All checks passing is expected; see `STATUS.md` for the latest verification output.

## Safety & privacy

- No secrets, API keys, or personal data live in these files.
- Links point to programs' own websites. Program eligibility, fees, and availability change often — always confirm with the program. Nothing here replaces advice from a licensed clinician.

## Author

Made with care by **Asdale Dynamics, LLC** — Dylan Asdale's Indiana LLC for beginner-friendly AI education, books, guides, and practical tools. Hub site: <https://dylanasdale.github.io>

Licensed under the MIT License — see `LICENSE`.
