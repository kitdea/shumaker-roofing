# Technical SEO Report — 2026-05-21 14:00 UTC

| Check | URL | Finding | Severity |
|-------|-----|---------|----------|
| robots.txt status | /robots.txt | Returns 200, Allow: /, Disallow: /includes/ — critical paths not blocked | — |
| robots.txt sitemap | /robots.txt | Sitemap directive present — points to shumakerroofing.com (no-www) while canonical domain is www.shumakerroofing.com | P2 |
| Meta title | / | "Roofing Contractor In Frederick, MD | Trusted Roofing Company" — present | — |
| Meta title | /services | "Roofing Services in Frederick, Hagerstown & Reston - Shumaker Roofing" — present | — |
| Meta title | /blog | "Roofing Blog In Frederick, MD – Expert Tips & Advice" — present | — |
| Meta title | /contact | "Contact Us | Get in Touch with Shumaker Roofing" — present | — |
| Meta title | /privacy-policy | "Privacy Policy for Roofing Services | Shumaker Roofing" — present | — |
| Meta title | /terms-and-conditions | "Terms and Conditions - Shumaker Roofing" — present | — |
| Meta title | /services/roof-repair | "Roof Repair In Frederick, MD | Frederick Roof Repair" — present | — |
| Meta title | /services/gutter-installation | "Gutter Installation Cost Guide | Pricing & Free Estimate" — present | — |
| Meta title | /services/commercial-flat-low-slope-roofing-restoration | "Commercial Flat & Low Slope Roofing Restoration | Contact Us" — present | — |
| Meta title | /services/roof-installation | "Roof Installation In Frederick, MD | Get A Free Estimate Now" — present | — |
| Meta title | /services/solar-contractor | "Solar Contractors In Frederick MD | Local Solar Installers" — present | — |
| Meta title | /services/skylight-installation | "Skylight Installation In Frederick, MD | Roofing Skylight" — present | — |
| JSON-LD schema | /services/roof-repair | Organization, LocalBusiness, Service, BreadcrumbList, FAQPage confirmed | — |
| JSON-LD schema | / | No JSON-LD detected | P2 |
| JSON-LD schema | /services | No JSON-LD detected | P2 |
| JSON-LD schema | /blog | No JSON-LD detected | P2 |
| JSON-LD schema | /contact | No JSON-LD detected | P2 |
| JSON-LD schema | /blog/skylight-repair-vs-replacement-how-to-decide-save-money | Article/BlogPosting schema not confirmed | P2 |
| SITE_URL code typo | lib/utils.ts:22 | SITE_URL = "https://www.shumakeroofing.com" — missing 'er'; should be shumakerroofing.com. May corrupt canonical URL generation. | P2 |
| noindex | / | noindex not detected — logged only, no action taken | INFO |
| Meta description / canonical / og tags | Multiple live pages | Full HTML head not retrievable via automated check — manual verification needed for meta description, canonical, og:title, og:description, og:image | P2 |

**Severity key:** P1 = critical · P2 = warning · INFO = informational only, no action needed

## Notes
- All 404 pages excluded from SEO checks (no HTML to inspect)
- `/services/roof-repair` is the only page with fully confirmed schema; other service pages likely have similar schema but was not confirmed
- SITE_URL typo in code could silently set wrong domain in canonical tags on any Next.js-rendered page
- robots.txt does not block /, /services, /blog, /service-areas, /contact ✓
