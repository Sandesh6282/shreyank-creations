"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, AlertCircle } from "lucide-react";
import { CartItem as CartItemType } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface CartItemProps {
  item: CartItemType;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80";

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const primaryImage = product.images[0] || FALLBACK_IMAGE;
  const isMaxStock = quantity >= product.stock;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-cream-surface rounded-xl border border-sand/60 gap-4 shadow-xs">
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-sand-light shrink-0 border border-sand/40">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="80px"
            className="object-cover object-center"
          />
        </div>

        <div className="space-y-1 flex-1 min-w-0">
          <span className="text-[10px] font-bold text-taupe uppercase tracking-wider block">
            {product.category}
          </span>
          <Link
            href={`/product/${product.slug}`}
            className="font-serif text-base font-semibold text-espresso hover:text-terracotta transition-colors line-clamp-1"
          >
            {product.name}
          </Link>

          <div className="flex items-baseline gap-2 text-xs">
            <span className="text-taupe">Price:</span>
            <span className="font-semibold text-espresso">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-taupe line-through text-[11px]">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discount && (
              <span className="text-[10px] font-bold text-terracotta bg-terracotta/10 px-1.5 py-0.5 rounded">
                {product.discount}
              </span>
            )}
          </div>

          {isMaxStock && (
            <p className="text-[11px] text-amber-700 flex items-center gap-1 font-medium pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Max stock reached ({product.stock} available)</span>
            </p>
          )}
        </div>
      </div>

      {/* Quantity & Item Subtotal Row */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-sand/40">
        {/* Quantity Controls */}
        <div className="flex items-center border border-sand rounded-lg bg-cream px-2 py-1">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="p-1 text-taupe hover:text-espresso transition-colors disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-espresso">
            {quantity}
          </span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            disabled={isMaxStock}
            className="p-1 text-taupe hover:text-espresso transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Total */}
        <div className="text-right min-w-[90px]">
          <span className="font-serif font-bold text-base text-espresso block">
            {formatPrice(product.price * quantity)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeFromCart(product.id)}
          className="p-2 text-taupe hover:text-terracotta transition-colors rounded-lg hover:bg-terracotta/10"
          aria-label="Remove item from cart"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
