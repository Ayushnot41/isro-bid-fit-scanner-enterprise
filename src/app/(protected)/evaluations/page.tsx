import type { BidEvaluation } from "@/lib/types/database";
import { EvaluationsVault } from "@/components/evaluations/evaluations-vault";
import { INITIAL_EVALUATIONS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default function EvaluationsPage() {
  const evaluations: BidEvaluation[] = INITIAL_EVALUATIONS;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">Evaluation Dossier Vault</h1>
        </div>
        <p className="text-zinc-400 text-sm font-mono">
          Archived and live streaming tender evaluations with compliance matrices and MSME waiver calculations.
        </p>
      </div>

      <EvaluationsVault initialEvaluations={evaluations} />
    </div>
  );
}
