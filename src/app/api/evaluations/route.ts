import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { BidEvaluation } from "@/lib/types/database";
import { INITIAL_EVALUATIONS } from "@/lib/mock-data";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scoreFilter = searchParams.get("scoreFilter") || "ALL";
    const search = (searchParams.get("search") || "").toLowerCase();
    const center = searchParams.get("center") || "ALL";
    const sort = searchParams.get("sort") || "latest";

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

    let evaluations: BidEvaluation[] = [];

    // 1. If connected to Supabase and authenticated user exists
    if (supabase && user) {
      try {
        let query = supabase
          .from("bid_evaluations")
          .select("*")
          .eq("user_id", user.id);

        if (scoreFilter === "HIGH") {
          query = query.gte("final_bid_fit_score", 75);
        } else if (scoreFilter === "MODERATE") {
          query = query.gte("final_bid_fit_score", 50).lt("final_bid_fit_score", 75);
        } else if (scoreFilter === "LOW") {
          query = query.lt("final_bid_fit_score", 50);
        }

        if (sort === "score_desc") {
          query = query.order("final_bid_fit_score", { ascending: false });
        } else if (sort === "score_asc") {
          query = query.order("final_bid_fit_score", { ascending: true });
        } else {
          query = query.order("evaluated_at", { ascending: false });
        }

        const { data: dbEvaluations, error } = await query;

        if (!error && dbEvaluations && dbEvaluations.length > 0) {
          evaluations = dbEvaluations as BidEvaluation[];
        } else {
          evaluations = INITIAL_EVALUATIONS;
        }
      } catch (err) {
        console.warn("DB query fallback:", err);
        evaluations = INITIAL_EVALUATIONS;
      }
    } else {
      // 2. Demo / Fallback mode
      evaluations = INITIAL_EVALUATIONS;
    }

    // Apply in-memory filtering for search & center parameters
    let filtered = evaluations.filter((e) => {
      const matchSearch =
        search === "" ||
        (e.tender_title || "").toLowerCase().includes(search) ||
        e.tender_reference.toLowerCase().includes(search) ||
        (e.issuing_center || "").toLowerCase().includes(search);

      const matchCenter =
        center === "ALL" ||
        (e.issuing_center || "").toLowerCase().includes(center.toLowerCase()) ||
        e.tender_reference.toLowerCase().startsWith(center.toLowerCase());

      const matchScore =
        scoreFilter === "ALL" ||
        (scoreFilter === "HIGH" && e.final_bid_fit_score >= 75) ||
        (scoreFilter === "MODERATE" && e.final_bid_fit_score >= 50 && e.final_bid_fit_score < 75) ||
        (scoreFilter === "LOW" && e.final_bid_fit_score < 50);

      return matchSearch && matchCenter && matchScore;
    });

    if (sort === "score_desc") {
      filtered.sort((a, b) => b.final_bid_fit_score - a.final_bid_fit_score);
    } else if (sort === "score_asc") {
      filtered.sort((a, b) => a.final_bid_fit_score - b.final_bid_fit_score);
    } else {
      filtered.sort(
        (a, b) => new Date(b.evaluated_at).getTime() - new Date(a.evaluated_at).getTime()
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      total: evaluations.length,
      evaluations: filtered,
    });
  } catch (error) {
    console.error("GET /api/evaluations error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve evaluations" },
      { status: 500 }
    );
  }
}

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

    const payload = await request.json();

    if (!payload.tender_reference) {
      return NextResponse.json(
        { error: "Missing required field: tender_reference" },
        { status: 400 }
      );
    }

    const newEvaluation: Partial<BidEvaluation> = {
      id: payload.id || `eval_${Date.now()}`,
      user_id: user?.id || "demo-vendor-id",
      tender_id: payload.tender_id || null,
      tender_reference: payload.tender_reference,
      tender_title: payload.tender_title || "ISRO Tender Specification Evaluation",
      tender_source_url: payload.tender_source_url || null,
      issuing_center: payload.issuing_center || "VSSC",
      tender_mechanical_tolerances_met: payload.tender_mechanical_tolerances_met ?? true,
      missing_certifications: payload.missing_certifications || [],
      msme_waivers_applied: payload.msme_waivers_applied || ["100% EMD Exemption (GFR 2017)"],
      final_bid_fit_score: payload.final_bid_fit_score ?? 85,
      certification_score: payload.certification_score ?? 90,
      tolerance_score: payload.tolerance_score ?? 95,
      msme_score: payload.msme_score ?? 100,
      turnover_score: payload.turnover_score ?? 80,
      capability_score: payload.capability_score ?? 85,
      evaluation_details: payload.evaluation_details || {},
      recommendations: payload.recommendations || [
        "Attach UDYAM Registration Certificate for Rule 170(i) EMD exemption.",
        "Ensure CMM 3D dimensional report is submitted with technical bid.",
      ],
      evaluated_at: new Date().toISOString(),
    };

    if (supabase && user) {
      try {
        const { data, error } = await supabase
          .from("bid_evaluations")
          .insert(newEvaluation)
          .select()
          .single();

        if (!error && data) {
          return NextResponse.json({ success: true, evaluation: data }, { status: 201 });
        }
      } catch (err) {
        console.warn("DB insert error, returning memory record:", err);
      }
    }

    return NextResponse.json({ success: true, evaluation: newEvaluation }, { status: 201 });
  } catch (error) {
    console.error("POST /api/evaluations error:", error);
    return NextResponse.json(
      { error: "Failed to create evaluation" },
      { status: 500 }
    );
  }
}
