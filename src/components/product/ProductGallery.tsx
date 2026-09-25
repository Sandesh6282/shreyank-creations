"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80";

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const displayImages = images.length > 0 ? images : [FALLBACK_IMAGE];

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  const currentImageSrc = failedImages[selectedIndex]
    ? FALLBACK_IMAGE
    : displayImages[selectedIndex];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails Sidebar */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 scrollbar-none shrink-0">
        {displayImages.map((img, idx) => {
          const thumbSrc = failedImages[idx] ? FALLBACK_IMAGE : img;
          return (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                selectedIndex === idx
                  ? "border-terracotta ring-2 ring-terracotta/20 scale-105"
                  : "border-sand/60 opacity-70 hover:opacity-100 hover:border-sand"
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={thumbSrc}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover object-center"
                onError={() => handleImageError(idx)}
              />
            </button>
          );
        })}
      </div>

      {/* Main Display Image */}
      <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-sand-light/40 border border-sand/60 group">
        <Image
          src={currentImageSrc}
          alt={`${productName} view ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover object-center transition-transform duration-500 ${
            isZoomed ? "scale-125 cursor-zoom-out" : "group-hover:scale-105 cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          onError={() => handleImageError(selectedIndex)}
        />

        {/* Carousel Prev/Next Buttons */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream-surface/80 hover:bg-cream text-espresso flex items-center justify-center shadow-md backdrop-blur-xs transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream-surface/80 hover:bg-cream text-espresso flex items-center justify-center shadow-md backdrop-blur-xs transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="absolute bottom-3 right-3 bg-cream-surface/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-medium text-taupe flex items-center gap-1.5 pointer-events-none shadow-xs">
          <ZoomIn className="w-3.5 h-3.5" />
          <span>Click to zoom</span>
        </div>
      </div>
    </div>
  );
}
