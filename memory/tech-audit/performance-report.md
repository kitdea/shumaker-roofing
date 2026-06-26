# Performance Report — 2026-06-24 21:46 UTC

| URL | LCP | CLS | INP | Score | Severity | Suggested Fix |
|-----|-----|-----|-----|-------|----------|---------------|
| /book-appointment | 1901ms | 0.481 | - | 64 | P1 | CLS: Set explicit width/height on images and embeds; avoid inserting content above the fold · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /contact | 1876ms | 0.102 | - | 64 | P2 | CLS: Set explicit width/height on images and embeds; avoid inserting content above the fold · Performance score: Review Lighthouse opportunities tab for the largest wins |
| /service-areas | 2551ms | 0.000 | - | 95 | P2 | LCP: Check hero image size, lazy loading, and server response time |
| /service-areas/chambersburg-pa | 2551ms | - | - | 97 | P2 | LCP: Check hero image size, lazy loading, and server response time |
| /service-areas/hagerstown-md | 3925ms | - | - | 83 | P2 | LCP: Check hero image size, lazy loading, and server response time · Performance score: Review Lighthouse opportunities tab for the largest wins |

**Severity key:** P1 = poor (immediate attention) · P2 = needs work (monitor)

**Not retested this run** (carried forward unconfirmed from 2026-06-24 03:20 UTC findings, not resampled due to PageSpeed API call budget): `/blog/roof-replacement-tax-credit-2026`, `/blog/how-summer-heat-slowly-damages-asphalt-shingles-in-maryland`, `/blog/preparing-your-roof-for-summer-storms-in-frederick-md`, `/blog/signs-of-summer-heat-damage-on-your-roof-in-frederick-md`, `/blog/how-marylands-summer-heat-affects-roofs-in-frederick-md`.

**Resolved since 2026-06-24 03:20 UTC run** (resampled clean): `/`, `/about`, `/services`, `/blog`, `/privacy-policy`, `/terms-and-conditions`, `/services/chimney-maintenance`, `/services/commercial-flat-and-low-slope-roofing-restoration`, `/services/gutter-installation`, `/services/residential-roofing`, `/services/roof-installation`, `/services/roof-rejuvenation`, `/services/roof-repair`, `/services/roof-replacement`, `/services/skylight-installation`, `/services/solar-contractor`, `/services/storm-damage-restoration`, `/service-areas/frederick-md`, `/service-areas/reston-va`, `/blog/skylight-repair-vs-replacement-how-to-decide-save-money`, `/blog/best-roofing-contractors-in-frederick-md`, `/blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them`. A site-wide performance pass appears to have landed — most LCP/score P1s and P2s from the prior run are now clean.

**Regression:** `/book-appointment` CLS got worse (0.261 → 0.481) even though LCP improved — still P1, now driven by CLS instead of LCP. `/service-areas/hagerstown-md` also regressed slightly (LCP 3443ms → 3925ms, score 88 → 83).
