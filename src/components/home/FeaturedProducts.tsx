import React from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";

interface FeaturedProductsProps {
  products?: Product[];
}

export function FeaturedProducts({ products = [] }: FeaturedProductsProps) {
  if (products.length === 0) {
    return (
      <section className="py-16 bg-cream border-b border-sand/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-terracotta uppercase tracking-widest block mb-1">
              Artisan Showcase
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-espresso">
              Featured Handmade Creations
            </h2>
            <div className="mt-8 p-8 bg-cream-surface rounded-2xl border border-sand/60 max-w-md mx-auto">
              <Sparkles className="w-8 h-8 text-terracotta mx-auto mb-3" />
              <p className="text-sm font-serif font-bold text-espresso mb-1">Database Ready For Real Products</p>
              <p className="text-xs text-taupe mb-4">
                No active featured products in database yet. Add your first real product from the Admin Portal.
              </p>
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta hover:underline"
              >
                Go to Admin Dashboard &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-espresso text-cream hover:bg-terracotta transition-colors font-medium text-sm shadow-sm"
          >
            <span>Explore All Crafts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
