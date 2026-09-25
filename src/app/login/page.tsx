"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Login demo UI active! Backend Supabase integration coming in next phase.", "info");
  };

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Account Login" }]} />

        <div className="max-w-md mx-auto my-8 bg-cream-surface rounded-2xl border border-sand/60 p-8 shadow-card">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-espresso mb-1">Welcome Back</h1>
            <p className="text-xs text-taupe">Sign in to manage your craft orders and wishlist</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="yourname@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta"
                />
                <Mail className="w-4 h-4 text-taupe absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-taupe uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-terracotta hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta"
                />
                <Lock className="w-4 h-4 text-taupe absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full gap-2 mt-2">
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-sand text-center text-xs text-taupe">
            <span>Don&apos;t have an account yet? </span>
            <Link href="/register" className="font-bold text-terracotta hover:underline inline-flex items-center gap-1">
              <span>Create Account</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
