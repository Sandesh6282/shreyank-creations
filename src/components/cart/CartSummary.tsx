"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { buildCartWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function CartSummary() {
  const { subtotal, cartItems, revalidateCart } = useCart();

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartWhatsAppUrl = buildCartWhatsAppUrl({ cartItems });

  return (
    <div className="bg-cream-surface rounded-xl border border-sand/60 p-6 shadow-card space-y-6 sticky top-24">
      <h3 className="font-serif text-xl font-bold text-espresso border-b border-sand pb-4">
        Enquiry Summary
      </h3>

      {/* Price breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-taupe">
          <span>Subtotal ({totalItemCount} items)</span>
          <span className="font-semibold text-espresso">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-taupe text-xs pt-1">
          <span>Shipping Charges</span>
          <span className="font-medium text-taupe italic">Confirmed by seller</span>
        </div>

        <div className="pt-3 border-t border-sand flex justify-between items-baseline">
          <div>
            <span className="font-serif text-lg font-bold text-espresso block">Estimated Total</span>
            <span className="text-[11px] text-taupe block">Final price & shipping confirmed by seller</span>
          </div>
          <span className="font-serif text-2xl font-bold text-terracotta">
            {formatPrice(subtotal)}
          </span>
        </div>
      </div>

      {/* Primary WhatsApp CTA */}
      <a
        href={cartItems.length > 0 ? cartWhatsAppUrl : "#"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (cartItems.length === 0) e.preventDefault();
        }}
        className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
          cartItems.length > 0
            ? "bg-[#25D366] text-white hover:bg-[#20bd5a] cursor-pointer"
            : "bg-sand/80 text-taupe cursor-not-allowed pointer-events-none opacity-60"
        }`}
      >
        <WhatsAppIcon className="w-5 h-5 fill-white" />
        <span>Enquire on WhatsApp</span>
      </a>

      {/* Revalidate Button */}
      <button
        onClick={revalidateCart}
        className="w-full text-xs text-taupe hover:text-espresso flex items-center justify-center gap-1.5 transition-colors pt-1"
      >
        <RefreshCw className="w-3.5 h-3.5 text-terracotta" />
        <span>Revalidate stock & live prices</span>
      </button>

      {/* Trust Badges */}
      <div className="space-y-2 pt-2 text-xs text-taupe border-t border-sand/40">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-terracotta shrink-0" />
          <span>Shipping charges will be confirmed by the seller.</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sage shrink-0" />
          <span>Handcrafted with care & delivered across India</span>
        </div>
      </div>
    </div>
  );
}
