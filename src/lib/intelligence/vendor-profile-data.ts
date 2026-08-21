export interface VendorInsightData {
  awarded: number;
  pending: number;
  yet_to_open: number;
  lost: number;
}

export interface TopOrganisation {
  org_name: string;
  center_code: "VSSC" | "URSC" | "SAC" | "SDSC" | "IPRC" | "LPSC" | "NRSC" | "HSFC" | "OTHER";
  value_cr: number;
  bids_count: number;
  status: "awarded" | "won" | "bid";
  share_pct: number;
}

export interface OperatingCenter {
  center_name: string;
  center_code: string;
  location: string;
  state: string;
  value_cr: number;
  bids_count: number;
  share_pct: number;
}

export interface CompetitorComparisonRow {
  id: string;
  competitor_name: string;
  competitor_type: "MSME" | "Large Enterprise";
  competitor_won_value_cr: number;
  vendor_won_value_cr: number;
  others_value_cr: number;
  co_bid_count: number;
  overlap_pct: number;
}

export interface VendorTenderHistoryItem {
  tender_id: string;
  reference_number: string;
  title: string;
  department: string;
  center_code: string;
  status: "AWARDED" | "L1 STANDING" | "YET TO OPEN" | "DISCARDED" | "EVALUATING";
  bid_amount_cr: number;
  estimated_amount_cr: number;
  rank: string; // "L1", "L2", "L3", "Qualified"
  result: string; // "Awarded", "Under Commercial Evaluation", "Pending Technical Envelope"
  primary_competitor: string;
  date: string;
}

export interface CompleteVendorProfile {
  vendor_id: string;
  vendor_name: string;
  short_code: string;
  vendor_type: "MSME" | "Large Enterprise";
  category: string;
  headquarters: string;
  established_year: number;
  gstin: string;
  avatar_bg: string;
  avatar_text: string;
  is_verified_msme: boolean;
  insights: {
    total_bids: VendorInsightData;
    total_value_cr: VendorInsightData;
  };
  top_organisations: TopOrganisation[];
  operating_centers: OperatingCenter[];
  competitors: CompetitorComparisonRow[];
  tender_history: VendorTenderHistoryItem[];
}

export const VENDOR_PROFILES_STORE: Record<string, CompleteVendorProfile> = {
  "aeroprecision": {
    vendor_id: "aeroprecision",
    vendor_name: "AeroPrecision India Ltd.",
    short_code: "APIL",
    vendor_type: "MSME",
    category: "Propulsion, Gimbals & Precision 5-Axis Machining",
    headquarters: "Peenya Industrial Area, Bengaluru, Karnataka 560058",
    established_year: 2012,
    gstin: "29AABCA1234F1Z5",
    avatar_bg: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
    avatar_text: "AP",
    is_verified_msme: true,
    insights: {
      total_bids: {
        awarded: 48,
        pending: 14,
        yet_to_open: 8,
        lost: 22,
      },
      total_value_cr: {
        awarded: 342.8,
        pending: 88.5,
        yet_to_open: 54.0,
        lost: 165.2,
      },
    },
    top_organisations: [
      { org_name: "Vikram Sarabhai Space Centre (VSSC)", center_code: "VSSC", value_cr: 148.5, bids_count: 32, status: "awarded", share_pct: 43.3 },
      { org_name: "Liquid Propulsion Systems Centre (LPSC)", center_code: "LPSC", value_cr: 92.4, bids_count: 24, status: "awarded", share_pct: 26.9 },
      { org_name: "ISRO Propulsion Complex (IPRC)", center_code: "IPRC", value_cr: 58.6, bids_count: 18, status: "awarded", share_pct: 17.1 },
      { org_name: "U R Rao Satellite Centre (URSC)", center_code: "URSC", value_cr: 32.8, bids_count: 12, status: "won", share_pct: 9.6 },
      { org_name: "Other Space Facilities & Centers", center_code: "OTHER", value_cr: 10.5, bids_count: 6, status: "bid", share_pct: 3.1 },
    ],
    operating_centers: [
      { center_name: "VSSC Thiruvananthapuram", center_code: "VSSC", location: "Thiruvananthapuram", state: "Kerala", value_cr: 148.5, bids_count: 32, share_pct: 43.3 },
      { center_name: "LPSC Valiamala / Bengaluru", center_code: "LPSC", location: "Valiamala & Bengaluru", state: "Kerala / Karnataka", value_cr: 92.4, bids_count: 24, share_pct: 26.9 },
      { center_name: "IPRC Mahendragiri", center_code: "IPRC", location: "Mahendragiri", state: "Tamil Nadu", value_cr: 58.6, bids_count: 18, share_pct: 17.1 },
      { center_name: "URSC Bengaluru", center_code: "URSC", location: "Bengaluru", state: "Karnataka", value_cr: 32.8, bids_count: 12, share_pct: 9.6 },
      { center_name: "SDSC SHAR Sriharikota", center_code: "SDSC", location: "Sriharikota", state: "Andhra Pradesh", value_cr: 10.5, bids_count: 6, share_pct: 3.1 },
    ],
    competitors: [
      {
        id: "c1",
        competitor_name: "Godrej Aerospace Division",
        competitor_type: "Large Enterprise",
        competitor_won_value_cr: 184.2,
        vendor_won_value_cr: 148.5,
        others_value_cr: 52.4,
        co_bid_count: 28,
        overlap_pct: 76,
      },
      {
        id: "c2",
        competitor_name: "MTAR Technologies Ltd.",
        competitor_type: "Large Enterprise",
        competitor_won_value_cr: 132.8,
        vendor_won_value_cr: 118.6,
        others_value_cr: 44.0,
        co_bid_count: 22,
        overlap_pct: 68,
      },
      {
        id: "c3",
        competitor_name: "L&T Defense & Heavy Engineering",
        competitor_type: "Large Enterprise",
        competitor_won_value_cr: 210.0,
        vendor_won_value_cr: 92.4,
        others_value_cr: 68.5,
        co_bid_count: 19,
        overlap_pct: 61,
      },
      {
        id: "c4",
        competitor_name: "Dynamatic Technologies Ltd.",
        competitor_type: "Large Enterprise",
        competitor_won_value_cr: 86.4,
        vendor_won_value_cr: 98.0,
        others_value_cr: 31.2,
        co_bid_count: 17,
        overlap_pct: 54,
      },
      {
        id: "c5",
        competitor_name: "Vikas Space Components LLP",
        competitor_type: "MSME",
        competitor_won_value_cr: 42.5,
        vendor_won_value_cr: 74.2,
        others_value_cr: 22.0,
        co_bid_count: 14,
        overlap_pct: 46,
      },
      {
        id: "c6",
        competitor_name: "MicroFab High-Tolerance Works",
        competitor_type: "MSME",
        competitor_won_value_cr: 28.0,
        vendor_won_value_cr: 58.6,
        others_value_cr: 18.4,
        co_bid_count: 11,
        overlap_pct: 38,
      },
    ],
    tender_history: [
      {
        tender_id: "th-101",
        reference_number: "VSSC/PUR/2026/T-089",
        title: "Precision 5-Axis CNC Machining of Titanium Alloy PSLV-C60 Stage-4 Gimbal Brackets",
        department: "Vikram Sarabhai Space Centre (VSSC)",
        center_code: "VSSC",
        status: "L1 STANDING",
        bid_amount_cr: 2.88,
        estimated_amount_cr: 3.20,
        rank: "L1 Rank",
        result: "Under Commercial Evaluation",
        primary_competitor: "Godrej Aerospace (L2 @ ₹3.02 Cr)",
        date: "2026-02-18",
      },
      {
        tender_id: "th-102",
        reference_number: "IPRC/MEC/2026/T-052",
        title: "Manufacture & Pressure Testing of Liquid Hydrogen (LH2) Cryogenic Regulating Valves",
        department: "ISRO Propulsion Complex (IPRC)",
        center_code: "IPRC",
        status: "EVALUATING",
        bid_amount_cr: 5.58,
        estimated_amount_cr: 6.20,
        rank: "L1 Standing",
        result: "Technical Envelope Passed",
        primary_competitor: "MTAR Technologies Ltd. (L2)",
        date: "2026-01-24",
      },
      {
        tender_id: "th-103",
        reference_number: "LPSC/HYD/2025/T-031",
        title: "High-Pressure Hydraulic Servo Actuator Units for Semi-Cryogenic Gimbal Vectoring",
        department: "Liquid Propulsion Systems Centre (LPSC)",
        center_code: "LPSC",
        status: "AWARDED",
        bid_amount_cr: 4.86,
        estimated_amount_cr: 5.40,
        rank: "L1 Awarded",
        result: "Awarded (PO Issued)",
        primary_competitor: "Dynamatic Technologies (L2 @ ₹5.15 Cr)",
        date: "2025-11-14",
      },
      {
        tender_id: "th-104",
        reference_number: "VSSC/PUR/2025/T-064",
        title: "GSLV Mk-III Liquid Stage Titanium Thrust Bracket Precision Fabrication Batch-8",
        department: "Vikram Sarabhai Space Centre (VSSC)",
        center_code: "VSSC",
        status: "AWARDED",
        bid_amount_cr: 18.40,
        estimated_amount_cr: 20.50,
        rank: "L1 Awarded",
        result: "Awarded (Delivered)",
        primary_competitor: "Godrej Aerospace (L2 @ ₹19.20 Cr)",
        date: "2025-09-02",
      },
      {
        tender_id: "th-105",
        reference_number: "URSC/MME/2025/T-082",
        title: "Spacecraft Structural Bus Mounting Flanges in Inconel 718 with CMM Inspection",
        department: "U R Rao Satellite Centre (URSC)",
        center_code: "URSC",
        status: "AWARDED",
        bid_amount_cr: 7.20,
        estimated_amount_cr: 8.00,
        rank: "L1 Awarded",
        result: "Awarded (PO Issued)",
        primary_competitor: "MicroFab Works (L2 @ ₹7.50 Cr)",
        date: "2025-07-19",
      },
      {
        tender_id: "th-106",
        reference_number: "SDSC/CIV/2025/T-041",
        title: "High-Pressure Gas Helium Manifold Piping Units for Second Launch Pad Refurbishment",
        department: "Satish Dhawan Space Centre (SDSC SHAR)",
        center_code: "SDSC",
        status: "DISCARDED",
        bid_amount_cr: 6.80,
        estimated_amount_cr: 7.00,
        rank: "L3 Rank",
        result: "Awarded to L&T Heavy Eng",
        primary_competitor: "L&T Heavy Engineering (L1 @ ₹6.10 Cr)",
        date: "2025-05-11",
      },
      {
        tender_id: "th-107",
        reference_number: "LPSC/CRYO/2025/T-012",
        title: "CE-20 Cryogenic Upper Stage Main Injector Manifold CNC Machining & Inspection",
        department: "Liquid Propulsion Systems Centre (LPSC)",
        center_code: "LPSC",
        status: "AWARDED",
        bid_amount_cr: 14.20,
        estimated_amount_cr: 15.80,
        rank: "L1 Awarded",
        result: "Awarded (Delivered)",
        primary_competitor: "MTAR Technologies (L2 @ ₹14.90 Cr)",
        date: "2025-03-08",
      },
    ],
  },

  "godrej-aerospace": {
    vendor_id: "godrej-aerospace",
    vendor_name: "Godrej Aerospace Division",
    short_code: "GODREJ",
    vendor_type: "Large Enterprise",
    category: "Vikas Engines, Cryogenic Thrust Chambers & Heavy Spacecraft Structures",
    headquarters: "Pirojshanagar, Vikhroli, Mumbai, Maharashtra 400079",
    established_year: 1985,
    gstin: "27AAACG0894D1Z2",
    avatar_bg: "bg-blue-500/20 border-blue-500/40 text-blue-400",
    avatar_text: "GA",
    is_verified_msme: false,
    insights: {
      total_bids: {
        awarded: 112,
        pending: 22,
        yet_to_open: 14,
        lost: 38,
      },
      total_value_cr: {
        awarded: 1840.5,
        pending: 310.0,
        yet_to_open: 195.0,
        lost: 480.2,
      },
    },
    top_organisations: [
      { org_name: "Liquid Propulsion Systems Centre (LPSC)", center_code: "LPSC", value_cr: 840.0, bids_count: 64, status: "awarded", share_pct: 45.6 },
      { org_name: "Vikram Sarabhai Space Centre (VSSC)", center_code: "VSSC", value_cr: 610.5, bids_count: 52, status: "awarded", share_pct: 33.2 },
      { org_name: "ISRO Propulsion Complex (IPRC)", center_code: "IPRC", value_cr: 240.0, bids_count: 28, status: "awarded", share_pct: 13.0 },
      { org_name: "U R Rao Satellite Centre (URSC)", center_code: "URSC", value_cr: 150.0, bids_count: 22, status: "won", share_pct: 8.2 },
    ],
    operating_centers: [
      { center_name: "LPSC Valiamala", center_code: "LPSC", location: "Valiamala", state: "Kerala", value_cr: 840.0, bids_count: 64, share_pct: 45.6 },
      { center_name: "VSSC Thiruvananthapuram", center_code: "VSSC", location: "Thiruvananthapuram", state: "Kerala", value_cr: 610.5, bids_count: 52, share_pct: 33.2 },
      { center_name: "IPRC Mahendragiri", center_code: "IPRC", location: "Mahendragiri", state: "Tamil Nadu", value_cr: 240.0, bids_count: 28, share_pct: 13.0 },
      { center_name: "URSC Bengaluru", center_code: "URSC", location: "Bengaluru", state: "Karnataka", value_cr: 150.0, bids_count: 22, share_pct: 8.2 },
    ],
    competitors: [
      {
        id: "gc1",
        competitor_name: "L&T Heavy Engineering",
        competitor_type: "Large Enterprise",
        competitor_won_value_cr: 980.0,
        vendor_won_value_cr: 1840.5,
        others_value_cr: 320.0,
        co_bid_count: 48,
        overlap_pct: 82,
      },
      {
        id: "gc2",
        competitor_name: "MTAR Technologies Ltd.",
        competitor_type: "Large Enterprise",
        competitor_won_value_cr: 640.0,
        vendor_won_value_cr: 1220.0,
        others_value_cr: 180.0,
        co_bid_count: 36,
        overlap_pct: 71,
      },
      {
        id: "gc3",
        competitor_name: "AeroPrecision India Ltd.",
        competitor_type: "MSME",
        competitor_won_value_cr: 342.8,
        vendor_won_value_cr: 610.5,
        others_value_cr: 110.0,
        co_bid_count: 28,
        overlap_pct: 58,
      },
      {
        id: "gc4",
        competitor_name: "Hindustan Aeronautics Ltd (Aerospace)",
        competitor_type: "Large Enterprise",
        competitor_won_value_cr: 520.0,
        vendor_won_value_cr: 840.0,
        others_value_cr: 140.0,
        co_bid_count: 24,
        overlap_pct: 51,
      },
      {
        id: "gc5",
        competitor_name: "Dynamatic Technologies Ltd.",
        competitor_type: "Large Enterprise",
        competitor_won_value_cr: 210.0,
        vendor_won_value_cr: 480.0,
        others_value_cr: 90.0,
        co_bid_count: 18,
        overlap_pct: 42,
      },
    ],
    tender_history: [
      {
        tender_id: "gh-1",
        reference_number: "LPSC/CRY/2025/T-102",
        title: "CE-20 Cryogenic Engine Regeneratively Cooled Thrust Chambers (Batch 12)",
        department: "Liquid Propulsion Systems Centre (LPSC)",
        center_code: "LPSC",
        status: "AWARDED",
        bid_amount_cr: 185.0,
        estimated_amount_cr: 200.0,
        rank: "L1 Awarded",
        result: "Awarded (Production Active)",
        primary_competitor: "MTAR Technologies (L2 @ ₹192.0 Cr)",
        date: "2025-12-10",
      },
      {
        tender_id: "gh-2",
        reference_number: "VSSC/PROP/2025/T-055",
        title: "GSLV Mk-III Vikas Engine Core Liquid Propellant Engine Stages Fabrication",
        department: "Vikram Sarabhai Space Centre (VSSC)",
        center_code: "VSSC",
        status: "AWARDED",
        bid_amount_cr: 340.0,
        estimated_amount_cr: 365.0,
        rank: "L1 Awarded",
        result: "Awarded",
        primary_competitor: "L&T Heavy Engineering (L2 @ ₹355.0 Cr)",
        date: "2025-09-18",
      },
      {
        tender_id: "gh-3",
        reference_number: "VSSC/PUR/2026/T-089",
        title: "Precision 5-Axis CNC Machining of Titanium Alloy PSLV-C60 Stage-4 Gimbal Brackets",
        department: "Vikram Sarabhai Space Centre (VSSC)",
        center_code: "VSSC",
        status: "EVALUATING",
        bid_amount_cr: 3.02,
        estimated_amount_cr: 3.20,
        rank: "L2 Standing",
        result: "Commercial Evaluation Active",
        primary_competitor: "AeroPrecision India Ltd. (L1 @ ₹2.88 Cr)",
        date: "2026-02-18",
      },
    ],
  },

  "mtar-technologies": {
    vendor_id: "mtar-technologies",
    vendor_name: "MTAR Technologies Ltd.",
    short_code: "MTAR",
    vendor_type: "Large Enterprise",
    category: "Cryogenic Engines, Precision Valves & Electro-Pneumatics",
    headquarters: "Balanagar, Hyderabad, Telangana 500037",
    established_year: 1970,
    gstin: "36AABCM4582H1ZT",
    avatar_bg: "bg-purple-500/20 border-purple-500/40 text-purple-400",
    avatar_text: "MT",
    is_verified_msme: false,
    insights: {
      total_bids: {
        awarded: 84,
        pending: 16,
        yet_to_open: 11,
        lost: 29,
      },
      total_value_cr: {
        awarded: 1120.4,
        pending: 215.0,
        yet_to_open: 140.0,
        lost: 360.8,
      },
    },
    top_organisations: [
      { org_name: "Liquid Propulsion Systems Centre (LPSC)", center_code: "LPSC", value_cr: 520.0, bids_count: 46, status: "awarded", share_pct: 46.4 },
      { org_name: "ISRO Propulsion Complex (IPRC)", center_code: "IPRC", value_cr: 340.4, bids_count: 38, status: "awarded", share_pct: 30.4 },
      { org_name: "Vikram Sarabhai Space Centre (VSSC)", center_code: "VSSC", value_cr: 210.0, bids_count: 28, status: "awarded", share_pct: 18.7 },
      { org_name: "Other Space Facilities", center_code: "OTHER", value_cr: 50.0, bids_count: 12, status: "won", share_pct: 4.5 },
    ],
    operating_centers: [
      { center_name: "LPSC Valiamala", center_code: "LPSC", location: "Valiamala", state: "Kerala", value_cr: 520.0, bids_count: 46, share_pct: 46.4 },
      { center_name: "IPRC Mahendragiri", center_code: "IPRC", location: "Mahendragiri", state: "Tamil Nadu", value_cr: 340.4, bids_count: 38, share_pct: 30.4 },
      { center_name: "VSSC Thiruvananthapuram", center_code: "VSSC", location: "Thiruvananthapuram", state: "Kerala", value_cr: 210.0, bids_count: 28, share_pct: 18.7 },
      { center_name: "SDSC SHAR Sriharikota", center_code: "SDSC", location: "Sriharikota", state: "Andhra Pradesh", value_cr: 50.0, bids_count: 12, share_pct: 4.5 },
    ],
    competitors: [
      {
        id: "mc1",
        competitor_name: "Godrej Aerospace Division",
        competitor_type: "Large Enterprise",
        competitor_won_value_cr: 1180.0,
        vendor_won_value_cr: 1120.4,
        others_value_cr: 240.0,
        co_bid_count: 42,
        overlap_pct: 78,
      },
      {
        id: "mc2",
        competitor_name: "L&T Heavy Engineering",
        competitor_type: "Large Enterprise",
        competitor_won_value_cr: 840.0,
        vendor_won_value_cr: 780.0,
        others_value_cr: 190.0,
        co_bid_count: 31,
        overlap_pct: 65,
      },
      {
        id: "mc3",
        competitor_name: "AeroPrecision India Ltd.",
        competitor_type: "MSME",
        competitor_won_value_cr: 342.8,
        vendor_won_value_cr: 520.0,
        others_value_cr: 85.0,
        co_bid_count: 22,
        overlap_pct: 54,
      },
      {
        id: "mc4",
        competitor_name: "Flowline Fluid Controls India",
        competitor_type: "MSME",
        competitor_won_value_cr: 140.0,
        vendor_won_value_cr: 340.4,
        others_value_cr: 60.0,
        co_bid_count: 16,
        overlap_pct: 44,
      },
      {
        id: "mc5",
        competitor_name: "Dynamatic Technologies Ltd.",
        competitor_type: "Large Enterprise",
        competitor_won_value_cr: 180.0,
        vendor_won_value_cr: 280.0,
        others_value_cr: 55.0,
        co_bid_count: 14,
        overlap_pct: 39,
      },
    ],
    tender_history: [
      {
        tender_id: "mh-1",
        reference_number: "IPRC/MEC/2026/T-052",
        title: "Manufacture & Pressure Testing of Liquid Hydrogen (LH2) Cryogenic Regulating Valves",
        department: "ISRO Propulsion Complex (IPRC)",
        center_code: "IPRC",
        status: "EVALUATING",
        bid_amount_cr: 5.72,
        estimated_amount_cr: 6.20,
        rank: "L2 Standing",
        result: "Technical Evaluation Passed",
        primary_competitor: "AeroPrecision India Ltd. (L1 @ ₹5.58 Cr)",
        date: "2026-01-24",
      },
      {
        tender_id: "mh-2",
        reference_number: "IPRC/MEC/2025/T-044",
        title: "Cryogenic Valve Inconel 718 Superfinished Spindles for Semi-Cryo Engine SCE-200",
        department: "ISRO Propulsion Complex (IPRC)",
        center_code: "IPRC",
        status: "AWARDED",
        bid_amount_cr: 54.0,
        estimated_amount_cr: 58.0,
        rank: "L1 Awarded",
        result: "Awarded (Production Active)",
        primary_competitor: "AeroPrecision India (L2 @ ₹56.0 Cr)",
        date: "2025-03-15",
      },
    ],
  },

  "ananth-technologies": {
    vendor_id: "ananth-technologies",
    vendor_name: "Ananth Technologies Ltd.",
    short_code: "ATL",
    vendor_type: "MSME",
    category: "Space Electronics, RF/Microwave Modules & Satellite Telemetry",
    headquarters: "Whitefield, Bengaluru, Karnataka 560066",
    established_year: 1992,
    gstin: "29AABCA9918F1Z8",
    avatar_bg: "bg-cyan-500/20 border-cyan-500/40 text-cyan-400",
    avatar_text: "AT",
    is_verified_msme: true,
    insights: {
      total_bids: {
        awarded: 64,
        pending: 12,
        yet_to_open: 7,
        lost: 19,
      },
      total_value_cr: {
        awarded: 620.5,
        pending: 110.0,
        yet_to_open: 65.0,
        lost: 180.4,
      },
    },
    top_organisations: [
      { org_name: "U R Rao Satellite Centre (URSC)", center_code: "URSC", value_cr: 280.5, bids_count: 42, status: "awarded", share_pct: 45.2 },
      { org_name: "Space Applications Centre (SAC)", center_code: "SAC", value_cr: 210.0, bids_count: 34, status: "awarded", share_pct: 33.8 },
      { org_name: "National Remote Sensing Centre (NRSC)", center_code: "NRSC", value_cr: 90.0, bids_count: 18, status: "awarded", share_pct: 14.5 },
      { org_name: "Other Space Centers", center_code: "OTHER", value_cr: 40.0, bids_count: 8, status: "bid", share_pct: 6.5 },
    ],
    operating_centers: [
      { center_name: "URSC Bengaluru", center_code: "URSC", location: "Bengaluru", state: "Karnataka", value_cr: 280.5, bids_count: 42, share_pct: 45.2 },
      { center_name: "SAC Ahmedabad", center_code: "SAC", location: "Ahmedabad", state: "Gujarat", value_cr: 210.0, bids_count: 34, share_pct: 33.8 },
      { center_name: "NRSC Hyderabad", center_code: "NRSC", location: "Hyderabad", state: "Telangana", value_cr: 90.0, bids_count: 18, share_pct: 14.5 },
      { center_name: "SDSC SHAR Sriharikota", center_code: "SDSC", location: "Sriharikota", state: "Andhra Pradesh", value_cr: 40.0, bids_count: 8, share_pct: 6.5 },
    ],
    competitors: [
      {
        id: "ac1",
        competitor_name: "Bharat Electronics Ltd (BEL)",
        competitor_type: "Large Enterprise",
        competitor_won_value_cr: 540.0,
        vendor_won_value_cr: 620.5,
        others_value_cr: 140.0,
        co_bid_count: 38,
        overlap_pct: 79,
      },
      {
        id: "ac2",
        competitor_name: "Centum Electronics Space Systems",
        competitor_type: "MSME",
        competitor_won_value_cr: 320.0,
        vendor_won_value_cr: 440.0,
        others_value_cr: 90.0,
        co_bid_count: 26,
        overlap_pct: 64,
      },
      {
        id: "ac3",
        competitor_name: "Astra Microwave Products Ltd.",
        competitor_type: "Large Enterprise",
        competitor_won_value_cr: 390.0,
        vendor_won_value_cr: 380.0,
        others_value_cr: 80.0,
        co_bid_count: 22,
        overlap_pct: 58,
      },
      {
        id: "ac4",
        competitor_name: "Mistral Solutions Pvt Ltd",
        competitor_type: "MSME",
        competitor_won_value_cr: 180.0,
        vendor_won_value_cr: 260.0,
        others_value_cr: 50.0,
        co_bid_count: 18,
        overlap_pct: 47,
      },
    ],
    tender_history: [
      {
        tender_id: "ah-1",
        reference_number: "SAC/ELE/2026/T-047",
        title: "Supply of X-Band Solid State Power Amplifiers (SSPA) & Waveguide Assemblies for SAR",
        department: "Space Applications Centre (SAC)",
        center_code: "SAC",
        status: "AWARDED",
        bid_amount_cr: 41.2,
        estimated_amount_cr: 45.0,
        rank: "L1 Awarded",
        result: "Awarded",
        primary_competitor: "Centum Electronics (L2 @ ₹42.8 Cr)",
        date: "2026-01-15",
      },
    ],
  },

  "lt-defense": {
    vendor_id: "lt-defense",
    vendor_name: "L&T Heavy Engineering & Aerospace",
    short_code: "L&T",
    vendor_type: "Large Enterprise",
    category: "Solid Rocket Motor Segments, Launch Pads & Heavy Cryo Tanks",
    headquarters: "Powai, Mumbai, Maharashtra 400072",
    established_year: 1938,
    gstin: "27AAACL0149A1ZH",
    avatar_bg: "bg-amber-500/20 border-amber-500/40 text-amber-400",
    avatar_text: "LT",
    is_verified_msme: false,
    insights: {
      total_bids: {
        awarded: 146,
        pending: 28,
        yet_to_open: 18,
        lost: 44,
      },
      total_value_cr: {
        awarded: 3240.0,
        pending: 580.0,
        yet_to_open: 310.0,
        lost: 720.0,
      },
    },
    top_organisations: [
      { org_name: "Vikram Sarabhai Space Centre (VSSC)", center_code: "VSSC", value_cr: 1420.0, bids_count: 82, status: "awarded", share_pct: 43.8 },
      { org_name: "Satish Dhawan Space Centre (SDSC SHAR)", center_code: "SDSC", value_cr: 980.0, bids_count: 54, status: "awarded", share_pct: 30.2 },
      { org_name: "Liquid Propulsion Systems Centre (LPSC)", center_code: "LPSC", value_cr: 540.0, bids_count: 36, status: "awarded", share_pct: 16.7 },
      { org_name: "ISRO Propulsion Complex (IPRC)", center_code: "IPRC", value_cr: 300.0, bids_count: 20, status: "won", share_pct: 9.3 },
    ],
    operating_centers: [
      { center_name: "VSSC Thiruvananthapuram", center_code: "VSSC", location: "Thiruvananthapuram", state: "Kerala", value_cr: 1420.0, bids_count: 82, share_pct: 43.8 },
      { center_name: "SDSC SHAR Sriharikota", center_code: "SDSC", location: "Sriharikota", state: "Andhra Pradesh", value_cr: 980.0, bids_count: 54, share_pct: 30.2 },
      { center_name: "LPSC Valiamala", center_code: "LPSC", location: "Valiamala", state: "Kerala", value_cr: 540.0, bids_count: 36, share_pct: 16.7 },
      { center_name: "IPRC Mahendragiri", center_code: "IPRC", location: "Mahendragiri", state: "Tamil Nadu", value_cr: 300.0, bids_count: 20, share_pct: 9.3 },
    ],
    competitors: [
      {
        id: "lc1",
        competitor_name: "Godrej Aerospace Division",
        competitor_type: "Large Enterprise",
        competitor_won_value_cr: 1840.5,
        vendor_won_value_cr: 3240.0,
        others_value_cr: 480.0,
        co_bid_count: 56,
        overlap_pct: 84,
      },
      {
        id: "lc2",
        competitor_name: "MTAR Technologies Ltd.",
        competitor_type: "Large Enterprise",
        competitor_won_value_cr: 1120.4,
        vendor_won_value_cr: 1680.0,
        others_value_cr: 290.0,
        co_bid_count: 38,
        overlap_pct: 69,
      },
      {
        id: "lc3",
        competitor_name: "AeroPrecision India Ltd.",
        competitor_type: "MSME",
        competitor_won_value_cr: 342.8,
        vendor_won_value_cr: 840.0,
        others_value_cr: 140.0,
        co_bid_count: 26,
        overlap_pct: 52,
      },
    ],
    tender_history: [
      {
        tender_id: "lh-1",
        reference_number: "SDSC/CIV/2026/T-019",
        title: "Construction of Modular Class 1000 Cleanroom & Environmental Testing Facility",
        department: "Satish Dhawan Space Centre (SDSC SHAR)",
        center_code: "SDSC",
        status: "L1 STANDING",
        bid_amount_cr: 129.5,
        estimated_amount_cr: 140.0,
        rank: "L1 Rank",
        result: "Under Evaluation",
        primary_competitor: "Thermax Clean Systems (L2 @ ₹134.0 Cr)",
        date: "2026-02-10",
      },
    ],
  },
};

export const ALL_VENDORS_LIST = Object.values(VENDOR_PROFILES_STORE);
