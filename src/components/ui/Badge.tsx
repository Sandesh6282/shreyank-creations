import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "terracotta" | "sage" | "sand" | "espresso";
}

export function Badge({ className, variant = "terracotta", children, ...props }: BadgeProps) {
  const variants = {
    terracotta: "bg-terracotta/10 text-terracotta border-terracotta/20",
    sage: "bg-sage/10 text-sage border-sage/20",
    sand: "bg-sand text-espresso/80 border-sand",
    espresso: "bg-espresso text-cream border-espresso",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide uppercase",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
