import { Category, Product } from "@/types/product";
import { slugify } from "@/lib/utils";

export const CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Bags",
    slug: "bags",
    description: "Handmade fabric shopping bags, stylish handbags, and everyday carry creations.",
    image: "https://xqsryyvonzfcievpytmk.supabase.co/storage/v1/object/public/product-images/products/ng6fp4j_1790594168052.jpeg",
    productCount: 0,
  },
  {
    id: "cat-2",
    name: "Pouches & Organizers",
    slug: "pouches-organizers",
    description: "Utility pouches, makeup box sets with 6 pouches, and travelling makeup kit organizers.",
    image: "https://xqsryyvonzfcievpytmk.supabase.co/storage/v1/object/public/product-images/products/hy3bj0v_1790593659440.png",
    productCount: 0,
  },
  {
    id: "cat-3",
    name: "Traditional & Festive",
    slug: "traditional-festive",
    description: "Traditional Madilakki bags, banana stand holders, and festive handmade creations.",
    image: "https://xqsryyvonzfcievpytmk.supabase.co/storage/v1/object/public/product-images/products/ktkvi9n_1790594369585.jpeg",
    productCount: 0,
  },
  {
    id: "cat-4",
    name: "Gift Sets",
    slug: "gift-sets",
    description: "Thoughtfully curated handmade bag and purse gift combos.",
    image: "https://xqsryyvonzfcievpytmk.supabase.co/storage/v1/object/public/product-images/products/ruu5ehm_1790594052734.jpeg",
    productCount: 0,
  },
  {
    id: "cat-5",
    name: "Customized Creations",
    slug: "customized-creations",
    description: "Bespoke handmade fabric creations tailored to your specifications via WhatsApp.",
    image: "https://xqsryyvonzfcievpytmk.supabase.co/storage/v1/object/public/product-images/products/9tucfgz_1790594243570.jpeg",
    productCount: 0,
  },
];

export function isProductInCategory(product: Product, categorySlug: string): boolean {
  if (!categorySlug || categorySlug === "all") return true;

  const pCatSlug = (product.categorySlug || "").toLowerCase();
  const pCatName = (product.category || "").toLowerCase();
  const targetSlug = categorySlug.toLowerCase();

  // Strict match on database category slug or category name
  return pCatSlug === targetSlug || slugify(pCatName) === targetSlug;
}
