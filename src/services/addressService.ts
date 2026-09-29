import { ShippingAddress } from "@/types/order";

export async function fetchCustomerAddresses(): Promise<ShippingAddress[]> {
  return [];
}

export async function createCustomerAddress(
  address: Omit<ShippingAddress, "id">
): Promise<ShippingAddress> {
  return {
    id: `addr_${Date.now()}`,
    fullName: address.fullName.trim(),
    phone: address.phone.trim(),
    addressLine1: address.addressLine1.trim(),
    addressLine2: address.addressLine2 ? address.addressLine2.trim() : "",
    city: address.city.trim(),
    state: address.state.trim(),
    postalCode: address.postalCode.trim(),
    country: address.country.trim() || "India",
    isDefault: Boolean(address.isDefault),
  };
}
