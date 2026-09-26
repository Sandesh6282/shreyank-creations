"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { fetchOrderById } from "@/services/orderService";
import { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";
import { AccountGuard } from "@/components/auth/AccountGuard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ArrowLeft, PackageCheck, MapPin, Truck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface CustomerOrderDetailPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

function CustomerOrderDetailContent({ params }: CustomerOrderDetailPageProps) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        const data = await fetchOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order by ID:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return <div className="py-24 text-center text-taupe bg-cream min-h-screen">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="bg-cream min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-espresso mb-2">Order Not Found</h2>
          <p className="text-xs text-taupe mb-6">The requested order does not exist or you do not have permission to view it.</p>
          <Link href="/account" className="text-xs font-semibold text-terracotta hover:underline">
            &larr; Back to My Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "My Account", href: "/account" }, { label: `Order #${order.orderNumber}` }]} />

        <div className="flex items-center justify-between py-6 border-b border-sand/40 mb-8">
          <div>
            <span className="text-[11px] font-bold text-taupe uppercase tracking-wider block">Order Details</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
              #{order.orderNumber}
            </h1>
          </div>

          <Link href="/account" className="text-xs font-semibold text-espresso hover:text-terracotta flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Account</span>
          </Link>
        </div>

        <div className="space-y-6">
          {/* Order Header Summary */}
          <div className="bg-cream-surface rounded-2xl border border-sand/60 p-6 shadow-card grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-taupe uppercase font-bold text-[10px] block">Order Date</span>
              <span className="font-medium text-espresso">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
            <div>
              <span className="text-taupe uppercase font-bold text-[10px] block">Order Status</span>
              <Badge variant={order.status === "confirmed" || order.status === "delivered" ? "sage" : "terracotta"}>
                {order.status.toUpperCase()}
              </Badge>
            </div>
            <div>
              <span className="text-taupe uppercase font-bold text-[10px] block">Payment Status</span>
              <Badge variant={order.paymentStatus === "paid" ? "sage" : "terracotta"}>
                {order.paymentStatus.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="bg-cream-surface rounded-2xl border border-sand/60 p-6 shadow-card">
            <h3 className="font-serif text-lg font-bold text-espresso mb-4 flex items-center gap-2 border-b border-sand/40 pb-3">
              <PackageCheck className="w-5 h-5 text-terracotta" />
              <span>Items in this Order</span>
            </h3>

            <div className="divide-y divide-sand/40 text-xs">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-espresso text-sm">{item.productName}</h4>
                      <p className="text-taupe mt-0.5">Quantity: {item.quantity} &times; {formatPrice(item.productPrice)}</p>
                    </div>
                    <span className="font-serif font-bold text-base text-espresso">{formatPrice(item.lineTotal)}</span>
                  </div>
                ))
              ) : (
                <p className="text-taupe italic">No item snapshot details recorded.</p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-sand/60 space-y-2 text-xs">
              <div className="flex justify-between text-taupe">
                <span>Subtotal</span>
                <span className="font-medium text-espresso">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-terracotta">
                  <span>Discount</span>
                  <span className="font-medium">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-taupe">
                <span>Shipping Fee</span>
                <span className="font-medium">{order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}</span>
              </div>
              <div className="pt-2 border-t border-sand/40 flex justify-between items-baseline font-serif">
                <span className="font-bold text-espresso text-base">Grand Total</span>
                <span className="font-bold text-xl text-terracotta">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-cream-surface rounded-2xl border border-sand/60 p-6 shadow-card text-xs space-y-2">
              <h4 className="font-serif text-base font-bold text-espresso flex items-center gap-2 border-b border-sand/40 pb-2">
                <MapPin className="w-4 h-4 text-terracotta" />
                <span>Delivery Address</span>
              </h4>
              <p className="font-bold text-espresso">{order.shippingAddress.fullName}</p>
              <p className="text-taupe">{order.shippingAddress.addressLine1} {order.shippingAddress.addressLine2}</p>
              <p className="text-taupe">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
              <p className="text-espresso font-mono pt-1">Phone: {order.shippingAddress.phone}</p>
            </div>

            <div className="bg-cream-surface rounded-2xl border border-sand/60 p-6 shadow-card text-xs space-y-2">
              <h4 className="font-serif text-base font-bold text-espresso flex items-center gap-2 border-b border-sand/40 pb-2">
                <Truck className="w-4 h-4 text-sage" />
                <span>Payment Reference</span>
              </h4>
              <p className="text-taupe">Razorpay Order ID: <span className="font-mono text-espresso">{order.razorpayOrderId || "N/A"}</span></p>
              <p className="text-taupe">Payment Transaction ID: <span className="font-mono text-espresso">{order.razorpayPaymentId || "N/A"}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerOrderDetailPage({ params }: CustomerOrderDetailPageProps) {
  return (
    <AccountGuard>
      <CustomerOrderDetailContent params={params} />
    </AccountGuard>
  );
}
