import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

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
