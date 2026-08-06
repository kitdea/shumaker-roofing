---
name: content-updater
description: Use after /qa PASS to publish approved content to Sanity. Reads credentials from .env.local, runs a prose clarity pass on the draft (specificity, one-idea sentences, no anthropomorphizing or redundant modifiers), calls the Sanity mutation API, re-verifies the live document against the QA checklist (catching write-time defects QA on the draft can't see), and logs the result to memory/seo/content-log.md and memory/seo/publish-verification-log.md.
---

# Content Updater

You are the Content Updater for Shumaker Roofing. Your job is to publish QA-approved content to **Sanity** via the mutation API. The site migrated off Contentful to Sanity in June 2026 — this skill targets Sanity only.

## SAFETY GATE — Do Not Skip

Before doing anything, check `memory/seo/qa-log.md`. The most recent entry for the target page must have result `PASS`. If it shows `FAIL` or there is no entry, stop immediately and tell the user:

```
⛔ Cannot publish. No QA PASS found for this content.
Run /qa first and ensure it passes before publishing.
```

**Cannibalization re-check.** QA check 29 already verified no cluster/keyword overlap
existed at QA time, but another page can publish in the gap between QA and this publish
run. Re-verify immediately before writing:

1. Look up the target page's `Cluster` and primary keyword in `memory/seo/keywords.md`.
2. Check `memory/seo/content-log.md` for any page published **after** the QA PASS
   timestamp that falls in the same cluster or targets the same/near-synonym primary
   keyword.
3. If found, stop and tell the user:
   ```
   ⛔ Cannot publish. A page targeting the same cluster/keyword ([cluster/keyword])
   was published after this content's QA PASS: [other page slug], published [date].
   Re-run /qa to confirm this draft still has a distinct angle before publishing.
   See docs/seo/keyword-cannibalization-sop.md §3 for resolution options.
   ```
4. If no new conflicting publish is found, proceed.

## Step 1: Gather Required Information

Ask the user to confirm:
1. **Content type**: `blog` or `services` (these are the Sanity `_type` values — note `services` is plural)
2. **Action**: `update` (existing document) or `create` (new document)
3. **Slug** of the target page (e.g. `metal-roofing-cost`). For updates we look the document up by slug; for creates this becomes the new `slug.current`.
4. **The approved draft** (SEO title, meta description, H1/title, excerpt, body copy)

## Step 2: Read Credentials from .env.local

Read `.env.local` and extract:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (e.g. `production`)
- `SANITY_API_WRITE_TOKEN`
- `NEXT_PUBLIC_SANITY_API_VERSION` (default to `2026-06-17` if not set)

Never print these values. Use them only in the API calls below.

> **Write token required.** The repo ships with `SANITY_API_READ_TOKEN`, which is **read-only** and cannot publish. You need a token with **Editor** (write) permission. If `SANITY_API_WRITE_TOKEN` is missing from `.env.local`, stop and tell the user:
> ```
> ⛔ No write token found. Add a Sanity Editor token to .env.local as:
> SANITY_API_WRITE_TOKEN=...
> Create one at https://www.sanity.io/manage → your project → API → Tokens (Editor role).
> ```

Set up the shared variables once (PowerShell):

```powershell
$projectId  = (Get-Content .env.local | Select-String '^NEXT_PUBLIC_SANITY_PROJECT_ID=').ToString().Split('=',2)[1].Trim()
$dataset    = (Get-Content .env.local | Select-String '^NEXT_PUBLIC_SANITY_DATASET=').ToString().Split('=',2)[1].Trim()
$apiVersion = '2026-06-17'
$token      = (Get-Content .env.local | Select-String '^SANITY_API_WRITE_TOKEN=').ToString().Split('=',2)[1].Trim()
$mutateUrl  = "https://$projectId.api.sanity.io/v$apiVersion/data/mutate/$dataset?returnIds=true"
$queryUrl   = "https://$projectId.api.sanity.io/v$apiVersion/data/query/$dataset"
$headers    = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }
```

## Step 3: Find the Document ID (if updating)

Sanity looks documents up by slug. Query for the `_id`:

```powershell
$type  = "blog"   # or "services"
$slug  = "[target-slug]"
# Resolve BOTH ids separately — an unfiltered slug lookup can return the draft id.
$groq  = "{`"published`": *[_type==`"$type`" && slug.current==`"$slug`" && !(_id in path(`"drafts.**`"))][0]._id, `"draft`": *[_type==`"$type`" && slug.current==`"$slug`" && _id in path(`"drafts.**`")][0]._id}"
$resp  = Invoke-RestMethod -Uri "$queryUrl?query=$([uri]::EscapeDataString($groq))" -Headers $headers -Method Get
$pubId   = $resp.result.published
$draftId = $resp.result.draft
Write-Output "Published ID: $pubId   Draft ID: $draftId"
```

**These two ids are not interchangeable and must be tracked separately for the rest of this run.**
The original slug lookup here had no `drafts.**` filter, so when only a draft existed it returned
the draft id, every later step used it, and Step 5 then "verified" the draft against itself. Never
collapse them back into a single `$docId`.

Decide from the pair:

| `$pubId` | `$draftId` | What it means | Do |
|---|---|---|---|
| set | — | Normal live page | Patch `$pubId` (Step 4A) |
| set | set | Live page with unpublished edits | **Stop and report.** Diff the draft against the published doc and get the user's call before writing — publishing silently ships someone else's in-progress edits |
| — | set | Written but never published (the 2026-07-16 gutters case) | **Stop and report.** This is a stalled publish, not a fresh write. Inspect the draft's `seo.noindex`/`seo.nofollow`/`publishedDate` before doing anything — a draft parked for review often has these set to keep it out of search, and publishing as-is ships a live-but-deindexed page |
| — | — | Page does not exist | Switch to a **create** (Step 4B) |

> Patching the published document ID (no `drafts.` prefix) publishes the change directly — there is no separate publish step in Sanity. If you instead want a draft for review, prefix the id with `drafts.`.

## Step 3.5: Prose Clarity Pass (before writing)

Run the approved draft body, title, excerpt, and meta description through the clarity ruleset
below **before** it goes into a mutation. This is the last point where a fix costs nothing —
after Step 4 the text is live.

The target is **single-idea clarity, not sentence length**. Short sentences are a superficial
proxy; a short sentence carrying two ideas still fails. The reason this matters for search:
NLP models approximate human comprehension, so copy written to be clearly understood by a
human reader is also better parsed by AI search systems.

| # | Rule | What to do |
|---|------|-----------|
| C1 | General → specific | Replace vague nouns, verbs, quantifiers, and qualifiers with the measurable or concrete version wherever one exists. "Responds quickly" → the actual metric (response time, latency, time-to-first-byte). "Server errors" → the specific HTTP status codes. "Increase your budget" → "increase your crawl budget." |
| C2 | Cut "why," keep "effect" | Strip justification clauses — "this is because…", "in order to…", "the reason for this is…" — unless the reasoning changes what the reader does. State the outcome only. |
| C3 | One idea per sentence | Split compound sentences that carry unrelated clauses. Any clause that forces a mid-sentence context switch is a comprehension road bump. |
| C4 | No anthropomorphizing | Remove verbs that ascribe decision-making, wanting, or intent to systems, algorithms, or crawlers. Describe what the system does, not what it "decides" or "wants." |
| C5 | No redundant modifier pairs | Cut pairs where both words signal the same thing ("simultaneous parallel", "free gift", "advance planning"). Keep one. |
| C6 | One definition per sentence | Never define two concepts in the same sentence. Give each its own sentence. |
| C7 | Don't chase sentence length | Do not shorten or split purely to hit a word count. Split only where a sentence carries more than one idea; leave a long single-idea sentence alone. |
| C8 | Jargon check | Flag terms an average reader of this page would not know (technical roofing or web terms alike). Either replace with plain language or define it in its own sentence (see C6). |

Apply C1–C8 as **edits you propose, not edits you make silently.** The draft passed QA as
written; changing it without saying so breaks the QA→publish chain. Show the user each change
as `before → after` with the rule ID, get confirmation, then publish the revised text. If the
draft is already clean, say so in one line and continue.

If a fix would change the primary keyword, a heading targeted at the keyword cluster, or the
meta description's keyword placement, do not apply it — flag it and route the user back to
`/seo-writer`, since that text was chosen for ranking reasons this skill can't re-litigate.

## Step 4A: Update an Existing Document

Patch only the approved fields. SEO fields live inside the nested `seo` object (type `seoMetadata`). Use `setIfMissing` so the patch works even if the document has no `seo` object yet:

```powershell
$body = @{
  mutations = @(
    @{
      patch = @{
        id          = $docId
        setIfMissing = @{ seo = @{ "_type" = "seoMetadata" } }
        set = @{
          title              = "[Title / H1]"
          excerpt            = "[Excerpt]"
          "seo.seoTitle"       = "[SEO Title]"
          "seo.seoDescription" = "[Meta Description]"
        }
      }
    }
  )
} | ConvertTo-Json -Depth 12

Invoke-RestMethod -Uri $mutateUrl -Headers $headers -Method Post -Body $body
```

> To replace body copy too, convert the draft to Portable Text (see Step 4B) and add `content = $blocks` (blog) or `servicesContent = $blocks` (services) to the `set` block.

## Step 4B: Create a New Blog Document

Sanity body fields are **Portable Text** (an array of block objects), not HTML or markdown. Convert the draft body: each paragraph → a `normal` block, each `## heading` → an `h2` block. Every array item and span needs a unique `_key`.

```powershell
function New-Key { -join ((48..57)+(97..122) | Get-Random -Count 12 | ForEach-Object {[char]$_}) }
function New-Block($text, $style) {
  @{ "_type"="block"; "_key"=(New-Key); "style"=$style; "markDefs"=@();
     children=@(@{ "_type"="span"; "_key"=(New-Key); "text"=$text; "marks"=@() }) }
}

# Build $blocks from the approved draft, in order. Example:
$blocks = @(
  New-Block "[Intro paragraph]" "normal"
  New-Block "[H2 heading]" "h2"
  New-Block "[Section paragraph]" "normal"
)

$body = @{
  mutations = @(
    @{
      create = @{
        "_type"        = "blog"
        title          = "[H1 / Blog Title]"
        slug           = @{ "_type" = "slug"; current = "[target-slug]" }
        publishedDate  = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        author         = "[Author Name]"
        excerpt        = "[Excerpt]"
        categories     = @("[Category]")
        content        = $blocks
        seo            = @{
          "_type"        = "seoMetadata"
          seoTitle       = "[SEO Title]"
          seoDescription = "[Meta Description]"
        }
      }
    }
  )
} | ConvertTo-Json -Depth 12

$result = Invoke-RestMethod -Uri $mutateUrl -Headers $headers -Method Post -Body $body
$newId  = $result.results[0].id
Write-Output "Created document ID: $newId"
```

> For a new **service** page use `"_type" = "services"`, put body in `servicesContent` instead of `content`, and add `servicesImage` separately in Studio (image uploads are not handled here).

## Step 5: Post-Publish Verification (mandatory — do not skip)

There is no separate publish call — a successful mutate response means the change is live in
the `$dataset` dataset. But a 200 response does not guarantee the *content* is correct: PowerShell
JSON escaping can mangle smart quotes, the Portable Text conversion in Step 4B can drop or
truncate text, and a mistyped patch path (e.g. `seo.seotitle`) fails silently instead of erroring.
QA (check 12-29) validated the **draft** — it never saw what actually got written. Re-query the
live document and check it, not the draft, against the checklist:

```powershell
# Query the PUBLISHED id explicitly. Never reuse the id you patched without stripping any
# "drafts." prefix first — verifying a draft against itself passes by construction.
$verifyId = $pubId -replace '^drafts\.', ''
$live = "*[_id==`"$verifyId`" && !(_id in path(`"drafts.**`"))][0]{title, excerpt, slug, publishedDate, seo, `"blocks`": count(content), `"svcBlocks`": count(servicesContent), `"faqs`": count(faqItems), content, servicesContent}"
$doc  = Invoke-RestMethod -Uri "$queryUrl?query=$([uri]::EscapeDataString($live))" -Headers $headers -Method Get
$doc  = $doc.result
if (-not $doc) { Write-Output "VERIFICATION FAILED: no published document at $verifyId" }
```

If this query returns nothing, the write did not publish — report it as a failure. Do **not**
fall back to querying the draft id to get a result; an empty result here is the finding.

Run these checks against `$doc` (not the draft you sent):

> **Echo the observed value for every check.** Write `V2 body: PASS (19 blocks, 4 faqItems)`, not
> `V2 body: PASS`. Each number must come from `$doc` in this run — never from the draft you sent,
> the conversation, or a prior run's log. On 2026-07-16 this step logged "V2 body 15/15 blocks +
> 3/3 faqItems, V6 noindex/nofollow both false" for a document that had 19 blocks, 4 faqItems, and
> **both flags true** — values that matched neither the draft nor any published document. Pointing
> this query at the right id does not fix that on its own; the verdicts must be reads.

| # | Check | Rule |
|---|-------|------|
| V1 | Field fidelity | `$doc.title`, `$doc.excerpt`, `$doc.seo.seoTitle`, `$doc.seo.seoDescription` match the approved draft **exactly** (trim whitespace, but no other normalization) — a mismatch means the write was truncated, mis-escaped, or hit the wrong path. **Diff against the frontmatter block in `memory/seo/drafts/<slug>.md`** (`/seo-writer` Step 5), which holds the approved strings verbatim — not against the conversation, and never against a character count. If that file is missing its frontmatter, V1 is `UNVERIFIABLE` for the affected fields: say so rather than passing it, and note that the draft predates the frontmatter requirement |
| V2 | Body present | `$doc.content` (blog) or `$doc.servicesContent` (services) is non-empty and its block count roughly matches what you sent — a silent drop means Step 4B's `$blocks` array didn't serialize |
| V3 | SEO title length | `$doc.seo.seoTitle` is 50–60 characters (QA check 13, re-run on live data) |
| V4 | Meta description length | `$doc.seo.seoDescription` is 120–160 characters (QA check 14) |
| V5 | Keyword still present | Primary keyword (looked up from `memory/seo/keywords.md`, same lookup as the cannibalization check) still appears in `$doc.seo.seoDescription` (QA check 15) |
| V6 | noindex/nofollow | `$doc.seo.noindex` and `$doc.seo.nofollow` — echo both observed booleans. Neither may be `true` unless explicitly intended (QA check 18 — hard-stop). A live page with `noindex: true` ranks for nothing and passes no link equity, so this failing silently looks identical to the page never having been written |
| V7 | Canonical matches path | If `$doc.seo.canonicalUrl` is set, it matches this page's own path (QA check 19 — hard-stop) |
| V8 | No live duplicate | GROQ query for another document (`_id != $docId`) with an exact-match `seo.seoTitle` or `seo.seoDescription` across `blog`, `services`, `location` returns none (QA check 20) |
| V9 | Clarity edits landed | Every `before → after` change confirmed in Step 3.5 is present in the live text, and no *un*confirmed rewrite slipped in — re-scan `$doc` body blocks for the C1–C8 violations you fixed; if one is back, the write used the pre-edit draft |
| V10 | `publishedDate` set | `$doc.publishedDate` is a non-null datetime (QA check 23, re-run on live data — QA has passed this on a `null` field before, so do not trust the draft's verdict) |
| V11 | Draft consumed | If this run published a draft, `count(*[_id == "drafts.<uuid>"])` is now `0`. A leftover draft alongside the published doc means the publish did not consume it and edits may still be pending |
| V12 | URL resolves live | `curl -s -o /dev/null -w "%{http_code}" https://shumakerroofing.com<path>` returns `200`, and the returned HTML's `<meta name="robots">` is `index, follow` (or absent). This is the only check that leaves Sanity — it catches routing/build failures and robots defects that a correct GROQ read still cannot see |

If **any** check fails: do not proceed to Step 6 as a normal publish. Report it immediately:

```
⚠ PUBLISH VERIFICATION FAILED — [page slug] (doc [docId])
Failed: [check ID(s) and what's wrong, e.g. "V1: seo.seoDescription live value is 89 chars,
draft was 148 chars — looks truncated at an escaped quote"]
The document is live with this defect right now. Options:
1. Re-patch immediately with the corrected value (I can do this now), or
2. Unpublish (prefix doc id with drafts. is not reversible for already-published docs —
   use a corrective patch instead)
```

Then fix (re-patch) and re-verify before moving on. Log the failure regardless of whether it
was fixed — see Step 6.

## Step 6: Log to Memory

**Verification log (always, even if Step 5 passed clean):** append one row to
`memory/seo/publish-verification-log.md` (create with a header row if it doesn't exist):

```
| [YYYY-MM-DD] | [page slug] | [doc ID] | [pass / check IDs that failed] | [root cause if known] | [fixed-by-repatch: yes/no] |
```

This is the learning mechanism for this skill — before publishing, skim the last ~10 rows of
this file. If the **same check ID or root cause** appears 2+ times, it's a systemic problem, not
a one-off typo. Say so explicitly in the report (Step 7) and name the likely fix (e.g. "V1
failures have hit seoDescription 3 times when it contains an apostrophe — PowerShell's
`ConvertTo-Json` needs the value single-quoted before interpolation, not the mutation logic
itself") rather than just re-patching and moving on.

**Content log (only after verification passes clean or a failure was corrected):** append one
row to `memory/seo/content-log.md`, matching its header exactly — `Date | Page | Action |
Sanity Document ID | Agent Run` (this file predates the June 2026 Contentful→Sanity migration and
its header used to read `Contentful Entry ID`; every row has held a Sanity document ID since the
migration, so the header was corrected to match — don't reintroduce the old name):

```
| [YYYY-MM-DD] | [page slug] | [created/updated] | [document ID] | seo-writer + content-updater |
```

Update keywords in `memory/seo/keywords.md`: change status from `qa-passed` to `published`.

If `memory/seo/opportunity-clusters.md` exists and has a row for this cluster or target page, set
its `status` to `done`. This closes the loop `/competitor-researcher` opened — a cluster left at
`in-progress` after publish will be re-flagged as unstarted work by `/seo-project-manager`.

Update `memory/seo/MEMORY.md`: set "Last content published" to today's date and page slug.

## Step 7: Report

```
✓ Published to Sanity — verified against live document
  Document ID: [id]
  Page: [slug]
  Action: [created/updated]
  Post-publish checks: [N]/9 passed
  Clarity pass: [no changes needed / N edits applied — rule IDs]
  Keywords marked as: published

Note: production caches via CDN; the live page may take a moment to reflect the change
(localhost reflects publishes instantly since it bypasses the CDN).

Next step: Add this page to memory/seo/rankings.md to track its position over time.
Run /seo-project-manager to see what to work on next.
```

If a systemic pattern was found in the verification log (2+ repeats of the same check/root
cause), lead the report with that instead:

```
⚠ Recurring publish defect detected: [check ID] has failed [N] times in the last 10 publishes,
  most recently on [slug] ([date]). Likely cause: [root cause]. Recommend fixing this before
  the next publish rather than continuing to catch it at verification time.
```
