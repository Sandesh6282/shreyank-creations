import { fetchStorefrontProducts, fetchDatabaseCategories } from "@/services/productService";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export const revalidate = 60;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const categories = await fetchDatabaseCategories();
  const categoryInfo = categories.find((c) => c.slug === categorySlug);

  if (!categoryInfo && categorySlug !== "all") {
    notFound();
  }

  const categoryProducts = await fetchStorefrontProducts({ categorySlug });

  return (
    <div className="bg-cream min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            { label: categoryInfo ? categoryInfo.name : categorySlug },
          ]}
        />

        <div className="py-6 border-b border-sand/40 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-terracotta uppercase tracking-widest block mb-1">
              Category Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso">
              {categoryInfo ? categoryInfo.name : categorySlug}
            </h1>
            <p className="text-sm text-taupe mt-1 max-w-2xl">
              {categoryInfo ? categoryInfo.description : "Crafts in this category."}
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Categories</span>
          </Link>
        </div>

        <ProductGrid
          products={categoryProducts}
          emptyMessage="No active products found in this category database yet. Add items in Admin Dashboard."
        />
      </div>
    </div>
  );
}
