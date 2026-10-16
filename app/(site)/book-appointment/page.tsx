export const revalidate = 3600;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { GhlCalendar } from "@/components/shared/ghl-calendar";
import { Phone, Mail, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { SITE_URL, FALLBACK_BLOG_IMAGE } from "@/lib/utils";
import { urlFor } from "@/lib/sanity-image";

const HERO_IMAGE_URL =
  "https://cdn.sanity.io/images/rg9pahe7/production/6f190d658c389af55504e6ff5498d4f83bb923d4-2052x1540.jpg";

const TITLE = "Free Roof Inspection in Frederick, MD | Shumaker Roofing";
const DESCRIPTION =
  "Book a free roof inspection and estimate with Shumaker Roofing in Frederick, MD. Veteran-owned since 1946. Pick a time online or call 301-662-0533 today.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/book-appointment" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/book-appointment",
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

const bookPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": SITE_URL + "/book-appointment#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL + "/" },
        { "@type": "ListItem", "position": 2, "name": "Book an Appointment", "item": SITE_URL + "/book-appointment" },
      ],
    },
    {
      "@type": "WebPage",
      "@id": SITE_URL + "/book-appointment#webpage",
      "url": SITE_URL + "/book-appointment",
      "name": "Free Roof Inspection in Frederick, MD — Shumaker Roofing Company",
      "description": DESCRIPTION,
      "breadcrumb": { "@id": SITE_URL + "/book-appointment#breadcrumb" },
    },
  ],
};

// Matches the in-body link treatment used by rich-text copy elsewhere
// (components/shared/faq-answer.tsx, components/shared/two-column-section.tsx).
const INLINE_LINK_CLASS =
  "text-primary underline underline-offset-2 transition-opacity hover:opacity-80";

const WHEN_TO_BOOK: { key: string; content: React.ReactNode }[] = [
  {
    key: "leaking",
    content: "Your roof is leaking or you see water stains on the ceiling",
  },
  {
    key: "storm",
    content: (
      <>
        A storm just came through and you&apos;re worried about{" "}
        <Link href="/services/storm-damage-restoration" className={INLINE_LINK_CLASS}>
          storm damage
        </Link>{" "}
        from high wind, hail, or falling branches
      </>
    ),
  },
  {
    key: "shingles",
    content: "Shingles are missing, curling, or you're finding granules in the gutters",
  },
  {
    key: "older",
    content: (
      <>
        Your roof is getting older and you want to plan ahead. In Frederick, we can also check if
        your roof is a good fit for{" "}
        <Link href="/services/roof-rejuvenation" className={INLINE_LINK_CLASS}>
          roof rejuvenation
        </Link>{" "}
        instead of replacement.
      </>
    ),
  },
  {
    key: "buying-selling",
    content: "You're buying or selling a home",
  },
];

const WHY_BOOK_WITH_US = [
  "Veteran-Owned since 1946",
  "CertainTeed 5-Star Contractor",
  "Licensed & Insured",
  "Local Team Serving MD, VA & PA",
];

export default function BookPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookPageSchema) }}
      />
      <div className="flex flex-col w-full">
        {/* Page Header */}
        <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-slate-900/70" />
            <Image
              src={urlFor(HERO_IMAGE_URL) ?? HERO_IMAGE_URL}
              alt="Book an appointment with Shumaker Roofing"
              fill
              sizes="100vw"
              className="object-cover opacity-50 mix-blend-overlay"
              priority
              quality={50}
            />
          </div>
          <Container className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
              Book Your Free Roof Inspection in Frederick, MD
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Pick a time that works for you. We&apos;ll come to your home for a free roof inspection and give you a free estimate. No pressure and no obligation.
            </p>
          </Container>
        </section>

        {/* Calendar */}
        <section className="py-24">
          <Container>
            <GhlCalendar />
          </Container>
        </section>

        {/* When to book / Why book with us */}
        <section className="pb-24 border-b border-border">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              <div>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                  When To Book A Roof Inspection
                </h2>
                <ul className="flex flex-col gap-4">
                  {WHEN_TO_BOOK.map((item) => (
                    <li key={item.key} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/80 leading-relaxed">{item.content}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                  Why Homeowners Book With Shumaker
                </h2>
                <ul className="flex flex-col gap-4">
                  {WHY_BOOK_WITH_US.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                      <span className="text-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* Where we work */}
        <section className="py-16">
          <Container>
            <div className="max-w-2xl">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Where We Work</h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                We inspect roofs in{" "}
                <Link href="/service-areas/frederick-md" className={INLINE_LINK_CLASS}>
                  Frederick, MD
                </Link>
                ,{" "}
                <Link href="/service-areas/hagerstown-md" className={INLINE_LINK_CLASS}>
                  Hagerstown, MD
                </Link>
                ,{" "}
                <Link href="/service-areas/reston-va" className={INLINE_LINK_CLASS}>
                  Reston, VA
                </Link>
                , and{" "}
                <Link href="/service-areas/chambersburg-pa" className={INLINE_LINK_CLASS}>
                  Chambersburg, PA
                </Link>
                .
              </p>
              <Link
                href="/service-areas"
                className="inline-flex items-center font-medium text-primary hover:text-primary/80 transition-colors"
              >
                See all service areas <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </Container>
        </section>

        {/* Contact info strip */}
        <section className="py-16 bg-muted/40 border-t border-border">
          <Container>
            <div className="flex flex-col items-center text-center mb-10">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Prefer to call?</h2>
              <p className="text-muted-foreground text-sm max-w-md">
                We&apos;re happy to schedule your appointment over the phone or answer any questions before you book.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="bg-primary/10 p-4 rounded-full text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <h4 className="text-base font-heading font-bold text-foreground">Phone</h4>
                <a href="tel:+13016620533" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  +1 301-662-0533
                </a>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="bg-primary/10 p-4 rounded-full text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <h4 className="text-base font-heading font-bold text-foreground">Email</h4>
                <a href="mailto:info@shumakerroofing.com" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  info@shumakerroofing.com
                </a>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="bg-primary/10 p-4 rounded-full text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <h4 className="text-base font-heading font-bold text-foreground">Office Hours</h4>
                <p className="text-muted-foreground text-sm">Mon – Fri: 8:00 AM – 5:00 PM</p>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
