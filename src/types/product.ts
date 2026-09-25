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
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  images: string[]; // Primary image is images[0], gallery images follow
  materials: string;
  dimensions: string;
  careInstructions: string;
  shippingInfo: string;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  inStock: boolean;
  createdAt: string;
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
