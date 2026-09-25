"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { deleteProduct, updateProduct } from "@/services/productService";
import { useToast } from "@/context/ToastContext";
import { Edit2, Trash2, Search, PlusCircle, Sparkles, Check, X, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProductTableProps {
  initialProducts: Product[];
}

export function ProductTable({ initialProducts }: ProductTableProps) {
  const { addToast } = useToast();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.sku && p.sku.toLowerCase().includes(query))
    );
  });

  const handleToggleActive = async (product: Product) => {
    try {
      const updated = await updateProduct(product.id, { active: !product.active });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
      addToast(
        `Product "${product.name}" is now ${updated.active ? "Active" : "Inactive"}`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update product status";
      addToast(msg, "error");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      addToast(`Deleted product "${name}"`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete product";
      addToast(msg, "error");
    } finally {
      setDeletingId(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-cream-surface rounded-2xl border border-sand/60 p-8 shadow-card max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-sand-light text-terracotta flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-espresso mb-2">
          No Products in Database Yet
        </h3>
        <p className="text-xs text-taupe max-w-md mx-auto mb-6 leading-relaxed">
          Your product catalog is ready for real products. Click the button below to add your first craft creation.
        </p>
        <Link href="/admin/products/new" passHref>
          <Button variant="primary" size="md" className="gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>Add Your First Real Product</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar with Search & Add CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-cream-surface p-4 rounded-xl border border-sand/60 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by title, SKU, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-cream border border-sand rounded-lg text-xs text-espresso focus:outline-none focus:border-terracotta"
          />
          <Search className="w-4 h-4 text-taupe absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <span className="text-xs text-taupe">
            Total Inventory: <strong className="text-espresso">{filteredProducts.length}</strong> items
          </span>
          <Link href="/admin/products/new" passHref>
            <Button variant="primary" size="sm" className="gap-1.5">
              <PlusCircle className="w-4 h-4" />
              <span>Add Product</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-cream-surface rounded-2xl border border-sand/60 overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand-light/60 text-taupe font-bold uppercase tracking-wider border-b border-sand/60">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Badges</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/40">
              {filteredProducts.map((p) => {
                const primaryImage = p.images[0] || "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80";
                const isLowStock = p.stock > 0 && p.stock <= 5;
                const isOutOfStock = p.stock === 0;

                return (
                  <tr key={p.id} className="hover:bg-sand-light/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-sand-light border border-sand/40 shrink-0">
                          <Image src={primaryImage} alt={p.name} fill unoptimized sizes="48px" className="object-cover" />
                        </div>
                        <div>
                          <Link href={`/product/${p.slug}`} className="font-serif font-bold text-espresso hover:text-terracotta text-sm line-clamp-1">
                            {p.name}
                          </Link>
                          <span className="text-[10px] text-taupe font-mono">SKU: {p.sku || p.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-medium text-espresso">{p.category}</td>

                    <td className="p-4">
                      <span className="font-serif font-bold text-espresso text-sm">{formatPrice(p.price)}</span>
                      {p.salePrice && (
                        <span className="block text-[10px] text-terracotta font-semibold">Sale: {formatPrice(p.salePrice)}</span>
                      )}
                    </td>

                    <td className="p-4">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                          <AlertTriangle className="w-3 h-3" />
                          Out of Stock (0)
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          Low Stock ({p.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          In Stock ({p.stock})
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {p.featured && <Badge variant="terracotta">Featured</Badge>}
                        {p.bestseller && <Badge variant="sage">Best Seller</Badge>}
                        {!p.featured && !p.bestseller && <span className="text-taupe-muted text-[10px]">—</span>}
                      </div>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          p.active
                            ? "bg-sage/15 text-sage border border-sage/30 hover:bg-sage/25"
                            : "bg-taupe/15 text-taupe border border-taupe/30 hover:bg-taupe/25"
                        }`}
                      >
                        {p.active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{p.active ? "Active" : "Draft"}</span>
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-2 text-taupe hover:text-terracotta rounded-lg hover:bg-sand/40 transition-colors"
                          aria-label="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deletingId === p.id}
                          className="p-2 text-taupe hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-30"
                          aria-label="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
