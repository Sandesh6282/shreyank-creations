-- ===================================================
-- Migration: Clean Up Unused Customer Auth DB Objects
-- Shreyank Creations - Removes profiles, customer cart, customer addresses,
-- and customer-specific RLS policies while keeping all admin & catalog objects.
-- ===================================================

-- 1. Drop trigger on auth.users and trigger function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Drop customer self-view RLS policies on orders and order_items
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can view their own order items" ON public.order_items;

-- 3. Drop unused customer tables (CASCADE removes associated policies and indexes)
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.addresses CASCADE;
