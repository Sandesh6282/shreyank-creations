-- ===================================================
-- Shreyank Creations PostgreSQL Database Schema (Supabase)
-- ===================================================

-- 1. Enable UUID Extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    product_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT,
    category_slug TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    sale_price NUMERIC CHECK (sale_price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    sku TEXT,
    images TEXT[] DEFAULT '{}',
    materials TEXT,
    dimensions TEXT,
    care_instructions TEXT,
    shipping_info TEXT,
    featured BOOLEAN DEFAULT FALSE,
    bestseller BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- 5. Auto Update Trigger for updated_at Column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Grant Schema & Table Privileges to PostgreSQL Roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-applying schema
DROP POLICY IF EXISTS "Public categories read access" ON public.categories;
DROP POLICY IF EXISTS "Public active products read access" ON public.products;
DROP POLICY IF EXISTS "Admin full categories management" ON public.categories;
DROP POLICY IF EXISTS "Admin full products management" ON public.products;
DROP POLICY IF EXISTS "Public categories full management" ON public.categories;
DROP POLICY IF EXISTS "Public products full management" ON public.products;

-- Storefront read access
CREATE POLICY "Public categories read access"
    ON public.categories FOR SELECT
    USING (true);

CREATE POLICY "Public active products read access"
    ON public.products FOR SELECT
    USING (true);

-- Admin CRUD management policies for current unauthenticated browser architecture
CREATE POLICY "Public categories full management"
    ON public.categories FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public products full management"
    ON public.products FOR ALL
    USING (true)
    WITH CHECK (true);

-- 8. Supabase Storage Bucket Setup for Product Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if re-applying schema
DROP POLICY IF EXISTS "Public Product Images Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Product Images Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Product Images Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Product Images Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Product Images Delete Access" ON storage.objects;

-- Storage RLS Policies for product-images bucket
CREATE POLICY "Public Product Images Read Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

CREATE POLICY "Public Product Images Upload Access"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public Product Images Delete Access"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'product-images');
