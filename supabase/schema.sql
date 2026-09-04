-- =============================================================================
-- THENGA ROYALE 👑 - Supabase Database & Storage Schema
-- =============================================================================
-- Run this in the Supabase SQL Editor (SQL Editor -> New query -> Run)
-- to initialize the database tables and storage bucket for Thenga Royale.
-- =============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the coconut_entries Table
CREATE TABLE IF NOT EXISTS public.coconut_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'Contestant Palm',
    origin TEXT DEFAULT 'Coastal Grove',
    image_url TEXT NOT NULL,
    volume_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    spread_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    symmetry_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    wind_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    overall_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    hairstyle_title TEXT,
    jury_comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Index on overall_score for Fast Leaderboard Sorting
CREATE INDEX IF NOT EXISTS idx_coconut_entries_overall_score 
ON public.coconut_entries (overall_score DESC);

CREATE INDEX IF NOT EXISTS idx_coconut_entries_created_at 
ON public.coconut_entries (created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.coconut_entries ENABLE ROW LEVEL SECURITY;

-- 5. Open Public Policies (No authentication, open operator pageant)
DROP POLICY IF EXISTS "Public Read Access for Coconut Entries" ON public.coconut_entries;
CREATE POLICY "Public Read Access for Coconut Entries" 
ON public.coconut_entries 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Public Insert Access for Coconut Entries" ON public.coconut_entries;
CREATE POLICY "Public Insert Access for Coconut Entries" 
ON public.coconut_entries 
FOR INSERT 
WITH CHECK (true);

-- 6. Storage Buckets for Palm Photos ('contestants' and 'coconuts')
INSERT INTO storage.buckets (id, name, public) 
VALUES ('contestants', 'contestants', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('coconuts', 'coconuts', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public Storage Access Policies for contestants & coconuts
DROP POLICY IF EXISTS "Public Read Access on contestants bucket" ON storage.objects;
CREATE POLICY "Public Read Access on contestants bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id IN ('contestants', 'coconuts'));

DROP POLICY IF EXISTS "Public Insert Access on contestants bucket" ON storage.objects;
CREATE POLICY "Public Insert Access on contestants bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id IN ('contestants', 'coconuts'));
