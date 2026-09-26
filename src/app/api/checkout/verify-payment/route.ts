import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(req: Request) {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(
      { error: "Supabase client is not configured." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing required payment verification fields." },
        { status: 400 }
      );
    }

    const adminClient = getSupabaseAdmin();
    if (!adminClient) {
      console.error("[Payment Verification Error] SUPABASE_SERVICE_ROLE_KEY is missing on server.");
      return NextResponse.json(
        { error: "Server configuration error: Service role key is missing for payment verification." },
        { status: 500 }
      );
    }

    // 1. Verify HMAC SHA256 Signature Server-Side
    const isValidSignature = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValidSignature) {
      // Mark payment failed in database using adminClient
      await adminClient
        .from("orders")
        .update({ payment_status: "failed", updated_at: new Date().toISOString() })
        .eq("id", orderId);

      return NextResponse.json(
        { error: "Payment verification failed: Invalid signature." },
        { status: 400 }
      );
    }

    // 2. Fetch order & order items
    const { data: order, error: orderErr } = await adminClient
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single();

    if (orderErr || !order) {
      return NextResponse.json(
        { error: "Order record not found." },
        { status: 404 }
      );
    }

    // Idempotent check: If already paid or flagged with stock issue, return safe response directly
    if (order.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        orderNumber: order.order_number,
        stockIssue: false,
        message: "Payment already verified.",
      });
    }

    if (order.payment_status === "paid_stock_issue") {
      return NextResponse.json({
        success: true,
        orderNumber: order.order_number,
        stockIssue: true,
        message: "Payment recorded. Stock issue flagged for admin fulfillment/refund.",
      });
    }

    // 3. Atomic Stock Decrement via Trusted Server Client executing RPC function
    const items = order.order_items || [];
    let stockFailureCount = 0;

    for (const item of items) {
      if (!item.product_id) continue;

      const { data: decremented, error: rpcErr } = await adminClient.rpc(
        "decrement_product_stock",
        {
          p_product_id: item.product_id,
          p_quantity: Number(item.quantity),
        }
      );

      if (rpcErr || !decremented) {
        console.error(
          `[Stock Alert] Insufficient stock during payment confirmation for product ${item.product_id}:`,
          rpcErr
        );
        stockFailureCount++;
      }
    }

    // 4. Determine final payment & fulfillment status based on stock outcome
    if (stockFailureCount === 0) {
      // Full stock success
      const updatePayload = {
        status: "confirmed",
        payment_status: "paid",
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        updated_at: new Date().toISOString(),
      };

      await adminClient.from("orders").update(updatePayload).eq("id", orderId);
      await adminClient.from("cart_items").delete().eq("user_id", order.user_id);

      return NextResponse.json({
        success: true,
        orderNumber: order.order_number,
        stockIssue: false,
      });
    } else {
      // Stock conflict recovery path: Payment received via Razorpay, but stock depleted
      const stockIssueNotes = `ATTENTION ADMIN: Payment verified via Razorpay (${razorpayPaymentId}), but stock for item(s) was depleted before payment confirmation. Manual refund or fulfillment required.`;

      const updatePayload = {
        status: "processing_error",
        payment_status: "paid_stock_issue",
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        notes: stockIssueNotes,
        updated_at: new Date().toISOString(),
      };

      await adminClient.from("orders").update(updatePayload).eq("id", orderId);
      await adminClient.from("cart_items").delete().eq("user_id", order.user_id);

      return NextResponse.json({
        success: true,
        orderNumber: order.order_number,
        stockIssue: true,
        message: "Payment verified via Razorpay, but item stock was depleted prior to payment confirmation.",
      });
    }
  } catch (err) {
    console.error("Verify payment API error:", err);
    const msg = err instanceof Error ? err.message : "Payment verification error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
