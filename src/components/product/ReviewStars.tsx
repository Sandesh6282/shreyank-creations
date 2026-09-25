import React from "react";
import { Star } from "lucide-react";

interface ReviewStarsProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  showCount?: boolean;
}

export function ReviewStars({
  rating,
  reviewCount,
  size = "sm",
  showCount = true,
}: ReviewStarsProps) {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4.5 h-4.5";

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSize} ${
              star <= Math.floor(rating)
                ? "fill-amber-500 text-amber-500"
                : star - rating < 1
                ? "fill-amber-500/50 text-amber-500"
                : "text-sand fill-transparent"
            }`}
          />
        ))}
      </div>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-taupe font-medium">({reviewCount})</span>
      )}
    </div>
  );
}
