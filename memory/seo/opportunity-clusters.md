# SEO Opportunity Clusters

Scored competitive opportunity clusters from `/competitor-researcher`. Score dimensions are
`relevance/authority/demand/difficulty/effort`, each 1–5, where **5 is always good** (easy to rank,
cheap to do). Max 25.

**Data coverage for the 2026-08-05 run:** Semrush only. Google Search Console and GA4 were both
unavailable — the Supermetrics team trial expired 2026-06-04 — so every authority score below is
capped at 3 per the skill's degradation rule and every cluster is `authority: unvalidated`. The
authority scores use Semrush's reported position as a proxy for GSC near-miss data; that proxy is
weaker than impression data and should not be treated as equivalent.

**2026-11-17 update — GSC+GA4 access fully RESTORED and LIVE-VERIFIED.** The 3 previously-disabled
GCP APIs (Search Console, Analytics Admin, Analytics Data) were enabled, and a fresh OAuth
re-consent (4 scopes: `spreadsheets`, `drive`, `webmasters.readonly`, `analytics.readonly`) was
exchanged into an isolated token file (`google_token_ga4.json`, `type: authorized_user`,
dedicated to `ga4_seo_mcp` so it can no longer be clobbered by unrelated Drive/Docs scripts
sharing the old shared token file). Confirmed by real data pulls on 2026-11-17:
- **GSC property:** `sc-domain:shumakerroofing.com` (domain property, `permissionLevel: siteFullUser`).
- **GA4 property:** numeric ID `428572245` ("Shumaker Roofing Co.", account `303430008`) — its
  web data stream (`dataStreams/7616020820`) confirmed `measurement_id: G-4NR3D3JVVL`, matching
  the measurement ID on file.
- Live sample pulled this run: `sc_top_queries` (2026-10-18→2026-11-14) returned "shumaker roofing"
  16 clicks/59 impr/pos 2.83, "roof replacement frederick" 3 clicks/265 impr/pos 15.43; GA4
  `run_report` (sessions/activeUsers by date, last 7 days) returned real per-day session counts
  (e.g. 2026-11-10: 79 sessions/67 users).
The authority-score degradation rule (capped at 3, `unvalidated`) **no longer applies** — future
`/competitor-researcher` runs should pull live GSC+GA4 via `ga4_seo_mcp` (site_url
`sc-domain:shumakerroofing.com`, property_id `428572245`) instead of falling back to Semrush-only.
Note: GCP OAuth consent-screen Publishing status (Testing vs. In production) was not checked this
run — no programmatic way to read it with the granted scopes (would need `cloud-platform`); if
still "Testing", the refresh token expires every 7 days and needs a Console check by the project
owner.

| Cluster | Tag | Keywords | Volume | Scores | Score | Target page | Status | Date |
|---------|-----|----------|--------|--------|-------|-------------|--------|------|
| gutter-install-recovery | New content | 3 | 4,030 | 5/2/4/3/4 | 18/25 | services/gutter-installation | open | 2026-08-05 |
| free-estimate-landing | New content | 2 | 180 | 5/2/2/5/4 | 18/25 | new: /free-estimate | open | 2026-08-05 |
| commercial-roofing-frederick | Quick win | 4 | 340 | 5/3/2/4/4 | 18/25 | services/commercial-flat-and-low-slope-roofing-restoration | open | 2026-08-05 |
| storm-damage-frederick | Quick win | 3 | 170 | 5/3/2/4/4 | 18/25 | services/storm-damage-restoration | open | 2026-08-05 |
| flat-roof-frederick | Quick win | 2 | 100 | 5/2/1/5/4 | 17/25 | services/commercial-flat-and-low-slope-roofing-restoration | open | 2026-08-05 |
| emergency-roof-repair | New content | 1 | 50 | 5/1/1/5/4 | 16/25 | new: /blog/emergency-roof-repair-frederick-md | open | 2026-08-05 |
| roof-pitch-explainer | Authority play | 7 | 13,010 | 2/1/5/3/3 | 14/25 | new: /blog/what-is-roof-pitch | open | 2026-08-05 |
| roof-underlayment | Authority play | 6 | 1,350 | 3/1/3/4/3 | 14/25 | new: /blog/best-roof-underlayment-asphalt-shingles | open | 2026-08-05 |
| shingle-roof-cost | New content | 5 | 1,400 | 3/2/3/3/3 | 14/25 | how-much-does-a-shingle-roof-cost | open | 2026-08-05 |
| siding-frederick | New content | 7 | 850 | 5/1/3/4/3 | 16/25 | services/siding | in-progress | 2026-08-05 |
| metal-roofing-md | New content | 6 | 900 | 5/1/3/3/3 | 15/25 | services/metal-roofing | in-progress | 2026-08-05 |
| hagerstown-roofing | Quick win | 10 | 1,520 | 5/3/4/4/4 | 20/25 | service-areas/hagerstown-md | open | 2026-11-16 |
| roof-ventilation-recovery | New content | 9 | 3,830 | 4/3/5/4/4 | 20/25 | blog/why-attic-ventilation-matters-in-summer-frederick-md (exists, ranks for nothing) + repoint 5 legacy redirects | open | 2026-11-16 |
| metal-roofing-md | Quick win | 4 | 530 | 5/3/3/4/4 | 19/25 | services/metal-roofing | in-progress | 2026-11-16 |
| roof-rejuvenation-consolidation | New content | 5 | 3,140 | 5/3/4/3/3 | 18/25 | services/roof-rejuvenation | open | 2026-11-16 |
| siding-frederick | New content | 9 | 630 | 5/2/3/4/4 | 18/25 | services/siding | in-progress | 2026-11-16 |
| flat-roof-frederick | Quick win | 4 | 200 | 5/3/1/5/4 | 18/25 | services/commercial-flat-and-low-slope-roofing-restoration | open | 2026-11-16 |
| roof-replacement-frederick | New content | 5 | 730 | 5/2/3/4/3 | 17/25 | services/roof-replacement | open | 2026-11-16 |
| winter-roofing | New content | 9 | 750 | 4/1/3/5/4 | 17/25 | new: /blog/can-roofs-be-replaced-in-winter-maryland | open | 2026-11-16 |
| frederick-head-terms | New content | 6 | 1,980 | 5/2/4/2/3 | 16/25 | service-areas/frederick-md | open | 2026-11-16 |
| roof-inspection-frederick | New content | 4 | 420 | 4/2/2/5/3 | 16/25 | services/roof-repair (section) or new page — confirm offering | open | 2026-11-16 |
| roofing-materials-maryland | New content | 13 | 7,670 | 3/1/5/4/3 | 16/25 | new: /blog/synthetic-slate-roofing-pros-cons-maryland | open | 2026-11-16 |
| md-location-expansion | Authority play | 11 | 710 | 4/1/3/5/2 | 15/25 | new: /service-areas/{damascus,urbana,carroll-county,montgomery-county,ellicott-city} | open | 2026-11-16 |
| roof-gable-explainer | Authority play | 3 | 1,040 | 2/1/3/3/4 | 13/25 | new: /blog/what-is-a-roof-gable | open | 2026-11-16 |
| national-roof-repair-head-terms | Authority play | 6 | 35,680 | 2/1/5/1/2 | 11/25 | — (demoted, see CONFLICT) | open | 2026-11-16 |
| winter-roofing | New content | 15 | 1,250 | 4/1/4/5/4 | 18/25 | blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them (exists, ranks for nothing) + new: /blog/can-roofs-be-replaced-in-winter-maryland | open | 2026-11-17 |
| flat-roof-frederick | Quick win | 5 | 250 | 5/3/1/5/4 | 18/25 | services/commercial-flat-and-low-slope-roofing-restoration | open | 2026-11-17 |
| frederick-head-terms | New content | 9 | 2,150 | 5/2/4/2/3 | 16/25 | service-areas/frederick-md | open | 2026-11-17 |
| roofing-materials-maryland | New content | 16 | 7,920 | 3/1/5/4/3 | 16/25 | new: /blog/synthetic-slate-roofing-pros-cons-maryland | open | 2026-11-17 |
| md-location-expansion | Authority play | 12 | 750 | 4/1/3/5/2 | 15/25 | new: /service-areas/{damascus,urbana,myersville,carroll-county,montgomery-county,ellicott-city} | open | 2026-11-17 |
| roof-underlayment | Authority play | 7 | 1,400 | 3/1/3/4/3 | 14/25 | new: /blog/best-roof-underlayment-asphalt-shingles | open | 2026-11-17 |


### 2026-11-16 run

**Data coverage:** Semrush only, again. Supermetrics GSC (`sc-domain:shumakerroofing.com` is visible and
`AUTHENTICATED`) failed at `data_query` with `TRIAL_EXPIRED` (team 1032018, trial ended 2026-06-04); GA4
bills through the same team. The `ga4_seo_mcp` route in the note above is not wired into this Claude Code
session. All authority scores remain capped at 3 and every cluster is `authority: unvalidated` /
`business-signal: unvalidated`. ~9,000 Semrush units spent (31,090 left).

**Competitors:** frederickroofrepair, pjsroofing, politzenterprises, topperconstruction (carried) +
teoroofing.com (new — Semrush relevance 0.37; Frederick roofer with a Charles Town WV location page).
frederickroofers.com dropped this run (229 organic traffic, prior pull was mostly off-topic local-blog terms).

**Ties:** 20/25 ×2 (hagerstown-roofing, roof-ventilation-recovery — broken by relevance 5 vs 4); 18/25 ×7
(3 new/re-scored rows above + 4 carried 2026-08-05 rows: gutter-install-recovery, free-estimate-landing,
commercial-roofing-frederick, storm-damage-frederick). Order within 18: relevance (all 5) → demand →
effort → gutter-install-recovery, roof-rejuvenation-consolidation, siding-frederick, commercial-roofing-frederick,
storm-damage-frederick, free-estimate-landing, flat-roof-frederick. Seven-way tie = flat weighting isn't
discriminating among local-service clusters; consider weighting relevance/demand.

**Carried, not re-scored (no new evidence):** gutter-install-recovery, free-estimate-landing,
commercial-roofing-frederick, storm-damage-frederick, emergency-roof-repair, roof-pitch-explainer,
roof-underlayment, shingle-roof-cost. Re-scored with new evidence: metal-roofing-md (15→19), siding-frederick
(16→18), flat-roof-frederick (17→18) — see rows dated 2026-11-16.

**Structural gap update:** `services/siding` is now **live** (13 `services` docs as of 2026-11-16; title
"Vinyl Siding Installation and Replacement", `_updatedAt` 2026-11-04). Both 2026-08-05 structural gaps
(metal, siding) are closed. Siding copy names no LP SmartSide / James Hardie lines — politz's
`lp siding frederick` / `hardie board siding maryland` were therefore excluded from the cluster.

**Validation findings:**
- roof-ventilation-recovery: Shumaker's ~60 vent/attic rankings sit on the `/blog` *listing* page because
  `next.config.mjs` 301s six legacy vent/attic posts (lines 341, 526, 686, 726 + 3 flat-roof posts at 406/421/461)
  to `/blog`. Redirect-to-listing tends to be treated as a soft 404 — this equity is borrowed and decaying.
- roof-rejuvenation-consolidation: cannibalization is **Shumaker-specific** — for `roof rejuvenation frederick md`
  frederickroofrepair (#1) and politz (#11) each rank one URL; Shumaker ranks 4 distinct rejuvenation posts
  (#4/#58/#69/#81) plus the service page (#43).
- roof-replacement-frederick: `/services/roof-repair` outranks `/services/roof-replacement` on both head terms
  (#58 vs #72; #40 vs #62). Not called cannibalization — competitor pulls were filtered to ≤20, so the
  multi-URL artifact check is inconclusive.
- CONFLICT: national-roof-repair-head-terms — Semrush puts frederickroofrepair.com #1 for `roofing roof repairs`
  (27,100/mo, KD 26) and #1 for `roofing repairs company` (KD 70). A ~5k-traffic local site holding #1 nationally
  is implausible; likely a location-sampled SERP. Trust: neither without GSC — demoted to 11/25.
- WV: teoroofing ranks for Charles Town WV terms, but commit 5ea0069 removed "WV licensed" from the footer.
  WV location terms excluded pending user confirmation that WV is still served.

**Policy drops (2026-11-16):** DIY — `how to clean gutters without a ladder` (topperconstruction, 90) → kept
`fall gutters` (70) as a gutter-maintenance/"when to call a pro" angle under gutter-install-recovery; Shumaker's
own `how to replace a roof vent` (480), `how to replace a ridge vent` (90), `adding roof vents` (1,600) excluded
from roof-ventilation-recovery → kept `roof vent repair` / `roof ventilation installation`. Off-topic — roof
safety harness ×3, gable/gabled definitions ×4, `louvered roofs in walkersville`, `builders maryland`.
Cost cap: no new cost cluster this run (shingle-roof-cost remains the one carried).

## Missing service pages — structural gap, not a content gap

**Confirmed with the user 2026-08-05: Shumaker does sell metal roofing and siding.** Neither has a
`services` document in Sanity. The 11 that exist are: gutter-installation, roof-installation,
solar-contractor, commercial-flat-and-low-slope-roofing-restoration, residential-roofing,
roof-rejuvenation, skylight-installation, roof-repair, roof-replacement, chimney-maintenance,
storm-damage-restoration.

This ranks above its 15–16/25 score suggests. The score measures a *keyword* opportunity; the
actual problem is that two revenue services have no landing page, so they have no nav entry, no
internal links, no schema, and nothing for `/service-areas/[slug]` pages to link to. Competitors
own the terms by default:

- **Metal roofing** — pjsroofing.com holds positions 2–9 across `metal roofing frederick county`
  (320), `metal roofing maryland` (320), `metal roofing md` (70), `metal roofing frederick md` (70),
  all pointing at one page: `/services/metal-roofing/`. Shumaker does not rank in the top 100 for
  any of them.
- **Siding** — pjsroofing holds `siding contractors frederick md` (110) at 3; topperconstruction
  owns the Hagerstown siding terms; politzenterprises has dedicated LP SmartSide and Hardie board
  pages plus `dutch lap vs clapboard siding` (390) at 15.

**Status 2026-08-05 (updated): metal-roofing PUBLISHED, siding still a draft.**

| Page | Document ID | Words | seoTitle | seoDescription | Status |
|---|---|---|---|---|---|
| services/metal-roofing | `fdad6a22-f1ff-4bb7-b815-ca6083b233a6` | 339 | 53 chars | 152 chars | **live** — HTTP 200, `robots: index, follow` |
| services/siding | none — Sanity draft `68af8e47-…` no longer exists; rewritten to `memory/seo/drafts/services-siding.md` 2026-08-07 | 459 | 54 chars | 157 chars | **draft — blocked on the manufacturer-lines [VERIFY]** |

Metal roofing's `[VERIFY]` was resolved with the Metal Construction Association's service-life
assessment (55% Al-Zn alloy-coated standing seam, >60 years), verified at the primary source. No
year range was asserted for exposed-fastener systems — the widely-repeated 15–25y figure traces
only to contractor blogs, below this site's citation standard — so the copy describes the
fastener-washer wear mechanism instead.

Siding's `[VERIFY]` asks which manufacturer lines Shumaker carries. **This cannot be researched
or inferred** — it is a factual claim about the business's offerings, and naming James Hardie or
LP SmartSide unconfirmed would put a false product claim on a live commercial page. Asked the
user 2026-08-05; they will confirm within a few days.

**Link house style — handled on both pages, no action left.** Both drafts were authored with
absolute `https://shumakerroofing.com/...` internal links (the pre-2026-08-03 style), which would
have regressed `metadata:blog:absolute-internal-links` (resolved 2026-08-03 at "0 sitewide").
metal-roofing's 7 were converted before publishing; siding's 6 were converted 2026-08-05 while it
was still a draft — verified 0 absolute links remaining, page still unpublished. **Siding's only
remaining blocker is the manufacturer-lines `[VERIFY]`.** When that answer arrives it is a
two-step publish: insert the confirmed lines, then publish.

Neither page has a `servicesImage` or `splitSection` reference (the existing gutter-installation
page has no hero image either, so this matches convention rather than falling short of it).

Publishing adds a page to the nav dropdown and `/services` listing, but **not instantly** —
`app/(site)/services/page.tsx:1` sets `revalidate = 3600`, so ISR takes up to an hour. The page's
own URL is live immediately.

**Recommended sequence:** the two `services` documents now exist as drafts, so next run
`/keyword-researcher` → `/seo-writer` against them. Writing blog content that links to a service
page that doesn't exist inverts the cluster hierarchy described in
`docs/seo/keyword-cannibalization-sop.md`.

Also worth confirming the reverse case: `solar-contractor`, `roof-rejuvenation`,
`skylight-installation`, and `chimney-maintenance` have service pages but appear in no keyword
research to date. Either they're under-marketed or the service list has drifted the other way.

## Policy drops (2026-08-05)

| Dropped | Volume | Reason | Kept instead |
|---|---|---|---|
| attaching fiber cement siding | 5,400 | DIY — installation instructions | "fiber cement vs vinyl siding: which lasts longer in MD winters" — same searcher, no instructions |
| how to install fiber cement | 170 | DIY | as above |
| how to clean gutters from the ground | 70 | DIY | folded into gutter-install-recovery as a "when to call a pro" angle |
| coffee shops frederick / notable people from maryland / famous people that live in maryland | 1,310 | Off-topic — frederickroofers.com's local-blog play, no roofing intent | none |

Cost keywords were capped at one cluster (`shingle-roof-cost`) per the 1-per-run rule.

### 2026-11-17 run (deeper pull: frederickroofrepair.com + pjsroofing.com only)

**Why this run:** both domains were pulled the day before. The user chose a deeper pull over a re-run, so this
run used Semrush's server-side keyword gap (`domain_domains`, each competitor minus shumakerroofing.com, sorted
by the competitor's best position) instead of repeating the top-100-by-traffic `resource_organic` pulls.
Shumaker's column is 0 for every returned row, so all of them are `missing` (not ranked in Shumaker's top 100).

**Cost:** 5,200 units (frederickroofrepair 40 lines + pjs 25 lines at 80 units/line); 22,680 left.
`domain_domains` rejected every `display_filter` field with a validator error that lists only
`backlinks_bucket_*` fields, even though `get_report_schema` advertises `position_domain_1`, `volume`,
`keyword_difficulty` and `keyword`. So no server-side filtering was possible, and the pjs result was 13/25
branded "pj roofing" variants that cost units and were thrown away. Next time, sort by `position_domain_1_asc`
and keep `display_limit` small, or fall back to `resource_organic` (10 units/line) and diff locally.

**Coverage:** Semrush only. GSC/GA4 were not re-tried this run. As of 2026-11-16, Supermetrics returns
`TRIAL_EXPIRED` and the GCP APIs are disabled. Authority stays capped at 3 and every row is unvalidated.

**What was new:** 33 of the 52 non-brand rows matched the 2026-11-16 snapshot. Bucket labels didn't
contradict: none of the 33 had been logged `weaker`/`strength`. 19 keywords were new and were appended to
competitors.md (13 frederickroofrepair, 6 pjs); `louvered roofs in walkersville` was dropped as off-topic again.
- **winter-roofing 17 → 18/25** (demand 3 → 4): +6 winter keywords (`do roofers work in the winter` 140,
  `winter roof repair` 110, `roofing in the winter` 90, `can you do a roof in the winter` 70,
  `can you get a new roof in the winter` 50, `roof repair winter` 40). frederickroofrepair holds #1–3 on 16+
  winter queries, about 40% of its top-position gap list. It's seasonal, peaking Nov–Feb, so the time to act is now.
  **Validation correction:** the 2026-11-16 row targeted only a new post, but
  `blog/three-common-winter-roof-damage-issues-and-how-to-prevent-them` (published 2026-03-31) already
  exists and ranks for nothing (rankings.md 2026-11-16). Refresh it for the repair/damage terms and give the
  scheduling question ("can roofs be replaced in winter") its own new post that links to it. Its "how to prevent"
  framing needs a DIY check by /seo-writer.
- flat-roof-frederick: +`frederick rubber roof replacement` (50, frederickroofrepair #2). The keywords were
  researched 2026-11-17 into keywords.md `commercial-flat` (12 rows); score unchanged.
- frederick-head-terms: +`frederick roofing contractors` 50, `roofing repair and installation` 70,
  `roof repair in md` 50. `roof fixing company` (KD 70, national) excluded. Score unchanged.
- roofing-materials-maryland: +`artificial slate roof` 110, `synthetic slate roofing shingles` 110,
  `plastic slate roof tiles` 30 (all pjs #1–2). Score unchanged (demand already 5).
- roof-underlayment: +`asphalt shingle underlayment` 50 (pjs #2). Score unchanged.
- md-location-expansion: +`roofer myersville` 40. Score unchanged.
- Unclustered: `9-12 pitch roof` (→ roof-pitch-explainer, carried), `best roof shape for high winds`,
  `energy efficient roofing solutions` (50 each, no fit).

**Ties:** the 18/25 tier is now 8 clusters. winter-roofing ranks last in it on relevance (4 vs 5). The top is
unchanged: hagerstown-roofing 20/25.

**CONFLICT (carried):** frederickroofrepair is still listed #1 for `roofing roof repairs` (27,100) and
`roofing repairs company` (1,600, KD 70). Same verdict as 2026-11-16: likely a location-sampled SERP,
untrusted without GSC.
