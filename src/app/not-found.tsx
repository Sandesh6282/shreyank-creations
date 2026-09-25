import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="bg-cream min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center bg-cream-surface rounded-2xl border border-sand/60 p-8 shadow-card space-y-4">
        <div className="w-16 h-16 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-espresso">404</h1>
        <h2 className="font-serif text-xl font-semibold text-espresso">Page Not Found</h2>
        <p className="text-xs text-taupe leading-relaxed">
          The craft collection or page you are looking for might have been moved or doesn&apos;t exist.
        </p>
        <div className="pt-4 flex justify-center">
          <Link href="/shop" passHref>
            <Button variant="primary" size="md" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Shop Catalog</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
