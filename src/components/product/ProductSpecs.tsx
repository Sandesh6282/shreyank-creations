"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { Package, Shield, Sparkles, Truck, HelpCircle } from "lucide-react";

interface ProductSpecsProps {
  product: Product;
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  const [activeTab, setActiveTab] = useState<"details" | "materials" | "shipping" | "care">("details");

  return (
    <div className="mt-12 bg-cream-surface rounded-xl border border-sand/60 p-6 md:p-8 shadow-card">
      {/* Tabs Headers */}
      <div className="flex border-b border-sand overflow-x-auto gap-6 pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab("details")}
          className={`font-serif text-base font-semibold pb-3 tracking-wide whitespace-nowrap transition-colors relative ${
            activeTab === "details"
              ? "text-terracotta border-b-2 border-terracotta"
              : "text-taupe hover:text-espresso"
          }`}
        >
          Craft & Story
        </button>
        <button
          onClick={() => setActiveTab("materials")}
          className={`font-serif text-base font-semibold pb-3 tracking-wide whitespace-nowrap transition-colors relative ${
            activeTab === "materials"
              ? "text-terracotta border-b-2 border-terracotta"
              : "text-taupe hover:text-espresso"
          }`}
        >
          Materials & Dimensions
        </button>
        <button
          onClick={() => setActiveTab("care")}
          className={`font-serif text-base font-semibold pb-3 tracking-wide whitespace-nowrap transition-colors relative ${
            activeTab === "care"
              ? "text-terracotta border-b-2 border-terracotta"
              : "text-taupe hover:text-espresso"
          }`}
        >
          Care Instructions
        </button>
        <button
          onClick={() => setActiveTab("shipping")}
          className={`font-serif text-base font-semibold pb-3 tracking-wide whitespace-nowrap transition-colors relative ${
            activeTab === "shipping"
              ? "text-terracotta border-b-2 border-terracotta"
              : "text-taupe hover:text-espresso"
          }`}
        >
          Shipping & Packaging
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-6 text-sm text-espresso leading-relaxed">
        {activeTab === "details" && (
          <div className="space-y-4">
            <p className="text-base text-taupe leading-relaxed">
              {product.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-sand/40">
              <div className="flex items-start gap-3 p-3 bg-sand-light/50 rounded-lg">
                <Sparkles className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-espresso text-xs uppercase tracking-wider">Handcrafted Artistry</h4>
                  <p className="text-xs text-taupe mt-0.5">Individually sculpted and painted with care.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-sand-light/50 rounded-lg">
                <Shield className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-espresso text-xs uppercase tracking-wider">Quality Verified</h4>
                  <p className="text-xs text-taupe mt-0.5">Inspected for structural stability and finish.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-sand-light/50 rounded-lg">
                <Package className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-espresso text-xs uppercase tracking-wider">Gift Ready</h4>
                  <p className="text-xs text-taupe mt-0.5">Wrapped with care.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "materials" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-sand-light/40 p-4 rounded-lg border border-sand/40">
                <h4 className="font-serif text-base font-semibold text-espresso mb-2">Materials</h4>
                <p className="text-taupe">{product.materials}</p>
              </div>
              <div className="bg-sand-light/40 p-4 rounded-lg border border-sand/40">
                <h4 className="font-serif text-base font-semibold text-espresso mb-2">Dimensions</h4>
                <p className="text-taupe">{product.dimensions}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "care" && (
          <div className="space-y-4 bg-sand-light/40 p-4 rounded-lg border border-sand/40">
            <h4 className="font-serif text-base font-semibold text-espresso mb-2">Maintenance & Care</h4>
            <p className="text-taupe leading-relaxed">{product.careInstructions}</p>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-4">
            <div className="bg-sand-light/40 p-4 rounded-lg border border-sand/40 space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-base font-semibold text-espresso">Shipping Information</h4>
                  <p className="text-taupe mt-0.5">{product.shippingInfo}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-sand/40">
                <HelpCircle className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-base font-semibold text-espresso">Support & Inquiries</h4>
                  <p className="text-taupe mt-0.5">
                    For questions about your shipment, reach out using our contact form or customer support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
