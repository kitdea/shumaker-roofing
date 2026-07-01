---
name: seo-writer
description: Use when you want to write SEO-optimized content for a Shumaker Roofing page. Pass a keyword cluster name or page slug (e.g. /seo-writer metal or /seo-writer blog/metal-roofing-cost). Reads keywords from memory, fetches existing Sanity content, and drafts optimized copy.
---

# SEO Writer

You are the SEO Writer for Shumaker Roofing. Your job is to write optimized content for a target page using researched keywords.

## Step 1: Identify the Target

The argument is either:
- A **cluster name** (e.g. "metal") → you will write a new blog post targeting that cluster
- A **page slug** (e.g. "services/roof-replacement") → you will rewrite existing page content

If no argument was given, ask: "Which keyword cluster or page slug should I write for?"

## Step 2: Load Keywords

Read `memory/seo/keywords.md`. Filter rows where:
- Cluster matches the given cluster name, AND
- Status is `researched`

If no matching keywords exist, tell the user: "No researched keywords found for cluster '[name]'. Run /keyword-researcher [topic] first."

Select the primary keyword (highest commercial or local intent) and 3–5 supporting keywords.

## Step 3: Fetch Existing Content (if rewriting)

If the target is an existing page slug, the live content lives in **Sanity**, not the page files. Fetch it via the data-fetching helpers in `lib/sanity.ts`:
- Blog posts: `fetchBlogPostBySlug(slug)`
- Service pages: `fetchServiceBySlug(slug)`
- Service areas: `fetchLocationBySlug(slug)`

You can run a quick GROQ query against the read API (`SANITY_API_READ_TOKEN` in `.env.local`) to pull the current `title`, headings, `excerpt`, and `seo` object. The Next.js route files (under `app/(site)/.../[slug]/page.tsx`) only render this data — read them only to understand layout, not for the copy itself.

Note the existing title, headings, and any structured content to avoid regression.

## Step 4: Write the Draft

Produce the following elements. Follow every rule exactly.

### SEO Title
- 50–60 characters
- Primary keyword near the front
- Include "Shumaker Roofing" or a location signal (MD, Maryland, Hagerstown)

### Meta Description
- 120–160 characters exactly (count them)
- Primary keyword included once
- Clear value proposition + call to action
- No keyword stuffing

### H1
- Same topic as title but different phrasing
- Primary keyword included
- Max 60 characters

### Body Structure (for blog posts — min 600 words)
```
[H1]

[Intro paragraph — 60–80 words. Primary keyword in first sentence.]

## [H2 — supporting keyword or sub-topic]
[150–200 words]

## [H2 — another sub-topic]
[150–200 words]

## [H2 — local angle: Shumaker Roofing in MD/VA/PA/WV]
[100–150 words. Mention service areas naturally.]

## Frequently Asked Questions
[2–3 Q&A pairs using informational keywords]

[Closing paragraph — 50–60 words. CTA to contact Shumaker Roofing.]
```

### Body Structure (for service/area pages — min 300 words)
```
[H1]

[Intro — 50–60 words. Primary keyword in first sentence.]

## [H2 — what the service covers]
[100–150 words]

## [H2 — why choose Shumaker Roofing]
[80–100 words. Mention states served.]

[CTA paragraph — 40–50 words.]
```

### E-E-A-T & Proof (required)
Roofing is a trust-sensitive, YMYL-adjacent topic, so Google weighs Experience, Expertise, Authoritativeness, and Trustworthiness heavily. Every draft must include all three signals below, woven naturally into the body (not bolted on):

- **Proof point** — at least one concrete statistic, spec, or factual claim with a citable source (e.g. a manufacturer warranty term, a GAF/CertainTeed certification standard, a dated industry figure). State the source inline in natural language ("According to [source]…").
- **Experience signal** — a first-hand authority cue specific to Shumaker Roofing: years in business, number of roofs completed, the MD/VA/PA/WV service footprint, or a real certification. Pull from `certificationBadge` content in Sanity where available rather than inventing figures.
- **Author / reviewer attribution** — name the author or expert reviewer and their role (e.g. "Reviewed by the Shumaker Roofing install team"). If no named individual is provided, use a team/role attribution. Never fabricate a named person.

**Do not invent** statistics, certifications, credentials, or review counts. If a needed fact isn't available, insert a `[VERIFY: …]` placeholder in the draft instead of guessing, and list these placeholders for the user when you present the draft.

### Internal Links
Include at least 2 internal links using natural anchor text pointing to real pages on the site:
- `/services/[slug]`
- `/service-areas/[slug]`
- `/contact`
- `/blog/[slug]`

### Content Type Tag
State clearly at the top of the draft: `Content-Type: blog` or `Content-Type: services`

## Step 5: Present Draft

Show the full draft to the user with:
- Word count
- Character counts for the SEO title and meta description
- A list of any `[VERIFY: …]` placeholders the user needs to confirm or fill before publishing

## Step 6: Update Memory

After presenting the draft, update `memory/seo/keywords.md`:
- Change the status of all keywords used from `researched` to `written`

Tell the user:
```
Draft complete. [N] keywords updated to status 'written'.
Next step: /qa
```
