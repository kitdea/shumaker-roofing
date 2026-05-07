export const revalidate = 3600;

import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { CheckCircle2 } from "lucide-react";
import { client } from "@/lib/contentful";
import { toHttpsUrl } from "@/lib/utils";
import { TeamGrid } from "./team-grid";

export const metadata: Metadata = {
  title: { absolute: "About Us | Shumaker Roofing Company" },
  description:
    "Learn about Shumaker Roofing Company's mission, vision, and highly skilled licensed team! Experience top-notch roofing services from trusted professionals.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | Shumaker Roofing Company",
    description:
      "Learn about Shumaker Roofing Company's mission, vision, and highly skilled licensed team! Experience top-notch roofing services from trusted professionals.",
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Shumaker Roofing Company",
    description:
      "Learn about Shumaker Roofing Company's mission, vision, and highly skilled licensed team! Experience top-notch roofing services from trusted professionals.",
  },
};

export default async function AboutPage() {
  type ContentfulMember = {
    sys: {
      id: string;
    };
    fields: {
      fullName?: string;
      jobPosition?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      teamInfo?: any;
      email?: string;
      socialMedia?: string;
      phoneNumber?: string | number;
      salesmanTag?: string;
      teamThumbnail?: {
        fields: {
          file: {
            url: string;
          };
        };
      };
    };
  };

  let dynamicTeamMembers: ContentfulMember[] = [];
  try {
    const response = await client.getEntries({ content_type: 'team' });
    if (response.items.length > 0) {
      dynamicTeamMembers = response.items as unknown as ContentfulMember[];
    } else {
      const res2 = await client.getEntries({ content_type: 'teamMember' });
      dynamicTeamMembers = res2.items as unknown as ContentfulMember[];
    }
  } catch (err) {
    console.error("Failed to fetch team members:", err);
  }

  const TEAM_ORDER = [
    "robert bob schisler",
    "tyler schisler",
    "christian ekberg",
    "terree long",
    "bailey walker",
    "don stillwagon",
    "victor razuri",
    "amin mekki",
  ];

  const normalizeName = (name: string) =>
    name
      .toLowerCase()
      .replace(/[“”"'’‘]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const sortTeam = <T extends { name: string }>(members: T[]): T[] =>
    [...members].sort((a, b) => {
      const ai = TEAM_ORDER.indexOf(normalizeName(a.name));
      const bi = TEAM_ORDER.indexOf(normalizeName(b.name));
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

  const displayTeam = sortTeam(
    dynamicTeamMembers.length > 0
      ? dynamicTeamMembers.map((member) => {
          const fields = member.fields;
          const imageUrl = toHttpsUrl(fields.teamThumbnail?.fields?.file?.url)
            ?? "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop";
          const name = fields.fullName || "Team Member";
          return {
            id: member.sys.id,
            name,
            role: fields.jobPosition || "Staff",
            img: imageUrl,
            teamInfo: fields.teamInfo || "A dedicated professional at Shumaker Roofing, committed to providing top-quality service, ensuring safety, and upholding our core values of integrity and excellence in every project.",
            email: fields.email,
            socialMedia: fields.socialMedia,
            phoneNumber: fields.phoneNumber,
            salesmanTag: fields.salesmanTag,
            retired: normalizeName(name) === "terree long",
          };
        })
      : []
  );

  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/70" />
          <Image
            src="https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=2072&auto=format&fit=crop"
            alt="Roofing working"
            fill
            className="object-cover opacity-50 mix-blend-overlay"
            priority
          />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">About Us</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Discover the story behind Shumaker Roofing, our values, and what makes us a trusted name in the industry.
          </p>
        </Container>
      </section>

      {/* Who Are We */}
      <section className="py-24 bg-secondary text-white">
        <Container className="max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-8">Who Are We?</h2>
          <div className="flex flex-col gap-6 text-white/80 text-lg leading-relaxed">
            <p>
              For over 75 years,{" "}
              <span className="text-primary font-semibold">Shumaker Roofing Co.</span>{" "}
              has been the go-to{" "}
              <strong className="text-white font-bold">roofing company in Frederick, MD</strong>
              , serving homeowners and businesses with trusted solutions.
            </p>
            <p>
              Shumaker Roofing is a team of dedicated and genuine individuals. Our vision and goals align with the
              Shumaker brothers who started the company back in the 1940s.
            </p>
            <p>
              As a leading roofing company in Frederick, MD, we solve real problems for homeowners and business
              owners alike. We alleviate the stress from your problems so you don&apos;t have to deal with them while
              having the confidence that they are taken care of.
            </p>
            <p>
              As a CertainTeed 5 STAR &ldquo;Select ShingleMaster&rdquo; since the program&apos;s inception in 1998, we offer a Full
              Replacement Cost Warranty which is transferable, covers both non-prorated 50 year labor &amp; material
              costs, and workmanship defects for the first 25 years. Regardless of manufacturer warranties, we
              always include a 10 year craftsmanship warranty as well.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <SectionHeader title="Our Mission" subtitle="What Drives Us" />
              <p className="text-foreground/70 text-lg leading-relaxed mb-6">
                With years of experience in the industry, our team of skilled professionals is dedicated to delivering top roofing services that prioritize durability, quality, and safety. We take pride in our craftsmanship and our commitment to exceeding client expectations.
              </p>
              <ul className="flex flex-col gap-3">
                {["Uncompromising Quality", "Safety First Approach", "Customer Satisfaction", "Sustainable Practices"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-secondary text-secondary-foreground p-10 rounded-2xl">
              <h3 className="text-2xl font-heading font-bold mb-4 text-white">Our Vision</h3>
              <p className="text-secondary-foreground/80 leading-relaxed mb-8">
                To be the leading roofing provider recognized for our exceptional craftsmanship, innovative solutions, and unwavering integrity. We aim to protect communities, one roof at a time, building lasting relationships through trust and reliability.
              </p>
              <h3 className="text-2xl font-heading font-bold mb-4 text-white">Our Core Values</h3>
              <ul className="flex flex-col gap-3 text-secondary-foreground/80">
                <li>• Integrity and Honesty</li>
                <li>• Excellence in Craftsmanship</li>
                <li>• Respect for Clients and Property</li>
                <li>• Continuous Improvement</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-muted/30">
        <Container>
          <SectionHeader title="Meet Our Experts" subtitle="The Team" align="center" />
          <TeamGrid team={displayTeam} />
        </Container>
      </section>
    </div>
  );
}
