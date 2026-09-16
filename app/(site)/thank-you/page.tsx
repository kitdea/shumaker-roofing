export const revalidate = 3600;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { CertificationsSection } from "@/components/shared/certifications-section";
import {
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  CalendarCheck,
  ClipboardCheck,
  ArrowRight,
  Home,
} from "lucide-react";
import { SITE_URL, FALLBACK_BLOG_IMAGE } from "@/lib/utils";
import { urlFor } from "@/lib/sanity-image";

const HERO_IMAGE_URL =
  "https://cdn.sanity.io/images/rg9pahe7/production/6f190d658c389af55504e6ff5498d4f83bb923d4-2052x1540.jpg";

const TITLE = "Thank You | Shumaker Roofing Company";
const DESCRIPTION =
  "Thanks for reaching out to Shumaker Roofing Company. We've received your request and a member of our team will be in touch shortly.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/thank-you" },
  // Confirmation pages should not be indexed or surfaced in search results.
  robots: { index: false, follow: true, nocache: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/thank-you",
    type: "website",
    images: [{ url: FALLBACK_BLOG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [FALLBACK_BLOG_IMAGE],
  },
};

const thankYouPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": SITE_URL + "/thank-you#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL + "/" },
        { "@type": "ListItem", "position": 2, "name": "Thank You", "item": SITE_URL + "/thank-you" },
      ],
    },
    {
      "@type": "WebPage",
      "@id": SITE_URL + "/thank-you#webpage",
      "url": SITE_URL + "/thank-you",
      "name": "Thank You — Shumaker Roofing Company",
      "description": DESCRIPTION,
      "breadcrumb": { "@id": SITE_URL + "/thank-you#breadcrumb" },
    },
  ],
};

const NEXT_STEPS = [
  {
    icon: ClipboardCheck,
    title: "We Review Your Request",
    description:
      "Our team reads through the details you sent so we understand what your roof needs before we call.",
  },
  {
    icon: Phone,
    title: "We Reach Out",
    description:
      "A Shumaker representative contacts you within one business day to confirm the details and answer your questions.",
  },
  {
    icon: CalendarCheck,
    title: "We Schedule Your Free Estimate",
    description:
      "We set a time that works for you, inspect the roof on site, and walk you through your options and pricing.",
  },
];

const NEXT_LINKS = [
  { label: "Browse Our Services", href: "/services" },
  { label: "See Our Projects", href: "/projects" },
  { label: "Read the Blog", href: "/blog" },
];

export default function ThankYouPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(thankYouPageSchema) }}
      />
      <div className="flex flex-col w-full">
        {/* Page Header */}
        <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-slate-900/70" />
            <Image
              src={urlFor(HERO_IMAGE_URL) ?? HERO_IMAGE_URL}
              alt="Thank you for contacting Shumaker Roofing"
              fill
              sizes="100vw"
              className="object-cover opacity-50 mix-blend-overlay"
              priority
            />
          </div>
          <Container className="relative z-10 text-center">
            <div className="bg-white/10 border border-white/25 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
              Thank You!
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              We&apos;ve received your request. A member of our team will be in touch with you shortly.
            </p>
          </Container>
        </section>

        {/* What Happens Next */}
        <section className="py-24">
          <Container>
            <SectionHeader
              title="What Happens Next"
              subtitle="Your Next Steps"
              align="center"
              className="mb-14"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {NEXT_STEPS.map(({ icon: Icon, title, description }, index) => (
                <div
                  key={title}
                  className="relative bg-background p-8 rounded-2xl border border-border/50 shadow-md"
                >
                  <span className="absolute top-6 right-8 text-5xl font-heading font-extrabold text-primary/10 leading-none">
                    {index + 1}
                  </span>
                  <div className="bg-primary/10 text-primary w-14 h-14 rounded-full flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-3">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Need Us Sooner */}
        <section className="py-20 bg-muted/40">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionHeader title="Need Us Sooner?" subtitle="Reach Out Directly" className="mb-8" />
                <p className="text-muted-foreground text-lg mb-10">
                  If your roof is leaking or storm damage needs attention today, call us instead of
                  waiting for a callback. We handle emergency repairs across Maryland, Virginia,
                  and Pennsylvania.
                </p>

                <div className="flex flex-col gap-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-heading font-bold text-foreground">Phone Number</h4>
                      <p className="text-muted-foreground mt-1">
                        <a href="tel:+13016620533" className="hover:text-primary transition-colors">
                          +1 301-662-0533
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-heading font-bold text-foreground">Email Address</h4>
                      <p className="text-muted-foreground mt-1">
                        <a
                          href="mailto:info@shumakerroofing.com"
                          className="hover:text-primary transition-colors"
                        >
                          info@shumakerroofing.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-heading font-bold text-foreground">Working Hours</h4>
                      <p className="text-muted-foreground mt-1">Mon - Fri: 8:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background p-8 md:p-10 rounded-2xl shadow-xl border border-border/50">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-3">While You Wait</h3>
                <p className="text-muted-foreground mb-8">
                  Take a look around the site to learn more about how we work.
                </p>

                <div className="flex flex-col gap-4 mb-10">
                  {NEXT_LINKS.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      <span className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                        {label}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="h-14 px-8 text-base font-bold uppercase flex-1" asChild>
                    <Link href="/">
                      <Home className="h-5 w-5 mr-2" />
                      Back to Home
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-base font-bold uppercase flex-1"
                    asChild
                  >
                    <a href="tel:+13016620533">
                      <Phone className="h-5 w-5 mr-2" />
                      Call Us
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <CertificationsSection />

        {/* CTA strip */}
        <section className="py-16 bg-primary text-primary-foreground">
          <Container className="text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
              Ready to Schedule Your Estimate?
            </h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              Pick a date and time that works for you and we&apos;ll come out to inspect your roof.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="h-14 px-8 text-base font-bold bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link href="/book-appointment">BOOK AN APPOINTMENT</Link>
            </Button>
          </Container>
        </section>
      </div>
    </>
  );
}
