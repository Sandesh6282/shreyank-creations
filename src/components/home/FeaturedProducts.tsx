import React from "react";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowRight } from "lucide-react";

export function FeaturedProducts() {
  const featured = PRODUCTS.filter((p) => p.isFeatured).slice(0, 8);

  return (
    <section className="py-16 bg-cream border-b border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-terracotta uppercase tracking-widest block mb-1">
            Artisan Selection
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-espresso">
            Featured Handmade Creations
          </h2>
          <p className="text-sm text-taupe mt-2">
            Each creation is sculpted, painted, or carved by artisan hands with authentic detail.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-espresso text-cream hover:bg-terracotta transition-colors font-medium text-sm shadow-sm"
          >
            <span>Explore All 12+ Crafts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
