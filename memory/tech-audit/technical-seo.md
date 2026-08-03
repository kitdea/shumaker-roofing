# Technical SEO Report — 2026-08-03 02:29 UTC

| Check | URL | Finding | Severity |
|-------|-----|---------|----------|
| og:image | /about | Missing og:image meta tag | P2 |
| og:image | /services | Missing og:image meta tag | P2 |
| og:image | /blog | Missing og:image meta tag | P2 |
| og:image | /contact | Missing og:image meta tag | P2 |
| og:image | /book-appointment | Missing og:image meta tag | P2 |
| og:image | /service-areas/ | Missing og:image meta tag | P2 |
| og:image | /careers | Missing og:image meta tag | P2 |
| og:image | /faqs | Missing og:image meta tag | P2 |
| og:image | /projects | Missing og:image meta tag | P2 |
| og:image | /testimonials | Missing og:image meta tag | P2 |
| og:image | /roofs-for-heroes | Missing og:image meta tag | P2 |
| og:image | /services/commercial-flat-and-low-slope-roofing-restoration | Missing og:image meta tag | P2 |
| og:image | /services/gutter-installation | Missing og:image meta tag | P2 |
| og:image | /services/residential-roofing | Missing og:image meta tag | P2 |
| og:image | /services/roof-rejuvenation | Missing og:image meta tag | P2 |
| og:image | /services/roof-repair | Missing og:image meta tag | P2 |
| og:image | /services/roof-replacement | Missing og:image meta tag | P2 |
| og:image | /services/skylight-installation | Missing og:image meta tag | P2 |
| og:image | /services/solar-contractor | Missing og:image meta tag | P2 |
| og:image | /services/storm-damage-restoration | Missing og:image meta tag | P2 |
| title | /blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them | `<title>` has a trailing space — cosmetic Sanity data defect | P2 |
| title | /blog/when-to-get-roof-rejuvenation-frederick-md | `<title>` has a trailing space — cosmetic Sanity data defect (recurring) | P2 |
| orphan | /blog/the-best-roofing-contractors-in-frederick-md-why-shumaker-roofing-is-your-1-choice | Zero inbound internal links from crawled pages; URL is a stale sitemap entry that 308-redirects to /blog/best-roofing-contractors-in-frederick-md (its own canonical target) — consider removing it from sitemap.xml | P2 |
| sitemap coverage | /privacy-policy | Live page (200), linked from footer on every page, but absent from sitemap.xml | P2 |
| sitemap coverage | /terms-and-conditions | Live page (200), linked from footer on every page, but absent from sitemap.xml | P2 |

**Resolved since last run:** `og:image` now present on `/blog/skylight-repair-vs-replacement-how-to-decide-save-money`, `/blog/roof-repair-frederick-md`, `/blog/best-roofing-contractors-in-frederick-md`. `og:description` now present on all pages previously missing it (maryland-roof-rejuvenation-contractor-frederick-md, when-to-get-roof-rejuvenation-frederick-md, roof-replacement-tax-credit-2026, summer-roof-inspection-checklist-frederick-md, why-attic-ventilation-matters-in-summer-frederick-md).

**Checks that came back clean across all 46 sitemap URLs:** robots.txt (200, `Sitemap:` directive present, no critical paths blocked, matches canonical non-www domain), sitemap `<lastmod>` on all 46 `<url>` entries, `<title>` tags and meta descriptions (all present, non-empty), `og:title` and `og:description` (all present), canonical tags (present on every page; the one apparent mismatch — the redirecting duplicate-title URL below — is not a real defect since the page 308s to that exact canonical target before any crawler sees the tag), JSON-LD schema required fields (`LocalBusiness`/`RoofingContractor`, `Service`, `Article`/`BlogPosting`, `FAQPage` — none missing required fields; 26 pages also carry `BreadcrumbList`), noindex flags (none detected), duplicate `<title>` values (the one duplicate pair is the same redirect situation above, not two distinct indexable pages).

**Severity key:** P1 = critical · P2 = warning · INFO = informational only, no action needed
