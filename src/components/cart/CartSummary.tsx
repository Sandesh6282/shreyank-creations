"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Truck, Tag, ArrowRight } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export function CartSummary() {
  const { subtotal, totalAmount, cartItems } = useCart();
  const { addToast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "ARTISAN10") {
      const discount = Math.round(subtotal * 0.1);
      setAppliedDiscount(discount);
      addToast("Applied 'ARTISAN10' - 10% craft discount!");
    } else {
      addToast("Invalid promo code. Try 'ARTISAN10'", "error");
    }
  };

  const finalTotal = Math.max(0, totalAmount - appliedDiscount);

  return (
    <div className="bg-cream-surface rounded-xl border border-sand/60 p-6 shadow-card space-y-6 sticky top-24">
      <h3 className="font-serif text-xl font-bold text-espresso border-b border-sand pb-4">
        Order Summary
      </h3>

      {/* Price breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-taupe">
          <span>Subtotal ({cartItems.length} items)</span>
          <span className="font-semibold text-espresso">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-taupe text-xs pt-1">
          <span>Estimated Shipping</span>
          <span className="font-medium text-taupe italic">Calculated at checkout</span>
        </div>

        {appliedDiscount > 0 && (
          <div className="flex justify-between text-terracotta font-medium pt-1">
            <span>Promo Discount (ARTISAN10)</span>
            <span>-{formatPrice(appliedDiscount)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-sand flex justify-between items-baseline">
          <span className="font-serif text-lg font-bold text-espresso">Total</span>
          <span className="font-serif text-2xl font-bold text-terracotta">
            {formatPrice(finalTotal)}
          </span>
        </div>
      </div>

      {/* Coupon form */}
      <form onSubmit={handleApplyCoupon} className="relative flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Promo Code (e.g. ARTISAN10)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-cream border border-sand rounded-lg text-xs uppercase font-medium text-espresso focus:outline-none focus:border-terracotta"
          />
          <Tag className="w-3.5 h-3.5 text-taupe absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <Button type="submit" variant="secondary" size="sm">
          Apply
        </Button>
      </form>

      {/* Checkout CTA */}
      <Button
        variant="primary"
        size="lg"
        className="w-full gap-2 shadow-md"
        onClick={() => addToast("Checkout flow prepared! Backend integration coming soon.", "info")}
      >
        <span>Proceed to Checkout</span>
        <ArrowRight className="w-4 h-4" />
      </Button>

      {/* Trust Badges */}
      <div className="space-y-2 pt-2 text-xs text-taupe border-t border-sand/40">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-terracotta shrink-0" />
          <span>Shipping details will be confirmed during checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sage shrink-0" />
          <span>Protected packaging for fragile ceramics & brass</span>
        </div>
      </div>
    </div>
  );
}
