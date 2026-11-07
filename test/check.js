#!/usr/bin/env node
/**
 * check.js — no-dependency validator for the Free Dental & Vision Directory.
 * Run: node test/check.js
 * Exits 0 when everything passes, exits 1 with a report otherwise.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const PAGES = [
  "index.html",
  "dental.html",
  "vision.html",
  "hearing.html",
  "clinic-events.html",
  "documents.html",
  "ask-for-help.html",
];

// Vetted external domains (homepage-level, program-owned sites).
const VETTED_DOMAINS = new Set([
  "findahealthcenter.hrsa.gov",
  "www.211.org",
  "www.ada.org",
  "www.adcf.net",
  "www.adha.org",
  "www.medicaid.gov",
  "www.medicare.gov",
  "www.va.gov",
  "www.aoa.org",
  "www.new-eyes.org",
  "www.preventblindness.org",
  "www.lionsclubs.org",
  "www.onesight.org",
  "www.opted.org",
  "www.ramusa.org",
  "www.hlaa.org",
  "www.miracle-ear.com",
  "www.starkeyhearingfoundation.org",
  "www.sertoma.org",
  "www.asha.org",
  "www.at3center.net",
  "dylanasdale.github.io",
]);

const DISCLAIMER_PHRASE = "Education only";
const DISCLAIMER_PHRASE_2 = "never medical advice";
const NO_TRACKING_PATTERNS = [
  /<script[^>]+src=/i,          // external scripts (analytics, trackers)
  /google-analytics|googletagmanager|hotjar|matomo|segment\.com|facebook\.net/i,
  /type=["']email["']/i,        // signup forms
  /<form[\s>]/i,                // any form at all
  /cookie/i,
];

let failures = [];
const ok = (msg) => console.log("  PASS  " + msg);
const bad = (msg) => { failures.push(msg); console.log("  FAIL  " + msg); };

function section(title) {
  console.log("\n== " + title + " ==");
}

// ---- 1. All pages exist -----------------------------------------------------------------
section("Pages exist");
for (const f of [...PAGES, "style.css"]) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p) && fs.readFileSync(p, "utf8").length > 200) ok(f + " exists and has content");
  else bad(f + " missing or empty");
}

// ---- 2. Per-page HTML sanity --------------------------------------------------------------
section("Per-page checks");
const files = {};
for (const f of PAGES) files[f] = fs.readFileSync(path.join(ROOT, f), "utf8");

function checkInternalAnchors(file, html, fname) {
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  for (const href of hrefs) {
    if (href.startsWith("http")) {
      let u;
      try { u = new URL(href); } catch { bad(fname + ": malformed URL " + href); continue; }
      if (u.protocol !== "https:") {
        bad(fname + ": external link is not HTTPS: " + href);
        continue;
      }
      if (!VETTED_DOMAINS.has(u.host)) {
        bad(fname + ": unvetted external domain: " + u.host);
        continue;
      }
      if (u.pathname && u.pathname !== "/" && u.pathname.length > 1) {
        bad(fname + ": external link goes deeper than homepage: " + href);
        continue;
      }
    } else if (href.startsWith("#")) {
      const anchor = href.slice(1);
      if (!new RegExp('id="' + anchor + '"').test(html)) {
        bad(fname + ": broken in-page anchor #" + anchor);
      }
    } else {
      const target = href.split("#")[0];
      if (!fs.existsSync(path.join(ROOT, target))) {
        bad(fname + ": broken link to missing file " + href);
      } else if (href.includes("#")) {
        const t = files[target] || fs.readFileSync(path.join(ROOT, target), "utf8");
        const anchor = href.split("#")[1];
        if (anchor && !new RegExp('id="' + anchor + '"').test(t)) {
          bad(fname + ": broken anchor " + href);
        }
      }
    }
  }
}

for (const fname of PAGES) {
  const html = files[fname];
  let pageOk = true;
  if (!html.includes(DISCLAIMER_PHRASE) || !html.includes(DISCLAIMER_PHRASE_2)) {
    bad(fname + ": missing education-not-medical-advice disclaimer"); pageOk = false;
  }
  for (const pat of NO_TRACKING_PATTERNS) {
    if (pat.test(html)) { bad(fname + ": possible tracking/signup pattern: " + pat); pageOk = false; }
  }
  if (!/<title>[^<]+<\/title>/.test(html)) { bad(fname + ": missing <title>"); pageOk = false; }
  if (!/<meta name="description"/.test(html)) { bad(fname + ": missing meta description"); pageOk = false; }
  if (!/Asdale Dynamics, LLC/.test(html)) { bad(fname + ": missing Asdale Dynamics, LLC credit"); pageOk = false; }
  checkInternalAnchors(fname, html, fname);
  if (pageOk) ok(fname + ": disclaimer, title, meta, credit, no-tracking all good");
}

// ---- 3. Nav consistency ------------------------------------------------------------------
section("Navigation");
for (const fname of [...PAGES]) {
  const html = files[fname];
  const cur = [...html.matchAll(/<a href="([^"]+)" aria-current="page">/g)].map(m => m[1]);
  if (cur.length !== 1) bad(fname + ": expected exactly 1 aria-current nav link, found " + cur.length);
  else if (cur[0] !== fname) bad(fname + ": aria-current points to " + cur[0] + " (should be " + fname + ")");
  else ok(fname + ": nav current-page marker correct");
}
// Every page must link to all other pages in its nav.
const navExpect = [...PAGES];
for (const fname of PAGES) {
  for (const other of navExpect) {
    const re = new RegExp('<a href="' + other + '"');
    if (!re.test(files[fname])) bad(fname + ": nav missing link to " + other);
  }
}

// ---- 4. Assets ----------------------------------------------------------------------------
section("Assets");
if (!fs.existsSync(path.join(ROOT, "style.css"))) bad("style.css missing");
else ok("style.css present");
const usesCss = PAGES.every(f => files[f].includes('href="style.css"'));
if (usesCss) ok("all pages link to style.css"); else bad("a page does not link style.css");

// ---- 5. LICENSE -----------------------------------------------------------------------
section("LICENSE");
const lic = fs.readFileSync(path.join(ROOT, "LICENSE"), "utf8");
const expectedLine = "Copyright (c) 2026 Asdale Dynamics, LLC";
if (lic.includes("MIT License") && lic.includes(expectedLine)) {
  const line = lic.split("\n").find(l => l.trim() === expectedLine);
  if (line) ok("MIT LICENSE with exact copyright line: " + expectedLine);
  else bad("Copyright line is not exact in LICENSE");
} else bad("LICENSE missing MIT text or exact copyright line");

// ---- 6. README crediting -----------------------------------------------------------------
section("README");
const readme = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
if (readme.includes("Asdale Dynamics, LLC")) ok("README credits Asdale Dynamics, LLC");
else bad("README does not credit Asdale Dynamics, LLC");
if (/MIT/.test(readme)) ok("README references MIT License");
else bad("README does not reference MIT License");

// ---- 7. No secrets / personal data ------------------------------------------------------
section("Secrets & personal-data scan");
const scanTargets = [...PAGES, "style.css", "README.md", "LICENSE"];
const secretPatterns = [
  /(?:api[_-]?key|secret|password|token)\s*[:=]\s*["']?[A-Za-z0-9_\-]{8,}/i,
  /AKIA[0-9A-Z]{16}/,                                  // AWS access key id
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /(?:^|\s)\d{3}-\d{2}-\d{4}(?:\s|$)/,                 // SSN-like numbers
  /\b(?:\d[ -]*?){13,16}\b/,                           // long digit strings (card-like)
];
let secretHit = false;
for (const f of scanTargets) {
  const t = fs.readFileSync(path.join(ROOT, f), "utf8");
  for (const p of secretPatterns) {
    if (p.test(t)) { bad(f + ": potential secret/personal-data pattern: " + p); secretHit = true; }
  }
}
if (!secretHit) ok("no secret/personal-data patterns found in content files");

// ---- 8. Sibling-project distinctness -------------------------------------------------------
section("Distinctness from sibling guides");
const hint = /(free-prescription-savings-directory|free-health-admin-kit)/;
const mention = [...PAGES].some(f => hint.test(files[f]));
if (mention) ok("directory explains how it differs from the prescription & admin-kit guides");
else bad("no text distinguishing this from sibling guides");

// ---- result ------------------------------------------------------------------------------
console.log("\n----------------------------------------------");
if (failures.length === 0) {
  console.log("ALL CHECKS PASSED (" + PAGES.length + " pages, " + VETTED_DOMAINS.size + " vetted domains)");
  process.exit(0);
} else {
  console.log(failures.length + " CHECK(S) FAILED:");
  for (const f of failures) console.log("  - " + f);
  process.exit(1);
}
