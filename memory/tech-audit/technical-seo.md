# Technical SEO Report — 2026-08-03 08:16 UTC

| Check | URL | Finding | Severity |
|-------|-----|---------|----------|
| og:image | /privacy-policy | Missing og:image meta tag | P2 |
| og:image | /terms-and-conditions | Missing og:image meta tag | P2 |
| JSON-LD | /privacy-policy | No JSON-LD schema block detected | P2 |
| JSON-LD | /terms-and-conditions | No JSON-LD schema block detected | P2 |
| sitemap-coverage | /privacy-policy | Live page absent from sitemap.xml | P2 |
| sitemap-coverage | /terms-and-conditions | Live page absent from sitemap.xml | P2 |
| cannibalization | /blog/how-marylands-summer-heat-affects-roofs-in-frederick-md | Keyword cannibalization vs. two sibling "summer heat damage" posts | P2 |
| cannibalization | /blog/how-summer-heat-slowly-damages-asphalt-shingles-in-maryland | Keyword cannibalization vs. sibling posts; duplicate og:image with /blog/signs-of-summer-heat-damage-on-your-roof-in-frederick-md | P2 |
| cannibalization | /blog/signs-of-summer-heat-damage-on-your-roof-in-frederick-md | Keyword cannibalization vs. sibling posts; duplicate og:image with /blog/how-summer-heat-slowly-damages-asphalt-shingles-in-maryland | P2 |

**Severity key:** P1 = critical · P2 = warning · INFO = informational only, no action needed

**Checks that came back clean this run (all pages, unless noted):**
- `<title>` and `<meta name="description">` present and non-empty on every one of the 47 checked pages.
- `og:title` / `og:description` present and non-empty on all 45 sitemap pages (only the 2 non-sitemapped static pages are missing `og:image`, see above).
- Canonical tags present on every page and match the expected path (including the 5 `/service-areas/*` trailing-slash sitemap entries, whose rendered canonical correctly points at the non-trailing-slash form).
- JSON-LD present with all required fields (`LocalBusiness`: name/address/telephone; `Service`: name/provider; `Article`: headline/author/datePublished; `FAQPage`: non-empty `mainEntity`) on all 45 sitemap pages — spot-checked homepage, /about, every service template, a blog post, and a location page in full, swept all 47 pages for block presence and type completeness programmatically.
- No `noindex` directives detected anywhere (INFO-only check, N/A this run).
- No duplicate `<title>` values across any of the 47 pages.
- No orphaned sitemap pages — every URL has ≥1 inbound internal link. `/blog/the-best-roofing-contractors-in-frederick-md-why-shumaker-roofing-is-your-1-choice` (previously tracked as S-072, a stale sitemap entry) is no longer in sitemap.xml at all and 308-redirects cleanly to its canonical target — finding resolved/moot.
- robots.txt returns 200, contains a `Sitemap:` directive matching the fetched sitemap URL, and has no `Disallow` rules blocking `/`, `/services`, `/blog`, `/service-areas`, or `/contact`.
- Sitemap: all 45 `<url>` entries have a `<lastmod>` element.

**Resolved since last run (2026-08-03 02:29 UTC):**
- `S-066` — `/blog/when-to-get-roof-rejuvenation-frederick-md` trailing-space title — title is now clean.
- `S-069` — `/blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them` trailing-space title — title is now clean.
- `S-067` — `/blog/maryland-roof-rejuvenation-contractor-frederick-md` leading-whitespace meta description — now clean.
- `S-068` — `/blog/why-attic-ventilation-matters-in-summer-frederick-md` leading-whitespace meta description — now clean.
- `S-010`–`S-015`, `S-034`–`S-042`, `S-048`–`S-052` — all previously-stale missing `og:image` findings across static, service, and remaining pages — every one of these 21 URLs now has a populated `og:image` tag (matches the `a34e90e` "fallback og:image" commit visible in git log).
- `S-072` — orphaned stale sitemap entry — URL no longer in sitemap; moot.

**Note on scope/dedup (Step 2.3):** checked `memory/seo/audit-findings-log.md` per the skill's dedup instructions — its open findings are cluster/cannibalization/coverage-gap/metadata-hygiene items scoped to content-auditor's own domain (excerpts, category fields, absolute internal links, blog-linking coverage counts). None overlap with this run's og:image/JSON-LD/sitemap-coverage findings on `/privacy-policy` and `/terms-and-conditions`, so no dedup was needed. The three keyword-cannibalization findings above (S-063–S-065) are carried forward unchanged — they mirror the "summer heat damage" cluster content-auditor has tracked as unresolved since 2026-07-14 (run 4), with no evidence of consolidation or pillar work since.
