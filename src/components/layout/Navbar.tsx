"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { CATEGORIES } from "@/data/categories";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkUserSession() {
      const { supabase, isSupabaseConfigured } = await import("@/lib/supabase/client");
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(Boolean(session));
      }
    }
    checkUserSession();

    let subscription: { unsubscribe: () => void } | null = null;
    import("@/lib/supabase/client").then(({ supabase, isSupabaseConfigured }) => {
      if (isSupabaseConfigured && supabase) {
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          setIsLoggedIn(Boolean(session));
        });
        subscription = data.subscription;
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-cream-surface/95 backdrop-blur-md shadow-card border-b border-sand/40"
          : "bg-cream border-b border-sand/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button & Search icon */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-espresso hover:text-terracotta transition-colors rounded-md"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-espresso hover:text-terracotta transition-colors"
              aria-label="Search items"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Logo / Brand Name */}
          <Link href="/" className="flex flex-col items-center lg:items-start group">
            <span className="font-serif text-2xl md:text-3xl font-semibold tracking-wide text-espresso group-hover:text-terracotta transition-colors">
              Shreyank Creations
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase text-taupe font-sans font-medium -mt-1">
              Handmade & Artisan Crafts
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wider uppercase transition-colors relative py-1 ${
                    isActive
                      ? "text-terracotta font-semibold"
                      : "text-espresso/85 hover:text-terracotta"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-terracotta rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
              onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1 text-sm font-medium tracking-wider uppercase text-espresso/85 hover:text-terracotta py-1"
                aria-expanded={isCategoriesDropdownOpen}
              >
                <span>Categories</span>
                <ChevronDown className="w-4 h-4 text-taupe" />
              </button>

              {isCategoriesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-cream-surface border border-sand shadow-dropdown rounded-lg py-2 z-50">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop/${cat.slug}`}
                      className="block px-4 py-2 text-sm text-espresso hover:bg-sand/40 hover:text-terracotta transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Actions: Search, Wishlist, Account, Cart */}
          <div className="flex items-center gap-4">
            {/* Desktop Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-sand bg-cream-surface text-taupe hover:border-terracotta hover:text-espresso transition-all text-xs"
            >
              <Search className="w-3.5 h-3.5 text-taupe" />
              <span>Search products...</span>
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="p-2 text-espresso hover:text-terracotta transition-colors relative"
              aria-label={`Wishlist with ${totalWishlistItems} items`}
            >
              <Heart className="w-5 h-5" />
              {totalWishlistItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta text-cream text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Account Icon */}
            <Link
              href={isLoggedIn ? "/account" : "/login"}
              className="p-2 text-espresso hover:text-terracotta transition-colors relative"
              aria-label={isLoggedIn ? "My Customer Account" : "Customer Login"}
            >
              <User className="w-5 h-5" />
              {isLoggedIn && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-sage" />
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="p-2 bg-terracotta/10 text-terracotta hover:bg-terracotta hover:text-cream transition-all rounded-full relative flex items-center justify-center"
              aria-label={`Shopping Cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta text-cream text-[10px] font-bold w-4.5 h-4.5 rounded-full border-2 border-cream flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-espresso/40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-sm bg-cream-surface h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="p-5 border-b border-sand flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl text-espresso font-semibold">Shreyank Creations</h2>
                <p className="text-xs text-taupe">Artisan Handmade Crafts</p>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-taupe hover:text-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6 flex-1">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-cream border border-sand rounded-lg focus:outline-none focus:border-terracotta text-espresso"
                />
                <Search className="w-4 h-4 text-taupe absolute left-3 top-1/2 -translate-y-1/2" />
              </form>

              {/* Navigation Links */}
              <div className="flex flex-col gap-3 border-b border-sand/50 pb-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-base font-medium py-2 px-3 rounded-md transition-colors ${
                      pathname === link.href
                        ? "bg-terracotta/10 text-terracotta font-semibold"
                        : "text-espresso hover:bg-sand/30"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Categories list */}
              <div>
                <h3 className="text-xs font-semibold text-taupe uppercase tracking-wider mb-3">
                  Browse Categories
                </h3>
                <div className="flex flex-col gap-2">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop/${cat.slug}`}
                      className="text-sm text-espresso/80 hover:text-terracotta py-1.5 px-3 rounded-md hover:bg-sand/20 flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-taupe">({cat.productCount})</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-5 border-t border-sand bg-cream text-xs text-taupe text-center space-y-2">
              <div className="flex items-center justify-center gap-1 text-terracotta font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Made with Care Across India</span>
              </div>
              <p>© 2026 Shreyank Creations</p>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="fixed inset-0 bg-espresso/50 backdrop-blur-xs"
            onClick={() => setIsSearchOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-cream-surface rounded-xl shadow-2xl border border-sand p-6 z-10">
            <div className="flex items-center justify-between mb-4 border-b border-sand pb-3">
              <h3 className="font-serif text-lg font-semibold text-espresso">Search Shreyank Creations</h3>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-taupe hover:text-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search by product name, category, or craft..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-24 py-3 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-base"
              />
              <Search className="w-5 h-5 text-taupe absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-terracotta text-cream text-xs font-semibold px-4 py-2 rounded-md hover:bg-terracotta-hover transition-colors"
              >
                Search
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-sand/40">
              <span className="text-xs text-taupe block mb-2 font-medium uppercase tracking-wider">
                Popular Searches:
              </span>
              <div className="flex flex-wrap gap-2">
                {["Blue Pottery", "Brass Urli", "Wooden Mirror", "Kantha Throw", "Jharokha"].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        router.push(`/shop?search=${encodeURIComponent(tag)}`);
                        setIsSearchOpen(false);
                      }}
                      className="px-3 py-1 bg-sand/40 hover:bg-terracotta/10 hover:text-terracotta text-xs text-espresso rounded-full transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
