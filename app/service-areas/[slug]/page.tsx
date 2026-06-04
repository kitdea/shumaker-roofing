export const revalidate = 3600;

import { notFound } from "next/navigation";
import Link from "next/link";
import { cache } from "react";
import { MapPin, Phone, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { fetchLocation, fetchAllLocations } from "@/lib/contentful";
import type { ContentfulLocation } from "@/types/contentful";
import { WhyChooseUs } from "@/components/shared/why-choose-us";
import { TwoColumnSection } from "@/components/shared/two-column-section";
import { slugify, toHttpsUrl, SITE_URL } from "@/lib/utils";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { INLINES } from "@contentful/rich-text-types";
import type { Options } from "@contentful/rich-text-react-renderer";
import type { Hyperlink } from "@contentful/rich-text-types";
import { fetchPageSeo } from "@/lib/seo";

const SITE_DOMAIN = "shumakerroofing.com";

const OFFICES = {
  MD: {
    streetAddress: "26 Water St",
    addressLocality: "Frederick",
    addressRegion: "MD",
    postalCode: "21701",
    telephone: "+1-301-662-0533",
  },
  MD_WEST: {
    streetAddress: "6 W Washington St Suite 208",
    addressLocality: "Hagerstown",
    addressRegion: "MD",
    postalCode: "21740",
    telephone: "+1-301-662-0533",
  },
  VA: {
    streetAddress: "12001 Sunrise Valley Dr",
    addressLocality: "Reston",
    addressRegion: "VA",
    postalCode: "20191",
    telephone: "+1-301-662-0533",
  },
} as const;

const WESTERN_MD_CITIES = new Set([
  "hagerstown", "boonsboro", "smithsburg", "williamsport",
  "funkstown", "hancock", "clear spring", "sharpsburg",
  "keedysville", "thurmont", "waynesboro",
]);

function getOffice(state: string, cityName: string) {
  if (state === "VA") return OFFICES.VA;
  if (state === "MD" && WESTERN_MD_CITIES.has(cityName.toLowerCase())) return OFFICES.MD_WEST;
  return OFFICES.MD;
}

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

function buildLocationSchema(
  fields: ContentfulLocation["fields"],
  cityDisplay: string,
  slug: string,
) {
  const pageUrl = `${SITE_URL}/service-areas/${slug}`;
  const lbId = `${pageUrl}/#localbusiness`;
  const faqId = `${pageUrl}/#faq`;
  const servicesId = `${pageUrl}/#services`;

  const office = getOffice(fields.state, fields.cityName);

  const localBusiness: Record<string, unknown> = {
    "@type": "LocalBusiness",
    "@id": lbId,
    "name": "Shumaker Roofing Company",
    "url": pageUrl,
    "telephone": office.telephone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": office.streetAddress,
      "addressLocality": office.addressLocality,
      "addressRegion": office.addressRegion,
      "postalCode": office.postalCode,
      "addressCountry": "US",
    },
    "serviceArea": {
      "@type": "City",
      "name": cityDisplay,
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "07:00",
        "closes": "18:00",
      },
    ],
    "priceRange": "$$",
    "description":
      fields.metaDescription ||
      `Expert roofing services in ${cityDisplay}, ${fields.state}. Contact Shumaker Roofing for a free estimate.`,
    "mainEntity": { "@id": faqId },
  };

  if (fields.latitude != null && fields.longitude != null) {
    localBusiness["geo"] = {
      "@type": "GeoCoordinates",
      "latitude": fields.latitude,
      "longitude": fields.longitude,
    };
  }

  if ((fields.servicesOffered?.length ?? 0) > 0) {
    localBusiness["hasOfferCatalog"] = { "@id": servicesId };
  }

  const faqMainEntity =
    fields.faqItems?.length
      ? fields.faqItems.map((faq) => ({
          "@type": "Question",
          "name": faq.fields.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.fields.answer },
        }))
      : [
          {
            "@type": "Question",
            "name": `Do you provide roofing services in ${cityDisplay}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Yes, ${cityDisplay} is one of our primary service areas. We provide residential and commercial roofing services throughout ${cityDisplay}, ${fields.state}.`,
            },
          },
          {
            "@type": "Question",
            "name": `What roofing services do you offer in ${cityDisplay}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `We offer residential roofing, commercial roofing, roof repair, storm damage repair, gutters, and roof inspections in ${cityDisplay}.`,
            },
          },
          {
            "@type": "Question",
            "name": `How do I get a free roofing estimate in ${cityDisplay}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Call us at +1-301-662-0533 or fill out our contact form at shumakerroofing.com/contact to schedule a free estimate in ${cityDisplay}.`,
            },
          },
        ];

  const faqPage = {
    "@type": "FAQPage",
    "@id": faqId,
    "mainEntity": faqMainEntity,
  };

  const graph: unknown[] = [localBusiness, faqPage];

  if ((fields.servicesOffered?.length ?? 0) > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": servicesId,
      "name": `Roofing Services in ${cityDisplay}`,
      "itemListElement": fields.servicesOffered.map((svc, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": svc.fields.title,
        "url": `${SITE_URL}/services/${slugify(svc.fields.title)}`,
      })),
    });
  }

  const ratedTestimonials = (fields.localTestimonials ?? []).filter(
    (t) => typeof t.fields.rating === "number",
  );
  if (ratedTestimonials.length > 0) {
    const avg =
      ratedTestimonials.reduce((sum, t) => sum + t.fields.rating, 0) /
      ratedTestimonials.length;
    localBusiness["aggregateRating"] = {
      "@type": "AggregateRating",
      "ratingValue": Math.round(avg * 10) / 10,
      "reviewCount": ratedTestimonials.length,
      "bestRating": 5,
      "worstRating": 1,
    };
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

const getLocation = cache((slug: string) => fetchLocation(slug));

export async function generateStaticParams() {
  const locations = await fetchAllLocations();
  return locations.map((loc) => ({ slug: loc.fields.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loc = await getLocation(slug);
  if (!loc) return { title: "Location Not Found - Shumaker Roofing" };

  return fetchPageSeo({
    entryFields: loc.fields,
    fallbackTitle:
      loc.fields.seoTitle ||
      `Roofing Services in ${loc.fields.fullLocationName || loc.fields.cityName} | Shumaker Roofing`,
    fallbackDesc:
      loc.fields.metaDescription ||
      `Shumaker Roofing provides expert roofing services in ${loc.fields.fullLocationName || loc.fields.cityName}, ${loc.fields.state}. Contact us for a free estimate.`,
    canonicalPath: `/service-areas/${slug}`,
  });
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loc = await getLocation(slug);

  if (!loc) notFound();

  const { fields } = loc;
  const cityDisplay = fields.fullLocationName || fields.cityName;

  const twoColumnData = (fields.twoColumn ?? []).map((item) => {
    const f = item.fields;
    const firstImage = Array.isArray(f.splitImage) ? f.splitImage[0] : f.splitImage;
    const rawUrl: string | undefined = firstImage?.fields?.file?.url;
    const imageUrl = toHttpsUrl(rawUrl) ?? null;
    const altText = firstImage?.fields?.title ?? f.splitTitle ?? cityDisplay;
    return { id: item.sys.id, splitTitle: f.splitTitle ?? "", splitDescription: f.splitDescription ?? null, imageUrl, altText };
  }).filter((s) => s.imageUrl !== null) as Array<{ id: string; splitTitle: string; splitDescription: unknown; imageUrl: string; altText: string }>;

  const locationSchema = buildLocationSchema(fields, cityDisplay, slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />
    <div className="flex flex-col w-full pb-24">
      {/* Hero */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex flex-col justify-end pb-16 bg-secondary">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-slate-900/75 absolute inset-0 z-10" />
        </div>
        <Container className="relative z-20">
          <Link
            href="/service-areas"
            className="inline-flex items-center text-primary/90 hover:text-primary transition-colors mb-6 font-medium text-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> All Service Areas
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary/20 text-white border border-primary/30 text-xs font-bold uppercase py-1.5 px-3 rounded-md inline-flex items-center gap-1.5 backdrop-blur-sm shadow-sm">
              <MapPin className="h-3 w-3" />
              {fields.state}
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-2 max-w-4xl leading-tight">
            {fields.heroHeadline || `Roofing Services in ${cityDisplay}`}
          </h1>
        </Container>
      </section>

      <Container className="mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-8 space-y-12">
            {/* Intro text */}
            {fields.introText && (
              <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-p:text-foreground/90 [&_h2]:text-[1.8rem] [&_h2]:font-extrabold [&_h2]:mt-0 [&_h2]:mb-4 [&_h3]:text-[1.4rem] [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:mb-2 [&_p]:mb-6 [&_p]:leading-relaxed">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {documentToReactComponents(fields.introText as any, richTextOptions)}
              </div>
            )}

            {/* Services offered */}
            {(fields.servicesOffered?.length ?? 0) > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-6">
                  Services Available in {cityDisplay}
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fields.servicesOffered.map((svc) => (
                    <li key={svc.sys.id} className="flex items-center gap-3 text-foreground/80">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <Link
                        href={`/services/${slugify(svc.fields.title)}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {svc.fields.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQ */}
            {(fields.faqItems?.length ?? 0) > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  {fields.faqItems!.map((faq) => (
                    <div key={faq.sys.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {faq.fields.question}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed">{faq.fields.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonials */}
            {(fields.localTestimonials?.length ?? 0) > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-6">
                  What {cityDisplay} Customers Say
                </h2>
                <div className="space-y-6">
                  {fields.localTestimonials!.map((t) => (
                    <blockquote
                      key={t.sys.id}
                      className="bg-muted/50 border border-border rounded-xl p-6"
                    >
                      <p className="text-foreground/80 italic leading-relaxed mb-4">
                        &ldquo;{t.fields.quote}&rdquo;
                      </p>
                      <footer className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-foreground">
                          {t.fields.customerName}
                        </span>
                        {t.fields.rating && (
                          <span className="text-primary font-medium">
                            {"★".repeat(t.fields.rating)}
                          </span>
                        )}
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* CTA card */}
            <div className="bg-primary text-primary-foreground p-8 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -top-8 opacity-10 blur-xl">
                <div className="w-40 h-40 bg-white rounded-full" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-4 text-white relative z-10">
                Serving {cityDisplay}
              </h3>
              <p className="text-white/90 mb-8 text-sm relative z-10 leading-relaxed">
                Our team is ready to help with all your roofing needs in{" "}
                {cityDisplay}, {fields.state}. Get your free estimate today.
              </p>
              {fields.phoneNumber && (
                <a
                  href={`tel:${fields.phoneNumber.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 text-white font-semibold mb-6 relative z-10 hover:text-white/80 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {fields.phoneNumber}
                </a>
              )}
              <Button
                variant="secondary"
                size="lg"
                className="w-full font-bold text-primary hover:bg-white relative z-10 shadow-md"
                asChild
              >
                <Link href="/contact">Get a Free Quote</Link>
              </Button>
            </div>

            <WhyChooseUs />

            {/* Location info */}
            <div className="bg-muted/50 p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-heading font-bold mb-4">Location Details</h3>
              <div className="flex items-start gap-3 text-sm text-foreground/70">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>
                  {cityDisplay}, {fields.state}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </Container>

      {twoColumnData.length > 0 && (
        <div className="divide-y divide-border">
          {twoColumnData.map((section, idx) => (
            <TwoColumnSection
              key={section.id}
              splitTitle={section.splitTitle}
              splitDescription={section.splitDescription as Parameters<typeof TwoColumnSection>[0]["splitDescription"]}
              splitImageUrl={section.imageUrl}
              splitImageAlt={section.altText}
              imageRight={idx % 2 !== 0}
            />
          ))}
        </div>
      )}
    </div>
    </>
  );
}
