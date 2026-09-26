"use client";

import React, { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { fetchStorefrontProductBySlug, fetchStorefrontProducts } from "@/services/productService";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ReviewStars } from "@/components/product/ReviewStars";
import { Button } from "@/components/ui/Button";
import { buildSingleProductWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Badge } from "@/components/ui/Badge";
import { Heart, ShoppingBag, Truck, ShieldCheck, Plus, Minus, Star, CheckCircle, Sparkles } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      try {
        const [prod, list] = await Promise.all([
          fetchStorefrontProductBySlug(slug),
          fetchStorefrontProducts(),
        ]);
        setProduct(prod);
        setAllProducts(list);
      } catch (e) {
        console.error("Failed to load product by slug:", e);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, [slug]);

  if (loading) {
    return <div className="py-24 text-center text-taupe">Loading product details...</div>;
  }

  if (!product) {
    notFound();
  }

  const isSaved = isInWishlist(product.id);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewName && newReviewComment) {
      setReviewSubmitted(true);
      addToast("Thank you! Your review has been submitted.");
    }
  };

  return (
    <div className="bg-cream min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            { label: product.category, href: `/shop/${product.categorySlug}` },
            { label: product.name },
          ]}
        />

        {/* Top Product Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
          {/* Gallery Column */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="terracotta">{product.category}</Badge>
                {product.bestseller && <Badge variant="sage">Best Seller</Badge>}
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso leading-tight mb-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <ReviewStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
                <span className="text-xs text-taupe font-medium">
                  | {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-cream-surface rounded-xl border border-sand/60 flex items-baseline gap-3 shadow-xs">
              <span className="font-serif text-3xl font-bold text-espresso">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-taupe line-through font-serif">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount && (
                <span className="text-xs font-bold text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
                  Save {product.discount}
                </span>
              )}
            </div>

            <p className="text-sm text-taupe leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Quantity Selector & CTAs */}
            <div className="space-y-4 pt-2 border-t border-sand/40">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-taupe">
                  Quantity:
                </span>
                <div className="flex items-center border border-sand rounded-lg bg-cream px-3 py-1.5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1 text-taupe hover:text-espresso disabled:opacity-30"
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-espresso">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-1 text-taupe hover:text-espresso disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => addToCart(product, quantity)}
                  variant="primary"
                  size="lg"
                  className="flex-1 gap-2 shadow-md"
                  disabled={product.stock === 0 || !product.active}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
                </Button>

                <a
                  href={product.stock > 0 && product.active ? buildSingleProductWhatsAppUrl({ product, quantity }) : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (product.stock <= 0 || !product.active) {
                      e.preventDefault();
                    }
                  }}
                  className={`flex-1 py-3 px-5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                    product.stock > 0 && product.active
                      ? "bg-[#25D366] text-white hover:bg-[#20bd5a] cursor-pointer"
                      : "bg-sand/80 text-taupe cursor-not-allowed pointer-events-none opacity-60"
                  }`}
                >
                  <WhatsAppIcon className="w-5 h-5 fill-white" />
                  <span>{product.stock === 0 || !product.active ? "Out of Stock" : "Buy on WhatsApp"}</span>
                </a>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-lg border transition-all flex items-center justify-center shrink-0 ${
                    isSaved
                      ? "bg-terracotta text-cream border-terracotta"
                      : "bg-cream-surface text-espresso border-sand hover:border-terracotta hover:text-terracotta"
                  }`}
                  aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? "fill-cream" : ""}`} />
                </button>
              </div>
            </div>

            {/* Customization Callout Box */}
            <div className="p-4 rounded-xl bg-terracotta/10 border border-terracotta/20 space-y-2">
              <div className="flex items-center gap-2 text-terracotta font-serif font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Customization Available</span>
              </div>
              <p className="text-xs text-taupe leading-relaxed">
                Want a custom version or personalized requirements for this item? Discuss your custom order directly with us on WhatsApp.
              </p>
              <a
                href={`https://wa.me/918951119766?text=Hi%20SHREYANK%20CREATION%2C%20I%27d%20like%20to%20discuss%20customization%20for%20${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso hover:text-terracotta transition-colors pt-1"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
                <span className="text-[#25D366] font-bold">Discuss Customization on WhatsApp &rarr;</span>
              </a>
            </div>

            {/* Highlights Box */}
            <div className="space-y-2.5 pt-4 text-xs text-taupe border-t border-sand/40">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-terracotta shrink-0" />
                <span>Delivery Available Across India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-sage shrink-0" />
                <span>Handcrafted by hand with care & premium finishing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs / Specs */}
        <ProductSpecs product={product} />

        {/* Customer Reviews Section */}
        <div className="mt-16 pt-12 border-t border-sand">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-semibold text-terracotta uppercase tracking-widest block mb-1">
                Customer Feedback
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-espresso">
                Verified Reviews ({product.reviewCount})
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 bg-cream-surface rounded-xl border border-sand/60 space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-espresso text-sm">
                          {rev.userName}
                        </span>
                        <span className="text-xs text-taupe">({rev.userCity})</span>
                      </div>
                      <span className="text-xs text-taupe">{rev.date}</span>
                    </div>
                    <ReviewStars rating={rev.rating} showCount={false} />
                    <h4 className="font-serif font-semibold text-sm text-espresso">{rev.title}</h4>
                    <p className="text-xs text-taupe leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-taupe italic">
                  Be the first to share your thoughts on this craft creation!
                </p>
              )}
            </div>

            {/* Add Review Form */}
            <div className="lg:col-span-5 bg-cream-surface rounded-xl border border-sand/60 p-6 shadow-card h-fit">
              <h3 className="font-serif text-lg font-bold text-espresso mb-4">Write a Review</h3>

              {reviewSubmitted ? (
                <div className="p-4 bg-sage/10 text-sage rounded-lg border border-sage/20 text-xs font-medium flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Your review has been submitted for verification.</span>
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-taupe font-semibold mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyanjali Sen"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="w-full px-3 py-2 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta"
                    />
                  </div>

                  <div>
                    <label className="block text-taupe font-semibold mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 text-amber-500"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newReviewRating ? "fill-amber-500" : "text-sand"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-taupe font-semibold mb-1">Review Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Beautiful craftsmanship!"
                      value={newReviewTitle}
                      onChange={(e) => setNewReviewTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta"
                    />
                  </div>

                  <div>
                    <label className="block text-taupe font-semibold mb-1">Your Review</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your experience regarding texture, weight, and finish..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full px-3 py-2 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="sm" className="w-full">
                    Submit Review
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {allProducts.length > 0 && (
          <RelatedProducts currentProduct={product} allProducts={allProducts} />
        )}
      </div>
    </div>
  );
}
