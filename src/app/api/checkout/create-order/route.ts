import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createRazorpayOrder, isRazorpayConfigured, RAZORPAY_KEY_ID } from "@/lib/razorpay";
import { mapDbToProduct } from "@/services/productService";
import { Product } from "@/types/product";

export async function POST(req: Request) {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(
      { error: "Supabase client is not configured." },
      { status: 500 }
    );
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    // Verify session user
    const { data: { user }, error: userErr } = token
      ? await supabase.auth.getUser(token)
      : await supabase.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to proceed to checkout." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { address, promoCode, notes } = body;

    if (!address || !address.fullName || !address.addressLine1 || !address.city || !address.postalCode) {
      return NextResponse.json(
        { error: "Complete shipping address is required." },
        { status: 400 }
      );
    }

    // 1. Fetch user's cart from Supabase
    const { data: cartRows, error: cartErr } = await supabase
      .from("cart_items")
      .select("id, product_id, quantity, products(*)")
      .eq("user_id", user.id);

    if (cartErr || !cartRows || cartRows.length === 0) {
      return NextResponse.json(
        { error: "Your shopping cart is empty." },
        { status: 400 }
      );
    }

    // 2. Server-side validation of every cart product
    const orderItemsPayload: Array<{
      product_id: string;
      product_name: string;
      product_price: number;
      quantity: number;
      line_total: number;
    }> = [];

    let subtotal = 0;

    for (const itemRow of cartRows) {
      const productRow = (itemRow.products as unknown) as Record<string, unknown> | null;
      if (!productRow) {
        return NextResponse.json(
          { error: "One or more products in your cart no longer exist." },
          { status: 400 }
        );
      }

      const product: Product = mapDbToProduct(productRow);

      if (!product.active) {
        return NextResponse.json(
          { error: `Product "${product.name}" is no longer active on our storefront.` },
          { status: 400 }
        );
      }

      if (product.stock < itemRow.quantity) {
        return NextResponse.json(
          {
            error: `Requested quantity for "${product.name}" (${itemRow.quantity}) exceeds current available stock (${product.stock}).`,
          },
          { status: 400 }
        );
      }

      const dbPrice = product.price; // Already resolves to sale_price or regular price in mapDbToProduct
      const lineTotal = dbPrice * itemRow.quantity;
      subtotal += lineTotal;

      orderItemsPayload.push({
        product_id: product.id,
        product_name: product.name,
        product_price: dbPrice,
        quantity: itemRow.quantity,
        line_total: lineTotal,
      });
    }

    // 3. Trusted Server-Side Client Validation (Requires Service Role Key)
    const adminClient = getSupabaseAdmin();
    if (!adminClient) {
      console.error("[Checkout Server Error] SUPABASE_SERVICE_ROLE_KEY is missing on server.");
      return NextResponse.json(
        { error: "Server configuration error: Service role key is missing for order processing." },
        { status: 500 }
      );
    }

    let discount = 0;

    if (promoCode && typeof promoCode === "string") {
      const cleanCode = promoCode.trim().toUpperCase();

      const { data: couponData } = await adminClient
        .from("coupons")
        .select("*")
        .eq("code", cleanCode)
        .eq("active", true)
        .single();

      if (couponData) {
        const minOrder = Number(couponData.min_order_amount) || 0;
        const expiresAt = couponData.expires_at ? new Date(String(couponData.expires_at)) : null;
        const isNotExpired = !expiresAt || expiresAt > new Date();

        if (subtotal >= minOrder && isNotExpired) {
          if (couponData.discount_type === "percentage") {
            discount = Math.round((subtotal * Number(couponData.discount_value)) / 100);
          } else {
            discount = Number(couponData.discount_value);
          }
        }
      }
    }

    // 4. Server-side Shipping Fee Calculation
    const shippingFee = subtotal >= 1000 ? 0 : 99; // Free shipping over ₹1,000
    const finalTotal = Math.max(0, subtotal - discount + shippingFee);

    // 5. Generate human-readable Order Number
    const orderNumber = `SC-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const shippingAddressJson = {
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country || "India",
    };

    // 6. Insert Order Record into public.orders (Using Trusted Admin Client)
    const { data: orderData, error: orderInsertErr } = await adminClient
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: "pending",
        payment_status: "pending",
        subtotal,
        discount,
        shipping_fee: shippingFee,
        total: finalTotal,
        currency: "INR",
        shipping_address: shippingAddressJson,
        notes: notes || null,
      })
      .select()
      .single();

    if (orderInsertErr || !orderData) {
      console.error("Order creation failed in Supabase:", orderInsertErr);
      return NextResponse.json(
        { error: `Order creation failed: ${orderInsertErr?.message || "Unknown error"}` },
        { status: 500 }
      );
    }

    // 7. Insert Order Items Snapshots (Using Trusted Admin Client)
    const itemsToInsert = orderItemsPayload.map((item) => ({
      ...item,
      order_id: orderData.id,
    }));

    const { error: itemsErr } = await adminClient.from("order_items").insert(itemsToInsert);

    if (itemsErr) {
      console.error("Failed to insert order items:", itemsErr);
      return NextResponse.json(
        { error: "Failed to record order item snapshots." },
        { status: 500 }
      );
    }

    // 8. Create Razorpay Order
    const rzpOrder = await createRazorpayOrder(finalTotal, orderNumber);

    // Update order with razorpay_order_id (Using Trusted Admin Client)
    await adminClient
      .from("orders")
      .update({ razorpay_order_id: rzpOrder.id })
      .eq("id", orderData.id);

    return NextResponse.json({
      success: true,
      orderId: orderData.id,
      orderNumber,
      total: finalTotal,
      currency: "INR",
      razorpayOrderId: rzpOrder.id,
      razorpayKeyId: isRazorpayConfigured ? RAZORPAY_KEY_ID : "rzp_test_mock_key",
      isMock: rzpOrder.isMock,
      userEmail: user.email,
      userName: address.fullName,
    });
  } catch (err) {
    console.error("Checkout API error:", err);
    const msg = err instanceof Error ? err.message : "Internal checkout error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
