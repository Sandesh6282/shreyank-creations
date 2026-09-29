"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CartItem, Product } from "@/types/product";
import { useToast } from "./ToastContext";

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
  const { addToast } = useToast();

  // Initial load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load cart from localStorage", err);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save guest cart to localStorage whenever cartItems changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cartItems, isInitialized]);

  // Revalidate existing cart items against fresh product catalog
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
            continue;
          }

          let validQty = item.quantity;
          if (validQty > fresh.stock) {
            validQty = fresh.stock;
            itemsAdjusted = true;
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
  }, [cartItems.length, addToast]);

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

        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: maxAllowed, product } : item
        );
      }

      addToast(`Added "${product.name}" to your cart.`);

      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: desiredQty, product }
            : item
        );
      }

      return [...prev, { product, quantity: desiredQty }];
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

      return prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: finalQty } : i
      );
    });
  };

  // Clear cart completely
  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
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
        isSyncing: false,
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
