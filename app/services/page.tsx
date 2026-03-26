import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Building2, Wrench, Umbrella, ShieldAlert, Droplets } from "lucide-react";

export const metadata = {
  title: "Services | Shumaker Roofing",
  description: "Explore our comprehensive roofing services including residential, commercial, repairs, inspections, and more.",
};

const services = [
  {
    title: "Residential Roofing",
    icon: Home,
    desc: "Complete roof replacements, new installations, and expert repairs for your home. We work with asphalt shingles, metal roofing, and tile to give your home the perfect look and protection.",
    features: ["Shingle Replacement", "Custom Metal Roofs", "Leak Repairs"],
  },
  {
    title: "Commercial Roofing",
    icon: Building2,
    desc: "Durable and energy-efficient flat roofing solutions tailored for businesses. We specialize in TPO, EPDM, and modified bitumen systems that last for decades.",
    features: ["Flat Roof Systems", "Energy Efficient Coatings", "Routine Maintenance"],
  },
  {
    title: "Roof Maintenance & Repair",
    icon: Wrench,
    desc: "Preventative maintenance to extend the life of your roof and catch problems early. From minor leaks to major structural fixes, we handle it all swiftly.",
    features: ["Leak Detection", "Shingle Repair", "Flashing Fixing"],
  },
  {
    title: "Storm Damage Restoration",
    icon: ShieldAlert,
    desc: "Fast, reliable emergency roofing services after severe weather. We also assist with insurance claims to ensure you get the coverage you deserve.",
    features: ["Emergency Tarping", "Insurance Claim Help", "Wind & Hail Damage"],
  },
  {
    title: "Gutter Installation",
    icon: Droplets,
    desc: "Protect your foundation and siding with high-quality seamless gutters. We offer installation, repair, and cleaning services for complete water management.",
    features: ["Seamless Aluminum", "Gutter Guards", "Downspout Repair"],
  },
  {
    title: "Roof Inspections",
    icon: Umbrella,
    desc: "Comprehensive inspections for peace of mind. Whether you are buying, selling, or just checking the health of your roof, our detailed reports have you covered.",
    features: ["Buyer/Seller Inspections", "Drone Technology", "Detailed Reporting"],
  },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/70" />
          <Image
            src="https://images.unsplash.com/photo-1548614606-52b4451f994b?q=80&w=2070&auto=format&fit=crop"
            alt="Roofing services"
            fill
            className="object-cover opacity-50 mix-blend-overlay"
            priority
          />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">Our Services</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Comprehensive roofing solutions designed to protect your investment and enhance your property&apos;s value.
          </p>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <Container>
          <SectionHeader title="What We Can Do For You" subtitle="Expertise" align="center" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {services.map((service, i) => (
              <Card key={i} className="border-border/50 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <div className="h-2 w-full bg-primary/20 group-hover:bg-primary transition-colors" />
                <CardContent className="p-8 pt-8">
                  <div className="bg-primary/10 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <service.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-4">{service.title}</h3>
                  <p className="text-foreground/70 mb-6 line-clamp-4">
                    {service.desc}
                  </p>
                  <ul className="flex flex-col gap-2 border-t border-border pt-6">
                    {service.features.map((feat, j) => (
                      <li key={j} className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA section inside services */}
      <section className="py-20 bg-muted/50 border-t border-border">
        <Container className="text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Need a Custom Roofing Solution?</h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            If you have a unique project or require an emergency repair, don&apos;t hesitate to reach out. We are here to help 24/7.
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">Get a Free Quote</Link>
          </Button>
        </Container>
      </section>
    </div>
  );
}
