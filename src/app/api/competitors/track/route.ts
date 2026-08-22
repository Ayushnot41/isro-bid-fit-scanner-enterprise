import { NextRequest, NextResponse } from "next/server";
import { CompetitorIntelligenceService } from "@/lib/intelligence/competitor-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const demoUser = req.cookies.get("demo_session")?.value;
    const userId = demoUser ? "aeroprecision-msme" : "anonymous-user";

    const body = await req.json();
    const { vendor_id, vendor_name } = body;

    if (!vendor_id) {
      return NextResponse.json({ error: "Missing vendor_id" }, { status: 400 });
    }

    const result = await CompetitorIntelligenceService.toggleTrackCompetitor(
      userId,
      vendor_id,
      vendor_name || vendor_id
    );

    return NextResponse.json({
      success: true,
      tracked: result.tracked,
      vendor_id,
    });
  } catch (err: any) {
    console.error("[Competitor Track API POST Error]:", err);
    return NextResponse.json(
      { error: "Failed to toggle tracking", details: err?.message },
      { status: 500 }
    );
  }
}
