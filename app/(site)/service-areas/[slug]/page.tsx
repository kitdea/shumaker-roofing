export const revalidate = 3600;

import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Phone, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { fetchLocationBySlug, fetchAllLocations, fetchServiceSlugs, type LocationDetail } from "@/lib/sanity";
import { WhyChooseUs } from "@/components/shared/why-choose-us";
import { slugify, SITE_URL, stateDisplayName } from "@/lib/utils";
import { fetchPageSeo } from "@/lib/seo";
import { urlFor } from "@/lib/sanity-image";

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

function buildLocationSchema(loc: LocationDetail, cityDisplay: string, slug: string, serviceSlugByTitle: Map<string, string>) {
  const pageUrl = `${SITE_URL}/service-areas/${slug}`;
  const lbId = `${pageUrl}/#localbusiness`;
  const faqId = `${pageUrl}/#faq`;
  const servicesId = `${pageUrl}/#services`;

  const office = getOffice(loc.state ?? "MD", loc.cityName ?? "");
  const servicesOffered = loc.servicesOffered ?? [];
  const faqItems = (loc.faqItems ?? []).filter((f) => f.question && f.answer);

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
      loc.seo?.seoDescription ||
      `Expert roofing services in ${cityDisplay}, ${loc.state}. Contact Shumaker Roofing for a free estimate.`,
  };

  if (loc.latitude != null && loc.longitude != null) {
    localBusiness["geo"] = {
      "@type": "GeoCoordinates",
      "latitude": loc.latitude,
      "longitude": loc.longitude,
    };
  }

  if (servicesOffered.length > 0) {
    localBusiness["hasOfferCatalog"] = { "@id": servicesId };
  }

  const faqMainEntity = faqItems.length
    ? faqItems.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
      }))
    : [
        {
          "@type": "Question",
          "name": `Do you provide roofing services in ${cityDisplay}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Yes, ${cityDisplay} is one of our primary service areas. We provide residential and commercial roofing services throughout ${cityDisplay}, ${loc.state}.`,
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

  if (servicesOffered.length > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": servicesId,
      "name": `Roofing Services in ${cityDisplay}`,
      "itemListElement": servicesOffered.map((svc, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": svc,
        "url": `${SITE_URL}/services/${serviceSlugByTitle.get(svc) ?? slugify(svc)}`,
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

export async function generateStaticParams() {
  const locations = await fetchAllLocations();
  return locations.filter((loc) => loc.slug).map((loc) => ({ slug: loc.slug as string }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loc = await fetchLocationBySlug(slug);
  if (!loc) return { title: "Location Not Found - Shumaker Roofing" };

  const cityDisplay = loc.fullLocationName || loc.cityName || "";

  return fetchPageSeo({
    entryFields: loc,
    fallbackTitle: `Roofing Services in ${cityDisplay} | Shumaker Roofing`,
    fallbackDesc: `Shumaker Roofing provides expert roofing services in ${cityDisplay}, ${loc.state}. Contact us for a free estimate.`,
    canonicalPath: `/service-areas/${slug}`,
  });
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [loc, servicesList] = await Promise.all([
    fetchLocationBySlug(slug),
    fetchServiceSlugs(),
  ]);

  if (!loc) notFound();

  const serviceSlugByTitle = new Map(
    servicesList
      .filter((s) => s.title && s.slug?.current)
      .map((s) => [s.title as string, s.slug!.current as string])
  );

  const cityDisplay = loc.fullLocationName || loc.cityName || "";
  const servicesOffered = loc.servicesOffered ?? [];
  const faqItems = (loc.faqItems ?? []).filter(
    (f): f is { question: string; answer: string } => Boolean(f.question && f.answer)
  );

  const locationSchema = buildLocationSchema(loc, cityDisplay, slug, serviceSlugByTitle);

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
          {loc.seo?.featuredImage ? (
            <Image
              src={urlFor(loc.seo.featuredImage) ?? ""}
              alt={cityDisplay}
              fill
              priority
              className="object-cover"
            />
          ) : null}
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
              {stateDisplayName(loc.state ?? "")}
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-2 max-w-4xl leading-tight">
            {loc.heroHeadline || `Roofing Services in ${cityDisplay}`}
          </h1>
        </Container>
      </section>

      <Container className="mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-8 space-y-12">
            {/* Intro text */}
            {loc.introText && (
              <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-p:text-foreground/90 [&_p]:mb-6 [&_p]:leading-relaxed">
                {loc.introText.split("\n").filter(Boolean).map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            )}

            {/* Services offered */}
            {servicesOffered.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-6">
                  Services Available in {cityDisplay}
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {servicesOffered.map((svc) => (
                    <li key={svc} className="flex items-center gap-3 text-foreground/80">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <Link
                        href={`/services/${serviceSlugByTitle.get(svc) ?? slugify(svc)}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {svc}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQ */}
            {faqItems.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  {faqItems.map((faq, idx) => (
                    <div key={idx} className="border-b border-border pb-6 last:border-0 last:pb-0">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed">{faq.answer}</p>
                    </div>
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
                {cityDisplay}, {stateDisplayName(loc.state ?? "")}. Get your free estimate today.
              </p>
              {loc.phoneNumber && (
                <a
                  href={`tel:${loc.phoneNumber.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 text-white font-semibold mb-6 relative z-10 hover:text-white/80 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {loc.phoneNumber}
                </a>
              )}
              <Button
                variant="secondary"
                size="lg"
                className="w-full uppercase font-bold text-primary hover:bg-white relative z-10 shadow-md"
                asChild
              >
                <Link href="/contact">Get a Free Estimate</Link>
              </Button>
            </div>

            <WhyChooseUs />

            {/* Location info */}
            <div className="bg-muted/50 p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-heading font-bold mb-4">Location Details</h3>
              <div className="flex items-start gap-3 text-sm text-foreground/70">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>
                  {cityDisplay}, {stateDisplayName(loc.state ?? "")}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
    </>
  );
}
