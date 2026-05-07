export const revalidate = 3600;

import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { CheckCircle2, Heart, Home, Users, ClipboardList, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Roofs for Heroes | Shumaker Roofing Company" },
  description:
    "Shumaker Roofing Co. donates roofs to veterans in need. Nominate a veteran today and help us honor those who served our country.",
  alternates: { canonical: "/roofs-for-heroes" },
  openGraph: {
    title: "Roofs for Heroes | Shumaker Roofing Company",
    description:
      "Shumaker Roofing Co. donates roofs to veterans in need. Nominate a veteran today and help us honor those who served our country.",
    url: "/roofs-for-heroes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roofs for Heroes | Shumaker Roofing Company",
    description:
      "Shumaker Roofing Co. donates roofs to veterans in need. Nominate a veteran today and help us honor those who served our country.",
  },
};

const stats = [
  { value: "0", label: "Roofs Donated to Veterans" },
  { value: "7", label: "Veterans Hired" },
  { value: "$6800", label: "Given Back To Veterans" },
  { value: "0", label: "Veteran Labor Hours" },
  { value: "0", label: "Flags Delivered" },
  { value: "3", label: "Veterans Impacted" },
];

const eligibilityItems = [
  "Must be a U.S. military veteran (any branch of service)",
  "Must reside in the Frederick, MD area or surrounding counties",
  "Must demonstrate financial need for roof repair or replacement",
  "Property must be a primary residence owned by the veteran",
  "Roof must be in need of significant repair or full replacement",
  "Veteran must be in good standing with no outstanding liens on property",
];

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Submit a Nomination",
    description:
      "Fill out our online nomination form with details about the veteran you'd like to nominate. You can nominate yourself or someone you know.",
  },
  {
    icon: Users,
    step: "02",
    title: "Review & Selection",
    description:
      "Our team reviews all nominations and selects recipients based on need, eligibility, and available resources. We contact nominees directly.",
  },
  {
    icon: Home,
    step: "03",
    title: "Roof Assessment",
    description:
      "We schedule a free on-site inspection to assess the roof's condition and determine the scope of work needed for the project.",
  },
  {
    icon: Heart,
    step: "04",
    title: "Roof Donated",
    description:
      "Our crew completes the full roof repair or replacement at no cost to the veteran, honoring their service with quality craftsmanship.",
  },
];

export default function RoofsForHeroesPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-slate-900">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/70" />
          <Image
            src="https://images.unsplash.com/photo-1536060316316-2466bda904f1?q=80&w=2070&auto=format&fit=crop"
            alt="American flag waving"
            fill
            className="object-cover opacity-50 mix-blend-overlay"
            priority
          />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
            Roofs for Heroes
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Honoring those who served by giving back — one roof at a time.
          </p>
        </Container>
      </section>

      {/* YouTube Embed */}
      <section className="py-12 bg-slate-900">
        <Container className="flex justify-center">
          <div className="w-full max-w-4xl aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/3AyXhVEtlC0?si=LFxHQA5e6fXFlgu7"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </Container>
      </section>

      {/* Section 1 — Program Overview */}
      <section className="py-24 bg-slate-900 text-white">
        <Container className="max-w-4xl text-center">
          <div className="flex flex-col gap-2 mb-10 w-full text-center items-center mx-auto">
            <span className="text-primary font-semibold tracking-wider uppercase text-sm md:text-base">
              Our Commitment to Veterans
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white">
              Roofs for Heroes
            </h2>
          </div>
          <div className="flex flex-col gap-6 text-white/80 text-lg leading-relaxed">
            <p>
              At{" "}
              <span className="text-primary font-semibold">Shumaker Roofing Co.</span>, honor,
              respect, service, and love of this great country and those who serve it are the
              principles that drive every project we undertake. Founded by a disabled Vietnam War
              veteran, and now owned by a disabled United States Navy veteran, these values are at
              the core of our mission.
            </p>
            <p>
              Unlike other roofing and home improvement companies, we don&apos;t just talk about our
              beliefs; we act on them by donating roofs to veterans in need. While the sacrifices of
              our veterans are priceless, Shumaker Roofing Co. is committed to providing donations
              of our labor and time to those who served in the armed forces.
            </p>
          </div>
          <div className="mt-12">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-bold tracking-widest uppercase px-10 py-6 rounded-full text-sm"
            >
              <Link href="/contact">Nominate a Veteran</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Stats Grid */}
      <section className="py-16 bg-slate-900">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-3 p-8 border border-primary/60 rounded-sm"
              >
                <span className="text-5xl font-heading font-extrabold text-primary">{value}</span>
                <span className="text-white/80 text-base font-medium">{label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Section 2 — Eligibility */}
      <section className="py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <SectionHeader title="Who Is Eligible?" subtitle="Eligibility Requirements" />
              <p className="text-foreground/70 text-lg leading-relaxed mb-8">
                We want to make sure our donations reach the veterans who need it most. The
                following criteria help us identify qualified recipients for the Roofs for Heroes
                program.
              </p>
              <ul className="flex flex-col gap-4">
                {eligibilityItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 text-white p-10 rounded-2xl flex flex-col gap-6">
              <h3 className="text-2xl font-heading font-bold text-white">Why We Do This</h3>
              <p className="text-white/80 leading-relaxed">
                Our founders served this country with honor and came home knowing firsthand the
                challenges veterans face. The Roofs for Heroes program is our way of giving back —
                ensuring that those who protected our freedoms have a safe, secure roof over their
                heads.
              </p>
              <p className="text-white/80 leading-relaxed">
                Every roof we donate is completed with the same quality and craftsmanship we bring
                to every paying customer. Our veterans deserve nothing less than our absolute best.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="text-center">
                  <p className="text-primary text-4xl font-heading font-extrabold">75+</p>
                  <p className="text-white/70 text-sm mt-1">Years in Business</p>
                </div>
                <div className="text-center">
                  <p className="text-primary text-4xl font-heading font-extrabold">100%</p>
                  <p className="text-white/70 text-sm mt-1">Labor Donated</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Section 3 — How It Works */}
      <section className="py-24 bg-muted/30">
        <Container>
          <SectionHeader title="How It Works" subtitle="The Process" align="center" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
            {steps.map(({ icon: Icon, step, title, description }) => (
              <div
                key={step}
                className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-background border border-border"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 text-xs font-bold text-primary bg-background border border-primary rounded-full w-6 h-6 flex items-center justify-center">
                    {step}
                  </span>
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground">{title}</h3>
                <p className="text-foreground/65 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="bg-slate-900 rounded-2xl p-12 flex flex-col items-center gap-6 max-w-2xl mx-auto">
              <FileText className="h-10 w-10 text-primary" />
              <h3 className="text-2xl font-heading font-bold text-white">
                Ready to Nominate a Veteran?
              </h3>
              <p className="text-white/70 leading-relaxed">
                Fill out our contact form to nominate a deserving veteran for a donated roof. Our
                team will follow up with next steps within a few business days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-bold tracking-widest uppercase px-8 rounded-full text-sm"
                >
                  <Link href="/contact">Nominate a Veteran</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white bg-transparent hover:bg-white/10 hover:text-primary hover:border-primary font-bold tracking-widest uppercase px-8 rounded-full text-sm transition-colors duration-200"
                >
                  <Link href="tel:+13018989706">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
