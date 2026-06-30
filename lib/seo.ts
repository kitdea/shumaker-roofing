import type { Metadata } from "next";
import { SITE_URL } from "@/lib/utils";
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
 * Reads the `seo` object off an already-fetched Sanity document.
 *
 * Returns null when no SEO object is present so callers can
 * distinguish "not found" from "found but empty".
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveSeoMetadata(fields: any): ResolvedSeoMetadata | null {
  const seo = fields?.seo;
  if (!seo) {
    return null;
  }

  return {
    seoTitle: seo.seoTitle ?? undefined,
    seoDescription: seo.seoDescription ?? undefined,
    featuredImageUrl: sanityUrlFor(seo.featuredImage),
    canonicalUrl: seo.canonicalUrl ?? undefined,
    noIndex: Boolean(seo.noindex ?? false),
    noFollow: Boolean(seo.nofollow ?? false),
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
 *  1. The `seo` object on the Sanity document (if entryFields provided)
 *  2. Provided fallback strings
 */
export async function fetchPageSeo({
  entryFields,
  fallbackTitle,
  fallbackDesc,
  fallbackImage,
  ogType = "website",
  canonicalPath,
}: {
  /** Fields from an already-fetched Sanity document, including its `seo` object */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entryFields?: any;
  fallbackTitle: string;
  fallbackDesc: string;
  /** Fallback OG image when no SEO entry provides one */
  fallbackImage?: string;
  ogType?: "website" | "article";
  /** The page's own path (e.g. "/blog/my-post") used as canonical when the CMS doesn't override it */
  canonicalPath?: string;
}): Promise<Metadata> {
  try {
    // ── Strategy 1: seo object on the Sanity document ────────────────────────
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
