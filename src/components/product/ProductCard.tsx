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
import { BrandedPlaceholder } from "@/components/ui/BrandedPlaceholder";

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80";

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    product.images && product.images[0] ? product.images[0] : FALLBACK_IMAGE
  );
  const [hasFailedImage, setHasFailedImage] = useState(false);

  React.useEffect(() => {
    setImgSrc(product.images && product.images[0] ? product.images[0] : FALLBACK_IMAGE);
    setHasFailedImage(false);
  }, [product.images]);

  const isSaved = isInWishlist(product.id);
  const hoverImage = product.images && product.images[1] ? product.images[1] : imgSrc;
  const isOutOfStock = product.stock <= 0;
  const isInactive = !product.active;
  const isPurchaseable = !isOutOfStock && !isInactive;

  const whatsappUrl = isPurchaseable
    ? buildSingleProductWhatsAppUrl({ product, quantity: 1 })
    : "#";

  const handleImageError = () => {
    if (imgSrc !== FALLBACK_IMAGE) {
      setImgSrc(FALLBACK_IMAGE);
    } else {
      setHasFailedImage(true);
    }
  };

  return (
    <div
      className="group relative bg-cream-surface rounded-xl border border-sand/60 hover:border-terracotta/40 transition-all duration-300 shadow-card hover:shadow-artisan flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-sand-light/50 overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          {!hasFailedImage ? (
            <Image
              src={isHovered ? hoverImage : imgSrc}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              onError={handleImageError}
            />
          ) : (
            <BrandedPlaceholder
              title={product.name}
              subtitle={product.category}
              aspectRatio="aspect-square"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {isOutOfStock && (
            <Badge variant="terracotta">Out of Stock</Badge>
          )}
          {product.discount && !isOutOfStock && (
            <Badge variant="terracotta">{product.discount}</Badge>
          )}
          {product.bestseller && !product.discount && !isOutOfStock && (
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
        <div className="hidden lg:flex absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 gap-2 z-10">
          <a
            href={whatsappUrl}
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

      {/* Product Details */}
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
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-sand/30 mb-3">
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
        </div>

        {/* Mobile Action Row */}
        <div className="flex lg:hidden gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!isPurchaseable) e.preventDefault();
            }}
            className={`flex-1 text-xs font-semibold py-2 px-2.5 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs ${
              isPurchaseable
                ? "bg-[#25D366] text-white"
                : "bg-sand/80 text-taupe cursor-not-allowed pointer-events-none"
            }`}
          >
            <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
            <span>{isOutOfStock ? "Out of Stock" : "Buy on WhatsApp"}</span>
          </a>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={!isPurchaseable}
            className="p-2 border border-sand rounded-lg text-espresso hover:bg-terracotta hover:text-cream transition-colors disabled:opacity-40"
            aria-label="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
