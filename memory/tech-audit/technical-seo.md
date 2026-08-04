# Technical SEO Report — 2026-08-04 08:40 UTC

| Check | URL | Finding | Severity |
|-------|-----|---------|----------|
| robots.txt | /robots.txt | 200 OK, `Sitemap:` directive present (https://shumakerroofing.com/sitemap.xml), no Disallow rules block critical paths | — |
| Sitemap validity | (all 46 URLs) | All sitemap `<url>` entries have `<lastmod>` present; all 46 URLs return HTTP 200 | — |
| Meta tags (title/description/og:title/og:description/og:image) | (all 46 URLs) | All present and non-empty | — |
| Canonical tag | (all 46 URLs) | Present on every page and matches expected path | — |
| JSON-LD schema | (all 46 URLs) | Present on every page; all required fields present for detected `@type`s (LocalBusiness, Service, Article, FAQPage) | — |
| Noindex flags | (all 46 URLs) | No `noindex` directives detected anywhere on the site | — |
| Duplicate titles | (all 46 URLs) | No duplicate `<title>` values found | — |
| Orphaned pages | (all 46 URLs) | No orphaned sitemap URLs — every sitemap URL has at least one inbound internal link from a crawled page | — |

**Severity key:** P1 = critical · P2 = warning · INFO = informational only, no action needed

## Resolution note: prior ISR staleness findings now clean

The last run (2026-08-04 00:35 UTC) logged 3 INFO findings — trailing-newline artifacts in the meta description/og:description on `/blog/roof-replacement-tax-credit-2026` and `/blog/summer-roof-inspection-checklist-frederick-md`, and a stray leading "P" typo in the `/services/gutter-installation` description — all attributed to 1-hour ISR staleness after a Sanity fix. This run's live HTML shows all three clean: no embedded newlines in the description/og:description/twitter:description attributes, and the gutter-installation description now reads correctly ("Seamless gutter installation in Frederick, MD..." with no leading "P"). No action needed — the ISR cache caught up as predicted.
