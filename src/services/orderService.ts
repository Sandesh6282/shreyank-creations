import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Order, OrderItem, OrderStatus, PaymentStatus, ShippingAddress } from "@/types/order";

export function mapDbToOrder(row: Record<string, unknown>): Order {
  const addressRaw = (row.shipping_address as unknown) as ShippingAddress || {};
  const itemsRaw = (row.order_items as unknown) as Record<string, unknown>[] || [];

  const items: OrderItem[] = Array.isArray(itemsRaw)
    ? itemsRaw.map((item) => ({
        id: String(item.id),
        orderId: String(item.order_id),
        productId: item.product_id ? String(item.product_id) : null,
        productName: String(item.product_name || "Handicraft Item"),
        productPrice: Number(item.product_price) || 0,
        quantity: Number(item.quantity) || 1,
        lineTotal: Number(item.line_total) || 0,
        createdAt: item.created_at ? String(item.created_at) : new Date().toISOString(),
      }))
    : [];

  return {
    id: String(row.id),
    userId: String(row.user_id),
    orderNumber: String(row.order_number),
    status: (row.status as OrderStatus) || "pending",
    paymentStatus: (row.payment_status as PaymentStatus) || "pending",
    subtotal: Number(row.subtotal) || 0,
    discount: Number(row.discount) || 0,
    shippingFee: Number(row.shipping_fee) || 0,
    total: Number(row.total) || 0,
    currency: String(row.currency || "INR"),
    shippingAddress: {
      fullName: String(addressRaw.fullName || "Valued Customer"),
      phone: String(addressRaw.phone || ""),
      addressLine1: String(addressRaw.addressLine1 || ""),
      addressLine2: addressRaw.addressLine2 ? String(addressRaw.addressLine2) : "",
      city: String(addressRaw.city || ""),
      state: String(addressRaw.state || ""),
      postalCode: String(addressRaw.postalCode || ""),
      country: String(addressRaw.country || "India"),
    },
    razorpayOrderId: row.razorpay_order_id ? String(row.razorpay_order_id) : undefined,
    razorpayPaymentId: row.razorpay_payment_id ? String(row.razorpay_payment_id) : undefined,
    razorpaySignature: row.razorpay_signature ? String(row.razorpay_signature) : undefined,
    notes: row.notes ? String(row.notes) : undefined,
    createdAt: row.created_at ? String(row.created_at) : new Date().toISOString(),
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
    items,
  };
}

export async function fetchCustomerOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Failed to fetch customer orders:", error);
      return [];
    }

    return data.map(mapDbToOrder);
  } catch (err) {
    console.error("Error in fetchCustomerOrders:", err);
    return [];
  }
}

export async function fetchOrderById(orderId: string): Promise<Order | null> {
  if (!isSupabaseConfigured || !supabase || !orderId) return null;

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single();

    if (error || !data) return null;
    return mapDbToOrder(data);
  } catch {
    return null;
  }
}

export async function fetchOrderByNumber(orderNumber: string): Promise<Order | null> {
  if (!isSupabaseConfigured || !supabase || !orderNumber) return null;

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", orderNumber)
      .single();

    if (error || !data) return null;
    return mapDbToOrder(data);
  } catch {
    return null;
  }
}

export async function fetchAdminOrders(filters?: {
  search?: string;
  status?: string;
  paymentStatus?: string;
}): Promise<Order[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  try {
    let query = supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    if (filters?.paymentStatus && filters.paymentStatus !== "all") {
      query = query.eq("payment_status", filters.paymentStatus);
    }

    if (filters?.search) {
      const term = `%${filters.search.trim()}%`;
      query = query.or(`order_number.ilike.${term},razorpay_order_id.ilike.${term}`);
    }

    const { data, error } = await query;

    if (error || !data) {
      console.error("Failed to fetch admin orders:", error);
      return [];
    }

    return data.map(mapDbToOrder);
  } catch (err) {
    console.error("Error in fetchAdminOrders:", err);
    return [];
  }
}

export async function updateAdminOrderStatus(
  orderId: string,
  status?: OrderStatus,
  notes?: string
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { data, error } = await supabase.rpc("admin_update_order_status", {
      p_order_id: orderId,
      p_status: status || null,
      p_notes: notes || null,
    });

    if (error) {
      console.error("Failed to update order status via admin RPC:", error);
      return false;
    }

    return Boolean(data);
  } catch (err) {
    console.error("Error in updateAdminOrderStatus:", err);
    return false;
  }
}
