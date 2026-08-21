import { createClient } from "@/lib/supabase/server";
import { evaluateBidFit } from "@/lib/evaluation/engine";
import { NextResponse } from "next/server";
import type { VendorProfile, ScrapedTender } from "@/lib/types/database";
import { DEMO_VENDOR_PROFILE, INITIAL_SCRAPED_TENDERS } from "@/lib/mock-data";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const isDemo = cookieStore.get("demo_session")?.value === "true";

    let user = null;
    let supabase = null;

    try {
      supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      user = data?.user || null;
    } catch {
      user = null;
    }

    if (!user && !isDemo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const tenderId = body.tender_id || body.tenderId;

    if (!tenderId) {
      return NextResponse.json({ error: "Missing tender_id" }, { status: 400 });
    }

    // 1. Fetch or fallback vendor profile
    let profile: VendorProfile = DEMO_VENDOR_PROFILE;
    if (supabase && user) {
      try {
        const { data: dbProfile } = await supabase
          .from("vendor_profiles")
          .select("*")
          .single();
        if (dbProfile) {
          profile = dbProfile as VendorProfile;
        }
      } catch {
        profile = DEMO_VENDOR_PROFILE;
      }
    }

    // 2. Fetch or fallback tender
    let tender: ScrapedTender | undefined;
    if (supabase) {
      try {
        const { data: dbTender } = await supabase
          .from("scraped_tenders")
          .select("*")
          .eq("id", tenderId)
          .single();
        if (dbTender) {
          tender = dbTender as ScrapedTender;
        }
      } catch {
        // fallback
      }
    }

    if (!tender) {
      tender = INITIAL_SCRAPED_TENDERS.find((t) => t.id === tenderId) ||
               INITIAL_SCRAPED_TENDERS.find((t) => t.reference_number === tenderId) ||
               INITIAL_SCRAPED_TENDERS[0];
    }

    // 3. Run evaluation
    const evaluation = evaluateBidFit(profile, tender);

    // 4. Try saving to DB if user & supabase are connected
    if (supabase && user) {
      try {
        await supabase.from("bid_evaluations").insert({
          user_id: user.id,
          tender_id: tender.id,
          tender_reference: evaluation.tender_reference,
          tender_title: evaluation.tender_title,
          tender_source_url: tender.source_url,
          issuing_center: tender.issuing_center,
          tender_mechanical_tolerances_met: evaluation.tender_mechanical_tolerances_met,
          missing_certifications: evaluation.missing_certifications,
          msme_waivers_applied: evaluation.msme_waivers_applied,
          final_bid_fit_score: evaluation.final_bid_fit_score,
          certification_score: evaluation.certification_score,
          tolerance_score: evaluation.tolerance_score,
          msme_score: evaluation.msme_score,
          turnover_score: evaluation.turnover_score,
          capability_score: evaluation.capability_score,
          evaluation_details: evaluation.evaluation_details,
          recommendations: evaluation.recommendations,
        });
      } catch (err) {
        console.warn("Could not insert to DB (offline/demo mode):", err);
      }
    }

    return NextResponse.json({
      success: true,
      evaluation,
      tender,
    });
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
