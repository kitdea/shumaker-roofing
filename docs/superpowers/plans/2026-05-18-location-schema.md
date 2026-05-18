# Location Page Rich Schema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the minimal `LocalBusiness` schema on `/service-areas/[slug]` with a comprehensive `@graph` block containing `LocalBusiness`, `FAQPage`, `ItemList`, and `AggregateRating` nodes to improve local pack rankings and SERP rich results.

**Architecture:** A single `buildLocationSchema()` function defined at the top of `app/service-areas/[slug]/page.tsx` assembles a JSON-LD `@graph` array. Office address selection is driven by a hardcoded `OFFICES` map and a `WESTERN_MD_CITIES` set. The existing inline `localBusinessSchema` constant and its `<script>` tag are removed and replaced by one call to `buildLocationSchema()`.

**Tech Stack:** Next.js 15 App Router, TypeScript, Contentful CMS (`ContentfulLocation` type from `types/contentful.ts`), `lib/utils.ts` (`slugify`, `SITE_URL`)

---

## File Map

| File | Action |
|---|---|
| `app/service-areas/[slug]/page.tsx` | Modify — add `OFFICES`, `WESTERN_MD_CITIES`, `buildLocationSchema()`, replace schema `<script>` tag |

No new files. No other files touched.

---

### Task 1: Add office constants and city set

**Files:**
- Modify: `app/service-areas/[slug]/page.tsx`

- [ ] **Step 1: Open the file and locate the `SITE_DOMAIN` constant at line 20**

The file currently has:
```ts
const SITE_DOMAIN = "shumakerroofing.com";
```

- [ ] **Step 2: Add `OFFICES` and `WESTERN_MD_CITIES` constants directly after `SITE_DOMAIN`**

Replace:
```ts
const SITE_DOMAIN = "shumakerroofing.com";
```

With:
```ts
const SITE_DOMAIN = "shumakerroofing.com";

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
} as const;

const WESTERN_MD_CITIES = new Set([
  "hagerstown", "boonsboro", "smithsburg", "williamsport",
  "funkstown", "hancock", "clear spring", "sharpsburg",
  "keedysville", "thurmont", "waynesboro",
]);

function getOffice(state: string, cityName: string) {
  if (state === "VA") return OFFICES.VA;
  if (state === "MD" && WESTERN_MD_CITIES.has(cityName.toLowerCase())) return OFFICES.MD_WEST;
  return OFFICES.MD;
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors related to the new constants.

- [ ] **Step 4: Commit**

```bash
git add app/service-areas/[slug]/page.tsx
git commit -m "feat: add office constants and western MD city set for location schema"
```

---

### Task 2: Add `buildLocationSchema()` function

**Files:**
- Modify: `app/service-areas/[slug]/page.tsx`

- [ ] **Step 1: Add the builder function after `getOffice()` and before `const getLocation = cache(...)`**

Insert this block:

```ts
function buildLocationSchema(
  fields: ContentfulLocation["fields"],
  cityDisplay: string,
  slug: string,
) {
  const pageUrl = `${SITE_URL}/service-areas/${slug}`;
  const lbId = `${pageUrl}/#localbusiness`;
  const faqId = `${pageUrl}/#faq`;
  const servicesId = `${pageUrl}/#services`;

  const office = getOffice(fields.state, fields.cityName);

  // LocalBusiness node
  const localBusiness: Record<string, unknown> = {
    "@type": "LocalBusiness",
    "@id": lbId,
    "name": "Shumaker Roofing Company",
    "url": pageUrl,
    "telephone": office.telephone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": office.streetAddress,
      "addressLocality": office.addressLocality,
      "addressRegion": office.addressRegion,
      "postalCode": office.postalCode,
      "addressCountry": "US",
    },
    "serviceArea": {
      "@type": "City",
      "name": cityDisplay,
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "07:00",
        "closes": "18:00",
      },
    ],
    "priceRange": "$$",
    "description":
      fields.metaDescription ||
      `Expert roofing services in ${cityDisplay}, ${fields.state}. Contact Shumaker Roofing for a free estimate.`,
    "mainEntity": { "@id": faqId },
  };

  if (fields.latitude != null && fields.longitude != null) {
    localBusiness["geo"] = {
      "@type": "GeoCoordinates",
      "latitude": fields.latitude,
      "longitude": fields.longitude,
    };
  }

  if ((fields.servicesOffered?.length ?? 0) > 0) {
    localBusiness["hasOfferCatalog"] = { "@id": servicesId };
  }

  // FAQPage node — use Contentful items or fall back to defaults
  const faqMainEntity =
    fields.faqItems?.length
      ? fields.faqItems.map((faq) => ({
          "@type": "Question",
          "name": faq.fields.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.fields.answer },
        }))
      : [
          {
            "@type": "Question",
            "name": `Do you provide roofing services in ${cityDisplay}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Yes, ${cityDisplay} is one of our primary service areas. We provide residential and commercial roofing services throughout ${cityDisplay}, ${fields.state}.`,
            },
          },
          {
            "@type": "Question",
            "name": `What roofing services do you offer in ${cityDisplay}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `We offer residential roofing, commercial roofing, roof repair, storm damage repair, gutters, and roof inspections in ${cityDisplay}.`,
            },
          },
          {
            "@type": "Question",
            "name": `How do I get a free roofing estimate in ${cityDisplay}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Call us at +1-301-662-0533 or fill out our contact form at shumakeroofing.com/contact to schedule a free estimate in ${cityDisplay}.`,
            },
          },
        ];

  const faqPage = {
    "@type": "FAQPage",
    "@id": faqId,
    "mainEntity": faqMainEntity,
  };

  const graph: unknown[] = [localBusiness, faqPage];

  // ItemList node — only when services exist
  if ((fields.servicesOffered?.length ?? 0) > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": servicesId,
      "name": `Roofing Services in ${cityDisplay}`,
      "itemListElement": fields.servicesOffered.map((svc, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": svc.fields.title,
        "url": `${SITE_URL}/services/${slugify(svc.fields.title)}`,
      })),
    });
  }

  // AggregateRating node — only when rated testimonials exist
  const ratedTestimonials = (fields.localTestimonials ?? []).filter(
    (t) => typeof t.fields.rating === "number",
  );
  if (ratedTestimonials.length > 0) {
    const avg =
      ratedTestimonials.reduce((sum, t) => sum + t.fields.rating, 0) /
      ratedTestimonials.length;
    graph.push({
      "@type": "AggregateRating",
      "itemReviewed": { "@id": lbId },
      "ratingValue": Math.round(avg * 10) / 10,
      "reviewCount": ratedTestimonials.length,
      "bestRating": 5,
      "worstRating": 1,
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/service-areas/[slug]/page.tsx
git commit -m "feat: add buildLocationSchema() with LocalBusiness, FAQPage, ItemList, AggregateRating"
```

---

### Task 3: Wire `buildLocationSchema()` into the page component

**Files:**
- Modify: `app/service-areas/[slug]/page.tsx`

- [ ] **Step 1: Locate the existing `localBusinessSchema` constant in the page component (around line 81)**

It currently looks like:
```ts
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#organization`,
  "name": "Shumaker Roofing Company",
  "url": SITE_URL,
  "telephone": "+1-301-662-0533",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": fields.cityName,
    "addressRegion": fields.state,
    "addressCountry": "US",
  },
  "areaServed": {
    "@type": "City",
    "name": cityDisplay,
  },
  "description": fields.metaDescription || `Expert roofing services in ${cityDisplay}, ${fields.state}.`,
};
```

- [ ] **Step 2: Replace the `localBusinessSchema` constant with a call to `buildLocationSchema()`**

Remove the entire `localBusinessSchema` constant block and replace it with:
```ts
const locationSchema = buildLocationSchema(fields, cityDisplay, slug);
```

- [ ] **Step 3: Locate the existing `<script>` tag in the JSX (around line 103)**

It currently looks like:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
/>
```

- [ ] **Step 4: Replace it with the new schema reference**

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
/>
```

- [ ] **Step 5: Verify TypeScript compiles and dev server starts cleanly**

```bash
npx tsc --noEmit
npm run dev
```

Expected: no type errors, dev server starts without errors.

- [ ] **Step 6: Spot-check a location page in the browser**

Navigate to `http://localhost:3000/service-areas/frederick-md` (or any active location slug).

Open DevTools → Elements → search for `application/ld+json`. Confirm the script tag is present and the JSON includes `@graph` with `LocalBusiness`, `FAQPage`, and (if that location has services) `ItemList`.

- [ ] **Step 7: Commit**

```bash
git add app/service-areas/[slug]/page.tsx
git commit -m "feat: wire rich @graph schema into location page, replace minimal LocalBusiness block"
```

---

### Task 4: Validate with Google Rich Results Test

**Files:** None (validation only)

- [ ] **Step 1: Start the dev server if not already running**

```bash
npm run dev
```

- [ ] **Step 2: Copy a location page URL**

Use any active location, e.g. `http://localhost:3000/service-areas/frederick-md`.

- [ ] **Step 3: Test via Google Rich Results Test**

Go to `https://search.google.com/test/rich-results`, paste the URL, and run the test.

Expected results:
- `LocalBusiness` detected with address, telephone, serviceArea, openingHours
- `FAQPage` detected with question/answer pairs
- `ItemList` detected if the location has services in Contentful
- `AggregateRating` detected if the location has rated testimonials in Contentful
- No critical errors or warnings about missing required fields

- [ ] **Step 4: Test a location with no FAQ items**

Find a location slug that has no `faqItems` in Contentful and test it. Confirm `FAQPage` still appears with the 3 default Q&As.

- [ ] **Step 5: Test a location with no rated testimonials**

Confirm `AggregateRating` is absent from the schema output for that page (not present in the `@graph` array).
