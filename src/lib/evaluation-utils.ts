import type { BidEvaluation, VendorProfile } from "@/lib/types/database";

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  isCompleted?: boolean;
}

export function getRequiredDocuments(
  evaluation: BidEvaluation,
  profile: VendorProfile
): ChecklistItem[] {
  if (evaluation.required_documents && evaluation.required_documents.length > 0) {
    return evaluation.required_documents.map(doc => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      isCompleted: doc.status === "ready",
    }));
  }

  const recs = evaluation.recommendations?.length > 0
    ? evaluation.recommendations
    : [
        "Include valid Udyam Registration Certificate with Bid Envelope-1 to claim 100% EMD waiver under GFR 170(i).",
        "Attach CMM Calibration & Tolerance Repeatability reports demonstrating compliance with ±5 µm linear machining.",
        "Provide AS9100D Rev D accreditation certificate and NABL-certified material test certificates (MTCs).",
        "Prepare cleanroom assembly procedure and Stage-4 Radiographic / Ultrasonic NDT inspection plan.",
      ];

  return recs.map((rec, index) => {
    let title = `Document ${index + 1}`;
    if (rec.includes("Udyam Registration")) title = "Udyam Registration Certificate";
    else if (rec.includes("CMM Calibration") || rec.includes("Tolerance")) title = "CMM Calibration & Tolerance Reports";
    else if (rec.includes("AS9100D") || rec.includes("NABL")) title = "Quality Accreditations & MTCs";
    else if (rec.includes("cleanroom")) title = "Cleanroom Assembly & NDT Plan";

    let isCompleted = false;
    if (title === "Udyam Registration Certificate" && profile.msme_registered) isCompleted = true;
    if (title === "Quality Accreditations & MTCs" && profile.certifications?.includes("AS9100D")) isCompleted = true;

    return {
      id: `doc-gen-${index}`,
      title,
      description: rec,
      isCompleted,
    };
  });
}

export function getWinProbability(bidFitScore: number) {
  // Using 50 for Historical Competitiveness and Price Positioning as neutral fallbacks when historical data is unavailable
  const historicalCompetitiveness = 50; 
  const pricePositioning = 50;
  
  const score = Math.round((0.5 * bidFitScore) + (0.3 * historicalCompetitiveness) + (0.2 * pricePositioning));
  
  let label = "LOW PROBABILITY";
  let color = "text-red-400 bg-red-500/10 border-red-500/20";
  
  if (score > 75) {
    label = "HIGH PROBABILITY";
    color = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  } else if (score >= 50) {
    label = "MEDIUM PROBABILITY";
    color = "text-amber-400 bg-amber-500/10 border-amber-500/20";
  }
  
  return { score, label, color };
}
