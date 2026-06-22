import type { PortableTextMarkComponentProps } from "@portabletext/react";
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
