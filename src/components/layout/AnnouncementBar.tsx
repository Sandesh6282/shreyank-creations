"use client";

import React, { useState } from "react";
import { Sparkles, X } from "lucide-react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-espresso text-cream-muted text-xs py-2 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
        <Sparkles className="w-3.5 h-3.5 text-terracotta shrink-0 animate-pulse" />
        <span>
          <strong className="text-cream font-medium">Shreyank Creations</strong> | Thoughtfully Selected Handmade Crafts & Home Decor
        </span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-muted/70 hover:text-cream transition-colors p-1"
        aria-label="Close announcement bar"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
