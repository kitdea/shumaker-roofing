import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

async function getServiceFromSlug(slug: string) {
  let service = null;

  try {
    const response = await client.getEntries({ content_type: 'services', 'fields.url': slug, limit: 1 });
    if (response.items.length > 0) {
      service = response.items[0];
    }
  } catch {
    // ignore
  }

  if (!service) {
    try {
      const byId = await client.getEntry(slug);
      if (byId && byId.sys.contentType.sys.id === 'services') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        service = byId as any;
      }
    } catch {
      // ignore
    }
  }

  return service;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const rawService = await getServiceFromSlug(params.slug);
  if (!rawService) {
    return { title: "Service Not Found - Shumaker Roofing" };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const service = rawService.fields as any;
  const description = "Learn more about our " + service.title.toLowerCase() + " services. Expert roofing solutions provided by Shumaker Roofing professionals.";
  
  return {
    title: `${service.title} Services | Shumaker Roofing`,
    description: description,
    keywords: `${service.title.toLowerCase()}, specialty roofing, expert roofers, Shumaker Roofing services`,
    openGraph: {
      title: `${service.title} Services | Shumaker Roofing`,
      description: description,
      type: "website",
    }
  };
}

export default async function ServiceDetailsPage({ params }: { params: { slug: string } }) {
  const rawService = await getServiceFromSlug(params.slug);

  if (!rawService) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serviceFields = rawService.fields as any;

  const imageUrl = serviceFields.servicesImage?.fields?.file?.url
    ? `https:${serviceFields.servicesImage.fields.file.url}`
    : "https://images.unsplash.com/photo-1548614606-52b4451f994b?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Article Header */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex flex-col justify-end pb-16 bg-secondary">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-slate-900/75 absolute inset-0 z-10" />
          <Image
            src={imageUrl}
            alt={`${serviceFields.title || "Shumaker Roofing Service"} - Banner Image`}
            fill
            sizes="100vw"
            quality={85}
            className="object-cover opacity-60 mix-blend-overlay z-0"
            priority
          />
        </div>
        <Container className="relative z-20">
          <Link href="/services" className="inline-flex items-center text-primary/90 hover:text-primary transition-colors mb-6 font-medium text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Services
          </Link>
          <div className="flex gap-2 flex-wrap mb-4">
            <div className="bg-primary/20 text-white border border-primary/30 text-xs font-bold uppercase py-1.5 px-3 rounded-md inline-block backdrop-blur-sm shadow-sm">
              Service
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4 max-w-4xl leading-tight">
            {serviceFields.title}
          </h1>
        </Container>
      </section>

      <Container className="mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-8 prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-p:text-foreground/90 [&_h2]:text-[1.8rem] [&_h2]:font-extrabold [&_h2]:mt-0 [&_h2]:mb-4 [&_h3]:text-[1.4rem] [&_h3]:font-bold [&_h3]:mt-0 [&_h3]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:mb-2 [&_p]:mb-6 [&_p]:leading-relaxed">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {serviceFields.servicesContent ? documentToReactComponents(serviceFields.servicesContent as any) : null}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            <div className="bg-primary text-primary-foreground p-8 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -top-8 opacity-10 blur-xl">
                <div className="w-40 h-40 bg-white rounded-full"></div>
              </div>
              <h3 className="text-xl font-heading font-bold mb-4 text-white relative z-10">Need Roofing Help?</h3>
              <p className="text-primary-foreground/90 mb-8 text-sm text-white/90 relative z-10 leading-relaxed">
                If you are dealing with roofing issues or want to learn more about our <strong>{serviceFields.title}</strong> service, our expert team is ready to provide top-notch service and a free estimate.
              </p>
              <Button variant="secondary" size="lg" className="w-full font-bold text-primary hover:bg-white relative z-10 shadow-md" asChild>
                <Link href="/contact">Get a Free Quote</Link>
              </Button>
            </div>
            
            <div className="bg-muted/50 p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-heading font-bold mb-4">Why Choose Us?</h3>
              <ul className="space-y-4">
                {[
                  "Licensed & Insured Professionals",
                  "Decades of Experience",
                  "High-Quality Materials",
                  "Exceptional Customer Service",
                  "Fast & Reliable",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-sm font-medium text-foreground/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
