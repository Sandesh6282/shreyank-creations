import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function EditorialBanner() {
  return (
    <section className="py-16 bg-cream border-b border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-espresso text-cream p-8 md:p-16 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1400&q=80"
            alt="Hand-carved wooden jharokha and wall accents"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-30 mix-blend-luminosity"
          />

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold text-terracotta uppercase tracking-widest">
              Limited Edition Heritage Series
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-cream">
              Hand-Carved Wooden Wall Accents & Jharokhas
            </h2>
            <p className="text-sm md:text-base text-cream-muted leading-relaxed font-sans">
              Transform empty hallway walls and consoles into warm focal points with our seasoned wood archways and intricate mirror frames.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link href="/shop/wall-decor" passHref>
                <Button variant="primary" size="lg">
                  Shop Wall Decor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
