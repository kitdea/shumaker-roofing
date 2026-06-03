export const revalidate = 3600;

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { Container } from "@/components/shared/container";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { INLINES } from "@contentful/rich-text-types";
import type { Options } from "@contentful/rich-text-react-renderer";
import type { Hyperlink } from "@contentful/rich-text-types";
import { fetchPageSeo } from "@/lib/seo";
import { TwoColumnSection } from "@/components/shared/two-column-section";
import { WhyChooseUs } from "@/components/shared/why-choose-us";
import { slugify, toHttpsUrl, SITE_URL } from "@/lib/utils";
import { VeluxWidget } from "@/components/shared/velux-widget";

const SITE_DOMAIN = "shumakerroofing.com";

const richTextOptions: Options = {
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      const uri = (node as Hyperlink).data.uri as string;
      const isExternal = uri.startsWith("http") && !uri.includes(SITE_DOMAIN);
      return (
        <a
          href={uri}
          target={isExternal ? "_blank" : "_self"}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

const getServiceFromSlug = cache(async function getServiceFromSlug(slug: string) {
  let service = null;

  // Primary: match by title-derived slug
  try {
    const response = await client.getEntries({ content_type: 'services', include: 3 });
    service = response.items.find((item) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const title = (item.fields as any).title as string | undefined;
      return title && slugify(title) === slug;
    }) ?? null;
  } catch {
    // ignore
  }

  // Fallback: match by stored url field
  if (!service) {
    try {
      const response = await client.getEntries({ content_type: 'services', 'fields.url': slug, limit: 1, include: 3 });
      if (response.items.length > 0) {
        service = response.items[0];
      }
    } catch {
      // ignore
    }
  }

  // Fallback: match by sys.id
  if (!service) {
    try {
      const byId = await client.getEntry(slug);
      if (byId && byId.sys.contentType.sys.id === 'services') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        service = byId as any;
      }
    } catch {
      // ignore
    }
  }

  return service;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rawService = await getServiceFromSlug(slug);
  if (!rawService) return { title: "Service Not Found - Shumaker Roofing Company" };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fields = rawService.fields as any;

  const serviceTitle = fields.title as string | undefined;
  const fallbackTitle = serviceTitle
    ? `${serviceTitle} Services | Shumaker Roofing Company`
    : "Roofing Services | Shumaker Roofing Company";
  const fallbackDesc = serviceTitle
    ? `Learn more about our ${serviceTitle.toLowerCase()} services. Expert roofing solutions provided by Shumaker Roofing professionals.`
    : "Expert roofing solutions provided by Shumaker Roofing professionals.";

  const rawImageUrl: string | undefined = fields.servicesImage?.fields?.file?.url;
  const fallbackImage = toHttpsUrl(rawImageUrl);

  return fetchPageSeo({
    entryFields: fields,
    fallbackTitle,
    fallbackDesc,
    fallbackImage,
  });
}


export default async function ServiceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rawService = await getServiceFromSlug(slug);

  if (!rawService) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serviceFields = rawService.fields as any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const splitSections: any[] = Array.isArray(serviceFields.splitSection) ? serviceFields.splitSection : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const twoColumnData = splitSections.filter((item: any) => item?.fields).map((item: any) => {
    const f = item.fields;
    const firstImage = Array.isArray(f.splitImage) ? f.splitImage[0] : f.splitImage;
    const rawUrl: string | undefined = firstImage?.fields?.file?.url;
    const imageUrl = toHttpsUrl(rawUrl) ?? null;
    return {
      id: item.sys.id,
      splitTitle: typeof f.splitTitle === "string" ? f.splitTitle : String(f.splitTitle ?? ""),
      splitDescription: f.splitDescription ?? null,
      imageUrl,
    };
  }).filter((s: { imageUrl: string | null }) => s.imageUrl !== null);

  // additionalContent is a top-level Rich Text field on the service entry itself
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const additionalContent = serviceFields.additionalContent ?? null;

  const imageUrl = toHttpsUrl(serviceFields.servicesImage?.fields?.file?.url)
    ?? "https://images.unsplash.com/photo-1548614606-52b4451f994b?q=80&w=2070&auto=format&fit=crop";

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceFields.title as string,
    "description": `Expert ${((serviceFields.title as string) ?? "roofing").toLowerCase()} services provided by Shumaker Roofing Company. Professional, licensed roofing contractors serving Maryland, Virginia, Pennsylvania, and West Virginia.`,
    "image": imageUrl,
    "url": `${SITE_URL}/services/${slug}`,
    "serviceType": serviceFields.title as string,
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
          <Image
            src={imageUrl}
            alt={`${serviceFields.title || "Shumaker Roofing Service"} - Banner Image`}
            fill
            sizes="100vw"
            quality={85}
            className="object-cover opacity-60 mix-blend-overlay z-0"
            priority
          />
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
            {serviceFields.title}
          </h1>
        </Container>
      </section>

      <Container className="mt-16">
        <article className="prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-p:text-foreground/90 [&_h2]:text-[1.8rem] [&_h2]:font-extrabold [&_h2]:mt-0 [&_h2]:mb-4 [&_h3]:text-[1.4rem] [&_h3]:font-bold [&_h3]:mt-0 [&_h3]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:mb-2 [&_p]:mb-6 [&_p]:leading-relaxed">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {serviceFields.servicesContent ? documentToReactComponents(serviceFields.servicesContent as any, richTextOptions) : null}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {additionalContent ? documentToReactComponents(additionalContent as any, richTextOptions) : null}
        </article>
      </Container>

      {/* VELUX Widget — Skylight Installation only */}
      {slug === "skylight-installation" && (
        <Container className="mt-16">
          <VeluxWidget />
        </Container>
      )}

      {/* Two-Column Sections from Contentful */}
      {twoColumnData.length > 0 && (
        <div className="divide-y divide-border">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {twoColumnData.map((section: any, idx: number) => (
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
              If you are dealing with roofing issues or want to learn more about our <strong>{serviceFields.title}</strong> service, our expert team is ready to provide top-notch service and a free estimate.
            </p>
            <Button variant="secondary" size="lg" className="w-full font-bold text-primary hover:bg-white relative z-10 shadow-md" asChild>
              <Link href="/contact">Get a Free Quote</Link>
            </Button>
          </div>

          <WhyChooseUs />
        </div>
      </Container>
    </div>
    </>
  );
}
