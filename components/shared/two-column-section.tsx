import Image from "next/image";
import { Container } from "@/components/shared/container";

interface TwoColumnSectionProps {
  splitTitle: string;
  splitDescription: string | null;
  splitImageUrl?: string | null;
  splitImageAlt?: string;
  imageRight?: boolean;
}

export function TwoColumnSection({
  splitTitle,
  splitDescription,
  splitImageUrl,
  splitImageAlt,
  imageRight = false,
}: TwoColumnSectionProps) {
  const imageCol = splitImageUrl ? (
    <div className="relative w-full h-72 sm:h-80 md:h-96 lg:h-full min-h-[360px] rounded-2xl overflow-hidden shadow-lg">
      <Image
        src={splitImageUrl}
        alt={splitImageAlt ?? splitTitle}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
        quality={85}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-secondary/30 to-transparent pointer-events-none" />
    </div>
  ) : null;

  const textCol = (
    <div className="flex flex-col justify-center gap-5">
      <span className="block w-12 h-1 rounded-full bg-primary" />
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-extrabold text-foreground leading-tight">
        {splitTitle}
      </h2>
      {splitDescription && (
        <div className="space-y-1 text-base md:text-[1.0rem]">
          <p className="text-foreground/80 leading-relaxed">{splitDescription}</p>
        </div>
      )}
    </div>
  );

  return (
    <section className="py-16 md:py-24 bg-background">
      <Container>
        {imageCol ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {imageRight ? <>{textCol}{imageCol}</> : <>{imageCol}{textCol}</>}
          </div>
        ) : (
          <div className="max-w-3xl">{textCol}</div>
        )}
      </Container>
    </section>
  );
}
