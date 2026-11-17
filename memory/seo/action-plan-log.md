# SEO Action Plan Log

## 2026-11-12

| Item | Target | Routed to | Dispatched |
|------|--------|-----------|------------|
| No recent content audit (audit-log.md was 99 days stale, past the 60-day threshold) | sitewide | /content-auditor | yes — dispatched this run as the single top Immediate Action; see memory/seo/audit-log.md 2026-11-12 row and memory/seo/audit-findings-log.md for full results |
| coverage:service:commercial-flat-and-low-slope-roofing-restoration (ESCALATED, 6 consecutive audits unresolved) | /services/commercial-flat-and-low-slope-roofing-restoration | /keyword-researcher then /seo-writer | no — this is the top-ranked Immediate Action for the *next* run (one action per run; this run's dispatch went to /content-auditor instead because the data it would have been actioned against was 99 days stale — correctly so, since 2 of the 3 findings escalated on that stale data (chimney-maintenance, solar-contractor) had already resolved themselves) |
| cannibal:best-roofing-contractors-in-frederick-md->homepage (ESCALATED, 3 consecutive audits) | blog/best-roofing-contractors-in-frederick-md (H1 retitle) | /seo-writer then /content-updater | no |
| metadata:blog:categories-null (ESCALATED, 3 consecutive audits) | blog/summer-roof-inspection-checklist-frederick-md, blog/signs-of-summer-heat-damage-on-your-roof-in-frederick-md | /seo-writer then /content-updater | no |
| metadata:blog:absolute-internal-links (REGRESSED from 0 sitewide) | 8 blog posts (3 new, 5 regressed) | /seo-writer then /content-updater, or a direct Sanity patch as in the 2026-08-03 fix | no |
| qa-failed keywords: gutter-install cluster (4 rows: gutter installation frederick md / hagerstown md / reston va / chambersburg pa) | keywords.md gutter-install cluster | /seo-writer revision or /qa re-run | no |
| qa-failed keywords: siding cluster (5 rows) | keywords.md siding-frederick cluster | /qa re-run against the now-live /services/siding page (siding published since the last QA-FAIL on 2026-08-07, but with no logged QA PASS backing the publish) | no |
| Competitor data stale, all 5 tracked domains (99-121 days old) | frederickroofrepair.com, pjsroofing.com, topperconstruction.com, politzenterprises.com, frederickroofers.com | /competitor-researcher | no |
| Opportunity-clusters stale (99 days, past the 90-day quarterly threshold) | sitewide | /competitor-researcher (re-score) | no |
| 3 unstarted high-score (>=18/25) open opportunity clusters | free-estimate-landing, commercial-roofing-frederick, storm-damage-frederick | /keyword-researcher | no |
| researched-no-draft keywords (7 rows, gutter-install cluster) | gutter replacement/contractor frederick md, gutter installation near me/cost/company, seamless gutter installation cost, gutter installation contractor near me | /seo-writer | no |
| 219 unique gap keywords from competitors.md not yet in keywords.md (tool-counted) | sitewide | /keyword-researcher | no |
| All content-log.md entries >90 days old (maintenance) | sitewide | content refresh — no single agent owns this, flagging for the next planning cycle | no |
| No rankings.md baseline for any published page (maintenance, file is empty) | sitewide | add rankings baseline — outside this pipeline's agents, needs a GSC/rank-tracker pull | no |

## 2026-11-17

| Item | Target | Routed to | Dispatched |
|------|--------|-----------|------------|
| coverage:service:commercial-flat-and-low-slope-roofing-restoration (ESCALATED, 6 consecutive audits; NO PROGRESS since the 2026-11-12 plan, not dispatched then) + opportunity clusters commercial-roofing-frederick (18/25) and flat-roof-frederick (18/25), same target page | /services/commercial-flat-and-low-slope-roofing-restoration | /keyword-researcher then /seo-writer | yes. /keyword-researcher added 16 keywords (commercial-flat ×12, commercial-flat-blog ×4), 3,210 Semrush units. Finding stays open until /seo-writer drafts a page or blog post that links in and /content-auditor re-checks it. Next: /seo-writer commercial-flat |
| cannibal:best-roofing-contractors-in-frederick-md->homepage (ESCALATED, 3; NO PROGRESS since 2026-11-12, not dispatched) | blog/best-roofing-contractors-in-frederick-md (H1 retitle) | /seo-writer then /content-updater | no. One action per run |
| metadata:blog:categories-null (ESCALATED, 3; NO PROGRESS since 2026-11-12, not dispatched) | blog/summer-roof-inspection-checklist-frederick-md, blog/signs-of-summer-heat-damage-on-your-roof-in-frederick-md | /seo-writer then /content-updater | no |
| metadata:blog:absolute-internal-links (REGRESSED, 37 links / 8 posts; NO PROGRESS since 2026-11-12) | 8 blog posts | /content-updater or a direct Sanity patch (as 2026-08-03) | no |
| Rejuvenation cannibalization on live SERPs (4 URLs for "roof rejuvenation frederick md"; blog/when-to-get #4 beats /services/roof-rejuvenation #43), which contradicts content-auditor's 2026-11-12 "resolved" verdict; opportunity cluster roof-rejuvenation-consolidation 18/25 | blog/when-to-get-roof-rejuvenation-frederick-md vs /services/roof-rejuvenation | /seo-writer then /content-updater (per SOP) | no |
| Homepage WRONG URL for 4 roof-repair cluster terms (frederick county roof repair, frederick roof repair, etc.) | / vs /services/roof-repair | /seo-writer then /content-updater | no |
| Siding keyword rows still qa-failed; page live since 2026-11-04 with no QA PASS and no content-log entry (latest qa-log row: FAIL 2026-08-07, 102 days) | services/siding | /qa against the live page (draft file is stale) | no |
| gutter-install qa-failed rows ×4 (stale status, no draft on disk) | keywords.md gutter-install cluster / services/gutter-installation | /seo-writer | no |
