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

## 2026-08-03 08:16 UTC
- URLs checked: 47 (45 from sitemap.xml + 2 live static pages not in sitemap — /privacy-policy, /terms-and-conditions)
- Health findings: 12 total (0 new, 0 resolved)
- SEO findings: 9 total (4 new, 25 resolved)
- Performance findings: 42 total (42 new, 45 resolved)
- GSC findings: 0 total (all clean, unchanged)
- Open P1 issues: 8
- Open P2 issues: 55
- Note: Largest single-run SEO cleanup to date — all 20 previously-stale "missing og:image" findings (S-010–S-015, S-034–S-042, S-048–S-052) are now resolved, matching the `a34e90e` "Add fallback og:image across static pages and services missing servicesImage" commit in git log. All 4 previously-open title/description whitespace defects (S-066–S-069) are also fixed. Only 2 URLs still lack og:image: `/privacy-policy` and `/terms-and-conditions` — both live pages that have never been added to `sitemap.xml` (still tracked as H-044/H-045/S-070/S-071) and also lack any JSON-LD block (new: S-075, S-076); their og:image gaps are newly tracked as S-073/S-074. Health remained flat: the same 9 `services` documents are still missing `servicesImage` (now 40 days stale) and `/blog/best-roofing-contractors-in-frederick-md` still lacks `publishedDate`. Performance IDs fully regenerate every run (issue text changes with metric values) — of the 45 previously-open performance findings, 3 resolved outright (`/services/commercial-flat-and-low-slope-roofing-restoration`, `/services/roof-installation`, `/services/storm-damage-restoration` — all clean this run) and 1 (`P-129`, the stale `/blog/the-best-roofing-contractors-in-frederick-md-why-shumaker-roofing-is-your-1-choice` slug) is no longer in sitemap.xml at all; the rest were superseded 1:1 by new IDs. Net P1 count improved (11→8): `/about`, `/service-areas/`, `/services/roof-installation` (resolved), and the three `service-areas` location pages dropped out of P1, but `/services/roof-replacement`, `/service-areas/reston-va/`, `/blog` (newly failing), `/blog/skylight-repair-vs-replacement-how-to-decide-save-money`, and `/blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them` newly regressed into P1. `/contact` remains the worst page on the site and got markedly worse again (12613ms→15942ms LCP); `/book-appointment` also regressed from P2 to P1 (CLS 0.214→0.406, LCP now 10881ms). `/roofs-for-heroes` improved somewhat (15980ms→10223ms) but remains P1. No stale P1 findings this run (staleness can't accumulate on performance IDs since they regenerate every run) — H-017–H-025 (servicesImage, 40 days) and S-063–S-065 (summer-heat cannibalization cluster, 13 days) are the only stale findings, both P2, unchanged from last run with no evidence of remediation.

## 2026-08-03 22:01 UTC
- URLs checked: 46 (all from sitemap.xml — /privacy-policy and /terms-and-conditions are now sitemap-native, no longer needing manual fallback inclusion)
- Health findings: 11 total (1 new, 2 resolved)
- SEO findings: 4 total (2 new, 6 resolved)
- Performance findings: 42 total (42 new, 42 resolved)
- GSC findings: 0 total (all clean, unchanged)
- Open P1 issues: 9
- Open P2 issues: 51
- Note: Verification run for commit a1b369e ("Add JSON-LD and og:image to legal pages, add them to sitemap"). Confirmed live: `/privacy-policy` and `/terms-and-conditions` are both present in sitemap.xml with `<lastmod>`, carry a complete og:title/og:description/og:image set, a valid JSON-LD block, and correct canonical tags — H-044, H-045, S-070, S-071, S-073, S-074, S-075, S-076 all closed this run with no remaining equivalent findings on either URL. New finding: two blog posts (`/blog/roof-replacement-tax-credit-2026`, `/blog/summer-roof-inspection-checklist-frederick-md`) are missing `<meta name="description">` and `og:description` entirely (S-077/S-078 P1, S-060/S-061 reopened P2) — not previously flagged by this skill or by `/content-auditor`'s findings log, so logged fresh rather than deduped. Health: one new finding — `/blog/roof-rejuvenation-cost-frederick-md` is missing `publishedDate` (H-046); the 9 `services` documents still missing `servicesImage` (H-017–H-025, now 40 days stale) and `/blog/best-roofing-contractors-in-frederick-md`'s missing `publishedDate` (H-043) are both unchanged/recurring. Performance IDs fully regenerated again this run (all 42 previous IDs superseded or closed): `/blog/maryland-roof-rejuvenation-contractor-frederick-md` (P-159) dropped out of tracking — it 308-redirects cleanly to its canonical target `/blog/what-is-roof-rejuvenation` and is no longer in sitemap.xml. Net P1 count ticked up 8→9, but the composition shifted: Performance P1s actually fell 8→7 (`/blog`, `/blog/skylight-repair-vs-replacement-how-to-decide-save-money`, `/blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them`, `/contact`, and `/services/roof-replacement` all recovered to clean or P2 this run, while `/service-areas/`, `/projects`, `/services/roof-installation`, and `/blog/author/tyler-schisler` newly regressed into P1); the +1 net comes entirely from the two brand-new SEO P1s (missing meta description on the two blog posts above), which have no Performance-module precedent. `/roofs-for-heroes` (11120ms) and `/book-appointment` (10506ms) remain the two worst-performing pages on the site, both still P1 with LCP over 10s. `/terms-and-conditions` is now a fully clean page across every module (health, SEO, and performance) for the first time. H-017–H-025 (servicesImage, now 40 days) and S-063–S-065 (summer-heat cannibalization cluster, now 13 days, not re-verified by this skill — owned by `/content-auditor`) remain the only stale open findings, both P2, carried forward unchanged.

## 2026-08-04 00:35 UTC
- URLs checked: 46 (all from sitemap.xml)
- Health findings: 16 total (5 new, 0 resolved)
- SEO findings: 0 total (0 new, 7 resolved)
- Performance findings: 43 total (43 new, 42 resolved)
- GSC findings: 0 total (all clean, unchanged)
- Open P1 issues: 11
- Open P2 issues: 48
- Note: Follow-up verification run for the S-077/S-078/gutter-installation fixes referenced in the run brief. Root-cause finding: with correct multi-line-aware meta-tag parsing (fixing the exact false-negative bug that caused S-077/S-078 last run — a trailing literal `\n` inside `content="..."` splits the tag across lines under naive line-based grep but is valid HTML), both blog posts' `<meta name="description">` and `og:description` tags ARE detected as present this run. S-077, S-078 (P1) and S-060, S-061 (P2) all close as resolved-detection. However, the live rendered HTML for all three flagged URLs (`/blog/roof-replacement-tax-credit-2026`, `/blog/summer-roof-inspection-checklist-frederick-md`, `/services/gutter-installation`) still shows the exact pre-fix content byte-for-byte (trailing embedded newline still present in the two blog posts' description/og:description/twitter:description; `/services/gutter-installation`'s description still starts with the stray "PSeamless..." typo) — consistent with the documented 1-hour ISR cache (`revalidate = 3600`, no on-demand revalidation webhook wired up) still serving pre-publish content, not a failed fix. Logged as INFO-level data-hygiene notes in technical-seo.md rather than new findings. Also closing S-063/S-064/S-065 (summer-heat cannibalization cluster, was 13 days stale) — independently confirmed resolved via `/content-auditor`'s own audit-findings-log.md (commit 5c3d25d, full cross-linking completed 2026-08-03). Health: reopened H-016/H-030/H-031/H-032/H-033 — the `/service-areas/*` 2-hop redirect chain (www→non-www, then trailing-slash strip) that was fixed and closed on 2026-06-24 has regressed and is back on all 5 location-listing URLs; First Seen reset to today since this is a fresh regression, not a continuously-open issue. The 9 `services` documents still missing `servicesImage` (H-017–H-025, now 41 days stale) and the 2 blog posts missing `publishedDate` (H-043, H-046) are unchanged/recurring. Performance IDs fully regenerated again this run (all 42 previous open IDs superseded or closed): `/privacy-policy` and `/blog/preparing-your-roof-for-summer-storms-in-frederick-md` resolved outright (all metrics clean); one PageSpeed API-side 500 error on `/blog/roof-rejuvenation-vs-replacement-frederick-md` (Lighthouse-side, not a site defect, logged P2 as "PageSpeed API unreachable" per spec, no HTTP 429 encountered so no early-stop needed). Net P1 count ticked up 9→11: two of the previous SEO P1s (S-077/S-078) closed, but five Performance pages newly regressed into P1 (`/about`, `/blog`, `/contact` badly — LCP now 15053ms vs 2626ms last run — `/blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them`, and all three of `/service-areas/chambersburg-pa/`, `/service-areas/frederick-md/`, `/service-areas/hagerstown-md/`), while `/service-areas/`, `/projects`, `/services/roof-installation`, `/services/roof-replacement`, and `/service-areas/reston-va/` improved out of P1 back to P2. `/contact` (15053ms) and `/book-appointment` (10577ms) remain the two worst-performing pages on the site. No stale P1 findings this run. H-017–H-025 (servicesImage, now 41 days) remain the only stale open findings (all P2); the cannibalization stale findings (S-063–S-065) are now closed.
