# Design: Rich Local Schema for Location Pages

**Date:** 2026-05-18  
**Scope:** `app/service-areas/[slug]/page.tsx`  
**Goal:** Replace the existing minimal `LocalBusiness` schema with a comprehensive `@graph` block covering `LocalBusiness`, `FAQPage`, `ItemList`, and `AggregateRating` to improve local pack rankings and SERP rich results.

---

## Context

The location page is a dynamic Next.js App Router page driven by Contentful `location` entries. Each location has: `cityName`, `state`, `fullLocationName`, `slug`, `latitude`, `longitude`, `phoneNumber`, `faqItems`, `localTestimonials`, and `servicesOffered`.

The current schema is a single `LocalBusiness` block with minimal fields. It does not use `FAQPage`, `AggregateRating`, or `ItemList`, and its `address` uses city/state only — no real office address.

Shumaker Roofing is a **service-area business (SAB)** — it does not have a physical office in every city it serves. It has 3 real offices: Frederick MD, Hagerstown MD, and Reston VA.

---

## Approach

Single `<script type="application/ld+json">` tag emitting one JSON-LD `@graph` with up to 4 typed nodes. Nodes cross-reference each other via `@id`. This is the Google-recommended pattern for SABs with multiple schema types.

---

## Office Constants

Hardcoded in the page file. State drives office selection: `VA` → Reston, all others → Frederick. Hagerstown is a real office but not used in schema at this time.

```ts
const OFFICES = {
  MD: {
    streetAddress: "26 Water St",
    addressLocality: "Frederick",
    addressRegion: "MD",
    postalCode: "21701",
    telephone: "+1-301-662-0533",
  },
  MD_WEST: {
    streetAddress: "6 W Washington St Suite 208",
    addressLocality: "Hagerstown",
    addressRegion: "MD",
    postalCode: "21740",
    telephone: "+1-301-662-0533",
  },
  VA: {
    streetAddress: "12001 Sunrise Valley Dr",
    addressLocality: "Reston",
    addressRegion: "VA",
    postalCode: "20191",
    telephone: "+1-301-662-0533",
  },
};

const WESTERN_MD_CITIES = new Set([
  "hagerstown", "boonsboro", "smithsburg", "williamsport",
  "funkstown", "hancock", "clear spring", "sharpsburg",
  "keedysville", "thurmont", "waynesboro",
]);
```

Selection logic:
- `fields.state === "VA"` → `OFFICES.VA`
- `fields.state === "MD"` and `fields.cityName.toLowerCase()` is in `WESTERN_MD_CITIES` → `OFFICES.MD_WEST`
- All others → `OFFICES.MD`

---

## Schema Nodes

### Node 1 — `LocalBusiness`

Always emitted.

| Property | Source |
|---|---|
| `@id` | `${SITE_URL}/service-areas/${slug}/#localbusiness` |
| `name` | `"Shumaker Roofing Company"` (hardcoded) |
| `url` | `${SITE_URL}/service-areas/${slug}` |
| `telephone` | Office constant |
| `address.streetAddress` | Office constant |
| `address.addressLocality` | Office constant |
| `address.addressRegion` | Office constant |
| `address.postalCode` | Office constant |
| `address.addressCountry` | `"US"` (hardcoded) |
| `geo.latitude` | `fields.latitude` (omitted if absent) |
| `geo.longitude` | `fields.longitude` (omitted if absent) |
| `serviceArea` | `{ "@type": "City", "name": cityDisplay }` |
| `openingHoursSpecification` | Mon–Sat 07:00–18:00 (hardcoded) |
| `priceRange` | `"$$"` (hardcoded) |
| `description` | `fields.metaDescription` or fallback string |
| `mainEntity` | `{ "@id": "...#faq" }` (always linked) |
| `hasOfferCatalog` | `{ "@id": "...#services" }` (only if servicesOffered present) |

### Node 2 — `FAQPage`

Always emitted. Uses `fields.faqItems` when available; falls back to 3 hardcoded defaults when none exist.

**Default FAQs** (city-interpolated):
1. Q: "Do you provide roofing services in [city]?" → A: "Yes, [city] is one of our primary service areas. We provide residential and commercial roofing services throughout [city], [state]."
2. Q: "What roofing services do you offer in [city]?" → A: "We offer residential roofing, commercial roofing, roof repair, storm damage repair, gutters, and roof inspections in [city]."
3. Q: "How do I get a free roofing estimate in [city]?" → A: "Call us at +1-301-662-0533 or fill out our contact form at shumakeroofing.com/contact to schedule a free estimate in [city]."

Each FAQ item maps to:
```json
{
  "@type": "Question",
  "name": "...",
  "acceptedAnswer": { "@type": "Answer", "text": "..." }
}
```

### Node 3 — `ItemList` (services)

Emitted only when `fields.servicesOffered` has at least one entry.

```json
{
  "@type": "ItemList",
  "@id": "...#services",
  "name": "Roofing Services in [city]",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Residential Roofing",
      "url": "https://www.shumakeroofing.com/services/residential-roofing"
    },
    ...
  ]
}
```

URL uses `slugify(svc.fields.title)` consistent with the rest of the codebase.

### Node 4 — `AggregateRating`

Emitted only when `fields.localTestimonials` contains at least one entry with a numeric `rating` field.

```json
{
  "@type": "AggregateRating",
  "itemReviewed": { "@id": "...#localbusiness" },
  "ratingValue": 4.9,
  "reviewCount": 12,
  "bestRating": 5,
  "worstRating": 1
}
```

`ratingValue` = average of all rated testimonials, rounded to 1 decimal. `reviewCount` = count of rated testimonials.

---

## Schema Builder Function

A `buildLocationSchema(fields, cityDisplay, slug)` function defined at the top of the page file (before the component). Returns the full `@graph` object. The `<script>` tag in the JSX calls `JSON.stringify(buildLocationSchema(...))`.

The existing inline `localBusinessSchema` constant and its `<script>` tag are removed and replaced.

---

## Contentful Changes

**None.** All required fields (`latitude`, `longitude`, `phoneNumber`, `faqItems`, `localTestimonials`, `servicesOffered`) already exist on the `location` content type. The two new `streetAddress`/`postalCode` fields originally considered are dropped — office addresses are hardcoded since Shumaker is a SAB.

**TypeScript changes:** No changes to `types/contentful.ts` needed.

---

## File Changes

| File | Change |
|---|---|
| `app/service-areas/[slug]/page.tsx` | Add `OFFICES` constant, add `buildLocationSchema()` function, replace existing `localBusinessSchema` block and its `<script>` tag |

No new files. No other files touched.

---

## Validation

After implementation, test with:
- [Google Rich Results Test](https://search.google.com/test/rich-results) on a deployed or localhost URL
- Check for `FAQPage`, `LocalBusiness`, and `ItemList` in the parsed schema
- Verify `AggregateRating` appears only on location pages that have rated testimonials
