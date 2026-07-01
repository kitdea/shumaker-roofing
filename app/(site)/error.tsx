"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Home, Phone, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col w-full min-h-[70vh]">
      <section className="flex-1 flex items-center py-24">
        <Container className="text-center max-w-2xl">
          <div className="bg-primary/10 text-primary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl md:text-5xl font-heading font-extrabold">!</span>
          </div>

          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">
            Something Went Wrong
          </span>

          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground leading-[1.1] mb-6">
            We Hit a Snag
          </h1>

          <p className="text-foreground/70 text-lg mb-10 max-w-lg mx-auto">
            An unexpected error occurred while loading this page. Try again, or head back home.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-14 px-8 text-base font-bold uppercase" onClick={() => reset()}>
              <RotateCcw className="h-5 w-5 mr-2" />
              Try Again
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold uppercase" asChild>
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
        </Container>
      </section>
    </div>
  );
}
