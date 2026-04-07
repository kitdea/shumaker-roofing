import Link from "next/link";
import Image from "next/image";
import { Home, Building2, Wrench, Umbrella, ShieldAlert, Droplets, Grid, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { client } from "@/lib/contentful";
import { Document } from "@contentful/rich-text-types";

export const metadata = {
  title: "Professional Roofing Services | Shumaker Roofing",
  description: "Explore our comprehensive roofing services including residential roofing, commercial roofing, roof repairs, storm damage restoration, and expert roof inspections.",
  keywords: "roofing services, residential roofing, commercial roofing, roof repair, roof inspection, storm damage, Shumaker Roofing",
};

const getIconForService = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("residential")) return Home;
  if (t.includes("commercial")) return Building2;
  if (t.includes("maintenance") || t.includes("repair")) return Wrench;
  if (t.includes("storm") || t.includes("damage")) return ShieldAlert;
  if (t.includes("gutter")) return Droplets;
  if (t.includes("inspection")) return Umbrella;
  return Grid; // fallback icon
};

export default async function ServicesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let services: any[] = [];
  try {
    const response = await client.getEntries({ content_type: "services" });
    services = response.items || [];
  } catch (e) {
    console.error("Contentful fetch error:", e);
  }

  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900/70 absolute inset-0 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1548614606-52b4451f994b?q=80&w=2070&auto=format&fit=crop"
            alt="Professional roofing contractors at work installing and repairing shingles on a residential roof"
            fill
            sizes="100vw"
            quality={85}
            className="object-cover opacity-50 mix-blend-overlay z-0"
            priority
          />
        </div>
        <Container className="relative z-20 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">Our Roofing Services</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Comprehensive roofing solutions designed to protect your investment and enhance your property&apos;s value for years to come.
          </p>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <Container>
          <SectionHeader title="What We Can Do For You" subtitle="Expertise" align="center" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {services.map((item) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const service = item.fields as any;
              const title = service.title as string;
              const urlSlug = service.url || item.sys.id;
              
              const content = service.servicesContent as Document;
              let descText = "";
              if (content && content.content) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                descText = content.content.map((block: any) => 
                  block.nodeType === 'paragraph' && block.content 
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ? block.content.map((n: any) => n.nodeType === 'text' ? n.value : '').join('')
                  : ''
                ).join(' ').trim().substring(0, 300);
              }

              const Icon = getIconForService(title || "");

              return (
                <Link href={`/services/${urlSlug}`} key={item.sys.id} className="block group h-full">
                  <Card className="border-border/50 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col h-full">
                    <div className="h-2 w-full bg-primary/20 group-hover:bg-primary transition-colors shrink-0" />
                    <CardContent className="p-8 pt-8 flex-1 flex flex-col">
                      <div className="bg-primary/10 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shrink-0">
                        <Icon className="h-8 w-8" />
                      </div>
                      <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">{title}</h2>
                      <p className="text-foreground/70 mb-6 line-clamp-4 flex-1">
                        {descText || "Learn more about our professional roofing services."}
                      </p>
                      
                      <div className="mt-auto pt-6 border-t border-border flex items-center text-primary font-semibold text-sm">
                        VIEW <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
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
