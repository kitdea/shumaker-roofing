export const revalidate = 3600;

import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { GhlCalendar } from "@/components/shared/ghl-calendar";
import { Phone, Mail, Clock } from "lucide-react";
import { SITE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: "Book an Appointment | Shumaker Roofing Company" },
  description:
    "Schedule a free roofing estimate with Shumaker Roofing Company. Pick a date and time that works for you — our team will come to you.",
  alternates: { canonical: "/book-appointment" },
  openGraph: {
    title: "Book an Appointment | Shumaker Roofing Company",
    description:
      "Schedule a free roofing estimate with Shumaker Roofing Company. Pick a date and time that works for you — our team will come to you.",
    url: "/book-appointment",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book an Appointment | Shumaker Roofing Company",
    description:
      "Schedule a free roofing estimate with Shumaker Roofing Company. Pick a date and time that works for you — our team will come to you.",
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
      "name": "Book an Appointment — Shumaker Roofing Company",
      "description": "Schedule a free roofing estimate online with Shumaker Roofing Company.",
      "breadcrumb": { "@id": SITE_URL + "/book-appointment#breadcrumb" },
    },
  ],
};

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
              src="https://images.ctfassets.net/1daipl7z93ig/50iHJtfm4UkBWGmLs4hGLl/e585de4da3a67060c01a0478f6160df9/roof-replacement-in-frederick-md_002.jpg"
              alt="Book an appointment with Shumaker Roofing"
              fill
              sizes="100vw"
              className="object-cover opacity-50 mix-blend-overlay"
              priority
            />
          </div>
          <Container className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
              Book an Appointment
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Pick a date and time that works for you. Our roofing experts will come to you for a free estimate.
            </p>
          </Container>
        </section>

        {/* Calendar */}
        <section className="py-24">
          <Container>
            <GhlCalendar />
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
