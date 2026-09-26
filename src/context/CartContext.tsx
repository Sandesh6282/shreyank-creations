"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CartItem, Product } from "@/types/product";
import { useToast } from "./ToastContext";
import {
  fetchUserCart,
  syncCartItemToDb,
  removeCartItemFromDb,
  clearUserCartInDb,
  mergeGuestCartIntoUserCart,
} from "@/services/cartService";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  revalidateCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  totalAmount: number;
  isSyncing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "shreyank_creations_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const { addToast } = useToast();

  // Helper to load guest items from localStorage safely
  const getGuestCartFromStorage = (): CartItem[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // Clear guest cart from localStorage
  const clearGuestStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Revalidate existing cart items against fresh Supabase product state
  const revalidateCart = useCallback(async () => {
    if (cartItems.length === 0) return;

    try {
      const { fetchStorefrontProducts } = await import("@/services/productService");
      const freshProducts = await fetchStorefrontProducts();
      const productMap = new Map<string, Product>();

      for (const p of freshProducts) {
        productMap.set(p.id, p);
      }

      setCartItems((prev) => {
        const updated: CartItem[] = [];
        let itemsRemoved = false;
        let itemsAdjusted = false;

        for (const item of prev) {
          const fresh = productMap.get(item.product.id);

          if (!fresh || !fresh.active || fresh.stock <= 0) {
            itemsRemoved = true;
            if (userId) {
              removeCartItemFromDb(userId, item.product.id).catch(() => {});
            }
            continue;
          }

          let validQty = item.quantity;
          if (validQty > fresh.stock) {
            validQty = fresh.stock;
            itemsAdjusted = true;
          }

          if (userId && validQty !== item.quantity) {
            syncCartItemToDb(userId, fresh.id, validQty).catch(() => {});
          }

          updated.push({
            product: fresh,
            quantity: validQty,
          });
        }

        if (itemsRemoved) {
          addToast("Some unavailable items were removed from your cart.", "info");
        } else if (itemsAdjusted) {
          addToast("Cart quantities updated based on available product stock.", "info");
        }

        return updated;
      });
    } catch (e) {
      console.error("Failed to revalidate cart items:", e);
    }
  }, [cartItems.length, userId, addToast]);

  // Initial session setup & auth change listener
  useEffect(() => {
    let isMounted = true;

    async function initCartSession() {
      setIsSyncing(true);
      try {
        const { supabase, isSupabaseConfigured } = await import("@/lib/supabase/client");
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          const currentUid = session?.user?.id || null;

          if (isMounted) {
            setUserId(currentUid);
          }

          if (currentUid) {
            // Logged-in customer
            const guestItems = getGuestCartFromStorage();
            if (guestItems.length > 0) {
              const merged = await mergeGuestCartIntoUserCart(currentUid, guestItems);
              clearGuestStorage();
              if (isMounted) {
                setCartItems(merged);
              }
            } else {
              const userCart = await fetchUserCart(currentUid);
              if (isMounted) {
                setCartItems(userCart);
              }
            }
          } else {
            // Guest user
            const guestItems = getGuestCartFromStorage();
            if (isMounted) {
              setCartItems(guestItems);
            }
          }
        } else {
          const guestItems = getGuestCartFromStorage();
          if (isMounted) {
            setCartItems(guestItems);
          }
        }
      } catch (err) {
        console.error("Cart session initialization failed:", err);
      } finally {
        if (isMounted) {
          setIsInitialized(true);
          setIsSyncing(false);
        }
      }
    }

    initCartSession();

    let authSubscription: { unsubscribe: () => void } | null = null;
    import("@/lib/supabase/client").then(({ supabase, isSupabaseConfigured }) => {
      if (isSupabaseConfigured && supabase) {
        const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (!isMounted) return;
          const newUid = session?.user?.id || null;
          setUserId(newUid);

          if (newUid) {
            const guestItems = getGuestCartFromStorage();
            if (guestItems.length > 0) {
              const merged = await mergeGuestCartIntoUserCart(newUid, guestItems);
              clearGuestStorage();
              setCartItems(merged);
            } else {
              const userCart = await fetchUserCart(newUid);
              setCartItems(userCart);
            }
          } else {
            // Logged out
            setCartItems([]);
          }
        });
        authSubscription = data.subscription;
      }
    });

    return () => {
      isMounted = false;
      if (authSubscription) authSubscription.unsubscribe();
    };
  }, []);

  // Save guest cart to localStorage whenever cartItems changes
  useEffect(() => {
    if (isInitialized && !userId) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cartItems, isInitialized, userId]);

  // Add item to cart with stock & active validation
  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    if (!product.active) {
      addToast(`"${product.name}" is currently unavailable.`, "error");
      return;
    }

    if (product.stock <= 0) {
      addToast(`"${product.name}" is currently out of stock.`, "error");
      return;
    }

    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.product.id === product.id);
      const currentQty = existingItem ? existingItem.quantity : 0;
      const desiredQty = currentQty + quantityToAdd;

      if (desiredQty > product.stock) {
        if (currentQty >= product.stock) {
          addToast(
            `Cannot add more. Maximum available stock (${product.stock}) already in cart.`,
            "error"
          );
          return prev;
        }

        const maxAllowed = product.stock;
        addToast(
          `Added ${maxAllowed - currentQty} unit(s) to reach maximum available stock (${product.stock}).`,
          "info"
        );

        if (userId) {
          syncCartItemToDb(userId, product.id, maxAllowed).catch(() => {});
        }

        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: maxAllowed, product } : item
        );
      }

      addToast(`Added "${product.name}" to your cart.`);

      if (existingItem) {
        const nextItems = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: desiredQty, product }
            : item
        );
        if (userId) {
          syncCartItemToDb(userId, product.id, desiredQty).catch(() => {});
        }
        return nextItems;
      }

      const nextItems = [...prev, { product, quantity: desiredQty }];
      if (userId) {
        syncCartItemToDb(userId, product.id, desiredQty).catch(() => {});
      }
      return nextItems;
    });
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (item) {
        addToast(`Removed "${item.product.name}" from your cart`, "info");
      }
      return prev.filter((i) => i.product.id !== productId);
    });

    if (userId) {
      removeCartItemFromDb(userId, productId).catch(() => {});
    }
  };

  // Update item quantity with stock boundary validation
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (!item) return prev;

      const maxStock = item.product.stock;
      let finalQty = newQuantity;

      if (finalQty > maxStock) {
        finalQty = maxStock;
        addToast(
          `Quantity capped at maximum available stock (${maxStock}) for "${item.product.name}".`,
          "error"
        );
      }

      if (userId) {
        syncCartItemToDb(userId, productId, finalQty).catch(() => {});
      }

      return prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: finalQty } : i
      );
    });
  };

  // Clear cart completely
  const clearCart = () => {
    setCartItems([]);
    if (userId) {
      clearUserCartInDb(userId).catch(() => {});
    } else {
      clearGuestStorage();
    }
    addToast("Cleared cart", "info");
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const totalAmount = subtotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        revalidateCart,
        totalItems,
        subtotal,
        totalAmount,
        isSyncing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
