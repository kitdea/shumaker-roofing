# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (uses Turbopack)
npm run build    # Production build
npm run lint     # ESLint
```

## Environment Variables

Create a `.env.local` with:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=...
SANITY_API_READ_TOKEN=...
```

## Architecture

This is a **Next.js 16 App Router** site for Shumaker Roofing, using TypeScript and Tailwind CSS. Content is managed through **Sanity CMS** (migrated from Contentful in June 2026). The Sanity Studio is embedded at `/studio`.

### Routes

| Path | Source |
|---|---|
| `/` | `app/(site)/page.tsx` |
| `/about` | `app/(site)/about/page.tsx` |
| `/services` | `app/(site)/services/page.tsx` — fetches `services` documents via `fetchServicesForListing()` |
| `/services/[slug]` | `app/(site)/services/[slug]/page.tsx` — fetches via `fetchServiceBySlug()` |
| `/blog` | `app/(site)/blog/page.tsx` — fetches `blog` documents via `fetchAllBlogPosts()` |
| `/blog/[slug]` | `app/(site)/blog/[slug]/page.tsx` — fetches via `fetchBlogPostBySlug()` |
| `/service-areas` | `app/(site)/service-areas/page.tsx` — fetches `location` documents via `fetchAllLocations()` |
| `/service-areas/[slug]` | `app/(site)/service-areas/[slug]/page.tsx` — fetches via `fetchLocationBySlug()` |
| `/contact`, `/faqs`, `/careers`, `/projects`, `/testimonials`, `/roofs-for-heroes`, `/book-appointment` | Mostly static, some with Sanity-backed sections (e.g. job postings, team) |
| `/privacy-policy`, `/terms-and-conditions` | Static |
| `/studio/[[...tool]]` | Embedded Sanity Studio |

### Key Libraries

- **`lib/sanity.ts`** — all data-fetching functions (`fetchServiceBySlug`, `fetchServicesForListing`, `fetchServiceSlugs`, `fetchAllBlogPosts`, `fetchBlogPostBySlug`, `fetchAllBlogSlugs`, `fetchAllLocations`, `fetchLocationBySlug`, `fetchHeroBanner`, `fetchCertificationBadges`, `fetchProjectSlides`, `fetchJobPostings`, `fetchTeamMembers`, `mapSplitSections`). Each is wrapped in React `cache()`. Uses `sanityClient` from `sanity/lib/client`.
- **`lib/sanity-image.ts`** — `urlFor()` builds image URLs from Sanity image refs.
- **`lib/seo.ts`** — `fetchPageSeo()` / `resolveSeoMetadata()` / `buildNextMetadata()` resolve SEO metadata. Always call inside `generateMetadata()`.
- **`lib/utils.ts`** — `cn()` for Tailwind class merging; `slugify()` for URL-safe slugs from titles.
- **`sanity/schemaTypes/`** — document schemas: `blog`, `service`, `location`, `seoMetadata`, `splitSection`, `heroBanner`, `certificationBadge`, `projectSlide`, `jobPosting`, `teamMember`.

### Slug Resolution

Sanity documents have a native `slug.current` field (set via Sanity's slug input, not derived at runtime). Use `slug.current` directly in GROQ queries — do not regenerate slugs with `slugify()` for Sanity content; `slugify()` in `lib/utils.ts` is now only used for display/formatting helpers, not slug lookups.

### Component Conventions

- `components/shared/` — layout-level components: `NavbarServer` (Server Component that fetches services + locations from Sanity via `fetchServiceSlugs()`/`fetchAllLocations()`), `Footer`, `Container`, `SectionHeader`, `TwoColumnSection`
- `components/ui/` — primitive UI components: `Button`, `Card`
- `components/theme-provider.tsx` — wraps `next-themes` for light/dark mode
- The `NavbarServer` is a Server Component that fetches the services/locations list to populate nav dropdowns; keep it async and server-side only.
- Rich text from Sanity is rendered via `@portabletext/react`; see `components/shared/portable-text-link.tsx` and `components/shared/portable-text-table.tsx` for custom block/mark overrides.

### Images

Remote image domains allowed in `next.config.mjs`: `images.unsplash.com` (fallbacks), `cdn.sanity.io` (current CMS images). Use `urlFor()` from `lib/sanity-image.ts` to build Sanity image URLs — it returns an absolute `https://` URL ready for `<Image>`.

### Styling

- Tailwind CSS with `font-heading` (Montserrat) and `font-sans` (Inter) CSS variables
- `cn()` from `lib/utils` for conditional class merging
- Dark mode via `next-themes` with `class` attribute strategy

### Migration Notes

- Contentful was fully removed from the app in June 2026 (`lib/contentful.ts`, `types/contentful.ts`, the `contentful` and `@contentful/rich-text-react-renderer` packages were deleted). The remaining hardcoded `images.ctfassets.net` fallback image URLs were swapped for the Sanity-hosted `FALLBACK_BLOG_IMAGE` and the domain removed from `next.config.mjs`.
- The `/seo-writer` and `/content-updater` slash-command skills were updated to target Sanity (June 2026). `/content-updater` now publishes via the Sanity mutation API and requires a write-scoped `SANITY_API_WRITE_TOKEN` in `.env.local` (the shipped `SANITY_API_READ_TOKEN` is read-only and cannot publish).
