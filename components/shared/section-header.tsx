import { cn } from "@/lib/utils";

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
}

export function SectionHeader({
  title,
  subtitle,
  align = "left",
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 mb-10 w-full",
        {
          "text-center items-center mx-auto": align === "center",
          "text-right items-end ml-auto": align === "right",
          "text-left items-start": align === "left",
        },
        className
      )}
      {...props}
    >
      {subtitle && (
        <span className="text-primary font-semibold tracking-wider uppercase text-sm md:text-base">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
        {title}
      </h2>
    </div>
  );
}
