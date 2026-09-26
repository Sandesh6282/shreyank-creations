"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Loader2, ShieldAlert } from "lucide-react";

interface AccountGuardProps {
  children: React.ReactNode;
}

export function AccountGuard({ children }: AccountGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      setAuthenticated(false);
      router.replace("/login");
      return;
    }

    let isMounted = true;

    async function checkAuth() {
      try {
        const { data: { session } } = await supabase!.auth.getSession();
        if (isMounted) {
          if (session) {
            setAuthenticated(true);
          } else {
            setAuthenticated(false);
            router.replace("/login");
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Account session check error:", err);
        if (isMounted) {
          setAuthenticated(false);
          router.replace("/login");
          setLoading(false);
        }
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        if (session) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          router.replace("/login");
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center p-4">
        <div className="bg-cream-surface p-8 rounded-2xl border border-sand/60 shadow-card text-center max-w-sm w-full">
          <Loader2 className="w-8 h-8 text-terracotta animate-spin mx-auto mb-4" />
          <h3 className="font-serif text-lg font-bold text-espresso mb-1">
            Loading Account Details
          </h3>
          <p className="text-xs text-taupe">Checking your customer session...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center p-4">
        <div className="bg-cream-surface p-8 rounded-2xl border border-sand/60 shadow-card text-center max-w-sm w-full">
          <ShieldAlert className="w-10 h-10 text-terracotta mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-espresso mb-1">
            Authentication Required
          </h3>
          <p className="text-xs text-taupe mb-4">
            Please log in to access your customer account.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
