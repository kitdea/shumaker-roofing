export const revalidate = 3600;

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchAllLocations, type LocationListItem } from "@/lib/sanity";
import { CertificationsSection } from "@/components/shared/certifications-section";
import { SITE_URL, stateDisplayName } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: "Licensed Roofing Service Areas | Shumaker Roofing Company" },
  description:
    "Shumaker Roofing Company proudly serves homeowners and businesses across the region. Find your city and learn how we can help with all your roofing needs.",
  alternates: { canonical: "/service-areas" },
  openGraph: {
    title: "Licensed Roofing Service Areas | Shumaker Roofing Company",
    description:
      "Shumaker Roofing Company proudly serves homeowners and businesses across the region. Find your city and learn how we can help with all your roofing needs.",
    url: "/service-areas",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Licensed Roofing Service Areas | Shumaker Roofing Company",
    description:
      "Shumaker Roofing Company proudly serves homeowners and businesses across the region. Find your city and learn how we can help with all your roofing needs.",
  },
};

const serviceAreasPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": SITE_URL + "/service-areas#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL + "/" },
        { "@type": "ListItem", "position": 2, "name": "Service Areas", "item": SITE_URL + "/service-areas" },
      ],
    },
    {
      "@type": "WebPage",
      "@id": SITE_URL + "/service-areas#webpage",
      "url": SITE_URL + "/service-areas",
      "name": "Licensed Roofing Service Areas | Shumaker Roofing Company",
      "description":
        "Shumaker Roofing Company proudly serves homeowners and businesses across the region. Find your city and learn how we can help with all your roofing needs.",
      "isPartOf": { "@id": SITE_URL + "/#website" },
      "breadcrumb": { "@id": SITE_URL + "/service-areas#breadcrumb" },
      "publisher": {
        "@type": "Organization",
        "@id": SITE_URL + "/#organization",
        "name": "Shumaker Roofing Company",
      },
    },
  ],
};

export default async function ServiceAreasPage() {
  const locations = await fetchAllLocations();

  // Group by state
  const byState = locations.reduce<Record<string, LocationListItem[]>>((acc, loc) => {
    const state = loc.state || "Other";
    if (!acc[state]) acc[state] = [];
    acc[state].push(loc);
    return acc;
  }, {});

  const states = Object.keys(byState).sort();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceAreasPageSchema) }}
      />
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/70 absolute inset-0 z-10" />
          <Image
              src="https://cdn.sanity.io/images/rg9pahe7/production/6f190d658c389af55504e6ff5498d4f83bb923d4-2052x1540.jpg"
            alt="Aerial view of a neighborhood roof Shumaker Roofing serves"
            fill
            sizes="100vw"
            quality={85}
            className="object-cover opacity-50 mix-blend-overlay z-0"
            priority
          />
        </div>
        <Container className="relative z-20 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
            Our Service Areas
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Trusted roofing services delivered to homeowners and businesses across the region.
            Find your city below to see how we can help.
          </p>
        </Container>
      </section>

      {/* Locations Grid */}
      <section className="py-24">
        <Container>
          {locations.length === 0 ? (
            <p className="text-center text-foreground/60">No service areas found.</p>
          ) : (
            states.map((state) => (
              <div key={state} className="mb-16 last:mb-0">
                <SectionHeader title={stateDisplayName(state)} subtitle="Serving" align="left" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {byState[state].map((loc) => (
                    <Link
                      key={loc._id}
                      href={`/service-areas/${loc.slug}`}
                      className="block group"
                    >
                      <Card className="border-border/50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                        <div className="h-1.5 w-full bg-primary/20 group-hover:bg-primary transition-colors" />
                        <CardContent className="p-6 flex items-start gap-4">
                          <div className="bg-primary/10 text-primary w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors truncate">
                              {loc.fullLocationName || loc.cityName}
                            </h2>
                            <p className="text-sm text-foreground/60 mt-0.5">{stateDisplayName(loc.state ?? "")}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </Container>
      </section>

      <CertificationsSection />

      {/* CTA */}
      <section className="py-20 bg-muted-foreground border-border">
        <Container className="text-center text-white dark:text-black">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Don&apos;t See Your City?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            We may still be able to help. Contact us and let&apos;s talk about your roofing needs.
          </p>
          <Button className="uppercase font-bold" size="lg" asChild>
            <Link href="/contact">Get a Free Estimate</Link>
          </Button>
        </Container>
      </section>
    </div>
    </>
  );
}
