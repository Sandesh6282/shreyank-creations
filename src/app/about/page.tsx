import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Heart, ShieldCheck, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="bg-cream min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "About Us" }]} />

        {/* Hero Banner */}
        <div className="py-12 text-center max-w-3xl mx-auto border-b border-sand/40">
          <span className="text-xs font-bold text-terracotta uppercase tracking-widest block mb-2">
            The Shreyank Creations Story
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-espresso leading-tight">
            Connecting Traditional Artisans with Modern Homes
          </h1>
          <p className="text-base text-taupe mt-4 leading-relaxed font-sans">
            Shreyank Creations is a specialized online platform dedicated to celebrating handmade Indian handicrafts, folk art, terracotta planters, quartz blue pottery, and solid metal crafts.
          </p>
        </div>

        {/* Story Section */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-artisan border-4 border-cream-surface">
              <Image
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80"
                alt="Shreyank Creations studio interior display"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-serif text-3xl font-bold text-espresso">
              Crafted With Care & Heritage Detail
            </h2>
            <p className="text-sm text-taupe leading-relaxed">
              Every region in India holds centuries-old artisan traditions—from Jaipur quartz glaze firing and Tanjore gold leaf application to lost-wax Dhokra brass sculpting. Our mission is to present these timeless crafts in curated, contemporary forms suitable for home decor.
            </p>
            <p className="text-sm text-taupe leading-relaxed">
              We focus on thoughtful selection, ensuring that each product delivered to your doorstep meets high finishing standards while preserving its natural, handmade character.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-cream-surface rounded-xl border border-sand/60">
                <Heart className="w-5 h-5 text-terracotta mb-2" />
                <h4 className="font-serif font-bold text-espresso text-sm">Made With Care</h4>
                <p className="text-xs text-taupe mt-0.5">Crafted by hand using regional techniques.</p>
              </div>
              <div className="p-4 bg-cream-surface rounded-xl border border-sand/60">
                <ShieldCheck className="w-5 h-5 text-sage mb-2" />
                <h4 className="font-serif font-bold text-espresso text-sm">Unique Pieces</h4>
                <p className="text-xs text-taupe mt-0.5">Distinctive textures and organic warmth.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Locations / Contact CTA */}
        <div className="my-12 p-8 sm:p-12 bg-espresso text-cream rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 text-terracotta text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Studio Heritage</span>
            </div>
            <h3 className="font-serif text-3xl font-bold">
              Visit Our Partner Workshops in Jaipur & Bengaluru
            </h3>
            <p className="text-sm text-cream-muted leading-relaxed font-sans">
              Interested in custom bulk handicraft orders or corporate gifting? Contact our dedicated studio team to discuss bespoke artisan requirements.
            </p>
            <div className="pt-2">
              <Link href="/contact" passHref>
                <Button variant="primary" size="md" className="gap-2">
                  <span>Get In Touch</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
