"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchStorefrontProducts, fetchDatabaseCategories } from "@/services/productService";
import { Product, Category } from "@/types/product";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { SortSelect } from "@/components/shop/SortSelect";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

function ShopContent() {
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get("search") || "";
  const categoryFromUrl = searchParams.get("category") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState<string>(searchFromUrl);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [dbProducts, dbCategories] = await Promise.all([
          fetchStorefrontProducts(),
          fetchDatabaseCategories(),
        ]);
        setProducts(dbProducts);
        setCategories(dbCategories);
      } catch (e) {
        console.error("Failed to load shop products:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && selectedCategory !== "all") {
        if (p.categorySlug !== selectedCategory) return false;
      }

      if (p.price > maxPrice) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesDesc = p.shortDescription.toLowerCase().includes(query);
        const matchesMaterial = (p.materials || "").toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesDesc && !matchesMaterial) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, maxPrice, sortBy, searchQuery]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const handleReset = () => {
    setSelectedCategory("all");
    setMaxPrice(1000000);
    setSortBy("featured");
    setSearchQuery("");
  };

  const currentCategoryName =
    selectedCategory === "all"
      ? "All Collections"
      : categories.find((c) => c.slug === selectedCategory)?.name || "All Collections";

  return (
    <div className="bg-cream min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: currentCategoryName }]} />

        {/* Header Title Section */}
        <div className="py-6 border-b border-sand/40 mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso">
            {currentCategoryName}
          </h1>
          <p className="text-sm text-taupe mt-1">
            Handmade Indian crafts, decor, gifts, and folk paintings crafted with care.
          </p>
        </div>

        {/* Filter / Search Bar Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by craft, material, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-cream-surface border border-sand rounded-lg text-sm text-espresso focus:outline-none focus:border-terracotta"
            />
            <Search className="w-4 h-4 text-taupe absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe hover:text-espresso"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-cream-surface border border-sand rounded-lg text-xs font-semibold text-espresso"
            >
              <Filter className="w-4 h-4 text-terracotta" />
              <span>Filter Crafts</span>
            </button>

            <SortSelect value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* Main Grid & Sidebar Container */}
        <div className="flex gap-8">
          <FilterSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={maxPrice}
            onPriceChange={setMaxPrice}
            onReset={handleReset}
            isOpenMobile={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between text-xs text-taupe pb-2 border-b border-sand/30">
              <span>
                Showing <strong className="text-espresso font-semibold">{displayedProducts.length}</strong> of{" "}
                <strong className="text-espresso font-semibold">{filteredProducts.length}</strong> crafts
              </span>
              {(selectedCategory !== "all" || searchQuery || maxPrice < 1000000) && (
                <button
                  onClick={handleReset}
                  className="text-terracotta hover:underline font-medium"
                >
                  Clear active filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-16 text-center text-taupe text-sm">Loading products from database...</div>
            ) : (
              <ProductGrid
                products={displayedProducts}
                emptyMessage="No products found in database matching your criteria. Add products via the Admin Portal."
              />
            )}

            {visibleCount < filteredProducts.length && (
              <div className="pt-8 text-center">
                <Button
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                  variant="secondary"
                  size="md"
                >
                  Load More Crafts
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-taupe">Loading shop catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
