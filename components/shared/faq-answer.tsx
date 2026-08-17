import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { portableTextMarks } from "@/components/shared/portable-text-link";
import type { ResolvedFaqItem } from "@/lib/sanity";
import { cn, isExternalLink } from "@/lib/utils";

// A markdown link `[label](url)`, or a bare URL. `matchAll` clones the regex,
// so the shared `lastIndex` is never observed across calls.
const LEGACY_LINK_REGEX = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)|(https?:\/\/\S+)/g;

// Both branches render anchors, so link styling lives here rather than at each
// call site — the rich-text marks emit bare <a> elements by design.
const LINK_CLASSES =
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-opacity [&_a]:hover:opacity-80";

const faqComponents: PortableTextComponents = {
  marks: portableTextMarks,
  block: {
    normal: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  },
};

/**
 * Legacy path only: plain-text answers written before rich text existed may
 * contain markdown links or bare URLs. New answers use `answerContent`.
 */
function renderTextWithLinks(text: string) {
  const result: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(LEGACY_LINK_REGEX)) {
    const [full, label, markdownHref, bareUrl] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) result.push(text.slice(lastIndex, index));
    const href = bareUrl ?? markdownHref;
    const isExternal = isExternalLink(href);
    result.push(
      <a
        key={index}
        href={href}
        target={isExternal ? "_blank" : "_self"}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {label ?? bareUrl}
      </a>
    );
    lastIndex = index + full.length;
  }
  if (lastIndex < text.length) result.push(text.slice(lastIndex));

  return result;
}

/**
 * Renders an FAQ answer. Prefers the rich-text `answerContent` (so editors can
 * add internal links in the Studio) and falls back to the legacy plain-text
 * answer, which is still scanned for markdown links and bare URLs.
 */
export function FaqAnswer({ item, className }: { item: ResolvedFaqItem; className?: string }) {
  return (
    <div className={cn(LINK_CLASSES, className)}>
      {item.answerContent ? (
        <PortableText value={item.answerContent} components={faqComponents} />
      ) : (
        <p>{renderTextWithLinks(item.answerPlain)}</p>
      )}
    </div>
  );
}
