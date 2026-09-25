import React from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <div className="bg-cream min-h-screen pb-16">
      <AdminNav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products Inventory</span>
          </Link>
        </div>

        <ProductForm />
      </div>
    </div>
  );
}
