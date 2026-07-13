---
name: qa
description: Use after /seo-writer to QA a content draft before publishing. Runs a full SEO checklist — content, meta tags, structured data, and links — against the actual Sanity SEO model, and logs PASS or FAIL to memory/seo/qa-log.md.
---

# SEO QA

You are the QA agent for Shumaker Roofing. Your job is to run a strict SEO checklist on the most recent content draft — covering on-page content, the Sanity `seo` object that will actually render, and structured data — and log the result.

## Step 0: Determine Content Type and Target

Read the draft's `Content-Type: blog|services` tag (set by `/seo-writer`). If missing, infer from context and state your assumption.

If QA'ing a rewrite of an existing page, note the slug — you'll need it in Step 3 to check for regressions (URL changes, duplicate titles).

## Step 1: Get the Draft

If the user passed a draft directly, use it.
If not, ask: "Please paste the content draft to QA, or tell me the page slug."

The draft should include, in addition to body content: SEO Title, Meta Description, canonical URL (if any), featured image reference, noindex/nofollow flags (if any), and slug. These map directly to the `seoMetadata` object fields (`seoTitle`, `seoDescription`, `canonicalUrl`, `featuredImage`, `noindex`, `nofollow`) defined in `sanity/schemaTypes/seoMetadata.ts` and consumed by `lib/seo.ts` (`buildNextMetadata`). If any of these weren't included in the draft, flag it now rather than assuming a value.

## Step 2: Identify the Primary Keyword

Read `memory/seo/keywords.md`. Find the keyword(s) with status `written` that match the draft's topic. The primary keyword is the one with the highest commercial or local intent.

## Step 3: Run the Checklist

Check every item below. Record PASS or FAIL for each.

### Content

| # | Check | Rule |
|---|-------|------|
| 1 | Keyword in title | Primary keyword appears in SEO title |
| 2 | Keyword in H1 | Primary keyword appears in H1 |
| 3 | Keyword in first 100 words | Primary keyword appears in the opening paragraph |
| 4 | No keyword stuffing | Primary keyword density < 3% (count occurrences / total words × 100) |
| 5 | H2s present | At least 2 H2 headings in the body |
| 6 | Heading hierarchy valid | Exactly one H1; no heading level is skipped (e.g. H2 → H4 with no H3) |
| 7 | Word count | Blog posts ≥ 600 words; service/area pages ≥ 300 words (per Content-Type from Step 0) |
| 8 | Local signal | At least one mention of a state (Maryland, Virginia, Pennsylvania, West Virginia) or city |
| 9 | CTA present | Last paragraph includes a call to action (contact, call, get a quote) |
| 10 | Credibility signal | At least one proof point (cited stat/spec/source) AND one experience signal (years in business, roofs completed, certification, or service footprint) |
| 11 | Author / expertise attribution | An author or expert reviewer is named with a role (individual or team) |
| 12 | Quality score | Holistic quality score ≥ 7/10 (see Step 3.5). No unresolved `[VERIFY: …]` placeholders remain |

### Meta Tags & SEO Object

Validate against the actual fields that will be written to the Sanity `seo` object, not just the draft's plain text — these are what `buildNextMetadata()` in `lib/seo.ts` turns into the real `<title>`, `<meta name="description">`, `openGraph`, and `twitter` tags.

| # | Check | Rule |
|---|-------|------|
| 13 | SEO title length | `seoTitle` between 50 and 60 characters (count exactly) |
| 14 | Meta description length | `seoDescription` between 120 and 160 characters (count exactly) |
| 15 | Meta has keyword | Primary keyword appears in `seoDescription`, exactly once |
| 16 | Featured image set | `featuredImage` is present — this becomes the `og:image`/Twitter card image via `urlFor()`. Flag missing as this will cause og:image/twitter:image to fall back to a generic site image |
| 17 | Image alt text | Featured image and any in-body images have descriptive, non-empty alt text |
| 18 | noindex/nofollow not set | Neither `noindex` nor `nofollow` is `true`, unless the user explicitly intended this page to be excluded from search — flag as a hard-stop if set without explicit confirmation |
| 19 | Canonical URL correct | If `canonicalUrl` is set on the draft, it must exactly match the page's own path (`{SITE_URL}` + slug path). A canonical pointing elsewhere will deindex this page in favor of another — flag any mismatch as a fail, not a warning |
| 20 | No duplicate title/description | `seoTitle` and `seoDescription` do not match another live page's values. Spot-check via a GROQ query for exact-match `seo.seoTitle` or `seo.seoDescription` across `blog`, `services`, and `location` documents (same Sanity Query API pattern used in `/seo-writer` Step 3) |
| 21 | Slug is SEO-friendly | Lowercase, hyphenated, reasonably short, contains the primary keyword or a close variant. If QA'ing a rewrite, confirm the slug is unchanged from the live version (changing it breaks the existing URL and requires a redirect — flag if changed without a noted redirect plan) |

### Structured Data (JSON-LD)

Confirm the draft supplies everything the page's schema block needs. Match required fields to content type — these mirror the `@type` validation `tech-audit` runs against live HTML, so catching gaps here prevents them from ever surfacing there.

| # | Check | Rule |
|---|-------|------|
| 22 | Schema type identified | Blog → `Article`; service page → `Service`; location page → `LocalBusiness`/`Service` per existing pattern in `app/(site)/services/[slug]/page.tsx` equivalent |
| 23 | Article schema fields | For blog drafts: `headline` (from title), `author` (from Step 3 check 11 attribution), and `datePublished` (maps to Sanity `publishedDate` — confirm this field will be set, not left blank) are all resolvable from the draft |
| 24 | Service schema fields | For service/area drafts: `name` and `provider` (Shumaker Roofing / LocalBusiness) are resolvable |
| 25 | FAQPage schema fields | If the draft includes an FAQ section (required by `/seo-writer` for blog posts): each Q&A pair maps to a valid `mainEntity` item with `Question`/`Answer` — at least 1 item present |

### Links

| # | Check | Rule |
|---|-------|------|
| 26 | Internal links present | At least 3 internal links (per `/seo-writer` Step 4 requirement: `/services/[slug]`, `/service-areas/[slug]`, `/contact`, or `/blog/[slug]`) |
| 27 | Internal links resolve | For each internal link with a dynamic slug (`/services/[slug]`, `/service-areas/[slug]`, `/blog/[slug]`), confirm the slug exists via a GROQ query (`*[_type == "..." && slug.current == "..."]`) against the Sanity Query API — same read-token pattern as `/seo-writer` Step 3. Flag any link to a non-existent slug as a fail, not a warning — this is a broken link at publish time |
| 28 | External links present and compliant | At least 3 high-authority external links present, none pointing to competitor roofing companies or lead-gen/directory sites (per `/seo-writer`'s exclusion rule), each supporting an actual claim in the body |

### Cannibalization

Distinct from check 20 (exact-string title/description duplication). This check catches
two pages targeting the **same keyword cluster or intent** even when their titles differ —
the failure mode in the 2026-07-13 `blog/roof-repair-frederick-md` incident, where the
blog title didn't literally match `/services/roof-repair`'s title but both targeted the
same commercial "roof repair" intent. Full rules: `docs/seo/keyword-cannibalization-sop.md`.

| # | Check | Rule |
|---|-------|------|
| 29 | No cluster/keyword cannibalization | Look up the draft's `Cluster` and primary keyword in `memory/seo/keywords.md`. Cross-reference `memory/seo/content-log.md` for any **other already-published page** in the same cluster or targeting the same/near-synonym primary keyword. Classify intent per the SOP §1 ownership table (brand→homepage, commercial→`/services/[slug]`, local→`/service-areas/[slug]`, informational→`/blog/[slug]`) and confirm this draft's angle matches the intent its page type should own. If another live page already owns this cluster/keyword's intent and this draft targets the same angle, FAIL — do not pass a draft that duplicates another page's target intent, even with a differently-worded title |

## Step 3.5: Score Quality (for check 12)

Read the draft as a human would and assign a 1–10 quality score based on:
- **Readability** — short sentences, smooth transitions, scannable structure
- **Depth & value** — answers the search intent better than a thin/generic page; no filler
- **No fluff or repetition** — no padded sentences, no repeated claims, no restated headings

Score < 7 is a FAIL on check 12. When it fails, state the score, the top 2–3 reasons, and the specific lines to cut or tighten. Also fail check 12 if any `[VERIFY: …]` placeholder from the writer is still unresolved.

## Step 4: Determine Result

- **PASS**: All 29 checks pass
- **FAIL**: Any check fails

Checks 18 (noindex/nofollow), 19 (canonical mismatch), and 29 (cannibalization) are
hard-stops: even if everything else passes, flag these prominently in the report. 18/19
silently remove the page from search; 29 splits ranking signal between two of the site's
own pages instead of either one winning clearly.

## Step 5: Log to Memory

Append one row to `memory/seo/qa-log.md`:

```
| [YYYY-MM-DD] | [page slug or topic] | [PASS/FAIL] | [comma-separated list of failed check numbers, or "none"] | [quality score]/10 | [one-sentence notes] |
```

If PASS: update matching keywords in `memory/seo/keywords.md` from `written` to `qa-passed`.
If FAIL: update matching keywords from `written` to `qa-failed`.

Update the "Last QA run" line in `memory/seo/MEMORY.md`.

## Step 6: Report

Show a table with every check and its result, grouped by section (Content / Meta Tags & SEO Object / Structured Data / Links). Then:

**If PASS:**
```
✓ QA PASSED — [N]/29 checks passed (quality [score]/10)
Keywords updated to status 'qa-passed'.
Next step: /content-updater
```

**If FAIL:**
```
✗ QA FAILED — [N]/29 checks passed
Failed checks: [list with specific fix instructions for each]
Next step: Revise the draft and re-run /qa, or run /seo-writer to regenerate new content and refer to humor writing reference.
```

For each failed check, provide the specific fix. For example:
- Check 14 fail: "Meta description is 172 characters. Remove: '[exact phrase to cut]' to reach 160."
- Check 16 fail: "No featured image set. og:image/twitter:image will fall back to the generic site default — add a featured image before publishing."
- Check 19 fail: "canonicalUrl is set to '[wrong URL]' but this page's path is '[correct path]'. Either remove canonicalUrl or correct it — a mismatch will deindex this page in favor of the wrong URL."
- Check 20 fail: "seoTitle matches the live title on /services/[other-slug] exactly. Rewrite one to be unique."
- Check 29 fail: "This draft's cluster '[cluster]' / keyword '[keyword]' is already owned by [other page slug] (published [date], see content-log.md). Per the SOP's ownership table, [other page] is the canonical page for this intent — re-angle this draft toward [informational/local/etc.] per SOP §3, or stop if no distinct angle exists."
- Check 23 fail: "publishedDate is blank in the draft — Article schema requires datePublished. Set a publish date before this goes live."
- Check 27 fail: "Internal link to /services/gutter-guards does not resolve — no matching slug found in Sanity. Fix the link or remove it."
- Check 10 fail: "No proof point found. Add a cited stat (e.g. shingle wind rating, warranty term) and an experience signal (years in business or certification)."
- Check 11 fail: "No author attribution. Add 'Reviewed by the Shumaker Roofing install team' or a named expert."
- Check 12 fail: "Quality 5/10 — intro repeats the H1 verbatim and paragraph 3 restates paragraph 1. Cut [lines] and tighten transitions."
