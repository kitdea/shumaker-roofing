import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { portableTextLinkMark, portableTextInternalLinkMark } from "@/components/shared/portable-text-link";
import { SITE_DOMAIN } from "@/lib/utils";

const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
const BARE_URL_REGEX = /(https?:\/\/[^\s]+)/g;
const LINK_CLASS = "text-primary underline underline-offset-2 hover:opacity-80 transition-opacity";

const faqComponents: PortableTextComponents = {
  marks: {
    link: portableTextLinkMark,
    internalLink: portableTextInternalLinkMark,
  },
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
  let match: RegExpExecArray | null;

  MARKDOWN_LINK_REGEX.lastIndex = 0;
  while ((match = MARKDOWN_LINK_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(...renderBareUrls(text.slice(lastIndex, match.index), result.length));
    }
    const [, label, href] = match;
    const isInternal = href.includes(SITE_DOMAIN);
    result.push(
      <a
        key={match.index}
        href={href}
        target={isInternal ? "_self" : "_blank"}
        rel={isInternal ? undefined : "noopener noreferrer"}
        className={LINK_CLASS}
      >
        {label}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    result.push(...renderBareUrls(text.slice(lastIndex), result.length));
  }
  return result;
}

function renderBareUrls(text: string, keyOffset: number): React.ReactNode[] {
  const parts = text.split(BARE_URL_REGEX);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      const isInternal = part.includes(SITE_DOMAIN);
      return (
        <a
          key={keyOffset + i}
          href={part}
          target={isInternal ? "_self" : "_blank"}
          rel={isInternal ? undefined : "noopener noreferrer"}
          className={LINK_CLASS}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

/**
 * Renders an FAQ answer. Prefers the rich-text `answerContent` (so editors can
 * add internal links in the Studio) and falls back to the legacy plain-text
 * answer, which is still scanned for markdown links and bare URLs.
 */
export function FaqAnswer({
  answerContent,
  answer,
  className,
}: {
  answerContent: unknown[] | null;
  answer: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {answerContent ? (
        <PortableText value={answerContent as PortableTextBlock[]} components={faqComponents} />
      ) : (
        renderTextWithLinks(answer)
      )}
    </div>
  );
}
