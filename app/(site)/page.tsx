export const revalidate = 3600;

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { fetchPageSeo } from "@/lib/seo";
import { ProjectSlider } from "@/components/home/project-slider";
import { fetchServicesForListing, fetchHeroBanner, fetchProjectSlides } from "@/lib/sanity";
import { CertificationsSection } from "@/components/shared/certifications-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { getServiceIcon, SITE_URL, FALLBACK_BLOG_IMAGE } from "@/lib/utils";

const FALLBACK_HERO_IMAGE_URL = FALLBACK_BLOG_IMAGE;

export async function generateMetadata() {
  const hero = await fetchHeroBanner().catch(() => null);
  const heroImageUrl = hero?.backgroundImageUrl ?? FALLBACK_HERO_IMAGE_URL;

  return fetchPageSeo({
    fallbackTitle: "Roofing Contractor in Frederick MD | Shumaker Roofing",
    fallbackDesc:
      "Expert roofing contractor in Frederick, MD. Shumaker Roofing provides top-tier residential and commercial roofing services, installation, and  repair.",
    fallbackImage: heroImageUrl,
    canonicalPath: "/",
  });
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "RoofingContractor"],
  "@id": `${SITE_URL}/#organization`,
  "name": "Shumaker Roofing Company",
  "url": SITE_URL,
  "logo": `${SITE_URL}/logo.png`,
  "image": FALLBACK_BLOG_IMAGE,
  "description": "Expert roofing contractor in Frederick, MD. Shumaker Roofing provides top-tier residential and commercial roofing services, installation, and  repair.",
  "telephone": "+1-301-662-0533",
  "email": "info@shumakerroofing.com",
  "address": [
    {
      "@type": "PostalAddress",
      "streetAddress": "26 Water St.",
      "addressLocality": "Frederick",
      "addressRegion": "MD",
      "postalCode": "21701",
      "addressCountry": "US",
    },
    {
      "@type": "PostalAddress",
      "streetAddress": "6 W Washington St Suite 208",
      "addressLocality": "Hagerstown",
      "addressRegion": "MD",
      "postalCode": "21740",
      "addressCountry": "US",
    },
    {
      "@type": "PostalAddress",
      "streetAddress": "12001 Sunrise Valley Dr",
      "addressLocality": "Reston",
      "addressRegion": "VA",
      "postalCode": "20191",
      "addressCountry": "US",
    },
  ],
  "areaServed": [
    { "@type": "State", "name": "Maryland" },
    { "@type": "State", "name": "Virginia" },
    { "@type": "State", "name": "Pennsylvania" },
    { "@type": "State", "name": "West Virginia" },
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "08:00",
    "closes": "17:00",
  },
  "sameAs": [
    "https://www.facebook.com/shumakerroofingcompany/",
    "https://www.instagram.com/shumakerroofingco/",
  ],
  "priceRange": "$$",
};

export default async function Home() {
  type ServiceCard = { _id: string; title: string; slug?: { current: string }; excerpt?: string };

  const [services, hero, projectSlides] = await Promise.all([
    fetchServicesForListing().catch((): ServiceCard[] => []) as Promise<ServiceCard[]>,
    fetchHeroBanner().catch(() => null),
    fetchProjectSlides().catch(() => []),
  ]);

  const heroBgUrl = hero?.backgroundImageUrl ?? FALLBACK_HERO_IMAGE_URL;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-800/60" /> {/* Dark overlay */}
          <Image
            src={heroBgUrl}
            alt="Roofing Professionals"
            fill
            sizes="100vw"
            className="object-cover opacity-60 mix-blend-overlay"
            quality={60}
            priority
            fetchPriority="high"
          />
        </div>

        <Container className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left pt-20">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-8 md:p-12 rounded-2xl max-w-2xl border border-border shadow-2xl">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">
              {hero?.tagline ?? "Affordable, Reliable, and Built to Last."}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-heading font-extrabold text-foreground leading-[1.1] mb-6">
              {hero?.heading ?? "Strong Durable and Affordable Roofing"}
            </h1>
            {hero?.subheading && (
              <p className="text-foreground/80 text-xl font-heading font-semibold mb-4 max-w-lg">
                {hero.subheading}
              </p>
            )}
            <p className="text-foreground/70 text-lg mb-8 max-w-lg whitespace-pre-line">
              {hero?.bodyText ?? "When it comes to protecting your home your roof is the first line of defense we provide top-notch roofing service designed to safeguard."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-bold uppercase" asChild>
                <Link href={hero?.buttonLink ?? "/book-appointment"}>{hero?.buttonText ?? "SCHEDULE YOUR ROOF REPAIR"}</Link>
              </Button>
              {hero?.phoneNumber && (
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-14 px-8 text-base font-bold uppercase border-2 border-primary bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground"
                  asChild
                >
                  <a href={`tel:${hero.phoneNumber.replace(/[^\d+]/g, "")}`}>
                    Call {hero.phoneNumber}
                  </a>
                </Button>
              )}
            </div>
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
            {services.map((item) => {
              const title = item.title as string;
              const href = `/services/${item.slug?.current ?? item._id}`;
              const Icon = getServiceIcon(title);
              const desc = ((item.excerpt as string) || "").trim().substring(0, 200);

              return (
                <Link href={href} key={item._id} className="block group h-full">
                  <Card className="border-border/50 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col h-full">
                    <div className="h-2 w-full bg-primary/20 group-hover:bg-primary transition-colors shrink-0" />
                    <CardContent className="p-8 pt-8 flex-1 flex flex-col">
                      <div className="bg-primary/10 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shrink-0">
                        <Icon className="h-8 w-8" />
                      </div>
                      <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">{title}</h2>
                      <p className="text-foreground/70 mb-6 line-clamp-4 flex-1">
                        {desc || "Learn more about our professional roofing services."}
                      </p>
                      <div className="mt-auto pt-6 border-t border-border flex items-center text-primary font-semibold text-sm">
                        Read More <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
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
        <ProjectSlider slides={projectSlides} />
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
                {["Over 78 Years of Experience", "Licensed and Insured Professionals", "High-Quality Materials Warranty", "Free No-Obligation Estimates"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <Button size="lg" asChild>
                  <Link href="/about" className="uppercase font-bold">Learn More About Shumaker Roofing</Link>
              </Button>
            </div>

            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                  src="https://cdn.sanity.io/images/rg9pahe7/production/b9f43146aaeedf62d5e94e2b29f409f70492cf49-2052x1540.jpg"
                alt="Shumaker Roofing Company"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Floating Stat Card */}
              <div className="absolute bottom-8 left-8 bg-primary text-white p-6 rounded-xl shadow-xl max-w-[300px]">
                  <div className="text-2xl font-heading font-bold mb-2">Call Now</div>
                  <div className="text-white/90 font-bold"><a href="tel:+13016620533">+1 301-662-0533</a></div>
              </div>
            </div>
          </div>
        </Container>
      </section>



      <CertificationsSection />

      {/* Testimonials Snippet */}
      <section className="py-24 bg-muted/30">
        <Container>
          <SectionHeader
            title="What Our Customers Are Saying"
            subtitle="Testimonials"
            align="center"
          />
          <TestimonialsSection />
          <div className="flex justify-center mt-10">
            <Button size="lg" asChild>
              <Link href="/testimonials" className="uppercase font-bold">
                Read More Testimonials
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <Container className="relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Ready to Protect Your Home?</h2>
          <p className="text-lg text-white/90 mb-10">
            Contact us today for a free inspection and estimate. Our experts are ready to help you find the best roofing solution for your needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-base font-bold bg-white text-primary hover:bg-white/90" asChild>
              <Link href="/contact">GET A FREE ESTIMATE</Link>
            </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-primary hover:text-white text-base font-bold hover:bg-white/10" asChild>
              <a href="tel:+13016620533">CALL +1 301-662-0533</a>
            </Button>
          </div>
        </Container>
      </section>


    </div>
    </>
  );
}
