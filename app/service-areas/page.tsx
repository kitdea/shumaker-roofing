export const revalidate = 3600;

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchAllLocations } from "@/lib/contentful";

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

export default async function ServiceAreasPage() {
  const locations = await fetchAllLocations();

  // Group by state
  const byState = locations.reduce<Record<string, typeof locations>>((acc, loc) => {
    const state = loc.fields.state || "Other";
    if (!acc[state]) acc[state] = [];
    acc[state].push(loc);
    return acc;
  }, {});

  const states = Object.keys(byState).sort();

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/70 absolute inset-0 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
            alt="Aerial view of a neighborhood Shumaker Roofing serves"
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
                <SectionHeader title={state} subtitle="Serving" align="left" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {byState[state].map((loc) => (
                    <Link
                      key={loc.sys.id}
                      href={`/service-areas/${loc.fields.slug}`}
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
                              {loc.fields.fullLocationName || loc.fields.cityName}
                            </h2>
                            <p className="text-sm text-foreground/60 mt-0.5">{loc.fields.state}</p>
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

      {/* CTA */}
      <section className="py-20 bg-muted/50 border-t border-border">
        <Container className="text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Don&apos;t See Your City?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            We may still be able to help. Contact us and let&apos;s talk about your roofing needs.
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">Get a Free Quote</Link>
          </Button>
        </Container>
      </section>
    </div>
  );
}
