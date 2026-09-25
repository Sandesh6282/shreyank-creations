import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="bg-cream min-h-screen py-16">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-cream-surface rounded-3xl p-8 sm:p-12 border border-sand shadow-card space-y-4">
          <div className="w-16 h-16 rounded-full bg-sand-light text-terracotta flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-espresso">
            Admin Workspace Structure
          </h1>
          <p className="text-sm text-taupe leading-relaxed">
            The route structure for <code className="bg-sand-light px-2 py-0.5 rounded text-espresso">/admin</code> has been initialized. Full admin dashboard metrics, product management, and order tracking controls will be built in the next development phase alongside Supabase integration.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-espresso text-cream hover:bg-terracotta transition-colors text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store Front</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
