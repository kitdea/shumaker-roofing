# Performance Report — 2026-09-11 07:45 UTC

**Data quality note:** PageSpeed Insights lab data was unstable this run — a known recurring issue (see prior audit notes). Sweep 1 showed 50/52 URLs failing with a bimodal LCP split (~1800-2900ms vs ~9000-19000ms for the same URL across sweeps). Three full sequential sweeps were run; 25/52 URLs flipped between a clean and a poor reading across sweeps 1-2 alone, confirming PSI infra congestion rather than a real regression for those. The table below uses the **lowest LCP reading observed across all 3 sweeps per URL** (and that sweep run's associated CLS/score) as this run's working dataset. INP was not present in any PSI lab response this run (lab data does not report INP) and is omitted per the missing-metric-field rule — not a finding.

**9 URLs showed consistently high LCP (8000-19000ms) across all 3 independent sweeps with no low reading in any sweep** — marked CONFIRMED below. These are treated as genuine regressions, not lab noise, since three independent measurements agree. All other failing rows reflect at least one clean reading and are lower-confidence / best-of-3.

| URL | LCP | CLS | INP | Score | Severity | Suggested Fix |
|-----|-----|-----|-----|-------|----------|---------------|
| /blog **[CONFIRMED — consistent across 3 sweeps]** | 8618ms | 0.000 | n/a | 53 | P1 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/how-long-do-gutters-last **[CONFIRMED — consistent across 3 sweeps]** | 9071ms | 0.000 | n/a | 51 | P1 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/how-marylands-summer-heat-affects-roofs-in-frederick-md **[CONFIRMED — consistent across 3 sweeps]** | 9092ms | 0.000 | n/a | 58 | P1 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/how-much-do-new-gutters-cost-maryland **[CONFIRMED — consistent across 3 sweeps]** | 7796ms | 0.000 | n/a | 48 | P1 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/what-to-expect-roof-rejuvenation-frederick-md **[CONFIRMED — consistent across 3 sweeps]** | 9044ms | 0.000 | n/a | 69 | P1 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/when-to-get-roof-rejuvenation-frederick-md **[CONFIRMED — consistent across 3 sweeps]** | 9140ms | 0.000 | n/a | 59 | P1 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /contact **[CONFIRMED — consistent across 3 sweeps]** | 11764ms | 0.057 | n/a | 31 | P1 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /services/residential-roofing **[CONFIRMED — consistent across 3 sweeps]** | 8863ms | 0.000 | n/a | 61 | P1 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /terms-and-conditions **[CONFIRMED — consistent across 3 sweeps]** | 8251ms | 0.000 | n/a | 51 | P1 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| / | 2327ms | 0.000 | n/a | 83 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /about | 2551ms | 0.000 | n/a | 86 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/7-signs-roof-needs-rejuvenation-not-replacement | 2776ms | 0.000 | n/a | 91 | P2 | Check hero image size, lazy loading, and server response time |
| /blog/best-roofing-contractors-in-frederick-md | 2326ms | 0.000 | n/a | 79 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /blog/how-summer-heat-slowly-damages-asphalt-shingles-in-maryland | 2251ms | 0.153 | n/a | 80 | P2 | Set explicit width/height on images and embeds; avoid inserting content above the fold · Review Lighthouse opportunities tab for the largest wins |
| /blog/preparing-your-roof-for-summer-storms-in-frederick-md | 2551ms | 0.000 | n/a | 76 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/replacing-gutters-with-new-roof-frederick-md | 2551ms | 0.153 | n/a | 66 | P2 | Check hero image size, lazy loading, and server response time · Set explicit width/height on images and embeds; avoid inserting content above the fold · Review Lighthouse opportunities tab for the largest wins |
| /blog/roof-rejuvenation-cost-frederick-md | 2326ms | 0.000 | n/a | 79 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /blog/roof-rejuvenation-vs-replacement-frederick-md | 2877ms | 0.000 | n/a | 58 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/roof-repair-frederick-md | 2476ms | 0.000 | n/a | 81 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /blog/roof-replacement-tax-credit-2026 | 2401ms | 0.000 | n/a | 79 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /blog/signs-of-summer-heat-damage-on-your-roof-in-frederick-md | 2551ms | 0.000 | n/a | 83 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/summer-roof-inspection-checklist-frederick-md | 2626ms | 0.000 | n/a | 87 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them | 2551ms | 0.000 | n/a | 84 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/what-is-roof-rejuvenation | 2551ms | 0.002 | n/a | 74 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/why-attic-ventilation-matters-in-summer-frederick-md | 2251ms | 0.000 | n/a | 79 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /book-appointment | 1951ms | 0.214 | n/a | 58 | P2 | Set explicit width/height on images and embeds; avoid inserting content above the fold · Review Lighthouse opportunities tab for the largest wins |
| /careers | 1951ms | 0.000 | n/a | 86 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /faqs | 2688ms | 0.153 | n/a | 56 | P2 | Check hero image size, lazy loading, and server response time · Set explicit width/height on images and embeds; avoid inserting content above the fold · Review Lighthouse opportunities tab for the largest wins |
| /privacy-policy | 2251ms | 0.000 | n/a | 77 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /projects | 2326ms | 0.000 | n/a | 62 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /roofs-for-heroes | 1951ms | 0.000 | n/a | 79 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /service-areas | 2176ms | 0.000 | n/a | 83 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /service-areas/chambersburg-pa | 2251ms | 0.000 | n/a | 78 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /service-areas/frederick-md | 1951ms | 0.000 | n/a | 82 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /service-areas/hagerstown-md | 2101ms | 0.000 | n/a | 77 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /service-areas/reston-va | 2251ms | 0.000 | n/a | 83 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /services | 1951ms | 0.000 | n/a | 86 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /services/chimney-maintenance | 2851ms | 0.000 | n/a | 61 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /services/commercial-flat-and-low-slope-roofing-restoration | 2401ms | 0.000 | n/a | 83 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /services/gutter-installation | 2251ms | 0.000 | n/a | 82 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /services/roof-installation | 2401ms | 0.000 | n/a | 84 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /services/roof-rejuvenation | 2551ms | 0.000 | n/a | 85 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /services/roof-repair | 1951ms | 0.000 | n/a | 88 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /services/roof-replacement | 2552ms | 0.000 | n/a | 77 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /services/siding | 1801ms | 0.000 | n/a | 83 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /services/skylight-installation | 2251ms | 0.000 | n/a | 81 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /services/solar-contractor | 1876ms | 0.000 | n/a | 78 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /services/storm-damage-restoration | 1801ms | 0.000 | n/a | 83 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /testimonials | 2701ms | 0.000 | n/a | 72 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
