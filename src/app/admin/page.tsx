import React from "react";
import { fetchAdminProducts } from "@/services/productService";
import { ProductTable } from "@/components/admin/ProductTable";
import { AdminNav } from "@/components/admin/AdminNav";
import { Package, CheckCircle2, AlertTriangle, Layers } from "lucide-react";

export const revalidate = 0; // Fresh database query on load

export default async function AdminDashboardPage() {
  const products = await fetchAdminProducts();

  const totalCount = products.length;
  const activeCount = products.filter((p) => p.active).length;
  const lowStockCount = products.filter((p) => p.stock <= 5 && p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="bg-cream min-h-screen pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Dashboard Title */}
        <div className="mb-8 border-b border-sand/40 pb-4">
          <h1 className="font-serif text-3xl font-bold text-espresso">
            Product Inventory Management
          </h1>
          <p className="text-xs text-taupe mt-1">
            Manage your real product catalog, stock counts, pricing, and storefront status.
          </p>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-cream-surface rounded-xl border border-sand/60 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-taupe font-semibold uppercase tracking-wider block">Total Products</span>
              <span className="font-serif text-2xl font-bold text-espresso">{totalCount}</span>
            </div>
          </div>

          <div className="bg-cream-surface rounded-xl border border-sand/60 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sage/10 text-sage flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-taupe font-semibold uppercase tracking-wider block">Active On Store</span>
              <span className="font-serif text-2xl font-bold text-espresso">{activeCount}</span>
            </div>
          </div>

          <div className="bg-cream-surface rounded-xl border border-sand/60 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-taupe font-semibold uppercase tracking-wider block">Low Stock (&le;5)</span>
              <span className="font-serif text-2xl font-bold text-espresso">{lowStockCount}</span>
            </div>
          </div>

          <div className="bg-cream-surface rounded-xl border border-sand/60 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-taupe font-semibold uppercase tracking-wider block">Out of Stock</span>
              <span className="font-serif text-2xl font-bold text-espresso">{outOfStockCount}</span>
            </div>
          </div>
        </div>

        {/* Product Inventory Table */}
        <ProductTable initialProducts={products} />
      </div>
    </div>
  );
}
