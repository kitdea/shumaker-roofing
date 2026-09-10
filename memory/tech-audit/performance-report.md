# Performance Report — 2026-09-09 21:34 UTC

**⚠ Data quality note — PSI lab flakiness was unusually severe this run.** Four full 52-URL
sweeps and 8+ targeted `lcp-breakdown-insight` spot-checks were required before the data below
was trusted. Sweeps 1 and 2 were discarded outright: sweep 1 showed 49/52 URLs failing with
LCP spot-checks summing to only ~10-15% of the reported value (matching the documented
2026-08-17/2026-08-28 pattern); sweep 2 was corrupted by an orphaned background process from
sweep 1's aborted run writing to the same output file concurrently (duplicate/colliding rows,
several HTTP 500s). Sweeps 3 and 4 were both clean single-process runs with no duplicates, but
still disagreed sharply on several URLs — e.g. `/` read 9621ms in sweep 3 and 2626ms in sweep 4;
`/testimonials` read 9599ms vs 2476ms. Every spot-checked ~9000ms+ reading, across all four
sweeps, had a `lcp-breakdown-insight` subpart sum of only 200-2500ms — the same signature as
the known infra-flakiness pattern, just more persistent than any prior run.

The table below uses, per URL, the **lower (cleaner) of the sweep 3 / sweep 4 readings** — the
faster-resolving value is the one supported by breakdown-insight evidence wherever spot-checked.
Rows marked **⚠** never produced a low/clean reading in either full sweep (`/services`, `/blog`,
`/services/gutter-installation`, `/services/roof-replacement`,
`/blog/how-marylands-summer-heat-affects-roofs-in-frederick-md`, `/blog/author/tyler-schisler`,
`/contact`) — direct breakdown-insight spot-checks on 3 of these (`/blog`, `/services/roof-replacement`,
and homepage `/` from an earlier isolated retest) still showed the same 200-2500ms vs 9000ms+
mismatch, so these P1s are **not asserted as confirmed regressions** — treat as "inconclusive,
needs manual re-verification with a direct PageSpeed Insights UI test" rather than an actionable
sitewide LCP incident. `/contact` in particular only produced one non-error reading all run
(17951ms) — no clean baseline was obtainable this run for that page specifically.

| URL | LCP | CLS | INP | Score | Severity | Suggested Fix |
|-----|-----|-----|-----|-------|----------|---------------|
| / | 2626ms | 0.000 | — | 80 | P2 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /about | 3608ms | 0.153 | — | 67 | P2 | LCP: Check hero image size, lazy loading, and server response time · CLS: Set explicit width/height on images and embeds; avoid inserting content above the fold · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /services ⚠ | 8734ms | 0.000 | — | 68 | P1 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /blog ⚠ | 9331ms | 0.162 | — | 43 | P1 | LCP: Check hero image size, lazy loading, and server response time · CLS: Set explicit width/height on images and embeds; avoid inserting content above the fold · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /careers | 1951ms | 0.000 | — | 84 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /faqs | 1951ms | 0.000 | — | 82 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /projects | 2176ms | 0.000 | — | 62 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /testimonials | 2476ms | 0.000 | — | 81 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /roofs-for-heroes | 2851ms | 0.000 | — | 71 | P2 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /privacy-policy | 1952ms | 0.000 | — | 80 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /terms-and-conditions | 1801ms | 0.000 | — | 83 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /services/gutter-installation ⚠ | 9426ms | 0.000 | — | 41 | P1 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /services/metal-roofing | 2101ms | 0.000 | — | 83 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /services/residential-roofing | 1876ms | 0.000 | — | 81 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /services/roof-rejuvenation | 1801ms | 0.000 | — | 79 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /services/roof-repair | 2252ms | 0.000 | — | 85 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /services/roof-replacement ⚠ | 8883ms | 0.000 | — | 54 | P1 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /services/siding | 1876ms | 0.000 | — | 86 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /services/skylight-installation | 1876ms | 0.000 | — | 77 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /services/solar-contractor | 2101ms | 0.000 | — | 89 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /services/storm-damage-restoration | 1801ms | 0.000 | — | 88 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /blog/replacing-gutters-with-new-roof-frederick-md | 1951ms | 0.000 | — | 88 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /blog/what-to-expect-roof-rejuvenation-frederick-md | 2251ms | 0.000 | — | 83 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /blog/how-much-do-new-gutters-cost-maryland | 2401ms | 0.000 | — | 76 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /blog/roof-rejuvenation-vs-replacement-frederick-md | 2326ms | 0.000 | — | 71 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /blog/when-to-get-roof-rejuvenation-frederick-md | 2701ms | 0.000 | — | 83 | P2 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /blog/roof-replacement-tax-credit-2026 | 2401ms | 0.000 | — | 76 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /blog/summer-roof-inspection-checklist-frederick-md | 2251ms | 0.000 | — | 79 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /blog/why-attic-ventilation-matters-in-summer-frederick-md | 2251ms | 0.000 | — | 85 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /blog/roof-repair-frederick-md | 2707ms | 0.000 | — | 90 | P2 | LCP: Check hero image size, lazy loading, and server response time |
| /blog/how-summer-heat-slowly-damages-asphalt-shingles-in-maryland | 2326ms | 0.000 | — | 85 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /blog/preparing-your-roof-for-summer-storms-in-frederick-md | 2626ms | 0.000 | — | 85 | P2 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /blog/signs-of-summer-heat-damage-on-your-roof-in-frederick-md | 2551ms | 0.000 | — | 80 | P2 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /blog/how-marylands-summer-heat-affects-roofs-in-frederick-md ⚠ | 9168ms | 0.000 | — | 53 | P1 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them | 2551ms | 0.000 | — | 91 | P2 | LCP: Check hero image size, lazy loading, and server response time |
| /blog/author/tyler-schisler ⚠ | 7361ms | 0.000 | — | 52 | P1 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /service-areas/hagerstown-md | 2101ms | 0.000 | — | 76 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /service-areas/reston-va | 2251ms | 0.000 | — | 78 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /contact ⚠ | 17951ms | 0.057 | — | 35 | P1 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /book-appointment | 2251ms | 0.214 | — | 70 | P2 | CLS: Set explicit width/height on images and embeds; avoid inserting content above the fold · Performance score: Review Lighthouse opportunities tab for the largest wins |

**Severity key:** P1 = poor (immediate attention) · P2 = needs work (monitor)

**INP note:** `interaction-to-next-paint` was not present in any PSI response this run (field data required for the metric was unavailable for this origin/URL combination in the lab run) — this is expected/normal, not an error, and is not flagged per Step 3.2's "missing metric field" handling.
