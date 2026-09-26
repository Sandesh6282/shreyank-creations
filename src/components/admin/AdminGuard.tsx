"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { checkIsAdminUser } from "@/services/customerAuthService";
import { Loader2, ShieldAlert, UserX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      setAuthenticated(false);
      setIsAdminAuthorized(false);
      router.replace("/admin/login");
      return;
    }

    let isMounted = true;

    async function checkAdminAuth() {
      try {
        const { data: { session } } = await supabase!.auth.getSession();
        if (isMounted) {
          if (!session || !session.user) {
            setAuthenticated(false);
            setIsAdminAuthorized(false);
            router.replace("/admin/login");
          } else {
            setAuthenticated(true);
            const isAdmin = await checkIsAdminUser(session.user.id);
            setIsAdminAuthorized(isAdmin);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Admin session check error:", err);
        if (isMounted) {
          setAuthenticated(false);
          setIsAdminAuthorized(false);
          router.replace("/admin/login");
          setLoading(false);
        }
      }
    }

    checkAdminAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (isMounted) {
        if (!session || !session.user) {
          setAuthenticated(false);
          setIsAdminAuthorized(false);
          if (pathname !== "/admin/login") {
            router.replace("/admin/login");
          }
        } else {
          setAuthenticated(true);
          const isAdmin = await checkIsAdminUser(session.user.id);
          setIsAdminAuthorized(isAdmin);
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
            Verifying Admin Authorization
          </h3>
          <p className="text-xs text-taupe">Checking credentials & admin privileges...</p>
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

  if (!isAdminAuthorized) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center p-4">
        <div className="bg-cream-surface p-8 rounded-2xl border border-sand/60 shadow-card text-center max-w-md w-full">
          <UserX className="w-12 h-12 text-terracotta mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-espresso mb-2">
            Admin Privilege Required
          </h3>
          <p className="text-xs text-taupe mb-6 leading-relaxed">
            Your account is authenticated as a customer, but does not have administrator privileges to access the Inventory Dashboard.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/account" passHref>
              <Button variant="primary" size="md" className="w-full">
                Go to Customer Account
              </Button>
            </Link>
            <Link href="/admin/login" passHref>
              <Button variant="secondary" size="md" className="w-full gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                <span>Switch to Admin Account</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
