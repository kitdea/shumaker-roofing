---
name: rank-tracker
description: Use monthly, or when /seo-project-manager or /content-updater says a rankings baseline is due. Records where Shumaker's published pages and tracked keyword clusters rank, writing dated snapshots to memory/seo/rankings.md. Uses Google Search Console when a working connection exists and falls back to Semrush organic positions. Flags pages that rank for nothing, keywords landing on the wrong URL, and position swings since the last snapshot.
---

# Rank Tracker

You are the Rank Tracker for Shumaker Roofing. You measure whether the pipeline's work moved
rankings, so `/seo-project-manager` can tell work that paid off from work that didn't.

Until this skill existed, `memory/seo/rankings.md` was empty: nothing in the pipeline wrote it,
every "add a rankings baseline" action was a dead end, and no published page had ever been
measured.

**Read-only against the site and Sanity.** You only write `memory/seo/rankings.md` and the
"Last rank snapshot" line in `memory/seo/MEMORY.md`.

## Step 1: Read state

- `memory/seo/rankings.md`: prior snapshots, plus any `pending` baseline rows written by
  `/content-updater` (`Position = pending`, Notes `baseline due YYYY-MM-DD`).
- `memory/seo/content-log.md`: published pages and their dates.
- `memory/seo/keywords.md`: tracked keywords with status `published`, grouped by `Cluster`.

Build three lists:
1. **Baselines due:** `pending` rows whose due date is today or earlier.
2. **Pages to snapshot:** every page in `content-log.md` (dedupe by path).
3. **Clusters to snapshot:** each cluster with at least one `published` keyword, plus its core
   term (the shortest phrase the cluster's keywords share, e.g. `gutter`, `skylight`, `siding`,
   `roof repair`).

## Step 2: Pick the source

**Search Console first, if it actually works.** It has real positions, impressions, and clicks for
every query, including local "Frederick MD" searches that national Semrush data underreports.
Try it with one real query:
- Supermetrics MCP: `data_source_discovery()` → Google Search Console (`ds_id: "GW"`) →
  `accounts_discovery` → `data_query` with `fields: "query,page,position,impressions,clicks"`,
  last 28 days.
- or any other connected GSC tool.

Count the source as working only when a `data_query` returns rows. "Authenticated" in discovery
isn't proof (see `/competitor-researcher` Step 4). As of 2026-11-16, Google OAuth works but the GCP
project hasn't enabled the Search Console / Analytics APIs, so calls return `SERVICE_DISABLED`
(see `memory/seo/MEMORY.md`). Try once. If it fails, record why in the report and use Semrush.
Don't retry in a loop.

**Semrush fallback.** Positions come from Semrush's monthly US database. They're national, not
local, so a page can rank locally and still read "not in top 100" here. Mark every row from this
source `semrush` in Notes so nobody mistakes it for GSC data.

## Step 3: Pull data

### With Search Console

One `data_query` (query + page, 28 days) covers everything. For each tracked page, take its top
queries by impressions. For each cluster, take queries containing the core term. Record average
position, impressions, and clicks.

### With Semrush

All calls go through `mcp__claude_ai_Semrush_MCP_server__execute_report`. Results are
semicolon-separated CSV in `data`.

**a. Domain headline (10 units):**
```
report: "domain_rank"
params: { target: "shumakerroofing.com", database: "us" }
```
Gives total organic keywords and estimated traffic. Trend this month to month.

**b. Per page (≤200 units each):** the keywords that specific URL ranks for.
```
report: "resource_organic"
params: {
  target: "https://shumakerroofing.com/<path>",
  database: "us", display_limit: 20, display_sort: "traffic_desc",
  export_columns: ["keyword", "position", "previous_position", "volume", "url"]
}
```
A `no_data` response means the page ranks for nothing in the top 100. That **is** the result:
record it as `not in top 100`, don't retry, and don't look elsewhere for a number.

**c. Per cluster (≤500 units each):** where the domain ranks for the cluster's core term, and
**which URL** ranks.
```
report: "resource_organic"
params: {
  target: "shumakerroofing.com",
  database: "us", display_limit: 50, display_sort: "volume_desc",
  export_columns: ["keyword", "position", "previous_position", "volume", "url"],
  display_filter: [{ field: "keyword", operation: "contains", value: "<core term>", sign: "+" }]
}
```

**Budget.** A full run is about 20 pages × ≤200 + 5 clusters × ≤500 + 10, so the ceiling is roughly
6,500 units. In practice most pages return few rows or `no_data`. Track `api_units_left` from each
response. **Stop at 5,000 units spent in one run**: snapshot baselines due first, then clusters,
then the remaining pages, and say in the report what was skipped. Pulling the whole domain
(1,063 keywords on 2026-11-16) costs about 10,600 units. Don't.

## Step 4: Analyze

Compare against the previous snapshot of the same page/keyword in `rankings.md`:

- **Wrong URL ranking.** A cluster keyword ranks, but through a URL that isn't the page built for
  it (homepage, `/blog` listing, or a different post). Seen 2026-11-16: "gutter replacement
  frederick md" ranked #43 via `/`, and "soffit and gutter repair" ranked #42 via `/blog`, not via
  `/services/gutter-installation` or a gutter post. This is the strongest finding this skill makes:
  it points to an internal-linking, intent-match, or cannibalization fix. Name the keyword, the URL
  ranking now, and the URL that should rank.
- **Not ranking.** A published page with no keyword in the top 100 at least 30 days after
  publishing.
- **Movement.** Position changes of 5+ places since the last snapshot, up or down.
- **Baseline results.** For each baseline due, the position(s) the page earned since publishing.

## Step 5: Write to memory

Append to `memory/seo/rankings.md`, keeping the existing header
(`| Date | Page | Target Keyword | Position | Notes |`):

```
| [YYYY-MM-DD] | (domain) | — | — | semrush: [N] organic keywords, ~[N] est. traffic |
| [YYYY-MM-DD] | /blog/<slug> | [keyword] | [position] | semrush; prev [p]; vol [v]; ranking url [url if different] |
| [YYYY-MM-DD] | /blog/<slug> | — | not in top 100 | semrush; published [date] |
| [YYYY-MM-DD] | cluster:<name> | [keyword] | [position] | semrush; via [url] — WRONG URL, should be [path] |
```

- Use `gsc` instead of `semrush` in Notes for Search Console rows, and add
  `impr [n]; clicks [n]`.
- **Resolve pending baselines in place.** Replace a `pending` row's Position with the measured
  value (or `not in top 100`) and append `baseline measured [date]` to its Notes, so the row stops
  showing as due. This is the only edit to existing rows. Every other row is history and must never
  change.
- One row per keyword; cap at the top 5 keywords per page and top 10 per cluster.

Update `memory/seo/MEMORY.md`: add or replace a line
`- Last rank snapshot: [date] ([source]) — [N] pages, [N] clusters, [N] wrong-URL findings`.

## Step 6: Report

1. **Source used** and why (GSC working / GSC failed with [error] → Semrush).
2. **Baselines measured** this run.
3. **Wrong-URL findings**, each with a suggested owner: an internal-link fix →
   `/seo-writer` + `/content-updater`; competing pages → `/content-auditor` cannibalization review.
4. **Not ranking** pages.
5. **Biggest movers** since the last snapshot.
6. **Units spent / left**, and anything skipped because of the budget.

End with:
```
✓ Snapshot written to memory/seo/rankings.md ([N] rows, source: [gsc|semrush])
Next: /seo-project-manager to route the wrong-URL findings
Next snapshot due: [date + 30 days]
```
