"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Loader2, ShieldAlert } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // If viewing login page, do not block or redirect
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      setAuthenticated(false);
      router.replace("/admin/login");
      return;
    }

    let isMounted = true;

    async function checkSession() {
      try {
        const { data: { session } } = await supabase!.auth.getSession();
        if (isMounted) {
          if (session) {
            setAuthenticated(true);
          } else {
            setAuthenticated(false);
            router.replace("/admin/login");
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth session check error:", err);
        if (isMounted) {
          setAuthenticated(false);
          router.replace("/admin/login");
          setLoading(false);
        }
      }
    }

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        if (session) {
          setAuthenticated(true);
        } else if (pathname !== "/admin/login") {
          setAuthenticated(false);
          router.replace("/admin/login");
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center p-4">
        <div className="bg-cream-surface p-8 rounded-2xl border border-sand/60 shadow-card text-center max-w-sm w-full">
          <Loader2 className="w-8 h-8 text-terracotta animate-spin mx-auto mb-4" />
          <h3 className="font-serif text-lg font-bold text-espresso mb-1">
            Verifying Admin Session
          </h3>
          <p className="text-xs text-taupe">Checking Supabase authentication credentials...</p>
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
            Access Restricted
          </h3>
          <p className="text-xs text-taupe mb-4">
            Redirecting to Admin Login...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
