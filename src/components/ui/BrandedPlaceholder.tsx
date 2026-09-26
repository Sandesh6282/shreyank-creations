"use client";

import React from "react";
import { Sparkles, ShoppingBag } from "lucide-react";

interface BrandedPlaceholderProps {
  title?: string;
  subtitle?: string;
  category?: string;
  aspectRatio?: string;
  className?: string;
}

export function BrandedPlaceholder({
  title = "SHREYANK CREATION",
  subtitle = "Handmade Fabric Creation",
  category,
  aspectRatio = "aspect-square",
  className = "",
}: BrandedPlaceholderProps) {
  return (
    <div
      className={`relative w-full ${aspectRatio} rounded-2xl bg-gradient-to-br from-sand-light via-cream-surface to-sand/40 border border-sand/80 shadow-inner flex flex-col items-center justify-center p-6 text-center overflow-hidden ${className}`}
    >
      {/* Subtle Background Pattern Elements */}
      <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-terracotta/10 blur-xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-sage/10 blur-xl pointer-events-none" />

      {/* Decorative Border Frame */}
      <div className="absolute inset-3 border border-dashed border-sand/60 rounded-xl pointer-events-none" />

      {/* Center Icon Badge */}
      <div className="w-14 h-14 rounded-full bg-cream-surface border border-sand shadow-sm flex items-center justify-center text-terracotta mb-3 z-10">
        <Sparkles className="w-7 h-7 text-terracotta" />
      </div>

      {/* Category Badge if provided */}
      {category && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta bg-terracotta/10 px-2.5 py-0.5 rounded-full mb-1.5 z-10">
          {category}
        </span>
      )}

      {/* Title */}
      <h4 className="font-serif font-bold text-base sm:text-lg text-espresso leading-snug z-10 max-w-[85%]">
        {title}
      </h4>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs text-taupe mt-1 font-sans font-medium z-10">
          {subtitle}
        </p>
      )}

      {/* Bottom Brand Stamp */}
      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-taupe font-semibold tracking-wider uppercase z-10">
        <ShoppingBag className="w-3 h-3 text-terracotta" />
        <span>Handmade in India</span>
      </div>
    </div>
  );
}
