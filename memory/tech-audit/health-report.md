# Health Report — 2026-08-03 08:16 UTC

| URL | HTTP Status | Redirect Hops | Issue | Severity |
|-----|-------------|---------------|-------|----------|
| / | 200 | 0 | OK | — |
| /about | 200 | 0 | OK | — |
| /services | 200 | 0 | OK | — |
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
| /blog | 200 | 0 | OK | — |
| /blog/7-signs-roof-needs-rejuvenation-not-replacement | 200 | 0 | OK | — |
| /blog/author/tyler-schisler | 200 | 0 | OK | — |
| /blog/best-roofing-contractors-in-frederick-md | 200 | 0 | Sanity field integrity: publishedDate missing | P2 |
| /blog/how-marylands-summer-heat-affects-roofs-in-frederick-md | 200 | 0 | OK | — |
| /blog/how-summer-heat-slowly-damages-asphalt-shingles-in-maryland | 200 | 0 | OK | — |
| /blog/maryland-roof-rejuvenation-contractor-frederick-md | 200 | 0 | OK | — |
| /blog/preparing-your-roof-for-summer-storms-in-frederick-md | 200 | 0 | OK | — |
| /blog/roof-rejuvenation-cost-frederick-md | 200 | 0 | OK | — |
| /blog/roof-rejuvenation-vs-replacement-frederick-md | 200 | 0 | OK | — |
| /blog/roof-repair-frederick-md | 200 | 0 | OK | — |
| /blog/roof-replacement-tax-credit-2026 | 200 | 0 | OK | — |
| /blog/signs-of-summer-heat-damage-on-your-roof-in-frederick-md | 200 | 0 | OK | — |
| /blog/skylight-repair-vs-replacement-how-to-decide-save-money | 200 | 0 | OK | — |
| /blog/summer-roof-inspection-checklist-frederick-md | 200 | 0 | OK | — |
| /blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them | 200 | 0 | OK | — |
| /blog/what-is-roof-rejuvenation | 200 | 0 | OK | — |
| /blog/when-to-get-roof-rejuvenation-frederick-md | 200 | 0 | OK | — |
| /blog/why-attic-ventilation-matters-in-summer-frederick-md | 200 | 0 | OK | — |
| /service-areas/ | 200 | 1 | Trailing-slash redirect (1 hop, within threshold) | — |
| /service-areas/chambersburg-pa/ | 200 | 1 | Trailing-slash redirect (1 hop, within threshold) | — |
| /service-areas/frederick-md/ | 200 | 1 | Trailing-slash redirect (1 hop, within threshold) | — |
| /service-areas/hagerstown-md/ | 200 | 1 | Trailing-slash redirect (1 hop, within threshold) | — |
| /service-areas/reston-va/ | 200 | 1 | Trailing-slash redirect (1 hop, within threshold) | — |
| /book-appointment | 200 | 0 | OK | — |
| /careers | 200 | 0 | OK | — |
| /contact | 200 | 0 | OK | — |
| /faqs | 200 | 0 | OK | — |
| /projects | 200 | 0 | OK | — |
| /roofs-for-heroes | 200 | 0 | OK | — |
| /testimonials | 200 | 0 | OK | — |
| /privacy-policy | 200 | 0 | Live page, not present in sitemap.xml | P2 |
| /terms-and-conditions | 200 | 0 | Live page, not present in sitemap.xml | P2 |

**Severity key:** P1 = critical (404, 500, missing required CMS field) · P2 = warning (redirect chain, missing image, dead internal link) · — = clean

**Notes:**
- No 404s, 5xx errors, or missing-required-field (P1) CMS defects found this run.
- No redirect chains > 1 hop detected (`/service-areas/*` trailing-slash URLs in the sitemap redirect once to their canonical non-trailing-slash form — within the clean threshold).
- No dead internal links detected; link graph shows every sitemap URL has ≥1 inbound internal link (0 orphans this run).
- `H-026`, `H-027`, `H-040`, `H-041`, `H-042` (featuredImage missing on 5 blog posts) remain resolved from last run — confirmed still present.
- 9 `services` documents still missing `servicesImage` (recurring since 2026-06-24, `⚠ STALE`).
- `/blog/best-roofing-contractors-in-frederick-md` still missing `publishedDate` (recurring since 2026-08-03).
- `/privacy-policy` and `/terms-and-conditions` remain live but absent from `sitemap.xml` (recurring since 2026-08-03).
