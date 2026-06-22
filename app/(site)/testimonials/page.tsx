export const revalidate = 3600;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, MessageSquare } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { ReviewWidget } from "@/components/shared/review-widget";
import { CertificationsSection } from "@/components/shared/certifications-section";

export const metadata: Metadata = {
  title: { absolute: "Customer Testimonials | Shumaker Roofing Company" },
  description:
    "Read real reviews from satisfied Shumaker Roofing customers across Maryland, Virginia, West Virginia, and Pennsylvania. See why homeowners trust us for over 70 years.",
  alternates: { canonical: "/testimonials" },
  openGraph: {
    title: "Customer Testimonials | Shumaker Roofing Company",
    description:
      "Read real reviews from satisfied Shumaker Roofing customers across Maryland, Virginia, West Virginia, and Pennsylvania. See why homeowners trust us for over 70 years.",
    url: "/testimonials",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Customer Testimonials | Shumaker Roofing Company",
    description:
      "Read real reviews from satisfied Shumaker Roofing customers across Maryland, Virginia, West Virginia, and Pennsylvania. See why homeowners trust us for over 70 years.",
  },
};

export default async function TestimonialsPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/70" />
          <Image
            src="https://cdn.sanity.io/images/rg9pahe7/production/6f190d658c389af55504e6ff5498d4f83bb923d4-2052x1540.jpg"
            alt="Happy homeowners after roofing project"
            fill
            sizes="100vw"
            className="object-cover opacity-50 mix-blend-overlay"
            priority
          />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
            Customer Testimonials
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Real reviews from real homeowners and business owners across the Mid-Atlantic region.
          </p>
        </Container>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-secondary text-white border-t border-white/10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "75+", label: "Years in Business" },
              { value: "4.9", label: "Average Rating" },
              { value: "5,000+", label: "Roofs Installed" },
              { value: "4 States", label: "Service Area" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-heading font-extrabold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Reviews Widget */}
      <section className="py-24">
        <Container>
          <SectionHeader
            title="What Our Customers Are Saying"
            subtitle="Testimonials"
            align="center"
          />
          <ReviewWidget />
        </Container>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-muted/30">
        <Container>
          <SectionHeader
            title="Why Homeowners Trust Shumaker"
            subtitle="Our Promise"
            align="center"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "CertainTeed 5-Star",
                desc: "Select ShingleMaster certified since 1998 — one of the highest manufacturer designations available.",
              },
              {
                title: "Fully Licensed & Insured",
                desc: "Licensed in MD, VA, PA, and WV. We carry full liability and workers' compensation coverage on every job.",
              },
              {
                title: "10-Year Craftsmanship Warranty",
                desc: "Every installation comes backed by our standard 10-year workmanship warranty — no exceptions.",
              },
              {
                title: "Free Estimates",
                desc: "No-obligation inspections and detailed written estimates so you always know exactly what you're paying for.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-background border border-border/50 rounded-2xl p-6 shadow-md text-center"
              >
                <h3 className="font-heading font-bold text-foreground text-lg mb-2">{item.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Certifications & Trust Badges */}
      <CertificationsSection />

      {/* CTA */}
      <section className="py-24 bg-slate-500">
        <Container className="text-center">
          <p className="uppercase text-primary font-semibold text-sm tracking-widest mb-3">
            Ready to Experience the Difference?
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-4">
            Join Thousands of Satisfied Customers
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-10">
            Contact us today for a free, no-obligation estimate. See for yourself why Shumaker Roofing has earned the trust of homeowners for over 70 years.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full gap-2 px-8" asChild>
              <a href="tel:+13016620533">
                <Phone className="h-4 w-4" />
                <span className="uppercase font-bold">Call Us Now</span>
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full gap-2 px-8 border-white/30 hover:bg-white/10"
              asChild
            >
              <Link href="/contact">               
                <span className="uppercase font-bold">Get a Free Estimate</span>
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
