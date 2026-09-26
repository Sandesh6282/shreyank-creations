"use client";

import React, { useState, useEffect } from "react";
import { fetchCustomerAddresses, createCustomerAddress } from "@/services/addressService";
import { ShippingAddress } from "@/types/order";
import { Button } from "@/components/ui/Button";
import { MapPin, Plus, Check, User, Phone, Home, Building } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface AddressManagerProps {
  selectedAddress: ShippingAddress | null;
  onSelectAddress: (address: ShippingAddress) => void;
}

export function AddressManager({
  selectedAddress,
  onSelectAddress,
}: AddressManagerProps) {
  const { addToast } = useToast();
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    async function loadAddresses() {
      setLoading(true);
      try {
        const list = await fetchCustomerAddresses();
        setAddresses(list);
        if (list.length > 0 && !selectedAddress) {
          onSelectAddress(list[0]);
        } else if (list.length === 0) {
          setShowAddForm(true);
        }
      } catch (err) {
        console.error("Failed to load addresses:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAddresses();
  }, [onSelectAddress, selectedAddress]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newAddr = await createCustomerAddress({
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country: "India",
        isDefault,
      });

      addToast("Address saved successfully!");
      setAddresses((prev) => [newAddr, ...prev]);
      onSelectAddress(newAddr);
      setShowAddForm(false);

      // Reset form
      setFullName("");
      setPhone("");
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setState("");
      setPostalCode("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add address";
      addToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-cream-surface rounded-xl border border-sand/60 text-xs text-taupe">
        Loading saved delivery addresses...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-sand/40 pb-3">
        <h3 className="font-serif text-lg font-bold text-espresso flex items-center gap-2">
          <MapPin className="w-5 h-5 text-terracotta" />
          <span>Shipping Address</span>
        </h3>

        {!showAddForm && addresses.length > 0 && (
          <button
            onClick={() => setShowAddForm(true)}
            className="text-xs font-semibold text-terracotta hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Address</span>
          </button>
        )}
      </div>

      {/* Saved Addresses List */}
      {!showAddForm && addresses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => {
            const isSelected = selectedAddress?.id === addr.id;
            return (
              <div
                key={addr.id || `${addr.addressLine1}-${addr.postalCode}`}
                onClick={() => onSelectAddress(addr)}
                className={`p-4 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-cream-surface border-terracotta shadow-md ring-1 ring-terracotta"
                    : "bg-cream border-sand/60 hover:border-sand hover:bg-cream-surface"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif font-bold text-espresso text-sm">
                      {addr.fullName}
                    </span>
                    {isSelected && (
                      <span className="bg-terracotta text-cream p-1 rounded-full text-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-taupe leading-relaxed">
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                  </p>
                  <p className="text-xs text-taupe font-medium mt-1">
                    {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                  <p className="text-xs text-espresso font-mono mt-2">
                    Phone: {addr.phone}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Address Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddAddress}
          className="bg-cream-surface p-5 rounded-xl border border-sand/60 space-y-4 text-xs shadow-card"
        >
          <div className="flex items-center justify-between border-b border-sand/40 pb-2">
            <h4 className="font-serif font-bold text-espresso text-sm">Enter Delivery Address</h4>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-taupe hover:text-espresso"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-taupe uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Roy"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-xs"
                />
                <User className="w-3.5 h-3.5 text-taupe absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-taupe uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-xs"
                />
                <Phone className="w-3.5 h-3.5 text-taupe absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-taupe uppercase tracking-wider mb-1">
              Flat, House No., Building, Apartment *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Flat 4B, Blue Pottery Enclave"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-xs"
              />
              <Home className="w-3.5 h-3.5 text-taupe absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-taupe uppercase tracking-wider mb-1">
              Street, Area, Landmark (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Near Hawa Mahal, Amer Road"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-xs"
              />
              <Building className="w-3.5 h-3.5 text-taupe absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-taupe uppercase tracking-wider mb-1">
                City *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jaipur"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-taupe uppercase tracking-wider mb-1">
                State *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rajasthan"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-taupe uppercase tracking-wider mb-1">
                Pincode / Postal Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 302001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3 py-2 bg-cream border border-sand rounded-lg text-espresso focus:outline-none focus:border-terracotta text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded border-sand text-terracotta focus:ring-terracotta"
            />
            <label htmlFor="isDefault" className="text-xs text-espresso">
              Set as default shipping address
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            className="w-full gap-1.5 mt-2"
          >
            <span>Save & Use Address</span>
          </Button>
        </form>
      )}
    </div>
  );
}
