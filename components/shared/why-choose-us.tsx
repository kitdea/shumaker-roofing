export function WhyChooseUs() {
  return (
    <div className="bg-muted/50 p-8 rounded-2xl border border-border shadow-sm">
      <h3 className="text-xl font-heading font-bold mb-4">Why Choose Us?</h3>
      <ul className="space-y-4">
        {[
          "Licensed & Insured Professionals",
          "Decades of Experience",
          "High-Quality Materials",
          "Exceptional Customer Service",
          "Fast & Reliable",
        ].map((item) => (
          <li key={item} className="flex items-center text-sm font-medium text-foreground/80">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
