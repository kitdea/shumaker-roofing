# Website Technical Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single scheduled Claude Code skill (`/tech-audit`) that nightly crawls the Shumaker Roofing site, checks website health (HTTP status, CMS field integrity, dead links) and technical SEO (meta tags, schema, canonicals, robots.txt), and writes structured findings to `memory/tech-audit/`.

**Architecture:** A single skill file drives both the nightly cron and on-demand `/tech-audit` invocations — no logic duplication. The skill executes three modules sequentially: Module 6 (URL inventory from sitemap), Module 1 (health checks), Module 2 (technical SEO checks). All output goes to markdown files in `memory/tech-audit/` using the same memory-file pattern as the existing SEO agents.

**Tech Stack:** Claude Code plugin system (SKILL.md), Contentful Delivery API (existing `CONTENTFUL_SPACE_ID` + `CONTENTFUL_ACCESS_TOKEN` env vars), `/schedule` skill for cron registration, HTTP fetch for page crawling.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\.claude-plugin\plugin.json` | Plugin manifest — name, version, description |
| Create | `C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\skills\website-technical-agent\SKILL.md` | Full skill instructions — all three modules |
| Modify | `C:\Users\franc\.claude\plugins\installed_plugins.json` | Register the new plugin as user-scoped |
| Create | `memory/tech-audit/MEMORY.md` | Index file — last run, open issues, last clean run |
| Create | `memory/tech-audit/findings.md` | Deduplicated open issue tracker |
| Create | `memory/tech-audit/audit-log.md` | Append-only run history |
| Create | `memory/tech-audit/health-report.md` | Latest Module 1 output (overwritten each run) |
| Create | `memory/tech-audit/technical-seo.md` | Latest Module 2 output (overwritten each run) |

---

## Task 1: Create Plugin Directory Structure and Manifest

**Files:**
- Create: `C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\.claude-plugin\plugin.json`

- [ ] **Step 1: Create the plugin directory tree**

Run in PowerShell:
```powershell
New-Item -ItemType Directory -Force "C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\.claude-plugin"
New-Item -ItemType Directory -Force "C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\skills\website-technical-agent"
```

Expected: no errors, directories created.

- [ ] **Step 2: Write plugin.json**

Create `C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\.claude-plugin\plugin.json`:

```json
{
  "name": "website-technical-agent",
  "description": "Nightly website health and technical SEO audit for Shumaker Roofing. Checks HTTP status, CMS field integrity, dead links, meta tags, schema, canonicals, and robots.txt. Writes findings to memory/tech-audit/.",
  "version": "1.0.0",
  "author": {
    "name": "Shumaker Roofing"
  }
}
```

- [ ] **Step 3: Verify file exists**

Run:
```powershell
Get-Content "C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\.claude-plugin\plugin.json"
```

Expected: JSON printed to terminal with `"name": "website-technical-agent"`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add website-technical-agent plugin manifest"
```

---

## Task 2: Write the SKILL.md — Module 6 (URL Inventory)

**Files:**
- Create: `C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\skills\website-technical-agent\SKILL.md`

This task writes the first section of the skill file. The skill file is built incrementally across Tasks 2–5 — each task appends a module. In this task, write the file header + Module 6.

- [ ] **Step 1: Create SKILL.md with header and Module 6**

Create `C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\skills\website-technical-agent\SKILL.md`:

```markdown
---
name: website-technical-agent
description: Use to run a full website health and technical SEO audit for Shumaker Roofing. Checks HTTP status, CMS field integrity, dead links, meta tags, schema, canonicals, and robots.txt. Writes findings to memory/tech-audit/. Run on-demand or triggered by nightly cron.
---

# Website Technical Agent

You are the Website Technical Agent for Shumaker Roofing. On each run you execute three modules sequentially: URL Inventory → Website Health → Technical SEO. Then you write all findings to `memory/tech-audit/`.

**Always read `memory/tech-audit/MEMORY.md` and `memory/tech-audit/findings.md` at the start of each run** so you can detect new vs. recurring issues.

---

## Module 6 — URL Inventory

Build the full URL list that Modules 1 and 2 will check.

### Step 6.1: Fetch Sitemap

Use WebFetch to fetch `{SITE_BASE_URL}/sitemap.xml`. Parse all `<loc>` entries. Store as the working URL list.

Determine `SITE_BASE_URL`:
1. Use `NEXT_PUBLIC_SITE_URL` env var if set
2. Otherwise use `https://www.shmakerroofing.com`

### Step 6.2: Fallback if Sitemap Unreachable

If the sitemap fetch fails (non-200 or parse error), build the URL list manually:

**Static routes:**
- `/`
- `/about`
- `/services`
- `/blog`
- `/service-areas`
- `/contact`
- `/privacy-policy`
- `/terms-and-conditions`

**Dynamic routes — fetch slugs from Contentful Delivery API:**

For each content type below, fetch all entries and extract slugs:

- `services` → slug via `slugify(fields.title)` → `/services/{slug}`
- `blog` → slug via `slugify(fields.title)` → `/blog/{slug}`
- `location` → slug via `fields.slug` → `/service-areas/{slug}`

Contentful Delivery API base URL: `https://cdn.contentful.com/spaces/{CONTENTFUL_SPACE_ID}/entries?content_type={type}&access_token={CONTENTFUL_ACCESS_TOKEN}`

### Step 6.3: Output

Log the total URL count: `"URL inventory: {N} URLs loaded"`. Pass the URL list to Modules 1 and 2.

---
```

- [ ] **Step 2: Verify file was created**

Run:
```powershell
Get-Content "C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\skills\website-technical-agent\SKILL.md" | Select-Object -First 5
```

Expected: frontmatter lines starting with `---` and `name: website-technical-agent`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add website-technical-agent skill — Module 6 URL inventory"
```

---

## Task 3: Write SKILL.md — Module 1 (Website Health)

**Files:**
- Modify: `C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\skills\website-technical-agent\SKILL.md`

Append Module 1 to the existing SKILL.md.

- [ ] **Step 1: Append Module 1 to SKILL.md**

Append the following to the end of SKILL.md:

```markdown
## Module 1 — Website Health

Run all checks against every URL in the inventory. Collect all findings into a list — do not stop on first error.

### Step 1.1: HTTP Status Check

For each URL, fetch it (follow redirects, track hop count). Record:
- Final HTTP status code
- Number of redirect hops (flag as P2 if > 1 hop)
- Flag 404 and 5xx as P1

### Step 1.2: Redirect Chain Detection

A redirect chain is any redirect sequence with more than 1 hop (A → B → C). Flag with severity P2 and note the full chain.

### Step 1.3: Contentful Field Integrity

For dynamic routes only (`/services/{slug}`, `/blog/{slug}`, `/service-areas/{slug}`):

Fetch the matching Contentful entry via Delivery API. Check:

| Content type | Required fields | Severity if missing |
|---|---|---|
| `services` | `title`, `servicesContent`, `slug` (derived) | P1 |
| `blog` | `title`, `date` or `publishedDate`, `featuredImage` | P1 for title; P2 for image |
| `location` | `title`, `slug` | P1 |

For `services`: also check `servicesImage` — flag null as P2.
For `blog`: also check `featuredImage` — flag null as P2.

### Step 1.4: Dead Internal Links

For each fetched page HTML (from Step 1.1), parse all `<a href="...">` tags. For any href that:
- Starts with `/` (internal link)
- Does not start with `#` (not an anchor)
- Is not `mailto:` or `tel:`

Check if that href is in the URL inventory. If not, fetch it and check the HTTP status. Flag 404s as P2.

### Step 1.5: Write health-report.md

Overwrite `memory/tech-audit/health-report.md` with the full results table:

```
# Health Report — {YYYY-MM-DD HH:MM UTC}

| URL | HTTP Status | Redirect Hops | Issue | Severity |
|-----|-------------|---------------|-------|----------|
```

One row per URL. For URLs with multiple issues, add one row per issue. For clean URLs, write `OK` in Issue and `—` in Severity.

**Severity key:** P1 = critical (404, 500, missing required CMS field) · P2 = warning (redirect chain, missing image, dead internal link) · — = clean

---
```

- [ ] **Step 2: Verify append succeeded**

Run:
```powershell
Select-String -Path "C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\skills\website-technical-agent\SKILL.md" -Pattern "Module 1"
```

Expected: match found with line number.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Module 1 website health checks to tech audit skill"
```

---

## Task 4: Write SKILL.md — Module 2 (Technical SEO)

**Files:**
- Modify: `C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\skills\website-technical-agent\SKILL.md`

Append Module 2 to the existing SKILL.md.

- [ ] **Step 1: Append Module 2 to SKILL.md**

Append the following to the end of SKILL.md:

```markdown
## Module 2 — Technical SEO

Run all SEO checks. Collect all findings — do not stop on first error.

### Step 2.1: robots.txt

Fetch `{SITE_BASE_URL}/robots.txt`. Check:
- File returns 200
- Sitemap URL is present (a line starting with `Sitemap:`)
- No `Disallow` rule blocks critical paths: `/`, `/services`, `/blog`, `/service-areas`, `/contact`

Flag blocked critical path as P1. Flag missing sitemap line as P2.

### Step 2.2: Sitemap Validity

For each URL in the sitemap (from Module 6):
- Verify it returns HTTP 200 (already known from Module 1 — reuse those results)
- Verify the `<lastmod>` element is present for each `<url>` entry

Flag missing `<lastmod>` as P2.

### Step 2.3: Meta Tags

For each fetched page HTML (reuse from Module 1 Step 1.1), check:

| Tag | Condition | Severity |
|---|---|---|
| `<title>` | Present and non-empty | P1 |
| `<meta name="description">` | Present and non-empty | P1 |
| `<meta property="og:title">` | Present and non-empty | P2 |
| `<meta property="og:description">` | Present and non-empty | P2 |
| `<meta property="og:image">` | Present and non-empty | P2 |

### Step 2.4: Canonical Tags

For each page, check:
- `<link rel="canonical" href="...">` is present — flag missing as P2
- The canonical `href` matches the expected URL for that page (same path, no unexpected trailing slash) — flag mismatch as P2

### Step 2.5: JSON-LD Schema

Parse all `<script type="application/ld+json">` blocks per page. For each block, validate required fields by `@type`:

| @type | Required fields | Severity if missing |
|---|---|---|
| `LocalBusiness` | `name`, `address`, `telephone` | P1 |
| `Service` | `name`, `provider` | P1 |
| `Article` | `headline`, `author`, `datePublished` | P1 |
| `FAQPage` | `mainEntity` array with at least 1 item | P1 |

Pages with no JSON-LD block at all: flag as P2 (not P1 — some pages legitimately have no schema).

### Step 2.6: Noindex Flags

**HARD CONSTRAINT — DO NOT AUTO-FIX NOINDEX.**

For each page, check for `<meta name="robots" content="noindex">` or any value containing `noindex`. If found:
- Log it as severity **INFO** only
- Never escalate to P1 or P2
- Never suggest or apply a fix without explicit user approval
- Include in report with note: `"noindex detected — logged only, no action taken"`

### Step 2.7: Duplicate Titles

Collect all `<title>` values across all pages. Flag any title that appears on 2 or more pages as P2. List all affected URLs in the finding.

### Step 2.8: Orphaned Pages

Cross-reference the sitemap URL list against all internal links collected in Module 1 Step 1.4. Any sitemap URL that has zero inbound internal links from other pages is orphaned. Flag as P2.

### Step 2.9: Write technical-seo.md

Overwrite `memory/tech-audit/technical-seo.md` with the full results table:

```
# Technical SEO Report — {YYYY-MM-DD HH:MM UTC}

| Check | URL | Finding | Severity |
|-------|-----|---------|----------|
```

One row per finding. Clean checks with no issues are omitted (unlike health-report.md which includes all URLs).

**Severity key:** P1 = critical · P2 = warning · INFO = informational only, no action needed

---
```

- [ ] **Step 2: Verify append succeeded**

Run:
```powershell
Select-String -Path "C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\skills\website-technical-agent\SKILL.md" -Pattern "Module 2"
```

Expected: match found.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Module 2 technical SEO checks to tech audit skill"
```

---

## Task 5: Write SKILL.md — Findings Aggregator and Run Summary

**Files:**
- Modify: `C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\skills\website-technical-agent\SKILL.md`

Append the aggregator and closing instructions.

- [ ] **Step 1: Append the Findings Aggregator section to SKILL.md**

Append the following to the end of SKILL.md:

```markdown
## Findings Aggregator

Run this after both modules complete.

### Step A.1: Load Existing findings.md

Read `memory/tech-audit/findings.md`. Parse the table into a list of existing findings. Each finding has: `ID`, `Module`, `URL`, `Issue`, `Severity`, `First Seen`, `Status`.

If the file does not exist yet, start with an empty list.

### Step A.2: Merge New Findings

For each new finding from Module 1 and Module 2:

1. Check if a finding with the same `Module` + `URL` + `Issue` combination already exists in the list.
   - **If it exists and is `open`:** keep it as-is (it's a recurring issue — do not change First Seen).
   - **If it exists and is `closed`:** reopen it — set status back to `open`, keep original ID.
   - **If it does not exist:** assign a new ID and add it.

ID assignment:
- Health module findings: `H-{NNN}` where NNN is the next available 3-digit integer (e.g. `H-001`, `H-002`)
- SEO module findings: `S-{NNN}` (e.g. `S-001`, `S-002`)
- IDs are never reused.

2. For each existing `open` finding NOT present in the current run's results: mark it `closed` (the issue resolved itself).

3. Do not modify findings with status `wont-fix` — leave them as-is regardless of current run results.

### Step A.3: Write findings.md

Overwrite `memory/tech-audit/findings.md` with the merged table:

```
# Open Findings — updated {YYYY-MM-DD HH:MM UTC}

| ID | Module | URL | Issue | Severity | First Seen | Status |
|----|--------|-----|-------|----------|------------|--------|
```

Sort order: P1 open → P2 open → INFO open → closed → wont-fix.

### Step A.4: Append to audit-log.md

Append a new entry to `memory/tech-audit/audit-log.md`:

```
## {YYYY-MM-DD HH:MM UTC}
- URLs checked: {N}
- Health findings: {N total} ({N new}, {N resolved})
- SEO findings: {N total} ({N new}, {N resolved})
- Open P1 issues: {N}
- Open P2 issues: {N}
```

If `memory/tech-audit/audit-log.md` does not exist, create it with a header line first:
```
# Audit Log — Shumaker Roofing Technical Agent
```

### Step A.5: Update MEMORY.md

Overwrite `memory/tech-audit/MEMORY.md` with:

```
# Tech Audit Memory

- Last run: {YYYY-MM-DD HH:MM UTC}
- Open issues: {N total} ({N P1}, {N P2})
- Last clean run: {date of last run with 0 open issues, or "never"}
```

### Step A.6: Final Report to User

Print a run summary:

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

If there are any P1 issues, list them explicitly after the summary table:

```
⚠ P1 Issues Requiring Attention:
- [H-001] /blog/old-post — 404 Not Found
- [S-001] /services/gutters — Missing meta description
```
```

- [ ] **Step 2: Verify full skill file structure**

Run:
```powershell
Select-String -Path "C:\Users\franc\.claude\plugins\cache\local\website-technical-agent\1.0.0\skills\website-technical-agent\SKILL.md" -Pattern "^## Module|^## Findings"
```

Expected output (4 matches):
```
## Module 6 — URL Inventory
## Module 1 — Website Health
## Module 2 — Technical SEO
## Findings Aggregator
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add findings aggregator and run summary to tech audit skill"
```

---

## Task 6: Register Plugin in installed_plugins.json

**Files:**
- Modify: `C:\Users\franc\.claude\plugins\installed_plugins.json`

- [ ] **Step 1: Read current installed_plugins.json**

Read `C:\Users\franc\.claude\plugins\installed_plugins.json` to see current content before editing.

- [ ] **Step 2: Add the new plugin entry**

In `installed_plugins.json`, inside the `"plugins"` object, add this key after the `"seo-agents@local"` entry:

```json
"website-technical-agent@local": [
  {
    "scope": "user",
    "installPath": "C:\\Users\\franc\\.claude\\plugins\\cache\\local\\website-technical-agent\\1.0.0",
    "version": "1.0.0",
    "installedAt": "2026-05-19T00:00:00.000Z",
    "lastUpdated": "2026-05-19T00:00:00.000Z"
  }
]
```

- [ ] **Step 3: Verify JSON is valid**

Run:
```powershell
Get-Content "C:\Users\franc\.claude\plugins\installed_plugins.json" | ConvertFrom-Json | Select-Object -ExpandProperty plugins | Get-Member -MemberType NoteProperty | Select-Object Name
```

Expected: list of plugin names including `website-technical-agent@local`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: register website-technical-agent plugin in installed_plugins.json"
```

---

## Task 7: Initialize memory/tech-audit/ Files

**Files:**
- Create: `memory/tech-audit/MEMORY.md`
- Create: `memory/tech-audit/findings.md`
- Create: `memory/tech-audit/audit-log.md`
- Create: `memory/tech-audit/health-report.md`
- Create: `memory/tech-audit/technical-seo.md`

All paths are relative to `c:\Users\franc\Documents\shumaker-roofing\`.

- [ ] **Step 1: Create memory/tech-audit/MEMORY.md**

```markdown
# Tech Audit Memory

- Last run: never
- Open issues: 0
- Last clean run: never
```

- [ ] **Step 2: Create memory/tech-audit/findings.md**

```markdown
# Open Findings

| ID | Module | URL | Issue | Severity | First Seen | Status |
|----|--------|-----|-------|----------|------------|--------|
```

- [ ] **Step 3: Create memory/tech-audit/audit-log.md**

```markdown
# Audit Log — Shumaker Roofing Technical Agent
```

- [ ] **Step 4: Create memory/tech-audit/health-report.md**

```markdown
# Health Report

No audit has been run yet. Trigger `/tech-audit` or wait for the nightly cron.
```

- [ ] **Step 5: Create memory/tech-audit/technical-seo.md**

```markdown
# Technical SEO Report

No audit has been run yet. Trigger `/tech-audit` or wait for the nightly cron.
```

- [ ] **Step 6: Commit**

```bash
git add memory/tech-audit/
git commit -m "feat: initialize memory/tech-audit/ files for website technical agent"
```

---

## Task 8: Register Nightly Cron via /schedule

This task registers the nightly cron job. It is a conversational step — not a code change.

- [ ] **Step 1: Invoke the /schedule skill**

In a Claude Code session, run:
```
/schedule
```

When prompted, provide:
- **Schedule:** `0 2 * * *` (nightly at 2am UTC)
- **Skill/prompt:** `Run /tech-audit — execute the website-technical-agent skill. Run all three modules (URL inventory, website health, technical SEO), write all findings to memory/tech-audit/, and print the run summary.`
- **Label:** `Nightly site health + technical SEO audit`

- [ ] **Step 2: Verify the schedule was created**

Run `/schedule` again and confirm the new routine appears in the list with the correct cron expression.

- [ ] **Step 3: Run a manual test**

Run:
```
/tech-audit
```

Verify:
- The skill executes without errors
- `memory/tech-audit/health-report.md` is overwritten with a real results table
- `memory/tech-audit/technical-seo.md` is overwritten with real findings
- `memory/tech-audit/findings.md` is updated
- `memory/tech-audit/audit-log.md` has a new appended entry
- `memory/tech-audit/MEMORY.md` shows the current run date

- [ ] **Step 4: Commit any memory file changes from the test run**

```bash
git add memory/tech-audit/
git commit -m "chore: first /tech-audit run — initial audit results"
```

---

## Spec Coverage Self-Review

| Spec requirement | Task |
|---|---|
| Single skill file drives both cron and on-demand | Tasks 2–5 (one SKILL.md) |
| Module 6: sitemap fetch + Contentful fallback | Task 2 |
| Module 1: HTTP status, redirect chains | Task 3 Step 1.1–1.2 |
| Module 1: Contentful field integrity | Task 3 Step 1.3 |
| Module 1: Dead internal links | Task 3 Step 1.4 |
| Module 1: health-report.md output | Task 3 Step 1.5 |
| Module 2: robots.txt | Task 4 Step 2.1 |
| Module 2: sitemap validity | Task 4 Step 2.2 |
| Module 2: meta tags | Task 4 Step 2.3 |
| Module 2: canonical tags | Task 4 Step 2.4 |
| Module 2: JSON-LD schema validation | Task 4 Step 2.5 |
| Module 2: noindex — INFO only, no auto-fix | Task 4 Step 2.6 |
| Module 2: duplicate titles | Task 4 Step 2.7 |
| Module 2: orphaned pages | Task 4 Step 2.8 |
| Module 2: technical-seo.md output | Task 4 Step 2.9 |
| Findings aggregator: deduplication, stable IDs, auto-close | Task 5 |
| audit-log.md append-only | Task 5 Step A.4 |
| MEMORY.md index | Task 5 Step A.5 |
| memory/tech-audit/ initialized | Task 7 |
| Plugin registered in installed_plugins.json | Task 6 |
| Nightly cron registered | Task 8 |
| On-demand `/tech-audit` tested | Task 8 Step 3 |
