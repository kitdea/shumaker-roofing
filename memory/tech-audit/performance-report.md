# Performance Report — 2026-09-14 09:00 UTC

**Data quality note:** PageSpeed Insights lab data was unstable again this run — the same recurring infra-congestion signature documented in prior audits. Sweep 1 showed 51/52 URLs failing with a strongly bimodal LCP split (roughly 1800-3200ms on a clean reading vs 6600-16000ms on a congested reading for the same URL across sweeps). Per the standing protocol, two additional sweeps were run. Sweep 1→2 disagreement on pass/fail was low (1/52), but the underlying LCP values still swung wildly per-URL across all three sweeps, so all three were kept and combined per the established method. The table below uses the **lowest LCP reading observed across all 3 sweeps per URL** (and that sweep's associated CLS/score) as this run's working dataset. INP was not present in any PSI lab response this run (lab data does not report INP) and is omitted per the missing-metric-field rule — not a finding.

**6 URLs showed consistently high LCP (>4000ms) across all 3 independent sweeps with no low reading in any sweep** — marked CONFIRMED below and treated as genuine regressions rather than lab noise, since three independent measurements agree with no clean reading at all. All other failing rows reflect at least one low-band reading and are lower-confidence / best-of-3.

**`/contact` note:** MEMORY.md flags `/contact` as showing severe LCP (11-19s) across three separate prior runs. This run's three sweeps for `/contact` were 3151ms / 3151ms / 8640ms — the lowest reading is well below the previous 11-19s severe band, and only one of three sweeps hit the high-congestion range, so it does **not** meet this run's CONFIRMED bar (no low reading). It remains flagged P2 (working LCP 3151ms) rather than P1. This looks like an improvement versus the last 3 runs, but given the history, it is worth a manual spot-check outside of PSI's flaky lab conditions before treating it as resolved.

| URL | LCP | CLS | INP | Score | Severity | Suggested Fix |
|-----|-----|-----|-----|-------|----------|---------------|
| /privacy-policy **[CONFIRMED — consistent across 3 sweeps]** | 8963ms | 0.000 | n/a | 52 | P1 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /terms-and-conditions **[CONFIRMED — consistent across 3 sweeps]** | 8829ms | 0.000 | n/a | 64 | P1 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /services/siding **[CONFIRMED — consistent across 3 sweeps]** | 8414ms | 0.000 | n/a | 50 | P1 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/what-to-expect-roof-rejuvenation-frederick-md **[CONFIRMED — consistent across 3 sweeps]** | 4225ms | 0.000 | n/a | 77 | P1 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/when-to-get-roof-rejuvenation-frederick-md **[CONFIRMED — consistent across 3 sweeps]** | 5448ms | 0.000 | n/a | 60 | P1 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/best-roofing-contractors-in-frederick-md **[CONFIRMED — consistent across 3 sweeps]** | 6645ms | 0.000 | n/a | 68 | P1 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /about | 2942ms | 0.000 | n/a | 81 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /services | 2552ms | 0.000 | n/a | 89 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog | 1876ms | 0.000 | n/a | 87 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /contact | 3151ms | 0.057 | n/a | 57 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /book-appointment | 1951ms | 0.214 | n/a | 59 | P2 | Set explicit width/height on images and embeds; avoid inserting content above the fold · Review Lighthouse opportunities tab for the largest wins |
| /service-areas | 1876ms | 0.000 | n/a | 80 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /careers | 2251ms | 0.000 | n/a | 85 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /faqs | 2176ms | 0.000 | n/a | 80 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /projects | 2476ms | 0.000 | n/a | 60 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /testimonials | 3076ms | 0.000 | n/a | 78 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /roofs-for-heroes | 2176ms | 0.000 | n/a | 74 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /services/chimney-maintenance | 2551ms | 0.000 | n/a | 80 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /services/commercial-flat-and-low-slope-roofing-restoration | 2476ms | 0.000 | n/a | 78 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /services/gutter-installation | 2551ms | 0.000 | n/a | 75 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /services/metal-roofing | 1876ms | 0.153 | n/a | 78 | P2 | Set explicit width/height on images and embeds; avoid inserting content above the fold · Review Lighthouse opportunities tab for the largest wins |
| /services/residential-roofing | 1801ms | 0.000 | n/a | 79 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /services/roof-installation | 2476ms | 0.000 | n/a | 89 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /services/roof-rejuvenation | 2476ms | 0.000 | n/a | 84 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /services/roof-repair | 1876ms | 0.000 | n/a | 80 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /services/roof-replacement | 2551ms | 0.000 | n/a | 76 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /services/skylight-installation | 2101ms | 0.000 | n/a | 81 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /services/solar-contractor | 2626ms | 0.000 | n/a | 76 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /services/storm-damage-restoration | 1951ms | 0.000 | n/a | 79 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /blog/replacing-gutters-with-new-roof-frederick-md | 1876ms | 0.000 | n/a | 86 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /blog/how-much-do-new-gutters-cost-maryland | 2626ms | 0.000 | n/a | 75 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/how-long-do-gutters-last | 2251ms | 0.000 | n/a | 70 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /blog/roof-rejuvenation-cost-frederick-md | 3151ms | 0.000 | n/a | 81 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/7-signs-roof-needs-rejuvenation-not-replacement | 2851ms | 0.000 | n/a | 80 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/roof-rejuvenation-vs-replacement-frederick-md | 2551ms | 0.153 | n/a | 70 | P2 | Check hero image size, lazy loading, and server response time · Set explicit width/height on images and embeds; avoid inserting content above the fold · Review Lighthouse opportunities tab for the largest wins |
| /blog/what-is-roof-rejuvenation | 1876ms | 0.000 | n/a | 84 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /blog/roof-replacement-tax-credit-2026 | 2701ms | 0.000 | n/a | 76 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/summer-roof-inspection-checklist-frederick-md | 2551ms | 0.000 | n/a | 77 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/why-attic-ventilation-matters-in-summer-frederick-md | 1876ms | 0.000 | n/a | 86 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /blog/skylight-repair-vs-replacement-how-to-decide-save-money | 2476ms | 0.000 | n/a | 86 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /blog/roof-repair-frederick-md | 2626ms | 0.000 | n/a | 76 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/how-summer-heat-slowly-damages-asphalt-shingles-in-maryland | 2701ms | 0.000 | n/a | 85 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/preparing-your-roof-for-summer-storms-in-frederick-md | 2626ms | 0.000 | n/a | 81 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/signs-of-summer-heat-damage-on-your-roof-in-frederick-md | 2551ms | 0.000 | n/a | 83 | P2 | Check hero image size, lazy loading, and server response time · Review Lighthouse opportunities tab for the largest wins |
| /blog/how-marylands-summer-heat-affects-roofs-in-frederick-md | 2476ms | 0.000 | n/a | 81 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them | 2476ms | 0.000 | n/a | 81 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /blog/author/tyler-schisler | 2476ms | 0.000 | n/a | 83 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /service-areas/chambersburg-pa | 1876ms | 0.000 | n/a | 76 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /service-areas/frederick-md | 1951ms | 0.000 | n/a | 76 | P2 | Review Lighthouse opportunities tab for the largest wins |
| /service-areas/hagerstown-md | 2251ms | 0.000 | n/a | 85 | P2 | Review Lighthouse opportunities tab for the largest wins |

**Severity key:** P1 = poor (immediate attention) · P2 = needs work (monitor)

`/service-areas/reston-va` and `/` are omitted — all metrics clean in the working (lowest-LCP-of-3) dataset for those two URLs.

Per the hard constraint, no code, configuration, images, or assets were modified based on these results.
