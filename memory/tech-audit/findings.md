# Open Findings — updated 2026-06-28 22:07 UTC

| ID | Module | URL | Issue | Severity | First Seen | Status |
|----|--------|-----|-------|----------|------------|--------|
| H-039 | Health | /blog/roof-repair-frederick-md | Sanity blog document exists (missing `publishedDate` and `featuredImage`) but route 404s on live site and is absent from sitemap.xml — orphaned/broken CMS content | P1 | 2026-06-24 | closed (2026-07-03: route now 200 live; root cause was `app/sitemap.ts` missing `revalidate` export so it never refreshed post-deploy — added `revalidate = 3600`; also patched+published missing `publishedDate`. `featuredImage` still missing, tracked separately) |
| H-017 | Health | /services/commercial-flat-and-low-slope-roofing-restoration | Sanity field integrity: servicesImage missing | P2 | 2026-06-24 | open |
| H-018 | Health | /services/gutter-installation | Sanity field integrity: servicesImage missing | P2 | 2026-06-24 | open |
| H-019 | Health | /services/residential-roofing | Sanity field integrity: servicesImage missing | P2 | 2026-06-24 | open |
| H-020 | Health | /services/roof-rejuvenation | Sanity field integrity: servicesImage missing | P2 | 2026-06-24 | open |
| H-021 | Health | /services/roof-repair | Sanity field integrity: servicesImage missing | P2 | 2026-06-24 | open |
| H-022 | Health | /services/roof-replacement | Sanity field integrity: servicesImage missing | P2 | 2026-06-24 | open |
| H-023 | Health | /services/skylight-installation | Sanity field integrity: servicesImage missing | P2 | 2026-06-24 | open |
| H-024 | Health | /services/solar-contractor | Sanity field integrity: servicesImage missing | P2 | 2026-06-24 | open |
| H-025 | Health | /services/storm-damage-restoration | Sanity field integrity: servicesImage missing | P2 | 2026-06-24 | open |
| H-026 | Health | /blog/skylight-repair-vs-replacement-how-to-decide-save-money | Sanity field integrity: featuredImage missing | P2 | 2026-06-24 | open |
| H-027 | Health | /blog/best-roofing-contractors-in-frederick-md | Sanity field integrity: featuredImage missing | P2 | 2026-06-24 | open |
| S-010 | SEO | /about | Missing og:image meta tag | P2 | 2026-06-08 | open |
| S-011 | SEO | /services | Missing og:image meta tag | P2 | 2026-06-08 | open |
| S-012 | SEO | /blog | Missing og:image meta tag | P2 | 2026-06-08 | open |
| S-013 | SEO | /contact | Missing og:image meta tag | P2 | 2026-06-08 | open |
| S-014 | SEO | /book-appointment | Missing og:image meta tag | P2 | 2026-06-08 | open |
| S-015 | SEO | /service-areas/ | Missing og:image meta tag | P2 | 2026-06-08 | open |
| S-034 | SEO | /services/commercial-flat-and-low-slope-roofing-restoration | Missing og:image meta tag | P2 | 2026-06-24 | open |
| S-035 | SEO | /services/gutter-installation | Missing og:image meta tag | P2 | 2026-06-24 | open |
| S-036 | SEO | /services/residential-roofing | Missing og:image meta tag | P2 | 2026-06-24 | open |
| S-037 | SEO | /services/roof-rejuvenation | Missing og:image meta tag | P2 | 2026-06-24 | open |
| S-038 | SEO | /services/roof-repair | Missing og:image meta tag | P2 | 2026-06-24 | open |
| S-039 | SEO | /services/roof-replacement | Missing og:image meta tag | P2 | 2026-06-24 | open |
| S-040 | SEO | /services/skylight-installation | Missing og:image meta tag | P2 | 2026-06-24 | open |
| S-041 | SEO | /services/solar-contractor | Missing og:image meta tag | P2 | 2026-06-24 | open |
| S-042 | SEO | /services/storm-damage-restoration | Missing og:image meta tag | P2 | 2026-06-24 | open |
| S-043 | SEO | /blog/skylight-repair-vs-replacement-how-to-decide-save-money | Missing og:image meta tag | P2 | 2026-06-24 | open |
| S-044 | SEO | /blog/best-roofing-contractors-in-frederick-md | Missing og:image meta tag | P2 | 2026-06-24 | open |
| S-048 | SEO | /careers | Missing og:image meta tag | P2 | 2026-06-28 | open |
| S-049 | SEO | /faqs | Missing og:image meta tag | P2 | 2026-06-28 | open |
| S-050 | SEO | /projects | Missing og:image meta tag | P2 | 2026-06-28 | open |
| S-051 | SEO | /testimonials | Missing og:image meta tag | P2 | 2026-06-28 | open |
| S-052 | SEO | /roofs-for-heroes | Missing og:image meta tag | P2 | 2026-06-28 | open |
| S-053 | SEO | /testimonials | No JSON-LD schema block detected | P2 | 2026-06-28 | open |
| S-054 | SEO | /roofs-for-heroes | No JSON-LD schema block detected | P2 | 2026-06-28 | open |
| S-055 | SEO | /testimonials | Orphaned page — zero inbound internal links | P2 | 2026-06-28 | open |
| S-056 | SEO | /roofs-for-heroes | Orphaned page — zero inbound internal links | P2 | 2026-06-28 | open |
| P-049 | Performance | /about | LCP needs work: 2701ms | P2 | 2026-06-28 | open |
| P-050 | Performance | /services | LCP needs work: 2551ms | P2 | 2026-06-28 | open |
| P-051 | Performance | /contact | Performance score needs work: 59 | P2 | 2026-06-28 | open |
| P-052 | Performance | /book-appointment | CLS needs work: 0.214 · Performance score needs work: 76 | P2 | 2026-06-28 | open |
| P-053 | Performance | /service-areas | LCP needs work: 3871ms · Performance score needs work: 88 | P2 | 2026-06-28 | open |
| P-054 | Performance | /projects | Performance score needs work: 77 | P2 | 2026-06-28 | open |
| P-055 | Performance | /testimonials | LCP needs work: 2776ms · Performance score needs work: 88 | P2 | 2026-06-28 | open |
| P-056 | Performance | /roofs-for-heroes | LCP needs work: 2851ms · Performance score needs work: 73 | P2 | 2026-06-28 | open |
| P-057 | Performance | /services/chimney-maintenance | LCP needs work: 3001ms · Performance score needs work: 89 | P2 | 2026-06-28 | open |
| P-058 | Performance | /services/roof-installation | LCP needs work: 2551ms | P2 | 2026-06-28 | open |
| P-059 | Performance | /blog/skylight-repair-vs-replacement-how-to-decide-save-money | LCP needs work: 2926ms | P2 | 2026-06-28 | open |
| P-060 | Performance | /blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them | LCP needs work: 3601ms · Performance score needs work: 83 | P2 | 2026-06-28 | open |
| P-061 | Performance | /service-areas/chambersburg-pa | LCP needs work: 2893ms · Performance score needs work: 80 | P2 | 2026-06-28 | open |
| P-062 | Performance | /service-areas/frederick-md | LCP needs work: 2738ms | P2 | 2026-06-28 | open |
| P-063 | Performance | /service-areas/hagerstown-md | LCP needs work: 2892ms | P2 | 2026-06-28 | open |
| P-064 | Performance | /service-areas/reston-va | LCP needs work: 2890ms | P2 | 2026-06-28 | open |
| H-034 | Health | /careers | Live page, not present in sitemap.xml | P2 | 2026-06-24 | closed |
| H-035 | Health | /faqs | Live page, not present in sitemap.xml | P2 | 2026-06-24 | closed |
| H-036 | Health | /projects | Live page, not present in sitemap.xml | P2 | 2026-06-24 | closed |
| H-037 | Health | /testimonials | Live page, not present in sitemap.xml | P2 | 2026-06-24 | closed |
| H-038 | Health | /roofs-for-heroes | Live page, not present in sitemap.xml | P2 | 2026-06-24 | closed |
| S-029 | SEO | /careers | Live page absent from sitemap.xml | P2 | 2026-06-24 | closed |
| S-030 | SEO | /faqs | Live page absent from sitemap.xml | P2 | 2026-06-24 | closed |
| S-031 | SEO | /projects | Live page absent from sitemap.xml | P2 | 2026-06-24 | closed |
| S-032 | SEO | /testimonials | Live page absent from sitemap.xml | P2 | 2026-06-24 | closed |
| S-033 | SEO | /roofs-for-heroes | Live page absent from sitemap.xml | P2 | 2026-06-24 | closed |
| P-021 | Performance | /contact | CLS needs work: 0.102 · Performance score needs work: 64 | P2 | 2026-06-24 | closed |
| P-022 | Performance | /book-appointment | CLS poor: 0.481 (threshold 0.25) · Performance score needs work: 64 | P1 | 2026-06-24 | closed |
| P-023 | Performance | /service-areas | LCP needs work: 2551ms | P2 | 2026-06-24 | closed |
| P-037 | Performance | /blog/roof-replacement-tax-credit-2026 | LCP needs work: 3331ms · Performance score needs work: 85 | P2 | 2026-06-24 | closed |
| P-040 | Performance | /blog/how-summer-heat-slowly-damages-asphalt-shingles-in-maryland | LCP needs work: 3256ms | P2 | 2026-06-24 | closed |
| P-041 | Performance | /blog/preparing-your-roof-for-summer-storms-in-frederick-md | LCP needs work: 3031ms | P2 | 2026-06-24 | closed |
| P-042 | Performance | /blog/signs-of-summer-heat-damage-on-your-roof-in-frederick-md | LCP needs work: 3256ms · Performance score needs work: 88 | P2 | 2026-06-24 | closed |
| P-043 | Performance | /blog/how-marylands-summer-heat-affects-roofs-in-frederick-md | LCP needs work: 3212ms | P2 | 2026-06-24 | closed |
| P-045 | Performance | /service-areas/chambersburg-pa | LCP needs work: 2551ms | P2 | 2026-06-24 | closed |
| P-047 | Performance | /service-areas/hagerstown-md | LCP needs work: 3925ms · Performance score needs work: 83 | P2 | 2026-06-24 | closed |
| H-001 | Health | /about | 404 Not Found | P1 | 2026-05-21 | closed |
| H-002 | Health | /service-areas | 404 Not Found | P1 | 2026-05-21 | closed |
| H-003 | Health | /service-areas/adamstown-md | 404 Not Found | P1 | 2026-05-21 | closed |
| H-004 | Health | /service-areas/hagerstown-md | 404 Not Found | P1 | 2026-05-21 | closed |
| H-005 | Health | /service-areas/frederick-md | 404 Not Found | P1 | 2026-05-21 | closed |
| H-006 | Health | /service-areas/chambersburg-pa | 404 Not Found | P1 | 2026-05-21 | closed |
| H-007 | Health | /service-areas/reston-va | 404 Not Found | P1 | 2026-05-21 | closed |
| H-008 | Health | /services/residential-roofing | 404 Not Found | P1 | 2026-05-21 | closed |
| H-009 | Health | /services/storm-damage-restoration | 404 Not Found | P1 | 2026-05-21 | closed |
| H-010 | Health | /blog/roof-repair-in-frederick-md-fast-reliable | 404 Not Found | P1 | 2026-05-21 | closed |
| H-011 | Health | /blog/the-best-roofing-contractors-in-frederick-md-why-shumaker-roofing-is-your-1-choice | 404 Not Found (not verified — consistent with pattern) | P1 | 2026-05-21 | closed |
| H-012 | Health | /blog/three-common-winter-roof-damage-issues-how-to-prevent-them | 404 Not Found | P1 | 2026-05-21 | closed |
| H-013 | Health | /blog/roof-replacement-tax-credit-2026-what-homeowners-need-to-know | 404 Not Found | P1 | 2026-05-21 | closed |
| P-001 | Performance | /services | LCP poor: 10156ms (threshold 4000ms) | P1 | 2026-05-21 | closed |
| H-028 | Health | /blog/how-maryland-s-summer-heat-affects-roofs-in-frederick-md | Sitemap entry returns 404 Not Found — stale slug | P1 | 2026-06-24 | closed |
| S-028 | SEO | /blog/how-maryland-s-summer-heat-affects-roofs-in-frederick-md | Sitemap `<loc>` resolves to 404 — stale slug, no matching Sanity document | P1 | 2026-06-24 | closed |
| P-018 | Performance | /about | LCP poor: 4156ms (threshold 4000ms) · Performance score needs work: 82 | P1 | 2026-06-24 | closed |
| P-026 | Performance | /services/chimney-maintenance | LCP poor: 5024ms (threshold 4000ms) · Performance score needs work: 78 | P1 | 2026-06-24 | closed |
| P-046 | Performance | /service-areas/frederick-md | LCP poor: 4223ms (threshold 4000ms) · Performance score needs work: 80 | P1 | 2026-06-24 | closed |
| P-048 | Performance | /service-areas/reston-va | LCP poor: 4232ms (threshold 4000ms) · Performance score needs work: 82 | P1 | 2026-06-24 | closed |
| H-014 | Health | /services/roof-rejuvenation | Binary/JPEG response instead of HTML — possible image redirect | P2 | 2026-05-21 | closed |
| H-015 | Health | /services/chimney-maintenance | Binary/JPEG response instead of HTML — possible image redirect | P2 | 2026-05-21 | closed |
| S-001 | SEO | lib/utils.ts:22 | SITE_URL typo: "shumakeroofing.com" missing 'er' — may corrupt canonical URL generation | P2 | 2026-05-21 | closed |
| S-002 | SEO | /robots.txt | Sitemap directive uses no-www (shumakerroofing.com) while canonical domain is www.shumakerroofing.com | P2 | 2026-05-21 | closed |
| S-003 | SEO | / | No JSON-LD schema detected | P2 | 2026-05-21 | closed |
| S-004 | SEO | /services | No JSON-LD schema detected | P2 | 2026-05-21 | closed |
| S-005 | SEO | /blog | No JSON-LD schema detected | P2 | 2026-05-21 | closed |
| S-006 | SEO | /contact | No JSON-LD schema detected | P2 | 2026-05-21 | closed |
| S-007 | SEO | /blog/skylight-repair-vs-replacement-how-to-decide-save-money | Article/BlogPosting JSON-LD schema not confirmed | P2 | 2026-05-21 | closed |
| S-008 | SEO | Multiple live pages | Meta description, canonical, og tags not verifiable via automated check — manual review needed | P2 | 2026-05-21 | closed |
| P-002 | Performance | / | CLS needs work: 0.139 (threshold 0.25) | P2 | 2026-05-21 | closed |
| P-003 | Performance | /blog | LCP needs work: 2914ms · CLS needs work: 0.132 | P2 | 2026-05-21 | closed |
| S-009 | SEO | / | Missing og:image meta tag | P2 | 2026-06-08 | closed |
| S-016 | SEO | /service-areas/chambersburg-pa | Missing og:image meta tag | P2 | 2026-06-08 | closed |
| S-017 | SEO | /service-areas/frederick-md | Missing og:image meta tag | P2 | 2026-06-08 | closed |
| S-018 | SEO | /service-areas/hagerstown-md | Missing og:image meta tag | P2 | 2026-06-08 | closed |
| S-019 | SEO | /service-areas/reston-va | Missing og:image meta tag | P2 | 2026-06-08 | closed |
| S-020 | SEO | /about | No JSON-LD schema detected | P2 | 2026-06-08 | closed |
| S-021 | SEO | /service-areas/ | No JSON-LD schema detected | P2 | 2026-06-08 | closed |
| S-022 | SEO | /blog/roof-replacement-tax-credit-2026-what-homeowners-need-to-know | Duplicate content/title vs. linked-but-unsitemapped /blog/roof-replacement-tax-credit-2026 | P2 | 2026-06-08 | closed |
| S-023 | SEO | /blog/the-best-roofing-contractors-in-frederick-md-why-shumaker-roofing-is-your-1-choice | Duplicate content/title vs. linked-but-unsitemapped /blog/best-roofing-contractors-in-frederick-md | P2 | 2026-06-08 | closed |
| S-024 | SEO | /blog/three-common-winter-roof-damage-issues-how-to-prevent-them | Duplicate content/title vs. linked-but-unsitemapped /blog/common-winter-roof-damage-issues-and-how-to-prevent-them | P2 | 2026-06-08 | closed |
| S-025 | SEO | /blog/roof-replacement-tax-credit-2026-what-homeowners-need-to-know | Orphaned page — zero inbound internal links | P2 | 2026-06-08 | closed |
| S-026 | SEO | /blog/the-best-roofing-contractors-in-frederick-md-why-shumaker-roofing-is-your-1-choice | Orphaned page — zero inbound internal links | P2 | 2026-06-08 | closed |
| S-027 | SEO | /blog/three-common-winter-roof-damage-issues-how-to-prevent-them | Orphaned page — zero inbound internal links | P2 | 2026-06-08 | closed |
| P-004 | Performance | / | Performance score needs work: 68 | P2 | 2026-06-08 | closed |
| P-005 | Performance | /contact | CLS needs work: 0.121 · Performance score needs work: 62 | P2 | 2026-06-08 | closed |
| P-006 | Performance | /book-appointment | CLS needs work: 0.220 · Performance score needs work: 73 | P2 | 2026-06-08 | closed |
| P-007 | Performance | /service-areas/ | LCP needs work: 3908ms · Performance score needs work: 84 | P2 | 2026-06-08 | closed |
| P-008 | Performance | /services/roof-rejuvenation | LCP needs work: 2852ms · Performance score needs work: 88 | P2 | 2026-06-08 | closed |
| P-009 | Performance | /services/chimney-maintenance | LCP needs work: 2591ms | P2 | 2026-06-08 | closed |
| P-010 | Performance | /services/roof-repair | LCP needs work: 2553ms · Performance score needs work: 86 | P2 | 2026-06-08 | closed |
| P-011 | Performance | /services/storm-damage-restoration | Performance score needs work: 86 | P2 | 2026-06-08 | closed |
| P-012 | Performance | /services/residential-roofing | LCP needs work: 2583ms | P2 | 2026-06-08 | closed |
| P-013 | Performance | /services/solar-contractor | Performance score needs work: 87 | P2 | 2026-06-08 | closed |
| P-014 | Performance | /service-areas/chambersburg-pa | LCP needs work: 2570ms · Performance score needs work: 88 | P2 | 2026-06-08 | closed |
| P-015 | Performance | /service-areas/hagerstown-md | LCP needs work: 2884ms | P2 | 2026-06-08 | closed |
| P-016 | Performance | /service-areas/reston-va | LCP needs work: 2975ms | P2 | 2026-06-08 | closed |
| H-016 | Health | /service-areas/ | Redirect chain: www→non-www, then trailing-slash strip | P2 | 2026-06-24 | closed |
| H-029 | Health | /blog/how-maryland-s-summer-heat-affects-roofs-in-frederick-md | Zero inbound internal links (orphaned in addition to dead) | P2 | 2026-06-24 | closed |
| H-030 | Health | /service-areas/chambersburg-pa | Redirect chain (2 hops): www→non-www, then trailing-slash strip | P2 | 2026-06-24 | closed |
| H-031 | Health | /service-areas/frederick-md | Redirect chain (2 hops) | P2 | 2026-06-24 | closed |
| H-032 | Health | /service-areas/hagerstown-md | Redirect chain (2 hops) | P2 | 2026-06-24 | closed |
| H-033 | Health | /service-areas/reston-va | Redirect chain (2 hops) | P2 | 2026-06-24 | closed |
| S-045 | SEO | /blog/how-maryland-s-summer-heat-affects-roofs-in-frederick-md | No canonical tag present (404 page) | P2 | 2026-06-24 | closed |
| S-047 | SEO | /blog/how-maryland-s-summer-heat-affects-roofs-in-frederick-md | Orphaned — zero inbound internal links | P2 | 2026-06-24 | closed |
| P-017 | Performance | / | LCP needs work: 3481ms · Performance score needs work: 88 | P2 | 2026-06-24 | closed |
| P-019 | Performance | /services | LCP needs work: 3331ms | P2 | 2026-06-24 | closed |
| P-020 | Performance | /blog | LCP needs work: 3256ms | P2 | 2026-06-24 | closed |
| P-024 | Performance | /privacy-policy | LCP needs work: 2656ms | P2 | 2026-06-24 | closed |
| P-025 | Performance | /terms-and-conditions | LCP needs work: 2731ms | P2 | 2026-06-24 | closed |
| P-027 | Performance | /services/commercial-flat-and-low-slope-roofing-restoration | LCP needs work: 2731ms | P2 | 2026-06-24 | closed |
| P-028 | Performance | /services/gutter-installation | LCP needs work: 2581ms | P2 | 2026-06-24 | closed |
| P-029 | Performance | /services/residential-roofing | LCP needs work: 2731ms | P2 | 2026-06-24 | closed |
| P-030 | Performance | /services/roof-installation | LCP needs work: 3509ms | P2 | 2026-06-24 | closed |
| P-031 | Performance | /services/roof-rejuvenation | LCP needs work: 2581ms | P2 | 2026-06-24 | closed |
| P-032 | Performance | /services/roof-repair | LCP needs work: 2731ms | P2 | 2026-06-24 | closed |
| P-033 | Performance | /services/roof-replacement | LCP needs work: 2731ms | P2 | 2026-06-24 | closed |
| P-034 | Performance | /services/skylight-installation | LCP needs work: 2581ms · Performance score needs work: 88 | P2 | 2026-06-24 | closed |
| P-035 | Performance | /services/solar-contractor | LCP needs work: 2581ms | P2 | 2026-06-24 | closed |
| P-036 | Performance | /services/storm-damage-restoration | LCP needs work: 2731ms | P2 | 2026-06-24 | closed |
| P-038 | Performance | /blog/skylight-repair-vs-replacement-how-to-decide-save-money | LCP needs work: 2581ms | P2 | 2026-06-24 | closed |
| P-039 | Performance | /blog/best-roofing-contractors-in-frederick-md | LCP needs work: 2656ms | P2 | 2026-06-24 | closed |
| P-044 | Performance | /blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them | LCP needs work: 2956ms | P2 | 2026-06-24 | closed |
| S-046 | SEO | /blog/how-maryland-s-summer-heat-affects-roofs-in-frederick-md | noindex detected — logged only, no action taken | INFO | 2026-06-24 | closed |
