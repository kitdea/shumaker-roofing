# Tech Audit Memory

- Last run: 2026-08-17 00:09 UTC
- Open issues: 95 total (14 P1, 80 P2) + 1 INFO
- Last clean run: never

## Standing context
- Step A.2.4 Performance migration ran 2026-08-09 and is complete — do NOT run it again. Performance findings use stable issue text (`LCP above threshold`, `CLS above threshold`, `INP above threshold`, `Performance score below target`) with no metric values. Measured numbers live in `performance-report.md` only.
- The stable-identity scheme continues to hold: this run minted only 12 new Performance IDs (P-418–P-429) against 95 open findings, and resolved 14 — consistent with normal day-to-day LCP/score drift, not the value-in-identity bug. If a run ever mints new IDs for most of the inventory again, re-read Step 3.4 before writing findings.md.
- Health and Technical SEO/GSC remain structurally clean: all 49 sitemap URLs return 200 with 0 redirect hops, no dead internal links, no orphans, no missing/duplicate meta tags, no canonical or JSON-LD defects, all 49 `<lastmod>` present. The only non-Performance findings are the same 11 Sanity image-field gaps (10 `servicesImage`, 1 `featuredImage`) carried since 2026-06-24/2026-08-09, plus 1 INFO noindex flag on `/blog/how-much-do-new-gutters-cost-maryland`.
- `/blog/how-long-do-gutters-last` had its noindex tag removed between the 2026-08-10 and 2026-08-17 runs — S-080 closed as resolved. It also newly failed LCP/Performance-score this run (P-428/P-429) — worth checking whether re-indexing traffic exposed a real perf issue that was previously masked by noindex.
- 14 open P1s this run (up from 7), 12 of them ⚠ STALE (open ≥3 days with no fix). All are Performance findings — `/contact` and `/roofs-for-heroes` remain the worst (LCP ~9–11s), both stale 8–50 days. `/careers` and `/blog/author/tyler-schisler` are newly-P1 this run (LCP crossed the 4000ms threshold for the first time in this monitoring window).
- Sitemap lives at `https://shumakerroofing.com/sitemap.xml` (non-www). The www host 308-redirects to non-www, so fetch with `curl -L`; the `<loc>` values are all non-www with no trailing slash.
- PageSpeed Insights sweep of 49 URLs takes ~8-9 minutes sequentially (1s delay/call + ~7-10s API latency each) — plan for a background run with a completion monitor rather than a single foreground Bash call (10-minute tool timeout can cut it off partway; resume from the remaining URL slice if that happens).
- Machine clock is Asia/Manila (UTC+8); local date runs a day ahead of UTC. Report timestamps use UTC.
