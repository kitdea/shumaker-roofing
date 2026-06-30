export const revalidate = 3600;

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchServicesForListing, type ServiceListItem } from "@/lib/sanity";
import { CertificationsSection } from "@/components/shared/certifications-section";
import { getServiceIcon, SITE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: "Professional Roofing Services | Shumaker Roofing Company" },
  description:
    "Explore our comprehensive roofing services including residential roofing, commercial roofing, roof repairs, storm damage restoration, and roof inspections.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Professional Roofing Services | Shumaker Roofing Company",
    description:
      "Explore our comprehensive roofing services including residential roofing, commercial roofing, roof repairs, storm damage restoration, and roof inspections.",
    url: "/services",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Roofing Services | Shumaker Roofing Company",
    description:
      "Explore our comprehensive roofing services including residential roofing, commercial roofing, roof repairs, storm damage restoration, and roof inspections.",
  },
};

const servicesPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": SITE_URL + "/services#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL + "/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": SITE_URL + "/services" },
      ],
    },
    {
      "@type": "WebPage",
      "@id": SITE_URL + "/services#webpage",
      "url": SITE_URL + "/services",
      "name": "Professional Roofing Services | Shumaker Roofing Company",
      "description":
        "Explore our comprehensive roofing services including residential roofing, commercial roofing, roof repairs, storm damage restoration, and roof inspections.",
      "isPartOf": { "@id": SITE_URL + "/#website" },
      "breadcrumb": { "@id": SITE_URL + "/services#breadcrumb" },
      "publisher": {
        "@type": "Organization",
        "@id": SITE_URL + "/#organization",
        "name": "Shumaker Roofing Company",
      },
    },
  ],
};

// Async data component streamed after the hero is painted
async function ServicesGrid() {
  let services: ServiceListItem[] = [];
  try {
    const items = await fetchServicesForListing();
    services = [...items].sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
  } catch (e) {
    console.error("Sanity fetch error:", e);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
      {services.map((service) => {
        const title = service.title as string;
        const urlSlug = service.slug?.current ?? service._id;
        const descText = ((service.excerpt as string) || "").trim().substring(0, 300);

        const Icon = getServiceIcon(title || "");

        return (
          <Link href={"/services/" + urlSlug} key={service._id} className="block group h-full">
            <Card className="border-border/50 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col h-full">
              <div className="h-2 w-full bg-primary/20 group-hover:bg-primary transition-colors shrink-0" />
              <CardContent className="p-8 pt-8 flex-1 flex flex-col">
                <div className="bg-primary/10 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shrink-0">
                  <Icon className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">{title}</h2>
                <p className="text-foreground/70 mb-6 line-clamp-4 flex-1">
                  {descText || "Learn more about our professional roofing services."}
                </p>
                <div className="mt-auto pt-6 border-t border-border flex items-center text-primary font-semibold text-sm">
                  Read More <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

function ServicesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/50 shadow-md overflow-hidden flex flex-col h-64 animate-pulse">
          <div className="h-2 w-full bg-primary/20 shrink-0" />
          <div className="p-8 flex-1 flex flex-col gap-4">
            <div className="w-16 h-16 rounded-2xl bg-muted" />
            <div className="h-6 w-3/4 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}


// Page is NOT async so hero flushes immediately without waiting for Sanity
export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesPageSchema) }}
      />
      <div className="flex flex-col w-full">
        <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-slate-900/70 absolute inset-0 z-10" />
            <Image
              src="https://cdn.sanity.io/images/rg9pahe7/production/6f190d658c389af55504e6ff5498d4f83bb923d4-2052x1540.jpg"
              alt="Professional roofing contractors at work on a residential roof"
              fill
              sizes="100vw"
              quality={75}
              className="object-cover opacity-50 mix-blend-overlay z-0"
              priority
            />
          </div>
          <Container className="relative z-20 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
              Our Roofing Services
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Comprehensive roofing solutions designed to protect your investment and
              enhance your property value for years to come.
            </p>
          </Container>
        </section>

        <section className="py-24">
          <Container>
            <SectionHeader title="What We Can Do For You" subtitle="Expertise" align="center" />
            <Suspense fallback={<ServicesGridSkeleton />}>
              <ServicesGrid />
            </Suspense>
          </Container>
        </section>

        {/* Certifications & Trust Badges */}
        <CertificationsSection />

        <section className="py-20 bg-muted/50 border-t border-border">
          <Container className="text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Need a Custom Roofing Solution?
            </h2>
            <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
              If you have a unique project or require an emergency repair, do not hesitate
              to reach out. We are here to help 24/7.
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
