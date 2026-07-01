import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Home, Building2, Wrench, ShieldAlert, Droplets, Umbrella, ShieldCheck, Grid } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE_URL = "https://shumakerroofing.com";
export const SITE_DOMAIN = "shumakerroofing.com";
export const FALLBACK_BLOG_IMAGE =
  "https://cdn.sanity.io/images/rg9pahe7/production/6f190d658c389af55504e6ff5498d4f83bb923d4-2052x1540.jpg";

export function isExternalLink(href: string): boolean {
  return href.startsWith("http") && !href.includes(SITE_DOMAIN);
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function shortenServiceName(title: string): string {
  return title === "Commercial Flat & Low Slope Roofing Restoration" ? "Commercial" : title;
}

const STATE_NAMES: Record<string, string> = {
  MD: "Maryland",
  VA: "Virginia",
  PA: "Pennsylvania",
  WV: "West Virginia",
};

export function stateDisplayName(state: string): string {
  return STATE_NAMES[state] ?? state;
}

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
