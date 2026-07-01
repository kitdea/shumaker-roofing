import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    quote:
      "Shumaker Roofing replaced our roof after storm damage and the entire process was seamless. Professional crew, fair price, and they cleaned up perfectly afterward.",
    name: "Karen T.",
    location: "Frederick, MD",
  },
  {
    quote:
      "From the free estimate to the final walkthrough, everyone we worked with was honest and responsive. You can tell they take pride in their craftsmanship.",
    name: "Mike D.",
    location: "Hagerstown, MD",
  },
  {
    quote:
      "We've used Shumaker twice now for repairs and a full replacement. Always on time, always upfront about pricing, and the roof looks fantastic.",
    name: "Sandra L.",
    location: "Reston, VA",
  },
];

export function TestimonialsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {TESTIMONIALS.map((t) => (
        <Card key={t.name} className="border-border/50 shadow-md flex flex-col h-full">
          <CardContent className="p-8 flex flex-col h-full">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-foreground/80 leading-relaxed mb-6 flex-1">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-auto pt-4 border-t border-border">
              <p className="font-heading font-bold text-foreground">{t.name}</p>
              <p className="text-sm text-foreground/60">{t.location}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
