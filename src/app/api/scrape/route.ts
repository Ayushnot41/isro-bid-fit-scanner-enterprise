import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  scrapeISROTenders,
  transformToTenderInsert,
} from "@/lib/scraper/isro-tenders";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
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

    const rawTenders = await scrapeISROTenders();
    const tenderInserts = rawTenders.map(transformToTenderInsert);

    // Try saving to DB if admin key is configured
    try {
      const admin = createAdminClient();
      await admin
        .from("scraped_tenders")
        .upsert(tenderInserts, { onConflict: "reference_number" });
    } catch (err) {
      console.warn("Could not upsert tenders to DB (offline/demo mode):", err);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${rawTenders.length} ISRO tenders from eproc.isro.gov.in`,
      count: rawTenders.length,
      tenders: rawTenders,
    });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
