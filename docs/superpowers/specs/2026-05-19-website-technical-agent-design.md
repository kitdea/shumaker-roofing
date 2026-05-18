# Website Technical Agent — Design Spec
**Date:** 2026-05-19
**Project:** Shumaker Roofing
**Status:** Approved

---

## Overview

A single scheduled Claude Code skill — `website-technical-agent` — that runs nightly as a cron job and on-demand as `/tech-audit`. Each run executes three modules sequentially: URL inventory (Module 6), Website Health (Module 1), and Technical SEO (Module 2). Results are written to `memory/tech-audit/` using the same memory-file pattern as the existing SEO agents.

Scope is intentionally limited to MVP: Modules 1, 2, and 6 only. Modules 3–5 (Performance/CWV, SEO Monitoring, Code Review) are out of scope for this phase.

---

## File Structure

```
.claude/plugins/
  website-technical-agent/
    skills/
      website-technical-agent.md    → /tech-audit (on-demand) + scheduled cron

memory/tech-audit/
  MEMORY.md             → index: last run date, open issue count, last clean run
  audit-log.md          → append-only run history
  health-report.md      → latest Module 1 output (overwritten each run)
  technical-seo.md      → latest Module 2 output (overwritten each run)
  findings.md           → deduplicated open issues with priority + status
```

---

## Trigger Model

- **Scheduled:** registered via `/schedule` as `0 2 * * *` (nightly 2am)
- **On-demand:** invocable as `/tech-audit` slash command for manual runs
- Same skill file drives both — no logic duplication

---

## Module Execution Order

```
START
  ↓
Module 6 — Fetch sitemap / build URL inventory
  ↓
Module 1 — Health check (HTTP status, CMS fields, dead links)
  ↓
Module 2 — Technical SEO checks (robots, sitemap, schema, meta, canonicals)
  ↓
Aggregate findings → memory/tech-audit/
END
```

---

## Module 6 — URL Inventory

Fetch the live sitemap at `/sitemap.xml`. Parse all `<loc>` entries into a URL list.

**Fallback if sitemap unreachable:** use a hardcoded route list:
```
/ /about /services /blog /service-areas /contact /privacy-policy /terms-and-conditions
+ all dynamic slugs fetched via Contentful Delivery API — content types: `services`, `blog`, `location`
```

The URL inventory is passed to Modules 1 and 2 as the shared input for all checks.

---

## Module 1 — Website Health

### Checks

| Check | Method |
|---|---|
| HTTP status | Fetch each URL; flag non-200 responses |
| Redirect chains | Detect 301/302 chains longer than 1 hop |
| Contentful field integrity | For dynamic routes, verify required fields exist (title, content, slug) via Contentful Delivery API |
| Missing images | Flag pages where `featuredImage` or `servicesImage` is null in Contentful |
| Dead internal links | Parse `<a href>` from fetched HTML; check each internal href |

### Severity mapping

| Finding | Severity |
|---|---|
| 404, 500 | P1 |
| Redirect chain > 1 hop | P2 |
| Missing required Contentful field | P1 |
| Missing image field | P2 |
| Dead internal link | P2 |

### Output: `memory/tech-audit/health-report.md`

```
| URL | Status | Issue | Severity |
|-----|--------|-------|----------|
| /services/storm-damage | 200 | OK | — |
| /blog/old-post | 404 | Not Found | P1 |
| /service-areas/columbus | 200 | Missing featuredImage | P2 |
```

---

## Module 2 — Technical SEO

### Checks

| Check | Method |
|---|---|
| `robots.txt` | Fetch `/robots.txt`; verify no critical paths blocked, sitemap URL present |
| Sitemap validity | Verify all sitemap URLs return 200, `lastmod` present |
| Meta tags | Verify `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:image` present and non-empty per page |
| Canonical tags | Verify `<link rel="canonical">` present; URL matches expected path (no trailing slash conflicts) |
| JSON-LD schema | Parse `<script type="application/ld+json">`; validate required fields by type: `LocalBusiness` (name, address, telephone), `Service` (name, provider), `Article` (headline, author, datePublished), `FAQPage` (questions array non-empty) |
| Noindex flags | Flag pages with `<meta name="robots" content="noindex">` — logged as INFO only, never auto-fixed |
| Duplicate titles | Detect pages sharing identical `<title>` values |
| Orphaned pages | Cross-reference sitemap URLs against internal links from Module 1; flag pages with zero inbound links |

### Severity mapping

| Finding | Severity |
|---|---|
| Missing meta title or description | P1 |
| Invalid or missing JSON-LD required field | P1 |
| Canonical mismatch | P2 |
| Missing OG tags | P2 |
| Duplicate title | P2 |
| robots.txt blocking critical path | P1 |
| Orphaned page | P2 |
| Noindex detected | INFO |

### Hard constraint

Noindex findings are always `INFO` severity — logged for visibility only. Never escalated or auto-fixed without explicit user approval. (See memory: `feedback_robots_meta.md`)

### Output: `memory/tech-audit/technical-seo.md`

```
| Check | URL | Finding | Severity |
|-------|-----|---------|----------|
| Meta description | /services/gutters | Missing | P1 |
| JSON-LD | /service-areas/dayton | LocalBusiness missing telephone | P1 |
| Canonical | /blog/metal-roofing | Canonical mismatch | P2 |
| Noindex | /about | noindex detected — logged only | INFO |
```

---

## Findings Aggregator

After both modules complete, consolidate into persistent tracking files.

### `memory/tech-audit/findings.md`

Deduplicated open issue tracker. Issues persist across runs; auto-resolved when a URL passes the same check on a subsequent run.

```
| ID | Module | URL | Issue | Severity | First Seen | Status |
|----|--------|-----|-------|----------|------------|--------|
| H-001 | Health | /blog/old-post | 404 Not Found | P1 | 2026-05-19 | open |
| S-001 | SEO | /services/gutters | Missing meta description | P1 | 2026-05-19 | open |
```

- ID prefix: `H-` for health findings, `S-` for SEO findings
- IDs are stable across runs
- Status transitions: `open` → `closed` (auto, when check passes) or `open` → `wont-fix` (manual)

### `memory/tech-audit/audit-log.md`

Append-only run history:

```
## 2026-05-19 02:00 UTC
- URLs checked: 47
- Health issues: 2 (1 new, 1 resolved)
- SEO issues: 5 (3 new, 2 resolved)
- Full report: health-report.md, technical-seo.md
```

### `memory/tech-audit/MEMORY.md`

Index updated each run:

```
- Last run: 2026-05-19 02:00 UTC
- Open issues: 7 (3 P1, 4 P2)
- Last clean run: never
```

---

## Environment Variables

No new env vars required. The agent reads existing variables from `.env.local`:
```
CONTENTFUL_SPACE_ID=...
CONTENTFUL_ACCESS_TOKEN=...
```

The site base URL (`https://shmakerroofing.com` or localhost for dev runs) is read from `NEXT_PUBLIC_SITE_URL` if set, otherwise inferred from the Next.js config.

---

## Out of Scope (This Phase)

- Module 3 — Performance / Core Web Vitals (Lighthouse CI)
- Module 4 — SEO Monitoring via Semrush (rankings, backlinks, competitor gaps)
- Module 5 — Code Review (auto PR review via GitHub API)
- Slack alerts
- GitHub Issue auto-creation
- Sentry / runtime error log integration
