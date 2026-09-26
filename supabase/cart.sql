-- ===================================================
-- Shreyank Creations Cart System Database Migration
-- Persistent Server-Side Cart for Logged-In Customers
-- ===================================================

-- 1. Create cart_items Table
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

-- 2. Performance Indexes for User & Product Lookups
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-applying schema
DROP POLICY IF EXISTS "Customers can view their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Customers can insert into their own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Customers can update their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Customers can delete their own cart items" ON public.cart_items;

-- 4. Customer Cart RLS Policies (Strict Self-Access Only)
CREATE POLICY "Customers can view their own cart items"
    ON public.cart_items FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Customers can insert into their own cart"
    ON public.cart_items FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Customers can update their own cart items"
    ON public.cart_items FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Customers can delete their own cart items"
    ON public.cart_items FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
