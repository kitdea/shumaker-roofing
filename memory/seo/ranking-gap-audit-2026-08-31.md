# Ranking Gap Audit — Why Shumaker Roofing Isn't Outranking Competitors

Date: 2026-08-31
Trigger: User question — "we have a new, fast, better website now, but nothing is working"
Method: Cross-referenced existing tech-audit/SEO memory (Aug 05-28 runs) + live web_search SERP
checks against tracked competitors + live content/E-E-A-T comparison against the #1-ranking
competitor (frederickroofrepair.com), run 2026-08-31.

## TL;DR

The site is not actually fully "fast" yet (3 pages still fail Core Web Vitals, most others are
borderline), but **speed is not the primary reason it isn't ranking.** The real gap is content
depth, on-page trust signals (E-E-A-T), and domain authority/backlinks — three things a faster
CMS migration doesn't fix by itself. Shumaker ranks #1 for its own brand name but is weak-to-
invisible on the generic "money" keywords (roof repair frederick md, gutter installation, siding,
metal roofing, storm damage) that new customers actually search.

## 1. Confirmed: Brand-search vs. generic-search gap

Live SERP check (2026-08-31, 10 target queries):

| Query | Shumaker position | Who's ranking #1-3 instead |
|---|---|---|
| roofing contractor frederick md | #5 | frederickroofrepair.com, pjsroofing.com |
| roof repair frederick md | #5 | frederickroofrepair.com, pjsroofing.com |
| roofing company frederick md | #7 | pjsroofing.com, frederickroofrepair.com, politzenterprises.com |
| roof replacement frederick md | #5 | frederickroofrepair.com, pjsroofing.com |
| gutter installation frederick md | **not in top 15** | Mr. Handyman, Gutters For Less, Scates Corp, frederickroofrepair.com/gutters |
| metal roofing frederick md | #11 (homepage, not the dedicated page) | Wagler Steel, pjsroofing.com |
| siding contractor frederick md | **not in top 15** | Yelp, Mr. Handyman, Bulletproof Exteriors, Presidential Exteriors, PJ Fitzpatrick |
| commercial roofing frederick md | not in top 15 (see live transcript) | — |
| storm damage roof repair frederick md | not in top 15 (see live transcript) | — |
| shumaker roofing frederick (own brand) | **#1 and #5** — dominates | (own listings + review-site profiles) |

**Pattern:** best generic showing is #5 (tied on 4/10 queries); completely absent from the visible
top-15 on 4/10 queries — including gutter installation and metal roofing, both of which have
dedicated, indexed, published service pages. This is not an indexing problem (see #2) — Google
knows the pages exist, it just isn't ranking them competitively.

## 2. Ruled out: indexing/crawlability

`site:shumakerroofing.com` shows 21+ indexed URLs — homepage, all major service pages, service-area
pages, about/testimonials/FAQ/careers. No 404s, no duplicate-content spam. The internal tech audit
(Aug 28) independently confirms: 50/50 sitemap URLs return 200, all canonicals/meta/JSON-LD
(LocalBusiness, Service, Article, FAQPage schema) present and valid, 0 redirect-hop issues, 0
orphaned pages. **The site is fully crawlable and indexed — this is a relevance/authority problem,
not a technical-access problem.**

## 3. Partially true: site speed — better, but not actually "fast" yet

Internal Aug 28 tech audit, Performance Report:
- 3 pages still fail Core Web Vitals outright (P1, LCP > 4000ms): `/blog/best-roofing-contractors-in-frederick-md`
  (4126ms), `/blog/when-to-get-roof-rejuvenation-frederick-md` (4051ms), `/projects` (3976ms).
- The other ~40 tracked pages are P2 ("needs work") — LCP mostly in the 2.5-4s range. Google's
  "good" LCP threshold is 2.5s, so the *majority* of the site is still in the amber zone, not green.
- 94 open findings total (3 P1 / 90 P2) as of the last audit — churn between runs shows this is an
  ongoing, not-yet-resolved effort, not a completed migration.

**Conclusion: the site is faster than before, but is not yet hitting "good" Core Web Vitals
sitewide, and even once it does, the subagent comparison below shows CWV improvements alone won't
close the ranking gap** — the dominant competitor's site is not obviously faster/more technical,
it's winning on content and trust signals.

## 4. Primary root cause #1: Content depth and E-E-A-T gap vs. the #1 competitor

Live comparison, shumakerroofing.com vs. frederickroofrepair.com (the site occupying #1-#3 on most
contested terms), run 2026-08-31:

**frederickroofrepair.com:**
- Homepage alone is ~3,000+ words of first-person, conversational, expertise-demonstrating prose —
  not templated marketing copy. Includes a genuinely deep FAQ (pipe-collar material comparisons,
  Maryland's legal max-down-payment rule, a consumer-education "what is a storm chaser" section).
- Named, pictured owner (Stefan Mach) with MHIC license number and full street address surfaced
  directly in the homepage copy — strong, specific E-E-A-T/NAP signal.
- Live Yelp review widget embedded on-page, plus a differentiated claim ("the only 5-star rated
  roofer with over 100 reviews in Frederick, MD") — not just a review count, a comparative trust
  claim.
- A continuously-updated, geo-tagged project showcase (CompanyCam feed) with dated, ZIP-code-tagged
  entries refreshed within days — this is a real freshness signal Google can detect.

**shumakerroofing.com:**
- `/services/roof-repair` (a directly comparable page) is ~450-500 words, template-structured,
  competent but generic marketing copy. No FAQ depth, no Maryland-specific regulatory or
  consumer-education content, no first-person narrative or named expert voice.
- "Over 80 Years of Experience" is a single bullet point — no named founder, no license number, no
  street address surfaced on the homepage itself (weaker NAP transparency despite the bigger,
  more impressive number).
- Only 3 short, static testimonials shown on-page (first name + last initial + city) — **despite
  the business actually having ~325-356 reviews across platforms** (Birdeye, NiceJob, TrustAnalytica
  — see backlinks.md). This is real trust equity sitting completely unused on the page that most
  needs it.
- 12 clean service pages show decent site architecture, but there's no visible blog presence in
  search results, no location-specific city landing pages analogous to the competitor's dated
  project feed, and no freshness mechanism.

**Bottom line: Google is very plausibly ranking the competitor's page higher because it's longer,
more specific, more trustworthy-looking, and fresher — independent of Core Web Vitals.** A faster
site with thin, generic content will lose to a slower site with deep, trustworthy content in most
competitive local-service niches.

## 5. Primary root cause #2: Domain Authority / backlink gap

From the 2026-08-31 backlink-authority check (see `backlinks.md`):
- Domain Authority: **24**. Only 516 linking root domains — modest for a competitive local market
  where the top competitor has been established online for 20+ years with a stronger link profile
  (not independently DA-checked this run, but implied by search dominance and tenure).
- Highest-authority inbound link is bbb.org (DA 91) — but the BBB profile is **not accredited**,
  meaning Shumaker isn't getting the trust-signal benefit it could from its single best backlink.
- No dedicated backlink-building activity has been run (per backlinks.md Next Steps) — the current
  profile is passive (directories, review sites, social) rather than earned editorial/local-press
  links.

## 6. Contributing structural gap: missing service pages (known, partially fixed)

Per `opportunity-clusters.md` (2026-08-05): Shumaker sells metal roofing and siding but had **no
service page for either** — competitors (pjsroofing, politzenterprises, topperconstruction) owned
those terms uncontested by default (no page = no way to rank).
- **metal-roofing: now published** (since 2026-08-05) — but per the live check above still only
  ranks #11 via the *homepage*, not its own dedicated page, suggesting the new page hasn't
  accumulated enough authority/relevance yet to outrank established competitors (Wagler Steel,
  pjsroofing.com).
- **siding: still an unpublished draft**, blocked on confirming which manufacturer lines Shumaker
  carries (a factual detail only the business owner can confirm) — meanwhile competitors keep
  owning 100% of siding search visibility.

## 7. What this means, prioritized

The "new, fast site" narrative undersells two real technical wins (clean crawlability/indexing,
mostly-fixed CWV) but overestimates their SEO leverage. Speed and technical hygiene are necessary
but not sufficient — they get you crawled and indexed cleanly (confirmed working), but they don't
make Google prefer a 450-word templated page over a 3,000-word page with a named owner, license
number, live review counts, and constantly refreshed proof-of-work content.

### Top priority actions (highest expected impact first)

1. **Rewrite the homepage and top 3-4 service pages (roof repair, roof replacement, gutter
   installation, metal roofing) with real depth and E-E-A-T signals** — named owner/leadership
   bio with photo, MHIC license number and address surfaced on-page (not just in a footer/legal
   page), a genuine FAQ section addressing Maryland-specific regulatory/consumer questions, and
   first-person or authoritative-voice copy instead of templated bullet marketing language. This
   single move most directly targets the biggest gap found.

2. **Surface the existing ~325-356 reviews on-page** — embed a live review widget (Birdeye/Google/
   Yelp) or at minimum a prominent count + rating on the homepage and service pages, matching what
   the #1 competitor already does. This is a near-zero-cost fix for real, already-earned trust
   equity that's currently invisible to both users and Google.

3. **Finish the CWV work** — 3 pages are still hard-failing (LCP > 4s) and most others sit in the
   2.5-4s amber zone rather than under the 2.5s "good" threshold. Won't single-handedly fix
   rankings per the analysis above, but is a real, measurable gap between "the site is now fast"
   (the stated goal) and reality — worth closing regardless.

4. **Unblock and publish the siding page** — get the manufacturer-lines confirmation from the
   business, publish, then run keyword-research/content on it. Currently ceding an entire service
   category's search visibility to competitors by default.

5. **Build genuine backlinks/citations, not just directory listings** — pursue BBB accreditation
   (upgrades your single highest-authority link), and start on real link-earning activity (local
   press, supplier/manufacturer partner pages, Chamber of Commerce content, sponsorships) rather
   than only passive directory presence. DA 24 vs. an established 20+-year competitor is a gap
   that compounds over time if not actively worked.

6. **Add a freshness mechanism** — a genuinely active blog cadence and/or a dated project-showcase
   feed (the competitor's CompanyCam-style geo-tagged project feed is a cheap, effective, ongoing
   freshness signal Shumaker doesn't have an equivalent of).

7. **Add location-specific city landing pages beyond the current hub structure** if targeting
   multiple service areas (Hagerstown, Germantown, Columbia, Urbana, Chambersburg, Reston) —
   currently only `/service-areas/frederick-md` showed up in the indexing check; verify the other
   4 service-area pages are getting comparable content depth and internal linking, not just thin
   template pages.

## Sources
- Internal: memory/tech-audit/{MEMORY,health-report,performance-report,technical-seo,gsc-report,findings}.md (2026-08-28 run)
- Internal: memory/seo/{opportunity-clusters,keywords,MEMORY,backlinks}.md
- Live: web_search SERP checks for 10 target queries, run 2026-08-31
- Live: content/E-E-A-T comparison, shumakerroofing.com vs. frederickroofrepair.com, run 2026-08-31
- Live: Moz Domain Analysis backlink pull, run 2026-08-31 (see backlinks.md)
