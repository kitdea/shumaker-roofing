export const revalidate = 3600;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Clock,
  Users,
  ShieldCheck,
  TrendingUp,
  Heart,
  ChevronRight,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: { absolute: "Careers | Join the Shumaker Roofing Team" },
  description:
    "Explore career opportunities at Shumaker Roofing Co. Inc. We're hiring experienced roofing professionals in Maryland, Virginia, West Virginia, and Pennsylvania. Apply today.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers | Join the Shumaker Roofing Team",
    description:
      "Explore career opportunities at Shumaker Roofing Co. Inc. We're hiring experienced roofing professionals in Maryland, Virginia, West Virginia, and Pennsylvania. Apply today.",
    url: "/careers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers | Join the Shumaker Roofing Team",
    description:
      "Explore career opportunities at Shumaker Roofing Co. Inc. We're hiring experienced roofing professionals in Maryland, Virginia, West Virginia, and Pennsylvania. Apply today.",
  },
};

interface JobPosting {
  id: string;
  title: string;
  type: string;
  location: string;
  department: string;
  description: string;
  requirements: string[];
}

const JOB_POSTINGS: JobPosting[] = [
  {
    id: "roofing-installer",
    title: "Roofing Installer",
    type: "Full-Time",
    location: "Frederick, MD",
    department: "Field Operations",
    description:
      "Install, repair, and replace residential and commercial roofing systems. Work as part of a skilled crew delivering high-quality craftsmanship on every job.",
    requirements: [
      "1+ years of roofing installation experience",
      "Ability to work at heights and in varying weather conditions",
      "Knowledge of shingle, metal, or flat roofing systems (one or more)",
      "Valid driver's license",
      "Reliable transportation",
    ],
  },
  {
    id: "roofing-estimator",
    title: "Roofing Estimator / Sales",
    type: "Full-Time",
    location: "Frederick, MD / Hagerstown, MD",
    department: "Sales",
    description:
      "Conduct on-site roof inspections, develop detailed estimates, and guide homeowners and business owners through their roofing options. Build lasting client relationships and help grow the Shumaker brand.",
    requirements: [
      "Experience in roofing sales or estimating preferred",
      "Strong communication and people skills",
      "Ability to read measurements and use estimating software",
      "Self-motivated with a results-driven mindset",
      "Valid driver's license and reliable transportation",
    ],
  },
  {
    id: "crew-lead",
    title: "Roofing Crew Lead",
    type: "Full-Time",
    location: "Frederick, MD",
    department: "Field Operations",
    description:
      "Lead a roofing crew on residential and commercial projects. Oversee daily job-site operations, ensure quality standards are met, and mentor junior installers.",
    requirements: [
      "3+ years of roofing experience with at least 1 year in a leadership role",
      "Strong knowledge of roofing installation techniques and safety protocols",
      "OSHA 10 certification (or willingness to obtain)",
      "Excellent communication and team leadership skills",
      "Valid driver's license",
    ],
  },
  {
    id: "office-coordinator",
    title: "Office Coordinator",
    type: "Full-Time",
    location: "Frederick, MD",
    department: "Administration",
    description:
      "Support daily office operations including scheduling, customer communication, job tracking, and administrative tasks. Play a key role in keeping our projects running smoothly from the office.",
    requirements: [
      "2+ years of administrative or office coordination experience",
      "Proficiency in Microsoft Office and CRM or scheduling software",
      "Exceptional organizational and communication skills",
      "Ability to multi-task in a fast-paced environment",
      "Construction or home services industry experience a plus",
    ],
  },
];

const CAREER_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Open Positions at Shumaker Roofing Co. Inc.",
  itemListElement: JOB_POSTINGS.map((job, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "JobPosting",
      title: job.title,
      employmentType: job.type === "Full-Time" ? "FULL_TIME" : "PART_TIME",
      hiringOrganization: {
        "@type": "Organization",
        name: "Shumaker Roofing Co. Inc.",
        sameAs: "https://www.shumakerroofing.com",
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: job.location.split("/")[0].trim().split(",")[0].trim(),
          addressRegion: job.location.includes("MD") ? "MD" : "VA",
          addressCountry: "US",
        },
      },
      description: job.description,
      datePosted: "2026-05-01",
    },
  })),
};

export default function CareersPage() {
  return (
    <div className="flex flex-col w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CAREER_SCHEMA) }}
      />

      {/* Page Header */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/70" />
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
            alt="Shumaker Roofing crew at work"
            fill
            className="object-cover opacity-50 mix-blend-overlay"
            priority
          />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
            Join Our Team
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Build a career with one of the Mid-Atlantic&apos;s most trusted roofing companies - over 75+ years strong and still growing.
          </p>
        </Container>
      </section>


      {/* Benefits */}
      <section className="py-24">
        <Container>
          <SectionHeader title="Benefits & Perks" subtitle="What We Offer" align="center" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Competitive Pay",
                desc: "We pay well because we expect excellence. Compensation reflects your skills, experience, and the quality of your work.",
              },
              {
                icon: ShieldCheck,
                title: "Stable, Year-Round Work",
                desc: "With 70+ years in business and a growing customer base across four states, our crews stay busy all year.",
              },
              {
                icon: Users,
                title: "Supportive Team Culture",
                desc: "You're not just a number here. We're a tight-knit crew that looks out for each other on and off the job site.",
              },
              {
                icon: TrendingUp,
                title: "Growth Opportunities",
                desc: "We promote from within. Installers become crew leads. Sales reps grow into senior roles. Your ambition is rewarded.",
              },
              {
                icon: Heart,
                title: "Health Benefits",
                desc: "We offer health benefits for full-time employees because taking care of our team is a core value — not an afterthought.",
              },
              {
                icon: Briefcase,
                title: "Training & Certifications",
                desc: "We invest in continuing education, manufacturer certifications, and safety training to keep skills sharp and careers moving forward.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-background border border-border/50 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col gap-4"
              >
                <div className="bg-primary/10 text-primary w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-lg">{title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Open Positions */}
      <section className="py-24 bg-muted/30">
        <Container>
          <SectionHeader title="Open Positions" subtitle="Now Hiring" align="center" />
          <div className="flex flex-col gap-6">
            {JOB_POSTINGS.map((job) => (
              <div
                key={job.id}
                className="bg-background border border-border/50 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                        <Briefcase className="h-3.5 w-3.5" />
                        {job.department}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-muted text-foreground/70 px-3 py-1 rounded-full">
                        <Clock className="h-3.5 w-3.5" />
                        {job.type}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-muted text-foreground/70 px-3 py-1 rounded-full">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <Button className="rounded-full gap-2 shrink-0" asChild>
                    <a href={`mailto:info@shumakerroofing.com?subject=Application: ${encodeURIComponent(job.title)}`}>
                      Apply Now
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <p className="text-foreground/70 leading-relaxed mb-5">{job.description}</p>

                <div>
                  <h4 className="text-sm font-heading font-bold text-foreground mb-3 uppercase tracking-wide">
                    Requirements
                  </h4>
                  <ul className="flex flex-col gap-2">
                    {job.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2 text-sm text-foreground/70">
                        <ChevronRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How to Apply */}
      <section className="py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeader title="How to Apply" subtitle="Get Started" />
              <p className="text-foreground/70 text-lg leading-relaxed mb-8">
                Ready to join the Shumaker team? Reach out by email or give us a call. Include your name, the position you&apos;re applying for, and a brief summary of your experience. We review every application and will follow up to schedule a conversation.
              </p>
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-4 rounded-full text-primary flex-shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-heading font-bold text-foreground">Email Your Application</h4>
                    <a
                      href="mailto:info@shumakerroofing.com"
                      className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity mt-1 block"
                    >
                      info@shumakerroofing.com
                    </a>
                    <p className="text-muted-foreground text-sm mt-1">
                      Subject line: &quot;Application: [Position Name]&quot;
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-4 rounded-full text-primary flex-shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-heading font-bold text-foreground">Call Us</h4>
                    <a
                      href="tel:+13016620533"
                      className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity mt-1 block"
                    >
                      +1 301-662-0533
                    </a>
                    <p className="text-muted-foreground text-sm mt-1">Mon – Fri, 8:00 AM – 5:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-4 rounded-full text-primary flex-shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-heading font-bold text-foreground">Walk In</h4>
                    <p className="text-muted-foreground mt-1">26 Water St, Frederick, MD 21701</p>
                    <p className="text-muted-foreground text-sm mt-1">Mon – Fri, 8:00 AM – 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary text-secondary-foreground p-10 rounded-2xl">
              <h3 className="text-2xl font-heading font-bold mb-4 text-white">Don&apos;t See Your Role?</h3>
              <p className="text-secondary-foreground/80 leading-relaxed mb-6">
                We&apos;re always interested in connecting with talented, motivated people - even if we don&apos;t have an opening that matches your skills right now. Send us your resume and tell us what you bring to the table. We keep all applications on file and reach out when the right opportunity comes up.
              </p>
              <Button
                size="lg"
                className="rounded-full gap-2 w-full sm:w-auto"
                asChild
              >
                <a href="mailto:info@shumakerroofing.com?subject=General Application - Shumaker Roofing">
                  <Mail className="h-4 w-4" />
                  Send a General Application
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-500">
        <Container className="text-center">
          <p className="uppercase text-primary font-semibold text-sm tracking-widest mb-3">
            Be Part of Something Lasting
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-4">
            Build Your Career with Shumaker Roofing
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-10">
            Join a team that has protected homes and built careers across the Mid-Atlantic for over 70 years. We&apos;re growing - and we&apos;d love to grow with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full gap-2 px-8" asChild>
              <a href="mailto:info@shumakerroofing.com?subject=Application: Shumaker Roofing">
                <Mail className="h-4 w-4" />
                <span className="font-semibold">Apply by Email</span>
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full gap-2 px-8 border-white/30 hover:bg-white/10"
              asChild
            >
              <Link href="/contact">
                <Phone className="h-4 w-4" />
                <span className="font-semibold">Contact Us</span>
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
