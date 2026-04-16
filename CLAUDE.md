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
CONTENTFUL_SPACE_ID=...
CONTENTFUL_ACCESS_TOKEN=...
```

## Architecture

This is a **Next.js 16 App Router** site for Shumaker Roofing, using TypeScript and Tailwind CSS. Content is managed entirely through **Contentful CMS**.

### Routes

| Path | Source |
|---|---|
| `/` | `app/page.tsx` |
| `/about` | `app/about/page.tsx` |
| `/services` | `app/services/page.tsx` — fetches `services` content type |
| `/services/[slug]` | `app/services/[slug]/page.tsx` — slug derived from `slugify(title)` |
| `/news` | `app/news/page.tsx` — fetches `blog` content type |
| `/news/[slug]` | `app/news/[slug]/page.tsx` — slug derived from `slugify(title)` |
| `/contact` | `app/contact/page.tsx` |

### Key Libraries

- **`lib/contentful.ts`** — Contentful client (uses `CONTENTFUL_SPACE_ID` / `CONTENTFUL_ACCESS_TOKEN`)
- **`lib/seo.ts`** — `fetchPageSeo()` fetches SEO metadata from Contentful. Priority: (1) linked `seoMetadata` entry on the page entry, (2) standalone `seoMetadata` entry matched by `canonicalUrl`, (3) fallback strings. Always call this inside `generateMetadata()`.
- **`lib/utils.ts`** — `cn()` for Tailwind class merging; `slugify()` for URL-safe slugs from titles.

### Contentful Content Types

- `services` — roofing services; fields include `title`, `servicesContent` (Rich Text), `servicesImage`, `splitSection` (linked `splitSection` entries for two-column layouts)
- `blog` — blog posts; fields include `title`, `date`/`publishedDate`, `featuredImage`, `categories`, `author`
- `seoMetadata` — SEO entries; fields include `seoTitle`, `seoDescription`, `canonicalUrl`, `featuredImage`, `noindex`, `nofollow`

### Slug Resolution

Service and blog detail pages resolve slugs via `slugify(title)` (title → lowercase hyphenated). The service `[slug]` page has three fallback strategies: match by slugified title → match by `fields.url` → match by `sys.id`. Use `slugify()` consistently when generating or matching slugs.

### Component Conventions

- `components/shared/` — layout-level components: `NavbarServer` (Server Component that fetches services from Contentful), `Footer`, `Container`, `SectionHeader`, `TwoColumnSection`
- `components/ui/` — primitive UI components: `Button`, `Card`
- `components/theme-provider.tsx` — wraps `next-themes` for light/dark mode
- The `NavbarServer` is a Server Component that fetches the services list to populate the nav dropdown; keep it async and server-side only.

### Images

Remote image domains allowed in `next.config.mjs`: `images.unsplash.com` (used as fallbacks) and `images.ctfassets.net` (Contentful assets). Contentful image URLs come back as protocol-relative (`//images.ctfassets.net/...`) — always prepend `https:` before passing to `<Image>`.

### Styling

- Tailwind CSS with `font-heading` (Montserrat) and `font-sans` (Inter) CSS variables
- `cn()` from `lib/utils` for conditional class merging
- Dark mode via `next-themes` with `class` attribute strategy
