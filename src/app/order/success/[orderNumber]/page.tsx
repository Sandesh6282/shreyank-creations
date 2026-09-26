"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { fetchOrderByNumber } from "@/services/orderService";
import { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { CheckCircle, PackageCheck, ShoppingBag, MapPin, Truck, Sparkles, ArrowRight } from "lucide-react";

interface OrderSuccessPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderNumber } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        const data = await fetchOrderByNumber(orderNumber);
        setOrder(data);
      } catch (err) {
        console.error("Failed to load order details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderNumber]);

  if (loading) {
    return <div className="py-24 text-center text-taupe bg-cream min-h-screen">Loading order confirmation details...</div>;
  }

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Order Confirmation" }]} />

        <div className="bg-cream-surface rounded-2xl border border-sand/60 p-8 shadow-card my-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold text-terracotta uppercase tracking-widest block mb-1">
            {order?.paymentStatus === "paid_stock_issue" ? "Payment Received (Stock Alert)" : "Payment Confirmed"}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso mb-2">
            {order?.paymentStatus === "paid_stock_issue" ? "Order Received with Stock Issue" : "Thank You For Your Order!"}
          </h1>
          <p className="text-xs text-taupe max-w-md mx-auto mb-6 leading-relaxed">
            {order?.paymentStatus === "paid_stock_issue"
              ? "Your payment was verified via Razorpay, but item stock was depleted prior to payment completion. Our support team has been notified for priority fulfillment or full refund."
              : "Your order has been received and confirmed. Our master artisans are preparing your handcrafted creations for safe shipment."}
          </p>

          <div className="inline-flex items-center gap-2 bg-sand-light/60 px-4 py-2 rounded-xl border border-sand text-xs font-mono text-espresso font-bold mb-8">
            <span>Order Number:</span>
            <span className="text-terracotta">{orderNumber}</span>
          </div>

          {order && (
            <div className="text-left space-y-6 border-t border-sand/40 pt-6">
              {/* Order Items Snapshot List */}
              <div>
                <h3 className="font-serif text-lg font-bold text-espresso mb-3 flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-terracotta" />
                  <span>Purchased Items</span>
                </h3>
                <div className="divide-y divide-sand/40 bg-cream rounded-xl border border-sand/40 p-4 space-y-3">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-espresso block">{item.productName}</span>
                          <span className="text-taupe">Qty: {item.quantity} &times; {formatPrice(item.productPrice)}</span>
                        </div>
                        <span className="font-serif font-bold text-espresso">{formatPrice(item.lineTotal)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-taupe">Items snapshot recorded.</p>
                  )}
                </div>
              </div>

              {/* Delivery Address & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-cream rounded-xl border border-sand/40 p-4 text-xs space-y-1">
                  <h4 className="font-bold uppercase tracking-wider text-taupe flex items-center gap-1.5 mb-2">
                    <MapPin className="w-4 h-4 text-terracotta" />
                    <span>Delivery Address</span>
                  </h4>
                  <p className="font-semibold text-espresso">{order.shippingAddress.fullName}</p>
                  <p className="text-taupe">{order.shippingAddress.addressLine1} {order.shippingAddress.addressLine2}</p>
                  <p className="text-taupe">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
                  <p className="text-espresso font-mono pt-1">Phone: {order.shippingAddress.phone}</p>
                </div>

                <div className="bg-cream rounded-xl border border-sand/40 p-4 text-xs space-y-2 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-taupe flex items-center gap-1.5 mb-2">
                      <Truck className="w-4 h-4 text-sage" />
                      <span>Shipment & Total</span>
                    </h4>
                    <p className="text-taupe">Payment Status: <span className="font-bold text-emerald-700 uppercase">Paid</span></p>
                    <p className="text-taupe">Fulfillment Status: <span className="font-bold text-espresso uppercase">{order.status}</span></p>
                  </div>
                  <div className="pt-2 border-t border-sand/40 flex justify-between items-baseline">
                    <span className="font-serif font-bold text-espresso">Total Amount Paid:</span>
                    <span className="font-serif text-xl font-bold text-terracotta">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="mt-8 pt-6 border-t border-sand flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/account" passHref>
              <Button variant="secondary" size="md" className="gap-2 w-full sm:w-auto">
                <span>View My Orders</span>
              </Button>
            </Link>
            <Link href="/shop" passHref>
              <Button variant="primary" size="md" className="gap-2 w-full sm:w-auto">
                <ShoppingBag className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
