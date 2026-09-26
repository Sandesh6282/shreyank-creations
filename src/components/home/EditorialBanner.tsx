"use client";

import React, { useState } from "react";
import Image from "next/image";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function EditorialBanner() {
  const [imageError, setImageError] = useState(false);
  const customWhatsAppUrl =
    "https://wa.me/918951119766?text=Hi%20SHREYANK%20CREATION%2C%20I%27d%20like%20to%20discuss%20a%20custom%20order.";

  return (
    <section className="py-16 bg-cream border-b border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-espresso text-cream p-8 md:p-16 shadow-2xl">
          {!imageError && (
            <Image
              src="https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1400&q=80"
              alt="SHREYANK CREATION custom handmade fabric crafting"
              fill
              sizes="100vw"
              className="object-cover object-center opacity-30 mix-blend-luminosity"
              onError={() => setImageError(true)}
            />
          )}

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold text-terracotta uppercase tracking-widest">
              Customization Available
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-cream">
              Want Something Made Your Way?
            </h2>
            <p className="text-sm md:text-base text-cream-muted leading-relaxed font-sans">
              Custom designs available. Tell us what you&apos;re looking for and discuss your specific requirements directly with us on WhatsApp.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href={customWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-6 rounded-xl font-semibold text-sm bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all flex items-center gap-2 shadow-lg"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                <span>Discuss a Custom Order on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
