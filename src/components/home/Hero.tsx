import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative bg-cream py-12 lg:py-20 overflow-hidden border-b border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/20 text-terracotta text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handcrafted Indian Artistry</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-espresso leading-[1.15] tracking-tight">
              Thoughtfully Selected Crafts For Warm Living Spaces
            </h1>

            <p className="text-base sm:text-lg text-taupe max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans font-normal">
              Discover unique handmade pieces created with care across India. From Jaipur blue pottery and brass urlis to Rajasthani carved jharokhas, bring timeless heritage into your home.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/shop" passHref>
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/about" passHref>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Explore Craft Heritage
                </Button>
              </Link>
            </div>

            {/* Quick Stat Pill */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-sand/60 max-w-lg mx-auto lg:mx-0">
              <div>
                <span className="block font-serif text-2xl font-bold text-espresso">Handmade</span>
                <span className="text-xs text-taupe font-medium">Craft Creations</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-espresso">6+</span>
                <span className="text-xs text-taupe font-medium">Craft Categories</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-espresso">Carefully</span>
                <span className="text-xs text-taupe font-medium">Packaged</span>
              </div>
            </div>
          </div>

          {/* Hero Editorial Image Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-artisan border-4 border-cream-surface">
              <Image
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80"
                alt="Shreyank Creations handmade home decor centerpiece"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent" />

              {/* Floating Floating Accent Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-cream-surface/90 backdrop-blur-md p-4 rounded-xl border border-sand shadow-lg">
                <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta block">
                  Artisan Highlight
                </span>
                <p className="font-serif text-sm font-semibold text-espresso">
                  Jaipur Blue Pottery & Carved Jharokhas
                </p>
              </div>
            </div>

            {/* Background Decorative Accent Circle */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-sage/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-terracotta/10 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
