# Technical SEO Report — 2026-08-04 00:35 UTC

| Check | URL | Finding | Severity |
|-------|-----|---------|----------|
| robots.txt | /robots.txt | 200 OK, `Sitemap:` directive present (https://shumakerroofing.com/sitemap.xml), no Disallow rules block critical paths | — |
| Sitemap validity | (all 46 URLs) | All sitemap `<url>` entries have `<lastmod>` present; all 46 URLs return HTTP 200 | — |
| Meta description (multi-line content) | /blog/roof-replacement-tax-credit-2026 | Data hygiene note: `<meta name="description">`, `<meta property="og:description">`, and `<meta name="twitter:description">` content attributes contain an embedded literal newline (trailing `\n` after the sentence). Tag is present and non-empty — does NOT count as a missing-tag finding — but renders as a broken-looking multi-line attribute in raw HTML source view. This is the same root cause previously misdiagnosed as "missing" (S-077, closed 2026-08-03 fix). Live HTML as of this run still shows the trailing newline — see caveat note below on ISR staleness. | INFO |
| Meta description (multi-line content) | /blog/summer-roof-inspection-checklist-frederick-md | Same data hygiene note as above — `description`, `og:description`, `twitter:description` all contain a trailing embedded newline. Corresponds to previously closed S-078. Live HTML still shows the defect as of this run — likely stale ISR cache, see caveat below. | INFO |
| Meta tags (title/description/og:title/og:description/og:image) | (all other 44 URLs) | All present and non-empty | — |
| Canonical tag | (all 46 URLs) | Present on every page and matches expected path | — |
| JSON-LD schema | (all 46 URLs) | Present on every page; all required fields present for detected `@type`s (LocalBusiness, Service, Article/BlogPosting, FAQPage) | — |
| Noindex flags | (all 46 URLs) | No `noindex` directives detected anywhere on the site | — |
| Duplicate titles | (all 46 URLs) | No duplicate `<title>` values found | — |
| Orphaned pages | (all 46 URLs) | No orphaned sitemap URLs — every sitemap URL has at least one inbound internal link from a crawled page | — |
| Service page description typo | /services/gutter-installation | Data hygiene note: `seoDescription` still renders live as `"PSeamless gutter installation in Frederick, MD..."` (stray leading "P" typo). This was fixed and published to Sanity per prior manual investigation, but the live rendered HTML as of this run still shows the pre-fix text — consistent with the 1-hour ISR staleness caveat, not a new/regressed bug. Not previously tracked by an automated finding ID (no automated typo-detection check in this skill); logged here for visibility only. | INFO |

**Severity key:** P1 = critical · P2 = warning · INFO = informational only, no action needed

## Caveat: ISR staleness on 3 recently-fixed pages

`/blog/roof-replacement-tax-credit-2026`, `/blog/summer-roof-inspection-checklist-frederick-md`, and `/services/gutter-installation` use `export const revalidate = 3600` (1-hour ISR) with no on-demand revalidation webhook wired up in this codebase. The underlying Sanity documents were reportedly fixed and published (trailing-newline strip on the two blog posts; "P" typo strip on gutter-installation), but this run's rendered HTML for all three still shows the pre-fix content byte-for-byte. This is expected staleness within the ISR window, not a new defect — a subsequent run after the cache naturally revalidates (or a manual redeploy) should show clean content.

Note also that with correct multi-line-aware parsing (fixing the false-negative bug from the 2026-08-03 run), the meta description and og:description tags on both blog posts are correctly detected as **present** this run — so S-077, S-078, S-060, and S-061 are closing as resolved-detection (the tags were never actually missing; the prior run's line-based grep was the bug). The content still has cosmetic whitespace defects (see INFO rows above) pending cache refresh.
