"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-16 bg-sand-light/60">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-cream-surface rounded-3xl p-8 sm:p-12 border border-sand shadow-artisan">
          <div className="w-12 h-12 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6" />
          </div>

          <h2 className="font-serif text-3xl font-bold text-espresso mb-2">
            Join Our Craft Club
          </h2>
          <p className="text-sm text-taupe max-w-lg mx-auto mb-6">
            Subscribe to receive updates on new handmade releases, artisan stories, and exclusive preview collections.
          </p>

          {isSubmitted ? (
            <div className="inline-flex items-center gap-2 p-4 bg-sage/10 text-sage rounded-xl border border-sage/20 font-medium text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Thank you for subscribing to Shreyank Creations!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-sm"
              />
              <Button type="submit" variant="primary" size="md">
                Subscribe
              </Button>
            </form>
          )}

          <p className="text-[11px] text-taupe-muted mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
