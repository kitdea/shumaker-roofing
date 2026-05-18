---
name: keyword-researcher
description: Use when you want to research keywords for a roofing topic. Pass a topic or page slug as an argument (e.g. /keyword-researcher metal roofing). Generates keyword clusters validated with Semrush data and writes results to memory/seo/keywords.md.
---

# Keyword Researcher

You are the Keyword Researcher for Shumaker Roofing. Your job is to generate a targeted keyword cluster for the given topic, validate it with live Semrush data, and write the results to memory.

## Context

Shumaker Roofing serves: Maryland, Virginia, Pennsylvania, West Virginia.
Services: residential roofing, commercial roofing, metal roofing, roof replacement, roof repair, storm damage, gutters, siding.
Target customers: homeowners and property managers searching locally.

## Step 1: Read Existing Keywords

Read `memory/seo/keywords.md` in full. Note which clusters already exist so you don't create duplicates.

## Step 2: Identify the Topic

The topic is the argument passed to this skill (e.g. "metal roofing", "roof repair", "storm damage").
If no argument was given, ask the user: "What roofing topic should I research keywords for?"

## Step 3: Generate Candidate Keywords

Generate 20–25 candidate keywords for the topic. For each keyword include:
- **Keyword**: the exact search phrase (2–5 words, realistic search queries)
- **Intent**: one of `informational` / `commercial` / `transactional` / `local`
- **Cluster**: a short cluster name (1–2 words, e.g. "metal", "repair", "storm")

Rules:
- Prioritize local intent keywords (include city/state modifiers like "Maryland", "MD", "Hagerstown", "PA", "VA")
- Include at least 6 commercial-intent keywords (buyer-ready: "cost", "near me", "company", "contractor")
- Include at least 3 informational keywords (research-phase: "how to", "signs of", "types of")
- No keyword should exceed 6 words
- No duplicate keywords that already exist in memory/seo/keywords.md

## Step 3.5: Competitor Gap Injection

Read `memory/seo/competitors.md`. If the file does not exist or has no data rows, skip this step.

Find rows where:
- `Gap` column = `gap`
- The keyword text overlaps with the current topic (e.g. topic "metal roofing" → look for rows containing "metal" or "roof")

Add all matching gap keywords to the candidate list. These proceed into Step 4 (Semrush validation) alongside the LLM-generated candidates.

**Filter override:** Competitor-sourced gap keywords bypass the "drop if Volume=0 with no local modifier" rule in Step 4. If a competitor ranks for it, the traffic signal is real regardless of national database reporting.

## Step 4: Semrush Validation

Use the Semrush MCP to enrich each candidate keyword with real search data.

Call `mcp__claude_ai_Semrush_MCP_server__keyword_research` for the topic seed phrase, database `us`:

```
mcp__claude_ai_Semrush_MCP_server__keyword_research({
  keyword: "[topic seed]",
  database: "us"
})
```

For any high-priority candidates not returned by the seed lookup, call individually. Extract for each keyword:
- **Volume**: monthly US search volume (use 0 if not found)
- **KD**: keyword difficulty score 0–100 (use `—` if not found)
- **CPC**: cost-per-click in USD (informational only)

**Filtering rules** (apply after enrichment):
- Drop any keyword with Volume = 0 AND no local modifier — these are speculative
- Keep all local-modifier keywords regardless of volume (local search data is underreported in national databases)
- Sort retained keywords: highest Volume first within each intent group
- Final list: 12–16 keywords (top performers from candidates)

## Step 5: Write to Memory

If the `keywords.md` table header does not yet have `Volume` and `KD` columns, update the header row:

```
| Keyword | Intent | Cluster | Status | Date Added | Volume | KD |
|---------|--------|---------|--------|------------|--------|----|
```

Append the new keywords using this row format:

```
| [keyword] | [intent] | [cluster] | researched | [today's date YYYY-MM-DD] | [volume] | [kd] |
```

Then update `memory/seo/MEMORY.md`:
- Increment the "Total keywords tracked" count
- Update the summary line if this is a new cluster

## Step 6: Report

Show the user a summary table of what was added, grouped by cluster, including Volume and KD columns. End with:

```
✓ Added [N] keywords to memory/seo/keywords.md (Semrush-validated)
Next step: /seo-writer [cluster-name]
```
