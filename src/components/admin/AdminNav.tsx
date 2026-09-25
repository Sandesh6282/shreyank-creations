"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";
import { LayoutDashboard, PlusCircle, ArrowLeft, LogOut } from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { addToast } = useToast();

  const handleLogout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      addToast("Signed out of Admin Portal");
      router.replace("/admin/login");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Logout failed";
      addToast(msg, "error");
    }
  };

  return (
    <header className="bg-espresso text-cream border-b border-sand/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Admin Badge */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-serif text-xl font-bold tracking-wide text-cream group-hover:text-terracotta transition-colors">
                Shreyank Creations
              </span>
            </Link>
            <span className="bg-terracotta/20 text-terracotta border border-terracotta/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Admin Portal
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 font-medium transition-colors ${
                pathname === "/admin" ? "text-terracotta font-semibold" : "text-cream-muted hover:text-cream"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Products Inventory</span>
            </Link>

            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-1.5 bg-terracotta text-cream px-3.5 py-1.5 rounded-lg font-medium text-xs hover:bg-terracotta-hover transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>

            <Link
              href="/"
              className="text-xs text-cream-muted hover:text-cream transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-red-300 hover:text-red-100 transition-colors flex items-center gap-1 font-medium bg-red-950/40 hover:bg-red-950/60 px-2.5 py-1.5 rounded-md border border-red-900/50"
              title="Sign Out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
