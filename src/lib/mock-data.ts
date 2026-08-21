import type { VendorProfile, ScrapedTender, BidEvaluation } from "@/lib/types/database";
import { MOCK_ISRO_TENDERS, transformToTenderInsert } from "@/lib/scraper/isro-tenders";
import { evaluateBidFit } from "@/lib/evaluation/engine";

export const DEMO_VENDOR_PROFILE: VendorProfile = {
  id: "demo-vendor-001",
  user_id: "demo-user-id",
  company_name: "AeroPrecision Dynamics India Pvt. Ltd.",
  contact_email: "contracts@aeroprecision.in",
  contact_phone: "+91 80 4123 4567",
  gst_number: "29AABCA1234F1Z8",
  pan_number: "AABCA1234F",
  msme_registered: true,
  msme_category: "small",
  msme_udyam_number: "UDYAM-KR-03-0019283",
  certifications: ["AS9100D", "ISO9001:2015", "NABL", "ISO 14644-1"],
  mechanical_tolerances: {
    linear_tolerance_mm: 0.005, // ±5 microns
    angular_tolerance_deg: 0.02,
    surface_roughness_ra_um: 0.3,
    max_component_diameter_mm: 1200,
    cleanroom_class: "ISO Class 7",
    cnc_axis_count: 5,
  },
  manufacturing_capabilities: [
    "5-Axis CNC Machining",
    "Titanium Aerospace Fabrication",
    "CMM Inspection",
    "Carbon Fiber Composite Bonding",
    "Cleanroom Assembly (Class 10k)",
    "Non-Destructive Testing (NDT)",
    "Precision Honing & Lapping",
  ],
  past_isro_experience: true,
  isro_centers_supplied: ["VSSC, Trivandrum", "URSC, Bengaluru"],
  annual_turnover_inr: 48000000, // ₹4.80 Cr
  employee_count: 65,
  year_established: 2014,
  address: "Plot 42, Peenya Industrial Area 3rd Phase, Bengaluru, Karnataka 560058",
  created_at: "2026-01-15T09:00:00Z",
  updated_at: "2026-08-20T11:30:00Z",
};

export const INITIAL_SCRAPED_TENDERS: ScrapedTender[] = MOCK_ISRO_TENDERS.map((t, idx) => ({
  ...transformToTenderInsert(t),
  id: `tender-isro-00${idx + 1}`,
  scraped_at: new Date(Date.now() - idx * 3600000 * 4).toISOString(),
}));

export const INITIAL_EVALUATIONS: BidEvaluation[] = INITIAL_SCRAPED_TENDERS.slice(0, 4).map((tender) =>
  evaluateBidFit(DEMO_VENDOR_PROFILE, tender)
);
