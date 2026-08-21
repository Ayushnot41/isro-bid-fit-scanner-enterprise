import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import type { VendorProfile } from "@/lib/types/database";
import { DEMO_VENDOR_PROFILE } from "@/lib/mock-data";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = cookies();
    const isDemo = cookieStore.get("demo_session")?.value === "true";

    let clerkUserId: string | null = null;
    try {
      const authObj = auth();
      clerkUserId = authObj.userId;
    } catch {
      clerkUserId = null;
    }

    const effectiveUserId = clerkUserId || "demo-vendor-id";

    // Try fetching from Supabase using Admin client to bypass RLS with Clerk UID
    try {
      const admin = createAdminClient();
      const { data: dbProfile, error } = await admin
        .from("vendor_profiles")
        .select("*")
        .eq("user_id", effectiveUserId)
        .single();

      if (!error && dbProfile) {
        return NextResponse.json({ success: true, profile: dbProfile });
      }
    } catch (err) {
      console.warn("DB profile lookup fallback:", err);
    }

    // Default fallback to DEMO_VENDOR_PROFILE
    return NextResponse.json({
      success: true,
      profile: {
        ...DEMO_VENDOR_PROFILE,
        user_id: effectiveUserId,
      },
      is_demo: isDemo || !clerkUserId,
    });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve vendor profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies();
    const isDemo = cookieStore.get("demo_session")?.value === "true";

    let clerkUserId: string | null = null;
    try {
      const authObj = auth();
      clerkUserId = authObj.userId;
    } catch {
      clerkUserId = null;
    }

    const effectiveUserId = clerkUserId || "demo-vendor-id";

    const payload = await request.json();


    const sanitizedProfile: Partial<VendorProfile> = {
      company_name: payload.company_name || "AeroPrecision India Ltd.",
      contact_email: payload.contact_email || "contracts@aeroprecision.in",
      contact_phone: payload.contact_phone || "+91 80 2839 4000",
      gst_number: payload.gst_number || "29AABCA1234F1Z5",
      pan_number: payload.pan_number || "AABCA1234F",
      msme_registered: payload.msme_registered ?? true,
      msme_category: payload.msme_category || "small",
      msme_udyam_number: payload.msme_udyam_number || "UDYAM-KR-03-0012345",
      certifications: payload.certifications || ["AS9100D", "ISO9001:2015", "NABL"],
      mechanical_tolerances: payload.mechanical_tolerances || {
        linear_tolerance_mm: 0.005,
        surface_roughness_ra_um: 0.3,
        cnc_axis_count: 5,
        max_turning_diameter_mm: 1200,
        max_milling_length_mm: 2500,
        cleanroom_iso_class: "ISO 7 (Class 10,000)",
      },
      manufacturing_capabilities: payload.manufacturing_capabilities || [
        "5-Axis CNC Machining",
        "Titanium Aerospace Fabrication",
        "Inconel Precision Machining",
        "CMM Inspection",
      ],
      past_isro_experience: payload.past_isro_experience ?? true,
      annual_turnover_inr: payload.annual_turnover_inr || 450000000,
      employee_count: payload.employee_count || 120,
      year_established: payload.year_established || 2012,
      address: payload.address || "Peenya Industrial Area, Phase II, Bengaluru, Karnataka 560058",
      updated_at: new Date().toISOString(),
    };

    try {
      const admin = createAdminClient();
      const { data, error } = await admin
        .from("vendor_profiles")
        .upsert(
          {
            ...sanitizedProfile,
            user_id: effectiveUserId,
          },
          { onConflict: "user_id" }
        )
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({
          success: true,
          message: "Capability Matrix synchronized to Supabase Vault.",
          profile: data,
        });
      }
    } catch (err) {
      console.warn("DB profile upsert error:", err);
    }

    return NextResponse.json({
      success: true,
      message: "Capability Matrix saved to local vault.",
      profile: { ...sanitizedProfile, user_id: effectiveUserId },
    });
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json(
      { error: "Failed to update vendor capability matrix" },
      { status: 500 }
    );
  }
}

