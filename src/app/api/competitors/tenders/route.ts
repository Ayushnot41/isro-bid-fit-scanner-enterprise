import { NextRequest, NextResponse } from "next/server";
import { CompetitorIntelligenceService } from "@/lib/intelligence/competitor-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vendor_id = searchParams.get("vendor_id") || undefined;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const tenders = await CompetitorIntelligenceService.getTenderHistory({
      vendor_id,
      status,
      search,
    });

    return NextResponse.json({
      success: true,
      count: tenders.length,
      data: tenders,
    });
  } catch (err: any) {
    console.error("[Competitor Tenders API GET Error]:", err);
    return NextResponse.json(
      { error: "Failed to fetch tender history", details: err?.message },
      { status: 500 }
    );
  }
}
