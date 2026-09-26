"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrandedPlaceholder } from "@/components/ui/BrandedPlaceholder";

export function BrandStory() {
  const [primaryError, setPrimaryError] = useState(false);
  const [secondaryError, setSecondaryError] = useState(false);

  return (
    <section className="py-20 bg-sand-light/50 border-b border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-artisan border-4 border-cream-surface">
              {!primaryError ? (
                <Image
                  src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80"
                  alt="SHREYANK CREATION handmade fabric craft process"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                  onError={() => setPrimaryError(true)}
                />
              ) : (
                <BrandedPlaceholder
                  title="SHREYANK CREATION"
                  subtitle="Handcrafted Fabric Process & Small-Business Care"
                  category="Craft Studio"
                  aspectRatio="aspect-[4/5]"
                />
              )}
            </div>

            {/* Overlay secondary image */}
            <div className="hidden sm:block absolute -bottom-8 -right-8 w-1/2 aspect-square rounded-xl overflow-hidden shadow-2xl border-4 border-cream-surface">
              {!secondaryError ? (
                <Image
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80"
                  alt="Handmade bookmark and fabric accessories detail"
                  fill
                  sizes="30vw"
                  className="object-cover object-center"
                  onError={() => setSecondaryError(true)}
                />
              ) : (
                <BrandedPlaceholder
                  title="Custom Details"
                  subtitle="Fabric & Stitching Care"
                  aspectRatio="aspect-square"
                />
              )}
            </div>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage/10 text-sage text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handmade Craftsmanship</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso leading-tight">
              Crafted with Creativity, Made for Everyday Living
            </h2>

            <p className="text-base text-taupe leading-relaxed">
              At SHREYANK CREATION, we celebrate authentic small-business craftsmanship. Every tote bag, utility pouch, organizer, bookmark, and handmade accessory is created by hand with attention to detail and personal touch.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-cream-surface rounded-xl border border-sand/60">
                <Heart className="w-5 h-5 text-terracotta mb-2" />
                <h4 className="font-serif text-base font-semibold text-espresso">Handmade Fabric Creations</h4>
                <p className="text-xs text-taupe mt-1">Carefully crafted with quality fabric and creative designs.</p>
              </div>

              <div className="p-4 bg-cream-surface rounded-xl border border-sand/60">
                <MessageSquare className="w-5 h-5 text-[#25D366] mb-2" />
                <h4 className="font-serif text-base font-semibold text-espresso">Direct WhatsApp Orders</h4>
                <p className="text-xs text-taupe mt-1">Easy 1-on-1 conversations for inquiries and custom orders.</p>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/about" passHref>
                <Button variant="secondary" size="lg">
                  Read Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
