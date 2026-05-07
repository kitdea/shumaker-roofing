"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  category: string;
  faqs: FaqItem[];
}

function FaqItem({ question, answer }: FaqItem) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-background hover:bg-muted/50 transition-colors"
      >
        <span className="font-heading font-semibold text-foreground text-base leading-snug">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-primary shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 pt-2 bg-muted/20 text-foreground/70 text-sm leading-relaxed border-t border-border/40">
          {answer}
        </div>
      )}
    </div>
  );
}

export function FaqAccordion({ categories }: { categories: FaqCategory[] }) {
  return (
    <div className="mt-4 flex flex-col gap-16">
      {categories.map((cat) => (
        <div key={cat.category}>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
            {cat.category}
          </h2>
          <div className="flex flex-col gap-3">
            {cat.faqs.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
