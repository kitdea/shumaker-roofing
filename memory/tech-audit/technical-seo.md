# Technical SEO Report — 2026-06-08 06:40 UTC

| Check | URL | Finding | Severity |
|-------|-----|---------|----------|
| robots.txt | /robots.txt | Returns 200, contains `Sitemap:` directive (now correctly points to non-www `https://shumakerroofing.com/sitemap.xml`, matching the canonical domain), no Disallow on critical paths — issue from prior run resolved | — |
| Sitemap validity | sitemap.xml | All 26 URLs return 200 and all have `<lastmod>` present | — |
| og:image | / | Missing `<meta property="og:image">` | P2 |
| og:image | /about | Missing `<meta property="og:image">` | P2 |
| og:image | /services | Missing `<meta property="og:image">` | P2 |
| og:image | /blog | Missing `<meta property="og:image">` | P2 |
| og:image | /contact | Missing `<meta property="og:image">` | P2 |
| og:image | /book-appointment | Missing `<meta property="og:image">` | P2 |
| og:image | /service-areas/ | Missing `<meta property="og:image">` | P2 |
| og:image | /service-areas/chambersburg-pa, /frederick-md, /hagerstown-md, /reston-va | Missing `<meta property="og:image">` on all 4 location pages | P2 |
| JSON-LD schema | / | LocalBusiness/RoofingContractor schema present with name, address, telephone — valid (resolved from prior "no schema" finding) | — |
| JSON-LD schema | /services/[slug] (all 11) | Service schema present with name + provider/description — valid | — |
| JSON-LD schema | /blog/[slug] (all 4) | Article schema present with headline, author, datePublished — valid (resolves prior S-007 "not confirmed") | — |
| JSON-LD schema | /service-areas/[slug] (all 4) | LocalBusiness + FAQPage (mainEntity array populated) + ItemList present and valid | — |
| JSON-LD schema | /services, /blog, /contact, /book-appointment | BreadcrumbList + WebPage/Blog/ContactPage schema present — counts as schema present (resolves prior "no JSON-LD" findings for /services, /blog, /contact) | — |
| JSON-LD schema | /about, /service-areas/ | No JSON-LD block detected | P2 |
| Canonical tags | All 26 pages | Present and self-referential, matches expected path (no www/non-www mismatch; trailing-slash location & service-areas-index URLs canonicalize correctly to non-trailing-slash form) | — |
| Duplicate titles / duplicate content | /blog/roof-replacement-tax-credit-2026 (linked, not in sitemap) vs. /blog/roof-replacement-tax-credit-2026-what-homeowners-need-to-know (in sitemap) | Both URLs serve identical content with identical `<title>` "Roof Replacement Tax Credit: What Homeowners Need To Know" but each self-canonicalizes — true duplicate-content pair, splits ranking signals | P2 |
| Duplicate titles / duplicate content | /blog/best-roofing-contractors-in-frederick-md (linked, not in sitemap) vs. /blog/the-best-roofing-contractors-in-frederick-md-why-shumaker-roofing-is-your-1-choice (in sitemap) | Identical content/title "The Best Roofing Contractors in Frederick MD \| Roof Repair", each self-canonicalizes — duplicate-content pair | P2 |
| Duplicate titles / duplicate content | /blog/common-winter-roof-damage-issues-and-how-to-prevent-them (linked, not in sitemap) vs. /blog/three-common-winter-roof-damage-issues-how-to-prevent-them (in sitemap) | Identical content/title "Winter Roof Damage: Three Issues & Prevention Tips", each self-canonicalizes — duplicate-content pair | P2 |
| Orphaned pages | /blog/roof-replacement-tax-credit-2026-what-homeowners-need-to-know | Zero inbound internal links — the `/blog` listing page links to the short Contentful-`slug` URL instead, leaving this sitemap URL orphaned | P2 |
| Orphaned pages | /blog/the-best-roofing-contractors-in-frederick-md-why-shumaker-roofing-is-your-1-choice | Zero inbound internal links — same root cause (listing page links to short Contentful-`slug` URL) | P2 |
| Orphaned pages | /blog/three-common-winter-roof-damage-issues-how-to-prevent-them | Zero inbound internal links — same root cause | P2 |

**Noindex check:** No `noindex` directives detected on any of the 26 pages (all serve `index, follow`) — clean, omitted from table.

**Root cause note (informational):** The blog detail route apparently resolves both the slugified-title form and the literal Contentful `slug` field to the same entry (fallback matching), and the sitemap generator uses the slugified-title form while the `/blog` listing page links use the literal `slug` field. This produces three duplicate-content URL pairs, three orphaned sitemap entries, and effectively splits SEO equity across two URLs per affected post. Recommend picking one canonical slug source (the Contentful `slug` field, since titles can change) and 301-redirecting the other variant to it.

**Severity key:** P1 = critical · P2 = warning · INFO = informational only, no action needed
