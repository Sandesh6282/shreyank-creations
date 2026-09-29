import { CartItem } from "@/types/product";

export async function fetchUserCart(): Promise<CartItem[]> {
  return [];
}

export async function syncCartItemToDb(): Promise<void> {
  // No-op for guest cart architecture
}

export async function removeCartItemFromDb(): Promise<void> {
  // No-op for guest cart architecture
}

export async function clearUserCartInDb(): Promise<void> {
  // No-op for guest cart architecture
}

export async function mergeGuestCartIntoUserCart(
  guestItems: CartItem[]
): Promise<CartItem[]> {
  return guestItems;
}
