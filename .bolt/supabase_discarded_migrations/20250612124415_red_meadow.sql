/*
  # Add Host and Zip Code Support

  1. Schema Changes
    - Add `host_id` column to products table to track group hosts
    - Add `zip_code` column to profiles table for location-based notifications

  2. Security
    - Maintain existing RLS policies
    - Add foreign key constraint for data integrity
*/

-- Add host_id column to products table to track which user is hosting a group
ALTER TABLE public.products
ADD COLUMN host_id UUID REFERENCES public.profiles(id);

-- Add zip_code column to profiles table for location-based notifications
ALTER TABLE public.profiles
ADD COLUMN zip_code TEXT;

-- Add index for better query performance on zip_code lookups
CREATE INDEX IF NOT EXISTS idx_profiles_zip_code ON public.profiles(zip_code);

-- Add index for better query performance on host_id lookups
CREATE INDEX IF NOT EXISTS idx_products_host_id ON public.products(host_id);