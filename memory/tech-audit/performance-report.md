# Performance Report — 2026-05-21 14:00 UTC

| URL | LCP | CLS | INP | Score | Severity | Suggested Fix |
|-----|-----|-----|-----|-------|----------|---------------|
| /services | 10156ms | — | — | — | P1 | LCP: Check hero image size, lazy loading, and server response time |
| / | — | 0.139 | — | — | P2 | CLS: Set explicit width/height on images and embeds; avoid inserting content above the fold |
| /blog | 2914ms | 0.132 | — | — | P2 | LCP: Check hero image size, lazy loading, and server response time · CLS: Set explicit width/height on images and embeds; avoid inserting content above the fold |

**Severity key:** P1 = poor (immediate attention) · P2 = needs work (monitor)

## Notes
- PageSpeed API responses were partially truncated by the fetch layer; INP and performance score not extractable for most pages
- `/services` LCP 10,156ms confirmed from `lighthouseResult.audits["largest-contentful-paint"].numericValue` — critically slow on mobile
- Homepage CLS 0.139 and blog CLS 0.132 both fall in needs-work range (0.101–0.25)
- Blog LCP 2,914ms sourced from `loadingExperience` percentile — treat as approximate
- Remaining URLs not checked due to PageSpeed data truncation; recommend manual PSI run for all service detail pages
