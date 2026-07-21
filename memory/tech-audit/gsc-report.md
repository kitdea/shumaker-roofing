# GSC Readiness Report — 2026-07-21 14:00 UTC

| Check | Target | Finding | Severity |
|-------|--------|---------|----------|
| Google Verification Tag | / | google-site-verification tag found (content starts oTVHtZ3S***) | — |
| Google Analytics / Tag Manager | / | Google Analytics (G-4NR3D3JVVL) and Google Tag Manager detected | INFO |
| Sitemap Accessibility | /sitemap.xml | Returns 200; robots.txt `Sitemap:` directive matches the fetched sitemap URL | — |
| Canonical Domain Consistency | www vs non-www | www redirects to non-www in 1 hop (308); canonical domain enforced | — |

**Severity key:** P1 = critical · P2 = warning · INFO = informational · — = clean

All GSC readiness checks are clean this run — no change from the prior audit.

**Note:** An initial pass using WebFetch's summarizing fetch reported the verification tag and GA/GTM as absent. This was a false negative — the tags are embedded inside a Next.js RSC streaming payload rather than plain `<meta>`/`<script>` markup, which the summarizing fetch missed. Verified directly against raw HTML via `curl` before reporting; both are confirmed present. Future runs of this check should fetch raw HTML (not a summarizing tool) for this specific check.
