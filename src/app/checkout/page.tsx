"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { fetchCustomerProfile } from "@/services/customerAuthService";
import { AccountGuard } from "@/components/auth/AccountGuard";
import { AddressManager } from "@/components/checkout/AddressManager";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { formatPrice } from "@/lib/utils";
import { UserProfile } from "@/types/auth";
import { ShippingAddress } from "@/types/order";
import { useToast } from "@/context/ToastContext";
import { buildCheckoutWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import {
  Truck,
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

function CheckoutContent() {
  const { addToast } = useToast();
  const { cartItems, revalidateCart } = useCart();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const userProf = await fetchCustomerProfile();
        setProfile(userProf);
        await revalidateCart();
      } catch (err) {
        console.error("Order enquiry init error:", err);
      }
    }
    loadData();
  }, [revalidateCart]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleSendWhatsAppEnquiry = () => {
    setErrorMsg("");

    if (!selectedAddress) {
      setErrorMsg("Please select or add a delivery address before sending your enquiry.");
      addToast("Delivery address is required.", "error");
      return;
    }

    if (cartItems.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    const whatsappUrl = buildCheckoutWhatsAppUrl({
      cartItems,
      address: selectedAddress,
    });

    addToast("Opening WhatsApp with your order enquiry details...", "info");
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-cream min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Order Enquiry" }]} />
          <div className="py-16 text-center max-w-md mx-auto bg-cream-surface rounded-2xl border border-sand/60 p-8 shadow-card my-8">
            <ShoppingBag className="w-12 h-12 text-terracotta mx-auto mb-3" />
            <h2 className="font-serif text-2xl font-bold text-espresso mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-xs text-taupe mb-6 leading-relaxed">
              Please add handicraft creations to your cart before proceeding to order enquiry.
            </p>
            <Link href="/shop" passHref>
              <button className="py-2.5 px-6 bg-terracotta text-cream rounded-xl text-xs font-semibold hover:bg-terracotta-dark transition-colors">
                Browse Shop Collection
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Shopping Cart", href: "/cart" }, { label: "Order Enquiry" }]} />

        {/* Title & Back to Cart */}
        <div className="flex items-center justify-between py-6 border-b border-sand/40 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-espresso flex items-center gap-2">
              <span>WhatsApp Order Enquiry</span>
            </h1>
            <p className="text-xs text-taupe mt-0.5">
              Confirm your delivery address and send your order enquiry directly to our artisan team on WhatsApp.
            </p>
          </div>

          <Link
            href="/cart"
            className="text-xs font-semibold text-espresso hover:text-terracotta flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cart</span>
          </Link>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer Info & Address Selection */}
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Contact Details Summary */}
            <div className="bg-cream-surface rounded-2xl border border-sand/60 p-6 shadow-card space-y-3">
              <h3 className="font-serif text-lg font-bold text-espresso border-b border-sand/40 pb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-sage" />
                <span>Customer Information</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-espresso">
                <div>
                  <span className="text-[10px] font-bold text-taupe uppercase tracking-wider block">Full Name</span>
                  <span className="font-semibold">{profile?.fullName || "Valued Customer"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-taupe uppercase tracking-wider block">Email Address</span>
                  <span className="font-semibold">{profile?.email || ""}</span>
                </div>
              </div>
            </div>

            {/* Address Selector */}
            <div className="bg-cream-surface rounded-2xl border border-sand/60 p-6 shadow-card">
              <AddressManager
                selectedAddress={selectedAddress}
                onSelectAddress={setSelectedAddress}
              />
            </div>
          </div>

          {/* Right Column: Enquiry Summary & WhatsApp CTA */}
          <div className="lg:col-span-5">
            <div className="bg-cream-surface rounded-2xl border border-sand/60 p-6 shadow-card space-y-6 sticky top-24">
              <h3 className="font-serif text-xl font-bold text-espresso border-b border-sand pb-4 flex items-center justify-between">
                <span>Enquiry Summary</span>
                <span className="text-xs text-taupe font-sans font-normal">
                  {cartItems.length} Items
                </span>
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs border-b border-sand/40 pb-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-espresso line-clamp-1">
                        {item.product.name}
                      </span>
                      <span className="text-[11px] text-taupe">
                        Qty: {item.quantity} &times; {formatPrice(item.product.price)}
                      </span>
                    </div>
                    <span className="font-semibold text-espresso font-serif">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-taupe">
                  <span>Subtotal</span>
                  <span className="font-semibold text-espresso">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-taupe">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-taupe italic">Confirmed by seller</span>
                </div>

                <div className="pt-3 border-t border-sand flex justify-between items-baseline">
                  <div>
                    <span className="font-serif text-lg font-bold text-espresso block">Estimated total</span>
                    <span className="text-[11px] text-taupe block">Final pricing confirmed via WhatsApp</span>
                  </div>
                  <span className="font-serif text-2xl font-bold text-terracotta">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              {/* WhatsApp Order Enquiry CTA */}
              <button
                onClick={handleSendWhatsAppEnquiry}
                disabled={!selectedAddress}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2.5 shadow-md ${
                  selectedAddress
                    ? "bg-[#25D366] text-white hover:bg-[#20bd5a] cursor-pointer"
                    : "bg-sand/80 text-taupe cursor-not-allowed opacity-70"
                }`}
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                <span>Send Order Enquiry on WhatsApp</span>
              </button>

              {/* Security & Support Footnote */}
              <div className="space-y-2 pt-2 text-[11px] text-taupe border-t border-sand/40">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-sage shrink-0" />
                  <span>Direct 1-on-1 chat with Shreyank Creations seller</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-terracotta shrink-0" />
                  <span>Insured ceramic & brass artisan packaging</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <AccountGuard>
      <CheckoutContent />
    </AccountGuard>
  );
}
