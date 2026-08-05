# SEO Opportunity Clusters

Scored competitive opportunity clusters from `/competitor-researcher`. Score dimensions are
`relevance/authority/demand/difficulty/effort`, each 1–5, where **5 is always good** (easy to rank,
cheap to do). Max 25.

**Data coverage for the 2026-08-05 run:** Semrush only. Google Search Console and GA4 were both
unavailable — the Supermetrics team trial expired 2026-06-04 — so every authority score below is
capped at 3 per the skill's degradation rule and every cluster is `authority: unvalidated`. The
authority scores use Semrush's reported position as a proxy for GSC near-miss data; that proxy is
weaker than impression data and should not be treated as equivalent.

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

**Status 2026-08-05: both service pages created as Sanity DRAFTS, not published.**

| Page | Draft document ID | Words | seoTitle | seoDescription |
|---|---|---|---|---|
| services/metal-roofing | `drafts.fdad6a22-f1ff-4bb7-b815-ca6083b233a6` | 304 | 53 chars | 152 chars |
| services/siding | `drafts.68af8e47-b8c0-4def-8115-122d745ad93e` | 351 | 55 chars | 149 chars |

Each carries one `[VERIFY: …]` placeholder that must be resolved before publish — metal roof
service-life figures, and which siding manufacturer lines Shumaker actually carries. Neither page
has a `servicesImage` or `splitSection` references yet (the existing gutter-installation page has
no hero image either, so this matches current convention rather than falling short of it).

Publishing puts both into the nav dropdown and `/services` listing immediately, because
`NavbarServer` fetches the service list server-side. Run `/qa` before publishing.

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
