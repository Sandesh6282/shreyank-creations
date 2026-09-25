import React from "react";
import Image from "next/image";
import { Instagram } from "lucide-react";

export function SocialGallery() {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
      alt: "Blue pottery vase decor setup",
    },
    {
      url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
      alt: "Carved wooden jharokha frame setup",
    },
    {
      url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80",
      alt: "Brass figurine collection",
    },
    {
      url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=600&q=80",
      alt: "Kantha throw on couch",
    },
  ];

  return (
    <section className="py-16 bg-cream border-b border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-terracotta text-xs font-semibold uppercase tracking-wider mb-2">
            <Instagram className="w-4 h-4" />
            <span>@ShreyankCreations</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-espresso">
            Artisan Decor In Real Homes
          </h2>
          <p className="text-xs text-taupe mt-1">
            Follow our studio updates and lifestyle craft displays.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-xl overflow-hidden bg-sand-light border border-sand/50 shadow-card"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-espresso/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-cream">
                <Instagram className="w-8 h-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
