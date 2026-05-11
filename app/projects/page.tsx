export const revalidate = 3600;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, MessageSquare } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { ProjectMap } from "./project-map";

export const metadata: Metadata = {
  title: { absolute: "Our Projects | Shumaker Roofing Company" },
  description:
    "Explore Shumaker Roofing's completed projects across Maryland, Virginia, West Virginia, and Pennsylvania. See our roofing work on an interactive map.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Our Projects | Shumaker Roofing Company",
    description:
      "Explore Shumaker Roofing's completed projects across Maryland, Virginia, West Virginia, and Pennsylvania. See our roofing work on an interactive map.",
    url: "/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Projects | Shumaker Roofing Company",
    description:
      "Explore Shumaker Roofing's completed projects across Maryland, Virginia, West Virginia, and Pennsylvania. See our roofing work on an interactive map.",
  },
};

const projectsSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Shumaker Roofing Projects",
  description:
    "A map of completed roofing projects by Shumaker Roofing Company across the Mid-Atlantic region.",
  url: "https://www.shumakerroofing.com/projects",
  provider: {
    "@type": "LocalBusiness",
    name: "Shumaker Roofing Company",
    url: "https://www.shumakerroofing.com",
  },
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsSchema) }}
      />

      {/* Page Header */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/70" />
          <Image
            src="https://images.unsplash.com/photo-1632823471565-1ecdf5c6da11?q=80&w=2070&auto=format&fit=crop"
            alt="Shumaker Roofing completed projects"
            fill
            className="object-cover opacity-50 mix-blend-overlay"
            priority
          />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
            Our Projects
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Browse our completed roofing projects across Maryland, Virginia, West Virginia,
            and Pennsylvania on an interactive map.
          </p>
        </Container>
      </section>

      {/* Map Section */}
      <section className="py-24">
        <Container>
          <SectionHeader
            title="Projects Across the Region"
            subtitle="Our Work"
            align="center"
          />
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Each pin on the map represents a roofing project we&apos;ve completed for homeowners
            and businesses throughout the Mid-Atlantic. Click any pin to learn more about
            that job.
          </p>
          <ProjectMap />
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-500">
        <Container className="text-center">
          <p className="uppercase text-primary font-semibold text-sm tracking-widest mb-3">
            Ready to Get Started?
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-4">
            Let&apos;s Add Your Project to the Map
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-10">
            Contact our team today for a free estimate and join hundreds of satisfied
            customers across the region.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full gap-2 px-8" asChild>
              <a href="tel:+13016620533">
                <Phone className="h-4 w-4" />
                <span className="font-semibold">Call Us Now</span>
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full gap-2 px-8 border-white/30 hover:bg-white/10"
              asChild
            >
              <Link href="/contact">
                <MessageSquare className="h-4 w-4" />
                <span className="font-semibold">Get a Free Estimate</span>
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
