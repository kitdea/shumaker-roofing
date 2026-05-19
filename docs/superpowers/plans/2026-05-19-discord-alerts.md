# Discord Alerts — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Step A.7 (Discord webhook notification) to the Findings Aggregator in the tech-audit skill so every audit run posts a summary embed to Discord.

**Architecture:** Two markdown skill files need identical changes — the plugin SKILL.md and the local command file. Both files are the same skill; the command file is currently also missing Module 3, so this plan syncs it fully. No code compilation or tests — changes are to skill instruction files verified by manual inspection.

**Tech Stack:** Markdown skill files, Discord Incoming Webhooks API (JSON POST), WebFetch tool

---

## File Map

| File | Change |
|---|---|
| `C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\skills\tech-audit\SKILL.md` | Add Step A.7; update Aggregator intro; update Step A.6 summary format |
| `c:\Users\franc\Documents\shumaker-roofing\.claude\commands\tech-audit.md` | Sync Module 3 from SKILL.md; add Step A.7; update Aggregator intro; update Step A.4 and A.6 |

---

## Task 1: Add Step A.7 to SKILL.md

**File:** `C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\skills\tech-audit\SKILL.md`

- [ ] **Step 1.1: Update the Aggregator intro line**

Find this line near the top of the Findings Aggregator section:

```
Run this after both modules complete.
```

Replace with:

```
Run this after all modules complete. Steps A.1–A.6 write findings and report to the user. Step A.7 sends a Discord notification.
```

- [ ] **Step 1.2: Update Step A.6 to note that A.7 follows**

Find the Step A.6 section header:

```
### Step A.6: Final Report to User
```

Replace with:

```
### Step A.6: Final Report to User

Print the run summary below, then proceed to Step A.7.
```

- [ ] **Step 1.3: Append Step A.7 after Step A.6**

After the closing ``` of the P1 Issues block at the end of Step A.6, append:

```markdown
### Step A.7: Send Discord Alert

**7.1 — Read webhook URL**

Read `DISCORD_WEBHOOK_URL` from `.env.local`.

If the value is empty or the key is missing:
- Log: `"DISCORD_WEBHOOK_URL not set — skipping Discord alert"`
- Stop here. Do not fail the audit run.

**7.2 — Build embed payload**

Construct this JSON payload, substituting all `{...}` placeholders with real values from the current run:

```json
{
  "embeds": [{
    "title": "Tech Audit — {YYYY-MM-DD HH:MM UTC}",
    "color": {COLOR},
    "description": "{P1_LIST}",
    "fields": [
      { "name": "URLs Checked", "value": "{N}", "inline": true },
      { "name": "Open P1", "value": "{N}", "inline": true },
      { "name": "Open P2", "value": "{N}", "inline": true },
      { "name": "Health", "value": "{N issues} ({N new}, {N resolved})", "inline": false },
      { "name": "Technical SEO", "value": "{N issues} ({N new}, {N resolved})", "inline": false },
      { "name": "Performance", "value": "{N issues} ({N new}, {N resolved})", "inline": false }
    ],
    "footer": { "text": "Shumaker Roofing · nightly audit" }
  }]
}
```

**COLOR:** `3258260` (green `#31B257`) if zero P1 issues · `15158332` (red `#E74C3C`) if one or more P1 issues

**P1_LIST:**
- Zero P1s → `"✅ All checks passed"`
- One or more P1s → one line per P1 finding:
  ```
  ⚠ [H-003] /about — 404 Not Found
  ⚠ [S-002] /services/gutters — Missing meta description
  ```

**7.3 — POST to webhook**

Use `WebFetch` to POST the payload:

```
POST {DISCORD_WEBHOOK_URL}
Content-Type: application/json
Body: {payload from 7.2}
```

Response handling:

| Response | Action |
|---|---|
| HTTP 204 | Log: `"Discord alert sent"` |
| HTTP 429 | Log: `"Discord alert skipped — rate limited"`. Do not retry. |
| Any other non-2xx | Log: `"Discord alert failed — HTTP {status}"`. Do not fail the audit run. |
```

- [ ] **Step 1.4: Verify the file looks correct**

Read back the last 80 lines of SKILL.md and confirm:
- Step A.6 has the "proceed to Step A.7" note
- Step A.7 is present with all three sub-steps (7.1, 7.2, 7.3)
- The JSON payload block is intact and well-formed

- [ ] **Step 1.5: Commit**

```bash
git add "C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\skills\tech-audit\SKILL.md"
git commit -m "feat: add Step A.7 Discord alert to tech-audit SKILL.md"
```

---

## Task 2: Sync .claude/commands/tech-audit.md

The local command file is missing Module 3 (Performance/CWV) and Step A.7. This task brings it fully in sync with SKILL.md.

**File:** `c:\Users\franc\Documents\shumaker-roofing\.claude\commands\tech-audit.md`

- [ ] **Step 2.1: Update the skill header description**

Find:

```
description: Use to run a full website health and technical SEO audit for Shumaker Roofing. Checks HTTP status, CMS field integrity, dead links, meta tags, schema, canonicals, and robots.txt. Writes findings to memory/tech-audit/. Run on-demand or triggered by nightly cron.
```

Replace with:

```
description: Use to run a full website health and technical SEO audit for Shumaker Roofing. Checks HTTP status, CMS field integrity, dead links, meta tags, schema, canonicals, robots.txt, and Core Web Vitals. Sends Discord alert on completion. Writes findings to memory/tech-audit/. Run on-demand or triggered by nightly cron.
```

- [ ] **Step 2.2: Update the opening paragraph**

Find:

```
You are the Website Technical Agent for Shumaker Roofing. On each run you execute three modules sequentially: URL Inventory → Website Health → Technical SEO. Then you write all findings to `memory/tech-audit/`.
```

Replace with:

```
You are the Website Technical Agent for Shumaker Roofing. On each run you execute modules sequentially: URL Inventory → Website Health → Technical SEO → Performance/CWV. Then you write all findings to `memory/tech-audit/` and send a Discord alert.
```

- [ ] **Step 2.3: Add Module 3 after the Module 2 section**

After the closing `---` of Module 2 (after Step 2.9), insert the full Module 3 block copied verbatim from SKILL.md (Steps 3.1 through 3.5). The exact content to insert:

````markdown
## Module 3 — Performance / Core Web Vitals

Run all performance checks after Module 2 completes. Collect all findings — do not stop on first error.

### Step 3.1: Read PAGESPEED_API_KEY

Read `.env.local` and extract the value of `PAGESPEED_API_KEY`.

If the key is not present or is empty:
- Log a warning: `"PAGESPEED_API_KEY not set — running anonymous tier, may hit rate limits"`
- Proceed without a key (anonymous tier)

### Step 3.2: Call PageSpeed Insights API per URL

For each URL in the inventory (from Module 6), call the PageSpeed Insights API sequentially. Wait 1 second between calls.

API endpoint:
```
GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={ENCODED_URL}&strategy=mobile&key={PAGESPEED_API_KEY}
```

If `PAGESPEED_API_KEY` is empty, omit the `&key=` parameter entirely.

URL encoding: replace spaces with `%20`, encode the full absolute URL including `https://`.

**Error handling per URL:**

| Response | Action |
|---|---|
| HTTP 429 | Stop all further API calls; log every remaining URL as `P2 — PageSpeed API rate limited`; proceed to Step 3.5 |
| HTTP 4xx or 5xx | Log that URL as `P2 — PageSpeed API unreachable`; continue to next URL |
| Missing metric field in response | Skip that metric silently; do not flag it |

### Step 3.3: Extract metrics from API response

For each successful API response, extract:

| Metric | JSON path | Unit |
|---|---|---|
| LCP | `lighthouseResult.audits["largest-contentful-paint"].numericValue` | milliseconds |
| CLS | `lighthouseResult.audits["cumulative-layout-shift"].numericValue` | unitless |
| INP | `lighthouseResult.audits["interaction-to-next-paint"].numericValue` | milliseconds |
| Performance Score | `lighthouseResult.categories.performance.score × 100` | 0–100 |

### Step 3.4: Evaluate thresholds and assign severity

Apply these thresholds per metric. Generate one finding per failing metric per URL.

**LCP:**
- ≤ 2500ms → clean (no finding)
- 2501–4000ms → P2, issue: `LCP needs work: {value}ms`
- > 4000ms → P1, issue: `LCP poor: {value}ms (threshold 4000ms)`

**CLS:**
- ≤ 0.1 → clean
- 0.101–0.25 → P2, issue: `CLS needs work: {value}`
- > 0.25 → P1, issue: `CLS poor: {value} (threshold 0.25)`

**INP:**
- ≤ 200ms → clean
- 201–500ms → P2, issue: `INP needs work: {value}ms`
- > 500ms → P1, issue: `INP poor: {value}ms (threshold 500ms)`

**Performance Score:**
- ≥ 90 → clean
- 50–89 → P2, issue: `Performance score needs work: {value}`
- < 50 → P1, issue: `Performance score poor: {value}`

**Suggested fix mapping** (append to each finding's row in the report):

| Failing metric | Suggested fix |
|---|---|
| LCP | Check hero image size, lazy loading, and server response time |
| CLS | Set explicit width/height on images and embeds; avoid inserting content above the fold |
| INP | Reduce JavaScript blocking time; defer non-critical scripts |
| Performance score | Review Lighthouse opportunities tab for the largest wins |

**HARD CONSTRAINT — DO NOT AUTO-FIX PERFORMANCE ISSUES.**

All findings are logged only. Never modify code, configuration, images, or assets based on these results without explicit user approval.

### Step 3.5: Write performance-report.md

Overwrite `memory/tech-audit/performance-report.md` with:

```
# Performance Report — {YYYY-MM-DD HH:MM UTC}

| URL | LCP | CLS | INP | Score | Severity | Suggested Fix |
|-----|-----|-----|-----|-------|----------|---------------|
```

One row per **failing** URL. Pages where all metrics are clean are omitted.

Format values as:
- LCP and INP: `{value}ms` (round to nearest integer)
- CLS: `{value}` (round to 3 decimal places)
- Score: integer (e.g. `72`)
- Severity: worst severity across all failing metrics for that URL (`P1` takes precedence over `P2`)
- Suggested Fix: concatenate all fix strings for failing metrics on that page, separated by ` · `

**Severity key:** P1 = poor (immediate attention) · P2 = needs work (monitor)

---
````

- [ ] **Step 2.4: Update the Aggregator intro**

Find:

```
Run this after both modules complete.
```

Replace with:

```
Run this after all modules complete. Steps A.1–A.6 write findings and report to the user. Step A.7 sends a Discord notification.
```

- [ ] **Step 2.5: Update Step A.2 to include Module 3**

Find:

```
For each new finding from Module 1 and Module 2:
```

Replace with:

```
For each new finding from Module 1, Module 2, and Module 3:
```

- [ ] **Step 2.6: Update Step A.2 ID assignment to include Performance prefix**

Find:

```
- Health module findings: `H-{NNN}` where NNN is the next available 3-digit integer (e.g. `H-001`, `H-002`)
- SEO module findings: `S-{NNN}` (e.g. `S-001`, `S-002`)
- IDs are never reused.
```

Replace with:

```
- Health module findings: `H-{NNN}` where NNN is the next available 3-digit integer (e.g. `H-001`, `H-002`)
- SEO module findings: `S-{NNN}` (e.g. `S-001`, `S-002`)
- Performance module findings: `P-{NNN}` (e.g. `P-001`, `P-002`)
- IDs are never reused.
```

- [ ] **Step 2.7: Update Step A.4 audit-log format to include Performance**

Find:

```
- URLs checked: {N}
- Health findings: {N total} ({N new}, {N resolved})
- SEO findings: {N total} ({N new}, {N resolved})
- Open P1 issues: {N}
- Open P2 issues: {N}
```

Replace with:

```
- URLs checked: {N}
- Health findings: {N total} ({N new}, {N resolved})
- SEO findings: {N total} ({N new}, {N resolved})
- Performance findings: {N total} ({N new}, {N resolved})
- Open P1 issues: {N}
- Open P2 issues: {N}
```

- [ ] **Step 2.8: Update Step A.6 summary format**

Find:

```
Tech Audit Complete — {YYYY-MM-DD HH:MM UTC}
URLs checked: {N}
──────────────────────────────
Health:       {N issues} ({N new}, {N resolved})
Technical SEO: {N issues} ({N new}, {N resolved})
──────────────────────────────
Open P1: {N}   Open P2: {N}   INFO: {N}
──────────────────────────────
Reports written to memory/tech-audit/
Next scheduled run: tomorrow at 02:00 UTC
```

Replace with:

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

- [ ] **Step 2.9: Update Step A.6 header to note A.7 follows**

Find:

```
### Step A.6: Final Report to User

Print a run summary:
```

Replace with:

```
### Step A.6: Final Report to User

Print the run summary below, then proceed to Step A.7.
```

- [ ] **Step 2.10: Append Step A.7 to the end of the file**

Append the exact same Step A.7 block used in Task 1 Step 1.3 (identical content — do not paraphrase).

- [ ] **Step 2.11: Verify the file looks correct**

Read back the file and confirm:
- Module 3 is present between Module 2 and the Findings Aggregator
- Aggregator intro references A.7
- Step A.4 has Performance findings line
- Step A.6 has Performance line in summary table
- Step A.7 is present at the end

- [ ] **Step 2.12: Commit**

```bash
git add .claude/commands/tech-audit.md
git commit -m "feat: sync tech-audit command — add Module 3 + Step A.7 Discord alert"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** Step A.7 (7.1 read URL, 7.2 build payload, 7.3 POST) — all covered in Task 1. Color logic (green/red), P1 list format, failure isolation, skip-on-empty-URL — all covered.
- [x] **Placeholder scan:** No TBDs. All JSON, response tables, and log messages are fully written out.
- [x] **Sync coverage:** `.claude/commands/tech-audit.md` gets Module 3 (Steps 3.1–3.5), updated A.2, A.4, A.6, and new A.7 — matches SKILL.md completely.
- [x] **Type consistency:** No code types involved — all markdown. Step A.7 content is identical in both files.
