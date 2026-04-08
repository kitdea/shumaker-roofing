/**
 * lib/seo.ts
 * Universal SEO Metadata resolver for Contentful-powered Next.js pages.
 *
 * HOW IT WORKS
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. In Contentful you have a dedicated content type called "SEO Metadata"
 *    (API ID: seoMetadata) with these EXACT field IDs (verified live):
 *
 *    Field Name                                    │ Field ID            │ Type
 *    ──────────────────────────────────────────────┼─────────────────────┼─────────────
 *    SEO Title                                     │ seoTitle            │ Short text
 *    SEO Description                               │ seoDescription      │ Short text
 *    Featured Image                                │ featuredImage       │ Media
 *    Canonical URL                                 │ canonicalUrl        │ Short text
 *    Hide page from search engines (noindex)?      │ hidePage            │ Boolean
 *    Exclude links from Search Ranking?(nofollow)  │ excludeLinksRanking │ Boolean
 *
 * 2. Each page content type links to one SEO Metadata entry.
 *    Two reference styles are supported:
 *
 *    a) Single reference field  (Field ID: seoMetadata)  — recommended for new types
 *    b) Array reference field   (Field ID: seoMeta)      — used by the blog type
 *       The resolver reads the FIRST linked entry in the array.
 *
 * 3. Call resolveSeoMetadata(item.fields) in any generateMetadata() function.
 * 4. Pass the result to buildNextMetadata() for a full Next.js Metadata object.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Metadata } from "next";
import { client } from "@/lib/contentful";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ResolvedSeoMetadata {
  /** Maps to the <title> tag and og:title / twitter:title */
  seoTitle?: string;
  /** Maps to <meta name="description"> and og:description / twitter:description */
  seoDescription?: string;
  /** URL of the Open Graph / Twitter card image */
  featuredImageUrl?: string;
  /** Maps to <link rel="canonical"> — omitted when blank */
  canonicalUrl?: string;
  /** true → adds robots noindex directive */
  noIndex: boolean;
  /** true → adds robots nofollow directive */
  noFollow: boolean;
}

// ─── Core resolver ───────────────────────────────────────────────────────────

/**
 * Reads the `seoMetadata` reference field from any Contentful entry's `fields`
 * object and returns the resolved SEO values.
 *
 * The Contentful SDK resolves linked entries inline (include >= 1, which is
 * the default), so `fields.seoMetadata.fields` is always available when the
 * entry is published and linked.
 *
 * Returns an empty-safe object — safe to call even when no seoMetadata
 * reference has been set on the entry yet.
 *
 * @param fields  The `item.fields` from any Contentful entry.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveSeoMetadata(fields: any): ResolvedSeoMetadata {
  // Support two reference styles:
  //  • seoMetadata  — single reference (recommended, used for new content types)
  //  • seoMeta      — array reference  (used by the existing "blog" content type;  
  //                   reads the first linked entry)
  const seoRef =
    fields?.seoMetadata ||
    (Array.isArray(fields?.seoMeta) ? fields.seoMeta[0] : fields?.seoMeta);

  // No linked SEO Metadata entry — return safe defaults.
  if (!seoRef?.fields) {
    return { noIndex: false, noFollow: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seo: any = seoRef.fields;

  // Resolve asset URL — Contentful returns protocol-less URLs like //images.ctfassets.net/…
  const rawImageUrl: string | undefined = seo.featuredImage?.fields?.file?.url;
  const featuredImageUrl = rawImageUrl
    ? rawImageUrl.startsWith("//")
      ? `https:${rawImageUrl}`
      : rawImageUrl
    : undefined;

  return {
    seoTitle: seo.seoTitle ?? undefined,
    seoDescription: seo.seoDescription ?? undefined,
    featuredImageUrl,
    canonicalUrl: seo.canonicalUrl ?? undefined,
    // Exact Contentful field IDs confirmed from the live CMS
    noIndex: seo.hidePage ?? false,
    noFollow: seo.excludeLinksRanking ?? false,
  };
}

// ─── Next.js Metadata builder ─────────────────────────────────────────────────

/**
 * Builds a complete Next.js Metadata object from resolved SEO values.
 *
 * @param seo           Result of resolveSeoMetadata()
 * @param fallbackTitle Fallback title when seo.seoTitle is not set
 * @param fallbackDesc  Fallback description when seo.seoDescription is not set
 * @param fallbackImage Fallback image URL (e.g. the post's featuredImage) when
 *                      the SEO Metadata entry has no featured image
 * @param ogType        Open Graph type — "website" | "article" (default "website")
 */
export function buildNextMetadata(
  seo: ResolvedSeoMetadata,
  fallbackTitle: string,
  fallbackDesc: string,
  fallbackImage?: string,
  ogType: "website" | "article" = "website"
): Metadata {
  const title = seo.seoTitle || fallbackTitle;
  const description = seo.seoDescription || fallbackDesc;
  const imageUrl = seo.featuredImageUrl || fallbackImage;

  const robots =
    seo.noIndex || seo.noFollow
      ? { index: !seo.noIndex, follow: !seo.noFollow }
      : undefined;

  return {
    title,
    description,
    ...(robots && { robots }),
    ...(seo.canonicalUrl && { alternates: { canonical: seo.canonicalUrl } }),
    openGraph: {
      title,
      description,
      type: ogType,
      ...(imageUrl && { images: [{ url: imageUrl, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}

// ─── Universal fetch + resolve helper ────────────────────────────────────────

/**
 * Fetches a single Contentful entry by content type + slug field, resolves its
 * linked seoMetadata entry, and returns a ready-to-use Next.js Metadata object.
 *
 * Use this in generateMetadata() for any dynamic page:
 *
 * ```ts
 * export async function generateMetadata({ params }) {
 *   return fetchEntrySeo({
 *     contentType: "blog",          // your Contentful content type ID
 *     slugField:   "slug",          // the field used as the URL slug
 *     slug:        params.slug,
 *     fallbackTitle: "Shumaker Roofing Blog",
 *     fallbackDesc:  "Read our latest insights.",
 *     ogType: "article",
 *   });
 * }
 * ```
 *
 * @param contentType   Contentful content type ID (e.g. "blog", "services")
 * @param slugField     The field on the entry that holds the URL slug (e.g. "slug", "url")
 * @param slug          The actual slug value from the URL params
 * @param fallbackTitle Title used when seoTitle is not set on the SEO Metadata entry
 * @param fallbackDesc  Description used when seoDescription is not set
 * @param fallbackImageExtractor  Optional function to extract a fallback image
 *                                URL from the raw entry fields
 * @param ogType        "website" | "article" (default "website")
 * @param notFoundTitle Title returned when no matching entry is found
 */
export async function fetchEntrySeo({
  contentType,
  slugField,
  slug,
  fallbackTitle,
  fallbackDesc,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fallbackImageExtractor,
  ogType = "website",
  notFoundTitle = "Page Not Found",
}: {
  contentType: string;
  slugField: string;
  slug: string;
  fallbackTitle: string;
  fallbackDesc: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fallbackImageExtractor?: (fields: any) => string | undefined;
  ogType?: "website" | "article";
  notFoundTitle?: string;
}): Promise<Metadata> {
  try {
    // include: 2 ensures the linked seoMetadata entry AND its assets are resolved
    const response = await client.getEntries({
      content_type: contentType,
      [`fields.${slugField}`]: slug,
      limit: 1,
      include: 2,
    });

    if (!response.items.length) return { title: notFoundTitle };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields = response.items[0].fields as any;
    const seo = resolveSeoMetadata(fields);
    const fallbackImage = fallbackImageExtractor?.(fields);

    return buildNextMetadata(seo, fallbackTitle, fallbackDesc, fallbackImage, ogType);
  } catch {
    return { title: fallbackTitle };
  }
}
