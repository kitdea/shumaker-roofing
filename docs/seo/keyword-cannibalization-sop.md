# SOP: Preventing and Fixing Keyword Cannibalization

Keyword cannibalization = two or more pages on shumakerroofing.com targeting the
same search intent, so Google splits ranking signals between them instead of one
page winning clearly. Confirmed example (2026-07-13 GSC data): homepage, `/services/roof-repair`,
and `blog/roof-repair-frederick-md` were all competing for "roof repair" / "roof repair frederick md."

## 1. Ownership model — one URL per intent

Each keyword/topic gets exactly **one** designated canonical page. Before publishing
anything new, classify the target keyword by intent and confirm it doesn't already
belong to another page:

| Intent | Owner | Example |
|---|---|---|
| Brand / "who to call" navigational | Homepage (`/`) | "roofing contractor frederick md" |
| Service detail, commercial intent | `/services/[slug]` | "roof repair", "roof replacement cost" |
| City + service local intent | `/service-areas/[slug]` | "roof repair hagerstown md" |
| Informational / how-to / research | `/blog/[slug]` | "how to tell if roof needs repair", "roof repair vs replacement" |

If a keyword could plausibly fit two rows (e.g. "roof repair frederick md" fits both
service and blog), pick ONE as canonical and make the other page target a
clearly different angle (see §3) or link to the canonical page instead of
re-targeting the same phrase in its own title/H1/meta.

## 2. Pre-publish check (run before every `/seo-writer` or homepage/service copy change)

1. Search `memory/seo/keywords.md` for the exact phrase and close variants.
2. Search `memory/seo/content-log.md` for any page already published against that cluster.
3. Grep the live title tags/H1s of candidate pages for the core term:
   ```bash
   grep -rn "roof repair" app/\(site\)/**/page.tsx
   ```
4. If a match exists on a different page than the one you're about to write/edit, stop —
   this is a cannibalization risk. Resolve per §3 before writing content.

`seo-project-manager` should be extended to flag this automatically (see §5) — until
then this is a manual step.

## 3. Resolution options when overlap is found

Pick whichever is true:

- **Homepage vs. service/location page** — the homepage should never own a specific
  service or city keyword. Keep homepage title/meta/H1 at the brand + primary-service
  level ("Roofing Contractor in Frederick, MD") and remove specific service phrases
  (e.g. "roof repair") from homepage `<title>`, meta description, and hero CTA copy.
  Link the homepage's relevant service card into `/services/[slug]` with real anchor text
  instead of trying to rank the homepage on that term itself.
- **Blog vs. service page** — service pages own commercial-intent short-tail terms
  ("roof repair", "roof repair cost"). Blog posts should own informational long-tail
  angles the service page doesn't answer directly ("how to tell if your roof needs
  repair", "roof repair vs. replacement — how to decide"). Retitle/re-scope the blog
  post so its title/H1/meta target the informational angle, not the bare commercial
  term, and add an internal link from the blog post to the service page using the
  commercial-term anchor text (this passes authority to the correct canonical page
  instead of competing with it).
- **Location page vs. location page** — every `/service-areas/[slug]` page must have
  unique `introText` and at least 2-3 unique `faqItems` filled in Sanity. When these
  are left blank, `app/(site)/service-areas/[slug]/page.tsx` falls back to a
  city-parameterized FAQPage JSON-LD block ("We offer residential roofing, commercial
  roofing, roof repair, storm damage repair, gutters, and roof inspections in
  {cityDisplay}"). This is structured-data markup, not visible page copy, and each
  instance substitutes the real city name — so it's template-identical rather than
  byte-for-byte duplicate, a lower-severity risk than on-page duplicate content. Still
  fill per-city `introText`/`faqItems` in Sanity for any location page that isn't
  ranking as expected, since thin/templated on-page copy (not the JSON-LD fallback)
  is the actual duplicate-content lever for location pages.
- **Services listing vs. individual service pages** — keep `/services` targeting only
  category-level intent ("roofing services frederick md"); never let its title/meta
  target a single-service term that a child `/services/[slug]` page also targets.

## 4. Fix checklist (apply per confirmed cannibalization case)

1. Identify the canonical page for the keyword (per §1 table).
2. Edit all non-canonical pages' `generateMetadata()` fallback title/description
   (or the Sanity `seo.seoTitle`/`seo.seoDescription` doc, which always wins — see
   `lib/seo.ts` `buildNextMetadata`) to remove the competing exact-match phrase.
3. Edit on-page H1/hero copy on non-canonical pages to drop the competing phrase.
4. Add an internal link from the non-canonical page to the canonical page using the
   contested keyword as anchor text.
5. Log the change in `memory/seo/content-log.md` (action: `cannibalization-fix`).
6. After deploy, note the date in `memory/seo/rankings.md` and re-check GSC Performance
   → Pages for that query in 2-4 weeks (index/ranking consolidation is not instant).

## 5. Recurring check

This SOP's §2 check is wired into the pipeline at four points (as of 2026-07-13):
- `/keyword-researcher` Step 1 — de-dupes new keywords against existing clusters/pages
  before marking them `researched`.
- `/seo-writer` Step 2 — mandatory pre-draft guard; stops before writing a single word
  if the target cluster/keyword is already owned by another live page.
- `/qa` check 29 — hard-stop check distinct from the exact-string title/description
  check (20); catches same-cluster/same-intent overlap even when titles differ.
- `/content-updater` SAFETY GATE — re-checks `content-log.md` immediately before
  publish, in case a conflicting page was published in the gap since QA ran.
- `seo-project-manager` Priority 0.5 — surfaces existing unresolved overlaps in
  `keywords.md` as an immediate action item on every planning run.

Still outstanding:
- `/tech-audit` — add a "duplicate title/H1 phrase across pages" pass alongside the
  existing duplicate-`<title>` check (see `memory/tech-audit/technical-seo.md`), since
  duplicate titles catch exact dupes but not near-duplicate cannibalization where
  titles differ slightly but target the same phrase.
- Quarterly, or whenever GSC Performance → Pages shows two+ site URLs both getting
  impressions for the same query (the exact signal that surfaced the roof-repair case).

## Confirmed fixes applied

| Date | Pages | Keyword | Resolution |
|---|---|---|---|
| 2026-07-13 | `/` vs `/services/roof-repair` vs `blog/roof-repair-frederick-md` | "roof repair" / "roof repair frederick md" | **Resolved.** Homepage hero CTA fallback changed from "SCHEDULE YOUR ROOF REPAIR" to "SCHEDULE A FREE ESTIMATE" (`app/(site)/page.tsx`). Blog post retitled from "Roof Repair in Frederick, MD - Fast & Reliable" to "Roof Repair vs. Replacement: How to Decide (Maryland Guide)" — title/SEO title/SEO description/excerpt all moved to the informational angle; existing internal links to `/services/roof-repair` and `/service-areas/frederick-md` retained as the signal-passing mechanism. `/services/roof-repair` is now the sole canonical page for the commercial "roof repair" term. See `memory/seo/content-log.md` and `memory/seo/qa-log.md` (2026-07-13 entries). **Next check:** re-pull GSC Performance → Pages for "roof repair" in ~3-4 weeks to confirm consolidation. |
