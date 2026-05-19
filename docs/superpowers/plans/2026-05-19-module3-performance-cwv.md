# Module 3 — Performance / Core Web Vitals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the existing `tech-audit` skill with a Module 3 section that calls the PageSpeed Insights API for every URL in the audit inventory, evaluates Core Web Vitals against Google's standard thresholds, and writes findings to `memory/tech-audit/performance-report.md` and the shared `findings.md` tracker using `P-` prefix IDs.

**Architecture:** Module 3 is inserted into the existing skill file between Module 2 and the Findings Aggregator — no new files, no new cron, no new plugin. The skill file is a plain markdown document read by Claude at runtime; there are no tests in the traditional sense. Verification is done by running `/tech-audit` and inspecting the output files. Both `tech-audit.md` and `tech-audit/SKILL.md` are kept in sync (they are identical files in two locations).

**Tech Stack:** Claude Code skill (SKILL.md), PageSpeed Insights API v5 (WebFetch), `.env.local` for `PAGESPEED_API_KEY`.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Modify | `.claude/plugins/website-technical-agent/skills/tech-audit.md` | Insert Module 3 section before `## Findings Aggregator` |
| Modify | `.claude/plugins/website-technical-agent/skills/tech-audit/SKILL.md` | Mirror identical insert |
| Create | `memory/tech-audit/performance-report.md` | Initialize empty placeholder; overwritten on each run |
| Modify | `.env.local` | Add `PAGESPEED_API_KEY=...` line |

---

## Task 1: Add PAGESPEED_API_KEY to .env.local

**Files:**
- Modify: `.env.local`

- [ ] **Step 1: Read .env.local to see current content**

Read `.env.local` so you know exactly what's there before editing.

- [ ] **Step 2: Append the new env var**

Add this line at the end of `.env.local`:

```
PAGESPEED_API_KEY=your_google_api_key_here
```

Leave the value as the literal placeholder string for now — the user will fill it in. Do not invent or generate a key.

- [ ] **Step 3: Verify the line was added**

Run:
```powershell
Select-String -Path ".env.local" -Pattern "PAGESPEED_API_KEY"
```

Expected: one match with the line you just added.

- [ ] **Step 4: Commit**

```bash
git add .env.local
git commit -m "chore: add PAGESPEED_API_KEY placeholder to .env.local"
```

---

## Task 2: Initialize performance-report.md

**Files:**
- Create: `memory/tech-audit/performance-report.md`

- [ ] **Step 1: Create the file**

Create `memory/tech-audit/performance-report.md` with this content:

```markdown
# Performance Report

No audit has been run yet. Trigger `/tech-audit` or wait for the nightly cron.
```

- [ ] **Step 2: Verify the file exists**

Run:
```powershell
Get-Content "memory/tech-audit/performance-report.md"
```

Expected: the two lines above.

- [ ] **Step 3: Commit**

```bash
git add memory/tech-audit/performance-report.md
git commit -m "feat: initialize memory/tech-audit/performance-report.md"
```

---

## Task 3: Insert Module 3 into tech-audit.md

**Files:**
- Modify: `.claude/plugins/website-technical-agent/skills/tech-audit.md`

Module 3 is inserted **between** the end of Module 2 (the `### Step 2.9` section) and `## Findings Aggregator`. In the current file, `## Findings Aggregator` appears at line 199. The insertion is done by replacing the `## Findings Aggregator` heading with the full Module 3 block followed by `## Findings Aggregator`.

- [ ] **Step 1: Read the file to confirm current state**

Read `.claude/plugins/website-technical-agent/skills/tech-audit.md` lines 195–205 to confirm `## Findings Aggregator` is still at the expected location.

- [ ] **Step 2: Insert Module 3 before the Findings Aggregator**

In `.claude/plugins/website-technical-agent/skills/tech-audit.md`, find the exact string:

```
## Findings Aggregator
```

Replace it with the full Module 3 block plus the heading:

```markdown
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
- Severity: `P1` or `P2`
- Suggested Fix: concatenate all fix strings for failing metrics on that page, separated by ` · `

Example row:
```
| /blog/metal-roofing | 5100ms | 0.31 | 620ms | 41 | P1 | LCP: check hero image size · CLS: set explicit dimensions · INP: defer non-critical scripts |
```

**Severity key:** P1 = poor (immediate attention) · P2 = needs work (monitor)

---

## Findings Aggregator
```

- [ ] **Step 3: Verify the insertion**

Run:
```powershell
Select-String -Path ".claude/plugins/website-technical-agent/skills/tech-audit.md" -Pattern "^## Module 3"
```

Expected: one match found.

Run:
```powershell
Select-String -Path ".claude/plugins/website-technical-agent/skills/tech-audit.md" -Pattern "^## Findings Aggregator"
```

Expected: one match found (confirming it wasn't removed).

- [ ] **Step 4: Commit**

```bash
git add .claude/plugins/website-technical-agent/skills/tech-audit.md
git commit -m "feat: add Module 3 Performance/CWV to tech-audit skill"
```

---

## Task 4: Mirror the same change in SKILL.md

**Files:**
- Modify: `.claude/plugins/website-technical-agent/skills/tech-audit/SKILL.md`

This file is identical to `tech-audit.md`. Apply the exact same insertion.

- [ ] **Step 1: Read SKILL.md to confirm current state**

Read `.claude/plugins/website-technical-agent/skills/tech-audit/SKILL.md` lines 195–205 to confirm `## Findings Aggregator` is present at the expected location.

- [ ] **Step 2: Apply the identical insertion**

In `.claude/plugins/website-technical-agent/skills/tech-audit/SKILL.md`, find:

```
## Findings Aggregator
```

Replace it with the exact same full Module 3 block used in Task 3 Step 2, ending with:

```markdown
---

## Findings Aggregator
```

- [ ] **Step 3: Verify both files are now in sync**

Run:
```powershell
$a = (Get-Content ".claude/plugins/website-technical-agent/skills/tech-audit.md" -Raw)
$b = (Get-Content ".claude/plugins/website-technical-agent/skills/tech-audit/SKILL.md" -Raw)
if ($a -eq $b) { "FILES ARE IN SYNC" } else { "FILES DIFFER — fix before committing" }
```

Expected: `FILES ARE IN SYNC`

- [ ] **Step 4: Commit**

```bash
git add .claude/plugins/website-technical-agent/skills/tech-audit/SKILL.md
git commit -m "feat: mirror Module 3 Performance/CWV into SKILL.md"
```

---

## Task 5: Update the Findings Aggregator — add P- prefix support

**Files:**
- Modify: `.claude/plugins/website-technical-agent/skills/tech-audit.md`
- Modify: `.claude/plugins/website-technical-agent/skills/tech-audit/SKILL.md`

The Findings Aggregator already handles `H-` and `S-` prefixes. It needs to also handle `P-` findings from Module 3, update the audit-log entry, and update the run summary format.

- [ ] **Step 1: Read the Findings Aggregator section**

Read `.claude/plugins/website-technical-agent/skills/tech-audit.md` from the `## Findings Aggregator` heading to the end of the file. Understand the existing Step A.2 ID assignment rules and Step A.4/A.6 output formats.

- [ ] **Step 2: Update Step A.2 — ID assignment**

In `tech-audit.md`, find the ID assignment block inside Step A.2:

```
ID assignment:
- Health module findings: `H-{NNN}` where NNN is the next available 3-digit integer (e.g. `H-001`, `H-002`)
- SEO module findings: `S-{NNN}` (e.g. `S-001`, `S-002`)
- IDs are never reused.
```

Replace it with:

```
ID assignment:
- Health module findings: `H-{NNN}` where NNN is the next available 3-digit integer (e.g. `H-001`, `H-002`)
- SEO module findings: `S-{NNN}` (e.g. `S-001`, `S-002`)
- Performance module findings: `P-{NNN}` (e.g. `P-001`, `P-002`)
- IDs are never reused.
```

- [ ] **Step 3: Update Step A.4 — audit-log.md format**

Find the audit-log append block in Step A.4:

```
## {YYYY-MM-DD HH:MM UTC}
- URLs checked: {N}
- Health findings: {N total} ({N new}, {N resolved})
- SEO findings: {N total} ({N new}, {N resolved})
- Open P1 issues: {N}
- Open P2 issues: {N}
```

Replace it with:

```
## {YYYY-MM-DD HH:MM UTC}
- URLs checked: {N}
- Health findings: {N total} ({N new}, {N resolved})
- SEO findings: {N total} ({N new}, {N resolved})
- Performance findings: {N total} ({N new}, {N resolved})
- Open P1 issues: {N}
- Open P2 issues: {N}
```

- [ ] **Step 4: Update Step A.6 — run summary format**

Find the run summary block in Step A.6:

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

Replace it with:

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

- [ ] **Step 5: Apply the identical changes to SKILL.md**

Repeat Steps 2–4 for `.claude/plugins/website-technical-agent/skills/tech-audit/SKILL.md`.

- [ ] **Step 6: Verify both files are in sync**

```powershell
$a = (Get-Content ".claude/plugins/website-technical-agent/skills/tech-audit.md" -Raw)
$b = (Get-Content ".claude/plugins/website-technical-agent/skills/tech-audit/SKILL.md" -Raw)
if ($a -eq $b) { "FILES ARE IN SYNC" } else { "FILES DIFFER — fix before committing" }
```

Expected: `FILES ARE IN SYNC`

- [ ] **Step 7: Commit**

```bash
git add .claude/plugins/website-technical-agent/skills/tech-audit.md .claude/plugins/website-technical-agent/skills/tech-audit/SKILL.md
git commit -m "feat: update findings aggregator to support P- performance findings"
```

---

## Task 6: Update the nightly cron prompt

**Files:**
- Remote routine `trig_017oWddwrmehfQD54HTsyYYv` (via RemoteTrigger API)

The nightly cron prompt registered earlier references Modules 1 and 2 only. It needs a Module 3 line so the remote agent knows to run the performance checks.

- [ ] **Step 1: Read the current routine**

Use `RemoteTrigger` with `action: "get"` and `trigger_id: "trig_017oWddwrmehfQD54HTsyYYv"` to read the current prompt.

- [ ] **Step 2: Update the prompt**

Use `RemoteTrigger` with `action: "update"` and `trigger_id: "trig_017oWddwrmehfQD54HTsyYYv"`. In the updated prompt, replace the module list:

Old:
```
1. Module 6 — URL Inventory: ...
2. Module 1 — Website Health: ...
3. Module 2 — Technical SEO: ...
4. Findings Aggregator: ...
```

New (add Module 3 between Module 2 and Findings Aggregator):
```
1. Module 6 — URL Inventory: fetch https://www.shumakerroofing.com/sitemap.xml and parse all <loc> URLs. If unreachable, fall back to static routes + Contentful Delivery API slugs.
2. Module 1 — Website Health: HTTP status check, redirect chain detection, Contentful field integrity (services/blog/location entries), dead internal links. Write results to memory/tech-audit/health-report.md.
3. Module 2 — Technical SEO: robots.txt, sitemap validity, meta tags, canonical tags, JSON-LD schema validation, noindex flags (INFO only — never auto-fix), duplicate titles, orphaned pages. Write results to memory/tech-audit/technical-seo.md.
4. Module 3 — Performance/CWV: call PageSpeed Insights API (mobile strategy) for each URL sequentially with 1s delay. Read PAGESPEED_API_KEY from .env.local (anonymous tier if missing). Evaluate LCP/CLS/INP/Score against Google thresholds. Write results to memory/tech-audit/performance-report.md.
5. Findings Aggregator: merge new findings into memory/tech-audit/findings.md (deduplicated, stable IDs H-NNN / S-NNN / P-NNN), append run summary to memory/tech-audit/audit-log.md, update memory/tech-audit/MEMORY.md.
```

- [ ] **Step 3: Verify the update succeeded**

Use `RemoteTrigger` with `action: "get"` and `trigger_id: "trig_017oWddwrmehfQD54HTsyYYv"` and confirm the new prompt contains "Module 3".

---

## Task 7: Manual Test Run

- [ ] **Step 1: Trigger a manual run of /tech-audit**

In a Claude Code session in the project directory, run:
```
/tech-audit
```

- [ ] **Step 2: Verify performance-report.md was written**

Check that `memory/tech-audit/performance-report.md` now contains a results table with a timestamp header (not the "No audit has been run yet" placeholder).

- [ ] **Step 3: Verify findings.md contains P- entries**

```powershell
Select-String -Path "memory/tech-audit/findings.md" -Pattern "^\| P-"
```

Expected: one or more `P-` rows (or zero rows if all pages pass — both are valid).

- [ ] **Step 4: Verify audit-log.md has a Performance line**

```powershell
Select-String -Path "memory/tech-audit/audit-log.md" -Pattern "Performance findings"
```

Expected: one match in the latest run entry.

- [ ] **Step 5: Commit memory file updates from the test run**

```bash
git add memory/tech-audit/
git commit -m "chore: first /tech-audit run with Module 3 — initial performance results"
```

---

## Spec Coverage Self-Review

| Spec requirement | Task |
|---|---|
| Module 3 appended to existing skill file | Task 3 |
| Runs after Module 2, before Findings Aggregator | Task 3 (insertion point) |
| PageSpeed Insights API, mobile strategy | Task 3 Step 3.2 |
| Sequential calls with 1s delay | Task 3 Step 3.2 |
| PAGESPEED_API_KEY from .env.local, anonymous fallback | Task 1, Task 3 Step 3.1 |
| LCP/CLS/INP/Score extraction from API response | Task 3 Step 3.3 |
| Google standard thresholds, P1/P2 severity | Task 3 Step 3.4 |
| Suggested fix mapping per metric | Task 3 Step 3.4 |
| HTTP 429 → stop + log remaining as P2 | Task 3 Step 3.2 |
| HTTP 4xx/5xx → log URL as P2, continue | Task 3 Step 3.2 |
| Missing metric → skip silently | Task 3 Step 3.2 |
| performance-report.md initialized | Task 2 |
| performance-report.md overwritten each run | Task 3 Step 3.5 |
| P- prefix in findings.md | Task 5 Step 2 |
| audit-log.md gains Performance line | Task 5 Step 3 |
| Run summary gains Performance line | Task 5 Step 4 |
| Both skill files kept in sync | Task 3 Step 3, Task 4 Step 3 |
| Nightly cron prompt updated | Task 6 |
| Hard constraint: no auto-fix | Task 3 Step 3.4 (logged only) |
