# Health Report — 2026-05-21 14:00 UTC

| URL | HTTP Status | Redirect Hops | Issue | Severity |
|-----|-------------|---------------|-------|----------|
| / | 200 | 0 | OK | — |
| /about | 404 | 0 | 404 Not Found | P1 |
| /services | 200 | 0 | OK | — |
| /blog | 200 | 0 | OK | — |
| /service-areas | 404 | 0 | 404 Not Found | P1 |
| /contact | 200 | 0 | OK | — |
| /privacy-policy | 200 | 0 | OK | — |
| /terms-and-conditions | 200 | 0 | OK | — |
| /services/roof-repair | 200 | 0 | OK | — |
| /services/commercial-flat-low-slope-roofing-restoration | 200 | 0 | OK | — |
| /services/roof-rejuvenation | — | — | Binary/JPEG response — possible image redirect | P2 |
| /services/roof-installation | 200 | 0 | OK | — |
| /services/residential-roofing | 404 | 0 | 404 Not Found | P1 |
| /services/solar-contractor | 200 | 0 | OK | — |
| /services/skylight-installation | 200 | 0 | OK | — |
| /services/chimney-maintenance | — | — | Binary/JPEG response — possible image redirect | P2 |
| /services/storm-damage-restoration | 404 | 0 | 404 Not Found | P1 |
| /services/gutter-installation | 200 | 0 | OK | — |
| /blog/roof-repair-in-frederick-md-fast-reliable | 404 | 0 | 404 Not Found | P1 |
| /blog/the-best-roofing-contractors-in-frederick-md-why-shumaker-roofing-is-your-1-choice | — | — | Not verified (consistent with 404 pattern for blog slugs) | P1 |
| /blog/three-common-winter-roof-damage-issues-how-to-prevent-them | 404 | 0 | 404 Not Found | P1 |
| /blog/skylight-repair-vs-replacement-how-to-decide-save-money | 200 | 0 | OK | — |
| /blog/roof-replacement-tax-credit-2026-what-homeowners-need-to-know | 404 | 0 | 404 Not Found | P1 |
| /service-areas/adamstown-md | 404 | 0 | 404 Not Found | P1 |
| /service-areas/hagerstown-md | 404 | 0 | 404 Not Found | P1 |
| /service-areas/frederick-md | 404 | 0 | 404 Not Found | P1 |
| /service-areas/chambersburg-pa | 404 | 0 | 404 Not Found | P1 |
| /service-areas/reston-va | 404 | 0 | 404 Not Found | P1 |

**Severity key:** P1 = critical (404, 500, missing required CMS field) · P2 = warning (redirect chain, missing image, dead internal link) · — = clean

## Notes
- `/service-areas` index and all 5 service-area detail pages return 404 — entire location section is unreachable
- `/about` is 404
- 4 of 5 blog post slugs return 404; only `/blog/skylight-repair-vs-replacement-how-to-decide-save-money` resolves
- `/services/roof-rejuvenation` and `/services/chimney-maintenance` return binary JPEG data instead of HTML — likely server misconfiguration or redirect to fallback image
