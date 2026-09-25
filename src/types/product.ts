export interface Review {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  categorySlug: string;
  categoryId?: string;
  price: number;
  salePrice?: number;
  originalPrice?: number;
  discount?: string;
  rating: number;
  reviewCount: number;
  stock: number;
  sku?: string;
  images: string[];
  materials: string;
  dimensions: string;
  careInstructions: string;
  shippingInfo: string;
  featured: boolean;
  bestseller: boolean;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
  // Aliases for compatibility
  isBestSeller?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
  reviews?: Review[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FilterOptions {
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: "featured" | "price-low" | "price-high" | "rating" | "newest";
  searchQuery: string;
}

export interface ProductInput {
  name: string;
  slug?: string;
  description: string;
  shortDescription: string;
  categoryId?: string;
  categoryName: string;
  categorySlug: string;
  price: number;
  salePrice?: number;
  stock: number;
  sku?: string;
  images: string[];
  materials?: string;
  dimensions?: string;
  careInstructions?: string;
  shippingInfo?: string;
  featured?: boolean;
  bestseller?: boolean;
  active?: boolean;
}
