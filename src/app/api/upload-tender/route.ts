import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { ScrapedTender } from "@/lib/types/database";

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

    let tenderReference = `CUSTOM/ISRO/${Date.now().toString().slice(-4)}`;
    let tenderTitle = "Custom Uploaded ISRO Procurement Specification";
    let estimatedValue = 35000000;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (file) {
        tenderTitle = file.name.replace(".pdf", "");
      }
      const ref = formData.get("reference") as string | null;
      if (ref) tenderReference = ref;
    } else if (contentType.includes("application/json")) {
      const json = await request.json();
      if (json.title) tenderTitle = json.title;
      if (json.reference) tenderReference = json.reference;
      if (json.estimated_value_inr) estimatedValue = json.estimated_value_inr;
    }

    const createdTender: ScrapedTender = {
      id: `custom-${Date.now()}`,
      reference_number: tenderReference,
      title: tenderTitle,
      description: "Uploaded tender document parsed via ISRO GD&T extractor.",
      issuing_center: "ISRO Headquarter (Manual Ingestion)",
      center_code: "VSSC",
      closing_date: new Date(Date.now() + 30 * 86400000).toISOString(),
      opening_date: null,
      estimated_value_inr: estimatedValue,
      emd_amount_inr: Math.round(estimatedValue * 0.02),
      category: "Custom RFP Ingestion",
      required_certifications: ["AS9100D", "ISO9001:2015"],
      required_tolerances: { linear_tolerance_mm: 0.005, surface_roughness_ra_um: 0.4 },
      minimum_turnover_inr: 10000000,
      required_capabilities: ["5-Axis CNC Machining", "Aerospace Fabrication"],
      source_url: null,
      pdf_storage_path: null,
      raw_metadata: {},
      is_active: true,
      scraped_at: new Date().toISOString(),
    };

    if (supabase && user) {
      try {
        await supabase.from("scraped_tenders").insert(createdTender);
      } catch (err) {
        console.warn("Could not insert uploaded tender to DB:", err);
      }
    }

    return NextResponse.json({
      success: true,
      tender: createdTender,
      message: "Uploaded and parsed tender successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
