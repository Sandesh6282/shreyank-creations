"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Instagram, Sparkles, Heart, ShoppingBag, MessageSquare } from "lucide-react";

export function SocialGallery() {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const tiles = [
    {
      category: "Handmade Bags",
      subtitle: "Tote Bags & Everyday Carry",
      icon: ShoppingBag,
      url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    },
    {
      category: "Fabric Pouches",
      subtitle: "Makeup & Utility Organizers",
      icon: Sparkles,
      url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80",
    },
    {
      category: "Bookmarks & Gifts",
      subtitle: "Creative Handmade Accessories",
      icon: Heart,
      url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    },
    {
      category: "Custom Creations",
      subtitle: "Personalized WhatsApp Orders",
      icon: MessageSquare,
      url: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const instagramProfileUrl = "https://instagram.com";

  return (
    <section className="py-16 bg-cream border-b border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <a
            href={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-terracotta text-xs font-bold uppercase tracking-wider mb-2 hover:underline"
          >
            <Instagram className="w-4 h-4 text-terracotta" />
            <span>@SHREYANKCREATION</span>
          </a>
          <h2 className="font-serif text-3xl font-bold text-espresso">
            Handmade Creations & Studio Gallery
          </h2>
          <p className="text-xs text-taupe mt-1">
            Follow our Instagram profile for new handmade releases, fabric patterns, and custom orders.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tiles.map((tile, idx) => {
            const Icon = tile.icon;
            const hasError = imageErrors[idx];

            return (
              <a
                key={idx}
                href={instagramProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-cream-surface via-sand-light to-cream border border-sand/60 shadow-card hover:shadow-artisan transition-all duration-300 flex flex-col items-center justify-center p-4 text-center"
              >
                {!hasError ? (
                  <>
                    <Image
                      src={tile.url}
                      alt={tile.category}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      onError={() => setImageErrors((prev) => ({ ...prev, [idx]: true }))}
                    />
                    <div className="absolute inset-0 bg-espresso/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-cream p-4">
                      <Instagram className="w-8 h-8 text-cream mb-2" />
                      <span className="font-serif font-bold text-sm">{tile.category}</span>
                      <span className="text-[10px] text-sand">{tile.subtitle}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full p-4 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-cream-surface border border-sand shadow-sm flex items-center justify-center text-terracotta mb-2 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-espresso font-serif">{tile.category}</span>
                    <span className="text-[10px] text-taupe mt-0.5">{tile.subtitle}</span>
                    <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-terracotta uppercase tracking-wider">
                      <Instagram className="w-3 h-3" />
                      <span>View on Instagram</span>
                    </div>
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
