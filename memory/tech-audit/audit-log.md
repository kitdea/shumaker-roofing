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

## 2026-08-03 02:29 UTC
- URLs checked: 46 (sitemap.xml — 1 new page since last run, `/blog/author/tyler-schisler` author archive; blog post count unchanged)
- Health findings: 12 total (3 new, 5 resolved)
- SEO findings: 30 total (4 new, 8 resolved)
- Performance findings: 45 total (45 new, 41 resolved)
- GSC findings: 0 total (all clean, unchanged)
- Open P1 issues: 11
- Open P2 issues: 76
- Note: Canonical domain flipped since the last observed state — `www.shumakerroofing.com` now 308-redirects to `shumakerroofing.com` (non-www), still a single hop, GSC canonical-domain check remains clean. All 5 blog posts previously missing `featuredImage` (H-026, H-027, H-040, H-041, H-042) now have it; all 5 posts previously missing `og:description` (S-058–S-062) and 3 posts missing `og:image` (S-043, S-044, S-057) are now fixed — the largest single-run resolution batch to date. New: `/blog/best-roofing-contractors-in-frederick-md` has `publishedDate: null` in Sanity (H-043); `/privacy-policy` and `/terms-and-conditions` are live but absent from sitemap.xml, same pattern previously seen and fixed for 5 other static routes (H-044/S-070, H-045/S-071); `/blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them` picked up a trailing-space title defect (S-069). Performance P1 count eased slightly (13→11) but remains elevated — `/roofs-for-heroes` LCP got markedly worse (10351ms→15980ms) and remains the worst page on the site, `/contact` also worsened (9065ms→12613ms). Every open Health/SEO P2 finding this run is 13–56 days old (⚠ STALE per Step A.2.5) — none have been remediated since first detection; performance findings can't accumulate the same staleness signal because their issue text (and therefore ID) changes every run as metrics shift.

## 2026-07-21 14:00 UTC
- URLs checked: 45 (sitemap.xml — 8 new blog posts and the `/blog/author/tyler-schisler` archive page published since last run)
- Health findings: 14 total (3 new, 0 resolved)
- SEO findings: 34 total (12 new, 0 resolved)
- Performance findings: 41 total (41 new, 16 resolved)
- GSC findings: 0 total (all clean, unchanged)
- Open P1 issues: 13
- Open P2 issues: 76
- Note: **Major performance regression** — 13 P1 findings this run vs. 0 last run, spanning static/service/blog/location page types (home LCP 5487ms, /contact 9065ms, /book-appointment 10050ms, /roofs-for-heroes 10351ms). Pattern suggests a shared root cause (server response time, layout-level render-blocking resource, or hosting change) rather than isolated per-page issues — flagged for investigation, no auto-fix applied per skill constraint. New content published since 2026-06-28 (8 blog posts) is missing og:description (5 posts) and featuredImage (3 posts) on first check; a 3-post "summer heat damage" topic cluster was newly identified as a keyword-cannibalization risk. An initial GSC check falsely flagged missing site-verification/GA — corrected after verifying raw HTML directly; both are present and unchanged.
