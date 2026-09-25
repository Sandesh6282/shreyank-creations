import React from "react";

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-xs font-semibold text-taupe uppercase tracking-wider whitespace-nowrap">
        Sort By:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-cream-surface border border-sand rounded-lg px-3 py-1.5 text-xs md:text-sm font-medium text-espresso focus:outline-none focus:border-terracotta cursor-pointer"
      >
        <option value="featured">Featured Artisanal</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
        <option value="newest">Newest Arrivals</option>
      </select>
    </div>
  );
}
