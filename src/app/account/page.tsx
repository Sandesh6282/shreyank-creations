"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AccountGuard } from "@/components/auth/AccountGuard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { fetchCustomerProfile, customerSignOut } from "@/services/customerAuthService";
import { fetchCustomerOrders } from "@/services/orderService";
import { UserProfile } from "@/types/auth";
import { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { useWishlist } from "@/context/WishlistContext";
import { User, Mail, Phone, LogOut, ShoppingBag, Heart, PackageCheck, Sparkles, ChevronRight } from "lucide-react";

function AccountContent() {
  const router = useRouter();
  const { addToast } = useToast();
  const { totalWishlistItems } = useWishlist();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userProf, customerOrders] = await Promise.all([
          fetchCustomerProfile(),
          fetchCustomerOrders(),
        ]);
        setProfile(userProf);
        setOrders(customerOrders);
      } catch (err) {
        console.error("Failed to load customer details:", err);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await customerSignOut();
      addToast("Signed out successfully");
      router.replace("/login");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign out";
      addToast(msg, "error");
    }
  };

  return (
    <div className="bg-cream min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "My Account" }]} />

        {/* Dashboard Title & Logout Row */}
        <div className="py-6 border-b border-sand/40 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso">
              Welcome, {profile?.fullName || "Valued Customer"}
            </h1>
            <p className="text-xs text-taupe mt-1">
              Manage your personal details, order history, delivery addresses, and saved wishlist.
            </p>
          </div>

          <Button
            onClick={handleLogout}
            variant="secondary"
            size="sm"
            className="gap-1.5 self-start md:self-auto border-red-200 text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer Profile Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-cream-surface rounded-2xl border border-sand/60 p-6 shadow-card">
              <div className="flex items-center gap-4 pb-4 border-b border-sand/40 mb-4">
                <div className="w-14 h-14 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center font-serif text-xl font-bold shrink-0">
                  {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-espresso text-base line-clamp-1">
                    {profile?.fullName || "Customer"}
                  </h3>
                  <span className="text-[11px] text-taupe block font-mono">
                    Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "2026"}
                  </span>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-espresso">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-taupe shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-taupe block">Full Name</span>
                    <span className="font-medium">{profile?.fullName || "Not provided"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-taupe shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-taupe block">Email Address</span>
                    <span className="font-medium">{profile?.email || "Not provided"}</span>
                  </div>
                </div>

                {profile?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-taupe shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-taupe block">Phone Number</span>
                      <span className="font-medium">{profile.phone}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-cream-surface rounded-2xl border border-sand/60 p-6 shadow-card space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-taupe mb-2">Quick Navigation</h4>
              <Link href="/wishlist" className="flex items-center justify-between p-3 rounded-xl bg-cream hover:bg-sand/30 transition-colors text-xs font-medium text-espresso">
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-terracotta" />
                  <span>Saved Wishlist ({totalWishlistItems})</span>
                </div>
                <span className="text-terracotta font-bold">&rarr;</span>
              </Link>
              <Link href="/shop" className="flex items-center justify-between p-3 rounded-xl bg-cream hover:bg-sand/30 transition-colors text-xs font-medium text-espresso">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-terracotta" />
                  <span>Explore Craft Catalog</span>
                </div>
                <span className="text-terracotta font-bold">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-8 space-y-6">
            {/* Orders Section */}
            <div className="bg-cream-surface rounded-2xl border border-sand/60 p-6 shadow-card">
              <div className="flex items-center justify-between border-b border-sand/40 pb-4 mb-6">
                <h3 className="font-serif text-lg font-bold text-espresso flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-terracotta" />
                  <span>Order History</span>
                </h3>
                <span className="text-xs text-taupe font-semibold">
                  {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                </span>
              </div>

              {loadingOrders ? (
                <div className="py-8 text-center text-xs text-taupe">Loading order history...</div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 bg-cream rounded-xl border border-sand/60 shadow-xs space-y-3 hover:border-terracotta/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand/40 pb-3">
                        <div>
                          <span className="font-serif font-bold text-espresso text-base block">
                            Order #{order.orderNumber}
                          </span>
                          <span className="text-[11px] text-taupe">
                            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={order.paymentStatus === "paid" ? "sage" : "terracotta"}>
                            {order.paymentStatus.toUpperCase()}
                          </Badge>
                          <Badge variant={order.status === "confirmed" || order.status === "delivered" ? "sage" : "terracotta"}>
                            {order.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="text-taupe">
                          <span>{order.items?.length || 0} Items</span>
                          <span className="mx-2">&bull;</span>
                          <span>Delivering to <strong className="text-espresso">{order.shippingAddress.city}</strong></span>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <span className="font-serif font-bold text-base text-espresso">
                            {formatPrice(order.total)}
                          </span>
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-terracotta hover:underline"
                          >
                            <span>View Order</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center bg-cream rounded-xl border border-sand/40 px-4">
                  <Sparkles className="w-8 h-8 text-terracotta mx-auto mb-3" />
                  <h4 className="font-serif font-bold text-espresso text-base mb-1">No Orders Placed Yet</h4>
                  <p className="text-xs text-taupe max-w-sm mx-auto mb-6 leading-relaxed">
                    Your order history will appear here once you make your first purchase. Explore our collection of handcrafted Indian arts and decor.
                  </p>
                  <Link href="/shop" passHref>
                    <Button variant="primary" size="md" className="gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Browse Craft Catalog</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <AccountGuard>
      <AccountContent />
    </AccountGuard>
  );
}
