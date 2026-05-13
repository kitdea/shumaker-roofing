# Competitor Researcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/competitor-researcher` skill that pulls Semrush organic rankings for competitor domains, identifies keyword gaps, and feeds that intelligence into the existing `/keyword-researcher` and `/seo-project-manager` skills.

**Architecture:** Three deliverables — a new skill, a new memory file, and light updates to two existing skills. All communication between skills happens through `memory/seo/competitors.md`. No code; all files are markdown skill documents.

**Tech Stack:** Claude Code slash-command skills, Semrush MCP (`mcp__claude_ai_Semrush_MCP_server__organic_research`), shared `memory/seo/` file store.

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `memory/seo/competitors.md` | Persistent competitor keyword snapshots |
| Create | `.claude/plugins/seo-agents/skills/competitor-researcher.md` | Skill source (plugin location) |
| Create | `.claude/plugins/seo-agents/skills/competitor-researcher/SKILL.md` | Skill source (directory form) |
| Create | `.claude/commands/competitor-researcher.md` | Skill source (commands location) |
| Modify | `.claude/plugins/seo-agents/skills/keyword-researcher.md` | Add Step 3.5 competitor gap injection |
| Modify | `.claude/plugins/seo-agents/skills/keyword-researcher/SKILL.md` | Same |
| Modify | `.claude/commands/keyword-researcher.md` | Same |
| Modify | `.claude/plugins/seo-agents/skills/seo-project-manager.md` | Add competitor checks to Step 1 and Step 2 |
| Modify | `.claude/plugins/seo-agents/skills/seo-project-manager/SKILL.md` | Same |
| Modify | `.claude/commands/seo-project-manager.md` | Same |
| Modify | `memory/seo/MEMORY.md` | Add competitors.md to file index |

---

## Task 1: Bootstrap `memory/seo/competitors.md`

**Files:**
- Create: `memory/seo/competitors.md`

- [ ] **Step 1: Create the file**

Write `memory/seo/competitors.md` with this exact content:

```markdown
# Competitor Tracker

## Last Snapshots
_(none yet — run `/competitor-researcher [domain]` to bootstrap)_

| Domain | Keyword | Position | Volume | URL | Gap | Date |
|--------|---------|----------|--------|-----|-----|------|
```

- [ ] **Step 2: Verify**

Open the file and confirm:
- Header `# Competitor Tracker` is present
- `## Last Snapshots` section is present
- Table has columns: Domain, Keyword, Position, Volume, URL, Gap, Date

- [ ] **Step 3: Commit**

```bash
git add memory/seo/competitors.md
git commit -m "feat: add competitors.md memory file"
```

---

## Task 2: Create `/competitor-researcher` skill

**Files:**
- Create: `.claude/plugins/seo-agents/skills/competitor-researcher.md`
- Create: `.claude/plugins/seo-agents/skills/competitor-researcher/SKILL.md`
- Create: `.claude/commands/competitor-researcher.md`

All three files get identical content.

- [ ] **Step 1: Write the skill content**

Create `.claude/plugins/seo-agents/skills/competitor-researcher.md` with:

```markdown
---
name: competitor-researcher
description: Use when you want to analyze what keywords competitor roofing domains rank for. Pass one or more domains as arguments (e.g. /competitor-researcher example.com). Pulls Semrush organic rankings, identifies keyword gaps vs Shumaker's current targets, and writes snapshots to memory/seo/competitors.md.
---

# Competitor Researcher

You are the Competitor Intelligence agent for Shumaker Roofing. Your job is to pull organic ranking data for competitor domains from Semrush, identify keyword gaps, and write the results to memory.

## Context

Shumaker Roofing serves: Maryland, Virginia, Pennsylvania, West Virginia.
Services: residential roofing, commercial roofing, metal roofing, roof replacement, roof repair, storm damage, gutters, siding.

## Step 1: Read Existing State

Read these two files in full:
- `memory/seo/competitors.md` — existing competitor snapshots (skip if absent)
- `memory/seo/keywords.md` — keywords Shumaker already targets

## Step 2: Identify Competitor Domains

The domain(s) are the argument(s) passed to this skill (e.g. "example-roofing.com", "domain1.com domain2.com").
If no argument was given, ask: "Which competitor domain(s) should I research?"

## Step 3: Pull Organic Rankings from Semrush

For each competitor domain, call:

```
mcp__claude_ai_Semrush_MCP_server__organic_research({
  domain: "[competitor-domain]",
  database: "us",
  display_limit: 100
})
```

Extract for each keyword returned:
- **Keyword**: the search phrase
- **Position**: organic rank (integer)
- **Volume**: monthly US search volume
- **URL**: the ranking page URL

## Step 4: Filter to Roofing-Relevant Keywords

Keep only keywords relevant to roofing or home services. Drop:
- Brand name keywords (containing the competitor's company name)
- Unrelated keywords (generic home improvement unrelated to roofing)
- Keywords where Position > 20

## Step 5: Identify Gaps

A gap keyword is one that:
- The competitor ranks for (position ≤ 20 after filtering)
- Does NOT already appear in `memory/seo/keywords.md`

Mark each retained keyword as `gap` or `targeted` based on this check.

## Step 6: Write Snapshot to Memory

Update the `## Last Snapshots` section — replace the existing line for this domain (or add if new):
```
- [domain]: [today's date YYYY-MM-DD] ([N] keywords, [G] gaps)
```

Append new rows for all roofing-relevant keywords from this run:
```
| [domain] | [keyword] | [position] | [volume] | [url] | gap/targeted | [today's date] |
```

Do NOT delete old rows — they are historical snapshots.

## Step 7: Report

Show the user:
1. **Top 10 by volume** — competitor's highest-volume keywords (gap and targeted)
2. **Gap list** — all gap keywords sorted by volume descending
3. **Summary per domain** — total keywords pulled, total gaps found

End with:
```
✓ Snapshot written to memory/seo/competitors.md
Gap keywords available for: /keyword-researcher [topic]
Next step: /seo-project-manager (to see gaps surfaced in action plan)
```
```

- [ ] **Step 2: Copy to the two remaining locations**

Copy the exact same content to:
- `.claude/plugins/seo-agents/skills/competitor-researcher/SKILL.md` (create the directory if needed)
- `.claude/commands/competitor-researcher.md`

- [ ] **Step 3: Verify all three files exist and match**

Confirm each file starts with `---` frontmatter and contains all 7 steps.

- [ ] **Step 4: Commit**

```bash
git add .claude/plugins/seo-agents/skills/competitor-researcher.md
git add ".claude/plugins/seo-agents/skills/competitor-researcher/SKILL.md"
git add .claude/commands/competitor-researcher.md
git commit -m "feat: add /competitor-researcher skill"
```

---

## Task 3: Update `/keyword-researcher` — add Step 3.5

**Files:**
- Modify: `.claude/plugins/seo-agents/skills/keyword-researcher.md`
- Modify: `.claude/plugins/seo-agents/skills/keyword-researcher/SKILL.md`
- Modify: `.claude/commands/keyword-researcher.md`

- [ ] **Step 1: Insert Step 3.5 into the first file**

In `.claude/plugins/seo-agents/skills/keyword-researcher.md`, find the line:

```
## Step 4: Semrush Validation
```

Insert the following block immediately before it:

```markdown
## Step 3.5: Competitor Gap Injection

Read `memory/seo/competitors.md`. If the file does not exist or has no rows, skip this step.

Find rows where:
- `Gap` column = `gap`
- The keyword text overlaps with the current topic (e.g. topic "metal roofing" → look for rows containing "metal" or "roof")

Add all matching gap keywords to the candidate list. These proceed into Step 4 (Semrush validation) alongside the LLM-generated candidates.

**Filter override:** Competitor-sourced gap keywords bypass the "drop if Volume=0 with no local modifier" rule in Step 4. If a competitor ranks for it, the traffic signal is real regardless of national database reporting.

```

- [ ] **Step 2: Apply the same change to the two remaining files**

Insert the identical Step 3.5 block into:
- `.claude/plugins/seo-agents/skills/keyword-researcher/SKILL.md`
- `.claude/commands/keyword-researcher.md`

- [ ] **Step 3: Verify**

In each of the three files, confirm:
- `## Step 3.5: Competitor Gap Injection` section exists
- It appears between `## Step 3` and `## Step 4`
- The filter override rule is present

- [ ] **Step 4: Commit**

```bash
git add .claude/plugins/seo-agents/skills/keyword-researcher.md
git add ".claude/plugins/seo-agents/skills/keyword-researcher/SKILL.md"
git add .claude/commands/keyword-researcher.md
git commit -m "feat: inject competitor gap keywords into keyword-researcher candidates"
```

---

## Task 4: Update `/seo-project-manager` — add competitor checks

**Files:**
- Modify: `.claude/plugins/seo-agents/skills/seo-project-manager.md`
- Modify: `.claude/plugins/seo-agents/skills/seo-project-manager/SKILL.md`
- Modify: `.claude/commands/seo-project-manager.md`

- [ ] **Step 1: Update Step 1 file list in the first file**

In `.claude/plugins/seo-agents/skills/seo-project-manager.md`, find:

```
Read these four files in full:
- `memory/seo/keywords.md`
- `memory/seo/content-log.md`
- `memory/seo/qa-log.md`
- `memory/seo/rankings.md`
```

Replace with:

```
Read these files in full:
- `memory/seo/keywords.md`
- `memory/seo/content-log.md`
- `memory/seo/qa-log.md`
- `memory/seo/rankings.md`
- `memory/seo/competitors.md` (skip if absent)
```

- [ ] **Step 2: Add competitor checks to Step 2**

In the same file, find the line:

```
**Priority 1 — Blocked content (fix first):**
```

Insert the following block immediately before it:

```markdown
**Priority 0 — Bootstrap (do before anything else):**
- If `memory/seo/competitors.md` does not exist or has no data rows → recommend bootstrapping:
  > "No competitor data found → run `/competitor-researcher [domain]` to bootstrap competitive intelligence"

**Priority 4 additions — Competitor maintenance:**
- If any domain's Last Snapshot in `competitors.md` is older than 30 days from today → flag as stale:
  > "Competitor data for [domain] is [N] days old → run `/competitor-researcher [domain]`"
- If `competitors.md` has rows with `Gap = gap` for keywords not in `keywords.md` (i.e. no cluster assigned yet) → surface as a research opportunity:
  > "[N] gap keywords found from [domain] not yet researched → run `/keyword-researcher [topic]`"

```

- [ ] **Step 3: Update the Summary block to include competitor data**

Find:

```
### Summary
- Total keywords tracked: [N]
- Published pages: [N]
- Last QA run: [date or "never"]
- Last publish: [date or "never"]
```

Replace with:

```
### Summary
- Total keywords tracked: [N]
- Published pages: [N]
- Last QA run: [date or "never"]
- Last publish: [date or "never"]
- Competitor snapshots: [list domains + last snapshot date, or "none"]
- Unactioned gaps: [N keywords, or "none"]
```

- [ ] **Step 4: Apply the same three changes to the two remaining files**

Apply identical edits to:
- `.claude/plugins/seo-agents/skills/seo-project-manager/SKILL.md`
- `.claude/commands/seo-project-manager.md`

- [ ] **Step 5: Verify**

In each of the three files, confirm:
- Step 1 file list includes `memory/seo/competitors.md`
- "Priority 0 — Bootstrap" section exists before "Priority 1"
- "Priority 4 additions" section exists
- Summary block includes "Competitor snapshots" and "Unactioned gaps" lines

- [ ] **Step 6: Commit**

```bash
git add .claude/plugins/seo-agents/skills/seo-project-manager.md
git add ".claude/plugins/seo-agents/skills/seo-project-manager/SKILL.md"
git add .claude/commands/seo-project-manager.md
git commit -m "feat: surface competitor gaps in seo-project-manager action plan"
```

---

## Task 5: Update `memory/seo/MEMORY.md`

**Files:**
- Modify: `memory/seo/MEMORY.md`

- [ ] **Step 1: Add competitors.md to the file index**

In `memory/seo/MEMORY.md`, find the `## Files` section:

```
## Files

- [keywords.md](keywords.md) — Keyword research tracker
- [content-log.md](content-log.md) — Published/updated content log
- [qa-log.md](qa-log.md) — QA pass/fail decisions
- [rankings.md](rankings.md) — SEO position snapshots
```

Replace with:

```
## Files

- [keywords.md](keywords.md) — Keyword research tracker
- [content-log.md](content-log.md) — Published/updated content log
- [qa-log.md](qa-log.md) — QA pass/fail decisions
- [rankings.md](rankings.md) — SEO position snapshots
- [competitors.md](competitors.md) — Competitor organic keyword snapshots and gap analysis
```

- [ ] **Step 2: Verify**

Confirm `competitors.md` line is present in the `## Files` section.

- [ ] **Step 3: Commit**

```bash
git add memory/seo/MEMORY.md
git commit -m "docs: add competitors.md to SEO memory index"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** New skill (7 steps) ✓ | `competitors.md` schema ✓ | keyword-researcher Step 3.5 ✓ | PM Priority 0, stale check, gap check ✓ | MEMORY.md update ✓
- [x] **No placeholders:** All file content is written out in full — no TBDs
- [x] **Type consistency:** `Gap` column values are `gap` / `targeted` consistently across Task 2 (skill writes them) and Task 3 (skill reads `Gap = gap`) and Task 4 (PM reads `Gap = gap`)
- [x] **Skill location pattern:** Each skill is written to all 3 locations (plugins `.md`, plugins `SKILL.md`, commands) matching the established pattern
- [x] **30-day threshold:** Stated consistently in spec and in Task 4 PM check
