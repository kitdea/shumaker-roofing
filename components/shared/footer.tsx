import Link from "next/link";
import Script from "next/script";
import { Container } from "@/components/shared/container";
import { Home, Phone, Mail, MapPin, Clock } from "lucide-react";
import { fetchServiceSlugs } from "@/lib/sanity";
import { shortenServiceName } from "@/lib/utils";

async function getServices() {
  try {
    const items = await fetchServiceSlugs();
    return items.map((item) => ({
      title: shortenServiceName(item.title ?? ""),
      slug: item.slug?.current ?? item._id,
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
              <div className="bg-white p-2 flex items-center justify-center rounded-sm">
                {/* <Home className="h-6 w-6 text-white" /> */}
                <img
                  src="/favicon.svg"
                  alt="Shumaker Roofing Co. Inc."
                  className="h-6 w-6"
                  width={224}
                  height={56}
                />
              </div>
              <span className="text-2xl font-heading font-bold tracking-tight text-white">
                Shumaker<span className="text-primary">Roofing</span>
              </span>
            </Link>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed">
              We provide top-quality roofing solutions for residential and commercial properties. Built on trust, driven by excellence.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              {/* Facebook */}
              <a href="https://www.facebook.com/shumakerroofingcompany/" target="_blank" rel="noopener noreferrer" aria-label="Follow Shumaker Roofing on Facebook" className="bg-secondary-foreground/10 p-2 rounded-full hover:bg-primary transition-colors">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/shumakerroofingco/" target="_blank" rel="noopener noreferrer" aria-label="Follow Shumaker Roofing on Instagram" className="bg-secondary-foreground/10 p-2 rounded-full hover:bg-primary transition-colors">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              {/* X (formerly Twitter) */}
              <a href="https://x.com/ShumakerRoofs" target="_blank" rel="noopener noreferrer" aria-label="Follow Shumaker Roofing on X" className="bg-secondary-foreground/10 p-2 rounded-full hover:bg-primary transition-colors">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.857L1.255 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com/company/8989032" target="_blank" rel="noopener noreferrer" aria-label="Follow Shumaker Roofing on LinkedIn" className="bg-secondary-foreground/10 p-2 rounded-full hover:bg-primary transition-colors">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="https://www.youtube.com/channel/UCn22J2Re6gtplTQEaO8bBWA" target="_blank" rel="noopener noreferrer" aria-label="Follow Shumaker Roofing on YouTube" className="bg-secondary-foreground/10 p-2 rounded-full hover:bg-primary transition-colors">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              {/* TikTok */}
              <a href="https://www.tiktok.com/@shumakerroofing" target="_blank" rel="noopener noreferrer" aria-label="Follow Shumaker Roofing on TikTok" className="bg-secondary-foreground/10 p-2 rounded-full hover:bg-primary transition-colors">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.03a8.17 8.17 0 004.78 1.53V7.12a4.85 4.85 0 01-1.01-.43z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-white mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-1/2 after:h-0.5 after:bg-primary">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">Careers</Link></li>
              <li><Link href="/services" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">Services</Link></li>
              <li><Link href="/projects" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">Projects</Link></li>
              <li><Link href="/faqs" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">FAQs</Link></li>
              <li><Link href="/blog" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-white mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-1/2 after:h-0.5 after:bg-primary">
              Our Services
            </h3>
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
            <h3 className="text-lg font-heading font-semibold text-white mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-1/2 after:h-0.5 after:bg-primary">
              Get in Touch
            </h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-secondary-foreground/70 text-sm leading-relaxed"><a href="https://maps.app.goo.gl/ko7pDrwKnreAF5DQ9" target="_blank">26 Water St. Frederick, MD 21701</a></span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-secondary-foreground/70 text-sm"><a href="tel:+13016620533">+1 301-662-0533</a></span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-secondary-foreground/70 text-sm"><a href="mailto:info@shumakerroofing.com">info@shumakerroofing.com</a></span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <span className="text-secondary-foreground/70 text-sm">Available Mon–Fri 8am–5pm</span>
              </li>
            </ul>
            <h3 className="text-lg font-heading font-semibold text-white mt-6 mb-4 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-1/2 after:h-0.5 after:bg-primary">
              MHIC License
            </h3>
            <ul className="flex flex-col gap-2 list-disc list-inside" aria-label="Contractor license numbers">
              {[
                { number: "#4503", state: "MHIC" },
                { number: "#160849", state: "PA" },
                { number: "#062924", state: "WV" },
                { number: "#2705191905", state: "VA" },
              ].map(({ number, state }) => (
                <li key={state} className="text-secondary-foreground/70 text-sm">
                  <span className="text-white font-medium">{number}</span> {state}
                </li>
              ))}
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
      <Script
        src="https://widgets.leadconnectorhq.com/loader.js"
        data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
        data-widget-id="69b4bc502e3176149257552e"
        strategy="lazyOnload"
      />
    </footer>
  );
}
