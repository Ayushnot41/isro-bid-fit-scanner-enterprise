import { createClient } from "@/lib/supabase/server";
import type { BidEvaluation } from "@/lib/types/database";
import { EvaluationsVault } from "@/components/evaluations/evaluations-vault";
import { INITIAL_EVALUATIONS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function EvaluationsPage() {
  let evaluations = INITIAL_EVALUATIONS;

  try {
    const fetchWithTimeout = async () => {
      const supabase = await createClient();
      const { data: dbEvaluations } = await supabase
        .from("bid_evaluations")
        .select("*")
        .order("evaluated_at", { ascending: false });

      if (dbEvaluations && dbEvaluations.length > 0) {
        evaluations = dbEvaluations as BidEvaluation[];
      }
    };

    // Fast 150ms race to ensure zero latency
    await Promise.race([
      fetchWithTimeout(),
      new Promise((resolve) => setTimeout(resolve, 150)),
    ]);
  } catch (err) {
    console.warn("Using fallback evaluations:", err);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Evaluation Dossier Vault</h1>
        </div>
        <p className="text-zinc-400 text-sm">
          Archived and live streaming tender evaluations with compliance matrices and MSME waiver calculations.
        </p>
      </div>

      <EvaluationsVault initialEvaluations={evaluations} />
    </div>
  );
}
