# QA Log

| Date | Page | Result | Issues | Notes |
|------|------|--------|--------|-------|
| 2026-05-13 | blog/roof-repair-frederick-md | FAIL | 10 | 11/12 passed; only failure is missing Article schema notation in draft header — add Schema: Article line and re-run. |
| 2026-05-13 | blog/roof-repair-frederick-md | PASS | none | 12/12 passed after adding Article schema notation to draft header. |
| 2026-07-13 | blog/roof-repair-frederick-md | FAIL | 1,2,5 | Cannibalization-fix revision v1 targeted secondary keyword "how to tell if roof needs repair" in title/meta instead of primary "roof repair vs replacement maryland"; retitled to match, see next entry. |
| 2026-07-13 | blog/roof-repair-frederick-md | PASS | none | 15/15 passed, quality 8/10. Cannibalization-fix revision v2 — retitled to "Roof Repair vs. Replacement: How to Decide (Maryland Guide)" (informational angle) to stop competing with /services/roof-repair's commercial "roof repair" intent; deduplicated a repeated content block found in the live Sanity document; existing internal links to /services/roof-repair and /service-areas/frederick-md retained. |
| 2026-07-14 | services/roof-installation | PASS (scoped) | none | Metadata-only fix (checks 13,14,15,20,21 — the page's body content isn't changing, so checks 1-12/22-28 don't apply). SEO title 53 chars, description 155 chars, unique against every other live seoTitle/seoDescription, styled to match sibling service pages. User approved the draft before publish. Found via content-auditor 2026-07-14 (metadata:services:roof-installation:seoTitle+seoDescription). |
