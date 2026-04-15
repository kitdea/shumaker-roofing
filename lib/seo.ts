import type { Metadata } from "next";
import { client } from "@/lib/contentful";

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

  if (!seoRef?.fields) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seo: any = seoRef.fields;

  const rawImageUrl: string | undefined = seo.featuredImage?.fields?.file?.url;
  const featuredImageUrl = rawImageUrl
    ? rawImageUrl.startsWith("//") ? `https:${rawImageUrl}` : rawImageUrl
    : undefined;

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

// ─── Unified SEO resolver for every page ─────────────────────────────────────

/**
 * Single function used by every page — static or dynamic.
 *
 * Priority order:
 *  1. Linked seoMetadata entry on the Contentful page entry  (if entryFields provided)
 *  2. Standalone seoMetadata entry whose canonicalUrl matches `path`
 *  3. Provided fallback strings
 *
 * Usage examples:
 *
 * // Static page
 * return fetchPageSeo({ path: "/about", fallbackTitle: "...", fallbackDesc: "..." });
 *
 * // Dynamic page (entry already fetched for page content, must use include >= 2)
 * return fetchPageSeo({ path: `/services/${slug}`, entryFields: fields, fallbackTitle: "...", fallbackDesc: "..." });
 */
export async function fetchPageSeo({
  path,
  entryFields,
  fallbackTitle,
  fallbackDesc,
  fallbackImage,
  ogType = "website",
}: {
  /** Canonical URL path for this page, e.g. "/about" or "/services/residential-roofing" */
  path: string;
  /** Fields from an already-fetched Contentful entry (fetch with include >= 2) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entryFields?: any;
  fallbackTitle: string;
  fallbackDesc: string;
  /** Fallback OG image when no SEO entry provides one */
  fallbackImage?: string;
  ogType?: "website" | "article";
}): Promise<Metadata> {
  try {
    // ── Strategy 1: linked seoMetadata entry on the page entry ──────────────
    if (entryFields) {
      const seo = resolveSeoMetadata(entryFields);
      if (seo) {
        return buildNextMetadata(seo, fallbackTitle, fallbackDesc, fallbackImage, ogType);
      }
    }

    // ── Strategy 2: standalone seoMetadata entry matched by canonical path ──
    const normalized = path.replace(/\/$/, "") || "/";
    const response = await client.getEntries({
      content_type: "seoMetadata",
      "fields.canonicalUrl[match]": normalized,
      limit: 10,
      include: 1,
    });

    const match = response.items.find((item) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const url = ((item.fields as any)?.canonicalUrl as string | undefined) ?? "";
      const u = url.replace(/\/$/, "");
      return u === normalized || u.endsWith(normalized);
    });

    if (match) {
      const seo = resolveSeoMetadata({ seoMetadata: match });
      if (seo) {
        return buildNextMetadata(seo, fallbackTitle, fallbackDesc, fallbackImage, ogType);
      }
    }

    // ── Strategy 3: fallback strings only ───────────────────────────────────
    return buildNextMetadata({ noIndex: false, noFollow: false }, fallbackTitle, fallbackDesc, fallbackImage, ogType);
  } catch {
    return { title: fallbackTitle, description: fallbackDesc };
  }
}
