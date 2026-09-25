"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface WishlistItemProps {
  product: Product;
}

export function WishlistItem({ product }: WishlistItemProps) {
  const { addToCart } = useCart();
  const { removeFromWishlist } = useWishlist();

  const primaryImage = product.images[0] || "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group bg-cream-surface rounded-xl border border-sand/60 p-4 shadow-card flex flex-col justify-between hover:border-terracotta/40 transition-all">
      <div>
        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-sand-light mb-4">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <span className="text-[10px] font-bold text-taupe uppercase tracking-wider block mb-1">
          {product.category}
        </span>
        <Link
          href={`/product/${product.slug}`}
          className="font-serif text-base font-semibold text-espresso hover:text-terracotta transition-colors line-clamp-1 mb-2"
        >
          {product.name}
        </Link>
        <div className="font-serif font-bold text-base text-espresso mb-4">
          {formatPrice(product.price)}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-sand/40">
        <Button
          onClick={() => {
            addToCart(product, 1);
            removeFromWishlist(product.id);
          }}
          variant="primary"
          size="sm"
          className="flex-1 gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Move to Cart</span>
        </Button>
        <button
          onClick={() => removeFromWishlist(product.id)}
          className="p-2 text-taupe hover:text-terracotta rounded-lg hover:bg-sand/30 transition-colors"
          aria-label="Remove from wishlist"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
