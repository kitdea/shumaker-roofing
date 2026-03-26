import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About Us | Shumaker Roofing",
  description: "Learn more about Shumaker Roofing, our mission, vision, and the skilled team behind our top-tier roofing services.",
};

export default function AboutPage() {
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
            {[
              { name: "Michael Shumaker", role: "Founder & CEO", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" },
              { name: "Sarah Jenkins", role: "Operations Manager", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" },
              { name: "David Miller", role: "Lead Foreman", img: "https://images.unsplash.com/photo-1504221507732-5246c045949b?q=80&w=2070&auto=format&fit=crop" },
            ].map((member, i) => (
              <div key={i} className="bg-background rounded-xl overflow-hidden shadow-md border border-border/50 group">
                <div className="relative h-72 w-full overflow-hidden">
                  <Image src={member.img} alt={member.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-xl font-heading font-bold text-foreground">{member.name}</h4>
                  <p className="text-primary font-medium mt-1">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
