"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types/product";
import { useToast } from "./ToastContext";

interface WishlistContextType {
  wishlistItems: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  totalWishlistItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "shreyank_creations_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setWishlistItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load wishlist from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
      } catch (e) {
        console.error("Failed to save wishlist to localStorage", e);
      }
    }
  }, [wishlistItems, isInitialized]);

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
      addToast(`Removed "${product.name}" from your wishlist`, "info");
    } else {
      setWishlistItems((prev) => [...prev, product]);
      addToast(`Saved "${product.name}" to your wishlist`);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prev) => {
      const item = prev.find((i) => i.id === productId);
      if (item) {
        addToast(`Removed "${item.name}" from wishlist`, "info");
      }
      return prev.filter((i) => i.id !== productId);
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        totalWishlistItems: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
