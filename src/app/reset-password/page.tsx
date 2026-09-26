"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Lock, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { updateCustomerPassword } from "@/services/customerAuthService";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify both password fields.");
      addToast("Passwords do not match.", "error");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      addToast("Password too short.", "error");
      return;
    }

    setLoading(true);
    try {
      await updateCustomerPassword(password);
      setSuccessMsg("Password updated successfully! Redirecting to your account dashboard...");
      addToast("Password updated successfully!");
      setTimeout(() => {
        router.replace("/account");
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset password";
      setErrorMsg(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Set New Password" }]} />

        <div className="max-w-md mx-auto my-8 bg-cream-surface rounded-2xl border border-sand/60 p-8 shadow-card">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-espresso mb-1">Set New Password</h1>
            <p className="text-xs text-taupe">Choose a strong new password for your customer account</p>
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
                New Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-sm font-medium"
                />
                <Lock className="w-4 h-4 text-taupe absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-taupe uppercase tracking-wider mb-1">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-sm font-medium"
                />
                <Lock className="w-4 h-4 text-taupe absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full gap-2 mt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Update Password & Continue</span>
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-sand text-center text-xs text-taupe">
            <Link href="/login" className="font-bold text-terracotta hover:underline inline-flex items-center gap-1">
              <span>Sign In Instead</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
