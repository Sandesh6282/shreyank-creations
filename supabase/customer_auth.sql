-- ===================================================
-- Shreyank Creations PostgreSQL Customer Auth & Admin Security DDL
-- Security Hardened Migration with SECURITY DEFINER is_admin() Helper
-- ===================================================

-- 1. Create Profiles Table for Customer Accounts
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Admin Users Table for Privileged Admin Authorization
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for High Performance Auth Queries
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- 4. SECURITY DEFINER Function to Check Admin Privilege Safely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

-- Grant EXECUTE permission on is_admin() function to authenticated & anon roles
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 5. Trigger for Auto Profile Creation on User Signup (Hardened Search Path)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.raw_user_meta_data->>'phone'
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 6. Enable Row Level Security (RLS) on Profiles, Admin Users, Products, and Categories
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-applying schema
DROP POLICY IF EXISTS "Customers can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Customers can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view admin_users list" ON public.admin_users;

DROP POLICY IF EXISTS "Public categories read access" ON public.categories;
DROP POLICY IF EXISTS "Public active products read access" ON public.products;
DROP POLICY IF EXISTS "Admin full categories management" ON public.categories;
DROP POLICY IF EXISTS "Admin full products management" ON public.products;
DROP POLICY IF EXISTS "Public categories full management" ON public.categories;
DROP POLICY IF EXISTS "Public products full management" ON public.products;

-- Customer Profile Policies (Strict Self-Access Only)
CREATE POLICY "Customers can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Customers can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- NO direct SELECT policy on admin_users table for public/customers.
-- Only database triggers or direct PostgreSQL functions access admin_users.

-- Public Storefront Read Policies (Anon & Authenticated Customers can SELECT active items; Admins see all)
CREATE POLICY "Public categories read access"
    ON public.categories FOR SELECT
    USING (true);

CREATE POLICY "Public active products read access"
    ON public.products FOR SELECT
    USING (active = true OR public.is_admin());

-- Strict Admin Write Access using public.is_admin() helper
CREATE POLICY "Admin full categories management"
    ON public.categories FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admin full products management"
    ON public.products FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 7. Supabase Storage Bucket Access Control for 'product-images'
DROP POLICY IF EXISTS "Public Product Images Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Product Images Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Product Images Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Product Images Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Product Images Delete Access" ON storage.objects;

-- Public read access for product images
CREATE POLICY "Public Product Images Read Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

-- Only verified admins (is_admin() = true) can upload images
CREATE POLICY "Admin Product Images Upload Access"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'product-images' AND
        public.is_admin()
    );

-- Only verified admins (is_admin() = true) can delete images
CREATE POLICY "Admin Product Images Delete Access"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'product-images' AND
        public.is_admin()
    );
