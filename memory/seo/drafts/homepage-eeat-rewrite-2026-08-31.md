# Homepage E-E-A-T Rewrite — Draft
Date: 2026-08-31
Purpose: Close the content-depth/E-E-A-T gap identified in ranking-gap-audit-2026-08-31.md vs.
the #1 local competitor (frederickroofrepair.com). Targets the highest-priority action item from
that audit: named owner, license number, review proof, and real depth surfaced directly on the
homepage — not buried in the footer or a separate /about page.

## Facts used (verified, sourced — nothing below is invented)

| Fact | Source |
|---|---|
| Founded 1946, by the Shumaker brothers | shumakerroofing.com/about (live), blog/best-roofing-contractors-in-frederick-md (live), roofingcontractors.org/md/frederick/shumaker-roofing-company (3rd-party ARCO directory) |
| MHIC #4503 (Maryland); #160849 (PA); #062924 (WV); #2705191905 (VA) | shumakerroofing.com footer (live, every page) — currently NOT surfaced anywhere above the fold or in body copy |
| Owner/founder-generation figure: Robert "Bob" Schisler | shumakerroofing.com/about "Meet Our Experts" section (live) |
| Current President & CEO: Tyler Schisler | shumakerroofing.com/blog/author/tyler-schisler (live) |
| CertainTeed 5-Star Select ShingleMaster since program inception (1998) | shumakerroofing.com/about (live) |
| Warranty: transferable Full Replacement Cost Warranty, 50-yr non-prorated labor+material (manufacturer), 25-yr workmanship defects; PLUS Shumaker's own 10-yr craftsmanship warranty on every job regardless of manufacturer | shumakerroofing.com/about (live) |
| Service-Disabled Veteran-Owned Small Business | shumakerroofing.com/about + homepage certifications section (live) |
| 328 reviews (third-party count) | roofingcontractors.org ARCO listing; consistent with the ~325-356 range found across Birdeye/NiceJob/TrustAnalytica in backlinks.md research |
| Address: 26 Water St, Frederick, MD 21701 (plus Hagerstown MD and Reston VA offices) | organizationSchema in app/(site)/page.tsx (live JSON-LD) |
| Phone: (301) 662-0533 | live site, all pages |

## ⚠️ Found while researching: a real, pre-existing content bug — fix alongside this rewrite

The site currently states its own tenure **inconsistently across pages**:
- Homepage bullet list: "Over 80 Years of Experience" (= founded ~1946, correct)
- /about page: "For over 75 years..." (wrong — should also be ~80)
- Several service-page seoDescriptions/drafts: "since 1947" and "over 75+ years"

This was already flagged internally on 2026-08-05 (`memory/seo/audit-findings-log.md`,
`content:date-claims-inconsistent`) as unresolved. **Recommend standardizing on "1946" / "80 years"
everywhere** — it's the version with the most corroboration (About page founder story, the
best-roofing-contractors blog post, and the independent ARCO directory listing all agree on 1946).
Inconsistent trust claims are themselves a weak E-E-A-T signal — Google (and customers) notice
when a site can't state its own history the same way twice. This rewrite uses "1946 / 80 years"
throughout; recommend a follow-up pass to fix the other pages to match.

## What to change on the homepage (`app/(site)/page.tsx`)

### 1. NEW — Trust bar directly under the hero (highest visibility, first thing seen)
Add a thin strip immediately below the hero section, before "Excellence in Every Project":

```
Founded 1946 · MHIC #4503 · Service-Disabled Veteran-Owned · 328+ Verified Reviews · Family-Owned, 3 Generations
```

Rationale: this is the single highest-impact, lowest-effort change. It puts license number,
founding year, and real review count where both users and Google see them within the first
screen — the exact pattern frederickroofrepair.com uses to establish trust immediately, and the
exact information currently hidden in Shumaker's footer.

### 2. REWRITE — "About Us" section (currently ~2 short paragraphs + 4 generic bullets)

**Current copy (to replace):**
> "From repairs to full roof replacements, we treat each home as our own, providing personalized
> solutions tailored to meet the unique needs of our clients. With years of experience in the
> industry, our team of skilled professionals is dedicated to delivering top-tier services that
> prioritize durability, quality, and safety."
>
> Bullets: Over 80 Years of Experience · Licensed and Insured Professionals · High-Quality
> Materials Warranty · Free No-Obligation Estimates

**New copy:**

> Shumaker Roofing has been a family-owned name in Frederick County roofing since 1946, when the
> Shumaker brothers first opened for business. Three generations later, we're still locally owned
> and operated — led today by President & CEO Tyler Schisler, continuing the standard set by
> Robert "Bob" Schisler and the family before him.
>
> We're licensed in four states — MHIC #4503 in Maryland, plus PA, WV, and VA — and every job is
> run by our own crew, not subcontracted out. As a CertainTeed 5-Star Select ShingleMaster since
> the program's inception in 1998, we can offer a transferable Full Replacement Cost Warranty:
> 50 years of non-prorated labor and material coverage, plus 25 years against workmanship defects
> from CertainTeed. On top of that, every job — regardless of manufacturer — carries our own
> 10-year craftsmanship warranty.
>
> We're also a certified Service-Disabled Veteran-Owned Small Business, and over 328 Frederick-area
> homeowners have left us verified reviews. [PLACEHOLDER — recommend a live review-count/rating
> widget here, e.g. Google or Birdeye embed, matching the on-page count to whatever platform you
> want to send traffic to; see item 4 below.]

**New bullets (replace the 4 generic ones):**
- Family-Owned Since 1946 — 3 Generations
- Licensed & Insured — MHIC #4503 (MD), PA, WV, VA
- CertainTeed 5-Star Select ShingleMaster
- 10-Year Craftsmanship Warranty on Every Job

Rationale: this directly targets the #1 gap from the audit — the competitor's page wins on named,
specific, licensed, dated trust signals; Shumaker's current copy is generic ("years of experience,"
"skilled professionals") with no names, no numbers, no license. The new copy uses only verified
facts already published elsewhere on the site — it's assembling existing truth, not inventing new
claims.

### 3. NEW — Short FAQ block (does not currently exist on the homepage)

Add a compact FAQ section before the final CTA. This is the single biggest structural gap vs.
the competitor (their ~3,000-word homepage FAQ vs. Shumaker's zero). Recommend 4-6 questions,
Maryland-specific where possible — also wire these into `FAQPage` JSON-LD (the site's schema
setup already supports FAQPage per `technical-seo.md`, so this is additive, not new engineering):

Suggested questions (content TBD — need real, sourced answers, do not want to invent Maryland
regulatory claims the way the competitor did without verification):
- "How much does a roof replacement cost in Frederick, MD?" → link to existing cost content
- "Do I need a permit to replace my roof in Frederick County?" → **[NEEDS RESEARCH — verify with
  Frederick County permitting office or a licensed source before publishing; do not guess]**
- "What's the difference between roof repair and full replacement?" → can reuse existing
  Repair vs. Replacement content from /services/roof-repair
- "Is Shumaker Roofing licensed and insured?" → yes, direct MHIC #4503 answer, easy/safe
- "How long has Shumaker Roofing been in business?" → 1946, direct factual answer, easy/safe
- "Do you offer free estimates?" → yes, existing claim, easy/safe

Flagging the permit question specifically: the competitor's page cited "Maryland's legal max
down-payment rule" as an FAQ — that's the kind of specific regulatory claim that builds real
authority, but it must be verified against an actual source (Maryland Home Improvement Law) before
publishing, exactly like the siding page's manufacturer-lines `[VERIFY]` blocker already tracked
in opportunity-clusters.md. Don't repeat the same mistake of adding an unverified specific claim.

### 4. UPGRADE — Testimonials section

Current: 3 static hardcoded testimonials (Karen T., Mike D., Sandra L. — real, keep these) with no
count or rating shown.

Add directly above or beside them: a real aggregate figure, e.g. "4.8★ average from 328+ reviews"
— sourced from whichever platform you want to be the canonical review source (Google Business
Profile is usually strongest for local SEO; Birdeye/NiceJob also viable). This also unlocks
`AggregateRating` schema (currently absent from `organizationSchema` in page.tsx), which can
surface star ratings directly in Google search results — a meaningful CTR/trust lever the
competitor doesn't even have (they only showed a live widget, not structured data).

**Needs a decision from you:** which platform's rating to feature as the canonical number (Google
is usually best for local search), since I don't want to hardcode a specific star rating without
confirming the live current value first.

### 5. Schema additions (`organizationSchema` in `app/(site)/page.tsx`)

Two additive JSON-LD fields, both using only verified facts:

```js
"foundingDate": "1946",
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "[CONFIRM CURRENT VALUE]",
  "reviewCount": "328"
},
```

Also consider adding a `founder`/`employee` Person entry for Tyler Schisler (current CEO, already
has an author bio page live at /blog/author/tyler-schisler) to strengthen the entity graph — low
effort since the bio page already exists.

## What I deliberately did NOT do

- Did not invent a specific MHIC narrative, personal quote, or biographical detail for Robert
  "Bob" Schisler beyond what's already published — a real quote/bio expansion would need input
  from the business, not a generated one (fabricated founder quotes are a real E-E-A-T risk, not
  a fix).
- Did not write the Maryland permit/regulatory FAQ answer — flagged as needing a verified source,
  same standard the siding page draft is already held to.
- Did not pick a specific star rating for the AggregateRating schema — needs a live number pulled
  from whichever platform is chosen as canonical, not guessed.

## Next steps
1. Confirm which review platform's rating is canonical (Google recommended) → pull live rating.
2. Get the Maryland roof-permit FAQ answer verified against an authoritative source (or drop it).
3. Implement the above in `app/(site)/page.tsx` (content is drop-in ready) + wire FAQPage/
   AggregateRating schema.
4. Fix the site-wide tenure inconsistency (1946/80 years vs. 75 years vs. 1947) across /about and
   the service-page seoDescriptions flagged in audit-findings-log.md — same fix, multiple pages.
5. Roll the same E-E-A-T pattern (license #, founding year, named leadership, review count) into
   the top service pages next (roof-repair, roof-replacement, gutter-installation) per the
   ranking-gap-audit's #1 priority action.
