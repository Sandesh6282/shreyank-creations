import React from "react";
import { TESTIMONIALS } from "@/data/testimonials";
import { ReviewStars } from "@/components/product/ReviewStars";
import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-16 bg-sand-light/40 border-b border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-terracotta uppercase tracking-widest block mb-1">
            Customer Feedback
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-espresso">
            Voices of Craft Lovers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-cream-surface rounded-2xl p-6 border border-sand/60 shadow-card flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-terracotta/20 absolute top-4 right-4" />
              <div>
                <ReviewStars rating={t.rating} showCount={false} size="md" />
                <p className="text-sm text-espresso mt-4 italic font-serif leading-relaxed">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-sand/40">
                <p className="font-serif font-bold text-sm text-espresso">{t.name}</p>
                <p className="text-xs text-taupe">{t.city} • <span className="text-terracotta">{t.productName}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
