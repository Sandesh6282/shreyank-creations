"use client";

import React from "react";
import { CATEGORIES } from "@/data/categories";
import { X, Filter, RotateCcw } from "lucide-react";

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (categorySlug: string) => void;
  priceRange: number;
  onPriceChange: (maxPrice: number) => void;
  onReset: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  onReset,
  isOpenMobile,
  onCloseMobile,
}: FilterSidebarProps) {
  const content = (
    <div className="space-y-8">
      {/* Reset Header */}
      <div className="flex items-center justify-between border-b border-sand pb-4">
        <h3 className="font-serif text-lg font-semibold text-espresso flex items-center gap-2">
          <Filter className="w-4 h-4 text-terracotta" />
          <span>Filter Crafts</span>
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-terracotta hover:underline flex items-center gap-1 font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category List */}
      <div>
        <h4 className="text-xs font-bold text-taupe uppercase tracking-wider mb-4">
          Category
        </h4>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange("all")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
              selectedCategory === "all" || !selectedCategory
                ? "bg-terracotta/10 text-terracotta font-semibold"
                : "text-espresso hover:bg-sand/30"
            }`}
          >
            <span>All Craft Collections</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? "bg-terracotta/10 text-terracotta font-semibold"
                  : "text-espresso hover:bg-sand/30"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs text-taupe">({cat.productCount})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-taupe uppercase tracking-wider">
            Max Price (INR)
          </h4>
          <span className="text-sm font-semibold text-terracotta">
            ₹{priceRange.toLocaleString("en-IN")}
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={1000000}
          step={5000}
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-terracotta cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-taupe mt-1">
          <span>₹500</span>
          <span>₹10,00,000</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-cream-surface rounded-xl border border-sand/60 p-6 shadow-card shrink-0 h-fit sticky top-24">
        {content}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-espresso/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-4/5 max-w-xs bg-cream-surface h-full p-6 shadow-2xl z-10 overflow-y-auto ml-auto">
            <div className="flex justify-end mb-4">
              <button
                onClick={onCloseMobile}
                className="p-1 text-taupe hover:text-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
