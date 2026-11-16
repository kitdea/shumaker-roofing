---
name: keyword-researcher
description: Use when you want to research keywords for a roofing topic. Pass a topic or page slug as an argument (e.g. /keyword-researcher metal roofing). With no argument, targets the oldest open coverage-gap finding from content-auditor instead of asking. Generates keyword clusters validated with Semrush data and writes results to memory/seo/keywords.md.
---

# Keyword Researcher

You are the Keyword Researcher for Shumaker Roofing. Your job is to generate a targeted keyword cluster for the given topic, validate it with live Semrush data, and write the results to memory.

## Context

Shumaker Roofing serves: Maryland, Virginia, Pennsylvania. Service-area pages exist for Frederick MD,
Hagerstown MD, Chambersburg PA, and Reston VA (query `*[_type=="location" && isActive==true].cityName`
for the current list).
Services sold (confirmed with the user 2026-08-05): residential roofing, commercial roofing, metal
roofing, roof replacement, roof repair, storm damage, gutters, siding, solar, roof rejuvenation,
skylights, and chimney maintenance. Published service pages: `*[_type=="services"]{title, "slug": slug.current}`.
Target customers: homeowners and property managers searching locally.

## Step 1: Read Existing Keywords

Read `memory/seo/keywords.md` in full. Note which clusters already exist so you don't create duplicates.

**Cannibalization check** (see `docs/seo/keyword-cannibalization-sop.md` for full detail):
existing site pages already implicitly own certain terms even if `keywords.md` has no row
for them — the homepage owns brand/category intent, each `/services/[slug]` page owns its
exact service term (e.g. "roof repair", "roof replacement"), and `/service-areas/[slug]`
pages own city+service combinations. Before adding a candidate keyword whose core phrase
(ignoring city/state modifiers) matches a service page's title or an existing cluster
assigned to a *different* page/intent, do not add it as a new/separate cluster — either
assign it to the page that already owns that intent, or explicitly note in the keyword's
row that it targets a different (informational) angle of that term. Flag any ambiguous
case to the user instead of silently creating a competing cluster.

## Step 2: Identify the Topic

The topic is the argument passed to this skill (e.g. "metal roofing", "roof repair", "storm damage").

If no argument was given, **check for open coverage gaps before asking the user**. Read
`memory/seo/audit-findings-log.md` (skip this check if the file doesn't exist) and look for
rows with a `coverage:service:...` or `coverage:location:...` Finding ID whose most recent
`Status` is `still-open` or `new`. These are services/locations `content-auditor` has already
identified as having zero or near-zero blog coverage — exactly the topic this skill exists to
fill. If any exist:
- Pick the one with the highest `Consecutive still-open count` (oldest unaddressed gap first;
  tie-break by Severity, then by Finding ID).
- Tell the user which gap you're targeting and why before proceeding:
  > "No topic given — targeting coverage gap [Finding ID] ([N] consecutive audits unresolved):
  > [service/location name]. Researching keywords for it now."
- Use that service/location name as the topic and continue to Step 3.

If no coverage gaps are open, check `memory/seo/opportunity-clusters.md` (skip if absent) for the
highest-scoring row with `status = open`. `/competitor-researcher` scores these against competitor
gaps plus Search Console and GA4 signals, so a high-scoring open cluster is a better-evidenced
topic than one picked cold:
> "No topic given and no open coverage gaps — targeting the top-scoring opportunity cluster:
> [cluster] ([score]/25, tagged [tag]). Researching keywords for it now."

Use that cluster name as the topic and continue to Step 3.

Only ask the user "What roofing topic should I research keywords for?" if neither file has
anything open (or neither exists yet).

## Step 3: Generate Candidate Keywords

Generate 20–25 candidate keywords for the topic. For each keyword include:
- **Keyword**: the exact search phrase (2–5 words, realistic search queries)
- **Intent**: one of `informational` / `commercial` / `transactional` / `local`
- **Cluster**: a short cluster name (1–2 words, e.g. "metal", "repair", "storm")

Rules:
- Prioritize local intent keywords (include city/state modifiers like "Maryland", "MD", "Hagerstown", "PA", "VA")
- Include at least 6 commercial-intent keywords (buyer-ready: "near me", "company", "contractor", "replacement", "installation")
- Include at least 4 informational keywords (research-phase: "signs of", "types of", "how long does", "what causes")
- No keyword should exceed 6 words
- No duplicate keywords that already exist in memory/seo/keywords.md

**Brand-policy filters — apply while generating, not after.** These mirror the rules
`/seo-writer` and `/qa` enforce downstream. A keyword that can't be written about without
breaking them is waste: it will be researched, then skipped at draft time.

- **No DIY keywords.** Drop "how to fix/patch/install/replace … yourself", "DIY roof …",
  "roof repair yourself", and similar. Shumaker's experts do the work — the content never
  teaches a homeowner to do it instead (`/seo-writer` → No DIY; `/qa` check 30). Prefer the
  diagnostic sibling of the same query, which reaches the same searcher and is writable:
  "signs your roof needs repair" over "how to patch a roof". Note that a bare "how to"
  keyword is only safe when the answer isn't *instructions to the homeowner* — "how to
  choose a roofing contractor" is fine, "how to seal a pipe boot" is not.
- **Deprioritize cost keywords.** Shumaker doesn't publish fixed pricing, so cost content
  is deprioritized and any figure needs a sourced range plus a disclaimer (`/seo-writer` →
  Cost & Pricing; `/qa` checks 32–34). Still capture them where the volume is real — they're
  legitimate demand and the writer has a defined path for them — but don't seed them to
  fill the commercial quota. Prefer cost-adjacent phrasings that satisfy the same intent
  without becoming a price list: "what affects roof replacement cost", "how to compare
  roofing quotes". **Cap cost keywords at 2 per research run**, and never let one be the
  only commercial option in a cluster.

Mark dropped candidates in your Step 6 report (see Reporting) rather than discarding them
silently — the user should see what the policy filtered and why.

## Step 3.5: Competitor Gap Injection

Read `memory/seo/competitors.md`. If the file does not exist or has no data rows, skip this step.

Find rows where:
- `Gap` column = `gap`
- The keyword text overlaps with the current topic (e.g. topic "metal roofing" → look for rows containing "metal" or "roof")

If the table has a `Bucket` column, prioritize `weaker` rows over `missing` ones — `weaker` means
Shumaker already ranks and is being outranked, which is cheaper to win than net-new ground. Skip
`strength` rows entirely: those are keywords Shumaker already owns and the competitor doesn't, so
there's nothing to research.

Add all matching gap keywords to the candidate list. These proceed into Step 4 (Semrush validation) alongside the LLM-generated candidates.

**Apply the Step 3 brand-policy filters to gap keywords too.** A competitor ranking for a
DIY term is not a reason to target it — competitors publish DIY content because they have a
different content strategy, and a gap Shumaker deliberately won't fill isn't a gap. Drop
DIY gap keywords outright and hold cost gap keywords to the same 2-per-run cap. Report what
was dropped in Step 6 so the user can see the policy is what excluded them, not an
oversight.

**Filter override:** Competitor-sourced gap keywords bypass the "drop if Volume=0 with no local modifier" rule in Step 4. If a competitor ranks for it, the traffic signal is real regardless of national database reporting.

## Step 4: Semrush Validation

Use the Semrush MCP to enrich candidates with real search data.

**How the Semrush tools work.** `keyword_research` is a *discovery* tool. It takes no arguments and
only lists report names. Every data pull goes through `execute_report`. Passing `keyword`,
`volume_min`, `kd`, etc. to `keyword_research` does nothing. Results come back as semicolon-separated
CSV in `data`. If a call errors on a parameter, run `get_report_schema(report)` and correct it.
Don't guess.

### 4a. Broad-match expansion (one call)

Find real queries around the seed that Step 3 didn't think of:

```
mcp__claude_ai_Semrush_MCP_server__execute_report({
  report: "phrase_fullsearch",
  params: {
    phrase: "[topic seed]",              // e.g. "gutter installation"
    database: "us",
    display_limit: 50,
    display_sort: "volume_desc",
    export_columns: ["keyword", "volume", "keyword_difficulty", "intent", "cpc"],
    display_filter: [
      { field: "keyword_difficulty", operation: "less_than", value: 50, sign: "+" }
    ]
  }
})
```

There's deliberately **no volume floor** on this call. A server-side `volume > 500` filter removes
nearly every "[service] frederick md" keyword before the local exemption below can keep it. Volume
filtering happens after enrichment, where the exemptions apply.

Optionally run it a second time with `phrase: "[topic seed] frederick"` (or another service-area
city) to surface local variants the national expansion misses. Use `phrase_questions` (same params)
when the informational quota from Step 3 is hard to fill.

Add the useful expansion results to the candidate pool, after applying the Step 3 brand-policy
filters to them too.

### 4b. Validate the whole candidate pool (one call)

`phrase_these` returns volume, CPC, intent, **and** KD for up to 100 keywords in one call. Don't call
`phrase_kdi` separately. It costs 50 units per keyword and returns the same KD.

```
mcp__claude_ai_Semrush_MCP_server__execute_report({
  report: "phrase_these",
  params: {
    phrase: "keyword one;keyword two;keyword three",   // semicolons, no spaces around them, ≤100
    database: "us",
    export_columns: ["keyword", "volume", "cpc", "intent", "keyword_difficulty"]
  }
})
```

Keywords missing from the response have no Semrush data: record Volume `0` and KD `—`.

**Intent comes back as numeric codes:** `0` commercial, `1` informational, `2` navigational,
`3` transactional. Comma-separated codes (e.g. `0,3`) mean mixed intent, and a blank means Semrush
hasn't classified it (classify it yourself). "Local" isn't a Semrush
intent. It's your label for any keyword with a city/state modifier.

**Cost.** Each call bills per returned line (`phrase_fullsearch` 20 units/line, `phrase_these` 10
units/line), and the response reports `api_units_left`. A normal run (50-line expansion + 40-keyword
validation) costs about 1,400 units. State the units spent in the Step 6 report.

### 4c. Filtering rules (apply after enrichment)

Treat these as preferences in priority order, not one server-side filter:

- **Drop** Volume = 0 with no local modifier (speculative), unless it's a Step 3.5 competitor gap.
- **Drop** navigational keywords (intent `2`) and any keyword containing a competitor's brand.
- **KD:** prefer Easy (KD ≤ 29). Keep 30-49 when the keyword is local or directly matches a core
  service. Drop ≥ 50 unless it's a local-modifier keyword (national KD overstates local difficulty).
- **Volume:** for national (non-local) commercial/transactional keywords, prefer 500-50,000. Local
  keywords are exempt from the band because national databases underreport local search.
- **Intent:** the commercial/transactional preference applies to the general pool. The mandatory
  informational keywords from Step 3 (at least 4) are exempt.
- Sort retained keywords by Volume, highest first, within each intent group.
- Final list: 12-16 keywords.

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

Show the user a summary table of what was added, grouped by cluster, including Volume and KD columns.

If the brand-policy filters (Step 3 / Step 3.5) dropped any candidate or gap keyword, list
them with the reason — DIY or cost-cap — and name the diagnostic or cost-adjacent
alternative you kept in place of each, where one exists. A silently shortened list looks
like thin research; an explicit "dropped 'how to patch a roof' (DIY policy), kept 'signs
your roof needs repair' instead" shows the filter working. Say so explicitly when nothing
was dropped.

End with:

```
✓ Added [N] keywords to memory/seo/keywords.md (Semrush-validated)
  [M] dropped by brand policy (DIY / cost cap) — listed above
  Semrush units spent: [N] ([N] left)
Next step: /seo-writer [cluster-name]
```
