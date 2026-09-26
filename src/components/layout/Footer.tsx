import React from "react";
import Link from "next/link";
import { MessageSquare, Heart, ShieldCheck, Truck } from "lucide-react";
import { CATEGORIES } from "@/data/categories";

export function Footer() {
  return (
    <footer className="bg-espresso text-cream-muted border-t border-sand/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Value Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-sand/15">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-espresso-light/40 border border-sand/10">
            <div className="w-12 h-12 rounded-full bg-terracotta/20 flex items-center justify-center text-terracotta shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-cream font-medium text-base">Handmade Craftsmanship</h4>
              <p className="text-xs text-taupe-muted mt-0.5">
                Every bag, pouch, and accessory is crafted by hand with care.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-espresso-light/40 border border-sand/10">
            <div className="w-12 h-12 rounded-full bg-terracotta/20 flex items-center justify-center text-terracotta shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-cream font-medium text-base">Delivery Across India</h4>
              <p className="text-xs text-taupe-muted mt-0.5">
                Simple and reliable doorstep delivery across India.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-espresso-light/40 border border-sand/10">
            <div className="w-12 h-12 rounded-full bg-terracotta/20 flex items-center justify-center text-terracotta shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-cream font-medium text-base">Custom Creations</h4>
              <p className="text-xs text-taupe-muted mt-0.5">
                Discuss custom designs and personalized orders directly on WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-sand/15">
          {/* Brand Intro Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold text-cream tracking-wide">
                SHREYANK CREATION
              </span>
              <span className="block text-[10px] tracking-[0.2em] uppercase text-terracotta mt-0.5 font-semibold">
                Handmade Fabric & Custom Creations
              </span>
            </Link>
            <p className="text-sm text-taupe-muted leading-relaxed max-w-md">
              SHREYANK CREATION brings you handmade fabric bags, utility pouches, organizers, bookmarks, and bespoke custom accessories crafted with creativity and care.
            </p>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-cream-muted">
                <Truck className="w-4 h-4 text-terracotta shrink-0" />
                <span>Delivery Available Across India</span>
              </div>
              <div className="flex items-center gap-2 text-cream-muted">
                <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href="https://wa.me/918951119766"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream transition-colors font-medium text-[#25D366]"
                >
                  Order & Enquire on WhatsApp (+91 89511 19766)
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-serif text-cream text-base font-semibold mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-terracotta transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-terracotta transition-colors">
                  Explore Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-terracotta transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/918951119766?text=Hi%20SHREYANK%20CREATION%2C%20I%27d%20like%20to%20discuss%20a%20custom%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-terracotta transition-colors"
                >
                  Custom Orders
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-terracotta transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="font-serif text-cream text-base font-semibold mb-4 tracking-wide">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/shop/${cat.slug}`}
                    className="hover:text-terracotta transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service Column */}
          <div>
            <h4 className="font-serif text-cream text-base font-semibold mb-4 tracking-wide">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/contact#faq" className="hover:text-terracotta transition-colors">
                  FAQs & Enquiries
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-terracotta transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-terracotta transition-colors">
                  Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-taupe-muted gap-4">
          <p>© {new Date().getFullYear()} SHREYANK CREATION. All rights reserved. Made with creativity & care.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-cream cursor-pointer transition-colors">Delivery Across India</span>
            <span className="hover:text-cream cursor-pointer transition-colors">WhatsApp Order Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
