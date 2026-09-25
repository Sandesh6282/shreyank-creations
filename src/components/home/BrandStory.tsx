import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function BrandStory() {
  return (
    <section className="py-20 bg-sand-light/50 border-b border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Editorial Image Stack Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-artisan border-4 border-cream-surface">
              <Image
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80"
                alt="Artisan painting traditional Tanjore artwork by hand"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            {/* Overlay secondary image */}
            <div className="hidden sm:block absolute -bottom-8 -right-8 w-1/2 aspect-square rounded-xl overflow-hidden shadow-2xl border-4 border-cream-surface">
              <Image
                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80"
                alt="Lost wax metal casting craft detail"
                fill
                sizes="30vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Editorial Content Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage/10 text-sage text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Made By Hand</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso leading-tight">
              Preserving Indian Craft Traditions, One Creation at a Time
            </h2>

            <p className="text-base text-taupe leading-relaxed">
              At Shreyank Creations, we celebrate the hands that shape clay, carve seasoned wood, mold bell-metal, and paint intricate folk motifs. Each piece in our collection is crafted with patience and attention to detail.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-cream-surface rounded-xl border border-sand/60">
                <Heart className="w-5 h-5 text-terracotta mb-2" />
                <h4 className="font-serif text-base font-semibold text-espresso">Made with Care</h4>
                <p className="text-xs text-taupe mt-1">Every creation reflects human warmth and individual character.</p>
              </div>

              <div className="p-4 bg-cream-surface rounded-xl border border-sand/60">
                <ShieldCheck className="w-5 h-5 text-sage mb-2" />
                <h4 className="font-serif text-base font-semibold text-espresso">Unique Handmade Pieces</h4>
                <p className="text-xs text-taupe mt-1">No mass manufacturing—each craft possesses subtle organic uniqueness.</p>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/about" passHref>
                <Button variant="secondary" size="lg">
                  Read Our Full Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
