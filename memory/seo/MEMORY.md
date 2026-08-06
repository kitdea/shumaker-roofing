# SEO Agent Memory — Shumaker Roofing

**Summary**
- Total keywords tracked: 32
- Clusters: repair-frederick (16 keywords, published), gutter-install (16 keywords: 5 published, 4 qa-failed with unclear draft status, 7 researched with no draft yet)
- Last content published: 2026-08-05 (blog/skylight-repair-vs-replacement-how-to-decide-save-money, doc af0c8534-cd9b-4868-986d-0f362ca491f8 — the clarity rewrite; `_updatedAt` 2026-08-05T23:22:16Z, verified live V1-V12 on 2026-08-07 by /content-updater, which found it already published and wrote nothing. **No logged run published it** — second unlogged publish after how-long-do-gutters-last. Before it: blog/how-much-do-new-gutters-cost-maryland on 2026-08-05.)
- Last QA run: 2026-08-07 (services/siding, rewritten draft — **FAIL**, 43/45 verifiable after line edits, quality 8/10. Blocked on two user inputs, not on work: check 12 (the manufacturer-lines `[VERIFY]`) and check 16 (no siding photo exists as a Sanity asset). First run to use the frontmatter fallback added 2026-08-07 — stored-field checks 13/14/15/18/19/20/21 scored `PASS (proposed)` off the draft file instead of logging UNVERIFIABLE, which is the fallback working as intended.)
- Prior QA run: 2026-07-20 (cannibalization-fix change-set for the 2 escalated clusters, 8 posts — FAIL on checks 13 + 15, both confined to the re-scoped A1 post signs-of-summer-heat-damage: seoTitle 49 chars, and primary keyword missing from its new seoDesc. All structural/cannibalization/link checks PASS. Not yet published — fix A1's two fields and re-run /qa before /content-updater.)
- Last content audit: 2026-08-05 — 16 blog / 11 services / 4 locations / 14 static routes. 1 High publish-failure (gutters post never published) — **now resolved**, along with `coverage:location:chambersburg-pa` (was escalated at 5 consecutive audits). First clarity sweep run.
- **Two High pipeline defects found and fixed 2026-08-05** (both surfaced while publishing the gutters post; see audit-findings-log.md). Shared root cause: **both skills scored checks against the conversation instead of a queried document.** `/qa` evaluated stored-field checks against the draft text `/seo-writer` described rather than the Sanity document, and check 23 was worded "confirm this field *will be* set" — which is how `publishedDate: null` and `noindex: true` reached a 29/29 PASS. `/content-updater`'s Step 3 slug lookup lacked a `drafts.**` filter, so the draft id propagated into Step 5's verification, which then verified the draft against itself *and* reported field counts matching no real document. Both now require a real GROQ read and an echoed observed value per verdict; content-updater additionally separates `$pubId`/`$draftId` and checks the live URL. **Verdicts logged before 2026-08-05 by either skill are unreliable** — the 2026-07-16 publish verification has been retracted.

- Last competitor run: 2026-08-05 — 3 new domains added (topperconstruction.com, politzenterprises.com, frederickroofers.com), 11 clusters scored. Top open cluster: 4-way tie at 18/25 (gutter-install-recovery, free-estimate-landing, commercial-roofing-frederick, storm-damage-frederick). Run was **Semrush-only** — Supermetrics team trial expired 2026-06-04, so no GSC/GA4; all authority scores capped at 3 and unvalidated. **Structural gap found:** Shumaker sells metal roofing and siding (user-confirmed 2026-08-05) but has NO `services` document for either — competitors (pjsroofing, politzenterprises, topperconstruction) own those terms uncontested. Create the two service pages before writing cluster content.

## Files

- [keywords.md](keywords.md) — Keyword research tracker
- [content-log.md](content-log.md) — Published/updated content log
- [qa-log.md](qa-log.md) — QA pass/fail decisions
- [rankings.md](rankings.md) — SEO position snapshots
- [competitors.md](competitors.md) — Competitor organic keyword snapshots and gap analysis
- [audit-log.md](audit-log.md) — Content audit history (live Sanity ground-truth vs. memory drift, duplicate-intent clusters, coverage gaps)
- [audit-findings-log.md](audit-findings-log.md) — Per-finding audit-over-audit tracking (new/still-open/resolved/regressed status per finding ID, enables staleness escalation)
- [publish-verification-log.md](publish-verification-log.md) — Post-publish verification results per content-updater run (live-document checks, not draft checks)
- [opportunity-clusters.md](opportunity-clusters.md) — Scored competitive opportunity clusters from /competitor-researcher (relevance/authority/demand/difficulty/effort, max 25) with a status per cluster
- [action-plan-log.md](action-plan-log.md) — What /seo-project-manager named as an action on each run and whether it was dispatched (enables stalled-work detection across runs; created on the next PM run)
