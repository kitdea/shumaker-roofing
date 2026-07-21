# Audit Log — Shumaker Roofing Technical Agent

## 2026-05-21 14:00 UTC
- URLs checked: 28
- Health findings: 15 total (15 new, 0 resolved)
- SEO findings: 8 total (8 new, 0 resolved)
- Performance findings: 3 total (3 new, 0 resolved)
- Open P1 issues: 14
- Open P2 issues: 12

## 2026-06-08 06:40 UTC
- URLs checked: 26
- Health findings: 15 total (0 new, 15 resolved)
- SEO findings: 19 total (19 new, 8 resolved)
- Performance findings: 13 total (13 new, 3 resolved)
- Open P1 issues: 0
- Open P2 issues: 32

## 2026-06-24 03:20 UTC
- URLs checked: 35 (30 from sitemap.xml + 5 live pages discovered via internal links but missing from sitemap)
- Health findings: 23 total (23 new, 0 resolved)
- SEO findings: 26 total (20 new, 13 resolved)
- Performance findings: 32 total (32 new, 13 resolved)
- Open P1 issues: 7
- Open P2 issues: 73

## 2026-06-24 21:46 UTC
- URLs checked: 38 (31 sitemap + 5 static-not-in-sitemap + 1 non-sitemap orphan blog doc + homepage canonical-domain cross-check)
- Health findings: 17 total (1 new, 7 resolved)
- SEO findings: 22 total (0 new, 4 resolved)
- Performance findings: 9 total (0 new, 22 resolved)
- GSC findings: 0 total (module run for first time this cycle — all clean)
- Open P1 issues: 2
- Open P2 issues: 47

## 2026-06-28 22:07 UTC
- URLs checked: 37 (sitemap.xml) + /blog/roof-repair-frederick-md (non-sitemap orphan blog doc, still 404)
- Health findings: 12 total (0 new, 5 resolved)
- SEO findings: 26 total (9 new, 5 resolved)
- Performance findings: 16 total (16 new, 10 resolved)
- Open P1 issues: 1
- Open P2 issues: 53
- Note: performance P1 cleared this run (/book-appointment CLS 0.481→0.214); all 5 prior sitemap-absence findings (H-034–H-038, S-029–S-033) resolved — pages now in sitemap. 9 new SEO findings are first-time meta checks on the newly-sitemapped pages (og:image ×5, JSON-LD ×2, orphan ×2). Mid-run local DNS outage required PageSpeed retries; final dataset complete for all 37 URLs.

## 2026-07-21 14:00 UTC
- URLs checked: 45 (sitemap.xml — 8 new blog posts and the `/blog/author/tyler-schisler` archive page published since last run)
- Health findings: 14 total (3 new, 0 resolved)
- SEO findings: 34 total (12 new, 0 resolved)
- Performance findings: 41 total (41 new, 16 resolved)
- GSC findings: 0 total (all clean, unchanged)
- Open P1 issues: 13
- Open P2 issues: 76
- Note: **Major performance regression** — 13 P1 findings this run vs. 0 last run, spanning static/service/blog/location page types (home LCP 5487ms, /contact 9065ms, /book-appointment 10050ms, /roofs-for-heroes 10351ms). Pattern suggests a shared root cause (server response time, layout-level render-blocking resource, or hosting change) rather than isolated per-page issues — flagged for investigation, no auto-fix applied per skill constraint. New content published since 2026-06-28 (8 blog posts) is missing og:description (5 posts) and featuredImage (3 posts) on first check; a 3-post "summer heat damage" topic cluster was newly identified as a keyword-cannibalization risk. An initial GSC check falsely flagged missing site-verification/GA — corrected after verifying raw HTML directly; both are present and unchanged.
