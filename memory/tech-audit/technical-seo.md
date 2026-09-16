# Technical SEO Report — 2026-09-14 09:00 UTC

| Check | URL | Finding | Severity |
|-------|-----|---------|----------|
| og:image | /blog/replacing-gutters-with-new-roof-frederick-md | og:image missing or empty | P2 |
| JSON-LD (LocalBusiness) | /projects | `LocalBusiness` object (nested in `CollectionPage.provider`) missing required field `telephone` | P1 |

**Severity key:** P1 = critical · P2 = warning · INFO = informational only, no action needed

**Summary:**
- **robots.txt:** 200, `Allow: /`, `Sitemap:` directive present, no critical paths blocked. Clean.
- **Sitemap validity:** all 52 `<url>` entries have `<lastmod>`. Clean.
- **Meta tags (title/description/og:title/og:description/og:image):** all pages have non-empty `<title>` and `<meta name="description">`. All pages have `og:title` and `og:description`. One page (`/blog/replacing-gutters-with-new-roof-frederick-md`) is still missing `og:image` (P2 above) — recurring, matches open finding S-085 from prior runs.
- **Canonical tags:** present and matching expected URL on all 52 pages. Clean.
- **JSON-LD schema:** all pages carry at least one valid `application/ld+json` block (checked with a Node JSON parser, `@graph`- and nested-object types included). One new issue found this run: `/projects` embeds a `LocalBusiness` object nested inside its `CollectionPage.provider` field with `name` and `address` present but no `telephone` — flagged P1 per the `LocalBusiness` required-field table. This is a newly-detected finding (no prior open finding at this URL/field per findings.md).
- **Noindex flags:** no pages currently emit `noindex`. Clean.
- **Duplicate titles:** no `<title>` value repeats across pages. Clean.
- **Orphaned pages:** every sitemap URL has at least one inbound internal link from another page (all pages link to all others via the global nav). Clean.

No open findings in `memory/seo/audit-findings-log.md` matched either issue above by URL/field, so both are reported here without cross-referencing an existing SEO-agent finding ID.
