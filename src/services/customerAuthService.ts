import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { UserProfile, SignupInput, LoginInput } from "@/types/auth";

export async function customerSignUp(input: SignupInput) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      data: {
        full_name: input.fullName.trim(),
        phone: input.phone ? input.phone.trim() : "",
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  // Ensure profile record is inserted if trigger is delayed
  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      full_name: input.fullName.trim(),
      phone: input.phone ? input.phone.trim() : null,
      updated_at: new Date().toISOString(),
    });
  }

  return data;
}

export async function customerSignIn(input: LoginInput) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email.trim(),
    password: input.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function customerSignOut() {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function sendPasswordResetEmail(email: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const redirectTo = `${origin}/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateCustomerPassword(newPassword: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchCustomerProfile(): Promise<UserProfile | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user) {
    return null;
  }

  const user = session.user;

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const fullName = profileRow?.full_name || user.user_metadata?.full_name || "Valued Customer";

  return {
    id: user.id,
    fullName,
    email: user.email || "",
    phone: profileRow?.phone || user.user_metadata?.phone || "",
    createdAt: profileRow?.created_at || user.created_at,
    updatedAt: profileRow?.updated_at,
  };
}

export async function checkIsAdminUser(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return false;
  }

  try {
    const { data, error } = await supabase.rpc("is_admin");

    if (!error && typeof data === "boolean") {
      return data;
    }

    // Fallback if is_admin RPC function is not yet applied to database
    const { data: adminRow, error: adminErr } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!adminErr && adminRow) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
