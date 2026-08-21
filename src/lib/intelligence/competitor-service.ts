import { createAdminClient } from "@/lib/supabase/admin";

// ── Types ───────────────────────────────────────────────────────────────────

export interface CompetitorVendorInsight {
  total_bids: {
    awarded: number;
    pending: number;
    tech_rejected: number;
    lost: number;
  };
  total_value_cr: {
    awarded: number;
    pending: number;
    tech_rejected: number;
    lost: number;
  };
  win_rate_pct: number;
  value_conversion_pct: number;
}

export interface TopOrganisation {
  org_name: string;
  center_code: string;
  value_cr: number;
  pct_share: number;
}

export interface OperatingCenter {
  center_name: string;
  lat: number;
  lng: number;
  value_cr: number;
  pct_share: number;
}

export interface CompetitorOverlap {
  competitor_name: string;
  competitor_won_value_cr: number;
  this_company_won_value_cr: number;
  others_won_value_cr: number;
  wins_count: number;
  shared_tenders_count: number;
}

export interface TenderHistoryAward {
  tender_id: string;
  org_chain: string;
  org_tags: string[];
  title: string;
  location: string;
  stage_date_label: string;
  est_cost_cr: number;
  emd_amount: number;
  l1_name: string | null;
  l1_amount_cr: number | null;
  l1_pct_below_estimate: number | null;
  this_company_status: "Awarded" | "Bid placed" | "Pending" | "Lost" | "Tech Rejected";
  this_company_amount_cr: number | null;
  this_company_pct_below_estimate: number | null;
}

export interface CompetitorVendorProfile {
  vendor_id: string;
  vendor_name: string;
  vendor_type: "MSME" | "Large Enterprise";
  insights: CompetitorVendorInsight;
  top_organisations: TopOrganisation[];
  operating_centers: OperatingCenter[];
  competitors: CompetitorOverlap[];
  tender_history: TenderHistoryAward[];
}

// ── Base In-Memory Dataset (Matches user requirements exactly) ───────────────

export const SEED_COMPETITOR_VENDORS: CompetitorVendorProfile[] = [
  {
    vendor_id: "aeroprecision-001",
    vendor_name: "AeroPrecision Dynamics India Pvt. Ltd.",
    vendor_type: "MSME",
    insights: {
      total_bids: { awarded: 4, pending: 6, tech_rejected: 2, lost: 8 },
      total_value_cr: { awarded: 11.7, pending: 18.4, tech_rejected: 3.1, lost: 22.6 },
      win_rate_pct: 20.0,
      value_conversion_pct: 21.4,
    },
    top_organisations: [
      { org_name: "Vikram Sarabhai Space Centre (VSSC)", center_code: "VSSC", value_cr: 6.4, pct_share: 54.7 },
      { org_name: "U R Rao Satellite Centre (URSC)", center_code: "URSC", value_cr: 3.1, pct_share: 26.5 },
      { org_name: "Space Applications Centre (SAC)", center_code: "SAC", value_cr: 1.4, pct_share: 12.0 },
      { org_name: "ISRO Propulsion Complex (IPRC)", center_code: "IPRC", value_cr: 0.8, pct_share: 6.8 },
    ],
    operating_centers: [
      { center_name: "VSSC, Thiruvananthapuram", lat: 8.5285, lng: 76.8747, value_cr: 6.4, pct_share: 54.7 },
      { center_name: "URSC, Bengaluru", lat: 12.9629, lng: 77.6389, value_cr: 3.1, pct_share: 26.5 },
      { center_name: "SAC, Ahmedabad", lat: 23.0395, lng: 72.5066, value_cr: 1.4, pct_share: 12.0 },
      { center_name: "IPRC, Mahendragiri", lat: 8.3833, lng: 77.6333, value_cr: 0.8, pct_share: 6.8 },
    ],
    competitors: [
      {
        competitor_name: "Precision Aerostructures Ltd.",
        competitor_won_value_cr: 18.6,
        this_company_won_value_cr: 6.4,
        others_won_value_cr: 9.2,
        wins_count: 6,
        shared_tenders_count: 11,
      },
      {
        competitor_name: "Titan Aerospace Components Pvt. Ltd.",
        competitor_won_value_cr: 12.3,
        this_company_won_value_cr: 3.1,
        others_won_value_cr: 7.8,
        wins_count: 4,
        shared_tenders_count: 8,
      },
      {
        competitor_name: "Vaayu Precision Manufacturing",
        competitor_won_value_cr: 9.1,
        this_company_won_value_cr: 1.4,
        others_won_value_cr: 5.6,
        wins_count: 3,
        shared_tenders_count: 6,
      },
      {
        competitor_name: "Skyforge Engineering Works",
        competitor_won_value_cr: 6.7,
        this_company_won_value_cr: 0.8,
        others_won_value_cr: 4.1,
        wins_count: 2,
        shared_tenders_count: 5,
      },
      {
        competitor_name: "Nakshatra Alloys & Machining",
        competitor_won_value_cr: 5.2,
        this_company_won_value_cr: 0.0,
        others_won_value_cr: 3.9,
        wins_count: 2,
        shared_tenders_count: 4,
      },
    ],
    tender_history: [
      {
        tender_id: "VSSC/PUR/2026/T-089",
        org_chain: "Vikram Sarabhai Space Centre (VSSC)",
        org_tags: ["CPPP", "Technical BO", "Propulsion & Precision Machining"],
        title: "Precision 5-Axis CNC Machining of Titanium Alloy PSLV-C60 Stage-4 Gimbal Brackets",
        location: "VSSC, Thiruvananthapuram, Kerala",
        stage_date_label: "Tech Evaluation 22 Aug 2026",
        est_cost_cr: 3.20,
        emd_amount: 640000,
        l1_name: null,
        l1_amount_cr: null,
        l1_pct_below_estimate: null,
        this_company_status: "Bid placed",
        this_company_amount_cr: null,
        this_company_pct_below_estimate: null,
      },
      {
        tender_id: "URSC/MME/2026/T-104",
        org_chain: "U R Rao Satellite Centre (URSC)",
        org_tags: ["CPPP", "Technical BO", "Satellite Bus & Composite Structures"],
        title: "Fabrication of Lightweight Honeycomb Carbon Fiber Bus Structure for Oceansat-4",
        location: "URSC, Bengaluru, Karnataka",
        stage_date_label: "Tech Evaluation 28 Sept 2026",
        est_cost_cr: 8.50,
        emd_amount: 1700000,
        l1_name: null,
        l1_amount_cr: null,
        l1_pct_below_estimate: null,
        this_company_status: "Bid placed",
        this_company_amount_cr: null,
        this_company_pct_below_estimate: null,
      },
      {
        tender_id: "SAC/ELE/2026/T-047",
        org_chain: "Space Applications Centre (SAC)",
        org_tags: ["CPPP", "Technical BO", "RF, Microwave & Payload Electronics"],
        title: "Supply of X-Band Solid State Power Amplifiers (SSPA) & Waveguide Assemblies for SAR",
        location: "SAC, Ahmedabad, Gujarat",
        stage_date_label: "Tech Evaluation 05 Oct 2026",
        est_cost_cr: 4.50,
        emd_amount: 900000,
        l1_name: null,
        l1_amount_cr: null,
        l1_pct_below_estimate: null,
        this_company_status: "Bid placed",
        this_company_amount_cr: null,
        this_company_pct_below_estimate: null,
      },
      {
        tender_id: "IPRC/MEC/2026/T-052",
        org_chain: "ISRO Propulsion Complex (IPRC)",
        org_tags: ["CPPP", "Financial BO", "Cryogenics & Propulsion Systems"],
        title: "Manufacture & Pressure Testing of Liquid Hydrogen (LH2) Cryogenic Regulating Valves",
        location: "IPRC, Mahendragiri, Tamil Nadu",
        stage_date_label: "Bid Opening 15 Oct 2026",
        est_cost_cr: 6.20,
        emd_amount: 1240000,
        l1_name: null,
        l1_amount_cr: null,
        l1_pct_below_estimate: null,
        this_company_status: "Bid placed",
        this_company_amount_cr: null,
        this_company_pct_below_estimate: null,
      },
      {
        tender_id: "VSSC/PUR/2025/T-041",
        org_chain: "Vikram Sarabhai Space Centre (VSSC)",
        org_tags: ["CPPP", "Technical BO", "Propulsion & Precision Machining"],
        title: "CNC Machining of Aluminium Alloy Interstage Adapter Rings for PSLV",
        location: "VSSC, Thiruvananthapuram, Kerala",
        stage_date_label: "Awarded 12 Mar 2026",
        est_cost_cr: 2.10,
        emd_amount: 420000,
        l1_name: "AeroPrecision Dynamics India Pvt. Ltd.",
        l1_amount_cr: 1.87,
        l1_pct_below_estimate: 10.9,
        this_company_status: "Awarded",
        this_company_amount_cr: 1.87,
        this_company_pct_below_estimate: 10.9,
      },
      {
        tender_id: "URSC/MME/2025/T-078",
        org_chain: "U R Rao Satellite Centre (URSC)",
        org_tags: ["CPPP", "Technical BO", "Satellite Bus & Composite Structures"],
        title: "Supply of Carbon Fiber Reinforced Polymer (CFRP) Panels for Bus Structure",
        location: "URSC, Bengaluru, Karnataka",
        stage_date_label: "Awarded 03 Feb 2026",
        est_cost_cr: 3.80,
        emd_amount: 760000,
        l1_name: "Precision Aerostructures Ltd.",
        l1_amount_cr: 3.35,
        l1_pct_below_estimate: 11.8,
        this_company_status: "Lost",
        this_company_amount_cr: 3.62,
        this_company_pct_below_estimate: 4.7,
      },
      {
        tender_id: "SAC/ELE/2025/T-033",
        org_chain: "Space Applications Centre (SAC)",
        org_tags: ["CPPP", "Technical BO", "RF, Microwave & Payload Electronics"],
        title: "Manufacture of Waveguide Filter Assemblies for Ku-Band Transponders",
        location: "SAC, Ahmedabad, Gujarat",
        stage_date_label: "Tech Rejected 18 Jan 2026",
        est_cost_cr: 1.95,
        emd_amount: 390000,
        l1_name: "Titan Aerospace Components Pvt. Ltd.",
        l1_amount_cr: 1.71,
        l1_pct_below_estimate: 12.3,
        this_company_status: "Tech Rejected",
        this_company_amount_cr: null,
        this_company_pct_below_estimate: null,
      },
      {
        tender_id: "IPRC/MEC/2025/T-029",
        org_chain: "ISRO Propulsion Complex (IPRC)",
        org_tags: ["CPPP", "Financial BO", "Cryogenics & Propulsion Systems"],
        title: "Fabrication of Stainless Steel Cryogenic Transfer Lines",
        location: "IPRC, Mahendragiri, Tamil Nadu",
        stage_date_label: "Awarded 27 Dec 2025",
        est_cost_cr: 2.60,
        emd_amount: 520000,
        l1_name: "AeroPrecision Dynamics India Pvt. Ltd.",
        l1_amount_cr: 2.31,
        l1_pct_below_estimate: 11.2,
        this_company_status: "Awarded",
        this_company_amount_cr: 2.31,
        this_company_pct_below_estimate: 11.2,
      },
      {
        tender_id: "SDSC/MEC/2025/T-061",
        org_chain: "Satish Dhawan Space Centre (SDSC SHAR)",
        org_tags: ["CPPP", "Technical BO", "Launch Vehicle Structures"],
        title: "Precision Machining of Launch Pad Umbilical Mast Fittings",
        location: "SDSC SHAR, Sriharikota, Andhra Pradesh",
        stage_date_label: "Lost 14 Nov 2025",
        est_cost_cr: 5.40,
        emd_amount: 1080000,
        l1_name: "Vaayu Precision Manufacturing",
        l1_amount_cr: 4.78,
        l1_pct_below_estimate: 11.5,
        this_company_status: "Lost",
        this_company_amount_cr: 5.02,
        this_company_pct_below_estimate: 7.0,
      },
      {
        tender_id: "LPSC/CHM/2025/T-018",
        org_chain: "Liquid Propulsion Systems Centre (LPSC)",
        org_tags: ["CPPP", "Technical BO", "Propulsion & Chemical Systems"],
        title: "Supply of Titanium Alloy Injector Head Assemblies for Vikas Engine",
        location: "LPSC, Valiamala, Kerala",
        stage_date_label: "Pending — Financial BO 30 Aug 2026",
        est_cost_cr: 4.10,
        emd_amount: 820000,
        l1_name: null,
        l1_amount_cr: null,
        l1_pct_below_estimate: null,
        this_company_status: "Pending",
        this_company_amount_cr: null,
        this_company_pct_below_estimate: null,
      },
    ],
  },
  {
    vendor_id: "precision-aerostructures-002",
    vendor_name: "Precision Aerostructures Ltd.",
    vendor_type: "Large Enterprise",
    insights: {
      total_bids: { awarded: 22, pending: 9, tech_rejected: 4, lost: 17 },
      total_value_cr: { awarded: 96.4, pending: 41.2, tech_rejected: 9.8, lost: 62.7 },
      win_rate_pct: 43.1,
      value_conversion_pct: 44.7,
    },
    top_organisations: [
      { org_name: "U R Rao Satellite Centre (URSC)", center_code: "URSC", value_cr: 38.6, pct_share: 40.0 },
      { org_name: "Vikram Sarabhai Space Centre (VSSC)", center_code: "VSSC", value_cr: 27.1, pct_share: 28.1 },
      { org_name: "Space Applications Centre (SAC)", center_code: "SAC", value_cr: 18.4, pct_share: 19.1 },
      { org_name: "Satish Dhawan Space Centre (SDSC SHAR)", center_code: "SDSC", value_cr: 12.3, pct_share: 12.8 },
    ],
    operating_centers: [
      { center_name: "URSC, Bengaluru", lat: 12.9629, lng: 77.6389, value_cr: 38.6, pct_share: 40.0 },
      { center_name: "VSSC, Thiruvananthapuram", lat: 8.5285, lng: 76.8747, value_cr: 27.1, pct_share: 28.1 },
      { center_name: "SAC, Ahmedabad", lat: 23.0395, lng: 72.5066, value_cr: 18.4, pct_share: 19.1 },
      { center_name: "SDSC SHAR, Sriharikota", lat: 13.7199, lng: 80.2304, value_cr: 12.3, pct_share: 12.8 },
    ],
    competitors: [
      {
        competitor_name: "AeroPrecision Dynamics India Pvt. Ltd.",
        competitor_won_value_cr: 6.4,
        this_company_won_value_cr: 18.6,
        others_won_value_cr: 9.2,
        wins_count: 4,
        shared_tenders_count: 11,
      },
      {
        competitor_name: "Titan Aerospace Components Pvt. Ltd.",
        competitor_won_value_cr: 22.1,
        this_company_won_value_cr: 31.4,
        others_won_value_cr: 14.6,
        wins_count: 9,
        shared_tenders_count: 19,
      },
    ],
    tender_history: [
      {
        tender_id: "URSC/MME/2025/T-078",
        org_chain: "U R Rao Satellite Centre (URSC)",
        org_tags: ["CPPP", "Technical BO", "Satellite Bus & Composite Structures"],
        title: "Supply of Carbon Fiber Reinforced Polymer (CFRP) Panels for Bus Structure",
        location: "URSC, Bengaluru, Karnataka",
        stage_date_label: "Awarded 03 Feb 2026",
        est_cost_cr: 3.80,
        emd_amount: 760000,
        l1_name: "Precision Aerostructures Ltd.",
        l1_amount_cr: 3.35,
        l1_pct_below_estimate: 11.8,
        this_company_status: "Awarded",
        this_company_amount_cr: 3.35,
        this_company_pct_below_estimate: 11.8,
      },
    ],
  },
];

// ── Backend Service Methods ──────────────────────────────────────────────────

export class CompetitorIntelligenceService {
  /**
   * Fetch all competitor vendor intelligence profiles with optional search & type filters
   */
  static async getAllVendors(query?: { search?: string; type?: string }): Promise<CompetitorVendorProfile[]> {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("competitor_vendors")
        .select("*");

      if (error || !data || data.length === 0) {
        // Fallback to seed data
        return this.filterLocalVendors(SEED_COMPETITOR_VENDORS, query);
      }

      // Map Supabase records to formatted profile
      const mapped = data.map((row: any) => ({
        vendor_id: row.vendor_id,
        vendor_name: row.vendor_name,
        vendor_type: row.vendor_type,
        insights: {
          total_bids: {
            awarded: row.total_bids_awarded,
            pending: row.total_bids_pending,
            tech_rejected: row.total_bids_tech_rejected,
            lost: row.total_bids_lost,
          },
          total_value_cr: {
            awarded: Number(row.total_value_awarded_cr),
            pending: Number(row.total_value_pending_cr),
            tech_rejected: Number(row.total_value_tech_rejected_cr),
            lost: Number(row.total_value_lost_cr),
          },
          win_rate_pct: Number(row.win_rate_pct),
          value_conversion_pct: Number(row.value_conversion_pct),
        },
        top_organisations: row.top_organisations || [],
        operating_centers: row.operating_centers || [],
        competitors: [],
        tender_history: [],
      }));

      return this.filterLocalVendors(mapped, query);
    } catch {
      return this.filterLocalVendors(SEED_COMPETITOR_VENDORS, query);
    }
  }

  /**
   * Fetch single vendor by ID with complete competitor overlaps and tender history
   */
  static async getVendorById(vendorId: string): Promise<CompetitorVendorProfile | null> {
    const local = SEED_COMPETITOR_VENDORS.find((v) => v.vendor_id === vendorId);
    return local || null;
  }

  /**
   * Fetch tender history award results
   */
  static async getTenderHistory(query?: {
    vendor_id?: string;
    status?: string;
    search?: string;
  }): Promise<TenderHistoryAward[]> {
    const activeVendor =
      SEED_COMPETITOR_VENDORS.find((v) => v.vendor_id === (query?.vendor_id || "aeroprecision-001")) ||
      SEED_COMPETITOR_VENDORS[0];

    let list = activeVendor.tender_history;

    if (query?.status && query.status !== "ALL") {
      list = list.filter((t) => t.this_company_status.toLowerCase() === query.status?.toLowerCase());
    }

    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.tender_id.toLowerCase().includes(q) ||
          t.org_chain.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q)
      );
    }

    return list;
  }

  /**
   * Save or toggle tracked competitor watchlist in Supabase
   */
  static async toggleTrackCompetitor(userId: string, vendorId: string, vendorName: string): Promise<{ tracked: boolean }> {
    try {
      const supabase = createAdminClient();
      const { data: existing } = await supabase
        .from("tracked_competitors")
        .select("id")
        .eq("user_id", userId)
        .eq("vendor_id", vendorId)
        .single();

      if (existing) {
        await supabase
          .from("tracked_competitors")
          .delete()
          .eq("id", existing.id);
        return { tracked: false };
      } else {
        await supabase
          .from("tracked_competitors")
          .insert({
            user_id: userId,
            vendor_id: vendorId,
            vendor_name: vendorName,
          });
        return { tracked: true };
      }
    } catch {
      return { tracked: true };
    }
  }

  private static filterLocalVendors(
    vendors: CompetitorVendorProfile[],
    query?: { search?: string; type?: string }
  ): CompetitorVendorProfile[] {
    let result = [...vendors];

    if (query?.type) {
      result = result.filter((v) => v.vendor_type.toLowerCase() === query.type?.toLowerCase());
    }

    if (query?.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (v) =>
          v.vendor_name.toLowerCase().includes(q) ||
          v.vendor_id.toLowerCase().includes(q)
      );
    }

    return result;
  }
}
