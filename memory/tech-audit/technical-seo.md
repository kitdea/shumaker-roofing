# Technical SEO Report — 2026-06-28 22:07 UTC

| Check | URL | Finding | Severity |
|-------|-----|---------|----------|
| Meta og:image | /about | Missing og:image meta tag | P2 |
| Meta og:image | /services | Missing og:image meta tag | P2 |
| Meta og:image | /blog | Missing og:image meta tag | P2 |
| Meta og:image | /contact | Missing og:image meta tag | P2 |
| Meta og:image | /book-appointment | Missing og:image meta tag | P2 |
| Meta og:image | /service-areas/ | Missing og:image meta tag | P2 |
| Meta og:image | /careers | Missing og:image meta tag | P2 |
| Meta og:image | /faqs | Missing og:image meta tag | P2 |
| Meta og:image | /projects | Missing og:image meta tag | P2 |
| Meta og:image | /testimonials | Missing og:image meta tag | P2 |
| Meta og:image | /roofs-for-heroes | Missing og:image meta tag | P2 |
| Meta og:image | /services/commercial-flat-and-low-slope-roofing-restoration | Missing og:image meta tag | P2 |
| Meta og:image | /services/gutter-installation | Missing og:image meta tag | P2 |
| Meta og:image | /services/residential-roofing | Missing og:image meta tag | P2 |
| Meta og:image | /services/roof-rejuvenation | Missing og:image meta tag | P2 |
| Meta og:image | /services/roof-repair | Missing og:image meta tag | P2 |
| Meta og:image | /services/roof-replacement | Missing og:image meta tag | P2 |
| Meta og:image | /services/skylight-installation | Missing og:image meta tag | P2 |
| Meta og:image | /services/solar-contractor | Missing og:image meta tag | P2 |
| Meta og:image | /services/storm-damage-restoration | Missing og:image meta tag | P2 |
| Meta og:image | /blog/skylight-repair-vs-replacement-how-to-decide-save-money | Missing og:image meta tag | P2 |
| Meta og:image | /blog/best-roofing-contractors-in-frederick-md | Missing og:image meta tag | P2 |
| JSON-LD | /testimonials | No JSON-LD schema block detected | P2 |
| JSON-LD | /roofs-for-heroes | No JSON-LD schema block detected | P2 |
| Orphaned page | /testimonials | Zero inbound internal links from other pages | P2 |
| Orphaned page | /roofs-for-heroes | Zero inbound internal links from other pages | P2 |

**Clean checks (no findings):**
- robots.txt — 200, `Sitemap:` directive present (https://shumakerroofing.com/sitemap.xml), no Disallow on critical paths (`/`, `/services`, `/blog`, `/service-areas`, `/contact`).
- Sitemap validity — all 37 URLs return 200; every `<url>` entry has `<lastmod>`.
- `<title>` — present and non-empty on all 37 pages.
- `<meta name="description">` — present and non-empty on all 37 pages.
- og:title / og:description — present on all 37 pages.
- Canonical tags — present on all 37 pages; all hrefs match the expected page path (no unexpected trailing slash).
- JSON-LD required-field validation — all LocalBusiness/Service/Article/FAQPage blocks contain their required fields (no missing `name`/`address`/`telephone`/`provider`/`headline`/`author`/`datePublished`/`mainEntity`).
- Duplicate titles — none; all 37 `<title>` values are unique.
- Noindex — none detected; all pages serve `robots: index, follow`.

**Notes:**
- Prior findings S-029–S-033 (live pages absent from sitemap) are RESOLVED — /careers, /faqs, /projects, /testimonials, /roofs-for-heroes are all in sitemap.xml now.
- The 5 newly-sitemapped pages (/careers, /faqs, /projects, /testimonials, /roofs-for-heroes) are now meta-checked for the first time; all 5 lack og:image, and /testimonials + /roofs-for-heroes additionally lack JSON-LD and are orphaned.

**Severity key:** P1 = critical · P2 = warning · INFO = informational only, no action needed
