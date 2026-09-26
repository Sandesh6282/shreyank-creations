"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { BrandedPlaceholder } from "@/components/ui/BrandedPlaceholder";

export function Hero() {
  const [imageError, setImageError] = useState(false);
  const customWhatsAppUrl =
    "https://wa.me/918951119766?text=Hi%20SHREYANK%20CREATION%2C%20I%27d%20like%20to%20discuss%20a%20custom%20order.";

  return (
    <section className="relative bg-cream py-12 lg:py-20 overflow-hidden border-b border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/20 text-terracotta text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handmade Fabric Creations</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-espresso leading-[1.15] tracking-tight">
              Handmade with creativity. Made for you.
            </h1>

            <p className="text-base sm:text-lg text-taupe max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans font-normal">
              Discover handcrafted fabric bags, utility pouches, organizers, bookmarks, and customized handmade creations. Made with love and delivered across India.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/shop" passHref>
                <Button size="lg" className="w-full sm:w-auto gap-2 shadow-md">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <a
                href={customWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3 px-5 rounded-xl font-semibold text-sm bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Custom Order on WhatsApp</span>
              </a>
            </div>

            {/* Quick Feature Pillars */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-sand/60 max-w-lg mx-auto lg:mx-0">
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold text-espresso">Handmade</span>
                <span className="text-xs text-taupe font-medium">Fabric Creations</span>
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold text-espresso">Custom</span>
                <span className="text-xs text-taupe font-medium">Orders Available</span>
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold text-espresso">India-Wide</span>
                <span className="text-xs text-taupe font-medium">Doorstep Delivery</span>
              </div>
            </div>
          </div>

          {/* Hero Image Showcase / Branded Fallback */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-artisan border-4 border-cream-surface">
              {!imageError ? (
                <>
                  <Image
                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80"
                    alt="SHREYANK CREATION handmade fabric bags and pouches"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent" />
                </>
              ) : (
                <BrandedPlaceholder
                  title="SHREYANK CREATION"
                  subtitle="Handmade Bags, Pouches & Custom Accessories"
                  category="Fabric Craftsmanship"
                  aspectRatio="aspect-[4/5]"
                />
              )}

              {/* Floating Highlight Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-cream-surface/95 backdrop-blur-md p-4 rounded-xl border border-sand shadow-lg z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta block">
                  SHREYANK CREATION
                </span>
                <p className="font-serif text-sm font-semibold text-espresso">
                  Handcrafted Bags, Pouches & Custom Accessories
                </p>
              </div>
            </div>

            {/* Background Decorative Accent Circles */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-sage/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-terracotta/10 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
