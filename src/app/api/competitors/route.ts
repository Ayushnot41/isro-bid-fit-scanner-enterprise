import { NextRequest, NextResponse } from "next/server";
import { CompetitorIntelligenceService } from "@/lib/intelligence/competitor-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendor_id");
    const search = searchParams.get("search") || undefined;
    const type = searchParams.get("type") || undefined;

    if (vendorId) {
      const vendor = await CompetitorIntelligenceService.getVendorById(vendorId);
      if (!vendor) {
        return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: vendor });
    }

    const vendors = await CompetitorIntelligenceService.getAllVendors({ search, type });
    return NextResponse.json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (err: any) {
    console.error("[Competitor API GET Error]:", err);
    return NextResponse.json(
      { error: "Failed to fetch competitor intelligence", details: err?.message },
      { status: 500 }
    );
  }
}
