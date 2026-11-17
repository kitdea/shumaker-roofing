# seo-project-manager run — 2026-11-12

Full text of the `/seo-project-manager` skill's output for this run, persisted verbatim.
Primary source of truth remains the skill's own files (which this run read and/or wrote):
`memory/seo/keywords.md`, `content-log.md`, `qa-log.md`, `rankings.md`, `competitors.md`,
`audit-log.md`, `audit-findings-log.md`, `opportunity-clusters.md`, `action-plan-log.md`.
This file is a standalone copy of the chat-facing report for convenience, not a new
source of truth.

---

## SEO Action Plan — 2026-11-12

### Stalled Since Last Plan

No `action-plan-log.md` existed before this run, so there is no prior plan to diff "named
but not resolved" items against — every item below is Priority -1's **direct check against
qa-log.md**, not a ledger comparison. Treat this run's `action-plan-log.md` (just written)
as the baseline for that comparison starting next run.

- **STUCK 97 days (by qa-log.md's own dates): `services/siding`** failed QA on 2026-08-07
  (checks 12, 16 — unresolved manufacturer-lines `[VERIFY]` and no siding photo asset) and
  has no later QA entry. **Update: this is no longer actually stuck** — this run's live
  Sanity pull (dispatched via `/content-auditor`, see below) found `/services/siding` is
  now published, live, and clean: seoTitle 58 chars, seoDesc 153 chars, noindex/nofollow
  both false, and the blocking `[VERIFY]` is resolved in the body text ("CertainTeed Vinyl
  Siding" named explicitly, no placeholder remains). **However, there is still no QA PASS
  logged for this publish** — it went live with no `/qa` re-run entry in qa-log.md and no
  `/content-updater` entry in content-log.md. The content itself checks out on inspection,
  but this is the same "published outside the logged pipeline" pattern flagged repeatedly
  in prior runs (skylight rewrite, how-long-do-gutters-last) — now a 3rd+ occurrence.

### Immediate Actions (do these first)

1. **`/keyword-researcher` then `/seo-writer` on `/services/commercial-flat-and-low-slope-roofing-restoration`**
   — ESCALATED coverage gap, now 6 consecutive audits with 0 inbound blog links (the one
   zero-coverage service from 2026-08-05 that did NOT resolve itself between then and now).
2. **`/seo-writer` then `/content-updater` on `blog/best-roofing-contractors-in-frederick-md`**
   — ESCALATED cannibalization, now 3 consecutive audits. The post's H1 ("The Best Roofing
   Contractors in Frederick, MD: Why Shumaker Roofing Is Your #1 Choice") still directly
   overlaps the homepage's hero/title target ("Roofing Contractor in Frederick, MD"/
   "Roofing Contractor in Frederick MD"). `seoTitle` was already correctly re-angled; only
   the on-page H1 retitle (to match the seoTitle's angle) remains undone.
3. **`/seo-writer` then `/content-updater` on `blog/summer-roof-inspection-checklist-frederick-md`
   and `blog/signs-of-summer-heat-damage-on-your-roof-in-frederick-md`** — ESCALATED
   metadata gap, now 3 consecutive audits: both posts' `categories` field is still entirely
   `null`.
4. **`/seo-writer` or `/qa` re-run on the 4 `gutter-install` cluster keywords marked
   `qa-failed`** (gutter installation frederick md / hagerstown md / reston va /
   chambersburg pa) — blocked content, Priority 1.
5. **`/qa` re-run on the 5 `siding-frederick` cluster keywords marked `qa-failed`** — the
   underlying page (`/services/siding`) is now live and reads clean on inspection, so this
   may be a quick re-verify rather than new work, but it has no logged PASS to close it out.
6. **Fix the absolute-internal-links regression** (8 blog posts, 37 absolute links; was 0
   sitewide since 2026-08-03) via `/seo-writer` + `/content-updater`, or a direct Sanity
   patch matching the 2026-08-03 fix's approach.

No new cross-cluster keyword cannibalization found in `keywords.md` this run (Priority 0.5).

### Next Steps

7. **`/competitor-researcher`** on all 5 tracked domains — every Last Snapshot is stale
   (frederickroofrepair.com 101 days, pjsroofing.com 121 days, topperconstruction.com/
   politzenterprises.com/frederickroofers.com 99 days each), all past the 30-day threshold.
8. **`/competitor-researcher`** to re-score `opportunity-clusters.md` — newest row is
   99 days old, past the 90-day quarterly-rescore threshold. `rankings.md` has zero rows,
   so the 45-day volatility shortcut can't be evaluated either way.
9. **`/keyword-researcher`** on 3 unstarted high-scoring (>=18/25) open clusters with no
   matching entry in `keywords.md` or `content-log.md`: `free-estimate-landing` (18/25, new
   `/free-estimate` page), `commercial-roofing-frederick` (18/25, targets
   `/services/commercial-flat-and-low-slope-roofing-restoration` — same page as Immediate
   Action #1 above, so these two should be sequenced together), `storm-damage-frederick`
   (18/25, targets `/services/storm-damage-restoration`).
10. **`/seo-writer`** on 7 `gutter-install` cluster keywords with status `researched` but no
    draft: gutter replacement frederick md, gutter contractor frederick md, gutter
    installation near me, gutter installation cost, gutter installation company, seamless
    gutter installation cost, gutter installation contractor near me.
11. **`/keyword-researcher`** — 219 unique gap keyword phrases found in `competitors.md`
    with `Gap = gap` that have no corresponding row in `keywords.md` (tool-counted via
    script, not estimated; see method note below).

### Maintenance

12. Every row in `content-log.md` is now more than 90 days old (latest entry 2026-08-07) —
    due for a content-refresh pass, though several of the underlying pages have in fact
    been edited since (see memory-drift note below); the log itself just hasn't been
    updated to reflect it.
13. `rankings.md` has zero rows for any published page — no page has ever had a rankings
    baseline recorded. This blocks any future "cluster published, check post-publish
    ranking" check from Priority 4's opportunity-cluster cadence rule.

### Dispatching Now

- **Dispatched `/content-auditor`** (full scope: blog, services, locations, static) as the
  single top Immediate Action this run. Reasoning: `audit-log.md` was 99 days stale (past
  the 60-day bootstrap threshold), and every other candidate action — including the 3
  then-escalated coverage-gap findings this skill's own Priority 0 logic would otherwise
  have ranked first — depended on that stale data being correct. It wasn't fully: 2 of the
  3 then-escalated coverage gaps (chimney-maintenance, solar-contractor) had already
  resolved themselves by the time live data was pulled. Running `/content-auditor` first
  avoided dispatching `/keyword-researcher` against a gap that no longer existed — exactly
  the failure mode this site's own audit history has hit before (run 4's dead-link false
  positives, run 5's "artifact" coverage counts).
- **Result:** Full new audit completed and logged to `memory/seo/audit-log.md` and
  `memory/seo/audit-findings-log.md` (2026-11-12 rows). Headline changes vs. the 2026-08-05
  baseline: 21 live blog posts (was 16/18 per memory — 3 new posts, 2 services (metal-roofing,
  siding) both now live (was 11-12), 2 of 3 then-escalated coverage gaps self-resolved, 1
  structural gap (siding) resolved cleanly, but 3 regressions surfaced (absolute-internal-links,
  services/roof-repair glued-text, sitewide banned-words 0->22) plus 2 new findings
  (2 new-service coverage gaps, 1 new Medium duplicate-topic cluster on the gutter posts) and
  2 escalations (cannibal:best-roofing-contractors->homepage and metadata:blog:categories-null,
  both now at 3 consecutive audits). **Not performed this run: the Step 4b (C1-C8) clarity
  sweep and the `content:date-claims-inconsistent` re-check** — flagged as incomplete, not
  claimed clean.
- Per `/content-updater`'s own routing rule, no sub-skill with live-write power was invoked
  or would have been invoked by this run's top action — `/content-auditor` is read-only
  against Sanity by design, and never calls the Sanity mutate API.

### Summary

- Total keywords tracked: 42 unique phrases across 46 rows in `keywords.md` (unchanged this
  run — not this skill's file to edit).
- Published pages: 21 blog + 13 services + 4 locations (live, per this run's audit) — up
  from 16-18 blog / 11-12 services at the 2026-08-05 baseline.
- Last QA run: 2026-08-07 per `qa-log.md` (services/siding, FAIL) — unchanged; no QA entry
  exists for the siding publish that followed.
- Last publish: per `content-log.md`, 2026-08-05 (logged) — but live data shows at least 4
  more publishes since with no log entry (3 blog posts + services/siding).
- Competitor snapshots: frederickroofrepair.com 2026-08-03, pjsroofing.com 2026-07-14,
  topperconstruction.com/politzenterprises.com/frederickroofers.com 2026-08-05 — all stale.
- Unactioned gaps: 219 keywords (gap phrases from competitors.md with no keywords.md row).
- Last content audit: 2026-11-12 (this run), 0 open duplicate-intent High clusters, 1 new
  Medium cluster.
- Escalated findings (3+ consecutive audits unresolved): 3 —
  `coverage:service:commercial-flat-and-low-slope-roofing-restoration` (6),
  `cannibal:best-roofing-contractors-in-frederick-md->homepage` (3),
  `metadata:blog:categories-null` (3).
- Opportunity clusters: last scored 2026-08-05 (99 days ago, past the 90-day threshold), 9
  open / 2 in-progress / 0 done.

---

### Method note on the 219-gap-keyword count

Computed with a short Python script over `competitors.md` and `keywords.md` (not eyeballed
given ~450 rows): 423 rows have `Gap = gap`, collapsing to 224 unique keyword phrases; 219 of
those 224 have no matching phrase (case-insensitive exact match) in `keywords.md`'s 42
tracked phrases.
