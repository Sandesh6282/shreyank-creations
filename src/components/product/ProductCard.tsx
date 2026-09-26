"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ReviewStars } from "./ReviewStars";
import { Badge } from "@/components/ui/Badge";
import { buildSingleProductWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80";

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    product.images[0] || FALLBACK_IMAGE
  );

  React.useEffect(() => {
    setImgSrc(product.images[0] || FALLBACK_IMAGE);
  }, [product.images]);

  const isSaved = isInWishlist(product.id);
  const hoverImage = product.images[1] || imgSrc;
  const isOutOfStock = product.stock <= 0;
  const isInactive = !product.active;
  const isPurchaseable = !isOutOfStock && !isInactive;

  return (
    <div
      className="group relative bg-cream-surface rounded-xl border border-sand/60 hover:border-terracotta/40 transition-all duration-300 shadow-card hover:shadow-artisan flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-sand-light/50 overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={isHovered ? hoverImage : imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {isOutOfStock && (
            <Badge variant="terracotta">Out of Stock</Badge>
          )}
          {product.discount && !isOutOfStock && (
            <Badge variant="terracotta">{product.discount}</Badge>
          )}
          {product.isBestSeller && !product.discount && !isOutOfStock && (
            <Badge variant="sage">Featured</Badge>
          )}
        </div>

        {/* Wishlist Quick Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 z-10 shadow-sm ${
            isSaved
              ? "bg-terracotta text-cream"
              : "bg-cream-surface/90 text-espresso hover:bg-cream hover:text-terracotta"
          }`}
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isSaved ? "fill-cream" : ""}`} />
        </button>

        {/* Quick Action Overlay on Desktop */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2 z-10">
          <a
            href={isPurchaseable ? buildSingleProductWhatsAppUrl({ product, quantity: 1 }) : "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              if (!isPurchaseable) e.preventDefault();
            }}
            className={`flex-1 text-xs font-semibold py-2.5 px-3 rounded-lg backdrop-blur-xs transition-colors flex items-center justify-center gap-1.5 shadow-md ${
              isPurchaseable
                ? "bg-[#25D366] hover:bg-[#20bd5a] text-white"
                : "bg-sand/80 text-taupe cursor-not-allowed pointer-events-none"
            }`}
          >
            <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
            <span>{isOutOfStock ? "Out of Stock" : "Buy on WhatsApp"}</span>
          </a>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={!isPurchaseable}
            className={`p-2.5 rounded-lg backdrop-blur-xs transition-colors flex items-center justify-center shadow-md ${
              isPurchaseable
                ? "bg-espresso/90 hover:bg-espresso text-cream"
                : "bg-sand/80 text-taupe cursor-not-allowed"
            }`}
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] font-semibold text-taupe tracking-wider uppercase mb-1">
          {product.category}
        </span>

        <Link
          href={`/product/${product.slug}`}
          className="font-serif text-base font-medium text-espresso group-hover:text-terracotta transition-colors line-clamp-1 mb-1.5"
        >
          {product.name}
        </Link>

        {/* Review Stars */}
        <div className="mb-2">
          <ReviewStars rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        {/* Price Row */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-sand/30">
          <div className="flex items-baseline gap-2">
            <span className="font-serif font-semibold text-lg text-espresso">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-taupe line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile Cart Button */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={!isPurchaseable}
            className="md:hidden p-2 text-terracotta hover:bg-terracotta hover:text-cream rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Quick Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
