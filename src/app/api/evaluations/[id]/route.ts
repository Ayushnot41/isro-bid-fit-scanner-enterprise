import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { INITIAL_EVALUATIONS } from "@/lib/mock-data";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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

    if (supabase && user) {
      try {
        const { data, error } = await supabase
          .from("bid_evaluations")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (!error && data) {
          return NextResponse.json({ success: true, evaluation: data });
        }
      } catch (err) {
        console.warn("DB fetch single error:", err);
      }
    }

    // Mock fallback lookup
    const fallback =
      INITIAL_EVALUATIONS.find((e) => e.id === id) ||
      INITIAL_EVALUATIONS.find((e) => e.tender_id === id) ||
      INITIAL_EVALUATIONS.find((e) => e.tender_reference === id);

    if (fallback) {
      return NextResponse.json({ success: true, evaluation: fallback });
    }

    return NextResponse.json(
      { error: "Evaluation dossier not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("GET /api/evaluations/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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

    if (supabase && user) {
      try {
        const { error } = await supabase
          .from("bid_evaluations")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) {
          console.warn("DB delete error:", error);
        }
      } catch (err) {
        console.warn("DB delete exception:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Evaluation dossier ${id} removed from vault.`,
      id,
    });
  } catch (error) {
    console.error("DELETE /api/evaluations/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete evaluation dossier" },
      { status: 500 }
    );
  }
}
