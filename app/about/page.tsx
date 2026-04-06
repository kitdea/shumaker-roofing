import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { CheckCircle2 } from "lucide-react";
import { client } from "@/lib/contentful";
import { TeamGrid } from "./team-grid";

export const metadata = {
  title: "About Us | Shumaker Roofing",
  description: "Learn more about Shumaker Roofing, our mission, vision, and the skilled team behind our top-tier roofing services.",
};

export default async function AboutPage() {
  type ContentfulMember = {
    sys: {
      id: string;
    };
    fields: {
      fullName?: string;
      jobPosition?: string;
      teamInfo?: string;
      teamThumbnail?: {
        fields: {
          file: {
            url: string;
          };
        };
      };
    };
  };

  // Fetch dynamic team members from Contentful
  let dynamicTeamMembers: ContentfulMember[] = [];
  try {
    const response = await client.getEntries({ content_type: 'team' });
    if (response.items.length > 0) {
      dynamicTeamMembers = response.items as unknown as ContentfulMember[];
    } else {
      // Fallback
      const res2 = await client.getEntries({ content_type: 'teamMember' });
      dynamicTeamMembers = res2.items as unknown as ContentfulMember[];
    }
  } catch (err) {
    console.error("Failed to fetch team members:", err);
  }

  const defaultTeam = [
    { name: "Michael Shumaker", role: "Founder & CEO", teamInfo: "With over 20 years of experience, Michael leads the company with a commitment to excellence and community service.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" },
    { name: "Sarah Jenkins", role: "Operations Manager", teamInfo: "Sarah ensures all projects run smoothly and efficiently, coordinating between crews and clients with expert precision.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" },
    { name: "David Miller", role: "Lead Foreman", teamInfo: "David oversees our roofing crews, bringing unparalleled expertise to every residential and commercial installation.", img: "https://images.unsplash.com/photo-1504221507732-5246c045949b?q=80&w=2070&auto=format&fit=crop" },
    { name: "James Wilson", role: "Safety Inspector", teamInfo: "James guarantees that all operations exceed safety standards, protecting both our team and your property.", img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=1974&auto=format&fit=crop" },
    { name: "Emily Chen", role: "Project Estimator", teamInfo: "Emily provides accurate and transparent estimates, helping clients comfortably plan their roofing investments.", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop" },
    { name: "Marcus Johnson", role: "Customer Success", teamInfo: "Marcus is dedicated to ensuring every client is completely satisfied, from initial contact to final inspection.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" },
  ];

  const displayTeam = dynamicTeamMembers.length > 0
    ? dynamicTeamMembers.map((member) => {
        const fields = member.fields;
        const imageUrl = fields.teamThumbnail?.fields?.file?.url 
          ? `https:${fields.teamThumbnail.fields.file.url}` 
          : "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop";
        return {
          id: member.sys.id,
          name: fields.fullName || "Team Member",
          role: fields.jobPosition || "Staff",
          img: imageUrl,
          teamInfo: fields.teamInfo || "A dedicated professional at Shumaker Roofing, committed to providing top-quality service, ensuring safety, and upholding our core values of integrity and excellence in every project.",
        };
      })
    : defaultTeam.map((m, i) => ({ ...m, id: i.toString() }));

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
