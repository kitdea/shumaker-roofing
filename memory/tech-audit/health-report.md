# Health Report — 2026-06-28 22:07 UTC

| URL | HTTP Status | Redirect Hops | Issue | Severity |
|-----|-------------|---------------|-------|----------|
| / | 200 | 0 | OK | — |
| /about | 200 | 0 | OK | — |
| /services | 200 | 0 | OK | — |
| /blog | 200 | 0 | OK | — |
| /contact | 200 | 0 | OK | — |
| /book-appointment | 200 | 0 | OK | — |
| /service-areas/ | 200 | 1 | Trailing-slash redirect to /service-areas (1 hop, not a chain) | — |
| /careers | 200 | 0 | OK | — |
| /faqs | 200 | 0 | OK | — |
| /projects | 200 | 0 | OK | — |
| /testimonials | 200 | 0 | OK | — |
| /roofs-for-heroes | 200 | 0 | OK | — |
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
| /blog/roof-replacement-tax-credit-2026 | 200 | 0 | OK | — |
| /blog/summer-roof-inspection-checklist-frederick-md | 200 | 0 | OK | — |
| /blog/why-attic-ventilation-matters-in-summer-frederick-md | 200 | 0 | OK | — |
| /blog/skylight-repair-vs-replacement-how-to-decide-save-money | 200 | 0 | Sanity field integrity: featuredImage missing | P2 |
| /blog/best-roofing-contractors-in-frederick-md | 200 | 0 | Sanity field integrity: featuredImage missing | P2 |
| /blog/how-summer-heat-slowly-damages-asphalt-shingles-in-maryland | 200 | 0 | OK | — |
| /blog/preparing-your-roof-for-summer-storms-in-frederick-md | 200 | 0 | OK | — |
| /blog/signs-of-summer-heat-damage-on-your-roof-in-frederick-md | 200 | 0 | OK | — |
| /blog/how-marylands-summer-heat-affects-roofs-in-frederick-md | 200 | 0 | OK | — |
| /blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them | 200 | 0 | OK | — |
| /service-areas/chambersburg-pa/ | 200 | 1 | Trailing-slash redirect (1 hop, not a chain) | — |
| /service-areas/frederick-md/ | 200 | 1 | Trailing-slash redirect (1 hop, not a chain) | — |
| /service-areas/hagerstown-md/ | 200 | 1 | Trailing-slash redirect (1 hop, not a chain) | — |
| /service-areas/reston-va/ | 200 | 1 | Trailing-slash redirect (1 hop, not a chain) | — |
| /blog/roof-repair-frederick-md (not in sitemap) | 404 | 0 | Sanity blog document exists (missing publishedDate + featuredImage) but route 404s on live site and is absent from sitemap.xml — orphaned/broken CMS content | P1 |

**Notes:**
- Off-sitemap internal link targets checked for dead links: `/privacy-policy` (200), `/terms-and-conditions` (200), `/blog/author/tyler-schisler` (200) — no dead internal links found.
- Prior findings H-034–H-038 (live pages absent from sitemap: /careers, /faqs, /projects, /testimonials, /roofs-for-heroes) are now RESOLVED — all five are present in sitemap.xml this run.
- The five `/service-areas/*/` trailing-slash redirects are single-hop (sitemap lists them with a trailing slash; the site strips it). Single hop is not a redirect chain (>1 hop) per the rules, so not flagged. Prior 2-hop chain findings H-016/H-030–H-033 (measured via www→non-www) are resolved.
- Services `roof-installation` and `chimney-maintenance` have servicesImage; the other 9 services are missing it.

**Severity key:** P1 = critical (404, 500, missing required CMS field) · P2 = warning (redirect chain, missing image, dead internal link) · — = clean
