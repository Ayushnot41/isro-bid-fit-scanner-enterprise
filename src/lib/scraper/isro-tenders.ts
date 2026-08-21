import type { ScrapedTender } from "@/lib/types/database";

export interface ScrapedTenderRaw {
  reference_number: string;
  title: string;
  description: string;
  issuing_center: string;
  center_code: "VSSC" | "URSC" | "SAC" | "SDSC" | "IPRC" | "NRSC" | "HSFC" | "LPSC";
  closing_date: string;
  estimated_value_inr: number;
  emd_amount_inr: number;
  category: string;
  required_certifications: string[];
  required_tolerances: {
    linear_tolerance_mm?: number;
    surface_roughness_ra_um?: number;
    cleanroom_class?: string;
    cnc_axis_count?: number;
  };
  minimum_turnover_inr: number;
  required_capabilities: string[];
  source_url: string;
}

export const MOCK_ISRO_TENDERS: ScrapedTenderRaw[] = [
  {
    reference_number: "VSSC/PUR/2026/T-089",
    title: "Precision 5-Axis CNC Machining of Titanium Alloy PSLV-C60 Stage-4 Gimbal Brackets",
    description: "High-precision fabrication and inspection of Grade 5 Ti-6Al-4V aerospace mounting brackets for PSLV Stage-4 control actuators. 100% radiographic & ultrasonic inspection required.",
    issuing_center: "Vikram Sarabhai Space Centre (VSSC), Thiruvananthapuram",
    center_code: "VSSC",
    closing_date: "2026-09-18T16:00:00+05:30",
    estimated_value_inr: 32000000,
    emd_amount_inr: 640000,
    category: "Propulsion & Precision Machining",
    required_certifications: ["AS9100D", "ISO9001:2015", "NABL"],
    required_tolerances: {
      linear_tolerance_mm: 0.005,
      surface_roughness_ra_um: 0.4,
      cnc_axis_count: 5,
    },
    minimum_turnover_inr: 10000000,
    required_capabilities: [
      "5-Axis CNC Machining",
      "Titanium Aerospace Fabrication",
      "CMM Inspection",
      "Non-Destructive Testing (NDT)",
    ],
    source_url: "https://eproc.isro.gov.in/tender/VSSC-PUR-2026-T-089",
  },
  {
    reference_number: "URSC/MME/2026/T-104",
    title: "Fabrication of Lightweight Honeycomb Carbon Fiber Bus Structure for Oceansat-4",
    description: "Autoclave curing, bonding, and CNC drilling of CFRP honeycomb sandwich panels for primary earth-observation satellite structure. Class 100,000 cleanroom assembly mandatory.",
    issuing_center: "U R Rao Satellite Centre (URSC), Bengaluru",
    center_code: "URSC",
    closing_date: "2026-09-28T17:00:00+05:30",
    estimated_value_inr: 85000000,
    emd_amount_inr: 1700000,
    category: "Satellite Bus & Composite Structures",
    required_certifications: ["AS9100D", "ISO9001:2015", "ISO 14644-1"],
    required_tolerances: {
      linear_tolerance_mm: 0.01,
      cleanroom_class: "ISO Class 7",
    },
    minimum_turnover_inr: 25000000,
    required_capabilities: [
      "Carbon Fiber Composite Bonding",
      "Autoclave Curing",
      "Cleanroom Assembly (Class 10k)",
      "Vibration Proofing",
    ],
    source_url: "https://eproc.isro.gov.in/tender/URSC-MME-2026-T-104",
  },
  {
    reference_number: "SAC/ELE/2026/T-047",
    title: "Supply of X-Band Solid State Power Amplifiers (SSPA) & Waveguide Assemblies for SAR",
    description: "Design, hermetic packaging, and environmental screening of space-qualified GaAs/GaN SSPA modules operating in 8-12 GHz band. Compliant to MIL-STD-883 screening.",
    issuing_center: "Space Applications Centre (SAC), Ahmedabad",
    center_code: "SAC",
    closing_date: "2026-10-05T15:00:00+05:30",
    estimated_value_inr: 45000000,
    emd_amount_inr: 900000,
    category: "RF, Microwave & Payload Electronics",
    required_certifications: ["ISO9001:2015", "IPC-A-610 Class 3", "NABL"],
    required_tolerances: {
      linear_tolerance_mm: 0.02,
      cleanroom_class: "ISO Class 6",
    },
    minimum_turnover_inr: 15000000,
    required_capabilities: [
      "RF / Microwave PCB Assembly",
      "Hermetic Sealing",
      "Environmental Stress Screening (ESS)",
      "Waveguide Manufacturing",
    ],
    source_url: "https://eproc.isro.gov.in/tender/SAC-ELE-2026-T-047",
  },
  {
    reference_number: "IPRC/MEC/2026/T-052",
    title: "Manufacture & Pressure Testing of Liquid Hydrogen (LH2) Cryogenic Regulating Valves",
    description: "Super-finished Inconel 718 and SS316L valve assemblies for GSLV Mk-III (LVM3) CE-20 cryogenic upper stage. Cryogenic leak proof testing at 20K with Helium mass spectrometer.",
    issuing_center: "ISRO Propulsion Complex (IPRC), Mahendragiri",
    center_code: "IPRC",
    closing_date: "2026-10-15T16:30:00+05:30",
    estimated_value_inr: 62000000,
    emd_amount_inr: 1240000,
    category: "Cryogenics & Propulsion Systems",
    required_certifications: ["AS9100D", "ASME Section VIII", "ISO9001:2015"],
    required_tolerances: {
      linear_tolerance_mm: 0.003,
      surface_roughness_ra_um: 0.2,
      cnc_axis_count: 5,
    },
    minimum_turnover_inr: 18000000,
    required_capabilities: [
      "Cryogenic Valve Manufacturing",
      "Inconel Precision Machining",
      "Helium Leak Testing",
      "Electropolishing",
    ],
    source_url: "https://eproc.isro.gov.in/tender/IPRC-MEC-2026-T-052",
  },
  {
    reference_number: "SDSC/CIV/2026/T-019",
    title: "Construction of Modular Class 1000 Cleanroom & Environmental Testing Facility",
    description: "Turnkey HVAC, HEPA filtration, epoxy flooring, and humidity control system for Gaganyaan Crew Module payload preparation bay.",
    issuing_center: "Satish Dhawan Space Centre (SDSC SHAR), Sriharikota",
    center_code: "SDSC",
    closing_date: "2026-09-25T14:00:00+05:30",
    estimated_value_inr: 140000000,
    emd_amount_inr: 2800000,
    category: "Cleanrooms & Launch Infrastructure",
    required_certifications: ["ISO9001:2015", "ISO 14644-1"],
    required_tolerances: {
      cleanroom_class: "ISO Class 5",
    },
    minimum_turnover_inr: 40000000,
    required_capabilities: [
      "HVAC Cleanroom Engineering",
      "HEPA Air Filtration",
      "BMS Automation",
      "Industrial Epoxy Coating",
    ],
    source_url: "https://eproc.isro.gov.in/tender/SDSC-CIV-2026-T-019",
  },
  {
    reference_number: "LPSC/HYD/2026/T-031",
    title: "High-Pressure Hydraulic Servo Actuator Units for Semi-Cryogenic Engine Thrust Vectoring",
    description: "Electro-hydraulic servo actuators with integrated LVDT position feedback for SCE-200 engine gimbal control. High fatigue endurance testing mandatory.",
    issuing_center: "Liquid Propulsion Systems Centre (LPSC), Valiamala",
    center_code: "LPSC",
    closing_date: "2026-10-22T16:00:00+05:30",
    estimated_value_inr: 54000000,
    emd_amount_inr: 1080000,
    category: "Thrust Vectoring & Hydraulics",
    required_certifications: ["AS9100D", "ISO9001:2015", "NABL"],
    required_tolerances: {
      linear_tolerance_mm: 0.004,
      surface_roughness_ra_um: 0.2,
    },
    minimum_turnover_inr: 16000000,
    required_capabilities: [
      "Servo Actuator Assembly",
      "Precision Honing & Lapping",
      "Hydraulic Test Rig Calibration",
      "Cleanroom Packaging",
    ],
    source_url: "https://eproc.isro.gov.in/tender/LPSC-HYD-2026-T-031",
  },
];

/**
 * Simulates WebCMD scraping pipeline for ISRO e-Procurement Portal (eproc.isro.gov.in)
 */
export async function scrapeISROTenders(): Promise<ScrapedTenderRaw[]> {
  return MOCK_ISRO_TENDERS;
}

export function transformToTenderInsert(
  raw: ScrapedTenderRaw
): Omit<ScrapedTender, "id" | "scraped_at"> {
  return {
    reference_number: raw.reference_number,
    title: raw.title,
    description: raw.description,
    issuing_center: raw.issuing_center,
    center_code: raw.center_code,
    closing_date: raw.closing_date,
    opening_date: null,
    estimated_value_inr: raw.estimated_value_inr,
    emd_amount_inr: raw.emd_amount_inr,
    category: raw.category,
    required_certifications: raw.required_certifications,
    required_tolerances: raw.required_tolerances,
    minimum_turnover_inr: raw.minimum_turnover_inr,
    required_capabilities: raw.required_capabilities,
    source_url: raw.source_url,
    pdf_storage_path: null,
    raw_metadata: { raw },
    is_active: true,
  };
}
