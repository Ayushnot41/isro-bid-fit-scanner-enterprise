-- ============================================================
-- ISRO Bid-Fit Scanner Enterprise — Competitor Intelligence Schema
-- ============================================================

-- =========================
-- 1. competitor_vendors
-- =========================
CREATE TABLE IF NOT EXISTS public.competitor_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id TEXT UNIQUE NOT NULL,
  vendor_name TEXT NOT NULL,
  vendor_type TEXT NOT NULL CHECK (vendor_type IN ('MSME', 'Large Enterprise')),
  category TEXT DEFAULT 'Aerospace & Space Hardware',
  headquarters TEXT,
  gstin TEXT,
  established_year INT,
  win_rate_pct NUMERIC(5,2) DEFAULT 0.0,
  value_conversion_pct NUMERIC(5,2) DEFAULT 0.0,
  total_bids_awarded INT DEFAULT 0,
  total_bids_pending INT DEFAULT 0,
  total_bids_tech_rejected INT DEFAULT 0,
  total_bids_lost INT DEFAULT 0,
  total_value_awarded_cr NUMERIC(10,2) DEFAULT 0.0,
  total_value_pending_cr NUMERIC(10,2) DEFAULT 0.0,
  total_value_tech_rejected_cr NUMERIC(10,2) DEFAULT 0.0,
  total_value_lost_cr NUMERIC(10,2) DEFAULT 0.0,
  top_organisations JSONB DEFAULT '[]'::jsonb,
  operating_centers JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_competitor_vendors_id ON public.competitor_vendors(vendor_id);
CREATE INDEX IF NOT EXISTS idx_competitor_vendors_type ON public.competitor_vendors(vendor_type);

-- =========================
-- 2. tender_award_results
-- =========================
CREATE TABLE IF NOT EXISTS public.tender_award_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id TEXT UNIQUE NOT NULL,
  org_chain TEXT NOT NULL,
  org_tags TEXT[] DEFAULT '{}',
  title TEXT NOT NULL,
  location TEXT,
  center_code TEXT,
  stage_date_label TEXT,
  est_cost_cr NUMERIC(10,2) NOT NULL,
  emd_amount BIGINT DEFAULT 0,
  l1_winner_name TEXT,
  l1_amount_cr NUMERIC(10,2),
  l1_pct_below_estimate NUMERIC(5,2),
  primary_vendor_id TEXT REFERENCES public.competitor_vendors(vendor_id) ON DELETE SET NULL,
  this_company_status TEXT NOT NULL CHECK (this_company_status IN ('Awarded', 'Bid placed', 'Pending', 'Lost', 'Tech Rejected')),
  this_company_amount_cr NUMERIC(10,2),
  this_company_pct_below_estimate NUMERIC(5,2),
  participating_bidders JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tender_awards_tender_id ON public.tender_award_results(tender_id);
CREATE INDEX IF NOT EXISTS idx_tender_awards_center ON public.tender_award_results(center_code);
CREATE INDEX IF NOT EXISTS idx_tender_awards_status ON public.tender_award_results(this_company_status);

-- =========================
-- 3. tracked_competitors
-- =========================
CREATE TABLE IF NOT EXISTS public.tracked_competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  vendor_id TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  notes TEXT,
  notify_on_new_bid BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, vendor_id)
);

CREATE INDEX IF NOT EXISTS idx_tracked_competitors_user ON public.tracked_competitors(user_id);

-- Enable RLS
ALTER TABLE public.competitor_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_award_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracked_competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for competitor vendors"
  ON public.competitor_vendors FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Public read access for tender award results"
  ON public.tender_award_results FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can manage their own tracked competitors"
  ON public.tracked_competitors FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);
