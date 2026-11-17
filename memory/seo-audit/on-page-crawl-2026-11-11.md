# On-Page SEO & Live Crawl Analysis — shumakerroofing.com

**Date:** 2026-11-11
**Auditor:** web-designer-dev (Hermes)
**Target:** live production site `https://shumakerroofing.com` (not the local build/codebase — that is covered separately in `memory/tech-audit/codebase-audit-2026-11-11.md`, which this report does not duplicate: performance/LCP/TBT, the broken `/logo.png` JSON-LD reference, the `/studio` robots.txt gap, and the 53-URL sitemap count are already documented there and are only referenced here, not re-derived).

**Method:** real HTTP crawl via a Python script (`requests` + `BeautifulSoup`/`lxml`), not an estimate. Seeded from the live `sitemap.xml` (53 URLs) plus the homepage, then BFS-crawled following every internal `<a href>` discovered on each fetched page, up to a practical cap of 200 pages. The crawl terminated naturally at **53 pages** — no additional internal links were discovered beyond the sitemap set, so 53 is the full reachable inventory, not a cap being hit. Each of the 69 unique images referenced across those 53 pages was also indepedently status-checked (HEAD, falling back to GET). No bot protection or rate limiting was encountered; the crawl completed in full with a 0.3s per-page / 0.05s per-image delay.

**Raw output:** `memory/seo-audit/raw-onpage-2026-11-11/` — `crawl.py` (crawler), `analyze.py` (findings extraction), `crawl_raw.json` (full per-page extracted data), `analysis.json` (structured findings), `url_inventory.csv` (flat inventory table), `keyword_analysis_output.txt` (service/location page detail dump), `check_dup_h1.py` + `static_pages_check.py` + `export_csv.py`/`extra_stats.py` (supporting scripts).

---

## 1. URL inventory summary

| Metric | Value |
|---|---|
| URLs in sitemap.xml | 53 |
| URLs crawled (reachable) | 53 |
| HTTP 200 | 53 (100%) |
| Non-200 / broken | 0 |
| Redirect chains encountered | 0 |
| Orphan pages (in sitemap, not internally linked) | 0 |
| Pages linked internally but missing from sitemap | 0 |
| Pages with `noindex`/`nofollow` | 0 |
| Pages missing a `<title>` | 0 |
| Pages missing a meta description | 0 |
| Pages missing a canonical tag | 0 |
| Site-wide image alt coverage | 467/467 = **100%** |
| Broken images (non-200) | 0 |
| Internal outbound links per page | min 27, max 48, avg 30.6 |

Full per-URL inventory (status, title, meta description, H1, word count, canonical, noindex/nofollow, alt coverage, internal link count) is in `url_inventory.csv`. No finding in this section required estimation — every number above comes from the actual fetch, re-checkable in `crawl_raw.json`/`analysis.json`.

This is a clean crawl health result: no 404s, no redirect hops, no sitemap/link-graph mismatches, no missing metadata, no missing canonicals, no broken images anywhere on the site. That's a real positive and worth stating plainly rather than manufacturing findings to pad the report.

---

## 2. Flagged issues (broken links/images, redirects, duplicates, H1s, thin content, orphans)

**Critical:** none found in this lane.

**Moderate**

1. **Duplicate H1 — `https://shumakerroofing.com/blog/roof-rejuvenation-cost-frederick-md`.** The page renders **two** `<h1>` tags with identical text ("How Much Does Roof Rejuvenation Cost in Frederick, MD?"): one in the hero banner section (`<h1 class="text-3xl md:text-5xl font-heading ...">`) and a second, separate one inside the article body (`<h1><strong>...</strong></h1>`), confirmed by direct fetch + parse (`check_dup_h1.py`). This is the only page site-wide with other than exactly one H1 — all other 52 pages have exactly one. Likely cause: the blog post's rich-text content block starts with a heading set to H1 level instead of H2, duplicating the page-template hero H1. Fix: in the Sanity content for this post, demote the in-body heading to H2 (or whatever level the portable-text renderer maps to `<h2>`).

**Minor**

2. **Thin content on 5 pages** (word-count threshold used: <300 words of visible body text):
   - `/service-areas` — 203 words (index/directory page listing the 4 location pages — thin by design, not a landing-page problem, but it's also doing zero on-page keyword work of its own)
   - `/projects` — 221 words
   - `/contact` — 245 words
   - `/testimonials` — 287 words
   - `/faqs` — 298 words

   None of these are core organic-targeting pages (they're utility/directory pages), so this is Minor rather than Moderate/Critical — but `/service-areas` in particular is a missed opportunity: it's the hub page for four city landing pages and currently carries almost no unique copy or internal context about the service area, which weakens its own ranking potential and the topical signal it could pass to the location pages it links to.

3. **Copy inconsistency — `/roofs-for-heroes`.** Title tag and nav/URL use the plural "Roofs for Heroes," but the page's own H1 reads **"Roof for Heroes"** (singular) — confirmed via direct fetch. Small, but it's a visible on-page inconsistency on a page that's explicitly a brand/program name.

**No finding / clean (stated explicitly per the acceptance criteria, not left implicit):**
- No broken internal links of any kind (0 non-200 across all 53 crawled pages).
- No broken images (0 of 467 images site-wide failed a status check).
- No redirect chains anywhere in the internally-linked graph.
- No duplicate title tags across any of the 53 pages.
- No duplicate meta descriptions across any of the 53 pages.
- No orphan pages — every sitemap URL is reached by at least one internal link from another page.
- No internally-linked page is missing from the sitemap — the link graph and sitemap are in full agreement.
- No pages with multiple/missing H1 except the one blog post flagged above.
- No pages with missing title, missing meta description, or missing canonical tag.
- No title tags outside a reasonable 20–65 character range; no meta descriptions outside a reasonable 50–165 character range (checked programmatically, zero flagged).

---

## 3. On-page topical/keyword relevance — service pages & location pages

Shumaker Roofing runs two parallel page families for local SEO: **13 service pages** (`/services/*`) and **4 location pages** (`/service-areas/*`: Chambersburg PA, Frederick MD, Hagerstown MD, Reston VA). This is the core structural pattern multi-location contractors use to rank for "[service] in [city]" queries, so it's the right shape — but the execution has real gaps.

### 3.1 Service pages default to one city (Frederick, MD) — no service×location combination pages

Of the 13 service pages, **9 have "Frederick, MD" (or "Frederick MD") baked directly into both the title tag and H1**:
`chimney-maintenance`, `gutter-installation`, `metal-roofing`, `residential-roofing`, `roof-installation`, `roof-repair`, `roof-replacement`, `siding`, `storm-damage-restoration`.

That means a prospect searching "roof repair Hagerstown MD" or "gutter installation Chambersburg PA" lands, at best, on a page whose title and H1 explicitly say "Frederick, MD" — a different city than they searched. The site has location pages for Chambersburg, Hagerstown, and Reston, but **no page anywhere pairs a specific service with a specific non-Frederick city** (e.g. no `/services/roof-repair-hagerstown-md` or equivalent). For a 4-metro roofing contractor, this is the single biggest on-page SEO gap found in this crawl — Frederick absorbs effectively all of the service-level keyword targeting, while Chambersburg/Hagerstown/Reston only get generic, single city-overview pages with no service-specific depth (each location page is 514–602 words covering all 13 services in overview form, vs. 600–1,160 words per dedicated Frederick service page).

- **Moderate** — missing service-city combination pages/content for Chambersburg, Hagerstown, and Reston across all 13 services. (`/service-areas/chambersburg-pa`, `/service-areas/hagerstown-md`, `/service-areas/reston-va` vs. every URL under `/services/`)

### 3.2 Title/H1 location mismatches on 3 service pages

Within the 13 service pages, 3 have a title and H1 that don't agree on location targeting at all — a basic on-page coherence problem independent of the multi-city issue above:

- **`/services/commercial-flat-and-low-slope-roofing-restoration`** — title is `"Commercial Flat & Low Slope Roofing Restoration | Contact Us"` (no city, and the `| Contact Us` suffix breaks the brand pattern every other page uses, `| Shumaker Roofing`). H1 also has no city. This page targets the service topic but zero location signal anywhere on-page.
- **`/services/skylight-installation`** — title includes `"In Frederick, MD"`, but the H1 is just `"Skylight Installation"` — no location. Title and H1 disagree.
- **`/services/solar-contractor`** — title includes `"In Frederick MD"`, H1 is just `"Solar Contractor"` — same title/H1 mismatch.
- **`/services/roof-rejuvenation`** — inverse mismatch: title is `"Expert Roof Rejuvenation Services | Shumaker Roofing Company"` (no city), but H1 is `"Roof Rejuvenation in Frederick, MD"` (has city). Title doesn't carry the same local signal the H1 does.

**Moderate** (each, cite the URL) — these 4 pages have title/H1 that don't reinforce the same keyword target, weakening the page's coherence for the query it's trying to rank for.

### 3.3 Weak/absent internal linking from service pages to location pages

Checked every service page's internal link list for links to any of the 4 `/service-areas/*` pages (the link graph, not a guess — see `keyword_analysis_output.txt` lines 726–739):

| Service page | Links to location pages |
|---|---|
| `/services/commercial-flat-and-low-slope-roofing-restoration` | **0 of 4** |
| `/services/skylight-installation` | **0 of 4** |
| `/services/roof-repair` | 1 of 4 (frederick-md only) |
| `/services/solar-contractor` | 1 of 4 (frederick-md only) |
| `/services/metal-roofing` | 3 of 4 (missing chambersburg-pa) |
| `/services/roof-rejuvenation` | 3 of 4 (missing frederick-md) |
| `/services/roof-replacement` | 3 of 4 (missing frederick-md) |
| `/services/siding` | 3 of 4 (missing frederick-md) |
| `/services/chimney-maintenance`, `gutter-installation`, `residential-roofing`, `roof-installation`, `storm-damage-restoration` | 4 of 4 ✓ |

By contrast, **all 4 location pages link to all 13 service pages uniformly** (confirmed, see lines 742–745 of the same file) — so the weak link is one-directional: location→service linking is complete and consistent, service→location linking is inconsistent and, on 2 pages, entirely absent.

- **Moderate** — `/services/commercial-flat-and-low-slope-roofing-restoration` and `/services/skylight-installation` have zero internal links to any location page, meaning a visitor (or crawler) on those two service pages has no on-page path into the location pages at all, and those two services get no location-page-to-service-page "topical reinforcement" in that direction either.
- **Minor** — the remaining service pages link to a partial, seemingly arbitrary subset of the 4 location pages rather than all 4 consistently (e.g. `/services/roof-repair` only links to `frederick-md`, dropping the other 3 cities a prospect in Hagerstown/Chambersburg/Reston might also be comparing). Standardizing every service page to link to all 4 location pages (matching what the location pages already do for services) would be a small template fix with real internal-linking upside.

### 3.4 What's working

- Titles/H1s on the 4 location pages are coherent and correctly city-targeted: e.g. `/service-areas/hagerstown-md` → title `"Roofing Contractor Hagerstown, MD | Shumaker Roofing"`, H1 `"Your Local Roofing Company Hagerstown, MD"`. No mismatches found on any location page.
- The 9 Frederick-targeted service pages have solid title/H1 agreement and substantive word counts (601–1,162 words), consistent brand-name suffixing (`| Shumaker Roofing`), and trust signals in meta descriptions ("veteran-owned," "since 1946," "CertainTeed") — reasonable on-page SEO execution for the one city they do target.
- The blog (21 posts, 1,137–2,107 words each) is heavily Frederick/Maryland-topic-clustered around roof rejuvenation, gutters, and seasonal damage — genuinely substantial supporting content, not thin filler.
- 100% image alt coverage and clean canonical/title/meta-description coverage across all 53 pages (§1/§2) means the technical on-page foundation is solid; the gaps here are strategic/content-structure gaps, not technical hygiene gaps.

---

## Summary of findings by severity

**Critical:** none in this lane (performance, security, and the `/logo.png` JSON-LD bug are Critical findings already filed in `codebase-audit-2026-11-11.md` — not re-counted here).

**Moderate**
1. Duplicate `<h1>` on `/blog/roof-rejuvenation-cost-frederick-md` (two identical H1 tags — hero + in-article). (§2)
2. No service×city combination pages/content exist for Chambersburg PA, Hagerstown MD, or Reston VA across any of the 13 services — all service-level keyword targeting defaults to Frederick, MD. (§3.1)
3. Title/H1 location mismatch on `/services/commercial-flat-and-low-slope-roofing-restoration`, `/services/skylight-installation`, `/services/solar-contractor`, `/services/roof-rejuvenation`. (§3.2)
4. `/services/commercial-flat-and-low-slope-roofing-restoration` and `/services/skylight-installation` have zero internal links to any of the 4 location pages. (§3.3)

**Minor**
5. Thin content (<300 words) on `/service-areas`, `/projects`, `/contact`, `/testimonials`, `/faqs` — all utility/directory pages, not core landing pages, but `/service-areas` in particular does little topical work for a hub page. (§2)
6. "Roof for Heroes" (singular) H1 vs. "Roofs for Heroes" (plural) everywhere else on `/roofs-for-heroes`. (§2)
7. Inconsistent/partial service→location internal linking on the remaining 8 service pages that link to some but not all 4 location pages. (§3.3)

**No finding / clean**
- 0 broken links, 0 broken images (467/467 alt-tagged), 0 redirect chains, 0 duplicate titles, 0 duplicate meta descriptions, 0 orphan pages, 0 sitemap/link-graph mismatches, 0 missing title/meta/canonical tags, 0 noindex/nofollow pages — across all 53 live, crawled URLs. (§1, §2)
- Location pages (4/4) have fully coherent title/H1/location targeting and link to all 13 service pages uniformly. (§3.3, §3.4)
- Blog content (21 posts) is substantial (1,137–2,107 words) and topically clustered around real service/seasonal themes, not thin filler. (§3.4)

---

## Stop condition check

The live site did **not** block or rate-limit the crawl at any point — all 53 sitemap URLs plus homepage were reached, all 69 referenced images were status-checked, and the crawl completed to natural termination (BFS queue emptied with 0 new internal links discovered beyond the sitemap set) well under the 200-page practical cap. Nothing here was estimated or fabricated to fill in for a blocked crawl.
