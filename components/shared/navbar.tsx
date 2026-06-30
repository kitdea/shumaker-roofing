"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { ThemeToggle } from "@/components/shared/theme-toggle";

interface NavLink {
  name: string;
  href: string;
}

interface NavbarProps {
  services?: NavLink[];
  locations?: NavLink[];
}

export function Navbar({ services = [], locations = [] }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const handleMouseEnter = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  const toggleMobileSection = (name: string) => {
    setOpenMobileSection((prev) => (prev === name ? null : name));
  };

  const closeAll = () => {
    setIsOpen(false);
    setOpenMobileSection(null);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/85 dark:bg-slate-900/90 dark:supports-[backdrop-filter]:bg-slate-900/85">
      <div className="bg-primary text-primary-foreground">
        <Container>
          <div className="flex h-10 items-center justify-end gap-6 text-sm">
            <a
              href="tel:+13016620533"
              className="flex items-center gap-2 font-medium hover:text-secondary transition-colors"
            >
              <Phone className="h-4 w-4 shrink-0" />
              <span>+1 301-662-0533</span>
            </a>
            <a
              href="mailto:info@shumakerroofing.com"
              className="flex items-center gap-2 font-medium hover:text-secondary transition-colors"
            >
              <Mail className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">info@shumakerroofing.com</span>
            </a>
          </div>
        </Container>
      </div>
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="Shumaker Roofing Co. Inc."
              className="h-14 w-auto dark:hidden"
              width={224}
              height={56}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-dark.svg"
              alt="Shumaker Roofing Co. Inc."
              className="h-14 w-auto hidden dark:block"
              width={224}
              height={56}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("about")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/about"
                className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                About Us
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${openDropdown === "about" ? "rotate-180" : ""}`}
                />
              </Link>
              {openDropdown === "about" && (
                <div className="absolute left-0 top-full pt-2 w-44 z-50">
                  <div className="bg-background border border-border/60 rounded-lg shadow-lg py-1 overflow-hidden">
                    <Link
                      href="/faqs"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
                    >
                      FAQs
                    </Link>
                    <Link
                      href="/projects"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
                    >
                      Our Projects
                    </Link>
                    <Link
                      href="/roofs-for-heroes"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
                    >
                      Roofs for Heroes
                    </Link>
                    <Link
                      href="/testimonials"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
                    >
                      Testimonials
                    </Link>
                    <Link
                      href="/careers"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
                    >
                      Careers
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("services")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/services"
                className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                Services
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${openDropdown === "services" ? "rotate-180" : ""}`}
                />
              </Link>
              {openDropdown === "services" && services.length > 0 && (
                <div className="absolute left-0 top-full pt-2 w-56 z-50">
                  <div className="bg-background border border-border/60 rounded-lg shadow-lg py-1 overflow-hidden">
                    {services.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("locations")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/service-areas"
                className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                Service Areas
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${openDropdown === "locations" ? "rotate-180" : ""}`}
                />
              </Link>
              {openDropdown === "locations" && (
                <div className="absolute left-0 top-full pt-2 w-56 z-50">
                  <div className="bg-background border border-border/60 rounded-lg shadow-lg py-1 overflow-y-auto max-h-80">
                    <Link
                      href="/service-areas"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2.5 text-sm font-semibold text-primary hover:bg-muted transition-colors border-b border-border/40"
                    >
                      View All Areas
                    </Link>
                    {locations.map((loc) => (
                      <Link
                        key={loc.href}
                        href={loc.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
                      >
                        {loc.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button size="lg" className="font-bold uppercase hover:text-white gap-2 px-6" asChild>
              <Link href="/book-appointment">Schedule Now</Link>
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              className="p-2 text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </Container>

      {isOpen && (
        <div className="md:hidden border-t border-border">
          <Container className="py-4 flex flex-col gap-1">
            <Link
              href="/"
              onClick={closeAll}
              className="block text-base font-medium text-foreground hover:text-primary p-2"
            >
              Home
            </Link>

            <div>
              <div className="flex items-center justify-between w-full text-base font-medium text-foreground p-2">
                <Link
                  href="/about"
                  onClick={closeAll}
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </Link>
                <button
                  onClick={() => toggleMobileSection("about")}
                  aria-label="Toggle about menu"
                  aria-expanded={openMobileSection === "about"}
                  className="hover:text-primary transition-colors p-1"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${openMobileSection === "about" ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
              {openMobileSection === "about" && (
                <div className="pl-4 flex flex-col gap-1 pb-1">
                  <Link
                    href="/faqs"
                    onClick={closeAll}
                    className="block text-sm font-medium text-foreground/70 hover:text-primary p-2"
                  >
                    FAQs
                  </Link>
                  <Link
                    href="/projects"
                    onClick={closeAll}
                    className="block text-sm font-medium text-foreground/70 hover:text-primary p-2"
                  >
                    Our Projects
                  </Link>
                  <Link
                    href="/roofs-for-heroes"
                    onClick={closeAll}
                    className="block text-sm font-medium text-foreground/70 hover:text-primary p-2"
                  >
                    Roofs for Heroes
                  </Link>
                  <Link
                    href="/testimonials"
                    onClick={closeAll}
                    className="block text-sm font-medium text-foreground/70 hover:text-primary p-2"
                  >
                    Testimonials
                  </Link>
                  <Link
                    href="/careers"
                    onClick={closeAll}
                    className="block text-sm font-medium text-foreground/70 hover:text-primary p-2"
                  >
                    Careers
                  </Link>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between w-full text-base font-medium text-foreground p-2">
                <Link
                  href="/services"
                  onClick={closeAll}
                  className="hover:text-primary transition-colors"
                >
                  Services
                </Link>
                <button
                  onClick={() => toggleMobileSection("services")}
                  aria-label="Toggle services menu"
                  aria-expanded={openMobileSection === "services"}
                  className="hover:text-primary transition-colors p-1"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${openMobileSection === "services" ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
              {openMobileSection === "services" && services.length > 0 && (
                <div className="pl-4 flex flex-col gap-1 pb-1">
                  {services.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      onClick={closeAll}
                      className="block text-sm font-medium text-foreground/70 hover:text-primary p-2"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between w-full text-base font-medium text-foreground p-2">
                <Link
                  href="/service-areas"
                  onClick={closeAll}
                  className="hover:text-primary transition-colors"
                >
                  Service Areas
                </Link>
                <button
                  onClick={() => toggleMobileSection("locations")}
                  aria-label="Toggle service areas menu"
                  aria-expanded={openMobileSection === "locations"}
                  className="hover:text-primary transition-colors p-1"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${openMobileSection === "locations" ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
              {openMobileSection === "locations" && (
                <div className="pl-4 flex flex-col gap-1 pb-1">
                  <Link
                    href="/service-areas"
                    onClick={closeAll}
                    className="block text-sm font-semibold text-primary p-2"
                  >
                    View All Areas
                  </Link>
                  {locations.map((loc) => (
                    <Link
                      key={loc.href}
                      href={loc.href}
                      onClick={closeAll}
                      className="block text-sm font-medium text-foreground/70 hover:text-primary p-2"
                    >
                      {loc.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/blog"
              onClick={closeAll}
              className="block text-base font-medium text-foreground hover:text-primary p-2"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              onClick={closeAll}
              className="block text-base font-medium text-foreground hover:text-primary p-2"
            >
              Contact Us
            </Link>

            <div className="pt-2">
              <Button className="w-full rounded-full" asChild>
                <Link href="/book-appointment" onClick={closeAll}>Book Appointment</Link>
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
