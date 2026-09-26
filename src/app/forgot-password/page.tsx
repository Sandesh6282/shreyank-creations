"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Mail, KeyRound, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { sendPasswordResetEmail } from "@/services/customerAuthService";

export default function ForgotPasswordPage() {
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(email);
      const msg = "Password reset email sent! Please check your email inbox for instructions.";
      setSuccessMsg(msg);
      addToast(msg);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send reset link";
      setErrorMsg(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Reset Password" }]} />

        <div className="max-w-md mx-auto my-8 bg-cream-surface rounded-2xl border border-sand/60 p-8 shadow-card">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-espresso mb-1">Forgot Password</h1>
            <p className="text-xs text-taupe">Enter your registered email address to receive password reset instructions</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                Account Email Address *
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

            <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full gap-2 mt-2">
              <Mail className="w-4 h-4" />
              <span>Send Reset Instructions</span>
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-sand text-center text-xs text-taupe">
            <Link href="/login" className="font-bold text-terracotta hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Customer Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
