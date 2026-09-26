/**
 * Shreyank Creations - WhatsApp Integration Service
 * Helper utilities for WhatsApp-based commerce & order enquiries.
 */

import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/product";

export interface CartItemWhatsAppInfo {
  product: Product;
  quantity: number;
}

export interface ShippingAddressWhatsAppInfo {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

/**
 * Returns the sanitized seller WhatsApp phone number.
 * Reads NEXT_PUBLIC_SELLER_WHATSAPP from environment, falling back to default artisan contact.
 * Strips non-digit characters to format cleanly for wa.me links.
 */
export function getSellerWhatsAppNumber(): string {
  const envPhone = process.env.NEXT_PUBLIC_SELLER_WHATSAPP || "918951119766";
  return envPhone.replace(/\D/g, "");
}

/**
 * Constructs a wa.me URL given a message text and optional phone number.
 * Safely URL-encodes the message body for cross-platform support (mobile app & WhatsApp Web).
 */
export function buildWhatsAppUrl(text: string, phone?: string): string {
  const cleanPhone = phone ? phone.replace(/\D/g, "") : getSellerWhatsAppNumber();
  const encodedText = encodeURIComponent(text.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Helper to dynamically determine the current site origin in the browser.
 */
function getSiteOrigin(customOrigin?: string): string {
  if (customOrigin) return customOrigin;
  if (typeof window !== "undefined" && window.location && window.location.origin) {
    return window.location.origin;
  }
  return "";
}

/**
 * Helper to build absolute product page URL dynamically.
 */
function getProductUrl(product: Product, origin?: string): string {
  const base = getSiteOrigin(origin);
  const path = product.slug ? `/product/${product.slug}` : (product.id ? `/product/${product.id}` : "");
  return base ? `${base}${path}` : path;
}

/**
 * Generates WhatsApp enquiry/buy link for a single product.
 */
export function buildSingleProductWhatsAppUrl({
  product,
  quantity = 1,
  origin,
}: {
  product: Product;
  quantity?: number;
  origin?: string;
}): string {
  const productUrl = getProductUrl(product, origin);
  const displayPrice = product.salePrice ?? product.price;

  const message = `Hi Shreyank Creations, I'm interested in purchasing:

Product: ${product.name}
Price: ${formatPrice(displayPrice)}
Quantity: ${quantity}

Product link:
${productUrl}

Please confirm availability and delivery details.

Delivery Address:
[Customer will enter their full delivery address in WhatsApp]`;

  return buildWhatsAppUrl(message);
}

/**
 * Generates WhatsApp enquiry link for all items in the shopping cart.
 */
export function buildCartWhatsAppUrl({
  cartItems,
  origin,
}: {
  cartItems: CartItemWhatsAppInfo[];
  origin?: string;
}): string {
  if (cartItems.length === 0) {
    const emptyMsg = `Hi Shreyank Creations, I'd like to enquire about your handicraft collection.`;
    return buildWhatsAppUrl(emptyMsg);
  }

  let itemsSummary = "";
  let subtotal = 0;

  cartItems.forEach((item, index) => {
    const displayPrice = item.product.salePrice ?? item.product.price;
    const lineTotal = displayPrice * item.quantity;
    subtotal += lineTotal;

    const itemUrl = getProductUrl(item.product, origin);

    itemsSummary += `${index + 1}. ${item.product.name}
   Quantity: ${item.quantity}
   Price: ${formatPrice(displayPrice)}
   Subtotal: ${formatPrice(lineTotal)}
   Product: ${itemUrl}\n\n`;
  });

  const message = `Hi Shreyank Creations, I'd like to enquire about these products:

${itemsSummary.trim()}

Estimated Product Total: ${formatPrice(subtotal)}

Please confirm availability, final price, shipping charges and delivery details.

Delivery Address:
[Customer will enter their full delivery address in WhatsApp]`;

  return buildWhatsAppUrl(message);
}

/**
 * Generates WhatsApp enquiry link including delivery address details.
 */
export function buildCheckoutWhatsAppUrl({
  cartItems,
  address,
  origin,
}: {
  cartItems: CartItemWhatsAppInfo[];
  address?: ShippingAddressWhatsAppInfo | null;
  origin?: string;
}): string {
  let itemsSummary = "";
  let subtotal = 0;

  cartItems.forEach((item, index) => {
    const displayPrice = item.product.salePrice ?? item.product.price;
    const lineTotal = displayPrice * item.quantity;
    subtotal += lineTotal;

    const itemUrl = getProductUrl(item.product, origin);

    itemsSummary += `${index + 1}. ${item.product.name}
   Quantity: ${item.quantity}
   Price: ${formatPrice(displayPrice)}
   Subtotal: ${formatPrice(lineTotal)}
   Product: ${itemUrl}\n\n`;
  });

  let addressSummary = "\n\nDelivery Address:\n[Customer will enter their full delivery address in WhatsApp]";
  if (address) {
    addressSummary = `\n\nDelivery Address:
Name: ${address.fullName}
Phone: ${address.phone}
Address: ${address.addressLine1}${address.addressLine2 ? `, ${address.addressLine2}` : ""}, ${address.city}, ${address.state} - ${address.postalCode}`;
  }

  const message = `Hi Shreyank Creations, I'd like to place an order enquiry for the following items:

${itemsSummary.trim()}

Estimated Product Total: ${formatPrice(subtotal)}${addressSummary}

Please confirm availability, final price, shipping charges and delivery details.`;

  return buildWhatsAppUrl(message);
}
