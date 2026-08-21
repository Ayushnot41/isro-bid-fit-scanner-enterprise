import { NextResponse } from "next/server";
import { evaluateBidFit } from "@/lib/evaluation/engine";
import { INITIAL_SCRAPED_TENDERS, DEMO_VENDOR_PROFILE } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";
import type { VendorProfile, ScrapedTender } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Merge submitted payload over the demo baseline so all fields are populated
    const testProfile: VendorProfile = {
      ...DEMO_VENDOR_PROFILE,
      ...payload,
      mechanical_tolerances: {
        ...DEMO_VENDOR_PROFILE.mechanical_tolerances,
        ...(payload.mechanical_tolerances || {}),
      },
      certifications: Array.isArray(payload.certifications)
        ? payload.certifications
        : DEMO_VENDOR_PROFILE.certifications,
      manufacturing_capabilities: Array.isArray(payload.manufacturing_capabilities)
        ? payload.manufacturing_capabilities
        : DEMO_VENDOR_PROFILE.manufacturing_capabilities,
      msme_registered: payload.msme_registered ?? DEMO_VENDOR_PROFILE.msme_registered,
      msme_category: payload.msme_category ?? DEMO_VENDOR_PROFILE.msme_category,
      msme_udyam_number: payload.msme_udyam_number ?? DEMO_VENDOR_PROFILE.msme_udyam_number,
      annual_turnover_inr:
        typeof payload.annual_turnover_inr === "number"
          ? payload.annual_turnover_inr
          : DEMO_VENDOR_PROFILE.annual_turnover_inr,
    };

    // Try fetching live tenders from Supabase, fall back to mock
    let tenders: ScrapedTender[] = INITIAL_SCRAPED_TENDERS;
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("scraped_tenders")
        .select("*")
        .eq("is_active", true)
        .order("closing_date", { ascending: true });

      if (data && data.length > 0) {
        tenders = data as ScrapedTender[];
      }
    } catch {
      // Use mock fallback silently
    }

    // Run evaluation for every tender against the test profile
    const simulatedResults = tenders.map((tender) => {
      const evaluation = evaluateBidFit(testProfile, tender);
      return {
        tender_id: tender.id,
        tender_reference: tender.reference_number,
        tender_title: tender.title,
        issuing_center: tender.issuing_center,
        estimated_value_inr: tender.estimated_value_inr ?? 0,
        final_bid_fit_score: evaluation.final_bid_fit_score,
        certification_score: evaluation.certification_score,
        tolerance_score: evaluation.tolerance_score,
        msme_score: evaluation.msme_score,
        turnover_score: evaluation.turnover_score,
        capability_score: evaluation.capability_score,
        tolerance_met: evaluation.tender_mechanical_tolerances_met,
        missing_certs: evaluation.missing_certifications,
        msme_waivers_applied: evaluation.msme_waivers_applied,
        is_qualified: evaluation.final_bid_fit_score >= 70,
        recommendations: evaluation.recommendations,
      };
    });

    // Sort: qualified first, then by score desc
    simulatedResults.sort((a, b) => {
      if (a.is_qualified !== b.is_qualified) return a.is_qualified ? -1 : 1;
      return b.final_bid_fit_score - a.final_bid_fit_score;
    });

    const qualifiedCount = simulatedResults.filter((r) => r.is_qualified).length;
    const totalTenders = simulatedResults.length;
    const avgScore =
      totalTenders > 0
        ? simulatedResults.reduce((acc, curr) => acc + curr.final_bid_fit_score, 0) / totalTenders
        : 0;

    const totalOpportunityValue = simulatedResults
      .filter((r) => r.is_qualified)
      .reduce((acc, curr) => acc + (curr.estimated_value_inr || 0), 0);

    return NextResponse.json({
      success: true,
      simulation: {
        total_tenders: totalTenders,
        qualified_tenders_count: qualifiedCount,
        qualification_rate: `${Math.round((qualifiedCount / Math.max(totalTenders, 1)) * 100)}%`,
        average_fit_score: Math.round(avgScore),
        total_accessible_value_inr: totalOpportunityValue,
        results: simulatedResults,
      },
    });
  } catch (error) {
    console.error("POST /api/profile/simulate error:", error);
    return NextResponse.json(
      { error: "Failed to simulate capability matrix" },
      { status: 500 }
    );
  }
}
