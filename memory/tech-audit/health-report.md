# Health Report — 2026-08-03 02:29 UTC

| URL | HTTP Status | Redirect Hops | Issue | Severity |
|-----|-------------|---------------|-------|----------|
| / | 200 | 0 | OK | — |
| /about | 200 | 0 | OK | — |
| /services | 200 | 0 | OK | — |
| /blog | 200 | 0 | OK | — |
| /contact | 200 | 0 | OK | — |
| /book-appointment | 200 | 0 | OK | — |
| /service-areas/ | 200 | 1 | OK (trailing-slash canonical redirect, 1 hop — expected) | — |
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
| /blog/best-roofing-contractors-in-frederick-md | 200 | 0 | Sanity field integrity: publishedDate missing | P2 |
| /blog/the-best-roofing-contractors-in-frederick-md-why-shumaker-roofing-is-your-1-choice | 200 | 1 | OK (308 → canonical /blog/best-roofing-contractors-in-frederick-md, single hop) | — |
| /blog/maryland-roof-rejuvenation-contractor-frederick-md | 200 | 0 | OK | — |
| /blog/roof-rejuvenation-cost-frederick-md | 200 | 0 | OK | — |
| /blog/7-signs-roof-needs-rejuvenation-not-replacement | 200 | 0 | OK | — |
| /blog/roof-rejuvenation-vs-replacement-frederick-md | 200 | 0 | OK | — |
| /blog/when-to-get-roof-rejuvenation-frederick-md | 200 | 0 | OK | — |
| /blog/what-is-roof-rejuvenation | 200 | 0 | OK | — |
| /blog/roof-replacement-tax-credit-2026 | 200 | 0 | OK | — |
| /blog/summer-roof-inspection-checklist-frederick-md | 200 | 0 | OK | — |
| /blog/why-attic-ventilation-matters-in-summer-frederick-md | 200 | 0 | OK | — |
| /blog/skylight-repair-vs-replacement-how-to-decide-save-money | 200 | 0 | OK | — |
| /blog/roof-repair-frederick-md | 200 | 0 | OK | — |
| /blog/how-summer-heat-slowly-damages-asphalt-shingles-in-maryland | 200 | 0 | OK | — |
| /blog/preparing-your-roof-for-summer-storms-in-frederick-md | 200 | 0 | OK | — |
| /blog/signs-of-summer-heat-damage-on-your-roof-in-frederick-md | 200 | 0 | OK | — |
| /blog/how-marylands-summer-heat-affects-roofs-in-frederick-md | 200 | 0 | OK | — |
| /blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them | 200 | 0 | OK | — |
| /blog/author/tyler-schisler | 200 | 0 | OK | — |
| /service-areas/chambersburg-pa/ | 200 | 1 | OK (trailing-slash canonical redirect, 1 hop — expected) | — |
| /service-areas/frederick-md/ | 200 | 1 | OK (trailing-slash canonical redirect, 1 hop — expected) | — |
| /service-areas/hagerstown-md/ | 200 | 1 | OK (trailing-slash canonical redirect, 1 hop — expected) | — |
| /service-areas/reston-va/ | 200 | 1 | OK (trailing-slash canonical redirect, 1 hop — expected) | — |
| /privacy-policy | 200 | 0 | Live page (linked in footer on every page), not present in sitemap.xml | P2 |
| /terms-and-conditions | 200 | 0 | Live page (linked in footer on every page), not present in sitemap.xml | P2 |

**Summary:** No 404s, 500s, or dead internal links found. No redirect chains exceeding 1 hop. `location` documents (4/4) clean. 9 `services` documents missing `servicesImage` (recurring, unchanged). All 17 `blog` documents now have `featuredImage` — the 5 previously-open findings are resolved this run. New: `/blog/best-roofing-contractors-in-frederick-md` has `publishedDate: null`. New: `/privacy-policy` and `/terms-and-conditions` are live (200) but absent from sitemap.xml — same pattern previously seen and fixed for careers/faqs/projects/testimonials/roofs-for-heroes.

**Severity key:** P1 = critical (404, 500, missing required CMS field) · P2 = warning (redirect chain, missing image, dead internal link) · — = clean
