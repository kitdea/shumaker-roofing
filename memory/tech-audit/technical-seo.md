# Technical SEO Report — 2026-07-21 14:00 UTC

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
| og:image | /blog/skylight-repair-vs-replacement-how-to-decide-save-money | Missing og:image meta tag | P2 |
| og:image | /blog/best-roofing-contractors-in-frederick-md | Missing og:image meta tag | P2 |
| og:image | /blog/roof-repair-frederick-md | Missing og:image meta tag | P2 |
| og:description | /blog/maryland-roof-rejuvenation-contractor-frederick-md | Missing og:description meta tag | P2 |
| og:description | /blog/when-to-get-roof-rejuvenation-frederick-md | Missing og:description meta tag | P2 |
| og:description | /blog/roof-replacement-tax-credit-2026 | Missing og:description meta tag | P2 |
| og:description | /blog/summer-roof-inspection-checklist-frederick-md | Missing og:description meta tag | P2 |
| og:description | /blog/why-attic-ventilation-matters-in-summer-frederick-md | Missing og:description meta tag | P2 |
| Meta Tags | /blog/when-to-get-roof-rejuvenation-frederick-md | `<title>`/og:title has a trailing space ("...Frederick MD ") — cosmetic data-entry defect in the Sanity `title` field | P2 |
| Meta Tags | /blog/maryland-roof-rejuvenation-contractor-frederick-md | Meta description has a leading whitespace character before content | P2 |
| Meta Tags | /blog/why-attic-ventilation-matters-in-summer-frederick-md | Meta description has a leading whitespace character before content | P2 |
| Duplicate/Cannibalization | /blog/how-marylands-summer-heat-affects-roofs-in-frederick-md | Keyword cannibalization: near-duplicate topic/intent vs. the other two "summer heat damage" posts below | P2 |
| Duplicate/Cannibalization | /blog/how-summer-heat-slowly-damages-asphalt-shingles-in-maryland | Keyword cannibalization: near-duplicate topic vs. sibling posts; shares identical og:image with /blog/signs-of-summer-heat-damage-on-your-roof-in-frederick-md | P2 |
| Duplicate/Cannibalization | /blog/signs-of-summer-heat-damage-on-your-roof-in-frederick-md | Keyword cannibalization: near-duplicate topic vs. sibling posts; shares identical og:image with /blog/how-summer-heat-slowly-damages-asphalt-shingles-in-maryland | P2 |

**Severity key:** P1 = critical · P2 = warning · INFO = informational only, no action needed

**Clean checks (no findings — omitted from table per skill format):**
- robots.txt: returns 200, contains `Sitemap:` directive, no `Disallow` on any critical path.
- Sitemap validity: all 45 URLs return 200; every `<url>` entry has a `<lastmod>` value.
- Titles and meta descriptions: present and non-empty on all 45 pages.
- og:title: present and non-empty on all 45 pages.
- Canonical tags: present on all 45 pages and match the expected (trailing-slash-normalized) path.
- JSON-LD schema: every page has at least one JSON-LD block; all `LocalBusiness`, `Service`, `Article`, and `FAQPage` blocks found have every required field present. No P1 schema findings this run.
- Noindex: no `noindex` directive found on any page.
- Duplicate titles: no exact-duplicate `<title>` values found across the 45 pages.
- Orphaned pages: every sitemap URL has at least one inbound internal link (blog posts are cross-linked via the `/blog/author/tyler-schisler` archive page and inter-article "related posts" links even where not listed on the paginated `/blog` index).

**Notes:**
- 5 blog posts published since the last audit (all with `lastmod` after 2026-06-28) are missing `og:description` — this is a new gap on newly-published content, not a regression on existing pages.
- The "summer heat damage" cluster (3 posts) was previously not flagged; this run's full-content read surfaced it as a keyword-cannibalization risk worth a consolidation/differentiation review.
