import React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
  currentProduct: Product;
  allProducts: Product[];
}

export function RelatedProducts({ currentProduct, allProducts }: RelatedProductsProps) {
  const related = allProducts
    .filter(
      (p) => p.categorySlug === currentProduct.categorySlug && p.id !== currentProduct.id
    )
    .slice(0, 4);

  const fallback = allProducts.filter((p) => p.id !== currentProduct.id).slice(0, 4);
  const displayProducts = related.length > 0 ? related : fallback;

  return (
    <div className="mt-16 pt-12 border-t border-sand">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold text-terracotta uppercase tracking-widest">
            Complete the Look
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-espresso mt-1">
            You May Also Love
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProducts.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
}
