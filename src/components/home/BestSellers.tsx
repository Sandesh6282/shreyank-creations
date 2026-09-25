import React from "react";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";

export function BestSellers() {
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section className="py-16 bg-cream-surface border-b border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-terracotta uppercase tracking-widest block mb-1">
            Artisan Showcase
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-espresso">
            Featured Craft Creations
          </h2>
          <p className="text-sm text-taupe mt-2">
            Handmade crafts and decorative items created by artisan hands.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
