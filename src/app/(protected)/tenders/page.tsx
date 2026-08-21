import { createClient } from "@/lib/supabase/server";
import type { ScrapedTender, BidEvaluation } from "@/lib/types/database";
import { TenderList } from "@/components/tenders/tender-list";
import { INITIAL_SCRAPED_TENDERS, INITIAL_EVALUATIONS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function TendersPage() {
  let tenders = INITIAL_SCRAPED_TENDERS;
  let evaluations = INITIAL_EVALUATIONS;

  try {
    const fetchWithTimeout = async () => {
      const supabase = await createClient();
      const [tendersRes, evalsRes] = await Promise.all([
        supabase
          .from("scraped_tenders")
          .select("*")
          .eq("is_active", true)
          .order("closing_date", { ascending: true }),
        supabase.from("bid_evaluations").select("*"),
      ]);

      if (tendersRes.data && tendersRes.data.length > 0) {
        tenders = tendersRes.data as ScrapedTender[];
      }
      if (evalsRes.data && evalsRes.data.length > 0) {
        evaluations = evalsRes.data as BidEvaluation[];
      }
    };

    // Fast 150ms race to ensure zero latency
    await Promise.race([
      fetchWithTimeout(),
      new Promise((resolve) => setTimeout(resolve, 150)),
    ]);
  } catch (err) {
    console.warn("Using fallback tenders:", err);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-2xl font-bold text-white">ISRO Procurement Catalog</h1>
          </div>
          <p className="text-zinc-400 text-sm">
            Live tender opportunities from VSSC, URSC, SAC, SDSC SHAR, IPRC & LPSC
          </p>
        </div>
      </div>

      <TenderList tenders={tenders} evaluations={evaluations} />
    </div>
  );
}
