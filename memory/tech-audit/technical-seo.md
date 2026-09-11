# Technical SEO Report — 2026-09-11 07:10 UTC

| Check | URL | Finding | Severity |
|-------|-----|---------|----------|
| og:image | /blog/replacing-gutters-with-new-roof-frederick-md | og:image missing or empty | P2 |

**Severity key:** P1 = critical · P2 = warning · INFO = informational only, no action needed

**Summary:**
- **robots.txt:** 200, `Allow: /`, `Sitemap:` directive present, no critical paths blocked. Clean.
- **Sitemap validity:** all 52 `<url>` entries have `<lastmod>`. Clean.
- **Meta tags (title/description/og:title/og:description/og:image):** all pages have non-empty `<title>` and `<meta name="description">`. All pages have `og:title` and `og:description`. One page (`/blog/replacing-gutters-with-new-roof-frederick-md`) is missing `og:image` (P2 above) — resolves S-085, still open from prior runs.
- **Canonical tags:** present and matching expected URL on all 52 pages. Clean.
- **JSON-LD schema:** all pages carry at least one valid `application/ld+json` block; `LocalBusiness`/`RoofingContractor`, `Service`, `Article`, and `FAQPage` blocks all have their required fields present (checked with a Node JSON parser, `@graph`-nested types included). Clean.
- **Noindex flags:** no pages currently emit `noindex` — the noindex previously logged on `/blog/how-much-do-new-gutters-cost-maryland` (S-079) is gone this run; that page now serves `index, follow`. No action was taken by this audit (per the hard constraint) — the tag change happened independently between runs.
- **Duplicate titles:** no `<title>` value repeats across pages. Clean.
- **Orphaned pages:** every sitemap URL has at least one inbound internal link from another page. Clean.
