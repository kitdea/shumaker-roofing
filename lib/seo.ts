import type { Metadata } from "next";
import { toHttpsUrl, SITE_URL } from "@/lib/utils";
import { urlFor as sanityUrlFor } from "@/lib/sanity-image";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ResolvedSeoMetadata {
  seoTitle?: string;
  seoDescription?: string;
  featuredImageUrl?: string;
  canonicalUrl?: string;
  noIndex: boolean;
  noFollow: boolean;
}

// ─── Core resolver ────────────────────────────────────────────────────────────

/**
 * Reads a linked seoMetadata entry from any Contentful entry's fields.
 *
 * Strategy:
 *  1. Try common field names (seoMetadata, seoMeta, seo)
 *  2. Scan ALL fields for any linked entry whose content type is 'seoMetadata'
 *
 * Returns null when no SEO Metadata entry is linked so callers can
 * distinguish "not found" from "found but empty".
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveSeoMetadata(fields: any): ResolvedSeoMetadata | null {
  // Try known field names first
  let seoRef =
    fields?.seoMetadata ||
    fields?.seoMeta ||
    fields?.seo;
  if (Array.isArray(seoRef)) seoRef = seoRef[0];

  // Fallback: scan ALL fields for any linked entry with contentType 'seoMetadata'
  // This handles any custom field name the editor chose in Contentful
  if (!seoRef?.fields) {
    for (const key of Object.keys(fields || {})) {
      const val = fields[key];
      const candidate = Array.isArray(val) ? val[0] : val;
      if (candidate?.sys?.contentType?.sys?.id === "seoMetadata") {
        seoRef = candidate;
        break;
      }
    }
  }

  if (!seoRef) {
    return null;
  }

  // Contentful nests fields under `.fields`; Sanity's seo object is already flat.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seo: any = seoRef.fields ?? seoRef;

  const rawContentfulImageUrl: string | undefined = seo.featuredImage?.fields?.file?.url;
  const featuredImageUrl = rawContentfulImageUrl
    ? toHttpsUrl(rawContentfulImageUrl)
    : sanityUrlFor(seo.featuredImage);

  // Try multiple possible API field ID variations for boolean flags
  const noIndex = Boolean(seo.noindex ?? seo.noIndex ?? seo.hidePage ?? false);
  const noFollow = Boolean(seo.nofollow ?? seo.noFollow ?? seo.excludeLinksRanking ?? seo.excludeLinks ?? false);

  return {
    seoTitle: seo.seoTitle ?? undefined,
    seoDescription: seo.seoDescription ?? undefined,
    featuredImageUrl,
    canonicalUrl: seo.canonicalUrl ?? undefined,
    noIndex,
    noFollow,
  };
}

// ─── Next.js Metadata builder ─────────────────────────────────────────────────

/**
 * Builds a complete Next.js Metadata object from resolved SEO values.
 * CMS fields always win; fallbacks are used only when a CMS field is absent.
 */
export function buildNextMetadata(
  seo: ResolvedSeoMetadata,
  fallbackTitle: string,
  fallbackDesc: string,
  fallbackImage?: string,
  ogType: "website" | "article" = "website",
  canonicalPath?: string,
): Metadata {
  const rawTitle = seo.seoTitle || fallbackTitle;
  const title = { absolute: rawTitle };
  const description = seo.seoDescription || fallbackDesc;
  const imageUrl = seo.featuredImageUrl || fallbackImage;

  const robots =
    seo.noIndex || seo.noFollow
      ? { index: !seo.noIndex, follow: !seo.noFollow }
      : undefined;

  // Page-specific path always wins over any CMS-stored canonicalUrl.
  // CMS canonical is only used for pages that don't supply their own path.
  const canonical = canonicalPath
    ? `${SITE_URL}${canonicalPath}`
    : seo.canonicalUrl;

  return {
    title,
    description,
    ...(robots && { robots }),
    ...(canonical && { alternates: { canonical } }),
    openGraph: {
      title: rawTitle,
      description,
      type: ogType,
      ...(imageUrl && { images: [{ url: imageUrl, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: rawTitle,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}

// ─── Unified SEO resolver for every page ─────────────────────────────────────

/**
 * Resolves Next.js Metadata for a dynamic page.
 *
 * Priority order:
 *  1. Linked seoMetadata entry on the Contentful page entry (if entryFields provided)
 *  2. Provided fallback strings
 *
 * Dynamic pages: pass entryFields fetched with include >= 2.
 */
export async function fetchPageSeo({
  entryFields,
  fallbackTitle,
  fallbackDesc,
  fallbackImage,
  ogType = "website",
  canonicalPath,
}: {
  /** Fields from an already-fetched Contentful entry (fetch with include >= 2) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entryFields?: any;
  fallbackTitle: string;
  fallbackDesc: string;
  /** Fallback OG image when no SEO entry provides one */
  fallbackImage?: string;
  ogType?: "website" | "article";
  /** The page's own path (e.g. "/blog/my-post") used as canonical when Contentful doesn't override it */
  canonicalPath?: string;
}): Promise<Metadata> {
  try {
    // ── Strategy 1: linked seoMetadata entry on the page entry ──────────────
    if (entryFields) {
      const seo = resolveSeoMetadata(entryFields);
      if (seo) {
        return buildNextMetadata(seo, fallbackTitle, fallbackDesc, fallbackImage, ogType, canonicalPath);
      }
    }

    // ── Strategy 2: fallback strings only ───────────────────────────────────
    return buildNextMetadata({ noIndex: false, noFollow: false }, fallbackTitle, fallbackDesc, fallbackImage, ogType, canonicalPath);
  } catch {
    return { title: { absolute: fallbackTitle }, description: fallbackDesc };
  }
}
