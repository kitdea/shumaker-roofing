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

> **Read the document before checking it.** Checks 13–21 and 23 are about *stored field values*,
> not about what the draft text appears to say or what `/seo-writer` reported it would write. A
> conversational draft is not a document — fields the writer never set do not exist, and a check
> evaluated against the conversation will pass on a field that is `null`.
>
> Before running the Meta Tags and Structured Data sections, query the actual document and work
> from the result:
>
> ```
> *[_id == $docId][0]{title, "slug": slug.current, publishedDate, excerpt, seo,
>                     "blocks": count(content), "faqs": count(faqItems),
>                     "author": authorRef->name, "legacyAuthor": author,
>                     "img": featuredImage.asset._ref, "alt": featuredImage.alt}
> ```
>
> Use `perspective: raw` and pass the **draft** id (`drafts.<uuid>`) when QA'ing a pre-publish
> draft. If the draft does not exist in Sanity yet, say so and mark every stored-field check
> `UNVERIFIABLE` — never `PASS`.
>
> **For each stored-field check, echo the observed value next to the verdict** — e.g.
> `18 noindex/nofollow: PASS (noindex=false, nofollow=false)`, `23 datePublished: FAIL
> (publishedDate=null)`. A verdict with no observed value beside it is not a completed check.
> This is a hard requirement: a 2026-07-16 run logged 29/29 PASS on a draft that had
> `seo.noindex: true`, `seo.nofollow: true`, and `publishedDate: null`, because every check was
> evaluated against the conversation instead of the document.

### Content

| # | Check | Rule |
|---|-------|------|
| 1 | Keyword in title | Primary keyword appears in SEO title |
| 2 | Keyword in H1 | Primary keyword appears in H1 |
| 3 | Keyword in first 100 words | Primary keyword appears in the opening paragraph |
| 4 | No keyword stuffing | Primary keyword density < 3% (count occurrences / total words × 100) |
| 5 | H2s present | At least 2 H2 headings in the body |
| 6 | Heading hierarchy valid | Exactly one H1; no heading level is skipped (e.g. H2 → H4 with no H3); every H3 sits under an H2 (never opens a section); no lone H3 — a section either has two or more H3s or none, per `/seo-writer` Heading Hierarchy. Print the outline indented to verify |
| 7 | Word count | Blog posts **1000–1500 words** — this is a range, not a floor: under 1000 or over 1500 fails (per `/seo-writer` Body Structure). Service/area pages ≥ 300 words (per Content-Type from Step 0) |
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
| 18 | noindex/nofollow not set | Read `seo.noindex` and `seo.nofollow` from the queried document and **echo both observed booleans** in the verdict. Neither may be `true` unless the user explicitly intended this page to be excluded from search — hard-stop if either is `true` without explicit confirmation. `lib/seo.ts:60-63` turns these into a real `robots` tag, so a `true` here ships a live page that ranks for nothing and passes no link equity. Note the sitewide convention: all published pages have both `false`. Absent/`null` is acceptable (`resolveSeoMetadata` coerces to `false`) but report it as absent, not as `false` |
| 19 | Canonical URL correct | If `canonicalUrl` is set on the draft, it must exactly match the page's own path (`{SITE_URL}` + slug path). A canonical pointing elsewhere will deindex this page in favor of another — flag any mismatch as a fail, not a warning |
| 20 | No duplicate title/description | `seoTitle` and `seoDescription` do not match another live page's values. Spot-check via a GROQ query for exact-match `seo.seoTitle` or `seo.seoDescription` across `blog`, `services`, and `location` documents (same Sanity Query API pattern used in `/seo-writer` Step 3) |
| 21 | Slug is SEO-friendly | Lowercase, hyphenated, reasonably short, contains the primary keyword or a close variant. If QA'ing a rewrite, confirm the slug is unchanged from the live version (changing it breaks the existing URL and requires a redirect — flag if changed without a noted redirect plan) |

### Structured Data (JSON-LD)

Confirm the draft supplies everything the page's schema block needs. Match required fields to content type — these mirror the `@type` validation `tech-audit` runs against live HTML, so catching gaps here prevents them from ever surfacing there.

| # | Check | Rule |
|---|-------|------|
| 22 | Schema type identified | Blog → `Article`; service page → `Service`; location page → `LocalBusiness`/`Service` per existing pattern in `app/(site)/services/[slug]/page.tsx` equivalent |
| 23 | Article schema fields | For blog drafts: `headline` (from `title`), `author` (`authorRef->name`, falling back to the legacy `author` string), and `datePublished` (Sanity `publishedDate`). **Read each from the queried document and echo the observed value.** `publishedDate` must be a non-null datetime *now* — "will be set before publish" is not a pass, and phrasing it that way is what let a `null` field log as PASS on 2026-07-16. If it is null, FAIL and name the fix: set `publishedDate` before publishing |
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

### Brand Policy (DIY & Pricing)

Two business rules `/seo-writer` enforces at draft time. They are checked here because they
are the ones with real-world cost: DIY content puts a homeowner on a roof and competes with
the service being sold; an unqualified price gets read as a quote. Both are **hard-stops** —
they don't trade off against a good quality score.

| # | Check | Rule |
|---|-------|------|
| 30 | No DIY content | The draft contains no DIY instructions (step-by-step repair/installation, tool or material shopping lists, ladder/roof-access guidance) and does not frame DIY as a reasonable option — including as the cheap route, a quick fix, an "if you're handy" aside, a temporary patch, or a DIY-vs-pro comparison treating both as valid paths. Scan for imperatives telling the reader to climb, patch, seal, nail, caulk, or replace anything themselves. **Allowed:** ground-level observation (what to look for from the ground), ground-level upkeep between professional visits (keeping gutters clear, trimming branches, watching the attic) provided it involves no ladder or roof access, and telling a reader their roof does *not* need work — the honest trade-off per `/seo-writer` Voice & Tone is scoping professional work, not DIY. FAIL on any instructional content; note the exact lines |
| 31 | Routes to the experts | At every point a reader would ask "what do I do about this?", the answer routes to a Shumaker inspection/estimate via `/contact` or a relevant `/services/[slug]`, in natural anchor text. A draft that diagnoses a problem and leaves the reader with no professional next step fails |
| 32 | Pricing is justified | If the draft contains any price, range, or dollar figure, the primary keyword must be an explicit cost term that demands it. A price bolted onto a non-cost post (a material guide, a maintenance post) fails — cost content is deprioritized per `/seo-writer` Step 4, and Shumaker doesn't publish fixed pricing. If the draft has no pricing, this check passes automatically |
| 33 | Pricing is sourced and qualified | For any figure present: it is a **sourced, dated industry range** with the source named inline (e.g. "2026 industry ranges of $6–15/ft"), never invented, and never presented as a Shumaker-specific quote unless the user explicitly supplied it. An unsourced or undated number fails. A Shumaker-specific price with no user-supplied origin fails |
| 34 | Pricing disclaimer present and adjacent | For any figure present: a disclaimer appears **immediately adjacent to the first pricing figure** — same section, not buried in the closer or a footnote. It must convey, in natural prose, that these are general industry estimates and not a quote, that actual cost depends on the specific roof, and that only an on-site estimate gives a real number — and it must link to `/contact`. Placement is part of the check: a correct disclaimer in the wrong place still fails, because a reader who skims the figure never reaches it. Match the pattern the gutter post established (`memory/seo/content-log.md`, 2026-07-16). If the draft has no pricing, this check passes automatically |

### Banned AI Words

Distinct from check 12's quality score (where content-mill tells cost points toward a 7/10
floor). This check is a **hard-stop**, not a score input — a draft can score 8/10 on Voice &
Tone's own criteria and still fail here if it contains a HARD BAN word or banned structure.
Run the full self-check from `docs/content-style/banned-ai-words.md` (its own "Ban-specific
self-check" section) against the complete draft, not just the summary carried in `/seo-writer`.

| # | Check | Rule |
|---|-------|------|
| 35 | No HARD BAN words | Zero instances of any HARD BAN word/phrase from `docs/content-style/banned-ai-words.md` (all variants: tense, plural, hyphenation, -er, -ing, -ity, -ful, -ly). Quotes, brand names, product names, and literal (non-figurative) technical use are exempt — verify any flagged instance isn't a carve-out before failing it |
| 36 | EARN IT words used correctly | Any EARN IT word (ensure, efficient, optimal, key, thrive, enhance, etc.) is literally accurate and no plainer word would fit better. Flag lazy use, not the word itself |
| 37 | No banned phrases or sentence structures | No filler/empathy/service-template openers, no hype phrases or idioms from the banned-phrases list, and none of the banned sentence structures (participial -ing benefit-closer, "not only X but also Y", staccato triads, "from X to Y" false ranges, rhetorical-question-then-short-answer, "more than just X") |
| 38 | No formatting/punctuation tells | Zero em dashes or en dashes anywhere in the draft. No mid-sentence bold for emphasis, no emoji, no leaked markdown in CMS-bound fields |
| 39 | Interchangeability test | For at least the intro and one body section, confirm no sentence is generic enough that a competitor roofing site could paste it verbatim — cite the specific local/numeric/named detail that makes it Shumaker's |

### Clarity & Comprehension

Mirrors the C1–C8 ruleset in `/seo-writer` Step 4 (same rule IDs — cite them by ID when
reporting so the writer knows exactly which rule to re-apply). Distinct from check 12's
quality score: that judges whether the draft is *good*, this judges whether each sentence is
*parseable*. The target is single-idea clarity, **not** sentence length — a short sentence
carrying two ideas fails check 42, and a long single-idea sentence passes it. This is not a
style preference: NLP models approximate human comprehension, so a draft that reads clearly
to a homeowner is also better understood by AI search systems.

These are score-affecting failures, not hard-stops — but a draft failing three or more of
them is a rewrite, not a line edit. Say so in the report.

| # | Check | Rule |
|---|-------|------|
| 40 | Specific over general (C1) | No vague noun, verb, quantifier, or qualifier where a specific one exists. "Lasts a long time" should be the actual warranty term or service life; "weather damage" should name the mechanism (hail, wind uplift, ice damming); "costs more" should name what drives the difference. Quote each vague term found and give the specific replacement |
| 41 | Effect over justification (C2) | No justification clause ("this is because…", "in order to…", "the reason for this is…") unless the reasoning changes what the reader does. State what happens. **Exempt:** the *why it's pro work* explanation the No DIY rule requires (check 30) — that reasoning is reader-actionable and must stay |
| 42 | One idea per sentence (C3) | No sentence carries unrelated clauses forcing a mid-sentence context switch. Flag by quoting the sentence and naming the two ideas. Judge by idea count, never by word count |
| 43 | No anthropomorphizing (C4) | No decision-making, wanting, or intent given to systems, algorithms, or materials — shingles don't "decide" to fail, an algorithm doesn't "want" anything. Describe what the thing does |
| 44 | No redundant modifier pairs (C5) | No pairs where both words signal the same thing ("simultaneous parallel", "advance planning", "completely eliminate", "free gift", "past history"). One survives |
| 45 | One definition per sentence (C6) | No sentence defines two concepts. Trade terms (drip edge, ice-and-water shield, step flashing) each get their own sentence |
| 46 | Length not used as a proxy (C7) | No sentence split or shortened purely to hit a rhythm or word target. A long single-idea sentence is correct and supports the sentence-rhythm variation `/seo-writer` Voice & Tone requires — do not fail one for length alone, and do not pass a choppy draft just because its sentences are short |
| 47 | Jargon glossed or replaced (C8) | Every trade term an average homeowner wouldn't know is either replaced with plain language or glossed **in its own sentence** — not in a mid-sentence parenthetical, which is itself a road bump (see check 42). Keeping the vocabulary is correct; leaving it unexplained is not |

**Where this sits against the other checks.** Checks 40–47 govern sentence *construction*;
checks 35–39 and the Step 3.5 voice criteria govern *register*. They rarely collide. Where
they genuinely do, an intentional stylistic fragment from Voice & Tone survives, and 40–47
win everywhere else. Checks 35–39 (banned AI words) outrank both — a clearer sentence built
from a HARD BAN word still fails 35.

## Step 3.5: Score Quality (for check 12)

Read the draft as a human would and assign a 1–10 quality score based on:
- **Readability** — one idea per sentence, smooth transitions, scannable structure. Judge comprehension, not sentence length: a long single-idea sentence is fine, and a run of short choppy ones is not automatically good. Construction defects belong to checks 40–47; don't double-penalize them here
- **Depth & value** — answers the search intent better than a thin/generic page; no filler
- **No fluff or repetition** — no padded sentences, no repeated claims, no restated headings
- **Lists used honestly** — any bulleted/numbered list is genuinely a set or a sequence, with parallel items (numbered only where order matters). Prose chopped into bullets to break up a long section is a defect. Zero lists is fine when nothing in the topic is enumerable; a list under every H2 is padding. Roughly 1–3 per blog post
- **Trade voice** — reads like a contractor who has been on a roof, not a search result. Correct, in-passing use of the vocabulary (drip edge, flashing, pipe boots, decking, ridge vent); at least one thing a homeowner would get wrong; regional specificity (Mid-Atlantic freeze-thaw, ice dams, spring hail) where the topic allows. Generic-but-accurate content that any contractor anywhere could have published caps the score at 6
- **No content-mill tells** — none of the banned patterns from `/seo-writer` Voice & Tone: throat-clearing openers ("In today's world…", "When it comes to…"), LLM connective tissue ("Moreover", "Furthermore", "In conclusion") as paragraph-opening tics, the triad reflex ("durable, affordable, and reliable"), hollow hedging ("varies depending on a variety of factors" with no factors named), a section's first sentence restating its H2, or a closer that summarizes instead of directing. Each instance costs a point; three or more caps the score at 6
- **Humor, where used** — reads as wry recognition, not a joke: no roof puns, no dad-joke setups, nothing punching down at the homeowner's ignorance, nothing at all on storm damage. Confined to intro/closer/asides, never touching a proof point, statistic, or price. Humor that fails this test is a defect, not a neutral — but its *absence* is never a defect

Score < 7 is a FAIL on check 12. When it fails, state the score, the top 2–3 reasons, and the specific lines to cut or tighten. Quote the offending line for voice/list findings — "this reads like a template" is not actionable; "cut 'When it comes to roofing materials, there are many factors' — start with the specific" is. Also fail check 12 if any `[VERIFY: …]` placeholder from the writer is still unresolved.

## Step 4: Determine Result

- **PASS**: All 47 checks pass
- **FAIL**: Any check fails

Checks 18 (noindex/nofollow), 19 (canonical mismatch), 29 (cannibalization), 30 (DIY
content), 34 (missing pricing disclaimer), and 35 (HARD BAN words) are hard-stops: even if
everything else passes, flag these prominently in the report. 18/19 silently remove the page
from search; 29 splits ranking signal between two of the site's own pages instead of either
one winning clearly; 30 puts a homeowner on a roof and competes with the service being sold;
34 lets a published number be read as a firm quote; 35 is the single strongest AI-generated
tell and undermines trust in the whole page regardless of how good the content underneath it is.

Checks 30–35 are **business rules and brand-voice rules, not SEO preferences or style
suggestions** — a draft that would rank well and scores 9/10 on quality still fails if it
teaches DIY, prices without a disclaimer, or contains a single HARD BAN word. Do not trade
these off against quality or let a strong draft argue its way past them.

Checks 40–47 are not hard-stops, but three or more failures across them means the draft has a
systemic construction problem — report it as "rewrite the affected sections", not as a list of
individual line edits.

## Step 5: Log to Memory

Append one row to `memory/seo/qa-log.md`:

```
| [YYYY-MM-DD] | [page slug or topic] | [PASS/FAIL] | [comma-separated list of failed check numbers, or "none"] | [quality score]/10 | [one-sentence notes] |
```

If PASS: update matching keywords in `memory/seo/keywords.md` from `written` to `qa-passed`.
If FAIL: update matching keywords from `written` to `qa-failed`.

Update the "Last QA run" line in `memory/seo/MEMORY.md`.

## Step 6: Report

Show a table with every check and its result, grouped by section (Content / Meta Tags & SEO Object / Structured Data / Links / Brand Policy / Banned AI Words / Clarity & Comprehension). Then:

**If PASS:**
```
✓ QA PASSED — [N]/47 checks passed (quality [score]/10)
Keywords updated to status 'qa-passed'.
Next step: /content-updater
```

**If FAIL:**
```
✗ QA FAILED — [N]/47 checks passed
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
- Check 6 fail: "H2 'What Drives the Cost' is followed by a single H3 'Aluminum' with no sibling. Either add the other material H3s (Copper, Steel) or drop the lone H3 and keep the section as prose."
- Check 7 fail: "Draft is 780 words — under the 1000-word standard. Add substance (a deeper angle on [topic] or an extra FAQ pair), not filler."
- Check 30 fail: "Lines [x–y] give step-by-step instructions for sealing a pipe boot, and the 'If you're handy' aside frames DIY as a valid option. Cut both. Replace with what the reader can observe from the ground (staining, granules in the gutter), what it likely means, and a link to /services/roof-repair for the inspection."
- Check 31 fail: "The post diagnoses three failure signs but never routes to an inspection. Add a natural-anchor link to /contact or the relevant /services/[slug] where the reader would ask 'what now?'"
- Check 32 fail: "Primary keyword is 'types of gutters for homes' — an informational term — but the draft includes a $6–15/ft price range. Cost content is deprioritized; cut the pricing section entirely rather than adding a disclaimer to a post that didn't need a price."
- Check 33 fail: "'$8,000–$12,000 for a typical replacement' has no source or date, and reads as a Shumaker figure. Replace with a sourced, dated industry range with the source named inline, or cut it."
- Check 34 fail: "Price range appears in the second H2 section but the disclaimer is in the closing paragraph, six sections later. Move it immediately adjacent to the first figure — a reader who skims the number never reaches the closer."
- Check 35 fail: "Paragraph 2 uses 'seamless' and the closer uses 'unparalleled craftsmanship' — both HARD BAN words per docs/content-style/banned-ai-words.md. Cut both; the closer already has the disclaimer's real detail to lean on."
- Check 37 fail: "Intro opens with 'When it comes to roof repairs in Frederick,' — a banned filler opener. Cut it and start with the specific situation (a leak, a sagging line) instead. Also flags a participial benefit-closer at the end of H2 3: '…, giving you peace of mind.' Rewrite as a direct sentence or cut."
- Check 38 fail: "Three em dashes in the body (paragraph 4, FAQ answer 2, closer). Replace each with a comma, period, or parenthetical per the ban list — this is the single strongest AI tell and reads as a mechanical fail regardless of content quality."
- Check 39 fail: "The local-angle H2 reads 'We proudly serve homeowners throughout the region with quality roofing services' — this sentence could be pasted onto any roofing site's page with a find-and-replace on the city name. Replace with the actual detail: which neighborhoods, what's specific about older housing stock there, a named recent job."
- Check 40 fail: "Intro says the roof 'holds up well for a long time' (C1). Replace with the specific claim the E-E-A-T proof point already supports — the manufacturer's 30-year limited warranty term."
- Check 41 fail: "H2 2 opens 'The reason contractors recommend ice-and-water shield is because the code requires it in valleys' (C2). The reasoning doesn't change what the homeowner does. Cut to: 'Code requires ice-and-water shield in the valleys.'"
- Check 42 fail: "'Most leaks start at the flashing, and a hostname is the domain your site is served from' — two unrelated ideas in one sentence (C3). Split them, or cut the second if it isn't load-bearing for the section."
- Check 43 fail: "'Google's crawler decides how much of your site it wants to visit' (C4). Crawlers don't want or decide. Rewrite as what happens: 'Google limits how many pages it requests from one site.'"
- Check 44 fail: "'simultaneous parallel connections' (C5) — both words signal concurrency. Cut to 'parallel connections.'"
- Check 45 fail: "The crawl-capacity sentence defines both the connection count and the time delay between requests (C6). Give each its own sentence."
- Check 46 fail: "Paragraphs 3–5 were chopped into seven-word sentences with no idea boundary between them (C7). Sentence length is not the target — rejoin the fragments that belong to one idea and let the rhythm vary."
- Check 47 fail: "'step flashing' appears three times with no gloss (C8), and 'pipe boot (the rubber collar around a vent pipe)' buries its definition mid-sentence. Give each term a plain-language sentence of its own the first time it appears."
