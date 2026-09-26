"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, LogIn, ArrowRight, AlertCircle } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { customerSignIn } from "@/services/customerAuthService";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function checkExisting() {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.replace("/account");
        }
      }
    }
    checkExisting();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await customerSignIn({ email, password });
      addToast("Welcome back! Logged in successfully.");
      router.replace("/account");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign in";
      setErrorMsg(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Customer Sign In" }]} />

        <div className="max-w-md mx-auto my-8 bg-cream-surface rounded-2xl border border-sand/60 p-8 shadow-card">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-espresso mb-1">Welcome Back</h1>
            <p className="text-xs text-taupe">Sign in to manage your craft orders and saved wishlist</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="yourname@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-sm font-medium"
                />
                <Mail className="w-4 h-4 text-taupe absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-taupe uppercase tracking-wider">
                  Password *
                </label>
                <Link href="/forgot-password" className="text-xs text-terracotta hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-sm font-medium"
                />
                <Lock className="w-4 h-4 text-taupe absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full gap-2 mt-2">
              <LogIn className="w-4 h-4" />
              <span>Sign In to Account</span>
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-sand text-center text-xs text-taupe">
            <span>Don&apos;t have an account yet? </span>
            <Link href="/signup" className="font-bold text-terracotta hover:underline inline-flex items-center gap-1">
              <span>Create Account</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
