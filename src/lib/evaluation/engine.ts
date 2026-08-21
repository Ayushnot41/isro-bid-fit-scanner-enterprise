import type { VendorProfile, ScrapedTender, BidEvaluation, ToleranceComparison } from "@/lib/types/database";

interface ScoringWeights {
  certifications: number;
  tolerances: number;
  msme: number;
  turnover: number;
  capabilities: number;
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  certifications: 0.30,
  tolerances: 0.25,
  msme: 0.15,
  turnover: 0.15,
  capabilities: 0.15,
};

function normalizeText(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function scoreCertifications(
  vendorCerts: string[],
  requiredCerts: string[]
): { score: number; missing: string[]; matched: string[] } {
  if (!requiredCerts || requiredCerts.length === 0) {
    return { score: 100, missing: [], matched: [] };
  }

  const vendorNorm = (vendorCerts || []).map(normalizeText);
  const missing: string[] = [];
  const matched: string[] = [];

  for (const cert of requiredCerts) {
    const certNorm = normalizeText(cert);
    if (vendorNorm.some((v) => v.includes(certNorm) || certNorm.includes(v))) {
      matched.push(cert);
    } else {
      missing.push(cert);
    }
  }

  const score = (matched.length / requiredCerts.length) * 100;
  return {
    score: Math.round(score * 100) / 100,
    missing,
    matched,
  };
}

function scoreTolerances(
  vendorTol: VendorProfile["mechanical_tolerances"] = {},
  requiredTol: ScrapedTender["required_tolerances"] = {}
): { score: number; met: boolean; breakdown: ToleranceComparison[] } {
  const breakdown: ToleranceComparison[] = [];
  let totalChecks = 0;
  let passedChecks = 0;

  // Linear tolerance check (smaller is tighter/better)
  if (requiredTol?.linear_tolerance_mm !== undefined) {
    totalChecks++;
    const vLinear = vendorTol?.linear_tolerance_mm ?? 0.02;
    const rLinear = requiredTol.linear_tolerance_mm;
    const isMet = vLinear <= rLinear;
    if (isMet) passedChecks++;

    breakdown.push({
      parameter: "Linear Machining Tolerance",
      required: `±${(rLinear * 1000).toFixed(0)} µm (±${rLinear}mm)`,
      offered: `±${(vLinear * 1000).toFixed(0)} µm (±${vLinear}mm)`,
      status: vLinear < rLinear ? "exceeded" : isMet ? "met" : "gap",
      score: isMet ? 100 : Math.max(20, Math.round((rLinear / vLinear) * 80)),
    });
  }

  // Surface Roughness Ra
  if (requiredTol?.surface_roughness_ra_um !== undefined) {
    totalChecks++;
    const vRa = vendorTol?.surface_roughness_ra_um ?? 0.8;
    const rRa = requiredTol.surface_roughness_ra_um;
    const isMet = vRa <= rRa;
    if (isMet) passedChecks++;

    breakdown.push({
      parameter: "Surface Roughness (Ra)",
      required: `Ra ≤ ${rRa} µm`,
      offered: `Ra ${vRa} µm`,
      status: vRa < rRa ? "exceeded" : isMet ? "met" : "gap",
      score: isMet ? 100 : Math.max(30, Math.round((rRa / vRa) * 85)),
    });
  }

  // CNC Axis count
  if (requiredTol?.cnc_axis_count !== undefined) {
    totalChecks++;
    const vAxis = vendorTol?.cnc_axis_count ?? 3;
    const rAxis = requiredTol.cnc_axis_count;
    const isMet = vAxis >= rAxis;
    if (isMet) passedChecks++;

    breakdown.push({
      parameter: "CNC Simultaneous Axis Count",
      required: `${rAxis}-Axis Simultaneous`,
      offered: `${vAxis}-Axis Machine Available`,
      status: vAxis > rAxis ? "exceeded" : isMet ? "met" : "gap",
      score: isMet ? 100 : 40,
    });
  }

  // Cleanroom Class
  if (requiredTol?.cleanroom_class) {
    totalChecks++;
    const vClean = vendorTol?.cleanroom_class ?? "ISO Class 8 / Unclassified";
    const rClean = requiredTol.cleanroom_class;
    const isMet = vClean.toLowerCase().includes(rClean.toLowerCase().replace(/[^a-z0-9]/g, ""));
    if (isMet) passedChecks++;

    breakdown.push({
      parameter: "Cleanroom Assembly Standard",
      required: rClean,
      offered: vClean,
      status: isMet ? "met" : "gap",
      score: isMet ? 100 : 50,
    });
  }

  if (totalChecks === 0) {
    return { score: 100, met: true, breakdown: [] };
  }

  const score = Math.round((passedChecks / totalChecks) * 100);
  return {
    score,
    met: passedChecks === totalChecks,
    breakdown,
  };
}

function scoreMSME(vendor: VendorProfile): { score: number; waivers: string[]; citations: Array<{ clause: string; title: string; note: string }> } {
  const waivers: string[] = [];
  const citations: Array<{ clause: string; title: string; note: string }> = [];

  if (!vendor.msme_registered) {
    return {
      score: 45,
      waivers: [],
      citations: [
        {
          clause: "Public Procurement Policy 2012 (MoMSME)",
          title: "Standard Bid Guarantee Requirement",
          note: "General vendors must submit 100% Earned Money Deposit (EMD) with no price relaxation.",
        },
      ],
    };
  }

  let score = 85;
  waivers.push("100% Earnest Money Deposit (EMD) Exemption");
  citations.push({
    clause: "Rule 170(i) of GFR 2017 & MoMSME Order",
    title: "EMD & Tender Fee Waiver",
    note: "Micro and Small Enterprises (MSEs) registered with Udyam are exempted from submission of Bid Security / EMD.",
  });

  if (vendor.msme_category === "micro" || vendor.msme_category === "small") {
    waivers.push("Relaxation of Prior Turnover & Experience Criteria");
    waivers.push("25% Purchase Preference (L1 + 15% Band Sharing)");
    score += 10;
    citations.push({
      clause: "DoP&T / Dept of Expenditure O.M. F.20/2/2014-PPD",
      title: "Prior Experience & Turnover Waiver",
      note: "Procuring entities can relax condition of prior turnover and prior experience in all public procurements for MSEs.",
    });
  }

  if (vendor.msme_udyam_number) {
    waivers.push("Verified Udyam Portal Integration (Direct Validation)");
    score += 5;
  }

  return {
    score: Math.min(score, 100),
    waivers,
    citations,
  };
}

function scoreTurnover(vendorTurnover: number | null, minimumRequired: number | null): number {
  if (!minimumRequired || minimumRequired === 0) return 100;
  if (!vendorTurnover || vendorTurnover === 0) return 10;

  const ratio = vendorTurnover / minimumRequired;
  if (ratio >= 2.0) return 100;
  if (ratio >= 1.2) return 92;
  if (ratio >= 1.0) return 85;
  if (ratio >= 0.75) return 65;
  if (ratio >= 0.5) return 40;
  return 20;
}

function scoreCapabilities(
  vendorCapabilities: string[] = [],
  requiredCapabilities: string[] = []
): { score: number; matched: string[]; gaps: string[] } {
  if (!requiredCapabilities || requiredCapabilities.length === 0) {
    return { score: 100, matched: [], gaps: [] };
  }

  const vCapsNorm = (vendorCapabilities || []).map(normalizeText);
  const matched: string[] = [];
  const gaps: string[] = [];

  for (const req of requiredCapabilities) {
    const reqNorm = normalizeText(req);
    if (vCapsNorm.some((vc) => vc.includes(reqNorm) || reqNorm.includes(vc))) {
      matched.push(req);
    } else {
      gaps.push(req);
    }
  }

  const score = Math.round((matched.length / requiredCapabilities.length) * 100);
  return { score, matched, gaps };
}

export function evaluateBidFit(
  vendor: VendorProfile,
  tender: ScrapedTender,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): BidEvaluation {
  // 1. Certifications
  const certResult = scoreCertifications(vendor.certifications, tender.required_certifications);

  // 2. Tolerances
  const tolResult = scoreTolerances(vendor.mechanical_tolerances, tender.required_tolerances);

  // 3. MSME
  const msmeResult = scoreMSME(vendor);

  // 4. Turnover
  const turnoverScore = scoreTurnover(vendor.annual_turnover_inr, tender.minimum_turnover_inr);

  // 5. Capabilities
  const capResult = scoreCapabilities(vendor.manufacturing_capabilities, tender.required_capabilities);

  // Weighted score
  const finalScore = Math.round(
    certResult.score * weights.certifications +
    tolResult.score * weights.tolerances +
    msmeResult.score * weights.msme +
    turnoverScore * weights.turnover +
    capResult.score * weights.capabilities
  );

  const recommendations: string[] = [];
  const strengths: string[] = [];
  const riskFactors: string[] = [];
  const actionableSteps: string[] = [];

  if (certResult.missing.length > 0) {
    recommendations.push(`Acquire or partner for certifications: ${certResult.missing.join(", ")}`);
    riskFactors.push(`Missing mandatory space certifications: ${certResult.missing.join(", ")}`);
    actionableSteps.push(`Initiate fast-track third-party NABL calibration or AS9100 gap audit.`);
  } else {
    strengths.push("All mandatory quality and aerospace certifications are 100% compliant.");
  }

  if (tolResult.met) {
    strengths.push("Mechanical CNC & surface roughness capabilities meet or exceed ISRO specifications.");
  } else {
    recommendations.push("Sub-contract or upgrade 5-axis / precision lapping to close mechanical tolerance gap.");
    riskFactors.push("Reported machining tolerance deviates from the tender's strict micro-precision limit.");
  }

  if (vendor.msme_registered) {
    strengths.push(`Eligible for ₹${((tender.emd_amount_inr || 0) / 100000).toFixed(2)} Lakhs EMD exemption under MSME Public Procurement Policy.`);
  } else {
    recommendations.push("Register on MSME Udyam Portal to avail ₹0 EMD tender submission and price-matching band benefits.");
  }

  if (finalScore >= 80) {
    recommendations.unshift("High Bid-Fit: Prime candidate for technical qualification. Recommend proceeding with commercial proposal.");
    actionableSteps.push("Download complete ISRO RFP and compile technical bid envelope.");
  } else if (finalScore >= 60) {
    recommendations.unshift("Moderate Bid-Fit: Viable with consortium or sub-contracting support for specialized processes.");
  } else {
    recommendations.unshift("Low Bid-Fit: Critical gaps in aerospace compliance or manufacturing tolerances detected.");
  }

  return {
    id: crypto.randomUUID(),
    user_id: vendor.user_id,
    tender_id: tender.id,
    tender_reference: tender.reference_number,
    tender_title: tender.title,
    tender_source_url: tender.source_url,
    issuing_center: tender.issuing_center,
    tender_mechanical_tolerances_met: tolResult.met,
    missing_certifications: certResult.missing,
    msme_waivers_applied: msmeResult.waivers,
    final_bid_fit_score: finalScore,
    certification_score: certResult.score,
    tolerance_score: tolResult.score,
    msme_score: msmeResult.score,
    turnover_score: turnoverScore,
    capability_score: capResult.score,
    evaluation_details: {
      tolerances_breakdown: tolResult.breakdown,
      citations: msmeResult.citations,
      strengths,
      risk_factors: riskFactors,
      actionable_steps: actionableSteps,
    },
    recommendations,
    evaluated_at: new Date().toISOString(),
  };
}
