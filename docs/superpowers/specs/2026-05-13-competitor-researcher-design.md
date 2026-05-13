# Competitor Researcher — Design Spec
**Date:** 2026-05-13
**Project:** Shumaker Roofing
**Status:** Approved

---

## Overview

A new `/competitor-researcher` skill that pulls organic ranking data from Semrush for competitor domains, writes snapshots to `memory/seo/competitors.md`, and feeds competitive intelligence into the existing SEO pipeline. Two existing skills (`/keyword-researcher` and `/seo-project-manager`) are updated to consume this data.

This extends the SEO multi-agent system spec (`2026-05-13-seo-multi-agent-design.md`).

---

## New Skill: `/competitor-researcher [domain]`

### Trigger
```
/competitor-researcher example-roofing.com
/competitor-researcher domain1.com domain2.com   # multiple domains in one run
```
If no domain argument is given, the skill asks: "Which competitor domain(s) should I research?"

### Steps

1. **Read existing state** — load `memory/seo/competitors.md` (skip if absent) and `memory/seo/keywords.md`
2. **Pull organic rankings** — call `mcp__claude_ai_Semrush_MCP_server__organic_research` per domain, database `us`, top 50–100 organic keywords
3. **Filter to roofing-relevant** — keep keywords with roofing/home-services relevance; drop brand terms and unrelated rankings
4. **Identify gaps** — keywords the competitor ranks for (position ≤ 20) not already present in `keywords.md`
5. **Write snapshot** — append rows to `memory/seo/competitors.md` with today's date
6. **Report** — show top 10 competitor keywords by volume, gap list sorted by volume, one-line summary per domain

---

## New Memory File: `memory/seo/competitors.md`

### Header block
```
## Last Snapshots
- example-roofing.com: 2026-05-13 (47 keywords)
```
Updated on each run per domain.

### Table schema
```
| Domain | Keyword | Position | Volume | URL | Date |
|--------|---------|----------|--------|-----|------|
```

Rows are append-only — old snapshots stay as history so position changes are visible over time.

---

## Updated Skill: `/keyword-researcher`

### New Step 3.5 — Competitor gap injection (inserted between candidate generation and Semrush validation)

- Read `memory/seo/competitors.md` (skip step if file absent)
- Find gap keywords matching the current topic (keyword text overlaps with topic seed)
- Inject them into the candidate list, tagged `source: competitor`
- Competitor-sourced keywords are exempt from the "drop if Volume=0 with no local modifier" filter — if a competitor ranks for it, the traffic signal is real
- Injected gaps go through the same Semrush validation as LLM-generated candidates and compete for the final 12–16 slots

---

## Updated Skill: `/seo-project-manager`

After reading `keywords.md`, `qa-log.md`, and `content-log.md`, also read `competitors.md`. Add two new checks:

### Check 1 — Stale competitor data
If any domain snapshot is >30 days old:
> "Competitor data for example-roofing.com is 45 days old → run `/competitor-researcher example-roofing.com`"

### Check 2 — Unactioned gap keywords
If gap keywords exist in `competitors.md` that are not in `keywords.md`:
> "3 gap keywords found for 'metal roofing' cluster not yet researched → run `/keyword-researcher metal roofing`"

### First-time bootstrap
If `competitors.md` does not exist:
> "No competitor data found → run `/competitor-researcher [domain]` to bootstrap competitive intelligence"

---

## Updated Workflow

```
/competitor-researcher example-roofing.com
  → pulls top 50 organic keywords, finds 12 gaps
  → writes to memory/seo/competitors.md

/seo-project-manager
  → "Gap: 3 unactioned keywords in 'metal' cluster"
  → "Next: /keyword-researcher metal roofing"

/keyword-researcher metal roofing
  → generates 20 candidates (LLM) + injects 3 competitor gaps
  → Semrush-validates all 23, keeps top 14
  → writes to memory/seo/keywords.md

/seo-writer metal → /qa → /content-updater
  (unchanged)
```

---

## Unchanged Skills

`/seo-writer`, `/qa`, `/content-updater` — no changes needed; competitor context is not relevant at the writing/publishing stage.

`memory/seo/keywords.md` schema — competitor-sourced keywords use the same row format (Keyword, Intent, Cluster, Status, Date Added, Volume, KD). No new column needed.

---

## Out of Scope (This Phase)

- Side-by-side position comparison (our rank vs. competitor on the same keyword) — requires `rankings.md` to be populated first
- Automated monthly runs — use `/schedule` skill when needed
- Backlink research — Semrush `backlink_research` MCP tool; separate initiative
- PM summary view for more than 3 competitor domains
