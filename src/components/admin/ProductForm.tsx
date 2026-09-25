"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product, ProductInput } from "@/types/product";
import { CATEGORIES } from "@/data/categories";
import { createProduct, updateProduct } from "@/services/productService";
import { uploadProductImageToStorage } from "@/services/storageService";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { Upload, X, Save } from "lucide-react";

interface ProductFormProps {
  initialProduct?: Product;
}

export function ProductForm({ initialProduct }: ProductFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const isEditing = Boolean(initialProduct);

  const [formData, setFormData] = useState<ProductInput>({
    name: initialProduct?.name || "",
    slug: initialProduct?.slug || "",
    description: initialProduct?.description || "",
    shortDescription: initialProduct?.shortDescription || "",
    categoryName: initialProduct?.category || "Home Decor",
    categorySlug: initialProduct?.categorySlug || "home-decor",
    price: initialProduct?.price || 0,
    salePrice: initialProduct?.salePrice || undefined,
    stock: initialProduct?.stock ?? 1,
    sku: initialProduct?.sku || "",
    images: initialProduct?.images || [],
    materials: initialProduct?.materials || "",
    dimensions: initialProduct?.dimensions || "",
    careInstructions: initialProduct?.careInstructions || "",
    shippingInfo: initialProduct?.shippingInfo || "Shipping details will be confirmed during checkout.",
    featured: initialProduct?.featured ?? false,
    bestseller: initialProduct?.bestseller ?? false,
    active: initialProduct?.active ?? true,
  });

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSlug = e.target.value;
    const catObj = CATEGORIES.find((c) => c.slug === selectedSlug);
    setFormData((prev) => ({
      ...prev,
      categorySlug: selectedSlug,
      categoryName: catObj ? catObj.name : selectedSlug,
    }));
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrlInput.trim()],
      }));
      setImageUrlInput("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!isSupabaseConfigured) {
      addToast("Supabase Storage requires credentials in .env.local. You can paste direct image URLs below for now.", "info");
    }

    setIsUploading(true);
    try {
      const file = files[0];
      const uploadedUrl = await uploadProductImageToStorage(file);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, uploadedUrl],
      }));
      addToast("Uploaded product image to Supabase Storage!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      addToast(msg, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price < 0) {
      addToast("Please provide a valid product name and non-negative price", "error");
      return;
    }

    if (formData.images.length === 0) {
      addToast("Please add at least one product image URL or file upload", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && initialProduct) {
        await updateProduct(initialProduct.id, formData);
        addToast(`Updated product "${formData.name}"`);
      } else {
        await createProduct(formData);
        addToast(`Created product "${formData.name}" successfully!`);
      }
      router.push("/admin");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Operation failed";
      addToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-cream-surface p-6 sm:p-8 rounded-2xl border border-sand/60 shadow-card">
      <div className="flex items-center justify-between border-b border-sand pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-espresso">
            {isEditing ? `Edit Product: ${initialProduct?.name}` : "Add New Product"}
          </h2>
          <p className="text-xs text-taupe mt-0.5">
            Fill in product details, pricing, inventory stock, and image gallery.
          </p>
        </div>

        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="gap-2">
          <Save className="w-4 h-4" />
          <span>{isEditing ? "Save Changes" : "Publish Product"}</span>
        </Button>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-5">
          <div>
            <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Handpainted Terracotta Planter"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={formData.categorySlug}
                onChange={handleCategoryChange}
                className="w-full px-3.5 py-2.5 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-sm cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                Custom URL Slug (Optional)
              </label>
              <input
                type="text"
                placeholder="Auto-generated from title"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
              Short Summary (For Product Cards) *
            </label>
            <textarea
              required
              rows={2}
              placeholder="Concise craft summary..."
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-3.5 py-2 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
              Full Description & Artisan Story *
            </label>
            <textarea
              required
              rows={5}
              placeholder="Describe the craft techniques, origins, and details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-sm"
            />
          </div>

          {/* Craft Specifications */}
          <div className="pt-4 border-t border-sand/40 space-y-4">
            <h3 className="font-serif font-bold text-espresso text-base">Craft Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                  Materials
                </label>
                <input
                  type="text"
                  placeholder="e.g. Quartz powder, Glaze"
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  className="w-full px-3 py-2 bg-cream border border-sand rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                  Dimensions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Height: 10 in, Width: 5 in"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="w-full px-3 py-2 bg-cream border border-sand rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                  Care Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wipe clean with soft dry cloth"
                  value={formData.careInstructions}
                  onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                  className="w-full px-3 py-2 bg-cream border border-sand rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                  Shipping Info
                </label>
                <input
                  type="text"
                  placeholder="Shipping details confirmed during checkout"
                  value={formData.shippingInfo}
                  onChange={(e) => setFormData({ ...formData, shippingInfo: e.target.value })}
                  className="w-full px-3 py-2 bg-cream border border-sand rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing, Inventory & Image Gallery */}
        <div className="lg:col-span-4 space-y-6">
          {/* Price & Stock Card */}
          <div className="p-5 bg-sand-light/40 rounded-xl border border-sand/60 space-y-4">
            <h3 className="font-serif font-bold text-espresso text-base border-b border-sand/40 pb-2">
              Pricing & Stock
            </h3>

            <div>
              <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                Regular Price (INR ₹) *
              </label>
              <input
                type="number"
                required
                min={0}
                placeholder="2499"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-cream border border-sand rounded-lg text-espresso font-semibold text-base focus:outline-none focus:border-terracotta"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                Sale Price (Optional INR ₹)
              </label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 1999"
                value={formData.salePrice || ""}
                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3.5 py-2 bg-cream border border-sand rounded-lg text-espresso text-sm focus:outline-none focus:border-terracotta"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                  Stock Level *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  placeholder="10"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-cream border border-sand rounded-lg text-espresso text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                  SKU Code
                </label>
                <input
                  type="text"
                  placeholder="SKU-1001"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-3 py-2 bg-cream border border-sand rounded-lg text-espresso text-xs"
                />
              </div>
            </div>
          </div>

          {/* Visibility Toggles */}
          <div className="p-5 bg-sand-light/40 rounded-xl border border-sand/60 space-y-3">
            <h3 className="font-serif font-bold text-espresso text-base border-b border-sand/40 pb-2">
              Visibility & Badges
            </h3>

            <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-espresso">
              <span>Active on Storefront</span>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 accent-terracotta cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-espresso">
              <span>Feature on Homepage</span>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 accent-terracotta cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-espresso">
              <span>Mark as Best Seller</span>
              <input
                type="checkbox"
                checked={formData.bestseller}
                onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                className="w-4 h-4 accent-terracotta cursor-pointer"
              />
            </label>
          </div>

          {/* Images Section */}
          <div className="p-5 bg-sand-light/40 rounded-xl border border-sand/60 space-y-4">
            <h3 className="font-serif font-bold text-espresso text-base border-b border-sand/40 pb-2">
              Product Images ({formData.images.length})
            </h3>

            {/* Supabase Storage File Upload */}
            <div>
              <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                Upload File to Supabase Bucket
              </label>
              <label className="flex items-center justify-center gap-2 p-3 bg-cream border border-dashed border-sand hover:border-terracotta rounded-lg cursor-pointer text-xs text-taupe hover:text-espresso transition-colors">
                <Upload className="w-4 h-4 text-terracotta" />
                <span>{isUploading ? "Uploading to bucket..." : "Choose Image File..."}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image URL Input */}
            <div>
              <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                Or Paste Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-cream border border-sand rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-1.5 bg-espresso text-cream text-xs font-semibold rounded-lg hover:bg-terracotta transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Images List */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-sand group">
                    <Image src={img} alt={`Preview ${idx + 1}`} fill unoptimized sizes="100px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-espresso/80 text-cream rounded-full hover:bg-terracotta transition-colors z-10"
                      aria-label="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
