import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { BidEvaluation } from "@/lib/types/database";
import { INITIAL_EVALUATIONS } from "@/lib/mock-data";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
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

    let evaluations: BidEvaluation[] = INITIAL_EVALUATIONS;

    if (supabase && user) {
      try {
        const { data: dbEvaluations } = await supabase
          .from("bid_evaluations")
          .select("*")
          .eq("user_id", user.id)
          .order("evaluated_at", { ascending: false });

        if (dbEvaluations && dbEvaluations.length > 0) {
          evaluations = dbEvaluations as BidEvaluation[];
        }
      } catch (err) {
        console.warn("DB export fallback:", err);
      }
    }

    const headers = [
      "Evaluation ID",
      "Tender Reference",
      "Tender Title",
      "Center",
      "Final Fit Score (%)",
      "Tolerance Score (%)",
      "Cert Score (%)",
      "MSME Score (%)",
      "Tolerances Met",
      "MSME Waivers Applied",
      "Missing Certifications",
      "Evaluated At",
    ].join(",");

    const rows = evaluations.map((e) => {
      return [
        `"${e.id}"`,
        `"${e.tender_reference}"`,
        `"${(e.tender_title || "").replace(/"/g, '""')}"`,
        `"${e.issuing_center || "VSSC"}"`,
        e.final_bid_fit_score,
        e.tolerance_score || 0,
        e.certification_score || 0,
        e.msme_score || 0,
        e.tender_mechanical_tolerances_met ? "YES" : "NO",
        `"${e.msme_waivers_applied.join("; ")}"`,
        `"${e.missing_certifications.join("; ")}"`,
        `"${e.evaluated_at}"`,
      ].join(",");
    });

    const csvContent = [headers, ...rows].join("\n");

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="isro_evaluation_vault_export_${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error("GET /api/evaluations/export error:", error);
    return NextResponse.json(
      { error: "Failed to generate CSV export" },
      { status: 500 }
    );
  }
}
