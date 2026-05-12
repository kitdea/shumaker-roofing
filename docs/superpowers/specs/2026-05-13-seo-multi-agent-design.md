# SEO Multi-Agent System — Design Spec
**Date:** 2026-05-13
**Project:** Shumaker Roofing
**Status:** Approved

---

## Overview

A set of five independent Claude Code slash-command skills that form an SEO pipeline for the Shumaker Roofing Next.js + Contentful site. Each agent reads from and writes to a shared memory folder (`memory/seo/`) so work persists across sessions. The Content Updater publishes approved content directly to Contentful via the Management API.

Semrush integration for the Keyword Researcher is out of scope for this phase but planned as a future enhancement.

---

## File Structure

```
.claude/
  plugins/
    seo-agents/
      skills/
        seo-project-manager.md   → /seo-project-manager
        keyword-researcher.md    → /keyword-researcher
        seo-writer.md            → /seo-writer
        qa.md                    → /qa
        content-updater.md       → /content-updater

memory/seo/
  MEMORY.md          → index: total keywords, last publish date, last QA run
  keywords.md        → all researched keywords with status
  content-log.md     → published/updated content log
  qa-log.md          → QA pass/fail decisions
  rankings.md        → SEO score/position snapshots over time
```

---

## Agent Roles

### `/seo-project-manager`
- Reads all four memory files
- Identifies gaps: unclustered keywords, stale content (>90 days), failed QA items, pages with no target keyword
- Outputs a prioritized action plan: which agent to run next and on what target
- Does not write to memory (read-only coordinator)

### `/keyword-researcher [topic]`
- Accepts a topic or page slug as input
- Generates target keywords with search intent label: `informational`, `commercial`, `local`
- Groups keywords into named clusters (e.g. "residential", "metal", "emergency")
- Writes results to `memory/seo/keywords.md`
- Sets status to `researched`

### `/seo-writer [page-slug or keyword-cluster]`
- Reads matching keywords from `memory/seo/keywords.md`
- Fetches existing page content from Contentful Delivery API for context
- Drafts: SEO title, meta description, H1, H2 structure, body copy optimized for primary keyword
- Presents draft in conversation for review before QA
- Updates keyword status to `written`

### `/qa [draft or page-slug]`
- Runs draft through SEO checklist:
  - Primary keyword in title, H1, first 100 words
  - Meta description 120–160 characters
  - At least 2 internal links
  - No keyword stuffing (density < 3%)
  - H2s present and keyword-adjacent
  - Schema type appropriate for content type (Article for blog, Service for services)
- Logs result to `memory/seo/qa-log.md` with PASS/FAIL and specific issues
- Updates keyword status to `qa-passed` or `qa-failed`

### `/content-updater`
- Only runs on QA-PASS content
- Reads `CONTENTFUL_MANAGEMENT_TOKEN` and `CONTENTFUL_ENVIRONMENT` from `.env.local`
- For existing entries: `PUT /spaces/{id}/environments/{env}/entries/{entryId}` then `PUT .../published`
- For new blog entries: `POST` to create, then publish
- Supported content types: `blog`, `services`
- Logs action to `memory/seo/content-log.md`
- Updates keyword status to `published`

---

## Memory File Schemas

### `memory/seo/keywords.md`
```
| Keyword | Intent | Cluster | Status | Date Added |
|---------|--------|---------|--------|------------|
```
Status lifecycle: `researched` → `written` → `qa-passed` / `qa-failed` → `published`

### `memory/seo/content-log.md`
```
| Date | Page | Action | Contentful Entry ID | Agent Run |
|------|------|--------|---------------------|-----------|
```

### `memory/seo/qa-log.md`
```
| Date | Page | Result | Issues | Notes |
|------|------|--------|--------|-------|
```

### `memory/seo/rankings.md`
```
| Date | Page | Target Keyword | Position | Notes |
|------|------|----------------|----------|-------|
```

### `memory/seo/MEMORY.md`
One-line index entries pointing to each file, plus a summary line:
- Total keywords tracked
- Last content published (date + page)
- Last QA run (date + result)

---

## Environment Variables

Add to `.env.local` (never committed to git):
```
CONTENTFUL_MANAGEMENT_TOKEN=...   # Personal Access Token from Contentful → Settings → API Keys
CONTENTFUL_ENVIRONMENT=master
```

The Content Updater reads these at runtime via shell. Tokens never appear in skill files or memory files.

---

## Typical Workflow

```
/seo-project-manager
  → "Target: /blog/metal-roofing-cost — no keyword cluster assigned"

/keyword-researcher metal roofing cost
  → writes 12 keywords to memory/seo/keywords.md

/seo-writer metal
  → drafts blog post using "metal" cluster

/qa
  → PASS — logs to memory/seo/qa-log.md

/content-updater
  → publishes to Contentful, logs entry ID
```

---

## Out of Scope (This Phase)

- Semrush MCP integration for Keyword Researcher (planned next phase)
- Scheduled/automated pipeline runs
- BreadcrumbList, FAQPage schema injection (tracked in SEO audit backlog)
- Contact form backend
