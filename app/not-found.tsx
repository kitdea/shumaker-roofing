import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Home, Phone, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Page Not Found | Shumaker Roofing",
  description: "The page you're looking for doesn't exist. Return home or contact Shumaker Roofing.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col w-full min-h-[70vh]">
      <section className="flex-1 flex items-center py-24">
        <Container className="text-center max-w-2xl">
          <div className="bg-primary/10 text-primary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl md:text-6xl font-heading font-extrabold">404</span>
          </div>

          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">
            Page Not Found
          </span>

          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground leading-[1.1] mb-6">
            We Can&apos;t Find That Page
          </h1>

          <p className="text-foreground/70 text-lg mb-10 max-w-lg mx-auto">
            The page you&apos;re looking for may have been moved or no longer exists. Let us help you get back on track.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-14 px-8 text-base font-bold uppercase" asChild>
              <Link href="/">
                <Home className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold uppercase" asChild>
              <a href="tel:+13016620533">
                <Phone className="h-5 w-5 mr-2" />
                Call Us
              </a>
            </Button>
          </div>

          <div className="mt-16 pt-10 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              { label: "Our Services", href: "/services" },
              { label: "Service Areas", href: "/service-areas" },
              { label: "Contact Us", href: "/contact" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <span className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                  {label}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA strip */}
      <section className="py-16 bg-primary text-primary-foreground">
        <Container className="text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
            Need a Roofing Expert?
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Our team is ready to help with any roofing question or project.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="h-14 px-8 text-base font-bold bg-white text-primary hover:bg-white/90"
            asChild
          >
            <Link href="/contact">GET A FREE ESTIMATE</Link>
          </Button>
        </Container>
      </section>
    </div>
  );
}
