import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { CartItem, Product } from "@/types/product";
import { mapDbToProduct } from "@/services/productService";

/**
 * Fetch all cart items for a logged-in customer from Supabase.
 * Filters out inactive/deleted products and caps quantities to available stock.
 */
export async function fetchUserCart(userId: string): Promise<CartItem[]> {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return [];
  }

  try {
    const { data: cartRows, error: cartErr } = await supabase
      .from("cart_items")
      .select("id, product_id, quantity, products(*)")
      .eq("user_id", userId);

    if (cartErr || !cartRows) {
      console.error("Failed to fetch user cart items:", cartErr);
      return [];
    }

    const items: CartItem[] = [];

    for (const row of cartRows) {
      const productRow = (row.products as unknown) as Record<string, unknown> | null;
      if (!productRow) continue;

      const product: Product = mapDbToProduct(productRow);

      // Filter out inactive products
      if (!product.active) {
        // Clean up inactive item from DB asynchronously
        removeCartItemFromDb(userId, product.id).catch(() => {});
        continue;
      }

      // Check stock limit
      if (product.stock <= 0) {
        removeCartItemFromDb(userId, product.id).catch(() => {});
        continue;
      }

      const validQuantity = Math.min(Number(row.quantity) || 1, product.stock);

      // If quantity was capped due to stock decrease, update DB record
      if (validQuantity !== row.quantity) {
        syncCartItemToDb(userId, product.id, validQuantity).catch(() => {});
      }

      items.push({
        product,
        quantity: validQuantity,
      });
    }

    return items;
  } catch (err) {
    console.error("Error in fetchUserCart:", err);
    return [];
  }
}

/**
 * Sync a single product quantity in Supabase cart_items table.
 */
export async function syncCartItemToDb(
  userId: string,
  productId: string,
  quantity: number
): Promise<void> {
  if (!isSupabaseConfigured || !supabase || !userId) return;

  try {
    if (quantity <= 0) {
      await removeCartItemFromDb(userId, productId);
      return;
    }

    const { error } = await supabase.from("cart_items").upsert(
      {
        user_id: userId,
        product_id: productId,
        quantity,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,product_id",
      }
    );

    if (error) {
      console.error("Failed to sync cart item to database:", error);
    }
  } catch (err) {
    console.error("Error in syncCartItemToDb:", err);
  }
}

/**
 * Delete a product item from user's Supabase cart.
 */
export async function removeCartItemFromDb(
  userId: string,
  productId: string
): Promise<void> {
  if (!isSupabaseConfigured || !supabase || !userId) return;

  try {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) {
      console.error("Failed to remove cart item from database:", error);
    }
  } catch (err) {
    console.error("Error in removeCartItemFromDb:", err);
  }
}

/**
 * Delete all cart items for user in Supabase.
 */
export async function clearUserCartInDb(userId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase || !userId) return;

  try {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to clear user cart in database:", error);
    }
  } catch (err) {
    console.error("Error in clearUserCartInDb:", err);
  }
}

/**
 * Merge local guest cart items into user's persistent Supabase cart upon login.
 */
export async function mergeGuestCartIntoUserCart(
  userId: string,
  guestItems: CartItem[]
): Promise<CartItem[]> {
  if (!isSupabaseConfigured || !supabase || !userId) return guestItems;

  try {
    // 1. Fetch current DB cart for user
    const dbItems = await fetchUserCart(userId);
    const dbItemMap = new Map<string, number>();

    for (const item of dbItems) {
      dbItemMap.set(item.product.id, item.quantity);
    }

    // 2. Merge guest items into DB
    for (const guestItem of guestItems) {
      const productId = guestItem.product.id;
      const currentDbQty = dbItemMap.get(productId) || 0;
      const maxStock = guestItem.product.stock;

      const mergedQty = Math.min(currentDbQty + guestItem.quantity, maxStock);

      if (mergedQty > 0) {
        await syncCartItemToDb(userId, productId, mergedQty);
      }
    }

    // 3. Re-fetch updated user cart from DB
    return await fetchUserCart(userId);
  } catch (err) {
    console.error("Error merging guest cart into user cart:", err);
    return fetchUserCart(userId);
  }
}
