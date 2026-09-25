import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/data/categories";
import { ArrowRight } from "lucide-react";

export function FeaturedCategories() {
  return (
    <section className="py-16 bg-cream-surface border-b border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold text-terracotta uppercase tracking-widest block mb-1">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-espresso">
              Explore By Craft Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta hover:text-terracotta-hover transition-colors group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-sand-light border border-sand/60 shadow-card hover:shadow-artisan transition-all duration-300 flex flex-col justify-end p-6"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/30 to-transparent transition-opacity group-hover:from-espresso/90" />

              <div className="relative z-10 text-cream">
                <span className="text-xs font-medium text-sand uppercase tracking-wider block mb-1">
                  {cat.productCount} Handcrafted Items
                </span>
                <h3 className="font-serif text-2xl font-bold group-hover:text-terracotta-light transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-cream-muted mt-1 line-clamp-2 opacity-90 font-sans">
                  {cat.description}
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-light mt-3 group-hover:translate-x-1 transition-transform">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
