"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Menu, X, Phone, Home, ChevronDown } from "lucide-react";
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
const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileLocationsOpen, setMobileLocationsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  const closeAll = () => {
    setIsOpen(false);
  setMobileServicesOpen(false);
    setMobileLocationsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 flex items-center justify-center rounded-sm">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-heading font-bold tracking-tight">
              Shumaker<span className="text-primary">Roofing</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              About Us
            </Link>

            {/* Services dropdown */}
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

            {/* Service Areas dropdown */}
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

          {/* CTA & Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button size="lg" className="rounded-full gap-2 px-6">
              <Phone className="h-4 w-4" />
              <span className="font-semibold">+1 234 567 8900</span>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              className="p-2 text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Nav */}
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

            <Link
              href="/about"
              onClick={closeAll}
              className="block text-base font-medium text-foreground hover:text-primary p-2"
            >
              About Us
            </Link>

            {/* Mobile Services */}
            <div>
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="flex items-center justify-between w-full text-base font-medium text-foreground hover:text-primary p-2 text-left"
              >
                <Link href="/services" onClick={(e) => { e.stopPropagation(); closeAll(); }}>
                  Services
                </Link>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobileServicesOpen && services.length > 0 && (
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

            {/* Mobile Service Areas */}
            <div>
              <button
                onClick={() => setMobileLocationsOpen(!mobileLocationsOpen)}
                className="flex items-center justify-between w-full text-base font-medium text-foreground hover:text-primary p-2 text-left"
              >
                <Link href="/service-areas" onClick={(e) => { e.stopPropagation(); closeAll(); }}>
                  Service Areas
                </Link>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${mobileLocationsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobileLocationsOpen && (
                <div className="pl-4 flex flex-col gap-1 pb-1">
                  <Link
                    href="/service-areas"
                    onClick={closeAll}
                    className="block text-sm font-semibold text-primary hover:text-primary p-2"
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
              <Button className="w-full gap-2 rounded-full">
                <Phone className="h-4 w-4" />
                <span>+1 234 567 8900</span>
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
