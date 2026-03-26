"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "News", href: "/news" },
  { name: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
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
          <Container className="py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-base font-medium text-foreground hover:text-primary p-2"
              >
                {link.name}
              </Link>
            ))}
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
