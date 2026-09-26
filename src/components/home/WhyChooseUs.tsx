import React from "react";
import { Heart, Sparkles, Truck, MessageSquare } from "lucide-react";

export function WhyChooseUs() {
  const pillars = [
    {
      icon: Heart,
      title: "Handmade Craftsmanship",
      description: "Each bag, pouch, and accessory is crafted by hand with attention to detail and care.",
    },
    {
      icon: Sparkles,
      title: "Customized Creations",
      description: "Have a specific design in mind? Discuss custom orders directly with us on WhatsApp.",
    },
    {
      icon: Truck,
      title: "Delivery Across India",
      description: "Simple and reliable doorstep delivery across all regions in India.",
    },
    {
      icon: MessageSquare,
      title: "Direct WhatsApp Ordering",
      description: "Instant 1-on-1 customer assistance and order enquiries directly via WhatsApp.",
    },
  ];

  return (
    <section className="py-16 bg-cream border-b border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-terracotta uppercase tracking-widest block mb-1">
            Our Promise
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-espresso">
            Why Choose SHREYANK CREATION
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-cream-surface rounded-2xl p-6 border border-sand/60 shadow-card hover:border-terracotta/40 transition-all text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-lg font-bold text-espresso mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-taupe leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
