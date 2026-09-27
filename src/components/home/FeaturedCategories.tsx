"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FeaturedCategories() {
  return (
    <section className="py-16 bg-cream-surface border-b border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/20 text-terracotta text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SHREYANK CREATION</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso tracking-tight">
            Explore Our Handmade Collection
          </h2>

          <p className="text-base sm:text-lg text-taupe leading-relaxed font-sans font-normal max-w-2xl mx-auto">
            Discover handmade bags, pouches, organizers, traditional creations and more, crafted with care by SHREYANK CREATION.
          </p>

          <div className="pt-4 flex justify-center">
            <Link href="/shop" passHref>
              <Button size="lg" variant="primary" className="gap-2 shadow-md">
                <ShoppingBag className="w-4 h-4" />
                <span>View All Products</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
