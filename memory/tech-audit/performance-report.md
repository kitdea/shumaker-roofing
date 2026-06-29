# Performance Report — 2026-06-28 22:07 UTC

| URL | LCP | CLS | INP | Score | Severity | Suggested Fix |
|-----|-----|-----|-----|-------|----------|---------------|
| /about | 2701ms | 0.000 | — | 94 | P2 | LCP: Check hero image size, lazy loading, and server response time |
| /services | 2551ms | 0.000 | — | 95 | P2 | LCP: Check hero image size, lazy loading, and server response time |
| /contact | 2326ms | 0.057 | — | 59 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /book-appointment | 2358ms | 0.214 | — | 76 | P2 | CLS: Set explicit width/height on images and embeds; avoid inserting content above the fold · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /service-areas | 3871ms | 0.000 | — | 88 | P2 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /projects | 2476ms | 0.000 | — | 77 | P2 | Performance score: Review Lighthouse opportunities tab for the largest wins |
| /testimonials | 2776ms | 0.000 | — | 88 | P2 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /roofs-for-heroes | 2851ms | 0.000 | — | 73 | P2 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /services/chimney-maintenance | 3001ms | 0.000 | — | 89 | P2 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /services/roof-installation | 2551ms | 0.000 | — | 96 | P2 | LCP: Check hero image size, lazy loading, and server response time |
| /blog/skylight-repair-vs-replacement-how-to-decide-save-money | 2926ms | 0.000 | — | 93 | P2 | LCP: Check hero image size, lazy loading, and server response time |
| /blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them | 3601ms | 0.000 | — | 83 | P2 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /service-areas/chambersburg-pa | 2893ms | 0.000 | — | 80 | P2 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /service-areas/frederick-md | 2738ms | 0.000 | — | 96 | P2 | LCP: Check hero image size, lazy loading, and server response time |
| /service-areas/hagerstown-md | 2892ms | 0.000 | — | 91 | P2 | LCP: Check hero image size, lazy loading, and server response time |
| /service-areas/reston-va | 2890ms | 0.000 | — | 93 | P2 | LCP: Check hero image size, lazy loading, and server response time |

**Notes:**
- INP shows `—` on all pages: PageSpeed returned no field (CrUX) interaction data for this property, so INP was skipped silently per the rules (not flagged).
- **Major improvement on /book-appointment:** CLS dropped from 0.481 (P1, prior run) to 0.214 (P2 needs-work). This clears the only performance P1 from the previous run. Still above the 0.1 "good" threshold — monitor.
- All four `/service-areas/*` city pages and `/about` recovered from prior-run P1 LCP-poor (>4000ms) into the P2 needs-work range. No performance P1 issues remain this run.
- 16 of 37 URLs have at least one needs-work metric; 21 are fully clean. All failing metrics are P2.

**Severity key:** P1 = poor (immediate attention) · P2 = needs work (monitor)
