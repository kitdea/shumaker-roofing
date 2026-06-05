import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Home, Building2, Wrench, ShieldAlert, Droplets, Umbrella, ShieldCheck, Grid } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a string to a URL-friendly slug:
 * - Lowercase
 * - Spaces replaced with hyphens
 * - Diacritics removed
 * - Special / non-ASCII characters removed
 * - Consecutive hyphens collapsed
 */
export function toHttpsUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}

export const SITE_URL = "https://shumakerroofing.com";

export function getServiceIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("residential")) return Home;
  if (t.includes("commercial")) return Building2;
  if (t.includes("maintenance") || t.includes("repair")) return Wrench;
  if (t.includes("storm") || t.includes("damage")) return ShieldAlert;
  if (t.includes("gutter")) return Droplets;
  if (t.includes("inspection")) return Umbrella;
  if (t.includes("shield") || t.includes("protect")) return ShieldCheck;
  return Grid;
}

export function deriveBlogSlug(fields: { slug?: unknown; title?: unknown }, id: string): string {
  return (fields.slug as string) || (fields.title ? slugify(fields.title as string) : id);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
