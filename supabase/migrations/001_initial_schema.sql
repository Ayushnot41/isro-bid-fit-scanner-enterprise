-- ============================================================
-- ISRO Bid-Fit Scanner Enterprise — Initial Schema Migration
-- ============================================================
-- Tables: vendor_profiles, bid_evaluations, scraped_tenders
-- All tables enforce Row Level Security with auth.uid() isolation
-- ============================================================

-- =========================
-- 1. vendor_profiles
-- =========================
CREATE TABLE IF NOT EXISTS public.vendor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  gst_number TEXT,
  pan_number TEXT,
  msme_registered BOOLEAN DEFAULT false,
  msme_category TEXT CHECK (msme_category IN ('micro', 'small', 'medium') OR msme_category IS NULL),
  msme_udyam_number TEXT,
  certifications TEXT[] DEFAULT '{}',
  mechanical_tolerances JSONB DEFAULT '{}'::jsonb,
  manufacturing_capabilities TEXT[] DEFAULT '{}',
  past_isro_experience BOOLEAN DEFAULT false,
  annual_turnover_inr BIGINT,
  employee_count INTEGER,
  year_established INTEGER,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Index for RLS policy lookups
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_user_id ON public.vendor_profiles(user_id);

-- Enable RLS
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;

-- Policies: full isolation by auth.uid()
CREATE POLICY "Users can view own profile"
  ON public.vendor_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own profile"
  ON public.vendor_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.vendor_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own profile"
  ON public.vendor_profiles FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());


-- =========================
-- 2. bid_evaluations
-- =========================
CREATE TABLE IF NOT EXISTS public.bid_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tender_id UUID REFERENCES public.scraped_tenders(id),
  tender_reference TEXT NOT NULL,
  tender_title TEXT,
  tender_source_url TEXT,
  tender_mechanical_tolerances_met BOOLEAN DEFAULT false,
  missing_certifications TEXT[] DEFAULT '{}',
  msme_waivers_applied TEXT[] DEFAULT '{}',
  final_bid_fit_score NUMERIC(5,2) CHECK (
    final_bid_fit_score >= 0 AND final_bid_fit_score <= 100
  ),
  certification_score NUMERIC(5,2),
  tolerance_score NUMERIC(5,2),
  msme_score NUMERIC(5,2),
  turnover_score NUMERIC(5,2),
  capability_score NUMERIC(5,2),
  evaluation_details JSONB DEFAULT '{}'::jsonb,
  recommendations TEXT[] DEFAULT '{}',
  evaluated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bid_evaluations_user_id ON public.bid_evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_bid_evaluations_evaluated_at ON public.bid_evaluations(evaluated_at DESC);

-- Enable RLS
ALTER TABLE public.bid_evaluations ENABLE ROW LEVEL SECURITY;

-- Policies: full isolation by auth.uid()
CREATE POLICY "Users can view own evaluations"
  ON public.bid_evaluations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own evaluations"
  ON public.bid_evaluations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own evaluations"
  ON public.bid_evaluations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own evaluations"
  ON public.bid_evaluations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());


-- =========================
-- 3. scraped_tenders
-- =========================
CREATE TABLE IF NOT EXISTS public.scraped_tenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  issuing_center TEXT,
  closing_date TIMESTAMPTZ,
  opening_date TIMESTAMPTZ,
  estimated_value_inr BIGINT,
  emd_amount_inr BIGINT,
  category TEXT,
  required_certifications TEXT[] DEFAULT '{}',
  required_tolerances JSONB DEFAULT '{}'::jsonb,
  minimum_turnover_inr BIGINT,
  required_capabilities TEXT[] DEFAULT '{}',
  source_url TEXT,
  pdf_storage_path TEXT,
  raw_metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  scraped_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_reference ON public.scraped_tenders(reference_number);
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_closing ON public.scraped_tenders(closing_date DESC);
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_active ON public.scraped_tenders(is_active);

-- Enable RLS
ALTER TABLE public.scraped_tenders ENABLE ROW LEVEL SECURITY;

-- Policies: read-only for all authenticated users, writes via service_role only
CREATE POLICY "Authenticated users can view tenders"
  ON public.scraped_tenders FOR SELECT
  TO authenticated
  USING (true);

-- Note: INSERT/UPDATE/DELETE on scraped_tenders is restricted to service_role
-- (no authenticated user policies for writes — the server-side scraper uses
-- the service_role key which bypasses RLS entirely)


-- =========================
-- 4. Realtime publication
-- =========================
-- Enable Realtime on bid_evaluations so dashboards get live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.bid_evaluations;


-- =========================
-- 5. Updated_at trigger
-- =========================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_vendor_profiles_updated_at
  BEFORE UPDATE ON public.vendor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
