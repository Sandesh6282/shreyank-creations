import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Heart, ShieldCheck, Truck } from "lucide-react";
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
              <h4 className="font-serif text-cream font-medium text-base">Made with Care</h4>
              <p className="text-xs text-taupe-muted mt-0.5">
                Every piece is individually handcrafted by skilled artisans.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-espresso-light/40 border border-sand/10">
            <div className="w-12 h-12 rounded-full bg-terracotta/20 flex items-center justify-center text-terracotta shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-cream font-medium text-base">Protected Transit Packaging</h4>
              <p className="text-xs text-taupe-muted mt-0.5">
                Multi-layered protective packaging for safe handling.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-espresso-light/40 border border-sand/10">
            <div className="w-12 h-12 rounded-full bg-terracotta/20 flex items-center justify-center text-terracotta shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-cream font-medium text-base">Unique Handmade Pieces</h4>
              <p className="text-xs text-taupe-muted mt-0.5">
                Distinctive crafts that bring warmth to your living space.
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
                Shreyank Creations
              </span>
              <span className="block text-[10px] tracking-[0.25em] uppercase text-terracotta mt-0.5 font-medium">
                Handmade & Artisan Crafts
              </span>
            </Link>
            <p className="text-sm text-taupe-muted leading-relaxed max-w-md">
              Shreyank Creations brings together Indian handicrafts, home decor, folk art, and traditional decorative items created by artisan hands.
            </p>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-cream-muted">
                <MapPin className="w-4 h-4 text-terracotta shrink-0" />
                <span>Studios in Jaipur & Bengaluru, India</span>
              </div>
              <div className="flex items-center gap-2 text-cream-muted">
                <Mail className="w-4 h-4 text-terracotta shrink-0" />
                <a href="mailto:support@shreyankcreations.com" className="hover:text-cream transition-colors">
                  support@shreyankcreations.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-cream-muted">
                <Phone className="w-4 h-4 text-terracotta shrink-0" />
                <span>+91 98765 43210</span>
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
                <Link href="/contact" className="hover:text-terracotta transition-colors">
                  Contact Us
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

          {/* Customer Service / Care Column */}
          <div>
            <h4 className="font-serif text-cream text-base font-semibold mb-4 tracking-wide">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/contact#faq" className="hover:text-terracotta transition-colors">
                  FAQs & Inquiries
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-terracotta transition-colors">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-terracotta transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-taupe-muted gap-4">
          <p>© {new Date().getFullYear()} Shreyank Creations. All rights reserved. Crafted for your home.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-cream cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-cream cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
