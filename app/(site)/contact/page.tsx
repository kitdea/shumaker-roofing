export const revalidate = 3600;

import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { GhlForm } from "@/components/shared/ghl-form";
import { CertificationsSection } from "@/components/shared/certifications-section";
import { SITE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: "Contact Us | Get in Touch with Shumaker Roofing Company" },
  description:
    "Get in touch with Shumaker Roofing Company for reliable roofing services. Contact us today for free estimates, expert advice, and top-quality roofing solution.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | Get in Touch with Shumaker Roofing Company",
    description:
      "Get in touch with Shumaker Roofing Company for reliable roofing services. Contact us today for free estimates, expert advice, and top-quality roofing solution.",
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Get in Touch with Shumaker Roofing Company",
    description:
      "Get in touch with Shumaker Roofing Company for reliable roofing services. Contact us today for free estimates, expert advice, and top-quality roofing solution.",
  },
};


const contactPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": SITE_URL + "/contact#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL + "/" },
        { "@type": "ListItem", "position": 2, "name": "Contact", "item": SITE_URL + "/contact" },
      ],
    },
    {
      "@type": "ContactPage",
      "@id": SITE_URL + "/contact#contactpage",
      "url": SITE_URL + "/contact",
      "name": "Contact Shumaker Roofing Company",
      "description":
        "Get in touch with Shumaker Roofing Company for reliable roofing services. Contact us today for free estimates, expert advice, and top-quality roofing solutions.",
      "breadcrumb": { "@id": SITE_URL + "/contact#breadcrumb" },
      "mainEntity": {
        "@type": "LocalBusiness",
        "@id": SITE_URL + "/#organization",
        "name": "Shumaker Roofing Company",
        "url": SITE_URL,
        "telephone": "+1-301-662-0533",
        "email": "info@shumakerroofing.com",
        "address": [
          {
            "@type": "PostalAddress",
            "streetAddress": "26 Water St.",
            "addressLocality": "Frederick",
            "addressRegion": "MD",
            "postalCode": "21701",
            "addressCountry": "US",
          },
          {
            "@type": "PostalAddress",
            "streetAddress": "6 W Washington St Suite 208",
            "addressLocality": "Hagerstown",
            "addressRegion": "MD",
            "postalCode": "21740",
            "addressCountry": "US",
          },
          {
            "@type": "PostalAddress",
            "streetAddress": "12001 Sunrise Valley Dr",
            "addressLocality": "Reston",
            "addressRegion": "VA",
            "postalCode": "20191",
            "addressCountry": "US",
          },
        ],
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "17:00",
        },
      },
    },
  ],
};

export default async function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/70" />
          <Image
              src="https://cdn.sanity.io/images/rg9pahe7/production/6f190d658c389af55504e6ff5498d4f83bb923d4-2052x1540.jpg"
            alt="Contact us"
            fill
            sizes="100vw"
            className="object-cover opacity-50 mix-blend-overlay"
            priority
          />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">Contact Us</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Ready to start your roofing project? Contact our friendly team today for a free estimate.
          </p>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-background p-8 md:p-10 rounded-2xl shadow-xl border border-border/50">
              <SectionHeader title="Send Us a Message" subtitle="Get a Quote" className="mb-8" />
              <GhlForm />
            </div>
            

            {/* Contact Details */}
            <div className="flex flex-col justify-center">
              <SectionHeader title="Contact Information" subtitle="Reach Out" className="mb-10" />

              <div className="flex flex-col gap-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-4 rounded-full text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-heading font-bold text-foreground">Our Location</h4>
                    <p className="text-muted-foreground mt-1">- 26 Water St. Frederick, MD 21701</p>
                    <p className="text-muted-foreground mt-1">- 6 W Washington St suite 208, Hagerstown, MD 21740</p>
                    <p className="text-muted-foreground mt-1">- 12001 Sunrise Valley Dr, Reston, VA 20191</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-4 rounded-full text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-heading font-bold text-foreground">Phone Number</h4>
                    <p className="text-muted-foreground mt-1">+1 301-662-0533</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-4 rounded-full text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-heading font-bold text-foreground">Email Address</h4>
                    <p className="text-muted-foreground mt-1">info@shumakerroofing.com</p>
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
          </div>
        </Container>
      </section>

      <CertificationsSection />

      {/* Our Locations Map Section */}
      <section className="py-16 bg-muted/40">
        <Container>
          <SectionHeader
            title="Find Us"
            subtitle="Our Locations"
            className="mb-12 text-center"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <h4 className="text-base font-heading font-bold text-foreground">Frederick, MD</h4>
              </div>
              <p className="text-sm text-muted-foreground">26 Water St. Frederick, MD 21701</p>
              <div className="w-full h-72 rounded-xl border border-border overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3103.051992993649!2d-77.36344262406091!3d38.945640571713774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b64906aaaa4f1d%3A0x7fc69ec8cdf8f004!2sShumaker%20Roofing%20Company!5e0!3m2!1sen!2sph!4v1776891299304!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shumaker Roofing - Frederick, MD"
                ></iframe>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <h4 className="text-base font-heading font-bold text-foreground">Hagerstown, MD</h4>
              </div>
              <p className="text-sm text-muted-foreground">6 W Washington St Suite 208, Hagerstown, MD 21740</p>
              <div className="w-full h-72 rounded-xl border border-border overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.330027553726!2d-77.72310332402718!3d39.642286571574566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c9ecb669a6af07%3A0x581ade45e3590790!2sShumaker%20Roofing%20Company!5e0!3m2!1sen!2sph!4v1776891191862!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shumaker Roofing - Hagerstown, MD"
                ></iframe>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <h4 className="text-base font-heading font-bold text-foreground">Reston, VA</h4>
              </div>
              <p className="text-sm text-muted-foreground">12001 Sunrise Valley Dr, Reston, VA 20191</p>
              <div className="w-full h-72 rounded-xl border border-border overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3082.5392735339065!2d-77.40461549999999!3d39.4119283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c9da5c304ada73%3A0x20ee81a5d09380d2!2sShumaker%20Roofing%20Company!5e0!3m2!1sen!2sph!4v1776890979259!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shumaker Roofing - Reston, VA"
                ></iframe>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
    </>
  );
}