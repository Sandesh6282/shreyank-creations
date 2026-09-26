import React from "react";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Heart, Sparkles, Truck } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export default function AboutPage() {
  const customWhatsAppUrl =
    "https://wa.me/918951119766?text=Hi%20SHREYANK%20CREATION%2C%20I%27d%20like%20to%20discuss%20a%20custom%20order.";

  return (
    <div className="bg-cream min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "About Us" }]} />

        {/* Hero Banner */}
        <div className="py-12 text-center max-w-3xl mx-auto border-b border-sand/40">
          <span className="text-xs font-bold text-terracotta uppercase tracking-widest block mb-2">
            About SHREYANK CREATION
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-espresso leading-tight">
            Handmade with Creativity. Made for You.
          </h1>
          <p className="text-base text-taupe mt-4 leading-relaxed font-sans">
            SHREYANK CREATION is a small handmade craft brand specializing in fabric bags, utility pouches, organizers, bookmarks, and bespoke custom accessories created with authentic care.
          </p>
        </div>

        {/* Story Section */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-artisan border-4 border-cream-surface">
              <Image
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80"
                alt="SHREYANK CREATION handmade fabric craft display"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-serif text-3xl font-bold text-espresso">
              Crafted With Personal Care & Small-Business Craftsmanship
            </h2>
            <p className="text-sm text-taupe leading-relaxed">
              We focus on creating functional, beautiful, and durable handmade fabric products. Every item—from daily tote bags and coin pouches to travel organizers and bookish accessories—is designed to add creativity to your day.
            </p>
            <p className="text-sm text-taupe leading-relaxed">
              We believe in direct, personal customer interaction. Whether you need a standard item from our collection or want to discuss a customized order, we handle inquiries directly with you on WhatsApp.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-cream-surface rounded-xl border border-sand/60">
                <Heart className="w-5 h-5 text-terracotta mb-2" />
                <h4 className="font-serif font-bold text-espresso text-sm">Handmade Quality</h4>
                <p className="text-xs text-taupe mt-0.5">Individually stitched & finished by hand.</p>
              </div>
              <div className="p-4 bg-cream-surface rounded-xl border border-sand/60">
                <Truck className="w-5 h-5 text-sage mb-2" />
                <h4 className="font-serif font-bold text-espresso text-sm">Delivery Across India</h4>
                <p className="text-xs text-taupe mt-0.5">Reliable doorstep shipping nationwide.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Order Callout */}
        <div className="my-12 p-8 sm:p-12 bg-espresso text-cream rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 text-terracotta text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Custom Order Assistance</span>
            </div>
            <h3 className="font-serif text-3xl font-bold">
              Looking for a Customized Handmade Product?
            </h3>
            <p className="text-sm text-cream-muted leading-relaxed font-sans">
              Tell us what you&apos;re looking for! We create custom fabric bags, personalized pouches, and special handmade gifts. Discuss your requirements directly with us on WhatsApp.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href={customWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 rounded-xl font-semibold text-sm bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all flex items-center gap-2 shadow-lg"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Discuss Custom Order on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
