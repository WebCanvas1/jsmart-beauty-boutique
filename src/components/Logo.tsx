import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "md",
  asLink = true,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
}) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  } as const;

  const mark = (
    <span className={cn("wordmark inline-flex items-baseline gap-1.5", sizes[size], className)}>
      <span className="text-primary">Jsmart</span>
      <span className="text-foreground">Beauty</span>
    </span>
  );

  if (!asLink) return mark;
  return (
    <Link to="/" aria-label="Jsmart Beauty home" className="shrink-0">
      {mark}
    </Link>
  );
}