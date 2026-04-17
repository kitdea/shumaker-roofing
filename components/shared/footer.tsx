import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Home, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { client } from "@/lib/contentful";
import { slugify } from "@/lib/utils";

async function getServices() {
  try {
    const response = await client.getEntries({ content_type: "services" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response.items || []).map((item: any) => ({
      title: item.fields.title as string,
      slug: item.fields.title ? slugify(item.fields.title as string) : item.sys.id,
    }));
  } catch {
    return [];
  }
}

export async function Footer() {
  const services = await getServices();

  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 flex items-center justify-center rounded-sm">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold tracking-tight text-white">
                Shumaker<span className="text-primary">Roofing</span>
              </span>
            </Link>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed">
              We provide top-quality roofing solutions for residential and commercial properties. Built on trust, driven by excellence.
            </p>
            <div className="flex gap-4 mt-2">
              <Link href="#" className="bg-secondary-foreground/10 p-2 rounded-full hover:bg-primary transition-colors">
                <MapPin className="h-4 w-4" />
              </Link>
              <Link href="#" className="bg-secondary-foreground/10 p-2 rounded-full hover:bg-primary transition-colors">
                <Phone className="h-4 w-4" />
              </Link>
              <Link href="#" className="bg-secondary-foreground/10 p-2 rounded-full hover:bg-primary transition-colors">
                <MessageCircle className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-semibold text-white mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-1/2 after:h-0.5 after:bg-primary">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">Services</Link></li>
              <li><Link href="/news" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-heading font-semibold text-white mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-1/2 after:h-0.5 after:bg-primary">
              Our Services
            </h4>
            <ul className="flex flex-col gap-3">
              {services.length > 0 ? (
                services.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/services/${service.slug}`} className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">
                      {service.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li><Link href="/services" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">View All Services</Link></li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-heading font-semibold text-white mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-1/2 after:h-0.5 after:bg-primary">
              Get in Touch
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-secondary-foreground/70 text-sm leading-relaxed">123 Roofing Way, Suite 100<br />Cityville, ST 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-secondary-foreground/70 text-sm">+1 234 567 8900</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-secondary-foreground/70 text-sm">info@shumakerroofing.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-foreground/50 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Shumaker Roofing. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-secondary-foreground/50 hover:text-primary text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="text-secondary-foreground/50 hover:text-primary text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
