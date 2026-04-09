import Image from "next/image";
import { Container } from "@/components/shared/container";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import type { Document } from "@contentful/rich-text-types";

interface TwoColumnSectionProps {
  splitTitle: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  splitDescription: Document | null;
  splitImageUrl: string;
  splitImageAlt?: string;
  /** When true the image is on the right; default is left */
  imageRight?: boolean;
}

/** Rich-text render options aligned to the site's design system */
const richTextOptions = {
  renderNode: {
    [BLOCKS.HEADING_2]: (_node: unknown, children: React.ReactNode) => (
      <h2 className="text-xl font-heading font-bold text-foreground mt-6 first:mt-0 mb-2">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (_node: unknown, children: React.ReactNode) => (
      <h3 className="text-lg font-heading font-semibold text-foreground mt-5 first:mt-0 mb-1.5">
        {children}
      </h3>
    ),
    [BLOCKS.HEADING_4]: (_node: unknown, children: React.ReactNode) => (
      <h4 className="text-base font-heading font-semibold text-foreground mt-4 mb-1">
        {children}
      </h4>
    ),
    [BLOCKS.PARAGRAPH]: (_node: unknown, children: React.ReactNode) => (
      <p className="text-foreground/80 leading-relaxed mb-3 last:mb-0">{children}</p>
    ),
    [BLOCKS.UL_LIST]: (_node: unknown, children: React.ReactNode) => (
      <ul className="space-y-2 mb-4">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node: unknown, children: React.ReactNode) => (
      <ol className="list-decimal pl-5 space-y-2 mb-4">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node: unknown, children: React.ReactNode) => (
      <li className="flex items-start gap-2.5">
        <span className="mt-[0.4rem] w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        <span className="text-foreground/80 leading-relaxed">{children}</span>
      </li>
    ),
    [BLOCKS.HR]: () => <hr className="my-6 border-border" />,
    [INLINES.HYPERLINK]: (node: unknown, children: React.ReactNode) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const uri = (node as any)?.data?.uri as string | undefined;
      return (
        <a
          href={uri}
          className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
  },
};

export function TwoColumnSection({
  splitTitle,
  splitDescription,
  splitImageUrl,
  splitImageAlt,
  imageRight = false,
}: TwoColumnSectionProps) {
  const imageCol = (
    <div className="relative w-full h-72 sm:h-80 md:h-96 lg:h-full min-h-[360px] rounded-2xl overflow-hidden shadow-lg">
      <Image
        src={splitImageUrl}
        alt={splitImageAlt ?? splitTitle}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
        quality={85}
      />
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-secondary/30 to-transparent pointer-events-none" />
    </div>
  );

  const textCol = (
    <div className="flex flex-col justify-center gap-5">
      {/* Accent rule */}
      <span className="block w-12 h-1 rounded-full bg-primary" />
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-extrabold text-foreground leading-tight">
        {splitTitle}
      </h2>
      {splitDescription && (
        <div className="space-y-1 text-base text-sm md:text-[1.0rem]">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {documentToReactComponents(splitDescription as any, richTextOptions as any)}
        </div>
      )}
    </div>
  );

  return (
    <section id="two-column-section" className="py-16 md:py-24 bg-background">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {imageRight ? (
            <>
              {textCol}
              {imageCol}
            </>
          ) : (
            <>
              {imageCol}
              {textCol}
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
