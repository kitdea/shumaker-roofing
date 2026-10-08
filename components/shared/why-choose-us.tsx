const DEFAULT_ITEMS = [
  "Licensed & Insured Professionals",
  "Decades of Experience",
  "High-Quality Materials",
  "Exceptional Customer Service",
  "Fast & Reliable",
] as const;

/** Trust-signal bullet list used in the Service Areas and Services page sidebars.
 *  Pass `items` to override the default copy for a specific page template. */
export function WhyChooseUs({ items }: { items?: readonly string[] } = {}) {
  const bullets = items ?? DEFAULT_ITEMS;

  return (
    <div className="bg-muted/50 p-8 rounded-2xl border border-border shadow-sm">
      <h3 className="text-xl font-heading font-bold mb-4">Why Choose Us?</h3>
      <ul className="space-y-4">
        {bullets.map((item) => (
          <li key={item} className="flex items-center text-sm font-medium text-foreground/80">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
