# Technical SEO Report — 2026-09-09 21:34 UTC

| Check | URL | Finding | Severity |
|-------|-----|---------|----------|
| robots.txt | /robots.txt | 200, Sitemap directive present, no critical paths blocked | — (clean) |
| Sitemap validity | /sitemap.xml | 52/52 URLs present, all with `<lastmod>` | — (clean) |
| Meta description | /blog/replacing-gutters-with-new-roof-frederick-md | `<meta name="description">` missing | P1 |
| Meta description | /service-areas/hagerstown-md | `<meta name="description">` missing | P1 |
| og:description | /blog/replacing-gutters-with-new-roof-frederick-md | `og:description` missing | P2 |
| og:description | /service-areas/hagerstown-md | `og:description` missing | P2 |
| og:image | /blog/replacing-gutters-with-new-roof-frederick-md | `og:image` missing | P2 |
| Noindex | /blog/how-much-do-new-gutters-cost-maryland | noindex detected — logged only, no action taken | INFO |

**Clean checks (omitted above per rows, confirmed clean sitewide):** canonical tags present and matching on all 52 pages · JSON-LD present on all 52 pages with all required fields for `LocalBusiness`/`RoofingContractor`, `Article`, `FAQPage`, `ProfilePage` types validated (no parse errors, no missing required fields) · no duplicate `<title>` values across the 52 pages · no orphaned sitemap pages (all have inbound internal links) · no other pages missing title/og:title/og:image.

**Severity key:** P1 = critical · P2 = warning · INFO = informational only, no action needed

**Notes:**
- Both new P1 findings (`replacing-gutters-with-new-roof-frederick-md`, `service-areas/hagerstown-md`) are missing meta description entirely — verified directly against raw HTML (not a regex false negative); compared to a known-good page (`/about`) to confirm the pattern would have matched if present.
- Checked `memory/seo/audit-findings-log.md` before logging — no existing open `metadata:...` finding for these two URLs/fields there, so these are not duplicates of content-auditor's tracking.
