export const revalidate = 3600;

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchServiceBySlug, mapSplitSections } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity-image";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import { fetchPageSeo } from "@/lib/seo";
import { TwoColumnSection } from "@/components/shared/two-column-section";
import { WhyChooseUs } from "@/components/shared/why-choose-us";
import { SITE_URL } from "@/lib/utils";
import { VeluxWidget } from "@/components/shared/velux-widget";
import { PortableTextTable } from "@/components/shared/portable-text-table";
import { portableTextLinkMark } from "@/components/shared/portable-text-link";

const portableTextComponents: PortableTextComponents = {
  marks: {
    link: portableTextLinkMark,
  },
  types: {
    table: ({ value }) => <PortableTextTable rows={value?.rows} />,
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug);
  if (!service) return { title: "Service Not Found - Shumaker Roofing Company" };

  const serviceTitle = service.title as string | undefined;
  const fallbackTitle = serviceTitle
    ? `${serviceTitle} Services | Shumaker Roofing Company`
    : "Roofing Services | Shumaker Roofing Company";
  const fallbackDesc = serviceTitle
    ? `Learn more about our ${serviceTitle.toLowerCase()} services. Expert roofing solutions provided by Shumaker Roofing professionals.`
    : "Expert roofing solutions provided by Shumaker Roofing professionals.";

  return fetchPageSeo({
    entryFields: service,
    fallbackTitle,
    fallbackDesc,
    fallbackImage: urlFor(service.servicesImage),
    canonicalPath: `/services/${slug}`,
  });
}


export default async function ServiceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const twoColumnData = mapSplitSections(service.splitSections);

  const additionalContent = service.additionalContent ?? null;
  const imageUrl = urlFor(service.servicesImage) ?? null;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title as string,
    "description": `Expert ${((service.title as string) ?? "roofing").toLowerCase()} services provided by Shumaker Roofing Company. Professional, licensed roofing contractors serving Maryland, Virginia, Pennsylvania, and West Virginia.`,
    "image": imageUrl,
    "url": `${SITE_URL}/services/${slug}`,
    "serviceType": service.title as string,
    "provider": {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#organization`,
      "name": "Shumaker Roofing Company",
      "url": SITE_URL,
      "telephone": "+1-301-662-0533",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "26 Water St.",
        "addressLocality": "Frederick",
        "addressRegion": "MD",
        "postalCode": "21701",
        "addressCountry": "US",
      },
    },
    "areaServed": [
      { "@type": "State", "name": "Maryland" },
      { "@type": "State", "name": "Virginia" },
      { "@type": "State", "name": "Pennsylvania" },
      { "@type": "State", "name": "West Virginia" },
    ],
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    <div className="flex flex-col w-full pb-24">
      {/* Article Header */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex flex-col justify-end pb-16 bg-secondary">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-slate-900/75 absolute inset-0 z-10" />
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={`${service.title || "Shumaker Roofing Service"} - Banner Image`}
              fill
              sizes="100vw"
              quality={85}
              className="object-cover opacity-60 mix-blend-overlay z-0"
              priority
            />
          )}
        </div>
        <Container className="relative z-20">
          <Link href="/services" className="inline-flex items-center text-primary/90 hover:text-primary transition-colors mb-6 font-medium text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Services
          </Link>
          <div className="flex gap-2 flex-wrap mb-4">
            <div className="bg-primary/20 text-white border border-primary/30 text-xs font-bold uppercase py-1.5 px-3 rounded-md inline-block backdrop-blur-sm shadow-sm">
              Service
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4 max-w-4xl leading-tight">
            {service.title}
          </h1>
        </Container>
      </section>

      <Container className="mt-16">
        <article className="prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-p:text-foreground/90 [&_h2]:text-[1.8rem] [&_h2]:font-extrabold [&_h2]:mt-0 [&_h2]:mb-4 [&_h3]:text-[1.4rem] [&_h3]:font-bold [&_h3]:mt-0 [&_h3]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:mb-2 [&_p]:mb-6 [&_p]:leading-relaxed">
          {service.servicesContent && (
            <PortableText value={service.servicesContent} components={portableTextComponents} />
          )}
          {additionalContent && (
            <PortableText value={additionalContent} components={portableTextComponents} />
          )}
        </article>
      </Container>

      {/* VELUX Widget — Skylight Installation only */}
      {slug === "skylight-installation" && (
        <Container className="mt-16">
          <VeluxWidget />
        </Container>
      )}

      {/* Two-Column Sections */}
      {twoColumnData.length > 0 && (
        <div className="divide-y divide-border">
          {twoColumnData.map((section, idx) => (
            <TwoColumnSection
              key={section.id}
              splitTitle={section.splitTitle}
              splitDescription={section.splitDescription}
              splitImageUrl={section.imageUrl}
              imageRight={idx % 2 !== 0}
            />
          ))}
        </div>
      )}

      {/* CTA + Why Choose Us */}
      <Container className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-primary text-primary-foreground p-8 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-8 opacity-10 blur-xl">
              <div className="w-40 h-40 bg-white rounded-full"></div>
            </div>
            <h3 className="text-xl font-heading font-bold mb-4 text-white relative z-10">Need Roofing Help?</h3>
            <p className="text-primary-foreground/90 mb-8 text-sm text-white/90 relative z-10 leading-relaxed">
              If you are dealing with roofing issues or want to learn more about our <strong>{service.title}</strong> service, our expert team is ready to provide top-notch service and a free estimate.
            </p>
            <Button variant="secondary" size="lg" className="w-full uppercase font-bold text-primary hover:bg-white relative z-10 shadow-md" asChild>
              <Link href="/contact">Get a Free Estimate</Link>
            </Button>
          </div>

          <WhyChooseUs />
        </div>
      </Container>
    </div>
    </>
  );
}
