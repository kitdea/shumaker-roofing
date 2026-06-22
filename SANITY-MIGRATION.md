# Contentful → Sanity Migration Guide
### Shumaker Roofing — Next.js 16 App Router + TypeScript + Tailwind

This guide walks you through migrating your entire site from Contentful to Sanity, step by step, in plain language. Every code example is specific to your actual pages and content types.

---

## What Changes vs. What Stays the Same

| Stays the Same | Changes |
|---|---|
| All Next.js pages and routes | `lib/contentful.ts` → `lib/sanity.ts` |
| Tailwind styling | `@contentful/rich-text-react-renderer` → `@portabletext/react` |
| Image components | Image URL builder (new Sanity helper) |
| SEO logic in `lib/seo.ts` | `CONTENTFUL_*` env vars → `NEXT_PUBLIC_SANITY_*` env vars |
| All components | Content re-entered or exported from Contentful |
| `lib/utils.ts`, routing, slugs | Sanity Studio replaces Contentful dashboard |

---

## Phase 1 — Create Your Sanity Project

### 1.1 Install the Sanity CLI and scaffold

Open your terminal in the `shumaker-roofing` folder:

```bash
npm install -g sanity@latest
```

Then create the Sanity studio **inside your Next.js project**:

```bash
npx sanity@latest init --env .env.local
```

When prompted:
- **Project name:** `shumaker-roofing`
- **Dataset:** `production`
- **Project output path:** `./sanity` (creates a `/sanity` subfolder)
- **Template:** "Clean project with no predefined schemas"

This writes three values to your `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_token_here
```

> **Tip:** The project ID looks like `abc12345`. You can always find it at https://sanity.io/manage.

### 1.2 Install the npm packages

```bash
npm install @sanity/client @sanity/image-url next-sanity @portabletext/react
npm install --save-dev @sanity/types
```

Uninstall Contentful (do this **after** your new code is working):
```bash
npm uninstall contentful @contentful/rich-text-react-renderer @contentful/rich-text-types
```

---

## Phase 2 — Define Your Sanity Schemas

Sanity schemas are TypeScript files that describe your content types. They replace Contentful's content model.

Create this folder structure:

```
sanity/
  schemaTypes/
    service.ts
    blog.ts
    location.ts
    seoMetadata.ts
    heroBanner.ts
    certificationBadge.ts
    projectSlide.ts
    jobPosting.ts
    splitSection.ts
    index.ts
```

### 2.1 SEO Metadata (shared object used by other types)

`sanity/schemaTypes/seoMetadata.ts`

```typescript
import { defineType, defineField } from 'sanity'

export const seoMetadata = defineType({
  name: 'seoMetadata',
  title: 'SEO Metadata',
  type: 'object',
  fields: [
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 3 }),
    defineField({ name: 'canonicalUrl', title: 'Canonical URL', type: 'url' }),
    defineField({ name: 'featuredImage', title: 'Featured Image', type: 'image' }),
    defineField({ name: 'noindex', title: 'No Index', type: 'boolean', initialValue: false }),
    defineField({ name: 'nofollow', title: 'No Follow', type: 'boolean', initialValue: false }),
  ],
})
```

### 2.2 Split Section (used by services and blog)

`sanity/schemaTypes/splitSection.ts`

```typescript
import { defineType, defineField } from 'sanity'

export const splitSection = defineType({
  name: 'splitSection',
  title: 'Split Section',
  type: 'document',
  fields: [
    defineField({ name: 'splitTitle', title: 'Title', type: 'string' }),
    defineField({ name: 'splitDescription', title: 'Description', type: 'text', rows: 4 }),
    defineField({ name: 'splitImage', title: 'Image', type: 'image', options: { hotspot: true } }),
  ],
})
```

### 2.3 Services

`sanity/schemaTypes/service.ts`

```typescript
import { defineType, defineField } from 'sanity'

export const service = defineType({
  name: 'services',
  title: 'Services',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } }),
    defineField({ name: 'servicesContent', title: 'Main Content', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'additionalContent', title: 'Additional Content', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'servicesImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'splitSection', title: 'Two-Column Sections', type: 'array', of: [{ type: 'reference', to: [{ type: 'splitSection' }] }] }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoMetadata' }),
  ],
})
```

### 2.4 Blog

`sanity/schemaTypes/blog.ts`

```typescript
import { defineType, defineField } from 'sanity'

export const blog = defineType({
  name: 'blog',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (R) => R.required() }),
    defineField({ name: 'publishedDate', title: 'Published Date', type: 'datetime' }),
    defineField({ name: 'featuredImage', title: 'Featured Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'categories', title: 'Categories', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'author', title: 'Author Name', type: 'string' }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt Text' },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
      ],
    }),
    defineField({
      name: 'faqItems',
      title: 'FAQ Items',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'question', type: 'string', title: 'Question' },
          { name: 'answer', type: 'text', title: 'Answer' },
        ],
      }],
    }),
    defineField({ name: 'splitSection', title: 'Two-Column Sections', type: 'array', of: [{ type: 'reference', to: [{ type: 'splitSection' }] }] }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoMetadata' }),
  ],
})
```

### 2.5 Location (Service Areas)

`sanity/schemaTypes/location.ts`

```typescript
import { defineType, defineField } from 'sanity'

export const location = defineType({
  name: 'location',
  title: 'Locations',
  type: 'document',
  fields: [
    defineField({ name: 'cityName', title: 'City Name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'cityName', maxLength: 96 }, validation: (R) => R.required() }),
    defineField({ name: 'state', title: 'State', type: 'string' }),
    defineField({ name: 'fullLocationName', title: 'Full Location Name', type: 'string' }),
    defineField({ name: 'isActive', title: 'Is Active', type: 'boolean', initialValue: true }),
    defineField({ name: 'heroHeadline', title: 'Hero Headline', type: 'string' }),
    defineField({ name: 'introText', title: 'Intro Text', type: 'text', rows: 4 }),
    defineField({ name: 'servicesOffered', title: 'Services Offered', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'faqItems',
      title: 'FAQ Items',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'question', type: 'string', title: 'Question' },
          { name: 'answer', type: 'text', title: 'Answer' },
        ],
      }],
    }),
    defineField({ name: 'phoneNumber', title: 'Phone Number', type: 'string' }),
    defineField({ name: 'latitude', title: 'Latitude', type: 'number' }),
    defineField({ name: 'longitude', title: 'Longitude', type: 'number' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoMetadata' }),
  ],
})
```

### 2.6 Hero Banner

`sanity/schemaTypes/heroBanner.ts`

```typescript
import { defineType, defineField } from 'sanity'

export const heroBanner = defineType({
  name: 'heroBanner',
  title: 'Hero Banner',
  type: 'document',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'bodyText', title: 'Body Text', type: 'text', rows: 3 }),
    defineField({ name: 'buttonText', title: 'Button Text', type: 'string' }),
    defineField({ name: 'buttonLink', title: 'Button Link', type: 'string' }),
    defineField({ name: 'backgroundImage', title: 'Background Image', type: 'image', options: { hotspot: true } }),
  ],
})
```

### 2.7 Certification Badge

`sanity/schemaTypes/certificationBadge.ts`

```typescript
import { defineType, defineField } from 'sanity'

export const certificationBadge = defineType({
  name: 'certificationBadge',
  title: 'Certification Badges',
  type: 'document',
  fields: [
    defineField({ name: 'badgeName', title: 'Badge Name', type: 'string' }),
    defineField({ name: 'logoImage', title: 'Logo Image', type: 'image' }),
    defineField({ name: 'displayOrder', title: 'Display Order', type: 'number' }),
  ],
})
```

### 2.8 Project Slide

`sanity/schemaTypes/projectSlide.ts`

```typescript
import { defineType, defineField } from 'sanity'

export const projectSlide = defineType({
  name: 'projectSlide',
  title: 'Project Slides',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'displayOrder', title: 'Display Order', type: 'number' }),
  ],
})
```

### 2.9 Job Posting

`sanity/schemaTypes/jobPosting.ts`

```typescript
import { defineType, defineField } from 'sanity'

export const jobPosting = defineType({
  name: 'jobPosting',
  title: 'Job Postings',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Job Title', type: 'string' }),
    defineField({ name: 'department', title: 'Department', type: 'string' }),
    defineField({ name: 'employmentType', title: 'Employment Type', type: 'string' }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 6 }),
    defineField({ name: 'requirements', title: 'Requirements', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'datePosted', title: 'Date Posted', type: 'date' }),
    defineField({ name: 'isActive', title: 'Is Active', type: 'boolean', initialValue: true }),
  ],
})
```

### 2.10 Register all schemas

`sanity/schemaTypes/index.ts`

```typescript
import { seoMetadata } from './seoMetadata'
import { splitSection } from './splitSection'
import { service } from './service'
import { blog } from './blog'
import { location } from './location'
import { heroBanner } from './heroBanner'
import { certificationBadge } from './certificationBadge'
import { projectSlide } from './projectSlide'
import { jobPosting } from './jobPosting'

export const schemaTypes = [
  seoMetadata,
  splitSection,
  service,
  blog,
  location,
  heroBanner,
  certificationBadge,
  projectSlide,
  jobPosting,
]
```

Then open `sanity/sanity.config.ts` and make sure it points to your schemas:

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'shumaker-roofing',
  title: 'Shumaker Roofing',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
})
```

---

## Phase 3 — Create `lib/sanity.ts` (replaces `lib/contentful.ts`)

Create `lib/sanity.ts`:

```typescript
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { cache } from 'react'

// ─── Client ──────────────────────────────────────────────────────────────────

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true, // cached, fast reads — fine for ISR pages
})

// ─── Image URL builder ────────────────────────────────────────────────────────

const builder = imageUrlBuilder(sanityClient)

// Replaces toHttpsUrl() + Contentful image URLs
// Pass any Sanity image reference field directly
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sanityImageUrl(source: any): string | null {
  if (!source) return null
  return builder.image(source).url()
}

// ─── Services ─────────────────────────────────────────────────────────────────

export const fetchAllServices = cache(async function fetchAllServices() {
  return sanityClient.fetch(`*[_type == "services"] | order(_createdAt asc)`)
})

export const fetchServicesForListing = cache(async function fetchServicesForListing() {
  return sanityClient.fetch(`*[_type == "services"]{
    _id,
    _updatedAt,
    title,
    slug,
    "excerpt": servicesContent[0].children[0].text
  } | order(title asc)`)
})

export const fetchServiceBySlug = cache(async function fetchServiceBySlug(slug: string) {
  return sanityClient.fetch(`*[_type == "services" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    servicesContent,
    additionalContent,
    servicesImage,
    "splitSections": splitSection[]->{
      _id,
      splitTitle,
      splitDescription,
      splitImage
    },
    seo
  }`, { slug })
})

// ─── Hero Banner ──────────────────────────────────────────────────────────────

export const fetchHeroBanner = cache(async function fetchHeroBanner() {
  return sanityClient.fetch(`*[_type == "heroBanner"][0]`)
})

// ─── Certification Badges ─────────────────────────────────────────────────────

export const fetchCertificationBadges = cache(async function fetchCertificationBadges() {
  return sanityClient.fetch(`*[_type == "certificationBadge"] | order(displayOrder asc){
    _id,
    badgeName,
    logoImage,
    displayOrder
  }`)
})

// ─── Project Slides ───────────────────────────────────────────────────────────

export const fetchProjectSlides = cache(async function fetchProjectSlides() {
  return sanityClient.fetch(`*[_type == "projectSlide"] | order(displayOrder asc){
    _id,
    title,
    image,
    displayOrder
  }`)
})

// ─── Job Postings ─────────────────────────────────────────────────────────────

export const fetchJobPostings = cache(async function fetchJobPostings() {
  return sanityClient.fetch(`*[_type == "jobPosting" && isActive == true] | order(datePosted desc){
    _id,
    title,
    department,
    employmentType,
    location,
    description,
    requirements,
    datePosted
  }`)
})

// ─── Blog ─────────────────────────────────────────────────────────────────────

export const fetchAllBlogPosts = cache(async function fetchAllBlogPosts() {
  return sanityClient.fetch(`*[_type == "blog"] | order(publishedDate desc){
    _id,
    title,
    slug,
    publishedDate,
    featuredImage,
    categories,
    author,
    excerpt
  }`)
})

export const fetchBlogPostBySlug = cache(async function fetchBlogPostBySlug(slug: string) {
  return sanityClient.fetch(`*[_type == "blog" && slug.current == $slug][0]{
    _id,
    _updatedAt,
    title,
    slug,
    publishedDate,
    featuredImage,
    categories,
    author,
    excerpt,
    content,
    faqItems,
    "splitSections": splitSection[]->{
      _id,
      splitTitle,
      splitDescription,
      splitImage
    },
    seo
  }`, { slug })
})

export const fetchAllBlogSlugs = cache(async function fetchAllBlogSlugs() {
  return sanityClient.fetch(`*[_type == "blog"]{ "slug": slug.current }`)
})

// ─── Locations (Service Areas) ────────────────────────────────────────────────

export const fetchAllLocations = cache(async function fetchAllLocations() {
  return sanityClient.fetch(`*[_type == "location" && isActive == true]{
    _id,
    _updatedAt,
    cityName,
    "slug": slug.current,
    state,
    fullLocationName,
    isActive
  } | order(cityName asc)`)
})

export const fetchLocationBySlug = cache(async function fetchLocationBySlug(slug: string) {
  return sanityClient.fetch(`*[_type == "location" && slug.current == $slug][0]{
    _id,
    cityName,
    "slug": slug.current,
    state,
    fullLocationName,
    isActive,
    heroHeadline,
    introText,
    servicesOffered,
    faqItems,
    phoneNumber,
    latitude,
    longitude,
    seo
  }`, { slug })
})
```

---

## Phase 4 — Create `lib/sanity-image.ts`

This is a tiny helper so your pages don't need to import `sanityImageUrl` differently from `toHttpsUrl`:

```typescript
// lib/sanity-image.ts
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from './sanity'

const builder = imageUrlBuilder(sanityClient)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any): string | null {
  if (!source?.asset) return null
  return builder.image(source).auto('format').fit('max').url()
}
```

---

## Phase 5 — Update Dynamic Pages

### 5.1 Services Detail Page `app/services/[slug]/page.tsx`

Replace the top of the file:

```typescript
// REMOVE these imports:
// import { client } from "@/lib/contentful";
// import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
// import { INLINES } from "@contentful/rich-text-types";
// import type { Options } from "@contentful/rich-text-react-renderer";
// import type { Hyperlink } from "@contentful/rich-text-types";

// ADD these:
import { fetchServiceBySlug, fetchAllServices } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity-image";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
```

Replace `richTextOptions` with Sanity's PortableText components:

```typescript
const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href = value?.href ?? ''
      const isExternal = href.startsWith('http') && !href.includes('shumakerroofing.com')
      return (
        <a href={href} target={isExternal ? '_blank' : '_self'} rel={isExternal ? 'noopener noreferrer' : undefined}>
          {children}
        </a>
      )
    },
  },
}
```

Replace `getServiceFromSlug` with:

```typescript
const getServiceFromSlug = cache(async function getServiceFromSlug(slug: string) {
  return fetchServiceBySlug(slug)
})
```

Add `generateStaticParams` (pre-builds all service pages at deploy time):

```typescript
export async function generateStaticParams() {
  const services = await fetchAllServices()
  return services.map((s: { slug: { current: string } }) => ({ slug: s.slug.current }))
}
```

Update `generateMetadata`:

```typescript
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await getServiceFromSlug(slug)
  if (!service) return { title: "Service Not Found - Shumaker Roofing Company" }

  const fallbackTitle = service.title
    ? `${service.title} Services | Shumaker Roofing Company`
    : "Roofing Services | Shumaker Roofing Company"
  const fallbackDesc = `Expert ${(service.title ?? "roofing").toLowerCase()} services by Shumaker Roofing.`
  const fallbackImage = urlFor(service.servicesImage)

  return fetchPageSeo({
    entryFields: service.seo,
    fallbackTitle,
    fallbackDesc,
    fallbackImage: fallbackImage ?? undefined,
    canonicalPath: `/services/${slug}`,
  })
}
```

Update the page body:

```typescript
export default async function ServiceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await getServiceFromSlug(slug)
  if (!service) notFound()

  const imageUrl = urlFor(service.servicesImage)

  const splitSections = (service.splitSections ?? []).map((item: {
    _id: string; splitTitle: string; splitDescription: string | null; splitImage: unknown
  }) => ({
    id: item._id,
    splitTitle: item.splitTitle ?? '',
    splitDescription: item.splitDescription ?? null,
    imageUrl: urlFor(item.splitImage),
  })).filter((s: { imageUrl: string | null }) => s.imageUrl !== null)

  // ... rest of your JSX stays the same, just swap:
  // documentToReactComponents(serviceFields.servicesContent, richTextOptions)
  // → <PortableText value={service.servicesContent} components={portableTextComponents} />
}
```

In the JSX, swap the rich text renderer calls:

```tsx
{/* Before (Contentful): */}
{documentToReactComponents(serviceFields.servicesContent, richTextOptions)}

{/* After (Sanity): */}
{service.servicesContent && (
  <PortableText value={service.servicesContent} components={portableTextComponents} />
)}
```

---

### 5.2 Blog Detail Page `app/blog/[slug]/page.tsx`

Replace imports:

```typescript
// REMOVE Contentful imports (client, documentToReactComponents, INLINES, BLOCKS, etc.)

// ADD:
import { fetchBlogPostBySlug, fetchAllBlogSlugs } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity-image";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
```

Replace `richTextOptions` with:

```typescript
const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const url = urlFor(value)
      if (!url) return null
      return (
        <div className="my-8 rounded-xl overflow-hidden shadow-md">
          <img src={url} alt={value.alt ?? ''} className="w-full h-auto object-cover" />
        </div>
      )
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href ?? ''
      const isExternal = href.startsWith('http') && !href.includes('shumakerroofing.com')
      return (
        <a href={href} target={isExternal ? '_blank' : '_self'} rel={isExternal ? 'noopener noreferrer' : undefined}>
          {children}
        </a>
      )
    },
  },
}
```

Replace `getPostFromSlug`:

```typescript
const getPostFromSlug = cache(async function getPostFromSlug(slug: string) {
  return fetchBlogPostBySlug(slug)
})
```

Replace `generateStaticParams`:

```typescript
export async function generateStaticParams() {
  const slugs = await fetchAllBlogSlugs()
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }))
}
```

Update `generateMetadata` to use the Sanity post fields directly:

```typescript
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostFromSlug(slug)
  if (!post) return { title: "Post Not Found" }

  return fetchPageSeo({
    entryFields: post.seo,
    fallbackTitle: post.title ?? "Shumaker Roofing Blog",
    fallbackDesc: post.excerpt ?? "Read our latest roofing insights.",
    fallbackImage: urlFor(post.featuredImage) ?? undefined,
    ogType: "article",
    canonicalPath: `/blog/${slug}`,
  })
}
```

In the page body, replace all field access (`postFields.X`) with direct access (`post.X`):

```typescript
// Before:
const postFields = rawPost.fields as any
const imageUrl = toHttpsUrl(postFields.featuredImage?.fields?.file?.url)
const categories = postFields.categories ?? []
const authorName = "Shumaker Team" // complex resolution logic

// After (much simpler):
const imageUrl = urlFor(post.featuredImage) ?? DEFAULT_IMAGE
const categories: string[] = post.categories ?? []
const authorName: string = post.author ?? "Shumaker Team"
```

Replace the body rich text:

```tsx
{/* Before: */}
{documentToReactComponents(postFields.content, richTextOptions)}

{/* After: */}
{post.content && (
  <PortableText value={post.content} components={portableTextComponents} />
)}
```

---

### 5.3 Service Areas Page `app/service-areas/[slug]/page.tsx`

Replace the fetch call:

```typescript
// Before:
import { fetchLocation } from "@/lib/contentful"
const location = await fetchLocation(slug)
const fields = location?.fields as ContentfulLocation['fields']

// After:
import { fetchLocationBySlug } from "@/lib/sanity"
const location = await fetchLocationBySlug(slug)
// Access fields directly: location.cityName, location.slug, location.faqItems, etc.
```

In `generateStaticParams`:

```typescript
import { fetchAllLocations } from "@/lib/sanity"

export async function generateStaticParams() {
  const locations = await fetchAllLocations()
  return locations.map((loc: { slug: string }) => ({ slug: loc.slug }))
}
```

---

### 5.4 Update `lib/seo.ts`

The `fetchPageSeo` function works the same — just update `resolveSeoMetadata` to read Sanity's flatter object (since Sanity doesn't nest fields under `.fields`):

```typescript
// In resolveSeoMetadata(), replace the whole function body with:
export function resolveSeoMetadata(seoFields: any): ResolvedSeoMetadata | null {
  if (!seoFields) return null

  // Sanity SEO is a flat object, not nested like Contentful
  const rawImageUrl = seoFields.featuredImage
    ? urlFor(seoFields.featuredImage) // use your sanity-image urlFor helper
    : undefined

  return {
    seoTitle: seoFields.seoTitle ?? undefined,
    seoDescription: seoFields.seoDescription ?? undefined,
    featuredImageUrl: rawImageUrl ?? undefined,
    canonicalUrl: seoFields.canonicalUrl ?? undefined,
    noIndex: Boolean(seoFields.noindex ?? false),
    noFollow: Boolean(seoFields.nofollow ?? false),
  }
}
```

> **Note:** Add `import { urlFor } from './sanity-image'` at the top of `lib/seo.ts`.

---

### 5.5 Update `next.config.mjs`

Add Sanity's image CDN to allowed domains:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Keep Contentful temporarily while migrating
      { protocol: 'https', hostname: 'images.ctfassets.net' },
      // Add Sanity CDN
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}

export default nextConfig
```

---

### 5.6 Update `.env.local`

```env
# ADD — Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token

# KEEP temporarily until all pages are migrated, then delete
CONTENTFUL_SPACE_ID=...
CONTENTFUL_ACCESS_TOKEN=...
```

---

## Phase 6 — Add the Sanity Studio Route (Optional but Recommended)

Add a `/studio` route so you can edit content directly from your site at `localhost:3000/studio`:

Create `app/studio/[[...tool]]/page.tsx`:

```typescript
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

Now open `http://localhost:3000/studio` in your browser, log in with your Sanity account, and start entering content.

---

## Phase 7 — Enter Your Content in Sanity Studio

You have two options:

**Option A — Manual entry** (simplest for a roofing site)  
Open `/studio` and re-enter your services, blog posts, and locations one by one. This is actually faster than it sounds and lets you clean up old content as you go.

**Option B — Export from Contentful and import to Sanity**  
Use the `contentful-export` CLI to dump your data to JSON, then write a small Node script to transform and import it via Sanity's `sanityClient.create()`. This is worth doing if you have 50+ blog posts.

---

## Phase 8 — Testing Checklist

Go through this before removing Contentful:

- [ ] `npm run dev` shows no TypeScript errors
- [ ] `/services` page loads and lists all services
- [ ] `/services/[any-slug]` page loads with content and images
- [ ] `/blog` page loads with all posts
- [ ] `/blog/[any-slug]` page loads with rich text rendered correctly
- [ ] `/service-areas` page loads with all locations
- [ ] `/service-areas/[any-slug]` page loads
- [ ] Images from Sanity (`cdn.sanity.io`) render in `<Image>` components
- [ ] SEO metadata appears in `<head>` (check with browser DevTools)
- [ ] `npm run build` completes with no errors

---

## Quick Reference: Contentful vs. Sanity

| Concept | Contentful | Sanity |
|---|---|---|
| Client setup | `createClient({ space, accessToken })` | `createClient({ projectId, dataset, apiVersion })` |
| Fetch entries | `client.getEntries({ content_type: 'blog' })` | `sanityClient.fetch('*[_type == "blog"]')` |
| Image URL | `toHttpsUrl(fields.image?.fields?.file?.url)` | `urlFor(post.featuredImage)` |
| Rich text | `documentToReactComponents(fields.content)` | `<PortableText value={post.content} />` |
| Slug | `fields.slug` or `slugify(fields.title)` | `slug.current` |
| Entry ID | `item.sys.id` | `item._id` |
| Updated at | `item.sys.updatedAt` | `item._updatedAt` |
| Linked entry | Deeply nested `.fields` objects | Flattened via GROQ projection `->{ ... }` |
| Content editor | Contentful web app | `/studio` route in your own site |
| Env vars | `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN` | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `SANITY_API_READ_TOKEN` |

---

## Common Mistakes to Avoid

1. **Don't forget `slug.current`** — In Sanity, slugs are objects `{ current: "my-slug" }`, not plain strings. Always use `slug.current` in your GROQ queries and in your page code.

2. **GROQ fetches only what you ask for** — Unlike Contentful's `include` depth, Sanity only returns fields you list in your GROQ projection `{ field1, field2 }`. If a field is missing, check your GROQ query first.

3. **Images need the builder** — Never use a Sanity image object URL directly. Always call `urlFor(image)` through the `@sanity/image-url` builder.

4. **PortableText replaces documentToReactComponents** — The data shape is different. Sanity's rich text is an array of block objects; Contentful's was a tree. Don't try to reuse your old renderer logic.

5. **Studio route needs `'use client'`** — The `/studio` page must be a Client Component.

6. **ISR still works** — Keep `export const revalidate = 3600` at the top of your dynamic pages. Sanity's CDN respects this just like Contentful did.
