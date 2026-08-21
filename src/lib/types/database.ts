export interface VendorProfile {
  id: string;
  user_id: string;
  company_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  gst_number: string | null;
  pan_number: string | null;
  msme_registered: boolean;
  msme_category: "micro" | "small" | "medium" | null;
  msme_udyam_number: string | null;
  certifications: string[];
  mechanical_tolerances: {
    linear_tolerance_mm?: number; // e.g. 0.005 (±5 microns)
    angular_tolerance_deg?: number; // e.g. 0.05
    surface_roughness_ra_um?: number; // e.g. 0.4 Ra
    max_component_diameter_mm?: number;
    cleanroom_class?: string; // e.g. "ISO Class 7"
    cnc_axis_count?: number; // e.g. 5-axis
  };
  manufacturing_capabilities: string[];
  past_isro_experience: boolean;
  isro_centers_supplied?: string[];
  annual_turnover_inr: number | null;
  employee_count: number | null;
  year_established: number | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface ToleranceComparison {
  parameter: string;
  required: string;
  offered: string;
  status: "met" | "exceeded" | "gap";
  score: number;
}

export interface BidEvaluation {
  id: string;
  user_id: string;
  tender_id: string | null;
  tender_reference: string;
  tender_title: string | null;
  tender_source_url: string | null;
  issuing_center?: string | null;
  tender_mechanical_tolerances_met: boolean;
  missing_certifications: string[];
  msme_waivers_applied: string[];
  final_bid_fit_score: number;
  certification_score: number | null;
  tolerance_score: number | null;
  msme_score: number | null;
  turnover_score: number | null;
  capability_score: number | null;
  evaluation_details: {
    tolerances_breakdown?: ToleranceComparison[];
    citations?: Array<{ clause: string; title: string; note: string; url?: string }>;
    strengths?: string[];
    risk_factors?: string[];
    actionable_steps?: string[];
  };
  recommendations: string[];
  evaluated_at: string;
}

export interface ScrapedTender {
  id: string;
  reference_number: string;
  title: string;
  description: string | null;
  issuing_center: string | null;
  center_code: "VSSC" | "URSC" | "SAC" | "SDSC" | "IPRC" | "NRSC" | "HSFC" | "LPSC";
  closing_date: string | null;
  opening_date: string | null;
  estimated_value_inr: number | null;
  emd_amount_inr: number | null;
  category: string;
  required_certifications: string[];
  required_tolerances: {
    linear_tolerance_mm?: number;
    surface_roughness_ra_um?: number;
    cleanroom_class?: string;
    cnc_axis_count?: number;
  };
  minimum_turnover_inr: number | null;
  required_capabilities: string[];
  source_url: string | null;
  pdf_storage_path: string | null;
  raw_metadata: Record<string, unknown>;
  is_active: boolean;
  scraped_at: string;
}

export interface Database {
  public: {
    Tables: {
      vendor_profiles: {
        Row: VendorProfile;
        Insert: Omit<VendorProfile, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<VendorProfile, "id" | "user_id" | "created_at" | "updated_at">>;
      };
      bid_evaluations: {
        Row: BidEvaluation;
        Insert: Omit<BidEvaluation, "id" | "evaluated_at">;
        Update: Partial<Omit<BidEvaluation, "id" | "user_id" | "evaluated_at">>;
      };
      scraped_tenders: {
        Row: ScrapedTender;
        Insert: Omit<ScrapedTender, "id" | "scraped_at">;
        Update: Partial<Omit<ScrapedTender, "id" | "scraped_at">>;
      };
    };
  };
}
