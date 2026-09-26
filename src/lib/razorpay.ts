import crypto from "crypto";

export const RAZORPAY_KEY_ID =
  process.env.RAZORPAY_KEY_ID ||
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
  "";

export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

export const isRazorpayConfigured = Boolean(
  RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET
);

export interface RazorpayOrderResult {
  id: string;
  amount: number;
  currency: string;
  keyId: string;
  isMock: boolean;
}

/**
 * Creates a Razorpay order via server REST API.
 * Uses amount in paise (1 INR = 100 paise).
 * Strictly forbids test simulation in production environment.
 */
export async function createRazorpayOrder(
  amountInRupees: number,
  orderNumber: string
): Promise<RazorpayOrderResult> {
  const amountInPaise = Math.round(amountInRupees * 100);
  const isProduction = process.env.NODE_ENV === "production";

  if (!isRazorpayConfigured) {
    if (isProduction) {
      console.error(
        "[Razorpay Error] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing in production environment!"
      );
      throw new Error(
        "Payment gateway configuration error. Live payment credentials are required in production."
      );
    }

    console.warn(
      "[Razorpay Dev] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing in development mode. Operating in test simulation."
    );
    return {
      id: `rzp_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      amount: amountInPaise,
      currency: "INR",
      keyId: "rzp_test_mock_key",
      isMock: true,
    };
  }

  const authHeader = Buffer.from(
    `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`
  ).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authHeader}`,
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: "INR",
      receipt: orderNumber,
      notes: {
        store: "Shreyank Creations",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Razorpay Server] API order creation failed:", errorText);
    throw new Error(`Razorpay Order Creation Failed: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    id: data.id,
    amount: data.amount,
    currency: data.currency,
    keyId: RAZORPAY_KEY_ID,
    isMock: false,
  };
}

/**
 * Verifies Razorpay HMAC SHA256 payment signature.
 * Mock signature validation is strictly disabled in production.
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const isProduction = process.env.NODE_ENV === "production";

  if (orderId.startsWith("rzp_mock_") || signature === "mock_signature_valid") {
    if (isProduction) {
      console.error("[Razorpay Security] Mock signatures are forbidden in production!");
      return false;
    }
    return true;
  }

  if (!RAZORPAY_KEY_SECRET) {
    console.error("[Razorpay Security] Cannot verify signature: RAZORPAY_KEY_SECRET is missing.");
    return false;
  }

  const text = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(text)
    .digest("hex");

  return generatedSignature === signature;
}

/**
 * Verifies Razorpay Webhook HMAC SHA256 signature.
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string
): boolean {
  if (!webhookSecret || !signature) return false;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  return expectedSignature === signature;
}
