"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { WishlistItem } from "@/components/wishlist/WishlistItem";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-cream min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "My Wishlist" }]} />
          <div className="py-16 text-center max-w-md mx-auto bg-cream-surface rounded-2xl border border-sand/60 p-8 shadow-card my-8">
            <div className="w-20 h-20 rounded-full bg-sand-light flex items-center justify-center mx-auto mb-4 text-terracotta">
              <Heart className="w-10 h-10" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-espresso mb-2">
              Your Wishlist is Empty
            </h1>
            <p className="text-xs text-taupe mb-6 leading-relaxed">
              Save your favorite handmade creations, ceramic vases, and traditional brass urlis to review later.
            </p>
            <Link href="/shop" passHref>
              <Button variant="primary" size="md" className="gap-2">
                <span>Browse Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "My Wishlist" }]} />

        <div className="py-6 border-b border-sand/40 mb-8">
          <h1 className="font-serif text-3xl font-bold text-espresso">
            Saved Wishlist ({wishlistItems.length})
          </h1>
          <p className="text-xs text-taupe mt-0.5">
            Your saved artisanal items. Move them to cart whenever you are ready.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((prod) => (
            <WishlistItem key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
}
