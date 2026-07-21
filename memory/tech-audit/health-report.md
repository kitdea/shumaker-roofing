# Health Report — 2026-07-21 14:00 UTC

| URL | HTTP Status | Redirect Hops | Issue | Severity |
|-----|-------------|---------------|-------|----------|
| / | 200 | 0 | OK | — |
| /about | 200 | 0 | OK | — |
| /services | 200 | 0 | OK | — |
| /blog | 200 | 0 | OK | — |
| /contact | 200 | 0 | OK | — |
| /book-appointment | 200 | 0 | OK | — |
| /service-areas/ | 200 | 1 | Trailing-slash → canonical redirect (1 hop, expected Next.js behavior) | — |
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
| /service-areas/chambersburg-pa/ | 200 | 1 | Trailing-slash → canonical redirect (1 hop, expected) | — |
| /service-areas/frederick-md/ | 200 | 1 | Trailing-slash → canonical redirect (1 hop, expected) | — |
| /service-areas/hagerstown-md/ | 200 | 1 | Trailing-slash → canonical redirect (1 hop, expected) | — |
| /service-areas/reston-va/ | 200 | 1 | Trailing-slash → canonical redirect (1 hop, expected) | — |
| /blog/maryland-roof-rejuvenation-contractor-frederick-md | 200 | 0 | OK | — |
| /blog/roof-rejuvenation-cost-frederick-md | 200 | 0 | OK | — |
| /blog/7-signs-roof-needs-rejuvenation-not-replacement | 200 | 0 | OK | — |
| /blog/roof-rejuvenation-vs-replacement-frederick-md | 200 | 0 | Sanity field integrity: featuredImage missing | P2 |
| /blog/when-to-get-roof-rejuvenation-frederick-md | 200 | 0 | Sanity field integrity: featuredImage missing | P2 |
| /blog/what-is-roof-rejuvenation | 200 | 0 | OK | — |
| /blog/roof-replacement-tax-credit-2026 | 200 | 0 | OK | — |
| /blog/summer-roof-inspection-checklist-frederick-md | 200 | 0 | OK | — |
| /blog/why-attic-ventilation-matters-in-summer-frederick-md | 200 | 0 | OK | — |
| /blog/skylight-repair-vs-replacement-how-to-decide-save-money | 200 | 0 | Sanity field integrity: featuredImage missing | P2 |
| /blog/roof-repair-frederick-md | 200 | 0 | Sanity field integrity: featuredImage missing | P2 |
| /blog/best-roofing-contractors-in-frederick-md | 200 | 0 | Sanity field integrity: featuredImage missing | P2 |
| /blog/how-summer-heat-slowly-damages-asphalt-shingles-in-maryland | 200 | 0 | OK | — |
| /blog/preparing-your-roof-for-summer-storms-in-frederick-md | 200 | 0 | OK | — |
| /blog/signs-of-summer-heat-damage-on-your-roof-in-frederick-md | 200 | 0 | OK | — |
| /blog/how-marylands-summer-heat-affects-roofs-in-frederick-md | 200 | 0 | OK | — |
| /blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them | 200 | 0 | OK | — |
| /blog/author/tyler-schisler | 200 | 0 | OK (author archive page — not a `blog`/`services`/`location` document type, no CMS field check applies) | — |

**Severity key:** P1 = critical (404, 500, missing required CMS field) · P2 = warning (redirect chain, missing image, dead internal link) · — = clean

**Notes:**
- No 404s, 500s, or dead internal links found. Off-sitemap static routes (`/privacy-policy`, `/terms-and-conditions`, favicons, manifest, logos) all verified 200.
- No required Sanity fields (title, servicesContent, publishedDate, cityName) are missing on any document — only optional image fields.
- `/blog/roof-repair-frederick-md` (previously tracked as H-039, closed 2026-07-03 after the 404/missing-publishedDate root cause was fixed) is now live and healthy, but still missing `featuredImage` as the closing note anticipated — tracked as a new open finding this run.
- One agent observed a single transient 308 redirect on `/services/roof-repair` → `/service-areas` during one fetch, not reproducible on 5 immediate retries (all clean 200s). Likely a stale edge-cache entry; not logged as a finding, but worth a spot-check if it recurs.
- `/blog/author/tyler-schisler` is a new URL type (author archive) not covered by the CLAUDE.md routes table or this skill's per-content-type checks — flagged for awareness, not as a defect.
