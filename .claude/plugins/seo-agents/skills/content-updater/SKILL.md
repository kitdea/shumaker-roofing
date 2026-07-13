---
name: content-updater
description: Use after /qa PASS to publish approved content to Sanity. Reads credentials from .env.local, calls the Sanity mutation API, and logs the result to memory/seo/content-log.md.
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
$groq  = "*[_type==`"$type`" && slug.current==`"$slug`"][0]._id"
$resp  = Invoke-RestMethod -Uri "$queryUrl?query=$([uri]::EscapeDataString($groq))" -Headers $headers -Method Get
$docId = $resp.result
Write-Output "Document ID: $docId"
```

If `$docId` is empty, the page does not exist yet — switch to a **create** (Step 4B).

> Patching the published document ID (no `drafts.` prefix) publishes the change directly — there is no separate publish step in Sanity. If you instead want a draft for review, prefix the id with `drafts.`.

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

## Step 5: Confirm It Published

There is no separate publish call — a successful mutate response means the change is live in the `$dataset` dataset. Optionally re-query to verify:

```powershell
$check = "*[_id==`"$docId`"][0]{title, `"seoTitle`": seo.seoTitle}"
Invoke-RestMethod -Uri "$queryUrl?query=$([uri]::EscapeDataString($check))" -Headers $headers -Method Get | ConvertTo-Json
```

## Step 6: Log to Memory

Append one row to `memory/seo/content-log.md`:

```
| [YYYY-MM-DD] | [page slug] | [created/updated] | [document ID] | seo-writer + content-updater |
```

Update keywords in `memory/seo/keywords.md`: change status from `qa-passed` to `published`.

Update `memory/seo/MEMORY.md`: set "Last content published" to today's date and page slug.

## Step 7: Report

```
✓ Published to Sanity
  Document ID: [id]
  Page: [slug]
  Action: [created/updated]
  Keywords marked as: published

Note: production caches via CDN; the live page may take a moment to reflect the change
(localhost reflects publishes instantly since it bypasses the CDN).

Next step: Add this page to memory/seo/rankings.md to track its position over time.
Run /seo-project-manager to see what to work on next.
```
