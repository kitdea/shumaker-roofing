# Technical SEO Report — 2026-06-24 03:20 UTC

| Check | URL | Finding | Severity |
|-------|-----|---------|----------|
| robots.txt | /robots.txt | Returns 200 (via www→non-www 308), contains `Sitemap: https://shumakerroofing.com/sitemap.xml`, `Allow: /`, no Disallow on any critical path | — |
| Sitemap validity | /sitemap.xml | All 30 `<url>` entries have `<lastmod>` present | — |
| Sitemap validity | /blog/how-maryland-s-summer-heat-affects-roofs-in-frederick-md | Sitemap `<loc>` entry resolves to 404 — stale/incorrect slug, no matching Sanity document (`slug.current` for this post is `how-marylands-summer-heat-affects-roofs-in-frederick-md`, no hyphen after "maryland") | P1 |
| Sitemap completeness | /careers, /faqs, /projects, /testimonials, /roofs-for-heroes | 5 live, internally-linked pages are absent from sitemap.xml | P2 |
| Meta tags — og:image | /about | og:image missing | P2 |
| Meta tags — og:image | /services | og:image missing | P2 |
| Meta tags — og:image | /blog | og:image missing | P2 |
| Meta tags — og:image | /contact | og:image missing | P2 |
| Meta tags — og:image | /book-appointment | og:image missing | P2 |
| Meta tags — og:image | /service-areas | og:image missing | P2 |
| Meta tags — og:image | /services/commercial-flat-and-low-slope-roofing-restoration | og:image missing | P2 |
| Meta tags — og:image | /services/gutter-installation | og:image missing | P2 |
| Meta tags — og:image | /services/residential-roofing | og:image missing | P2 |
| Meta tags — og:image | /services/roof-rejuvenation | og:image missing | P2 |
| Meta tags — og:image | /services/roof-repair | og:image missing | P2 |
| Meta tags — og:image | /services/roof-replacement | og:image missing | P2 |
| Meta tags — og:image | /services/skylight-installation | og:image missing | P2 |
| Meta tags — og:image | /services/solar-contractor | og:image missing | P2 |
| Meta tags — og:image | /services/storm-damage-restoration | og:image missing | P2 |
| Meta tags — og:image | /blog/skylight-repair-vs-replacement-how-to-decide-save-money | og:image missing | P2 |
| Meta tags — og:image | /blog/best-roofing-contractors-in-frederick-md | og:image missing | P2 |
| Canonical tags | /blog/how-maryland-s-summer-heat-affects-roofs-in-frederick-md | No canonical tag present (404 page) — consistent with noindex on this page, not actionable beyond fixing the underlying 404 | P2 |
| JSON-LD schema | (all pages) | LocalBusiness (homepage + 4 service-area pages), Service (11 service pages), Article (8 blog posts), FAQPage (4 service-area + 5 blog posts with FAQ content) all validated — required fields present in every block. No P1 schema gaps found | — |
| Noindex | /blog/how-maryland-s-summer-heat-affects-roofs-in-frederick-md | `<meta name="robots" content="noindex">` detected — logged only, no action taken. This is the custom 404 page rendering for the broken sitemap URL, so noindex here is expected/correct behavior | INFO |
| Duplicate titles | — | No duplicate `<title>` values found across the 30 inventoried URLs | — |
| Orphaned pages | /blog/how-maryland-s-summer-heat-affects-roofs-in-frederick-md | Sitemap URL has zero inbound internal links from any other page on the site (in addition to 404ing) | P2 |
| Canonical domain | www vs non-www | `https://www.shumakerroofing.com/*` 308-redirects to `https://shumakerroofing.com/*` in a single hop across every URL tested — canonical domain correctly enforced | — |
