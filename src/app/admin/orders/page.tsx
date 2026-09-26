"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { fetchAdminOrders, updateAdminOrderStatus } from "@/services/orderService";
import { Order, OrderStatus } from "@/types/order";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { Search, ShoppingBag, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function AdminOrdersPage() {
  const { addToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminOrders({
        search: searchQuery,
        status: statusFilter,
        paymentStatus: paymentFilter,
      });
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, paymentFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const ok = await updateAdminOrderStatus(orderId, newStatus);
      if (ok) {
        addToast(`Updated order status to "${newStatus}"`);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        addToast("Failed to update order status", "error");
      }
    } catch {
      addToast("Failed to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-cream min-h-screen pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="mb-8 border-b border-sand/40 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-espresso">
              Customer Order Management
            </h1>
            <p className="text-xs text-taupe mt-1">
              View customer orders, verify payment status, and update shipping fulfillment.
            </p>
          </div>

          <button
            onClick={loadOrders}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso hover:text-terracotta bg-cream-surface border border-sand px-3.5 py-2 rounded-lg"
          >
            <RefreshCw className="w-3.5 h-3.5 text-terracotta" />
            <span>Refresh Orders</span>
          </button>
        </div>

        {/* Filters & Search Row */}
        <div className="bg-cream-surface rounded-xl border border-sand/60 p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search by order number (e.g. SC-...) or Razorpay ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2 bg-cream border border-sand rounded-lg text-xs font-medium text-espresso focus:outline-none focus:border-terracotta"
            />
            <Search className="w-4 h-4 text-taupe absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-terracotta text-cream text-[11px] font-semibold px-3 py-1 rounded"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-taupe font-semibold">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-cream border border-sand rounded-lg px-2.5 py-1.5 text-xs font-medium text-espresso focus:outline-none"
              >
                <option value="all">All Order Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="processing_error">Processing Error</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-taupe font-semibold">Payment:</span>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="bg-cream border border-sand rounded-lg px-2.5 py-1.5 text-xs font-medium text-espresso focus:outline-none"
              >
                <option value="all">All Payment Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="paid_stock_issue">Paid (Stock Alert)</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-cream-surface rounded-xl border border-sand/60 shadow-card overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-taupe">Loading customer orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-taupe">
              <ShoppingBag className="w-10 h-10 text-sand mx-auto mb-2" />
              <h3 className="font-serif font-bold text-espresso text-base mb-1">No Orders Found</h3>
              <p className="text-xs">No orders match your filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-espresso">
                <thead className="bg-sand/30 text-taupe uppercase text-[10px] font-bold tracking-wider border-b border-sand/60">
                  <tr>
                    <th className="py-3 px-4">Order Number</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Customer & City</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Payment Status</th>
                    <th className="py-3 px-4">Fulfillment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/40 font-medium">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-cream/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-serif font-bold text-espresso block">{order.orderNumber}</span>
                        {order.razorpayPaymentId && (
                          <span className="text-[10px] text-taupe font-mono">
                            {order.razorpayPaymentId}
                          </span>
                        )}
                        {order.notes && (
                          <p className="text-[10px] text-red-700 mt-1 max-w-xs leading-tight font-sans">
                            {order.notes}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-taupe">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold block">{order.shippingAddress.fullName}</span>
                        <span className="text-[11px] text-taupe">{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-espresso">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            order.paymentStatus === "paid"
                              ? "sage"
                              : order.paymentStatus === "paid_stock_issue"
                              ? "terracotta"
                              : "sand"
                          }
                        >
                          {order.paymentStatus.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className={`text-[11px] font-bold px-2.5 py-1.5 rounded border focus:outline-none ${
                            order.status === "confirmed" || order.status === "delivered"
                              ? "bg-sage/20 text-sage-dark border-sage/40"
                              : order.status === "shipped"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : order.status === "cancelled" || order.status === "processing_error"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-amber-50 text-amber-800 border-amber-300"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="processing_error">Processing Error</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
