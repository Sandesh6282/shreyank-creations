import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Product, Category, ProductInput } from "@/types/product";
import { CATEGORIES } from "@/data/categories";
import { slugify } from "@/lib/utils";

// Helper to map DB row to Product TypeScript type
export function mapDbToProduct(row: Record<string, unknown>): Product {
  const priceNum = Number(row.price) || 0;
  const salePriceNum = row.sale_price ? Number(row.sale_price) : undefined;
  const effectivePrice = salePriceNum || priceNum;
  const origPrice = salePriceNum ? priceNum : undefined;
  const calcDiscount = salePriceNum
    ? `${Math.round(((priceNum - salePriceNum) / priceNum) * 100)}% OFF`
    : undefined;

  return {
    id: String(row.id),
    name: String(row.name || ""),
    slug: String(row.slug || ""),
    description: String(row.description || ""),
    shortDescription: String(row.short_description || ""),
    category: String(row.category_name || "General"),
    categorySlug: String(row.category_slug || "general"),
    categoryId: row.category_id ? String(row.category_id) : undefined,
    price: effectivePrice,
    salePrice: salePriceNum,
    originalPrice: origPrice,
    discount: calcDiscount,
    rating: row.rating ? Number(row.rating) : 5.0,
    reviewCount: row.review_count ? Number(row.review_count) : 0,
    stock: Number(row.stock) || 0,
    sku: row.sku ? String(row.sku) : "",
    images: Array.isArray(row.images) && row.images.length > 0 ? row.images : [],
    materials: String(row.materials || "Handcrafted Materials"),
    dimensions: String(row.dimensions || "Dimensions unavailable"),
    careInstructions: String(row.care_instructions || "Wipe clean with a soft dry cloth."),
    shippingInfo: String(row.shipping_info || "Shipping details will be confirmed during checkout."),
    featured: Boolean(row.featured),
    bestseller: Boolean(row.bestseller),
    active: Boolean(row.active),
    isFeatured: Boolean(row.featured),
    isBestSeller: Boolean(row.bestseller),
    inStock: Number(row.stock) > 0,
    createdAt: row.created_at ? String(row.created_at) : new Date().toISOString(),
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
  };
}

// Storefront Product Fetching Functions
export async function fetchStorefrontProducts(filters?: {
  categorySlug?: string;
  searchQuery?: string;
  maxPrice?: number;
  featuredOnly?: boolean;
  bestsellerOnly?: boolean;
  sortBy?: string;
}): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  let query = supabase.from("products").select("*").eq("active", true);

  if (filters?.categorySlug && filters.categorySlug !== "all") {
    query = query.eq("category_slug", filters.categorySlug);
  }

  if (filters?.featuredOnly) {
    query = query.eq("featured", true);
  }

  if (filters?.bestsellerOnly) {
    query = query.eq("bestseller", true);
  }

  if (filters?.maxPrice) {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters?.searchQuery) {
    const term = `%${filters.searchQuery.trim()}%`;
    query = query.or(
      `name.ilike.${term},description.ilike.${term},category_name.ilike.${term},materials.ilike.${term}`
    );
  }

  if (filters?.sortBy === "price-low") {
    query = query.order("price", { ascending: true });
  } else if (filters?.sortBy === "price-high") {
    query = query.order("price", { ascending: false });
  } else if (filters?.sortBy === "newest") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products from Supabase:", error);
    return [];
  }

  return (data || []).map(mapDbToProduct);
}

export async function fetchStorefrontProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !data) {
    return null;
  }

  return mapDbToProduct(data);
}

// Admin Management CRUD Functions
export async function fetchAdminProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin products:", error);
    return [];
  }

  return (data || []).map(mapDbToProduct);
}

export async function createProduct(input: ProductInput): Promise<Product> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase credentials missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in your environment variables.");
  }

  const generatedSlug = input.slug ? slugify(input.slug) : slugify(input.name);

  const payload = {
    name: input.name,
    slug: generatedSlug,
    description: input.description,
    short_description: input.shortDescription,
    category_id: input.categoryId || null,
    category_name: input.categoryName,
    category_slug: input.categorySlug || slugify(input.categoryName),
    price: input.price,
    sale_price: input.salePrice || null,
    stock: input.stock,
    sku: input.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    images: input.images,
    materials: input.materials || "",
    dimensions: input.dimensions || "",
    care_instructions: input.careInstructions || "",
    shipping_info: input.shippingInfo || "Shipping details will be confirmed during checkout.",
    featured: Boolean(input.featured),
    bestseller: Boolean(input.bestseller),
    active: input.active !== undefined ? Boolean(input.active) : true,
  };

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Failed to create product:", error);
    throw new Error(`Failed to create product in database: ${error.message}`);
  }

  return mapDbToProduct(data);
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<Product> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase credentials missing.");
  }

  const payload: Record<string, unknown> = {};
  if (input.name !== undefined) payload.name = input.name;
  if (input.slug !== undefined) payload.slug = slugify(input.slug);
  if (input.description !== undefined) payload.description = input.description;
  if (input.shortDescription !== undefined) payload.short_description = input.shortDescription;
  if (input.categoryName !== undefined) payload.category_name = input.categoryName;
  if (input.categorySlug !== undefined) payload.category_slug = input.categorySlug;
  if (input.price !== undefined) payload.price = input.price;
  if (input.salePrice !== undefined) payload.sale_price = input.salePrice || null;
  if (input.stock !== undefined) payload.stock = input.stock;
  if (input.sku !== undefined) payload.sku = input.sku;
  if (input.images !== undefined) payload.images = input.images;
  if (input.materials !== undefined) payload.materials = input.materials;
  if (input.dimensions !== undefined) payload.dimensions = input.dimensions;
  if (input.careInstructions !== undefined) payload.care_instructions = input.careInstructions;
  if (input.shippingInfo !== undefined) payload.shipping_info = input.shippingInfo;
  if (input.featured !== undefined) payload.featured = input.featured;
  if (input.bestseller !== undefined) payload.bestseller = input.bestseller;
  if (input.active !== undefined) payload.active = input.active;

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update product:", error);
    throw new Error(`Failed to update product: ${error.message}`);
  }

  return mapDbToProduct(data);
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase credentials missing.");
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete product:", error);
    throw new Error(`Failed to delete product: ${error.message}`);
  }

  return true;
}

// Category Queries
export async function fetchDatabaseCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured || !supabase) {
    return CATEGORIES;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error || !data || data.length === 0) {
    return CATEGORIES;
  }

  return data.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description || ""),
    image: String(row.image || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"),
    productCount: Number(row.product_count) || 0,
  }));
}
