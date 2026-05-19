# Module 3 — Performance / Core Web Vitals Design Spec
**Date:** 2026-05-19
**Project:** Shumaker Roofing — Website Technical Agent
**Status:** Approved

---

## Overview

Module 3 extends the existing `tech-audit` skill with a Performance / Core Web Vitals audit. It appends a new `## Module 3 — Performance / Core Web Vitals` section to the existing skill file and runs **after Module 2, before the Findings Aggregator** on each nightly run and on-demand `/tech-audit` invocation.

The module calls the **PageSpeed Insights API** (mobile strategy, matching Google's mobile-first indexing) for each URL in the inventory built by Module 6. Results are written to `memory/tech-audit/performance-report.md` and fed into the existing findings aggregator using a new `P-` prefix.

No new cron schedule is required — Module 3 runs as part of the existing `0 2 * * *` routine.

---

## Execution Order (updated)

```
START
  ↓
Module 6 — Fetch sitemap / build URL inventory
  ↓
Module 1 — Health check (HTTP status, CMS fields, dead links)
  ↓
Module 2 — Technical SEO checks (robots, sitemap, schema, meta, canonicals)
  ↓
Module 3 — Performance / Core Web Vitals (PageSpeed Insights API)
  ↓
Aggregate findings → memory/tech-audit/
END
```

---

## Environment Variables

One new env var added to `.env.local`:

```
PAGESPEED_API_KEY=...
```

Resolution order:
1. Read from `.env.local`
2. If not set → proceed with anonymous tier and log: `"PAGESPEED_API_KEY not set — running anonymous tier, may hit rate limits"`

---

## Module 3 — Performance / Core Web Vitals

### Step 3.1: API Call per URL

For each URL in the inventory (from Module 6), call the PageSpeed Insights API:

```
GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed
  ?url={ENCODED_URL}
  &strategy=mobile
  &key={PAGESPEED_API_KEY}
```

**Sequencing:** calls are made sequentially with a 1-second delay between each to avoid rate limits. For ~50 pages this adds ~50 seconds to the nightly run.

**Error handling:**

| Response | Action |
|---|---|
| HTTP 429 (rate limited) | Stop further API calls; log remaining URLs as `P2 — PageSpeed API rate limited`; continue to aggregator |
| HTTP 4xx / 5xx | Log that URL as `P2 — PageSpeed API unreachable`; continue to next URL |
| Missing metric in response | Skip that metric silently; do not flag |

### Step 3.2: Metric Extraction

Extract four values per page from the API response:

| Metric | API field |
|---|---|
| LCP | `lighthouseResult.audits.largest-contentful-paint.numericValue` (ms) |
| CLS | `lighthouseResult.audits.cumulative-layout-shift.numericValue` |
| INP | `lighthouseResult.audits.interaction-to-next-paint.numericValue` (ms) |
| Performance Score | `lighthouseResult.categories.performance.score × 100` |

### Step 3.3: Threshold Evaluation

Apply Google's standard CWV thresholds:

| Metric | Good | Needs Work → P2 | Poor → P1 |
|---|---|---|---|
| LCP | ≤ 2500ms | 2500–4000ms | > 4000ms |
| CLS | ≤ 0.1 | 0.1–0.25 | > 0.25 |
| INP | ≤ 200ms | 200–500ms | > 500ms |
| Performance Score | ≥ 90 | 50–89 | < 50 |

**Severity rules:**
- Any CWV metric in "Poor" range → **P1**
- Any CWV metric in "Needs Work" range → **P2**
- Performance score < 50 → **P1**; score 50–89 → **P2**
- API unreachable / rate limited → **P2**
- All metrics passing → page is clean, omitted from report

**Hard constraint:** Module 3 never modifies code or configuration. All findings are logged only — no auto-fix.

### Step 3.4: Suggested Fix Mapping

For each failing metric, append a suggested fix to the report:

| Failing metric | Suggested fix |
|---|---|
| LCP poor/needs work | Check hero image size, lazy loading, and server response time |
| CLS poor/needs work | Set explicit width/height on images and embeds; avoid inserting content above fold |
| INP poor/needs work | Reduce JavaScript blocking time; defer non-critical scripts |
| Performance score < 90 | Review Lighthouse opportunities tab for largest wins |

### Step 3.5: Write performance-report.md

Overwrite `memory/tech-audit/performance-report.md` with the full results table:

```
# Performance Report — {YYYY-MM-DD HH:MM UTC}

| URL | LCP | CLS | INP | Score | Severity | Suggested Fix |
|-----|-----|-----|-----|-------|----------|---------------|
```

One row per failing URL. Pages passing all thresholds are omitted.

**Severity key:** P1 = poor (immediate attention) · P2 = needs work (monitor) · — = clean

---

## Findings Aggregator — Updates

### New finding prefix: `P-`

Performance findings use `P-{NNN}` IDs (e.g. `P-001`, `P-002`). IDs are stable across runs and never reused. One finding per failing metric per URL.

Example findings:

```
| P-001 | Perf | /blog/metal-roofing | LCP poor: 5.1s (threshold 4s) | P1 | 2026-05-19 | open |
| P-002 | Perf | /blog/metal-roofing | CLS poor: 0.31 (threshold 0.25) | P1 | 2026-05-19 | open |
| P-003 | Perf | /services/gutters | LCP needs work: 3.2s | P2 | 2026-05-19 | open |
```

Auto-resolution: if a URL passes the same metric check on a subsequent run, the finding is marked `closed`.

### audit-log.md update

Each run entry gains:

```
- Performance findings: {N total} ({N new}, {N resolved})
- Open P1 perf issues: {N}
```

### Run summary update

The final run summary gains a Performance line:

```
Tech Audit Complete — {YYYY-MM-DD HH:MM UTC}
URLs checked: {N}
──────────────────────────────
Health:        {N issues} ({N new}, {N resolved})
Technical SEO: {N issues} ({N new}, {N resolved})
Performance:   {N issues} ({N new}, {N resolved})
──────────────────────────────
Open P1: {N}   Open P2: {N}   INFO: {N}
──────────────────────────────
Reports written to memory/tech-audit/
Next scheduled run: tomorrow at 02:00 UTC
```

P1 performance issues are listed explicitly in the P1 block at the end of the summary.

---

## File Changes

| Action | Path | Notes |
|---|---|---|
| Modify | `.claude/plugins/website-technical-agent/skills/tech-audit.md` | Append Module 3 section before the Findings Aggregator section |
| Modify | `.claude/plugins/website-technical-agent/skills/tech-audit/SKILL.md` | Mirror the same append (both files must stay in sync) |
| Create | `memory/tech-audit/performance-report.md` | Initialize empty; overwritten each run |
| Modify | `.env.local` | Add `PAGESPEED_API_KEY=...` |

---

## Out of Scope (This Phase)

- Auto-fixing performance issues (requires code changes with regression risk)
- Desktop strategy (mobile-first matches Google Search Console)
- Historical trend tracking across runs (current design overwrites report each run)
- Lighthouse CI via GitHub Actions
