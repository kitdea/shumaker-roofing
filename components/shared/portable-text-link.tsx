import type { PortableTextComponents, PortableTextMarkComponentProps } from "@portabletext/react";
import { isExternalLink } from "@/lib/utils";

export function portableTextLinkMark({ value, children }: PortableTextMarkComponentProps) {
  const href = value?.href ?? "";
  const isExternal = isExternalLink(href);
  return (
    <a href={href} target={isExternal ? "_blank" : "_self"} rel={isExternal ? "noopener noreferrer" : undefined}>
      {children}
    </a>
  );
}

const PATH_BY_TYPE: Record<string, string> = {
  services: "/services",
  blog: "/blog",
  location: "/service-areas",
};

// Renders the `internalLink` annotation. The GROQ body projection resolves the
// referenced document into refType/refSlug; without those we render plain text
// rather than a dead link.
export function portableTextInternalLinkMark({ value, children }: PortableTextMarkComponentProps) {
  const base = PATH_BY_TYPE[value?.refType as string];
  const slug = value?.refSlug as string | undefined;
  if (!base || !slug) return <>{children}</>;
  return <a href={`${base}/${slug}`}>{children}</a>;
}

// Every rich-text field in the CMS uses the same `richTextBlock` annotations, so
// every PortableText call site needs the same mark renderers. Keep this the one
// place they are wired up — a new annotation only has to be added here.
export const portableTextMarks: PortableTextComponents["marks"] = {
  link: portableTextLinkMark,
  internalLink: portableTextInternalLinkMark,
};
