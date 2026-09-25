-- ===================================================
-- Shreyank Creations PostgreSQL Security Migration
-- Supabase Row Level Security (RLS) Lockdown
-- ===================================================

-- 1. Enable Row Level Security (RLS) on Core Tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop previous policies to apply strict authenticated-only admin security
DROP POLICY IF EXISTS "Public categories read access" ON public.categories;
DROP POLICY IF EXISTS "Public active products read access" ON public.products;
DROP POLICY IF EXISTS "Admin full categories management" ON public.categories;
DROP POLICY IF EXISTS "Admin full products management" ON public.products;
DROP POLICY IF EXISTS "Public categories full management" ON public.categories;
DROP POLICY IF EXISTS "Public products full management" ON public.products;

-- 2. Storefront Read Access (Public/Anon and Authenticated users can SELECT)
CREATE POLICY "Public categories read access"
    ON public.categories FOR SELECT
    USING (true);

CREATE POLICY "Public active products read access"
    ON public.products FOR SELECT
    USING (active = true OR auth.role() = 'authenticated');

-- 3. Strict Admin CRUD Management (Only Authenticated Users with valid Supabase Auth Session)
CREATE POLICY "Admin full categories management"
    ON public.categories FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full products management"
    ON public.products FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 4. Supabase Storage Bucket Access Control for 'product-images'
DROP POLICY IF EXISTS "Public Product Images Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Product Images Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Product Images Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Product Images Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Product Images Delete Access" ON storage.objects;

-- Public read access for product images
CREATE POLICY "Public Product Images Read Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

-- Only authenticated admin users can upload images
CREATE POLICY "Admin Product Images Upload Access"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Only authenticated admin users can delete images
CREATE POLICY "Admin Product Images Delete Access"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
