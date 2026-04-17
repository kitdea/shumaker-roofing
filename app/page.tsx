import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Wrench, Home as HomeIcon, CheckCircle2, ArrowRight } from "lucide-react";
import { fetchPageSeo } from "@/lib/seo";
import { ProjectSlider } from "@/components/home/project-slider";
import { LogoSlider } from "@/components/home/logo-slider";
import { RoofleWidget } from "@/components/home/roofle-widget";

export async function generateMetadata() {
  return fetchPageSeo({
    path: "/",
    fallbackTitle: "Shumaker Roofing | Strong, Durable & Affordable Roofing",
    fallbackDesc:
      "Shumaker Roofing provides top-tier residential and commercial roofing services, installation, repair, and maintenance backed by 78 years of expertise.",
  });
}

export default async function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-800/60" /> {/* Dark overlay */}
          <Image
            src="https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=2070&auto=format&fit=crop"
            alt="Roofing Professionals"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
            priority
          />
        </div>

        <Container className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left pt-20">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-8 md:p-12 rounded-2xl max-w-2xl border border-border shadow-2xl">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">
              Affordable, Reliable, and Built to Last.
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-heading font-extrabold text-foreground leading-[1.1] mb-6">
              Strong Durable and Affordable Roofing
            </h1>
            <p className="text-foreground/70 text-lg mb-8 max-w-lg">
              When it comes to protecting your home your roof is the first line of defense we provide notch roofing service designed to safeguard.
            </p>
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base">
              SCHEDULE YOUR ROOF REPAIR
            </Button>
          </div>
        </Container>
      </section>

      {/* Services Snippet */}
      <section className="py-24 bg-muted/30">
        <Container>
          <SectionHeader
            title="Excellence in Every Project"
            subtitle="Our Services"
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: "Residential Roofing",
                desc: "Complete roof replacements, repairs, and inspections for your home with premium materials.",
                icon: HomeIcon,
                href: "/services/residential-roofing",
              },
              {
                title: "Commercial Roofing",
                desc: "Durable and efficient roofing solutions tailored for businesses and commercial properties.",
                icon: ShieldCheck,
                href: "/services/commercial-roofing",
              },
              {
                title: "Roof Repair",
                desc: "Fast and reliable repairs for leaks, storm damage, and worn materials to restore your roof's integrity.",
                icon: Wrench,
                href: "/services/roof-repair",
              },
            ].map((service) => (
              <Card key={service.title} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-background group">
                <CardHeader>
                  <div className="bg-accent text-primary w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <service.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {service.desc}
                  </p>
                  <Link href={service.href} className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                    Read More <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Project Gallery Slider */}
      <section className="bg-secondary" aria-label="Our roofing project gallery">
        <div className="py-12 text-center">
          <span className="text-primary font-bold tracking-wider uppercase text-sm block mb-2">
            Our Work
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white">
            Projects We&apos;re Proud Of
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto px-4">
            A glimpse into the quality craftsmanship and dedication we bring to every roofing project.
          </p>
        </div>
        <ProjectSlider />
      </section>

      {/* About Us Snippet */}
      <section className="py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeader
                title="Transforming Homes with Quality Roofing Solutions"
                subtitle="About Us"
                className="mb-6"
              />
              <p className="text-foreground/70 text-lg leading-relaxed mb-8">
                From repairs to full roof replacements, we treat each home as our own, providing personalized solutions tailored to meet the unique needs of our clients.
                With years of experience in the industry, our team of skilled professionals is dedicated to delivering top-tier services that prioritize durability, quality, and safety.
              </p>

              <ul className="flex flex-col gap-4 mb-10">
                {["Over 20 Years of Experience", "Licensed and Insured Professionals", "High-Quality Materials Warranty", "Free No-Obligation Estimates"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <Button size="lg" asChild>
                <Link href="/about">LEARN MORE</Link>
              </Button>
            </div>

            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?q=80&w=2070&auto=format&fit=crop"
                alt="Roofing Team"
                fill
                className="object-cover"
              />
              {/* Floating Stat Card */}
              <div className="absolute bottom-8 left-8 bg-primary text-white p-6 rounded-xl shadow-xl max-w-[200px]">
                <div className="text-4xl font-heading font-bold mb-2">2.5k+</div>
                <div className="text-white/90 font-medium">Projects Completed</div>
              </div>
            </div>
          </div>
        </Container>
      </section>



      {/* Certifications & Trust Badges */}
      <section
        className="py-14 bg-slate-900 overflow-hidden"
        aria-label="Trusted roofing certifications and partnerships"
      >
        <div className="text-center mb-10 px-4">
          <span className="text-primary font-bold tracking-wider uppercase text-sm block mb-2">
            Certifications &amp; Partnerships
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
            Trusted Roofing Contractor in Frederick, MD
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
            Backed by the industry&apos;s most respected certifications and manufacturer partnerships.
          </p>
        </div>
        <LogoSlider />
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <Container className="relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Ready to Protect Your Home?</h2>
          <p className="text-lg text-white/90 mb-10">
            Contact us today for a free inspection and estimate. Our experts are ready to help you find the best roofing solution for your needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-base bg-white text-primary hover:bg-white/90">
              GET A FREE ESTIMATE
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 border-white text-primary hover:text-white text-base hover:bg-white/10">
              CALL +1 234 567 8900
            </Button>
          </div>
        </Container>
      </section>


      {/* Instant Roof Quote Widget */}
      <section aria-label="Instant roof quote estimator" className="py-24 bg-muted/30">
        <Container>
          <SectionHeader
            title="Get an Instant Roof Quote"
            subtitle="Free Estimate"
            align="center"
          />
          <p className="text-center text-muted-foreground text-lg mt-4 mb-10 max-w-xl mx-auto">
            Answer a few quick questions and receive an accurate estimate for your roofing project no obligation required.
          </p>
          <RoofleWidget />
        </Container>
      </section>
    </div>
  );
}
