import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "sage";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta disabled:opacity-50 disabled:cursor-not-allowed rounded-md cursor-pointer";

    const variants = {
      primary: "bg-terracotta text-cream hover:bg-terracotta-hover shadow-sm active:scale-[0.98]",
      secondary: "bg-sand-light text-espresso hover:bg-sand border border-sand shadow-card active:scale-[0.98]",
      sage: "bg-sage text-cream hover:bg-sage-dark shadow-sm active:scale-[0.98]",
      outline: "border border-espresso/20 text-espresso hover:border-espresso hover:bg-espresso/5 active:scale-[0.98]",
      ghost: "text-espresso hover:bg-sand/40 active:scale-[0.98]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs font-semibold tracking-wider uppercase",
      md: "px-5 py-2.5 text-sm font-medium",
      lg: "px-7 py-3.5 text-base font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
