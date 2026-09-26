import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { ShippingAddress } from "@/types/order";

export async function fetchCustomerAddresses(): Promise<ShippingAddress[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  try {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row) => ({
      id: String(row.id),
      fullName: String(row.full_name || ""),
      phone: String(row.phone || ""),
      addressLine1: String(row.address_line_1 || ""),
      addressLine2: row.address_line_2 ? String(row.address_line_2) : "",
      city: String(row.city || ""),
      state: String(row.state || ""),
      postalCode: String(row.postal_code || ""),
      country: String(row.country || "India"),
      isDefault: Boolean(row.is_default),
    }));
  } catch (err) {
    console.error("Failed to fetch customer addresses:", err);
    return [];
  }
}

export async function createCustomerAddress(
  address: Omit<ShippingAddress, "id">
): Promise<ShippingAddress> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user) {
    throw new Error("User must be authenticated to add an address.");
  }

  const payload = {
    user_id: session.user.id,
    full_name: address.fullName.trim(),
    phone: address.phone.trim(),
    address_line_1: address.addressLine1.trim(),
    address_line_2: address.addressLine2 ? address.addressLine2.trim() : null,
    city: address.city.trim(),
    state: address.state.trim(),
    postal_code: address.postalCode.trim(),
    country: address.country.trim() || "India",
    is_default: Boolean(address.isDefault),
  };

  if (payload.is_default) {
    // Unset current default address for user
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", session.user.id);
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert(payload)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to save address: ${error?.message || "Unknown error"}`);
  }

  return {
    id: String(data.id),
    fullName: String(data.full_name),
    phone: String(data.phone),
    addressLine1: String(data.address_line_1),
    addressLine2: data.address_line_2 ? String(data.address_line_2) : "",
    city: String(data.city),
    state: String(data.state),
    postalCode: String(data.postal_code),
    country: String(data.country),
    isDefault: Boolean(data.is_default),
  };
}
