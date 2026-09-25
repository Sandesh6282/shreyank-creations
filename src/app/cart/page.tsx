"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { cartItems, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="bg-cream min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Shopping Cart" }]} />
          <div className="py-16 text-center max-w-md mx-auto bg-cream-surface rounded-2xl border border-sand/60 p-8 shadow-card my-8">
            <div className="w-20 h-20 rounded-full bg-sand-light flex items-center justify-center mx-auto mb-4 text-terracotta">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-espresso mb-2">
              Your Cart is Currently Empty
            </h1>
            <p className="text-xs text-taupe mb-6 leading-relaxed">
              Explore our handmade Indian handicraft collections, blue pottery, and folk art to fill your space with warmth.
            </p>
            <Link href="/shop" passHref>
              <Button variant="primary" size="md" className="gap-2">
                <span>Explore Shop Collection</span>
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
        <Breadcrumbs items={[{ label: "Shopping Cart" }]} />

        <div className="flex items-center justify-between py-6 border-b border-sand/40 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-espresso">
              Shopping Cart
            </h1>
            <p className="text-xs text-taupe mt-0.5">
              Review your items before proceeding to checkout.
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-taupe hover:text-terracotta flex items-center gap-1 font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          {/* Cart Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
