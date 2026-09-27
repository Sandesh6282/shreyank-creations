"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function Newsletter() {
  const customWhatsAppUrl =
    "https://wa.me/918951119766?text=Hi%20SHREYANK%20CREATION%2C%20I%27d%20like%20to%20discuss%20a%20custom%20order.";

  return (
    <section className="py-16 bg-sand-light/60">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-cream-surface rounded-3xl p-8 sm:p-12 border border-sand shadow-artisan">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/20 text-terracotta text-xs font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CUSTOM CREATIONS</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso mb-3">
            Have Something Special in Mind?
          </h2>
          <p className="text-sm sm:text-base text-taupe max-w-lg mx-auto mb-8 leading-relaxed font-sans">
            Looking for a custom bag, pouch, organizer or handmade gift? Tell us what you&apos;d like and we&apos;ll discuss your requirements directly.
          </p>

          <div className="flex justify-center">
            <a
              href={customWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-7 rounded-xl font-semibold text-sm bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
              <span>Discuss Your Custom Order on WhatsApp</span>
            </a>
          </div>

          <p className="text-[11px] text-taupe-muted mt-4">
            Direct 1-on-1 WhatsApp assistance for personalized designs & wholesale inquiries.
          </p>
        </div>
      </div>
    </section>
  );
}
