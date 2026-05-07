export const revalidate = 3600;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, MessageSquare } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "./faq-accordion";
import type { FaqCategory } from "./faq-accordion";

export const metadata: Metadata = {
  title: { absolute: "Frequently Asked Questions | Shumaker Roofing Company" },
  description:
    "Have questions about roofing? Browse Shumaker Roofing's FAQ page for answers on services, pricing, warranties, storm damage, and more.",
  alternates: { canonical: "/faqs" },
  openGraph: {
    title: "Frequently Asked Questions | Shumaker Roofing Company",
    description:
      "Have questions about roofing? Browse Shumaker Roofing's FAQ page for answers on services, pricing, warranties, storm damage, and more.",
    url: "/faqs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | Shumaker Roofing Company",
    description:
      "Have questions about roofing? Browse Shumaker Roofing's FAQ page for answers on services, pricing, warranties, storm damage, and more.",
  },
};

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    category: "General Questions",
    faqs: [
      {
        question: "How long has Shumaker Roofing been in business?",
        answer:
          "Shumaker Roofing has been serving Maryland, Virginia, West Virginia, and Pennsylvania for over 20 years. We have built a reputation for quality craftsmanship, honest pricing, and exceptional customer service across the region.",
      },
      {
        question: "What areas do you serve?",
        answer:
          "We serve the greater Mid-Atlantic region, including Frederick, MD, Hagerstown, MD, Reston, VA, and surrounding communities in Maryland, Virginia, West Virginia, and Pennsylvania. Contact us to confirm service availability in your specific area.",
      },
      {
        question: "Are you licensed and insured?",
        answer:
          "Yes. Shumaker Roofing is fully licensed and insured in every state we operate in. Our license numbers are: MHIC #4503 (Maryland), PA #160849 (Pennsylvania), WV #062924 (West Virginia), and VA #2705191905 (Virginia). We carry comprehensive general liability and workers' compensation insurance to protect both our crew and your property.",
      },
      {
        question: "Do you offer free estimates?",
        answer:
          "Absolutely. We provide free, no-obligation estimates for all residential and commercial roofing projects. One of our expert estimators will inspect your roof, assess its condition, and walk you through all available options with transparent pricing.",
      },
    ],
  },
  {
    category: "Roofing Services",
    faqs: [
      {
        question: "What types of roofing services do you offer?",
        answer:
          "We offer a full range of roofing services including roof installation, roof replacement, roof repair, emergency storm damage repair, gutter installation and repair, siding, and commercial roofing. Whether you need a minor repair or a complete replacement, our team has the expertise to handle it.",
      },
      {
        question: "How long does a typical roof replacement take?",
        answer:
          "Most residential roof replacements are completed in one to two days, depending on the size and complexity of your roof, weather conditions, and the materials chosen. We work efficiently to minimize disruption to your daily routine and always clean up the job site thoroughly before leaving.",
      },
      {
        question: "What roofing materials do you work with?",
        answer:
          "We install and repair a wide variety of roofing materials, including asphalt shingles, architectural shingles, metal roofing, flat roofing (TPO, EPDM), cedar shake, and more. During your estimate, we'll recommend the best material based on your home, budget, and local climate.",
      },
      {
        question: "Can you handle both residential and commercial roofing?",
        answer:
          "Yes. Our crews are experienced in both residential and commercial roofing projects of all sizes. From single-family homes to large commercial buildings, we bring the same commitment to quality and safety to every job.",
      },
    ],
  },
  {
    category: "Repairs & Storm Damage",
    faqs: [
      {
        question: "How do I know if my roof needs to be repaired or replaced?",
        answer:
          "Signs that you may need roof repairs include missing or curling shingles, granules in your gutters, visible water stains on ceilings, or flashing damage. If your roof is over 20 years old or has widespread damage, a full replacement may be more cost-effective. We'll give you an honest assessment during your free inspection.",
      },
      {
        question: "Do you offer emergency roof repair services?",
        answer:
          "Yes. We understand that storm damage and leaks can't wait. We offer emergency roofing services to address urgent situations quickly and prevent further damage to your home. Call us at +1 301-662-0533 any time for prompt assistance.",
      },
      {
        question: "Do you help with insurance claims for storm damage?",
        answer:
          "Yes. We work directly with homeowners and their insurance companies to streamline the claims process. Our team will document the damage thoroughly and provide the required reports and photos to support your claim. We strive to make the process as stress-free as possible.",
      },
    ],
  },
  {
    category: "Pricing & Warranties",
    faqs: [
      {
        question: "How much does a new roof cost?",
        answer:
          "The cost of a new roof depends on several factors including the size of your roof, the materials selected, your location, and the complexity of the installation. We provide detailed, itemized estimates so you know exactly what you're paying for. Contact us for a free, no-obligation quote tailored to your project.",
      },
      {
        question: "Do you offer financing options?",
        answer:
          "We understand that a new roof is a significant investment. We offer flexible financing options to help make your project affordable. Ask your estimator about current financing programs and payment plans during your free estimate appointment.",
      },
      {
        question: "What warranties do you provide?",
        answer:
          "We stand behind our work. Shumaker Roofing offers both manufacturer warranties on materials and a workmanship warranty on our installations. The specific terms depend on the product and scope of work. Your estimator will explain all warranty coverage in detail before you sign anything.",
      },
    ],
  },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_CATEGORIES.flatMap((cat) =>
    cat.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    }))
  ),
};

export default function FaqsPage() {
  return (
    <div className="flex flex-col w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      {/* Page Header */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/70" />
          <Image
            src="https://images.unsplash.com/photo-1632823471565-1ecdf5c6da11?q=80&w=2070&auto=format&fit=crop"
            alt="Roofing professionals at work"
            fill
            className="object-cover opacity-50 mix-blend-overlay"
            priority
          />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Find answers to the most common questions about our roofing services, pricing, and process.
          </p>
        </Container>
      </section>

      {/* FAQ Sections */}
      <section className="py-24">
        <Container>
          <SectionHeader
            title="Your Questions, Answered"
            subtitle="FAQs"
            align="center"
          />
          <FaqAccordion categories={FAQ_CATEGORIES} />
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary">
        <Container className="text-center">
          <p className="uppercase text-primary font-semibold text-sm tracking-widest mb-3">
            Still Have Questions?
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-4">
            We&apos;re Here to Help
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-10">
            Can&apos;t find the answer you&apos;re looking for? Our team is ready to assist you with anything roofing-related.
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
              className="rounded-full gap-2 px-8 border-white/30 text-white hover:bg-white/10"
              asChild
            >
              <Link href="/contact">
                <MessageSquare className="h-4 w-4" />
                <span className="font-semibold">Send a Message</span>
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
