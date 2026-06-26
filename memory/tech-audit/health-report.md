# Health Report — 2026-06-24 21:46 UTC

| URL | HTTP Status | Redirect Hops | Issue | Severity |
|-----|-------------|---------------|-------|----------|
| / | 200 | 0 | OK | — |
| /about | 200 | 0 | OK | — |
| /services | 200 | 0 | OK | — |
| /blog | 200 | 0 | OK | — |
| /contact | 200 | 0 | OK | — |
| /book-appointment | 200 | 0 | OK | — |
| /service-areas/ | 200 | 1 | OK (trailing-slash redirect, single hop) | — |
| /services/chimney-maintenance | 200 | 0 | OK | — |
| /services/commercial-flat-and-low-slope-roofing-restoration | 200 | 0 | Sanity field integrity: servicesImage missing | P2 |
| /services/gutter-installation | 200 | 0 | Sanity field integrity: servicesImage missing | P2 |
| /services/residential-roofing | 200 | 0 | Sanity field integrity: servicesImage missing | P2 |
| /services/roof-installation | 200 | 0 | OK | — |
| /services/roof-rejuvenation | 200 | 0 | Sanity field integrity: servicesImage missing | P2 |
| /services/roof-repair | 200 | 0 | Sanity field integrity: servicesImage missing | P2 |
| /services/roof-replacement | 200 | 0 | Sanity field integrity: servicesImage missing | P2 |
| /services/skylight-installation | 200 | 0 | Sanity field integrity: servicesImage missing | P2 |
| /services/solar-contractor | 200 | 0 | Sanity field integrity: servicesImage missing | P2 |
| /services/storm-damage-restoration | 200 | 0 | Sanity field integrity: servicesImage missing | P2 |
| /blog/why-attic-ventilation-matters-in-summer-frederick-md | 200 | 0 | OK | — |
| /blog/roof-replacement-tax-credit-2026 | 200 | 0 | OK | — |
| /blog/skylight-repair-vs-replacement-how-to-decide-save-money | 200 | 0 | Sanity field integrity: featuredImage missing | P2 |
| /blog/best-roofing-contractors-in-frederick-md | 200 | 0 | Sanity field integrity: featuredImage missing | P2 |
| /blog/how-summer-heat-slowly-damages-asphalt-shingles-in-maryland | 200 | 0 | OK | — |
| /blog/preparing-your-roof-for-summer-storms-in-frederick-md | 200 | 0 | OK | — |
| /blog/signs-of-summer-heat-damage-on-your-roof-in-frederick-md | 200 | 0 | OK | — |
| /blog/how-marylands-summer-heat-affects-roofs-in-frederick-md | 200 | 0 | OK (slug fixed since last run — was 404 as H-028) | — |
| /blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them | 200 | 0 | OK | — |
| /service-areas/chambersburg-pa/ | 200 | 1 | OK (single-hop redirect — was a 2-hop chain last run) | — |
| /service-areas/frederick-md/ | 200 | 1 | OK (single-hop redirect — was a 2-hop chain last run) | — |
| /service-areas/hagerstown-md/ | 200 | 1 | OK (single-hop redirect — was a 2-hop chain last run) | — |
| /service-areas/reston-va/ | 200 | 1 | OK (single-hop redirect — was a 2-hop chain last run) | — |
| /careers | 200 | 0 | Live page, not present in sitemap.xml | P2 |
| /faqs | 200 | 0 | Live page, not present in sitemap.xml | P2 |
| /projects | 200 | 0 | Live page, not present in sitemap.xml | P2 |
| /testimonials | 200 | 0 | Live page, not present in sitemap.xml | P2 |
| /roofs-for-heroes | 200 | 0 | Live page, not present in sitemap.xml | P2 |
| /privacy-policy | 200 | 0 | OK | — |
| /terms-and-conditions | 200 | 0 | OK | — |
| /blog/roof-repair-frederick-md | 404 | 0 | Sanity blog document exists (missing publishedDate + featuredImage) but route 404s and is absent from sitemap — orphaned/broken CMS content | P1 |

**Severity key:** P1 = critical (404, 500, missing required CMS field) · P2 = warning (redirect chain, missing image, dead internal link) · — = clean

**Note:** www→non-www redirect chains collapsed to single-hop trailing-slash redirects this run (sitemap now emits canonical non-www URLs directly) — the four 2-hop chains flagged 2026-06-24 are resolved.
