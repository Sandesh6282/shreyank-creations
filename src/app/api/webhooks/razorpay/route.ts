import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";

export async function POST(req: Request) {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const adminClient = getSupabaseAdmin();
    if (!adminClient) {
      console.error("[Webhook Error] SUPABASE_SERVICE_ROLE_KEY is missing on server.");
      return NextResponse.json(
        { error: "Server configuration error: Service role key is missing for webhook processing." },
        { status: 500 }
      );
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

    if (webhookSecret) {
      const isValid = verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === "payment.captured") {
      const payment = payload.payload?.payment?.entity;
      const razorpayOrderId = payment?.order_id;
      const razorpayPaymentId = payment?.id;

      if (razorpayOrderId) {
        // Fetch order
        const { data: order } = await adminClient
          .from("orders")
          .select("*, order_items(*)")
          .eq("razorpay_order_id", razorpayOrderId)
          .single();

        if (order && order.payment_status !== "paid" && order.payment_status !== "paid_stock_issue") {
          // Atomic stock decrement
          const items = order.order_items || [];
          let stockFailureCount = 0;

          for (const item of items) {
            if (item.product_id) {
              const { data: decremented } = await adminClient.rpc("decrement_product_stock", {
                p_product_id: item.product_id,
                p_quantity: Number(item.quantity),
              });
              if (!decremented) stockFailureCount++;
            }
          }

          const newPayStatus = stockFailureCount === 0 ? "paid" : "paid_stock_issue";
          const newStatus = stockFailureCount === 0 ? "confirmed" : "processing_error";
          const notes = stockFailureCount > 0
            ? `ATTENTION ADMIN: Webhook payment captured (${razorpayPaymentId}), but stock for item(s) was depleted before webhook delivery.`
            : order.notes;

          // Update order idempotently
          await adminClient
            .from("orders")
            .update({
              status: newStatus,
              payment_status: newPayStatus,
              razorpay_payment_id: razorpayPaymentId,
              notes,
              updated_at: new Date().toISOString(),
            })
            .eq("id", order.id);

          // Clear cart
          await adminClient.from("cart_items").delete().eq("user_id", order.user_id);
        }
      }
    } else if (event === "payment.failed") {
      const payment = payload.payload?.payment?.entity;
      const razorpayOrderId = payment?.order_id;

      if (razorpayOrderId) {
        await adminClient
          .from("orders")
          .update({
            payment_status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", razorpayOrderId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Razorpay webhook error:", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
